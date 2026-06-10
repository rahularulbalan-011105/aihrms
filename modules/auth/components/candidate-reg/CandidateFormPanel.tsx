"use client";

import ProgressStepper from "./ProgressStepper";
import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2Professional from "./steps/Step2Professional";
import Step3Skills from "./steps/Step3Skills";
import Step4Review from "./steps/Step4Review";
import type { CandidateRegData } from "../../types/auth.types";

interface CandidateFormPanelProps {
  currentStep: number;
  data: CandidateRegData;
  onStepChange: (step: number) => void;
  onDataChange: (data: CandidateRegData) => void;
  onSubmit: () => void;
}

const FORM_TITLES: Record<number, string> = {
  1: "Candidate Registration",
  2: "Candidate Registration",
  3: "Candidate Registration",
  4: "Review & Submit",
};

export default function CandidateFormPanel({
  currentStep,
  data,
  onStepChange,
  onDataChange,
  onSubmit,
}: CandidateFormPanelProps) {
  return (
    <main className="flex-1 p-3 lg:p-5 overflow-y-auto min-h-0">
      <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-4 lg:p-5 min-h-full">
        <h1 className="font-display font-extrabold text-[19px] text-ink-900 mb-1">
          {FORM_TITLES[currentStep]}
        </h1>
        <div className="mb-4">
          <ProgressStepper current={currentStep} />
        </div>

        {currentStep === 1 && (
          <Step1BasicInfo
            data={data.step1}
            onChange={(step1) => onDataChange({ ...data, step1 })}
            onNext={() => onStepChange(2)}
          />
        )}
        {currentStep === 2 && (
          <Step2Professional
            data={data.step2}
            onChange={(step2) => onDataChange({ ...data, step2 })}
            onNext={() => onStepChange(3)}
            onBack={() => onStepChange(1)}
          />
        )}
        {currentStep === 3 && (
          <Step3Skills
            data={data.step3}
            onChange={(step3) => onDataChange({ ...data, step3 })}
            onNext={() => onStepChange(4)}
            onBack={() => onStepChange(2)}
          />
        )}
        {currentStep === 4 && (
          <Step4Review
            data={data}
            onBack={() => onStepChange(3)}
            onEditStep={onStepChange}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </main>
  );
}
