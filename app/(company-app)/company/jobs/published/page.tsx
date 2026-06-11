import type { Metadata } from "next";
import PublishSuccess from "@/modules/company/jobs/PublishSuccess";

export const metadata: Metadata = { title: "Job Published — HireMind" };

export default function PublishedPage() {
  return <PublishSuccess />;
}
