type Props = {
  children: React.ReactNode;
  /** Leading glyph before the label. Defaults to the brand sparkle. */
  glyph?: React.ReactNode;
};

/** Small rounded brand-tinted eyebrow pill used at the top of marketing sections. */
export default function Pill({ children, glyph = "✦" }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 text-[12.5px] font-semibold border border-brand-100">
      <span className="text-brand-500">{glyph}</span>
      {children}
    </span>
  );
}
