"use client";

import Link from "next/link";
import type { CompanyData } from "../shared/types";
import HorizontalStepper from "../shared/HorizontalStepper";

interface Props {
  data: CompanyData;
  onChange: (d: CompanyData) => void;
  onContinue: () => void;
}

export default function Step1CompanyDetails({ data, onChange, onContinue }: Props) {
  const set = <K extends keyof CompanyData>(k: K, v: CompanyData[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="flex-1 grid lg:grid-cols-[360px_1fr]">
      {/* ─────────────── LEFT SIDEBAR ─────────────── */}
      <aside className="bg-[#F4F1FF] px-8 py-10 hidden lg:flex flex-col gap-7">
        <div>
          <h1 className="font-display text-[28px] leading-[1.15] font-extrabold tracking-tight">
            Let&apos;s build the<br />future of hiring,<br />
            <span className="gradient-text">together.</span>
          </h1>
          <p className="mt-3 text-ink-500 text-[13.5px] leading-[1.6] max-w-[280px]">
            Create your company account and find the right talent, faster with{" "}
            <span className="text-brand-700 font-semibold">HireMind</span>.
          </p>
        </div>

        {/* Illustration placeholder */}
        <div className="bg-white rounded-xl aspect-[4/3] flex items-center justify-center text-[10px] text-brand-700 border border-dashed border-brand-300">
          [Illustration: two recruiters at desk]
        </div>

        <ul className="space-y-3.5">
          <BadgeItem icon="shield" title="Trusted Platform" body="Secure, reliable and used by 50,000+ recruitment professionals." />
          <BadgeItem icon="users"  title="Better Matches"    body="AI-powered matching helps you connect with the best talent faster." />
          <BadgeItem icon="chart"  title="Data-Driven Hiring" body="Powerful analytics to streamline your hiring and improve outcomes." />
          <BadgeItem icon="head"   title="Dedicated Support" body="We're here to help you at every step of your hiring journey." />
        </ul>

        <div className="pt-2 border-t border-brand-200/60">
          <div className="text-[11px] text-ink-500 text-center mb-2.5">Trusted by leading recruitment teams</div>
          <div className="flex items-center justify-around gap-2 text-[10px]">
            <span className="font-bold text-ink-700">NEXUS<br /><span className="text-[7px] font-normal text-ink-500">RECRUITMENT</span></span>
            <span className="font-bold text-brand-700">PEOPLE<br /><span className="text-[7px] font-normal text-ink-500">FIRST</span></span>
            <span className="font-bold text-ink-900">HIRE<br /><span className="text-[7px] font-normal text-ink-500">SOLUTIONS</span></span>
            <span className="font-bold text-green-600">CAREER<br /><span className="text-[7px] font-normal text-ink-500">CONNECT</span></span>
            <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-semibold">+2K more</span>
          </div>
        </div>
      </aside>

      {/* ─────────────── RIGHT FORM ─────────────── */}
      <div className="flex flex-col">
        <div className="flex-1 px-8 lg:px-12 py-10">
          <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-7 lg:p-9 max-w-[1100px] mx-auto">
            {/* Header row + stepper */}
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <BuildingIcon />
                </div>
                <div>
                  <h2 className="font-display text-[22px] font-extrabold tracking-tight">Create your company account</h2>
                  <p className="text-ink-500 text-[13px] mt-0.5">Fill in the details below to get started.</p>
                </div>
              </div>
              <HorizontalStepper current={1} />
            </div>

            {/* Company Information */}
            <Section title="Company Information">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Company / Agency Name" required icon={<BuildingIcon size={14} />}
                  value={data.companyName} onChange={(v) => set("companyName", v)} placeholder="Enter company or agency name" />
                <Field label="Legal Business Name" required icon={<DocIcon />}
                  value={data.legalName} onChange={(v) => set("legalName", v)} placeholder="Enter legal business name" />
                <Field label="Website (Optional)" icon={<GlobeIcon />}
                  value={data.website} onChange={(v) => set("website", v)} placeholder="https://www.yourcompany.com" />

                <Select label="Industry / Specialization" required icon={<BriefcaseIcon />}
                  value={data.industry} onChange={(v) => set("industry", v)} placeholder="Select primary industry"
                  options={["IT Services & Consulting", "Finance", "Healthcare", "Manufacturing", "Education", "Other"]} />
                <Select label="Company Size" required icon={<UsersIcon />}
                  value={data.companySize} onChange={(v) => set("companySize", v)} placeholder="Select company size"
                  options={["1-10 Employees", "11-50 Employees", "51-200 Employees", "201-500 Employees", "500+ Employees"]} />
                <Field label="Founded Year (Optional)" icon={<CalendarIcon />}
                  value={data.foundedYear} onChange={(v) => set("foundedYear", v)} placeholder="Select founded year" />

                <Select label="Company Type" required icon={<TagIcon />}
                  value={data.companyType} onChange={(v) => set("companyType", v)} placeholder="Select company type"
                  options={["Private Limited", "Public Limited", "LLP", "Partnership", "Proprietorship"]} />
                <Field label="GST Number (Optional)" icon={<DocIcon />}
                  value={data.gstNumber} onChange={(v) => set("gstNumber", v)} placeholder="Enter GST number" />
                <Field label="PAN Number (Optional)" icon={<DocIcon />}
                  value={data.panNumber} onChange={(v) => set("panNumber", v)} placeholder="Enter PAN number" />
              </div>
            </Section>

            {/* Office Address */}
            <Section title="Office Address">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Country" required icon={<PinIcon />}
                  value={data.country} onChange={(v) => set("country", v)} placeholder="Select country"
                  options={["India", "United States", "United Kingdom", "Singapore", "UAE"]} />
                <Select label="State / Province" required icon={<PinIcon />}
                  value={data.state} onChange={(v) => set("state", v)} placeholder="Select state or province"
                  options={["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Telangana"]} />
                <Field label="City" required icon={<DocIcon />}
                  value={data.city} onChange={(v) => set("city", v)} placeholder="Enter city" />
              </div>

              <div className="mt-4">
                <Label required>Complete Address</Label>
                <div className="relative">
                  <textarea
                    value={data.address ?? ""}
                    onChange={(e) => set("address", e.target.value.slice(0, 200))}
                    rows={2}
                    maxLength={200}
                    placeholder="Enter complete office address"
                    className="w-full px-4 py-3 pr-16 rounded-lg border border-ink-200 text-[13.5px] resize-none focus:outline-none focus:border-brand-400 placeholder:text-ink-400"
                  />
                  <span className="absolute bottom-2.5 right-3 text-[11px] text-ink-400">{(data.address ?? "").length}/200</span>
                </div>
              </div>
            </Section>

            {/* Additional Information */}
            <Section title="Additional Information">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label>About Your Company (Optional)</Label>
                  <div className="relative">
                    <textarea
                      value={data.about ?? ""}
                      onChange={(e) => set("about", e.target.value.slice(0, 200))}
                      rows={4}
                      maxLength={200}
                      placeholder="Briefly describe your company, services and what makes you unique"
                      className="w-full px-4 py-3 pr-16 rounded-lg border border-ink-200 text-[13.5px] resize-none focus:outline-none focus:border-brand-400 placeholder:text-ink-400"
                    />
                    <span className="absolute bottom-2.5 right-3 text-[11px] text-ink-400">{(data.about ?? "").length}/200</span>
                  </div>
                </div>
                <div>
                  <Label>Company Logo (Optional)</Label>
                  <div className="rounded-lg border border-dashed border-brand-300 bg-brand-50/40 px-6 py-7 flex flex-col items-center justify-center text-center">
                    <div className="w-11 h-11 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mb-2">
                      <UploadIcon />
                    </div>
                    <div className="text-brand-700 font-semibold text-[13.5px]">Upload logo</div>
                    <div className="text-[11px] text-ink-500 mt-0.5">JPG, PNG or SVG (Max 2MB)</div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Terms */}
            <div className="mt-6 flex items-center gap-2">
              <input
                id="cd-agree"
                type="checkbox"
                checked={!!data.agree}
                onChange={(e) => set("agree", e.target.checked)}
                className="w-4 h-4 accent-brand-600"
              />
              <label htmlFor="cd-agree" className="text-[13px] text-ink-700">
                I agree to the <a className="text-brand-700 font-semibold">Terms &amp; Conditions</a>{" "}
                and <a className="text-brand-700 font-semibold">Privacy Policy</a>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={onContinue}
                disabled={!data.agree}
                className="px-6 py-2.5 rounded-lg text-white text-[13.5px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition inline-flex items-center gap-2"
                style={{ background: "var(--gradient-brand)" }}
              >
                Continue <ArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom trust strip */}
        <BottomStrip />
      </div>
    </div>
  );
}

