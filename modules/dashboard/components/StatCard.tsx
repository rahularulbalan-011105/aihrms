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
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <div className="text-[12.5px] text-ink-500 font-medium leading-tight">{label}</div>
        <div className="font-display font-extrabold text-[22px] text-ink-900 leading-none mt-0.5">{value}</div>
        <div className="text-[11.5px] text-ink-400 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
