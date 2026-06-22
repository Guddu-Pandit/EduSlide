import OpenAI from "openai";
import type { DocumentFileType, GeneratedDeck, SlideType } from "./types";

// Generous but bounded — keeps prompt size (and cost) predictable for very
// large source documents while still giving the model enough material.
const MAX_SOURCE_CHARS = 16000;

const PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search";
const UNSPLASH_SEARCH_URL = "https://api.unsplash.com/search/photos";

interface ModelSlide {
  slideType?: string;
  title: string;
  bullets: string[];
  notes?: string;
  imageQuery?: string;
}

interface ModelDeck {
  slides: ModelSlide[];
}

const VALID_SLIDE_TYPES: SlideType[] = ["title", "content", "data", "summary"];

function normalizeSlideType(value: string | undefined): SlideType {
  return VALID_SLIDE_TYPES.includes(value as SlideType) ? (value as SlideType) : "content";
}

let pdfWorkerConfigured = false;

/**
 * pdfjs-dist's Node "fake worker" path checks `globalThis.pdfjsWorker` for a
 * pre-loaded WorkerMessageHandler before falling back to a runtime
 * `import(workerSrc)` call — and that fallback breaks under Turbopack, which
 * instruments dynamic imports even when the target is a fully-resolved path
 * computed at runtime. Pre-populating the escape hatch via a literal static
 * import (which Turbopack bundles normally, like any other import) means
 * pdfjs never reaches its own broken dynamic import.
 */
async function configurePdfWorker(): Promise<void> {
  if (pdfWorkerConfigured) return;
  pdfWorkerConfigured = true;

  // @ts-expect-error — pdfjs-dist ships no type declarations for this subpath.
  const pdfjsWorker = await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
  (globalThis as typeof globalThis & { pdfjsWorker?: unknown }).pdfjsWorker = pdfjsWorker;
}

export async function extractText(buffer: Buffer, fileType: DocumentFileType): Promise<string> {
  if (fileType === "pdf") {
    await configurePdfWorker();
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  if (fileType === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  return buffer.toString("utf-8");
}

/** Pexels is tried first. Returns null (never throws) on missing key, no results, or any failure. */
async function fetchPexelsImage(query: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${PEXELS_SEARCH_URL}?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: { Authorization: apiKey },
    });
    if (!res.ok) return null;

    const data = await res.json();
    return data?.photos?.[0]?.src?.large ?? null;
  } catch {
    return null;
  }
}

/** Fallback when Pexels has no key, no results, or fails. Same never-throws contract. */
async function fetchUnsplashImage(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const res = await fetch(`${UNSPLASH_SEARCH_URL}?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });
    if (!res.ok) return null;

    const data = await res.json();
    return data?.results?.[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

async function resolveImageUrl(query: string): Promise<string | null> {
  const pexelsResult = await fetchPexelsImage(query);
  if (pexelsResult) return pexelsResult;

  const unsplashResult = await fetchUnsplashImage(query);
  if (unsplashResult) return unsplashResult;

  return null;
}

export async function generateDeck(
  sourceText: string,
  template: string,
  maxSlides: number,
): Promise<GeneratedDeck> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const trimmed = sourceText.slice(0, MAX_SOURCE_CHARS);

  const completion = await client.chat.completions.create({
    model,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You convert source documents into slide deck outlines for a presentation tool. " +
          'Respond with strict JSON only, in this exact shape: {"slides":[{"slideType":string,"title":string,"bullets":string[],"notes":string,"imageQuery":string}]}. ' +
          `Produce exactly ${maxSlides} slide${maxSlides === 1 ? "" : "s"} total — this is a hard limit from the user's plan, do not exceed it. ` +
          '`slideType` must be one of "title", "content", "data", "summary". The first slide is always "title" (bullets can be empty). If the count allows, end with a "summary" slide. Use "data" for any slide built around a statistic, metric, or comparison drawn from the source, and "content" for everything else. ' +
          "`title` must be a specific claim or finding the slide supports, not a generic topic label — phrase it like a headline asserting something (e.g. \"Renewable adoption cut grid costs 30% in five years\", not \"Renewable Energy\"). " +
          "`bullets` must be 2-5 complete sentences, not fragments, that build on each other in a logical sequence and together substantiate the title's claim with specifics from the source. " +
          "`notes` is what the presenter would say out loud in addition to what's on the slide — context, transitions, examples, or framing. Never restate or rephrase the bullets. " +
          "`imageQuery` is a 3-5 word search term describing a real, literal photograph (not an illustration or abstract concept) that visually represents the slide, suitable for a stock photo search — e.g. \"solar panels on rooftop\".",
      },
      {
        role: "user",
        content: `Template style: ${template}\n\nSource document:\n${trimmed}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("The model returned no content");

  let parsed: ModelDeck;
  try {
    parsed = JSON.parse(raw) as ModelDeck;
  } catch {
    throw new Error("The model returned invalid JSON");
  }

  if (!Array.isArray(parsed.slides) || parsed.slides.length === 0) {
    throw new Error("The model returned no slides");
  }

  // Enforce the plan cap in code too, in case the model overshoots.
  if (parsed.slides.length > maxSlides) {
    parsed.slides = parsed.slides.slice(0, maxSlides);
  }

  const imageUrls = await Promise.all(
    parsed.slides.map((slide) => resolveImageUrl(slide.imageQuery || slide.title)),
  );

  return {
    slides: parsed.slides.map((slide, i) => ({
      slideType: normalizeSlideType(slide.slideType),
      title: slide.title,
      bullets: slide.bullets ?? [],
      notes: slide.notes ?? "",
      imageQuery: slide.imageQuery ?? slide.title,
      imageUrl: imageUrls[i],
    })),
  };
}
