import type { Plan } from "./plan";

export type DocumentFileType = "pdf" | "docx" | "txt";
export type PresentationStatus = "queued" | "generating" | "done" | "error";

export interface ProfileRow {
  id: string;
  full_name: string | null;
  role: string;
  plan: Plan;
  institution: string | null;
  default_template: string;
  speaker_notes_default: boolean;
  email_on_completion: boolean;
  auto_delete_uploads: boolean;
  created_at: string;
}

export interface DocumentRow {
  id: string;
  user_id: string;
  name: string;
  file_path: string;
  file_type: DocumentFileType;
  size_bytes: number;
  created_at: string;
}

export interface GeneratedSlide {
  title: string;
  bullets: string[];
  notes?: string;
}

export interface GeneratedDeck {
  slides: GeneratedSlide[];
}

export interface PresentationRow {
  id: string;
  user_id: string;
  document_id: string | null;
  name: string;
  template: string;
  slide_count: number;
  status: PresentationStatus;
  error_message: string | null;
  content: GeneratedDeck | null;
  created_at: string;
  completed_at: string | null;
}

export interface DocumentWithCount extends DocumentRow {
  presentationCount: number;
}
