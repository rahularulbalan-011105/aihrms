const SIDEBAR_STEPS = [
  "Basic Info",
  "Professional Details",
  "Skills & Preferences",
  "Review & Submit",
];

const TIPS: Record<number, string[]> = {
  2: [
    "Add complete experience and projects",
    "Include all your education qualifications",
    "This helps in better job matching",
  ],
  3: [
    "Add relevant skills and certifications",
    "Highlight your key skills to stand out",
    "Set accurate preferences for better matches",
  ],
  4: [
    "Ensure your information is accurate",
    "A complete profile increases your chances",
    "You can update your profile anytime",
  ],
};

interface SidebarProgressProps {
  currentStep: number;
}

export default function SidebarProgress({ currentStep }: SidebarProgressProps) {
  const progress = currentStep === 4 ? 100 : ((currentStep - 1) / 3) * 100;
  const tips = TIPS[currentStep] ?? TIPS[4];

  return (
    <div className="space-y-4">
      {/* Progress widget */}
      <div className="bg-white rounded-xl border border-ink-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-ink-900">
            Registration Progress
          </span>
          <span className="text-[12px] font-semibold text-brand-600">
            Step {currentStep} of 4
          </span>
        </div>
        <div className="h-2 rounded-full bg-ink-100 overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500 btn-gradient-brand"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Horizontal steps */}
        <div className="flex items-start justify-between gap-1 mt-1">
          {SIDEBAR_STEPS.map((s, i) => {
            const n = i + 1;
            const done = n < currentStep;
            const active = n === currentStep;
            return (
              <div
                key={s}
                className="flex flex-col items-center flex-1 relative"
              >
                {i < SIDEBAR_STEPS.length - 1 && (
                  <div
                    className={`absolute top-[9px] left-1/2 w-full h-[2px] ${done ? "bg-brand-600" : "bg-ink-200"}`}
                  />
                )}
                <div
                  className={`relative z-10 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold border-2 shrink-0 ${
                    done
                      ? "bg-brand-600 border-brand-600 text-white"
                      : active
                        ? "bg-white border-brand-500 text-brand-600"
                        : "bg-white border-ink-300 text-ink-400"
                  }`}
                >
                  {done ? "✓" : n}
                </div>
                <span
                  className={`text-[9.5px] font-medium text-center mt-1 leading-tight ${
                    active
                      ? "text-brand-700 font-bold"
                      : done
                        ? "text-ink-500"
                        : "text-ink-400"
                  }`}
                >
                  {s}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl border border-ink-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[15px]">💡</span>
          <span className="font-bold text-[13px] text-ink-900">Tips</span>
        </div>
        <ul className="space-y-1.5">
          {tips.map((tip) => (
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
          <span className="font-bold text-[13px] text-ink-900">Need Help?</span>
        </div>
        <p className="text-[12px] text-ink-500 mb-1.5">
          Our support team is here to assist you.
        </p>
        <a
          href="mailto:contact@arvantra-ai.com"
          className="text-[12.5px] text-brand-600 font-semibold hover:underline"
        >
          contact@arvantra-ai.com
        </a>
      </div>
    </div>
  );
}
