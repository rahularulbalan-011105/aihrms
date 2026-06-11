import { JOB_STEPS, type StepNum } from "./types";

interface Props {
  current: StepNum;
}

export default function JobStepper({ current }: Props) {
  return (
    <div className="flex items-center w-full max-w-[720px] mx-auto">
      {JOB_STEPS.map((s, i) => {
        const done   = s.n < current;
        const active = s.n === current;
        const last   = i === JOB_STEPS.length - 1;
        return (
          <div key={s.n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition ${
                done   ? "bg-brand-600 text-white" :
                active ? "bg-brand-600 text-white ring-4 ring-brand-100" :
                          "bg-ink-100 text-ink-400"
              }`}>
                {done ? "✓" : s.n}
              </div>
              <div className={`mt-1.5 text-[11px] font-semibold whitespace-nowrap ${
                active ? "text-brand-700" : done ? "text-ink-900" : "text-ink-400"
              }`}>
                {s.label}
              </div>
            </div>
            {!last && (
              <div className={`flex-1 h-px mx-3 mt-[-18px] ${
                done ? "bg-brand-600" : "border-t border-dashed border-ink-200 bg-transparent"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
