"use client";

import { useState } from "react";
import type { AdminData } from "../shared/types";
import HorizontalStepper from "../shared/HorizontalStepper";
import VerticalStepper from "../shared/VerticalStepper";

interface Props {
  data: AdminData;
  onChange: (d: AdminData) => void;
  onBack: () => void;
  onContinue: () => void;
}

const COUNTRY_CODES = ["+91", "+1", "+44", "+65", "+971"];
const TIMEZONES = ["(GMT +05:30) Asia/Kolkata", "(GMT +00:00) UTC", "(GMT -05:00) New York", "(GMT +01:00) London"];
const LANGUAGES = ["English", "Hindi", "Spanish", "French"];
const NOTIFY_OPTS = ["Receive important updates", "Receive all updates", "Critical only", "None"];

export default function Step2AdminDetails({ data, onChange, onBack, onContinue }: Props) {
  const set = <K extends keyof AdminData>(k: K, v: AdminData[K]) => onChange({ ...data, [k]: v });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const pwd = data.password ?? "";
  const checks = {
    length: pwd.length >= 8,
    upper:  /[A-Z]/.test(pwd),
    number: /\d/.test(pwd),
    special:/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`]/.test(pwd),
  };

  return (
    <div className="flex-1 grid lg:grid-cols-[360px_1fr]">
      {/* ─────────────── LEFT SIDEBAR ─────────────── */}
      <aside className="bg-[#F4F1FF] px-7 py-8 hidden lg:flex flex-col gap-6">
        <h2 className="font-display text-[18px] font-extrabold tracking-tight">Create your company account</h2>

        <VerticalStepper
          current={2}
          steps={[
            { n: 1, title: "Company Details", caption: "Completed",                     done: true  },
            { n: 2, title: "Admin Details",   caption: "Add administrator information", done: false },
            { n: 3, title: "Verification",    caption: "Verify your email and phone",   done: false },
          ]}
        />

        {/* Illustration */}
        <div className="bg-white rounded-xl aspect-[4/3] flex items-center justify-center text-[10px] text-brand-700 border border-dashed border-brand-300">
          [Illustration: admin with laptop]
        </div>

        <div className="rounded-xl border border-brand-200 bg-white p-4">
          <div className="font-display font-bold text-[13px] mb-2.5">Why add admin details?</div>
          <ul className="space-y-2.5">
            <Why icon="lock"   title="Secure Access"       body="Only authorized admins can manage your account." />
            <Why icon="slider" title="Full Control"        body="Manage jobs, candidates and team members." />
            <Why icon="users"  title="Better Collaboration" body="Invite team members and collaborate seamlessly." />
            <Why icon="shield" title="Data Protection"     body="Your information is encrypted and safe with us." />
          </ul>
        </div>

        <NeedHelpCard />
      </aside>

      {/* ─────────────── RIGHT FORM ─────────────── */}
      <div className="flex flex-col">
        <div className="flex-1 px-8 lg:px-12 py-10">
          <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-7 lg:p-9 max-w-[1100px] mx-auto">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <UserIcon />
                </div>
                <div>
                  <h2 className="font-display text-[22px] font-extrabold tracking-tight">Admin Details</h2>
                  <p className="text-ink-500 text-[13px] mt-0.5">Add the primary administrator who will manage this account.</p>
                </div>
              </div>
              <HorizontalStepper current={2} />
            </div>

            {/* Personal Information */}
            <Section title="Personal Information" icon={<UserIcon size={14} />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Full Name" required icon={<UserIcon size={14} />}
                  value={data.fullName} onChange={(v) => set("fullName", v)} placeholder="Enter full name" />
                <Field label="Designation" required icon={<MailIcon />}
                  value={data.designation} onChange={(v) => set("designation", v)} placeholder="Enter designation" />
                <Field label="Department" icon={<DocIcon />}
                  value={data.department} onChange={(v) => set("department", v)} placeholder="Enter department (e.g., HR, Operations)" />

                <Field label="Email Address" required icon={<MailIcon />}
                  value={data.email} onChange={(v) => set("email", v)} placeholder="Enter admin email address" />

                <div>
                  <Label required>Mobile Number</Label>
                  <PhoneField cc={data.countryCode ?? "+91"} onCc={(v) => set("countryCode", v)}
                    value={data.mobile} onValue={(v) => set("mobile", v)} placeholder="Enter mobile number" />
                </div>

                <div>
                  <Label>Alternate Mobile (Optional)</Label>
                  <PhoneField cc={data.altCountryCode ?? "+91"} onCc={(v) => set("altCountryCode", v)}
                    value={data.altMobile} onValue={(v) => set("altMobile", v)} placeholder="Enter alternate number" />
                </div>
              </div>
            </Section>

            {/* Login Credentials */}
            <Section title="Login Credentials" icon={<LockIcon />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PasswordField label="Password" required value={pwd} onChange={(v) => set("password", v)}
                  show={showPwd} onToggle={() => setShowPwd((s) => !s)} placeholder="Create a strong password" />
                <PasswordField label="Confirm Password" required value={data.confirmPassword ?? ""} onChange={(v) => set("confirmPassword", v)}
                  show={showConfirm} onToggle={() => setShowConfirm((s) => !s)} placeholder="Confirm your password" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <PwdChip ok={checks.length}  label="Min 8 characters" />
                <PwdChip ok={checks.upper}   label="1 uppercase letter" />
                <PwdChip ok={checks.number}  label="1 number" />
                <PwdChip ok={checks.special} label="1 special character" />
              </div>
            </Section>

            {/* Preferences */}
            <Section title="Preferences" icon={<GearIcon />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Default Time Zone" required value={data.timeZone} onChange={(v) => set("timeZone", v)}
                  options={TIMEZONES} placeholder="(GMT +05:30) Asia/Kolkata" />
                <Select label="Preferred Language" required value={data.language} onChange={(v) => set("language", v)}
                  options={LANGUAGES} placeholder="English" />
                <Select label="Email Notifications" required value={data.emailNotifications} onChange={(v) => set("emailNotifications", v)}
                  options={NOTIFY_OPTS} placeholder="Receive important updates" />
              </div>
            </Section>

            {/* Invite Team Members */}
            <Section title="Invite Team Members (Optional)" icon={<UsersIcon />}>
              <p className="text-[12.5px] text-ink-500 mb-2.5">You can invite team members after your account is created.</p>
              <button type="button" className="px-4 py-2 rounded-lg border border-brand-300 text-brand-700 text-[13px] font-semibold hover:bg-brand-50 transition">
                Invite Team Members Later
              </button>
            </Section>

            {/* Bottom buttons */}
            <div className="mt-7 flex items-center justify-between border-t border-ink-100 pt-5">
              <button onClick={onBack} className="px-5 py-2.5 rounded-lg border border-brand-300 text-brand-700 text-[13.5px] font-semibold hover:bg-brand-50 transition inline-flex items-center gap-2">
                <ArrowLeft /> Back
              </button>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition">
                  Save & Exit
                </button>
                <button onClick={onContinue}
                  className="px-6 py-2.5 rounded-lg text-white text-[13.5px] font-semibold hover:opacity-95 transition inline-flex items-center gap-2"
                  style={{ background: "var(--gradient-brand)" }}>
                  Continue <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────── Section + Form primitives ────────────────── */
function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-7 pt-6 border-t border-ink-100 first:border-0 first:pt-0">
      <h3 className="font-display font-bold text-[14px] mb-3.5 flex items-center gap-2 text-ink-900">
        {icon && <span className="text-brand-600">{icon}</span>} {title}
      </h3>
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
function Select({ label, required, value, onChange, placeholder, options }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder?: string; options: string[];
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-3 pr-9 py-2.5 rounded-lg border border-ink-200 text-[13.5px] bg-white focus:outline-none focus:border-brand-400 ${value ? "text-ink-900" : "text-ink-400"} appearance-none`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">▾</span>
      </div>
    </div>
  );
}
function PhoneField({ cc, onCc, value, onValue, placeholder }: {
  cc: string; onCc: (v: string) => void; value: string; onValue: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="flex gap-2">
      <div className="relative">
        <select value={cc} onChange={(e) => onCc(e.target.value)}
          className="pl-3 pr-7 py-2.5 rounded-lg border border-ink-200 text-[13.5px] bg-white focus:outline-none focus:border-brand-400 appearance-none">
          {COUNTRY_CODES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">▾</span>
      </div>
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"><PhoneIcon /></span>
        <input value={value ?? ""} onChange={(e) => onValue(e.target.value)} placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] focus:outline-none focus:border-brand-400 placeholder:text-ink-400" />
      </div>
    </div>
  );
}
function PasswordField({ label, required, value, onChange, show, onToggle, placeholder }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; placeholder: string;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"><LockIcon /></span>
        <input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-ink-200 text-[13.5px] focus:outline-none focus:border-brand-400 placeholder:text-ink-400" />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700" aria-label="Toggle password visibility">
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}
function PwdChip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border font-medium ${
      ok ? "bg-green-50 text-green-700 border-green-100" : "bg-brand-50 text-brand-700 border-brand-100"
    }`}>
      {ok ? "✓" : "○"} {label}
    </span>
  );
}
function Why({ icon, title, body }: { icon: "lock" | "slider" | "users" | "shield"; title: string; body: string }) {
  const icons = { lock: <LockIcon />, slider: <SliderIcon />, users: <UsersIcon />, shield: <ShieldIcon /> };
  return (
    <li className="flex items-start gap-2.5">
      <span className="w-7 h-7 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">{icons[icon]}</span>
      <div className="leading-snug">
        <div className="text-[12px] font-bold text-ink-900">{title}</div>
        <div className="text-[10.5px] text-ink-500">{body}</div>
      </div>
    </li>
  );
}
function NeedHelpCard() {
  return (
    <div className="rounded-xl border border-brand-200 bg-white p-4 flex items-start gap-3">
      <span className="w-9 h-9 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0"><HeadsetIcon /></span>
      <div>
        <div className="text-[13px] font-bold">Need help?</div>
        <div className="text-[11px] text-ink-500">Our support team is here to assist you.</div>
        <a className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-700">Contact Support <ArrowRight /></a>
      </div>
    </div>
  );
}

/* Icons */
function UserIcon({ size = 18 }: { size?: number }) { return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function MailIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function DocIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function PhoneIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>); }
function LockIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function GearIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.8a7 7 0 0 0-2.1-1.2L14 3h-4l-.4 2.4a7 7 0 0 0-2.1 1.2l-2.4-.8-2 3.4 2 1.6c-.1.4-.1.8-.1 1.2s0 .8.1 1.2l-2 1.6 2 3.4 2.4-.8c.7.5 1.4.9 2.1 1.2L10 21h4l.4-2.4c.7-.3 1.4-.7 2.1-1.2l2.4.8 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>); }
function UsersIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" /><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2-3 3.5-3 2 0 3.5 1 3.5 3" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function SliderIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 6h12M4 18h7M4 12h16M14 4v4M9 16v4M18 10v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function ShieldIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function HeadsetIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1v-5zm16 0h-3v6h2a1 1 0 0 0 1-1v-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>); }
function EyeIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function EyeOffIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10 10a3 3 0 0 0 4 4M9 5a10 10 0 0 1 13 7 12 12 0 0 1-3 4M6 7C3 9 2 12 2 12s4 7 10 7c1.5 0 3-.4 4-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function ArrowRight() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ArrowLeft() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3m0 0l5-5m-5 5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
