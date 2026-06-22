import type { Metadata } from "next";
import TeamPage from "@/modules/company/team/TeamPage";

export const metadata: Metadata = { title: "Team — HireMind" };

export default function Page() {
  return <TeamPage />;
}
