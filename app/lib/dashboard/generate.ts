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

export async function generateDeck(sourceText: string, template: string): Promise<GeneratedDeck> {
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
          "Produce 6 to 14 slides. The first slide is a title slide (bullets can be empty). " +
          "Each other slide needs a short title and 3-5 concise bullets (max ~14 words each). " +
          "Put a 1-2 sentence speaker note in `notes` for each slide. End with a brief summary/closing slide.",
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

  return parsed;
}
