import PresentationDetail from "@/app/components/dashboard/PresentationDetail";

export default async function PresentationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PresentationDetail id={id} />;
}
