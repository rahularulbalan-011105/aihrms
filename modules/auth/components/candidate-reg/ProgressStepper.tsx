"use client";

const STEP_LABELS = [
  "Basic Information",
  "Professional Details",
  "Skills & Preferences",
  "Review & Submit",
];

export default function ProgressStepper({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-7">
      {STEP_LABELS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-[12px] transition-all ${
                done   ? "bg-brand-600 border-brand-600 text-white"
                : active ? "bg-brand-600 border-brand-600 text-white"
                         : "bg-white border-ink-300 text-ink-400"
              }`}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span className={`text-[10.5px] font-semibold whitespace-nowrap ${active ? "text-brand-600" : done ? "text-brand-500" : "text-ink-400"}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 rounded ${step < current ? "bg-brand-500" : "bg-ink-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
