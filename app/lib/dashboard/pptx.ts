import PptxGenJS from "pptxgenjs";
import type { GeneratedDeck, GeneratedSlide, SlideType } from "./types";
import { TEMPLATES } from "./templates";

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const BRAND_HEX = "1D9E75";

const SLIDE_TYPE_LABEL: Record<SlideType, string> = {
  title: "Title slide",
  content: "",
  data: "Data",
  summary: "Summary",
};

function hexColor(value: string): string {
  if (value.startsWith("var(--brand)")) return BRAND_HEX;
  if (value.startsWith("#")) return value.slice(1).toUpperCase();

  const rgba = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgba) {
    const [, r, g, b] = rgba;
    return [r, g, b].map((c) => Number(c).toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  return "000000";
}

/** Fetches a remote image and inlines it as a data URI; never throws — a failed fetch just means no image on the slide. */
async function fetchImageData(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

function addTitleSlide(pptx: PptxGenJS, slide: GeneratedSlide, imageData: string | null, titleColor: string, accentColor: string) {
  const pSlide = pptx.addSlide();

  if (imageData) {
    pSlide.addImage({ data: imageData, x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, sizing: { type: "cover", w: SLIDE_W, h: SLIDE_H } });
    pSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: SLIDE_W,
      h: SLIDE_H,
      fill: { color: "000000", transparency: 45 },
      line: { type: "none" },
    });
  }

  pSlide.addText(SLIDE_TYPE_LABEL.title, {
    x: 0.6,
    y: 5.5,
    w: SLIDE_W - 1.2,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: imageData ? "FFFFFF" : hexColor(accentColor),
    charSpacing: 1,
  });
  pSlide.addText(slide.title, {
    x: 0.6,
    y: 5.9,
    w: SLIDE_W - 1.2,
    h: 1.3,
    fontSize: 34,
    bold: true,
    color: imageData ? "FFFFFF" : hexColor(titleColor),
    valign: "top",
  });

  return pSlide;
}

function addContentSlide(
  pptx: PptxGenJS,
  slide: GeneratedSlide,
  imageData: string | null,
  index: number,
  titleColor: string,
  bodyColor: string,
  accentColor: string,
) {
  const pSlide = pptx.addSlide();
  const hasImage = Boolean(imageData);
  const textW = hasImage ? 7.6 : SLIDE_W - 1.2;

  if (hasImage) {
    pSlide.addImage({
      data: imageData!,
      x: 9.0,
      y: 0.6,
      w: 3.73,
      h: 6.3,
      sizing: { type: "cover", w: 3.73, h: 6.3 },
    });
  }

  const label = [`Slide ${index + 1}`, SLIDE_TYPE_LABEL[slide.slideType]].filter(Boolean).join("  ·  ");
  pSlide.addText(label.toUpperCase(), {
    x: 0.6,
    y: 0.45,
    w: textW,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: hexColor(accentColor),
    charSpacing: 1,
  });

  pSlide.addText(slide.title, {
    x: 0.6,
    y: 0.85,
    w: textW,
    h: 1.0,
    fontSize: 24,
    bold: true,
    color: hexColor(titleColor),
  });

  if (slide.bullets.length > 0) {
    pSlide.addText(
      slide.bullets.map((bullet) => ({ text: bullet, options: { bullet: { code: "2022" }, breakLine: true } })),
      {
        x: 0.6,
        y: 1.95,
        w: textW,
        h: 4.9,
        fontSize: 16,
        color: hexColor(bodyColor),
        valign: "top",
        paraSpaceAfter: 10,
      },
    );
  }

  return pSlide;
}

export async function buildPptxBuffer(deck: GeneratedDeck, templateId: string): Promise<Buffer> {
  const template = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
  const pptx = new PptxGenJS();

  pptx.defineLayout({ name: "EDU_WIDE", width: SLIDE_W, height: SLIDE_H });
  pptx.layout = "EDU_WIDE";

  const imageData = await Promise.all(deck.slides.map((slide) => (slide.imageUrl ? fetchImageData(slide.imageUrl) : Promise.resolve(null))));

  deck.slides.forEach((slide, i) => {
    const pSlide =
      slide.slideType === "title"
        ? addTitleSlide(pptx, slide, imageData[i], template.titleColor, template.accentColor)
        : addContentSlide(pptx, slide, imageData[i], i, template.titleColor, template.bodyColor, template.accentColor);

    pSlide.background = { color: hexColor(template.bg) };
    if (slide.notes) pSlide.addNotes(slide.notes);
  });

  const buffer = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
  return buffer;
}
