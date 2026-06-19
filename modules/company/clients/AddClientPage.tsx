"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ── Option lists ─────────────────────────────────────────────────────── */
const INDUSTRIES = ["Information Technology", "Finance & Banking", "Healthcare", "Manufacturing", "Retail & E-commerce", "Education", "Consulting", "Other"];
const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "501–1000", "1000+"];
const COMPANY_TYPES = ["Private Limited", "Public Limited", "Partnership", "Proprietorship", "LLP", "Other"];
const REVENUES = ["< $1M", "$1M – $10M", "$10M – $50M", "$50M – $100M", "$100M+"];
const COUNTRIES = ["India", "United States", "United Kingdom", "Singapore", "United Arab Emirates", "Australia"];
const TIMEZONES = ["(GMT +05:30) Asia/Kolkata", "(GMT +00:00) UTC", "(GMT -05:00) New York", "(GMT +01:00) London"];
const DEPARTMENTS = ["Human Resources", "Engineering", "Finance", "Operations", "Sales", "Marketing", "Other"];
const COUNTRY_CODES = ["+91", "+1", "+44", "+65", "+971"];

interface ClientForm {
  clientName: string; website: string; industry: string;
  companySize: string; companyType: string; annualRevenue: string;
  headquarters: string; country: string; timeZone: string;
  contactName: string; email: string; countryCode: string; phone: string;
  designation: string; department: string; linkedin: string;
  sameAsBilling: boolean;
  billingEmail: string; billingCountryCode: string; billingPhone: string; billingAddress: string;
  city: string; state: string; postalCode: string;
}

