import CTABanner from "@/components/marketing/CTABanner";
import Pill from "@/components/marketing/Pill";
import HeroActions from "@/components/marketing/HeroActions";
import HeroVisual from "./components/HeroVisual";
import FeatureCard from "./components/FeatureCard";
import ColHeader from "./components/ColHeader";
import FootNote from "./components/FootNote";
import { BulkResumeCard } from "./components/blocks";
import {
  SEEKER_FEATURES,
  AGENCY_FEATURES_PRIMARY,
  AGENCY_FEATURES_SECONDARY,
} from "./features.data";

export default function FeaturesPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="page-tint">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-14 lg:pt-20 pb-12 lg:pb-16 grid lg:grid-cols-[0.9fr_1.35fr] gap-10 items-center">
          {/* Left — copy + CTAs */}
          <div>
            <Pill>AI-Powered Recruitment Platform</Pill>
            <h1 className="mt-6 font-display text-[44px] lg:text-[58px] leading-[1.05] font-extrabold tracking-tight">
              Smarter Hiring.
              <br />
              Better Careers.
              <br />
              Powered by <span className="gradient-text">AI.</span>
            </h1>
            <p className="mt-6 text-ink-500 text-[15px] lg:text-[16px] max-w-[480px] leading-[1.7]">
              HireMind helps job seekers find genuine opportunities and helps
              agencies source, screen, and hire top talent faster.
            </p>
            <HeroActions
              primary={{ label: "Start Free Trial", href: "/signup", icon: "arrow" }}
              secondary={{ label: "Schedule Demo", href: "/book-demo", icon: "play" }}
            />
          </div>

          {/* Right — visual composition */}
          <HeroVisual />
        </div>
      </section>

      {/* ============ TWO-COLUMN FEATURES ============ */}
      <section className="px-6 lg:px-10 pb-10 lg:pb-14">
        <div className="mx-auto max-w-[1400px] grid lg:grid-cols-2 gap-6">
          <SeekersColumn />
          <AgenciesColumn />
        </div>
      </section>

      <CTABanner
        title="Ready to Transform Recruitment?"
        description="Join thousands of recruiters, agencies and job seekers using HireMind to make smarter hiring decisions and build successful careers."
      />
      <div className="h-16" />
    </>
  );
}

function SeekersColumn() {
  return (
    <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-6 lg:p-7">
      <ColHeader
        tone="blue"
        icon="user"
        title="For Job Seekers"
        subtitle="Find better opportunities while avoiding fake jobs."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
        {SEEKER_FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
      <FootNote tone="blue" icon="shield">
        Stay safe from fake jobs while AI works for you 24/7.
      </FootNote>
    </div>
  );
}

function AgenciesColumn() {
  return (
    <div className="bg-green-50/40 border border-green-100 rounded-2xl p-6 lg:p-7">
      <ColHeader
        tone="green"
        icon="building"
        title="For Recruitment Agencies"
        subtitle="Reduce manual work and hire faster using AI."
      />
      <div className="mt-5 space-y-3">
        <BulkResumeCard />
        <div className="grid sm:grid-cols-2 gap-3">
          {AGENCY_FEATURES_PRIMARY.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {AGENCY_FEATURES_SECONDARY.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
      <FootNote tone="green" icon="check">
        Everything you need to hire smarter and scale your agency.
      </FootNote>
    </div>
  );
}
