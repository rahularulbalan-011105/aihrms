import Link from "next/link";

interface RoleCardProps {
  illustration: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaClass: string;
  footerIcon: React.ReactNode;
  footerLabel: string;
}

export default function RoleCard({
  illustration,
  icon,
  title,
  description,
  features,
  ctaLabel,
  ctaHref,
  ctaClass,
  footerIcon,
  footerLabel,
}: RoleCardProps) {
  return (
    <div className="bg-[#EDE9FF] rounded-2xl border border-[#DDD6FE] overflow-hidden flex flex-col shadow-sm">
      {/* ── Top: illustration + content ── */}
      <div className="flex flex-1">
        {/* Left – character illustration */}
        <div className="relative w-[44%] shrink-0 min-h-[280px]">
          {illustration}
        </div>

        {/* Right – content */}
        <div className="flex-1 px-5 py-5 flex flex-col justify-center">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-11 h-11 rounded-full bg-white/60 border border-[#C4B5FD] flex items-center justify-center text-brand-600 shrink-0">
              {icon}
            </div>
            <h2 className="font-display font-extrabold text-[20px] text-brand-700 leading-tight">
              {title}
            </h2>
          </div>
          <p className="text-ink-600 text-[12.5px] mb-3 leading-relaxed">
            {description}
          </p>
          <ul className="space-y-2">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-[12.5px] text-ink-700"
              >
                <CheckIcon /> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom: CTA right-aligned to match content column ── */}
      <div className="px-4 pb-3 pt-1">
        <Link
          href={ctaHref}
          className={`ml-auto w-[56%] py-3 rounded-xl text-white font-bold text-[14px] flex items-center justify-center gap-2 hover:opacity-95 transition ${ctaClass}`}
        >
          {ctaLabel} <ArrowRightIcon />
        </Link>
        <p className="mt-2 text-center text-[11.5px] text-ink-500 flex items-center justify-center gap-1.5">
          {footerIcon} {footerLabel}
        </p>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
        <path
          d="M2 6l3 3 5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10m0 0L8 3m5 5l-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
