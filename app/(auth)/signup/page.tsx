import type { Metadata } from "next";
import RoleSelectionPage from "@/modules/auth/components/RoleSelectionPage";

export const metadata: Metadata = { title: "Create Account — HireMind" };

export default function Signup() {
  return <RoleSelectionPage />;
}
