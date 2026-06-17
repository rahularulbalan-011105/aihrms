"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "./BrandLogo";

const NAV = [
  { href: "/",                title: "Home" },
  { href: "/features",        title: "Features" },
  { href: "/ai-capabilities", title: "AI Capabilities" },
  { href: "/pricing",         title: "Pricing" },
  { href: "/integrations",    title: "Integrations" },
  { href: "/faq",             title: "FAQ" },
];

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-ink-100 shadow-sm min-h-[72px]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-[72px] flex items-center gap-6">
        <Link href="/" className="shrink-0 flex items-center">
          <BrandLogo size="md" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 mx-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[14px] font-medium transition relative ${
                isActive(item.href)
                  ? "text-brand-600"
                  : "text-ink-700 hover:text-ink-900"
              }`}
            >
              {item.title}
              {isActive(item.href) && (
                <span className="absolute -bottom-[6px] left-0 right-0 h-[2px] bg-brand-600 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 ml-auto lg:ml-0">
          <Link
            href="/login"
            className="hidden sm:inline-flex px-5 py-2.5 rounded-lg border border-ink-200 text-[14px] font-semibold text-ink-700 hover:bg-ink-100 transition"
          >
            Login
          </Link>
          <Link
            href="/book-demo"
            className="inline-flex px-5 py-2.5 rounded-lg text-white text-[14px] font-semibold shadow-sm hover:opacity-95 transition"
            style={{ background: "var(--gradient-brand)" }}
          >
            Book Demo
          </Link>
        </div>
      </div>
    </header>
  );
}
