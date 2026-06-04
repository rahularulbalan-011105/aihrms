import type { Metadata } from "next";
import CandidateRegistration from "@/modules/auth/components/candidate-reg/CandidateRegistration";

export const metadata: Metadata = { title: "Candidate Registration — HireMind" };

export default function CandidateRegPage() {
  return <CandidateRegistration />;
}
