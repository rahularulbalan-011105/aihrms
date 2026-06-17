import Link from "next/link";

const LEGAL_LINKS = [
  { href: "/privacy",  title: "Privacy Policy" },
  { href: "/terms",    title: "Terms of Service" },
  { href: "/security", title: "Security" },
  { href: "/contact",  title: "Contact Us" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-ink-100 mt-auto">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[13px] text-ink-500">
          Powered by{" "}
          <Link href="/" className="text-brand-600 font-semibold hover:underline">
            ArvantraAI
          </Link>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
          {LEGAL_LINKS.map((l, i) => (
            <span key={l.href} className="flex items-center">
              <Link
                href={l.href}
                className="text-[13px] text-ink-500 hover:text-ink-900 transition px-2"
              >
                {l.title}
              </Link>
              {i < LEGAL_LINKS.length - 1 && (
                <span className="text-ink-200">|</span>
              )}
            </span>
          ))}
        </nav>

        <div className="text-[13px] text-ink-500">
          © 2026 HireMind. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
