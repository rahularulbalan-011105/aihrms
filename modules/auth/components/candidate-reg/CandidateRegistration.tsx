"use client";

import { useState } from "react";
import Link from "next/link";

function BrandLogoImg({ height = 44 }: { height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="HireMind"
      height={height}
      width={Math.round(height * 1.46)}
      style={{ height: `${height}px`, width: "auto", objectFit: "contain" }}
    />
  );
}
import ProgressStepper from "./ProgressStepper";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2Professional from "./Step2Professional";
import Step3Skills from "./Step3Skills";
import Step4Review from "./Step4Review";
import ProfileSubmission from "./ProfileSubmission";
import type { CandidateRegData } from "../../types/auth.types";

const STEP_MESSAGES = [
  {
    heading: "Start Your Career Journey",
    sub: "with HireMind",
    desc: "Create your profile, get discovered by top recruiters and find the right opportunities faster with AI.",
  },
  {
    heading: "You're one step",
    sub: "closer!",
    desc: "Complete your professional details to help us personalize your experience.",
  },
  {
    heading: "You're almost",
    sub: "there!",
    desc: "Add your skills and preferences so we can find the best opportunities for you.",
  },
  {
    heading: "You're",
    sub: "all set!",
    desc: "Review your details before submitting. You can edit any section if needed.",
  },
];

const LEFT_FEATURES = [
  {
    icon: "🎯",
    title: "AI-Powered Job Matching",
    desc: "Get personalized job recommendations based on your skills and experience.",
  },
  {
    icon: "📄",
    title: "Smart Resume Analysis",
    desc: "AI analyzes your resume and improves your visibility to recruiters.",
  },
  {
    icon: "📊",
    title: "Career Insights",
    desc: "Track your profile performance and get actionable career insights.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "Your data is encrypted and we never share your information.",
  },
];

const SIDEBAR_STEPS = [
  "Basic Info",
  "Professional Details",
  "Skills & Preferences",
  "Review & Submit",
];
const STEP4_TIPS = [
  "Ensure your information is accurate",
  "A complete profile increases your chances",
  "You can update your profile anytime",
];

const INITIAL_DATA: CandidateRegData = {
  step1: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    currentLocation: "",
    hearAboutUs: "",
    acceptTerms: false,
  },
  step2: { education: [], experience: [] },
  step3: {
    skills: [],
    certifications: [],
    noticePeriod: "",
    expectedSalary: "",
    salaryType: "",
    jobRolePreferences: [],
    preferredLocation: "",
    openToRelocate: false,
    employmentTypes: [],
    benefits: [],
    additionalNotes: "",
  },
};

