const SEGMENTS = [
  { label: "Skills Match",      pct: 45, color: "#22c55e" },
  { label: "Experience Match",  pct: 30, color: "#3b82f6" },
  { label: "Education Match",   pct: 10, color: "#6d4cff" },
  { label: "Other Factors",     pct: 15, color: "#d1d5db" },
];

export default function MatchInsightsPanel() {
  return (
    <div className="card p-5">
      <h3 className="font-display font-bold text-[15px] text-ink-900">Your Match Insights</h3>
      <p className="text-[12px] text-ink-400 mt-0.5">This is how you&apos;re matching with top opportunities.</p>

      {/* Donut chart via conic-gradient */}
      <div className="relative w-40 h-40 mx-auto mt-5">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `conic-gradient(
              ${SEGMENTS[0].color} 0% 45%,
              ${SEGMENTS[1].color} 45% 75%,
              ${SEGMENTS[2].color} 75% 85%,
              ${SEGMENTS[3].color} 85% 100%
            )`,
          }}
        />
        {/* White inner hole */}
        <div className="absolute inset-[28px] rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
          <span className="font-display font-extrabold text-[20px] text-ink-900 leading-none">92%</span>
          <span className="text-[10.5px] text-ink-500 font-medium">High Match</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 space-y-2">
        {SEGMENTS.map(({ label, pct, color }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
              <span className="text-[12.5px] text-ink-600">{label}</span>
            </div>
            <span className="text-[12.5px] font-semibold text-ink-700">{pct}%</span>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-2.5 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-100 hover:text-ink-900 transition-colors">
        Improve Your Match
      </button>
    </div>
  );
}
