import type { Metadata } from "next";
import CandidatesPage from "@/modules/company/candidates/CandidatesPage";

export const metadata: Metadata = { title: "Candidates — HireMind" };

export default function Page() {
  return <CandidatesPage />;
}
