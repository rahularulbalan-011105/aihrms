import { Glyph, CheckIcon } from "@/components/marketing/icons";
import { BLOCKS } from "./blocks";

export type Chip = {
  text: string;
  tone: "green" | "purple" | "orange";
  iconCheck?: boolean;
};

export type FeatureCardData = {
  icon: string;
  title: string;
  body: string;
  badge?: string;
  chip?: Chip;
  /** Optional preview block rendered at the bottom (key into BLOCKS). */
  block?: string;
};

const CHIP_TONE: Record<Chip["tone"], string> = {
  green: "bg-green-50 text-green-700 border border-green-100",
  purple: "bg-brand-50 text-brand-700 border border-brand-100",
  orange: "bg-orange-50 text-orange-700 border border-orange-100",
};

export default function FeatureCard({ icon, title, body, badge, chip, block }: FeatureCardData) {
  const Block = block ? BLOCKS[block] : undefined;
  return (
    <div className="card p-4 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-md bg-brand-50 flex items-center justify-center text-brand-600">
          <Glyph name={icon} />
        </div>
        {badge && (
          <span className="text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 font-display font-bold text-[13px] leading-tight">
        {title}
      </div>
      <p className="mt-1.5 text-ink-500 text-[11.5px] leading-relaxed">{body}</p>
      {chip && (
        <div
          className={`mt-3 inline-flex w-fit items-center gap-1 text-[10px] px-2 py-1 rounded-md font-semibold ${CHIP_TONE[chip.tone]}`}
        >
          {chip.iconCheck && <CheckIcon />} {chip.text}
        </div>
      )}
      {Block && (
        <div className="mt-3">
          <Block />
        </div>
      )}
    </div>
  );
}
