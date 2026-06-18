import CTABanner from "@/components/marketing/CTABanner";
import Pill from "@/components/marketing/Pill";
import StatsStrip from "@/components/marketing/StatsStrip";
import CapCard from "./components/CapCard";
import { CAPABILITIES, STATS } from "./capabilities.data";

export default function AICapabilitiesPage() {
  return (
    <>
      <section className="page-tint">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 pt-14 lg:pt-20 pb-12 lg:pb-16 text-center">
          <Pill>Powerful AI. Smarter Hiring.</Pill>
          <h1 className="mt-6 font-display text-[42px] lg:text-[56px] leading-[1.05] font-extrabold tracking-tight">
            <span className="gradient-text">AI</span> Capabilities That Drive
            Results
          </h1>
          <p className="mt-6 text-ink-500 text-[15px] max-w-[700px] mx-auto leading-relaxed">
            HireMind uses advanced AI models and automation to simplify
            recruitment, reduce manual effort, and deliver the right outcomes.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-10">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CAPABILITIES.map((capability) => (
            <CapCard key={capability.title} capability={capability} />
          ))}
        </div>
      </section>

      <StatsStrip stats={STATS} maxWidth="max-w-[1400px]" sectionClassName="mt-12" />

      <CTABanner
        title="AI That Works for You, 24x7"
        description="From intelligent matching to automation and fraud detection, HireMind helps you hire smarter and faster."
        primary={{ label: "Start Free Trial", href: "/signup", icon: "arrow" }}
        secondary={{
          label: "Book Live Demo",
          href: "/book-demo",
          icon: "play",
        }}
      />
      <div className="h-16" />
    </>
  );
}
