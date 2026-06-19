import OpenAI from "openai";
import type { DocumentFileType, GeneratedDeck } from "./types";

// Generous but bounded — keeps prompt size (and cost) predictable for very
// large source documents while still giving the model enough material.
const MAX_SOURCE_CHARS = 16000;

export async function extractText(buffer: Buffer, fileType: DocumentFileType): Promise<string> {
  if (fileType === "pdf") {
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
          'Respond with strict JSON only, in this exact shape: {"slides":[{"title":string,"bullets":string[],"notes":string}]}. ' +
          `Produce exactly ${maxSlides} slide${maxSlides === 1 ? "" : "s"} total — this is a hard limit from the user's plan, do not exceed it. ` +
          "The first slide is a title slide (bullets can be empty). If the count allows, end with a brief summary/closing slide. " +
          "Each other slide needs a short title and 2-5 concise bullets (max ~14 words each). " +
          "Put a 1-2 sentence speaker note in `notes` for each slide.",
      },
      {
        role: "user",
        content: `Template style: ${template}\n\nSource document:\n${trimmed}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("The model returned no content");

  let parsed: GeneratedDeck;
  try {
    parsed = JSON.parse(raw) as GeneratedDeck;
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

  return parsed;
}
