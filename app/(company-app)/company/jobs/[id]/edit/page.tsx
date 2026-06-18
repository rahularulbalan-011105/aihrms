import type { Metadata } from "next";
import EditJobPage from "@/modules/company/jobs/EditJobPage";

export const metadata: Metadata = { title: "Edit Job — HireMind" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditJobPage jobId={id} />;
}
