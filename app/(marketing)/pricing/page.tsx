import type { Metadata } from "next";
import ComingSoon from "@/components/marketing/ComingSoon";

export const metadata: Metadata = { title: "Pricing — HireMind" };

export default function PricingPage() {
  return <ComingSoon variant="pricing" />;
}