/* ────────────────── Section + Form primitives ────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7 pt-6 border-t border-ink-100 first:border-0 first:pt-0 first:mt-7">
      <h3 className="font-display font-bold text-[14px] mb-3.5">{title}</h3>
      {children}
    </section>
  );
}
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}
function Field({ label, required, icon, value, onChange, placeholder }: {
  label: string; required?: boolean; icon?: React.ReactNode;
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>}
        <input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? "pl-9" : "pl-3"} pr-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] focus:outline-none focus:border-brand-400 placeholder:text-ink-400`}
        />
      </div>
    </div>
  );
}
function Select({ label, required, icon, value, onChange, placeholder, options }: {
  label: string; required?: boolean; icon?: React.ReactNode;
  value: string; onChange: (v: string) => void; placeholder?: string; options: string[];
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>}
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${icon ? "pl-9" : "pl-3"} pr-9 py-2.5 rounded-lg border border-ink-200 text-[13.5px] bg-white focus:outline-none focus:border-brand-400 ${value ? "text-ink-900" : "text-ink-400"} appearance-none`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">▾</span>
      </div>
    </div>
  );
}

/* ────────────────── Bits ────────────────── */
function BadgeItem({ icon, title, body }: { icon: "shield" | "users" | "chart" | "head"; title: string; body: string }) {
  const icons = { shield: <ShieldIcon />, users: <UsersIcon />, chart: <ChartIcon />, head: <HeadsetIcon /> };
  return (
    <li className="flex items-start gap-2.5">
      <span className="w-8 h-8 rounded-md bg-white text-brand-600 flex items-center justify-center shrink-0">{icons[icon]}</span>
      <div className="leading-snug">
        <div className="text-[12.5px] font-bold text-ink-900">{title}</div>
        <div className="text-[11px] text-ink-500">{body}</div>
      </div>
    </li>
  );
}
function BottomStrip() {
  const items: { icon: React.ReactNode; title: string; body: string }[] = [
    { icon: <ShieldIcon />,  title: "Secure & Safe",   body: "Your data is encrypted and 100% secure" },
    { icon: <ShieldIcon />,  title: "GDPR Compliant",  body: "We follow global data privacy standards" },
    { icon: <LockIcon />,    title: "No Spam",         body: "We respect your privacy. No spam, ever." },
    { icon: <HeadsetIcon />, title: "24/7 Support",    body: "Need help? Our support team is here for you." },
  ];
  return (
    <div className="bg-white border-t border-ink-100 px-8 lg:px-12 py-5">
      <div className="max-w-[1100px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((i) => (
          <div key={i.title} className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">{i.icon}</span>
            <div className="leading-snug">
              <div className="text-[12.5px] font-bold text-ink-900">{i.title}</div>
              <div className="text-[11px] text-ink-500">{i.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────── Inline SVG icons ────────────────── */
function BuildingIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function DocIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function GlobeIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function BriefcaseIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function UsersIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" /><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2-3 3.5-3 2 0 3.5 1 3.5 3" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function CalendarIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function TagIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 12V4h8l10 10-8 8L3 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>); }
function PinIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function UploadIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.7-1A4 4 0 0 0 7 18z" stroke="currentColor" strokeWidth="1.6" /><path d="M12 12v6M9 15l3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ShieldIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function ChartIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4v16h16" stroke="currentColor" strokeWidth="1.6" /><path d="M7 17l4-5 3 3 5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function HeadsetIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1v-5zm16 0h-3v6h2a1 1 0 0 0 1-1v-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>); }
function LockIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function ArrowRight() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
