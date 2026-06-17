import type { Metadata } from "next";
import SavedJobsPage from "@/modules/dashboard/SavedJobsPage";

export const metadata: Metadata = { title: "Saved Jobs — HireMind" };

export default function Page() {
  return <SavedJobsPage />;
}
