interface Step {
  n: number;
  title: string;
  caption: string;
  done: boolean;
}

interface Props {
  current: number;
  steps: Step[];
}

export default function VerticalStepper({ current, steps }: Props) {
  return (
    <ul className="space-y-3.5">
      {steps.map((s, i) => {
        const active = s.n === current;
        const last   = i === steps.length - 1;
        return (
          <li key={s.n} className="flex items-start gap-3 relative">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${
                s.done   ? "bg-green-500 text-white" :
                active   ? "bg-brand-600 text-white ring-4 ring-brand-100" :
                            "bg-ink-100 text-ink-400"
              }`}>
                {s.done ? "✓" : s.n}
              </div>
              {!last && <div className={`w-px flex-1 mt-1 ${s.done ? "bg-green-300" : "bg-ink-200"}`} style={{ minHeight: 24 }} />}
            </div>
            <div className={`pb-2 ${active ? "" : ""}`}>
              <div className={`text-[13px] font-bold ${active ? "text-brand-700" : s.done ? "text-ink-900" : "text-ink-700"}`}>{s.title}</div>
              <div className={`text-[11px] ${s.done ? "text-green-600 font-semibold" : "text-ink-500"}`}>{s.caption}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
