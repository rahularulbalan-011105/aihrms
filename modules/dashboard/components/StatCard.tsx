import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: ReactNode;
  iconBg: string;
}

export default function StatCard({ label, value, sub, icon, iconBg }: StatCardProps) {
  return (
    <div className="card px-4 py-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <div className="text-[11px] text-ink-500 font-medium leading-tight">{label}</div>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-display font-extrabold text-[18px] text-ink-900 leading-none">{value}</span>
          <span className="text-[11px] text-ink-400">{sub}</span>
        </div>
      </div>
    </div>
  );
}
