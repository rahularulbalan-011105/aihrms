import type { Metadata } from "next";
import OtpForm from "@/modules/auth/components/OtpForm";

export const metadata: Metadata = {
  title: "Verify Email — HireMind",
};

export default function OtpPage() {
  return <OtpForm />;
}
