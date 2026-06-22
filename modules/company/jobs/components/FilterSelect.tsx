/* Labeled dropdown filter. `tinted` (default) matches the Jobs list filter bar;
 * `outline` matches the bordered filters on the applications page.
 * Pass `value`/`onChange` to make it controlled (drives a real filter). */
export function FilterSelect({ label, options, variant = "tinted", value, onChange }: {
  label: string;
  options: string[];
  variant?: "tinted" | "outline";
  value?: string;
  onChange?: (value: string) => void;
}) {
  const fieldCls =
    variant === "outline"
      ? "bg-white border border-ink-200"
      : "bg-ink-100/60 border-0";
  const controlled = onChange !== undefined;
  return (
    <div className="relative inline-flex items-center">
      <select
        className={`appearance-none pl-3 pr-8 py-2 rounded-xl text-[13px] text-ink-600 outline-none cursor-pointer ${fieldCls}`}
        value={controlled ? (value ?? "") : undefined}
        defaultValue={controlled ? undefined : ""}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="" disabled>{label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-3 text-ink-400 pointer-events-none text-[10px]">▾</span>
    </div>
  );
}
