import type { Metadata } from "next";
import JobApplicationsPage from "@/modules/company/jobs/JobApplicationsPage";

export const metadata: Metadata = { title: "View Applications — HireMind" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JobApplicationsPage jobId={id} />;
}
