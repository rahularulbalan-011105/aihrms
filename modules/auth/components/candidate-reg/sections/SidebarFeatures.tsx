const FEATURES = [
  { icon: "🎯", title: "AI-Powered Job Matching",   desc: "Get personalized job recommendations based on your skills and experience." },
  { icon: "📄", title: "Smart Resume Analysis",      desc: "AI analyzes your resume and improves your visibility to recruiters." },
  { icon: "📊", title: "Career Insights",            desc: "Track your profile performance and get actionable career insights." },
  { icon: "🔒", title: "Secure & Private",           desc: "Your data is encrypted and we never share your information." },
];

export default function SidebarFeatures() {
  return (
    <div className="space-y-2">
      {FEATURES.map((f) => (
        <div key={f.title} className="flex items-start gap-3 bg-white rounded-xl border border-ink-100 px-3 py-2.5 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-[15px] shrink-0">
            {f.icon}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-[12px] text-ink-900 leading-tight">{f.title}</div>
            <div className="text-[11px] text-ink-500 leading-snug mt-0.5">{f.desc}</div>
          </div>
        </div>
      ))}

      {/* Trust badge */}
      <div className="flex items-center gap-3 pt-2 border-t border-ink-100 mt-1">
        <div className="flex items-center -space-x-2 shrink-0">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-brand-200 border-2 border-white" />
          ))}
          <div className="w-6 h-6 rounded-full bg-brand-600 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
            10K
          </div>
        </div>
        <span className="text-[12px] font-semibold text-ink-500 leading-tight">Trusted by 10,000+ Job Seekers</span>
      </div>
    </div>
  );
}
