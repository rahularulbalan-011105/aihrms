interface Props {
  current: 1 | 2 | 3;
}

const STEPS = [
  { n: 1, label: "Company Details" },
  { n: 2, label: "Admin Details"   },
  { n: 3, label: "Verification"    },
] as const;

export default function HorizontalStepper({ current }: Props) {
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      {STEPS.map((s, i) => {
        const done    = s.n < current;
        const active  = s.n === current;
        return (
          <div key={s.n} className="flex items-center gap-2.5">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition ${
                done   ? "bg-brand-600 text-white" :
                active ? "bg-brand-600 text-white ring-4 ring-brand-100" :
                          "bg-ink-100 text-ink-400"
              }`}>
                {done ? "✓" : s.n}
              </div>
              <div className={`mt-1 text-[10.5px] font-semibold ${active || done ? "text-ink-900" : "text-ink-400"}`}>
                {s.label}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-10 h-px ${done ? "bg-brand-600" : "bg-ink-200"} mb-4`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
