import Link from "next/link";
import BrandLogo from "@/components/marketing/BrandLogo";

interface AuthHeaderCta {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AuthHeaderProps {
  cta: AuthHeaderCta;
  /** Show bottom border — default false */
  border?: boolean;
  /** Make header sticky (registration pages) */
  sticky?: boolean;
  /** Optional text shown before the CTA button */
  preCtaText?: string;
}

export default function AuthHeader({
  cta,
  border = false,
  sticky = false,
  preCtaText,
}: AuthHeaderProps) {
  return (
    <header className={`shrink-0 bg-white ${border ? "border-b border-ink-100" : ""} ${sticky ? "sticky top-0 z-20" : ""}`}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-[72px] flex items-center justify-between">
        <Link href="/">
          <BrandLogo size="md" />
        </Link>
        <div className="flex items-center gap-3">
          {preCtaText && (
            <span className="text-[13.5px] text-ink-500 hidden sm:inline">{preCtaText}</span>
          )}
          {!preCtaText && (
            <Link href="/contact" className="text-[14px] text-ink-600 hover:text-ink-900 flex items-center gap-1.5 transition">
              <InfoIcon /> Need help?
            </Link>
          )}
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border-2 border-brand-600 text-brand-600 text-[14px] font-semibold hover:bg-brand-50 transition"
          >
            {cta.icon} {cta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
