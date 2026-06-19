import { ArrowRight } from "./icons";

export function NextCard({ icon, title, body, action, tint }: {
  icon: React.ReactNode; title: string; body: string; action: string; tint: string;
}) {
  return (
    <div className="bg-white border border-ink-100 rounded-xl p-4">
      <div className="flex items-start gap-2.5 mb-2">
        <span className={`w-9 h-9 rounded-md grid place-items-center ${tint}`}>{icon}</span>
        <h3 className="font-display text-[13.5px] font-extrabold leading-snug">{title}</h3>
      </div>
      <p className="text-[12px] text-ink-500 mb-2.5 leading-snug">{body}</p>
      <a className="text-[12.5px] text-brand-700 font-semibold inline-flex items-center gap-1">
        {action} <ArrowRight />
      </a>
    </div>
  );
}

export function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-ink-500">{label}</div>
      <div className="text-[12.5px] font-medium text-ink-900 mt-0.5">{value}</div>
    </div>
  );
}

export function Social({ icon, label, bg }: { icon: string; label: string; bg: string }) {
  return (
    <button className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-md ${bg} hover:opacity-90 transition`}>
      <span className="w-7 h-7 rounded grid place-items-center text-[13px] font-extrabold">{icon}</span>
      <span className="text-[10.5px] font-semibold">{label}</span>
    </button>
  );
}
