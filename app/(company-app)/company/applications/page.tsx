import type { Metadata } from "next";
import CompanyApplicationsPage from "@/modules/company/applications/CompanyApplicationsPage";

export const metadata: Metadata = { title: "Applications — HireMind" };

export default function Page() {
  return <CompanyApplicationsPage />;
}
