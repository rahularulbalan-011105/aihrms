const AI_FEATURES = [
  { icon: <AiTargetIcon />, label: "Smart Matching" },
  { icon: <AiDocIcon />,    label: "Resume AI" },
  { icon: <AiShieldIcon />, label: "Fraud Detection" },
  { icon: <AiChartIcon />,  label: "Predictive Analytics" },
];

export default function AIPlatformStrip() {
  return (
    <div className="mt-4 bg-white rounded-2xl border border-ink-100 shadow-sm p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="shrink-0 max-w-[260px]">
          <div className="flex items-center gap-2 mb-1">
            <SparkleIcon />
            <span className="font-bold text-[14px] text-ink-900">AI-Powered Platform</span>
          </div>
          <p className="text-ink-500 text-[12.5px] leading-relaxed">
            Leverage AI to find the right opportunities, connect with the right people, and make smarter hiring decisions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 md:ml-auto">
          {AI_FEATURES.map((f) => (
            <div key={f.label} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-ink-100 bg-ink-50/60 text-[12.5px] font-semibold text-ink-700">
              {f.icon}{f.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SparkleIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" stroke="#7C3AED" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
}
function AiTargetIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#7C3AED" strokeWidth="1.6"/><circle cx="12" cy="12" r="5" stroke="#7C3AED" strokeWidth="1.6"/><circle cx="12" cy="12" r="1.5" fill="#7C3AED"/></svg>;
}
function AiDocIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" stroke="#2563EB" strokeWidth="1.6"/><path d="M8 7h8M8 11h8M8 15h5" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round"/></svg>;
}
function AiShieldIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z" stroke="#16A34A" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function AiChartIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 20h18M5 20V12M9 20V8M13 20V4M17 20v-6" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round"/></svg>;
}
