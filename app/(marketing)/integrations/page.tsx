import type { Metadata } from "next";
import ComingSoon from "@/components/marketing/ComingSoon";

export const metadata: Metadata = { title: "Integrations — HireMind" };

export default function IntegrationsPage() {
  return <ComingSoon variant="integrations" />;
}
