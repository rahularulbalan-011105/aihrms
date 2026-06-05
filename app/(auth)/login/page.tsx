import type { Metadata } from "next";
import LoginPage from "@/modules/auth/components/LoginPage";

export const metadata: Metadata = { title: "Login — HireMind" };

export default function Login() {
  return <LoginPage />;
}
