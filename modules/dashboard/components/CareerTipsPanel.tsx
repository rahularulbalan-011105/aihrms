import { ReactNode } from "react";

interface Tip {
  icon: ReactNode;
  title: string;
  description: string;
}

const TIPS: Tip[] = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b34f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Add more skills to increase your match",
    description: "Profiles with 8+ skills get 3x more views.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Update your resume",
    description: "A recent resume gets more responses.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Practice assessments",
    description: "Improve your chances with top scores.",
  },
];

export default function CareerTipsPanel() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Career Tips</h3>
        <button className="text-[12.5px] text-brand-600 font-semibold hover:text-brand-800 transition-colors">View all</button>
      </div>
      <div className="space-y-1">
        {TIPS.map((tip) => (
          <button
            key={tip.title}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-ink-100/70 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-ink-100 flex items-center justify-center shrink-0">
              {tip.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-ink-800 leading-snug">{tip.title}</div>
              <div className="text-[11.5px] text-ink-500 mt-0.5">{tip.description}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" className="shrink-0">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
