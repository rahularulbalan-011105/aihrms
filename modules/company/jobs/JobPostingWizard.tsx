"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Step1JobDetails from "./steps/Step1JobDetails";
import Step2Requirements from "./steps/Step2Requirements";
import Step3Compensation from "./steps/Step3Compensation";
import Step5ReviewPublish from "./steps/Step5ReviewPublish";
import { publishJob, saveDraftJob } from "./services/job.service";
import { EMPTY_JOB, type JobDraft, type StepNum } from "./shared/types";

export default function JobPostingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<StepNum>(1);
  const [draft, setDraft] = useState<JobDraft>(EMPTY_JOB);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);

  const go = (n: StepNum) => {
    setStep(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const publish = async () => {
    setPublishing(true);
    setPublishError(null);
    try {
      const { id } = await publishJob(draft);
      router.push(`/company/jobs/published?jobId=${id}`);
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Failed to publish job");
    } finally {
      setPublishing(false);
    }
  };

  const saveDraft = async () => {
    setSavingDraft(true);
    setPublishError(null);
    try {
      await saveDraftJob(draft);
      router.push("/company/jobs");
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Failed to save draft");
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <div className="px-4 py-3 max-w-[1400px] mx-auto">
      {step === 1 && <Step1JobDetails  data={draft} onChange={setDraft} onCancel={() => router.push("/company/jobs")} onContinue={() => go(2)} />}
      {step === 2 && <Step2Requirements data={draft} onChange={setDraft} onBack={() => go(1)} onContinue={() => go(3)} />}
      {step === 3 && <Step3Compensation data={draft} onChange={setDraft} onBack={() => go(2)} onContinue={() => go(4)} />}
      {step === 4 && (
        <Step5ReviewPublish
          data={draft}
          onBack={() => go(3)}
          onEdit={(t) => go(t)}
          onPublish={publish}
          onSaveDraft={saveDraft}
          publishing={publishing}
          savingDraft={savingDraft}
          publishError={publishError}
        />
      )}
    </div>
  );
}
