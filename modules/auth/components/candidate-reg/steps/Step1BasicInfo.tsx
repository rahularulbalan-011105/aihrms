"use client";

import { useState } from "react";
import type React from "react";
import Link from "next/link";
import type { CandidateRegStep1Data } from "../../../types/auth.types";
import {
  registerCandidateUser,
  deleteCurrentUser,
} from "../../../services/auth.service";
import { updateCandidateBasicInfo } from "../../../services/candidate.service";
import {
  PersonIcon, MailIcon, LockIcon, LocationIcon, CalendarIcon,
  GoogleIcon, AppleIcon, ArrowRightIcon, SpinnerIcon,
} from "../shared/icons";
import { HEAR_OPTIONS } from "../shared/constants";
import { isValidEmail, isStrongPassword } from "../shared/validators";

interface Props {
  data: CandidateRegStep1Data;
  onChange: (data: CandidateRegStep1Data) => void;
  onNext: () => void;
}

export default function Step1BasicInfo({ data, onChange, onNext }: Props) {
  const set = <K extends keyof CandidateRegStep1Data>(field: K, value: CandidateRegStep1Data[K]) =>
    onChange({ ...data, [field]: value });

  const [localErrors, setLocalErrors] = useState<Partial<Record<keyof CandidateRegStep1Data, string>>>({});
  const [isLoading, setIsLoading]     = useState(false);
  const [apiError, setApiError]       = useState<string | null>(null);

  const validate = () => {
    const errs: Partial<Record<keyof CandidateRegStep1Data, string>> = {};
    if (!data.firstName.trim()) errs.firstName = "Required";
    if (!data.lastName.trim())  errs.lastName  = "Required";
    if (!data.email.trim())              errs.email = "Required";
    else if (!isValidEmail(data.email))  errs.email = "Invalid email";
    if (!data.phone.trim()) errs.phone = "Required";
    if (!data.password) errs.password = "Required";
    else {
      const pwErr = isStrongPassword(data.password);
      if (pwErr) errs.password = pwErr;
    }
    if (!data.confirmPassword) errs.confirmPassword = "Required";
    else if (data.password !== data.confirmPassword) errs.confirmPassword = "Passwords don't match";
    if (!data.dateOfBirth) {
      errs.dateOfBirth = "Required";
    } else {
      const dob = new Date(data.dateOfBirth);
      const today = new Date();
      const minDate = new Date("1900-01-01");
      if (isNaN(dob.getTime()) || dob < minDate || dob >= today) {
        errs.dateOfBirth = "Enter a valid date of birth";
      } else {
        const age = today.getFullYear() - dob.getFullYear() -
          (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
        if (age < 16) errs.dateOfBirth = "Must be at least 16 years old";
      }
    }
    if (!data.currentLocation.trim()) errs.currentLocation = "Required";
    if (!data.acceptTerms) errs.acceptTerms = "You must accept the terms";
    return errs;
  };

  const handleContinue = async () => {
    const errs = validate();
    setLocalErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    setApiError(null);
    try {
      await registerCandidateUser(data);
      try {
        await updateCandidateBasicInfo(data);
      } catch (candidateErr) {
        await deleteCurrentUser();
        throw candidateErr;
      }
      onNext();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Section heading */}
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-ink-100">
        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
          <PersonIcon />
        </div>
        <span className="font-display font-bold text-[16px] text-ink-900">Basic Information</span>
      </div>

      {/* Two-column form grid */}
      <div className="grid md:grid-cols-2 gap-3">
        <Field id="firstName" label="First Name" required error={localErrors.firstName}>
          <InputWithIcon id="firstName" icon={<PersonIcon />} value={data.firstName}
            onChange={(v) => { set("firstName", v); setLocalErrors((p) => ({ ...p, firstName: "" })); }}
            placeholder="Enter your first name" hasError={!!localErrors.firstName}
            aria-describedby={localErrors.firstName ? "firstName-error" : undefined} />
        </Field>
        <Field id="lastName" label="Last Name" required error={localErrors.lastName}>
          <InputWithIcon id="lastName" icon={<PersonIcon />} value={data.lastName}
            onChange={(v) => { set("lastName", v); setLocalErrors((p) => ({ ...p, lastName: "" })); }}
            placeholder="Enter your last name" hasError={!!localErrors.lastName}
            aria-describedby={localErrors.lastName ? "lastName-error" : undefined} />
        </Field>

        <Field id="email" label="Email Address" required error={localErrors.email}>
          <InputWithIcon id="email" icon={<MailIcon />} value={data.email}
            onChange={(v) => { set("email", v); setLocalErrors((p) => ({ ...p, email: "" })); }}
            placeholder="Enter your email address" type="email" hasError={!!localErrors.email}
            aria-describedby={localErrors.email ? "email-error" : undefined} />
        </Field>
        <Field id="phone" label="Phone Number" required error={localErrors.phone}>
          <PhoneInput id="phone" value={data.phone}
            onChange={(v) => { set("phone", v); setLocalErrors((p) => ({ ...p, phone: "" })); }}
            hasError={!!localErrors.phone}
            aria-describedby={localErrors.phone ? "phone-error" : undefined} />
        </Field>

        <Field id="password" label="Password" required error={localErrors.password}>
          <InputWithIcon id="password" icon={<LockIcon />} value={data.password}
            onChange={(v) => { set("password", v); setLocalErrors((p) => ({ ...p, password: "" })); }}
            placeholder="Create a strong password" type="password" hasError={!!localErrors.password}
            aria-describedby={localErrors.password ? "password-error" : undefined} />
        </Field>
        <Field id="confirmPassword" label="Confirm Password" required error={localErrors.confirmPassword}>
          <InputWithIcon id="confirmPassword" icon={<LockIcon />} value={data.confirmPassword}
            onChange={(v) => { set("confirmPassword", v); setLocalErrors((p) => ({ ...p, confirmPassword: "" })); }}
            placeholder="Confirm your password" type="password" hasError={!!localErrors.confirmPassword}
            aria-describedby={localErrors.confirmPassword ? "confirmPassword-error" : undefined} />
        </Field>

        <Field id="dateOfBirth" label="Date of Birth" required error={localErrors.dateOfBirth}>
          <InputWithIcon id="dateOfBirth" icon={<CalendarIcon />} value={data.dateOfBirth}
            onChange={(v) => { set("dateOfBirth", v); setLocalErrors((p) => ({ ...p, dateOfBirth: "" })); }}
            placeholder="DD / MM / YYYY" type="date"
            max={new Date().toISOString().split("T")[0]} min="1900-01-01"
            hasError={!!localErrors.dateOfBirth}
            aria-describedby={localErrors.dateOfBirth ? "dateOfBirth-error" : undefined} />
        </Field>
        <Field id="currentLocation" label="Current Location" required hint="City, State, Country" error={localErrors.currentLocation}>
          <InputWithIcon id="currentLocation" icon={<LocationIcon />} value={data.currentLocation}
            onChange={(v) => { set("currentLocation", v); setLocalErrors((p) => ({ ...p, currentLocation: "" })); }}
            placeholder="Enter your city" hasError={!!localErrors.currentLocation}
            aria-describedby={localErrors.currentLocation ? "currentLocation-error" : undefined} />
        </Field>
      </div>

      {/* Hear about us */}
      <div className="mt-3">
        <label htmlFor="hearAboutUs" className="block text-[13px] font-semibold text-ink-700 mb-1.5">
          Where did you hear about us? <span className="text-ink-400 font-normal">(Optional)</span>
        </label>
        <select id="hearAboutUs" value={data.hearAboutUs} onChange={(e) => set("hearAboutUs", e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-ink-200 text-[14px] text-ink-700 bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition appearance-none">
          <option value="">Select an option</option>
          {HEAR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {/* Terms + Continue */}
      <div className="mt-3 pt-4 border-t border-ink-100">
        <div className="flex items-center justify-between gap-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={data.acceptTerms}
              onChange={(e) => { set("acceptTerms", e.target.checked); setLocalErrors((p) => ({ ...p, acceptTerms: "" })); }}
              className="mt-0.5 w-4 h-4 rounded accent-brand-600" />
            <span className="text-[13px] text-ink-600 leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-brand-600 font-semibold hover:underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-brand-600 font-semibold hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          <button type="button" onClick={handleContinue} disabled={isLoading}
            className="shrink-0 flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-[14px] hover:opacity-95 transition disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ background: "var(--gradient-brand)" }}>
            {isLoading ? <><SpinnerIcon /> Saving...</> : <>Continue <ArrowRightIcon /></>}
          </button>
        </div>
        {localErrors.acceptTerms && (
          <p className="mt-2 text-[12px] text-red-500 flex items-center gap-1 pl-7">
            <span>⚠</span>{localErrors.acceptTerms}
          </p>
        )}
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-ink-200" />
        <span className="text-[12.5px] text-ink-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-ink-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button"
          className="flex items-center justify-center gap-2.5 py-2 rounded-xl border border-ink-200 text-[13.5px] font-semibold text-ink-700 hover:bg-ink-50 transition">
          <GoogleIcon /> Continue with Google
        </button>
        <button type="button"
          className="flex items-center justify-center gap-2.5 py-2 rounded-xl border border-ink-200 text-[13.5px] font-semibold text-ink-700 hover:bg-ink-50 transition">
          <AppleIcon /> Continue with Apple
        </button>
      </div>

      <p className="mt-3 text-center text-[12.5px] text-ink-500 flex items-center justify-center gap-1.5">
        <LockIcon /> Your information is safe with us. We never share your data.
      </p>

      {/* API error */}
      {apiError && (
        <div className="mt-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-600 flex items-start gap-2">
          <span className="shrink-0 mt-0.5">⚠</span>{apiError}
        </div>
      )}

    </div>
  );
}

/* ── Sub-components ── */
function Field({ id, label, required, hint, error, children }: {
  id?: string; label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
  const errorId = id && error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-ink-700 mb-1.5">
        {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-[12px] text-red-500 flex items-center gap-1">
          <span aria-hidden="true">⚠</span>{error}
        </p>
      )}
      {!error && hint && <p className="mt-1 text-[11.5px] text-ink-400">{hint}</p>}
    </div>
  );
}

function InputWithIcon({ icon, value, onChange, placeholder, type = "text", hasError = false, ...rest }: {
  icon: React.ReactNode; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string; hasError?: boolean; [key: string]: unknown;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        className={`w-full pl-10 pr-4 py-2 rounded-xl border text-[14px] bg-white outline-none transition ${
          hasError
            ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        }`} />
    </div>
  );
}

function PhoneInput({ value, onChange, hasError = false, id, "aria-describedby": ariaDescribedby }: {
  value: string; onChange: (v: string) => void; hasError?: boolean; id?: string; "aria-describedby"?: string;
}) {
  return (
    <div className="flex">
      <div className="flex items-center px-3 rounded-l-xl border border-r-0 border-ink-200 bg-ink-50 text-[13.5px] font-medium text-ink-700 gap-1.5 whitespace-nowrap">
        🇮🇳 <span className="text-ink-400">▾</span> +91
      </div>
      <input id={id} type="tel" value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
        placeholder="Enter your phone number"
        aria-describedby={ariaDescribedby}
        className={`flex-1 px-4 py-2 rounded-r-xl border text-[14px] bg-white outline-none transition ${
          hasError
            ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        }`} />
    </div>
  );
}
