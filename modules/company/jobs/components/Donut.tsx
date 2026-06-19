/* Conic-gradient donut + colour legend, shared by the job-insights and
 * application-summary panels. Pass an explicit `pct` per segment to control the
 * wedge size + legend percentage; otherwise it is derived from count / total. */
export interface DonutSegment {
  label: string;
  count: number;
  color: string;
  pct?: number;
}

export function Donut({ segments, total, centerLabel, centerValue }: {
  segments: DonutSegment[];
  total?: number;
  centerLabel: string;
  centerValue: number | string;
}) {
  const sum = (total ?? segments.reduce((acc, s) => acc + s.count, 0)) || 1;
  let acc = 0;
  const stops = segments
    .map((s) => {
      const span = s.pct ?? (s.count / sum) * 100;
      const start = acc;
      acc += span;
      return `${s.color} ${start}% ${acc}%`;
    })
    .join(", ");

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-28 h-28 shrink-0">
        <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${stops})` }} />
        <div className="absolute inset-[18px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
          <span className="text-[9px] text-ink-500 font-medium">{centerLabel}</span>
          <span className="font-display font-extrabold text-[18px] text-ink-900 leading-none">{centerValue}</span>
        </div>
      </div>
      <div className="flex-1 space-y-1.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="text-[11.5px] text-ink-600">{s.label}</span>
            </div>
            <span className="text-[11.5px] font-semibold text-ink-700">
              {s.count} ({s.pct ?? Math.round((s.count / sum) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
