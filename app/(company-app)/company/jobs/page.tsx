import type { Metadata } from "next";
import JobsList from "@/modules/company/jobs/JobsList";

export const metadata: Metadata = { title: "My Jobs — HireMind" };

export default function JobsPage() {
  return <JobsList />;
}
