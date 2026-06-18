import { PersonStatIcon } from "./icons";

export type Stat = { value: string; label: string; caption: string };

type Props = {
  stats: Stat[];
  /** Max width of the inner card. Defaults to the home-page width. */
  maxWidth?: string;
  /** Extra classes for the wrapping <section> (e.g. top margin). */
  sectionClassName?: string;
};

/**
 * Horizontal strip of headline stats inside a card surface.
 * Shared by the home and AI-capabilities pages.
 */
export default function StatsStrip({ stats, maxWidth = "max-w-[1280px]", sectionClassName = "" }: Props) {
  return (
    <section className={`px-6 lg:px-10 ${sectionClassName}`}>
      <div className={`mx-auto ${maxWidth} card px-6 lg:px-10 py-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4`}>
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <div className="w-12 h-12 shrink-0 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
              <PersonStatIcon />
            </div>
            <div className="leading-tight">
              <div className="font-display font-extrabold text-[22px] text-ink-900">{stat.value}</div>
              <div className="text-[12px] font-semibold text-ink-900">{stat.label}</div>
              <div className="text-[10px] text-ink-500">{stat.caption}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
