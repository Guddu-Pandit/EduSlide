import OpenAI from "openai";
import type { DocumentFileType, GeneratedDeck, SlideType } from "./types";

// Generous but bounded — keeps prompt size (and cost) predictable for very
// large source documents while still giving the model enough material.
const MAX_SOURCE_CHARS = 16000;

const PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search";
const UNSPLASH_SEARCH_URL = "https://api.unsplash.com/search/photos";

// Tried in order when the one before is rate-limited or unavailable. All
// three are verified to return strict JSON in json_object mode — some Gemini
// models (e.g. gemini-3.5-flash) wrap the JSON in extra text and break
// parsing, so don't add models here without checking that first.
const FALLBACK_MODELS = [
  "gemini-flash-latest",
  "gemini-3-flash-preview",
  "gemini-flash-lite-latest",
];

// Env vars holding API keys, in priority order. Every model is exhausted on
// one key before the next key is touched.
const KEY_ENV_VARS = ["GEMINI_API_KEY", "GEMINI_API_KEY_2"];

/**
 * Only capacity errors may trigger fallback: 429 (rate limit / quota —
 * Gemini's RESOURCE_EXHAUSTED surfaces as 429 through the OpenAI-compat
 * layer) and 503 (model overloaded). Anything else — bad request, safety
 * block, auth — is a real error and must propagate immediately.
 */
function isLimitError(err: unknown): boolean {
  return err instanceof OpenAI.APIError && (err.status === 429 || err.status === 503);
}

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

/** Thrown when the AI provider rejects the request with a 429 (quota or rate limit). */
export class GenerationLimitError extends Error {}

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

/**
 * Length limits below mirror the pptx renderer's fixed text boxes (pptx.ts):
 * titles get ~2 lines before clipping, the bullet area fits ~10 lines at
 * 16pt, and the title layout renders no bullets at all.
 */
function buildSystemPrompt(maxSlides: number): string {
  return [
    "You are an expert presentation designer and storyteller. Convert the source document into a slide deck outline for a presentation tool.",
    "",
    "OUTPUT FORMAT",
    'Respond with strict JSON only, in this exact shape: {"slides":[{"slideType":string,"title":string,"bullets":string[],"notes":string,"imageQuery":string}]}. No markdown, no commentary, nothing outside the JSON object.',
    "",
    `DECK STRUCTURE — produce exactly ${maxSlides} slide${maxSlides === 1 ? "" : "s"}. This is a hard limit from the user's plan; never exceed it.`,
    '- Slide 1 is always slideType "title". Its `title` is the deck title: a compelling, specific headline of at most 10 words capturing the document\'s core message. Its `bullets` MUST be an empty array — the title layout renders no bullets.',
    `${maxSlides >= 3 ? '- The last slide is slideType "summary": distill the 2-4 takeaways the audience must remember, and end with one forward-looking implication or clear call to action.' : "- With so few slides, pick only the single most important point from the source."}`,
    '- Use "data" for any slide built around a statistic, metric, or comparison from the source; its first bullet must state the key number plainly. Use "content" for everything else. If the source has no real data, use "content" — never invent numbers.',
    "- The deck must read as one continuous story: open with the problem or context, develop the specifics in the middle, resolve at the end. Each slide advances the argument; never repeat a point across slides.",
    "",
    "SLIDE WRITING RULES",
    '- `title`: a specific claim or finding the slide substantiates, phrased as an assertive headline of at most 12 words (e.g. "Renewable adoption cut grid costs 30% in five years", not "Renewable Energy"). Keep titles parallel in tone across the deck.',
    "- `bullets`: 3-4 per slide (5 only when truly needed). Each is one complete sentence of at most 22 words, packed with specifics from the source — numbers, names, dates, causes. Bullets build on each other in logical order and together prove the title's claim. Never restate the title or another bullet.",
    "- `notes`: 2-4 sentences the presenter speaks aloud beyond what is on the slide — background, an example, an anecdote, or a transition into the next slide. Never restate or rephrase the bullets.",
    '- `imageQuery`: a 3-5 word stock-photo search for a real, literal photograph (no illustrations, abstract concepts, or text-heavy images) that visually matches the slide, e.g. "solar panels on rooftop". For the title slide choose a wide, atmospheric scene that works as a full-bleed background behind large text.',
    "",
    "STYLE",
    "- Ground every statement in the source document; never fabricate facts, quotes, or statistics.",
    "- Write in the same language as the source document.",
    "- Match the tone to the requested template style: corporate → crisp business language; academic → precise and measured; minimal → short and punchy; edu-blue / edu-green → clear and friendly for learners; high-contrast → direct and plain.",
  ].join("\n");
}

