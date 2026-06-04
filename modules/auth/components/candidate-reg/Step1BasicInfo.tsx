"use client";

import { useState } from "react";
import Link from "next/link";
import type { CandidateRegStep1Data } from "../../types/auth.types";

interface Props {
  data: CandidateRegStep1Data;
  onChange: (data: CandidateRegStep1Data) => void;
  onNext: () => void;
}

const HEAR_OPTIONS = [
  "Google Search",
  "LinkedIn",
  "Friend / Colleague",
  "Social Media",
  "Job Portal",
  "Other",
];

export default function Step1BasicInfo({ data, onChange, onNext }: Props) {
  const set = <K extends keyof CandidateRegStep1Data>(field: K, value: CandidateRegStep1Data[K]) =>
    onChange({ ...data, [field]: value });

  const [localErrors, setLocalErrors] = useState<Partial<Record<keyof CandidateRegStep1Data, string>>>({});

  const validate = () => {
    const errs: Partial<Record<keyof CandidateRegStep1Data, string>> = {};
    if (!data.firstName.trim()) errs.firstName = "Required";
    if (!data.lastName.trim()) errs.lastName = "Required";
    if (!data.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Invalid email";
    if (!data.phone.trim()) errs.phone = "Required";
    if (!data.password) errs.password = "Required";
    else if (data.password.length < 8) errs.password = "Minimum 8 characters";
    if (!data.confirmPassword) errs.confirmPassword = "Required";
    else if (data.password !== data.confirmPassword) errs.confirmPassword = "Passwords don't match";
    if (!data.dateOfBirth) errs.dateOfBirth = "Required";
    if (!data.currentLocation.trim()) errs.currentLocation = "Required";
    if (!data.acceptTerms) errs.acceptTerms = "You must accept the terms";
    return errs;
  };

  const handleContinue = () => {
    const errs = validate();
    setLocalErrors(errs);
    // Always advance — errors are shown inline as warnings
    onNext();
  };

  return (
    <div>
      {/* Section heading */}
      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-ink-100">
        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
          <PersonIcon />
        </div>
        <span className="font-display font-bold text-[16px] text-ink-900">Basic Information</span>
      </div>

      {/* Two-column form grid */}
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="First Name" required error={localErrors.firstName}>
          <InputWithIcon icon={<PersonIcon />} value={data.firstName} onChange={(v) => { set("firstName", v); setLocalErrors((p) => ({ ...p, firstName: "" })); }} placeholder="Enter your first name" hasError={!!localErrors.firstName} />
        </Field>
        <Field label="Last Name" required error={localErrors.lastName}>
          <InputWithIcon icon={<PersonIcon />} value={data.lastName} onChange={(v) => { set("lastName", v); setLocalErrors((p) => ({ ...p, lastName: "" })); }} placeholder="Enter your last name" hasError={!!localErrors.lastName} />
        </Field>

        <Field label="Email Address" required error={localErrors.email}>
          <InputWithIcon icon={<MailIcon />} value={data.email} onChange={(v) => { set("email", v); setLocalErrors((p) => ({ ...p, email: "" })); }} placeholder="Enter your email address" type="email" hasError={!!localErrors.email} />
        </Field>
        <Field label="Phone Number" required error={localErrors.phone}>
          <PhoneInput value={data.phone} onChange={(v) => { set("phone", v); setLocalErrors((p) => ({ ...p, phone: "" })); }} hasError={!!localErrors.phone} />
        </Field>

        <Field label="Password" required error={localErrors.password}>
          <InputWithIcon icon={<LockIcon />} value={data.password} onChange={(v) => { set("password", v); setLocalErrors((p) => ({ ...p, password: "" })); }} placeholder="Create a strong password" type="password" hasError={!!localErrors.password} />
        </Field>
        <Field label="Confirm Password" required error={localErrors.confirmPassword}>
          <InputWithIcon icon={<LockIcon />} value={data.confirmPassword} onChange={(v) => { set("confirmPassword", v); setLocalErrors((p) => ({ ...p, confirmPassword: "" })); }} placeholder="Confirm your password" type="password" hasError={!!localErrors.confirmPassword} />
        </Field>

        <Field label="Date of Birth" required error={localErrors.dateOfBirth}>
          <InputWithIcon icon={<CalendarIcon />} value={data.dateOfBirth} onChange={(v) => { set("dateOfBirth", v); setLocalErrors((p) => ({ ...p, dateOfBirth: "" })); }} placeholder="DD / MM / YYYY" type="date" hasError={!!localErrors.dateOfBirth} />
        </Field>
        <Field label="Current Location" required hint="City, State, Country" error={localErrors.currentLocation}>
          <InputWithIcon icon={<LocationIcon />} value={data.currentLocation} onChange={(v) => { set("currentLocation", v); setLocalErrors((p) => ({ ...p, currentLocation: "" })); }} placeholder="Enter your city" hasError={!!localErrors.currentLocation} />
        </Field>
      </div>

      {/* Hear about us */}
      <div className="mt-5">
        <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
          Where did you hear about us?{" "}
          <span className="text-ink-400 font-normal">(Optional)</span>
        </label>
        <select
          value={data.hearAboutUs}
          onChange={(e) => set("hearAboutUs", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-ink-200 text-[14px] text-ink-700 bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition appearance-none"
        >
          <option value="">Select an option</option>
          {HEAR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {/* Terms */}
      <div className="mt-5">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.acceptTerms}
            onChange={(e) => { set("acceptTerms", e.target.checked); setLocalErrors((p) => ({ ...p, acceptTerms: "" })); }}
            className="mt-0.5 w-4 h-4 rounded accent-brand-600"
          />
          <span className="text-[13px] text-ink-600 leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="text-brand-600 font-semibold hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-brand-600 font-semibold hover:underline">Privacy Policy</Link>
            .
          </span>
        </label>
        {localErrors.acceptTerms && (
          <p className="mt-1.5 text-[12px] text-red-500 flex items-center gap-1 pl-7">
            <span>⚠</span>{localErrors.acceptTerms}
          </p>
        )}
      </div>

      {/* Continue */}
      <button
        type="button"
        onClick={handleContinue}
        className="mt-6 w-full py-3.5 rounded-xl text-white font-bold text-[15px] flex items-center justify-center gap-2 hover:opacity-95 transition"
        style={{ background: "var(--gradient-brand)" }}
      >
        Continue <ArrowRightIcon />
      </button>

      <div className="my-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-ink-200" />
        <span className="text-[12.5px] text-ink-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-ink-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-ink-200 text-[13.5px] font-semibold text-ink-700 hover:bg-ink-50 transition">
          <GoogleIcon /> Continue with Google
        </button>
        <button type="button" className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-ink-200 text-[13.5px] font-semibold text-ink-700 hover:bg-ink-50 transition">
          <AppleIcon /> Continue with Apple
        </button>
      </div>

      <p className="mt-5 text-center text-[12.5px] text-ink-500 flex items-center justify-center gap-1.5">
        <LockIcon /> Your information is safe with us. We never share your data.
      </p>
    </div>
  );
}

/* ── Sub-components ── */
function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[12px] text-red-500 flex items-center gap-1"><span>⚠</span>{error}</p>}
      {!error && hint && <p className="mt-1 text-[11.5px] text-ink-400">{hint}</p>}
    </div>
  );
}

function InputWithIcon({ icon, value, onChange, placeholder, type = "text", hasError = false }: {
  icon: React.ReactNode; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string; hasError?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-[14px] bg-white outline-none transition ${
          hasError
            ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        }`}
      />
    </div>
  );
}

function PhoneInput({ value, onChange, hasError = false }: {
  value: string; onChange: (v: string) => void; hasError?: boolean;
}) {
  return (
    <div className="flex">
      <div className="flex items-center px-3 rounded-l-xl border border-r-0 border-ink-200 bg-ink-50 text-[13.5px] font-medium text-ink-700 gap-1.5 whitespace-nowrap">
        🇮🇳 <span className="text-ink-400">▾</span> +91
      </div>
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
        placeholder="Enter your phone number"
        className={`flex-1 px-4 py-3 rounded-r-xl border text-[14px] bg-white outline-none transition ${
          hasError
            ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        }`}
      />
    </div>
  );
}

/* ── Icons ── */
function PersonIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function MailIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6"/></svg>; }
function LockIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function CalendarIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function LocationIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6"/></svg>; }
function ArrowRightIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function GoogleIcon() { return <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>; }
function AppleIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="#000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>; }
