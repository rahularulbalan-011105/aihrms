import { TrendUpIcon } from "../shared/icons";

/* Stat tile (candidate-dashboard style) — icon-left, value, label, optional green delta. */
export function StatCard({ iconBg, icon, value, label, delta }: {
  iconBg: string; icon: React.ReactNode; value: string; label: string; delta?: string;
}) {
  return (
    <div className="card px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</span>
        <div className="leading-tight">
          <div className="font-display font-extrabold text-[22px] text-ink-900">{value}</div>
          <div className="text-[12px] text-ink-600 font-medium">{label}</div>
        </div>
      </div>
      {delta && (
        <div className="mt-1.5 text-[11px] text-green-600 font-semibold flex items-center gap-1">
          <TrendUpIcon /> {delta}
        </div>
      )}
    </div>
  );
}
