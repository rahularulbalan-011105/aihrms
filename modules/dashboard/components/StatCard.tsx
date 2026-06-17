import { ReactNode } from "react";
import Link from "next/link";

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: ReactNode;
  iconBg: string;
  href?: string;
}

export default function StatCard({ label, value, sub, icon, iconBg, href }: StatCardProps) {
  const inner = (
    <>
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
    </>
  );

  if (href) {
    return (
      <Link href={href} className="card px-4 py-3 flex items-center gap-3 hover:border-brand-300 transition-colors">
        {inner}
      </Link>
    );
  }
  return <div className="card px-4 py-3 flex items-center gap-3">{inner}</div>;
}
