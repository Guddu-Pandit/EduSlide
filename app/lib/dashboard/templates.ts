export interface TemplateDef {
  id: string;
  name: string;
  description: string;
  bg: string;
  titleColor: string;
  accentColor: string;
  bodyColor: string;
}

export const TEMPLATES: TemplateDef[] = [
  {
    id: "corporate",
    name: "Corporate",
    description: "Dark background, brand accents",
    bg: "#15181c",
    titleColor: "#ffffff",
    accentColor: "var(--brand)",
    bodyColor: "rgba(255,255,255,.55)",
  },
  {
    id: "academic",
    name: "Academic",
    description: "Warm neutral, serif headings",
    bg: "#f4f5f7",
    titleColor: "#15181c",
    accentColor: "var(--brand)",
    bodyColor: "rgba(21,24,28,.4)",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "White background, clean lines",
    bg: "#ffffff",
    titleColor: "var(--brand)",
    accentColor: "#cbd1d9",
    bodyColor: "#e4e7eb",
  },
  {
    id: "edu-blue",
    name: "Edu Blue",
    description: "Classic blue for classroom use",
    bg: "#185fa5",
    titleColor: "#ffffff",
    accentColor: "#b5d4f4",
    bodyColor: "rgba(255,255,255,.55)",
  },
  {
    id: "edu-green",
    name: "Edu Green",
    description: "Natural tones, high readability",
    bg: "#0f6e56",
    titleColor: "#ffffff",
    accentColor: "#9fe1cb",
    bodyColor: "rgba(255,255,255,.55)",
  },
  {
    id: "high-contrast",
    name: "High contrast",
    description: "Accessible, WCAG AAA compliant",
    bg: "#000000",
    titleColor: "#ffffff",
    accentColor: "#ef9f27",
    bodyColor: "rgba(255,255,255,.6)",
  },
];

export function templateName(id: string): string {
  return TEMPLATES.find((t) => t.id === id)?.name ?? id;
}
