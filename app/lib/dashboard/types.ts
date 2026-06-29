import type { Plan } from "./plan";

export type DocumentFileType = "pdf" | "docx" | "txt";
export type PresentationStatus = "queued" | "generating" | "done" | "error";

export interface ProfileRow {
  id: string;
  full_name: string | null;
  role: string;
  plan: Plan;
  plan_expires_at: string | null;
  institution: string | null;
  default_template: string;
  speaker_notes_default: boolean;
  email_on_completion: boolean;
  auto_delete_uploads: boolean;
  created_at: string;
}

export interface PaymentRow {
  id: string;
  user_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  plan: Plan;
  amount_paise: number;
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

export type SlideType = "title" | "content" | "data" | "summary";

export interface GeneratedSlide {
  slideType: SlideType;
  title: string;
  bullets: string[];
  notes: string;
  imageQuery: string;
  imageUrl: string | null;
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
  requested_slide_count: number | null;
  status: PresentationStatus;
  error_message: string | null;
  content: GeneratedDeck | null;
  created_at: string;
  completed_at: string | null;
}

export interface DocumentWithCount extends DocumentRow {
  presentationCount: number;
}
