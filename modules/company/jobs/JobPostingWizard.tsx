"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Step1JobDetails from "./steps/Step1JobDetails";
import Step2Requirements from "./steps/Step2Requirements";
import Step3Compensation from "./steps/Step3Compensation";
import Step4Preferences from "./steps/Step4Preferences";
import Step5ReviewPublish from "./steps/Step5ReviewPublish";
import { EMPTY_JOB, type JobDraft, type StepNum } from "./shared/types";

export default function JobPostingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<StepNum>(1);
  const [draft, setDraft] = useState<JobDraft>(EMPTY_JOB);

  const go = (n: StepNum) => {
    setStep(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const publish = () => router.push("/company/jobs/published");

  return (
    <div className="px-6 lg:px-8 py-6">
      {step === 1 && <Step1JobDetails  data={draft} onChange={setDraft} onCancel={() => router.push("/company/dashboard")} onContinue={() => go(2)} />}
      {step === 2 && <Step2Requirements data={draft} onChange={setDraft} onBack={() => go(1)} onContinue={() => go(3)} />}
      {step === 3 && <Step3Compensation data={draft} onChange={setDraft} onBack={() => go(2)} onContinue={() => go(4)} />}
      {step === 4 && <Step4Preferences  data={draft} onChange={setDraft} onBack={() => go(3)} onContinue={() => go(5)} />}
      {step === 5 && <Step5ReviewPublish data={draft} onBack={() => go(4)} onEdit={(t) => go(t)} onPublish={publish} />}
    </div>
  );
}
