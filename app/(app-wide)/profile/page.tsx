import type { Metadata } from "next";
import ProfilePage from "@/modules/dashboard/ProfilePage";

export const metadata: Metadata = { title: "My Profile — HireMind" };

export default function Page() {
  return <ProfilePage />;
}
