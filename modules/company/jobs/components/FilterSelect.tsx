/* Labeled dropdown filter. `tinted` (default) matches the Jobs list filter bar;
 * `outline` matches the bordered filters on the applications page. */
export function FilterSelect({ label, options, variant = "tinted" }: {
  label: string; options: string[]; variant?: "tinted" | "outline";
}) {
  const fieldCls =
    variant === "outline"
      ? "bg-white border border-ink-200"
      : "bg-ink-100/60 border-0";
  return (
    <div className="relative inline-flex items-center">
      <select className={`appearance-none pl-3 pr-8 py-2 rounded-xl text-[13px] text-ink-600 outline-none cursor-pointer ${fieldCls}`} defaultValue="">
        <option value="" disabled>{label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-3 text-ink-400 pointer-events-none text-[10px]">▾</span>
    </div>
  );
}
