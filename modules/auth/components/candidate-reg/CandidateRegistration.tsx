"use client";

import { useState } from "react";
import AuthHeader from "../AuthHeader";
import CandidateSidebar from "./CandidateSidebar";
import CandidateFormPanel from "./CandidateFormPanel";
import ProfileSubmission from "./ProfileSubmission";
import type { CandidateRegData } from "../../types/auth.types";

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
  const [step, setStep]           = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData]           = useState<CandidateRegData>(INITIAL_DATA);

  if (submitted) {
    const fullName =
      [data.step1.firstName, data.step1.lastName].filter(Boolean).join(" ") ||
      "Rahul Sharma";
    return <ProfileSubmission candidateName={fullName} />;
  }

  const currentStep = Math.min(step, 4);

  return (
    <div className="h-screen flex flex-col bg-[#F8F7FF] overflow-hidden">
      <AuthHeader
        border
        sticky
        preCtaText="Already have an account?"
        cta={{ label: "Login", href: "/login", icon: <SignInIcon /> }}
      />

      <div className="flex flex-1 min-h-0">
        <CandidateSidebar step={currentStep} />
        <CandidateFormPanel
          currentStep={currentStep}
          data={data}
          onStepChange={setStep}
          onDataChange={setData}
          onSubmit={() => setSubmitted(true)}
        />
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
