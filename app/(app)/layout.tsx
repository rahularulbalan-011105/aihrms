import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <header className="bg-white border-b border-ink-100 sticky top-0 z-30">
        <div className="mx-auto max-w-[1400px] px-6 py-3 flex items-center justify-between gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Link href="/"><img src="/logo.png" alt="HireMind" height={56} width={82} style={{ height: "56px", width: "auto", objectFit: "contain" }} /></Link>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: "/dashboard",      label: "Dashboard" },
              { href: "/jobs",           label: "Jobs" },
              { href: "/candidates",     label: "Candidates" },
              { href: "/notifications",  label: "Notifications" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="text-[14px] font-medium text-ink-600 hover:text-ink-900 transition">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-[13px]">
              U
            </div>
            <Link href="/login" className="text-[13px] text-ink-500 hover:text-ink-700 transition">
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-6">
        {children}
      </main>
    </div>
  );
}