export default function CandidateRegistration() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<CandidateRegData>(INITIAL_DATA);

  // Show full-page submission screen after submit
  if (submitted) {
    const fullName =
      [data.step1.firstName, data.step1.lastName].filter(Boolean).join(" ") ||
      "Rahul Sharma";
    return <ProfileSubmission candidateName={fullName} />;
  }

  const clampedStep = Math.min(step, 4);
  const msg = STEP_MESSAGES[clampedStep - 1];
  const isStep1 = clampedStep === 1;
  const isStep4 = clampedStep === 4;
  // 100% progress only on step 4
  const progress = isStep4 ? 100 : ((clampedStep - 1) / 3) * 100;

  const stepIllustration = ["👨‍💻", "📋", "⭐", "✅"][clampedStep - 1];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7FF]">
      {/* ── Header ── */}
      <header className="bg-white border-b border-ink-100 sticky top-0 z-20">
        <div className="mx-auto max-w-[1400px] px-6 py-3.5 flex items-center justify-between">
          <Link href="/">
            <BrandLogoImg height={56} />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[13.5px] text-ink-500">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-ink-200 text-[13.5px] font-semibold text-ink-700 hover:bg-ink-50 transition"
            >
              <SignInIcon /> Login
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <div className="flex flex-1">
        {/* ── Left panel ── */}
        <aside
          className={`hidden lg:flex flex-col p-8 shrink-0 ${isStep1 ? "w-[380px] xl:w-[420px]" : "w-[300px] xl:w-[340px]"}`}
        >
          {/* Brand message */}
          <div className="mb-6">
            <h2 className="font-display font-extrabold text-[24px] xl:text-[28px] text-ink-900 leading-[1.2] tracking-tight">
              {msg.heading}{" "}
              {msg.sub && <span className="text-brand-600">{msg.sub}</span>}
            </h2>
            <p className="mt-3 text-ink-500 text-[13.5px] leading-relaxed">
              {msg.desc}
            </p>
          </div>

          {/* Illustration */}
          <div className="rounded-2xl bg-brand-50/60 border border-brand-100 h-[200px] flex items-center justify-center mb-6 shrink-0">
            <div className="text-center">
              <div className="text-[50px]">{stepIllustration}</div>
              <div className="text-[11px] text-ink-400 mt-1">
                {isStep4 ? "Profile ready to submit" : "Candidate profile"}
              </div>
            </div>
          </div>

          {/* Step 1: feature bullets */}
          {isStep1 && (
            <div className="space-y-4">
              {LEFT_FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-ink-100 flex items-center justify-center text-[16px] shrink-0 shadow-sm">
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-bold text-[13.5px] text-ink-900">
                      {f.title}
                    </div>
                    <div className="text-[12px] text-ink-500 leading-relaxed mt-0.5">
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full bg-brand-200 border-2 border-white"
                    />
                  ))}
                  <div className="w-7 h-7 rounded-full bg-brand-600 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
                    10K
                  </div>
                </div>
                <span className="text-[12px] font-semibold text-ink-500">
                  Trusted by 10,000+ Job Seekers
                </span>
              </div>
            </div>
          )}

          {/* Steps 2-4: progress sidebar */}
          {!isStep1 && (
            <div className="space-y-4">
              {/* Progress widget */}
              <div className="bg-white rounded-xl border border-ink-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-bold text-ink-900">
                    Registration Progress
                  </span>
                  <span className="text-[12px] font-semibold text-brand-600">
                    Step {clampedStep} of 4
                  </span>
                </div>
                <div className="h-2 rounded-full bg-ink-100 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: "var(--gradient-brand)",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  {SIDEBAR_STEPS.map((s, i) => {
                    const n = i + 1;
                    const done = n < clampedStep;
                    const active = n === clampedStep;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                            done
                              ? "bg-brand-600 border-brand-600 text-white"
                              : active
                                ? "bg-brand-50 border-brand-500 text-brand-600"
                                : "bg-white border-ink-300 text-ink-400"
                          }`}
                        >
                          {done ? "✓" : n}
                        </div>
                        <span
                          className={`text-[11.5px] font-medium ${
                            active
                              ? "text-brand-700 font-bold"
                              : done
                                ? "text-ink-500"
                                : "text-ink-400"
                          }`}
                        >
                          {s}
                        </span>
                        {done && (
                          <span className="ml-auto text-[10px] text-green-500 font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white rounded-xl border border-ink-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[15px]">💡</span>
                  <span className="font-bold text-[13px] text-ink-900">
                    Tips
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {(clampedStep === 2
                    ? [
                        "Add complete experience and projects",
                        "Include all your education qualifications",
                        "This helps in better job matching",
                      ]
                    : clampedStep === 3
                      ? [
                          "Add relevant skills and certifications",
                          "Highlight your key skills to stand out",
                          "Set accurate preferences for better matches",
                        ]
                      : STEP4_TIPS
                  ).map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2 text-[12.5px] text-ink-600"
                    >
                      <span className="text-green-500 font-bold shrink-0 mt-0.5">
                        ✓
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Need help */}
              <div className="bg-white rounded-xl border border-ink-200 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[16px]">?</span>
                  <span className="font-bold text-[13px] text-ink-900">
                    Need Help?
                  </span>
                </div>
                <p className="text-[12px] text-ink-500 mb-1.5">
                  Our support team is here to assist you.
                </p>
                <a
                  href="mailto:support@aihrms.com"
                  className="text-[12.5px] text-brand-600 font-semibold hover:underline"
                >
                  support@aihrms.com
                </a>
              </div>
            </div>
          )}
        </aside>

        {/* ── Right: form area ── */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-[800px]">
            <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-6 lg:p-8">
              <h1 className="font-display font-extrabold text-[20px] text-ink-900 mb-1">
                {isStep1
                  ? "Candidate Registration"
                  : isStep4
                    ? "Review & Submit"
                    : "Job Seeker Registration"}
              </h1>

              {/* Show the progress stepper for all steps */}
              <div className="mb-6">
                <ProgressStepper current={clampedStep} />
              </div>

              {clampedStep === 1 && (
                <Step1BasicInfo
                  data={data.step1}
                  onChange={(s1) => setData((d) => ({ ...d, step1: s1 }))}
                  onNext={() => setStep(2)}
                />
              )}
              {clampedStep === 2 && (
                <Step2Professional
                  data={data.step2}
                  onChange={(s2) => setData((d) => ({ ...d, step2: s2 }))}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {clampedStep === 3 && (
                <Step3Skills
                  data={data.step3}
                  onChange={(s3) => setData((d) => ({ ...d, step3: s3 }))}
                  onNext={() => setStep(4)}
                  onBack={() => setStep(2)}
                />
              )}
              {clampedStep === 4 && (
                <Step4Review
                  data={data}
                  onBack={() => setStep(3)}
                  onEditStep={(s) => setStep(s)}
                  onSubmit={() => setSubmitted(true)}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SignInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
