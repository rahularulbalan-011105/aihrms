import type { Metadata } from "next";
import CompanyDashboard from "@/modules/company/dashboard/CompanyDashboard";

export const metadata: Metadata = { title: "Dashboard — HireMind" };

export default function CompanyDashboardPage() {
  return <CompanyDashboard />;
}