/** Which key + model actually served the request, for logging. */
export interface GenerationMeta {
  /** Env var name of the key that succeeded (never the key itself). */
  apiKeyName: string;
  model: string;
}

export interface GenerationResult {
  deck: GeneratedDeck;
  meta: GenerationMeta;
}

export async function generateDeck(
  sourceText: string,
  template: string,
  maxSlides: number,
): Promise<GenerationResult> {
  // Gemini, via its OpenAI-compatible endpoint — same SDK, different baseURL.
  const apiKeys = KEY_ENV_VARS.map((name) => ({ name, key: process.env[name] })).filter(
    (entry): entry is { name: string; key: string } => Boolean(entry.key),
  );
  if (apiKeys.length === 0) throw new Error("GEMINI_API_KEY is not configured");

  // GEMINI_MODEL (if set) is tried first, then the built-in fallback chain.
  const envModel = process.env.GEMINI_MODEL;
  const models = envModel
    ? [envModel, ...FALLBACK_MODELS.filter((m) => m !== envModel)]
    : FALLBACK_MODELS;

  // Previous direct-OpenAI setup — uncomment (and remove the Gemini block
  // above) to switch back:
  // const apiKey = process.env.OPENAI_API_KEY;
  // if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  // const client = new OpenAI({ apiKey });
  // const model = process.env.OPENAI_MODEL || "gpt-4o";

  const trimmed = sourceText.slice(0, MAX_SOURCE_CHARS);

  // Fallback ladder: exhaust every model on one key before moving to the
  // next key (limits are usually per key/project, so a fresh key resets the
  // whole model chain). Models that 404 are dead for every key.
  let completion: OpenAI.Chat.Completions.ChatCompletion | undefined;
  let meta: GenerationMeta | undefined;
  let sawRateLimit = false;
  const deadModels = new Set<string>();

  outer: for (const { name: apiKeyName, key: apiKey } of apiKeys) {
    const client = new OpenAI({
      apiKey,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    for (const model of models) {
      if (deadModels.has(model)) continue;

      try {
        completion = await client.chat.completions.create({
          model,
          response_format: { type: "json_object" },
          temperature: 0.4,
          messages: [
            {
              role: "system",
              content: buildSystemPrompt(maxSlides),
            },
            {
              role: "user",
              content: `Template style: ${template}\n\nSource document:\n${trimmed}`,
            },
          ],
        });
        meta = { apiKeyName, model };
        break outer;
      } catch (err) {
        if (isLimitError(err)) {
          // Quota / rate limit / overloaded — next model on the same key.
          sawRateLimit = true;
          continue;
        }
        if (err instanceof OpenAI.APIError && err.status === 404) {
          // Model retired or not offered to this account — dead everywhere.
          deadModels.add(model);
          continue;
        }
        throw err;
      }
    }
  }

  if (!completion || !meta) {
    if (sawRateLimit) {
      throw new GenerationLimitError(
        "AI limit exceeded — every configured model and API key hit its quota or rate limit. Wait a minute and retry.",
      );
    }
    throw new Error("None of the configured models are available to this API key");
  }

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
    deck: {
      slides: parsed.slides.map((slide, i) => ({
        slideType: normalizeSlideType(slide.slideType),
        title: slide.title,
        bullets: slide.bullets ?? [],
        notes: slide.notes ?? "",
        imageQuery: slide.imageQuery ?? slide.title,
        imageUrl: imageUrls[i],
      })),
    },
    meta,
  };
}
