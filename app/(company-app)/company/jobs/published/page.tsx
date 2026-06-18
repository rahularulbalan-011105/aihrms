import type { Metadata } from "next";
import PublishSuccess from "@/modules/company/jobs/PublishSuccess";

export const metadata: Metadata = { title: "Job Published — HireMind" };

export default async function PublishedPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }>;
}) {
  const { jobId } = await searchParams;
  return <PublishSuccess jobId={jobId} />;
}
