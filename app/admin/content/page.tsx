import { getAdminDocuments, getAdminPresentations } from "@/app/lib/admin/queries";
import ContentClient from "./ContentClient";

export default async function ContentPage() {
  const [documents, presentations] = await Promise.all([
    getAdminDocuments(),
    getAdminPresentations(),
  ]);
  return <ContentClient documents={documents} presentations={presentations} />;
}
