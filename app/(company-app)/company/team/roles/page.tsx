import type { Metadata } from "next";
import RolesPermissionsPage from "@/modules/company/team/RolesPermissionsPage";

export const metadata: Metadata = { title: "Roles & Permissions — HireMind" };

export default function Page() {
  return <RolesPermissionsPage />;
}