const EMPTY: ClientForm = {
  clientName: "", website: "", industry: "",
  companySize: "", companyType: "", annualRevenue: "",
  headquarters: "", country: "", timeZone: "",
  contactName: "", email: "", countryCode: "+91", phone: "",
  designation: "", department: "", linkedin: "",
  sameAsBilling: false,
  billingEmail: "", billingCountryCode: "+91", billingPhone: "", billingAddress: "",
  city: "", state: "", postalCode: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddClientPage() {
  const router = useRouter();
  const [form, setForm] = useState<ClientForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientForm, string>>>({});
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof ClientForm>(key: K, value: ClientForm[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Mirror primary contact into billing when the box is ticked.
      if (next.sameAsBilling) {
        if (key === "email") next.billingEmail = value as string;
        if (key === "phone") next.billingPhone = value as string;
        if (key === "countryCode") next.billingCountryCode = value as string;
        if (key === "sameAsBilling" && value) {
          next.billingEmail = prev.email;
          next.billingPhone = prev.phone;
          next.billingCountryCode = prev.countryCode;
        }
      }
      return next;
    });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function validate(): boolean {
    const errs: Partial<Record<keyof ClientForm, string>> = {};
    if (!form.clientName.trim()) errs.clientName = "Client name is required";
    if (!form.industry) errs.industry = "Industry is required";
    if (!form.headquarters.trim()) errs.headquarters = "Headquarters / location is required";
    if (!form.country) errs.country = "Country is required";
    if (!form.contactName.trim()) errs.contactName = "Primary contact name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!EMAIL_RE.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.billingEmail.trim()) errs.billingEmail = "Billing email is required";
    else if (!EMAIL_RE.test(form.billingEmail)) errs.billingEmail = "Enter a valid email address";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    // No clients backend yet — confirm locally so the flow is usable.
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-ink-500 mb-2">
        <Link href="/company/clients" className="hover:text-brand-600 transition-colors">Clients</Link>
        <span aria-hidden="true">›</span>
        <span className="text-ink-700 font-medium">Add New Client</span>
      </div>

      {/* Title */}
      <h1 className="font-display font-extrabold text-[22px] text-ink-900 tracking-tight">Add New Client</h1>
      <p className="text-[13.5px] text-ink-500 mt-1 mb-5">
        Add client organization details to start managing your relationship and jobs.
      </p>

      <div className="flex gap-6 items-start">
        {/* ── Main form ── */}
        <div className="flex-1 min-w-0 space-y-5">
          {saved && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[13px] font-semibold flex items-center gap-2">
              <CheckIcon /> Client saved successfully.
            </div>
          )}

          <div className="card p-6">
            {/* Company Information */}
            <Section title="Company Information" icon={<BuildingIcon />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Client Name" required value={form.clientName} onChange={(v) => set("clientName", v)} placeholder="Enter client / company name" error={errors.clientName} maxLength={200} />
                <Field label="Website" value={form.website} onChange={(v) => set("website", v)} placeholder="www.company.com" maxLength={300} />
                <SelectField label="Industry" required value={form.industry} onChange={(v) => set("industry", v)} placeholder="Select industry" options={INDUSTRIES} error={errors.industry} />
                <SelectField label="Company Size" value={form.companySize} onChange={(v) => set("companySize", v)} placeholder="Select company size" options={COMPANY_SIZES} />
                <SelectField label="Company Type" value={form.companyType} onChange={(v) => set("companyType", v)} placeholder="Select company type" options={COMPANY_TYPES} />
                <SelectField label="Annual Revenue" value={form.annualRevenue} onChange={(v) => set("annualRevenue", v)} placeholder="Select revenue range" options={REVENUES} />
                <Field label="Headquarters / Location" required value={form.headquarters} onChange={(v) => set("headquarters", v)} placeholder="Enter headquarters location" error={errors.headquarters} maxLength={200} />
                <SelectField label="Country" required value={form.country} onChange={(v) => set("country", v)} placeholder="Select country" options={COUNTRIES} error={errors.country} />
                <SelectField label="Time Zone" value={form.timeZone} onChange={(v) => set("timeZone", v)} placeholder="Select time zone" options={TIMEZONES} />
              </div>
            </Section>

            {/* Primary Contact Information */}
            <Section title="Primary Contact Information" icon={<UserIcon />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Primary Contact Name" required value={form.contactName} onChange={(v) => set("contactName", v)} placeholder="Enter full name" error={errors.contactName} maxLength={150} />
                <Field label="Email Address" required value={form.email} onChange={(v) => set("email", v)} placeholder="Enter email address" error={errors.email} maxLength={150} />
                <PhoneField label="Phone Number" required cc={form.countryCode} onCc={(v) => set("countryCode", v)} value={form.phone} onValue={(v) => set("phone", v)} placeholder="Enter phone number" error={errors.phone} />
                <Field label="Designation" value={form.designation} onChange={(v) => set("designation", v)} placeholder="Enter designation" maxLength={100} />
                <SelectField label="Department" value={form.department} onChange={(v) => set("department", v)} placeholder="Select department" options={DEPARTMENTS} />
                <Field label="LinkedIn Profile (Optional)" value={form.linkedin} onChange={(v) => set("linkedin", v)} placeholder="https://linkedin.com/in/username" maxLength={300} />
              </div>
              <label className="mt-4 inline-flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.sameAsBilling} onChange={(e) => set("sameAsBilling", e.target.checked)} className="w-4 h-4 rounded accent-brand-600" />
                <span className="text-[13px] text-ink-700">This is also the billing contact</span>
              </label>
            </Section>

            {/* Billing Information */}
            <Section title="Billing Information" icon={<CardIcon />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Billing Email" required value={form.billingEmail} onChange={(v) => set("billingEmail", v)} placeholder="Enter billing email" error={errors.billingEmail} maxLength={150} />
                <PhoneField label="Billing Phone" cc={form.billingCountryCode} onCc={(v) => set("billingCountryCode", v)} value={form.billingPhone} onValue={(v) => set("billingPhone", v)} placeholder="Enter billing phone number" />
                <Field label="Billing Address" value={form.billingAddress} onChange={(v) => set("billingAddress", v)} placeholder="Enter billing address" maxLength={300} />
                <Field label="City" value={form.city} onChange={(v) => set("city", v)} placeholder="Enter city" maxLength={100} />
                <Field label="State / Province" value={form.state} onChange={(v) => set("state", v)} placeholder="Enter state / province" maxLength={100} />
                <Field label="Postal / ZIP Code" value={form.postalCode} onChange={(v) => set("postalCode", v)} placeholder="Enter postal / zip code" maxLength={20} />
              </div>
            </Section>
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-end gap-3 border-t border-ink-100 pt-4">
            <button
              type="button"
              onClick={() => router.push("/company/clients")}
              className="px-6 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg text-white text-[13.5px] font-semibold hover:opacity-95 transition inline-flex items-center gap-2"
              style={{ background: "var(--gradient-brand)" }}
            >
              Save Client <ChevronRight />
            </button>
          </div>
        </div>

        {/* ── Right rail ── */}
        <aside className="w-[320px] shrink-0 hidden xl:block space-y-4">
          <RailCard icon={<BuildingIcon />} title="Why Add a Client?">
            <p className="text-[12px] text-ink-500 mb-2.5">Adding clients helps you:</p>
            <ul className="space-y-2">
              {["Manage client relationships efficiently", "Track jobs and hiring progress", "Organize contacts and communications", "Generate client-specific reports"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-[12.5px] text-ink-700">
                  <span className="text-green-600 mt-0.5 shrink-0"><CheckIcon /></span> {t}
                </li>
              ))}
            </ul>
          </RailCard>

          <RailCard icon={<InfoIcon />} title="Information Guide">
            <p className="text-[12.5px] text-ink-600 leading-relaxed">
              Please provide accurate information. Fields marked with <span className="text-red-500">*</span> are mandatory.
              You can add contacts and jobs after creating the client.
            </p>
          </RailCard>

          <RailCard icon={<RocketIcon />} title="What's Next?">
            <ol className="space-y-2.5">
              {["Add client information", "Add key contacts (optional)", "Create job openings", "Start hiring!"].map((t, i) => (
                <li key={t} className="flex items-center gap-2.5 text-[12.5px] text-ink-700">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold grid place-items-center shrink-0">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
          </RailCard>
        </aside>
      </div>
    </div>
  );
}

/* ── Form primitives (match company-reg styling) ──────────────────────── */
function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-7 pt-6 border-t border-ink-100 first:border-0 first:pt-0 first:mt-0">
      <h2 className="font-display font-bold text-[15px] mb-3.5 flex items-center gap-2 text-ink-900">
        {icon && <span className="text-brand-600">{icon}</span>} {title}
      </h2>
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

function Field({ label, required, value, onChange, placeholder, error, maxLength }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; maxLength?: number;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-3 py-2.5 rounded-lg border ${error ? "border-red-400" : "border-ink-200"} text-[13.5px] focus:outline-none focus:border-brand-400 placeholder:text-ink-400`}
      />
      {error && <p className="mt-1 text-[11px] text-red-500" role="alert">{error}</p>}
    </div>
  );
}

function SelectField({ label, required, value, onChange, placeholder, options, error }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
  placeholder?: string; options: string[]; error?: string;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-3 pr-9 py-2.5 rounded-lg border ${error ? "border-red-400" : "border-ink-200"} text-[13.5px] bg-white focus:outline-none focus:border-brand-400 ${value ? "text-ink-900" : "text-ink-400"} appearance-none`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><ChevronDown /></span>
      </div>
      {error && <p className="mt-1 text-[11px] text-red-500" role="alert">{error}</p>}
    </div>
  );
}

function PhoneField({ label, required, cc, onCc, value, onValue, placeholder, error }: {
  label: string; required?: boolean; cc: string; onCc: (v: string) => void;
  value: string; onValue: (v: string) => void; placeholder: string; error?: string;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="flex gap-2">
        <div className="relative">
          <select value={cc} onChange={(e) => onCc(e.target.value)}
            className="pl-3 pr-7 py-2.5 rounded-lg border border-ink-200 text-[13.5px] bg-white focus:outline-none focus:border-brand-400 appearance-none">
            {COUNTRY_CODES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><ChevronDown /></span>
        </div>
        <input
          value={value ?? ""}
          onChange={(e) => onValue(e.target.value.replace(/\D/g, "").slice(0, 10))}
          inputMode="numeric"
          maxLength={10}
          placeholder={placeholder}
          className={`flex-1 px-3 py-2.5 rounded-lg border ${error ? "border-red-400" : "border-ink-200"} text-[13.5px] focus:outline-none focus:border-brand-400 placeholder:text-ink-400`}
        />
      </div>
      {error && <p className="mt-1 text-[11px] text-red-500" role="alert">{error}</p>}
    </div>
  );
}

function RailCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0">{icon}</span>
        <h3 className="font-display font-bold text-[14px] text-ink-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────────────── */
function BuildingIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" stroke="currentColor" strokeWidth="1.6" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function UserIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function CardIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function InfoIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>); }
function RocketIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 15c-1 2-1 5-1 5s3 0 5-1m-4-4a8 8 0 0 1 11-11c2 0 3 1 3 3a8 8 0 0 1-11 11l-3 1 1-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="14.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function CheckIcon() { return (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ChevronDown() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ChevronRight() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
