const HIGHLIGHTS = [
  "3+ years of relevant experience",
  "Strong technical skill set",
  "Completed key projects",
  "Certifications from top platforms",
  "Profile is 100% complete",
];

const STRENGTHS = [
  {
    label: "Problem Solver",
    desc: "Strong analytical and problem-solving skills",
    color: "bg-brand-50",
    iconColor: "#5b34f0",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    label: "Team Player",
    desc: "Collaborates effectively in cross-functional teams",
    color: "bg-blue-50",
    iconColor: "#3b82f6",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Quick Learner",
    desc: "Adapts quickly to new technologies",
    color: "bg-green-50",
    iconColor: "#22c55e",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

const DOCUMENTS = [
  { label: "Resume", sub: "Uploaded on May 10, 2024", downloadable: true },
  { label: "Portfolio", sub: "View Portfolio", downloadable: false },
];

export default function ProfileRightPanel() {
  return (
    <aside className="w-[260px] shrink-0 space-y-4">

      {/* Profile Highlights */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-[14px] text-ink-900 mb-3">Profile Highlights</h3>
        <ul className="space-y-2">
          {HIGHLIGHTS.map((h) => (
            <li key={h} className="flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[12px] text-ink-600">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Strengths */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-[14px] text-ink-900 mb-3">Key Strengths</h3>
        <div className="space-y-3">
          {STRENGTHS.map(({ label, desc, color, iconColor, icon }) => (
            <div key={label} className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center shrink-0`} style={{ color: iconColor }}>
                {icon}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-ink-800">{label}</div>
                <div className="text-[11.5px] text-ink-500 mt-0.5 leading-snug">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-[14px] text-ink-900 mb-3">Documents</h3>
        <div className="space-y-3">
          {DOCUMENTS.map(({ label, sub, downloadable }) => (
            <div key={label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-ink-100 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-ink-800">{label}</div>
                  <div className="text-[11px] text-ink-400">{sub}</div>
                </div>
              </div>
              <button className="text-ink-400 hover:text-brand-600 transition-colors">
                {downloadable
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                }
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Need Help? */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b34f0" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <h3 className="font-display font-bold text-[14px] text-ink-900">Need Help?</h3>
        </div>
        <p className="text-[12px] text-ink-500 leading-relaxed mb-3">
          Our support team is here to help you improve your profile.
        </p>
        <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-ink-200 text-[12.5px] font-semibold text-ink-700 hover:bg-ink-100 transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Contact Support
        </button>
      </div>
    </aside>
  );
}
