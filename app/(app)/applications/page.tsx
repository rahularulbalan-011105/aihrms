import type { Metadata } from "next";
import MyApplicationsPage from "@/modules/dashboard/MyApplicationsPage";

export const metadata: Metadata = { title: "My Applications — HireMind" };

export default function Page() {
  return <MyApplicationsPage />;
}
