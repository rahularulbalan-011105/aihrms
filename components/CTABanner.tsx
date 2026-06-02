import Link from "next/link";

type Action = { label: string; href: string; icon?: "arrow" | "play" };

interface Props {
  title: string;
  description: string;
  primary: Action;
  secondary: Action;
}

export default function CTABanner({ title, description, primary, secondary }: Props) {
  return (
    <section className="px-6 lg:px-10 mt-16 lg:mt-24">
      <div
        className="mx-auto max-w-[1280px] rounded-2xl overflow-hidden relative px-8 lg:px-12 py-8 lg:py-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-8"
        style={{ background: "var(--gradient-brand)" }}
      >
        {/* Illustration placeholder on the left */}
        <div className="hidden md:block w-[260px] shrink-0">
          <div
            className="rounded-xl"
            style={{
              minHeight: 140,
              background: "rgba(255,255,255,0.08)",
              border: "1px dashed rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.85)",
              fontSize: 12,
              padding: 16,
              textAlign: "center",
            }}
          >
            [Illustration:
            <br />
            purple-hoodie character
            <br />
            + robot mascot]
          </div>
        </div>

        <div className="flex-1 text-white">
          <h3 className="text-[22px] lg:text-[26px] font-extrabold tracking-tight">
            {title}
          </h3>
          <p className="mt-2 text-white/85 text-[14px] lg:text-[15px] max-w-[600px]">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 lg:shrink-0">
          <CTAButton action={primary} variant="primary" />
          <CTAButton action={secondary} variant="ghost" />
        </div>
      </div>
    </section>
  );
}

function CTAButton({ action, variant }: { action: Action; variant: "primary" | "ghost" }) {
  const classes =
    variant === "primary"
      ? "bg-white text-brand-700 hover:bg-brand-50"
      : "bg-transparent text-white border border-white/40 hover:bg-white/10";
  return (
    <Link
      href={action.href}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[14px] font-semibold transition ${classes}`}
    >
      {action.label}
      {action.icon === "arrow" && (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {action.icon === "play" && (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6.5 5.5l4 2.5-4 2.5v-5z" fill="currentColor" />
        </svg>
      )}
    </Link>
  );
}
