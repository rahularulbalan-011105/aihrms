import type { Metadata } from "next";
import AddClientPage from "@/modules/company/clients/AddClientPage";

export const metadata: Metadata = { title: "Add New Client — HireMind" };

export default function Page() {
  return <AddClientPage />;
}
