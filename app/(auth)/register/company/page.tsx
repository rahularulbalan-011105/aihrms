import type { Metadata } from "next";
import CompanyRegistration from "@/modules/auth/components/company-reg/CompanyRegistration";

export const metadata: Metadata = { title: "Company Registration — HireMind" };

export default function CompanyRegPage() {
  return <CompanyRegistration />;
}
