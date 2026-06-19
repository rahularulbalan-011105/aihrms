import type { Metadata } from "next";
import CompareCandidatesPage from "@/modules/company/jobs/CompareCandidatesPage";

export const metadata: Metadata = { title: "Compare Candidates — HireMind" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CompareCandidatesPage jobId={id} />;
}
