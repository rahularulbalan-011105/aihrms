"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "../services/auth.service";
import type { UserRole } from "../types/auth.types";
import AuthHeader from "./AuthHeader";
import { assetPath } from "@/lib/assetPath";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      setLoading(true);
      setSubmitError("");
      await loginUser({ role, email, password, rememberMe });
      router.push("/dashboard");
    } catch {
      setSubmitError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f4f1ff] overflow-hidden">
      {/* ── Header ── */}
      <AuthHeader cta={{ label: "Create Account", href: "/signup", icon: <CreateAccountIcon /> }} />

      {/* ── Main content ── */}
      <main className="flex-1 grid lg:grid-cols-[1fr_1fr] items-stretch min-h-0">
        {/* Left marketing panel */}
        <div className="hidden lg:flex flex-col justify-center px-12 xl:px-20 py-2">
          <h1 className="font-display text-[34px] xl:text-[38px] font-extrabold leading-[1.15] text-ink-900 tracking-tight">
            Welcome back!<br />
            Let&apos;s build{" "}
            <span className="text-brand-600">winning</span>
            <br />
            futures together.
          </h1>
          <p className="mt-2 text-ink-500 text-[14px] leading-relaxed max-w-[400px]">
            Login to your HireMind account and continue your journey.
          </p>

          {/* Feature cards + illustration side by side */}
          <div className="mt-5 flex gap-4 items-start">
            <div className="flex-1 space-y-3">
              <FeatureCard
                icon={<CandidateIcon />}
                iconBg="bg-brand-50"
                iconColor="text-brand-600"
                title="For Candidates"
                desc="Find the right job, showcase your skills and take the next step in your career."
                titleColor="text-brand-700"
              />
              <FeatureCard
                icon={<CompanyIcon />}
                iconBg="bg-green-50"
                iconColor="text-green-600"
                title="For Recruitment Companies"
                desc="Find, engage and hire top talent faster with the power of AI."
                titleColor="text-green-700"
              />
            </div>
            {/* Illustration */}
            <div className="w-[190px] xl:w-[210px] shrink-0 rounded-2xl overflow-hidden border border-brand-100 h-full min-h-[160px]">
              <img
                src={assetPath("/images/rec-cand.png")}
                alt="Candidate & Recruiter"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-white/60 border border-brand-100">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
              <ShieldIcon />
            </div>
            <div>
              <div className="font-semibold text-[13px] text-ink-900">Your data is safe with us</div>
              <div className="text-[12px] text-ink-500 mt-0.5 leading-relaxed">
                We use advanced security measures to protect your information and privacy.
              </div>
            </div>
          </div>
        </div>

        {/* Right: login card */}
        <div className="flex items-center justify-center p-6 lg:p-6 xl:p-8 min-h-0">
          <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-[0_8px_40px_-8px_rgba(109,76,255,0.22)] border border-brand-100 p-6">
            <h2 className="font-display font-extrabold text-[22px] text-ink-900 text-center">
              Login to your account
            </h2>
            <p className="mt-1 text-ink-500 text-[13px] text-center">
              Please choose your account type to continue
            </p>

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {(["candidate", "recruiter"] as UserRole[]).map((r) => {
                const isCand = r === "candidate";
                const selected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setRole(r); setSubmitError(""); setErrors({}); }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 transition text-left ${
                      selected ? "border-brand-500 bg-brand-50/40" : "border-ink-200 bg-white hover:border-ink-300"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isCand ? "bg-brand-100 text-brand-600" : "bg-green-100 text-green-600"}`}>
                      {isCand ? <CandidateIcon /> : <CompanyIcon />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[12.5px] text-ink-900 leading-tight">
                        {isCand ? "Candidate" : "Recruitment Company"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3" noValidate>
              {submitError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px]">
                  {submitError}
                </div>
              )}

              <div>
                <label className="block text-[12.5px] font-semibold text-ink-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                    placeholder="Enter your email address"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-[13.5px] outline-none transition bg-white ${
                      errors.email ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-[12px] text-red-600">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[12.5px] font-semibold text-ink-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Link href="/forgot-password" className="text-[12.5px] text-brand-600 hover:text-brand-700 font-medium">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"><LockIcon /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-12 py-2.5 rounded-xl border text-[13.5px] outline-none transition bg-white ${
                      errors.password ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    }`}
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition p-0.5">
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-[12px] text-red-600">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded accent-brand-600" />
                  <span className="text-[13px] text-ink-700">Remember me</span>
                </label>
                <span className="text-[12px] text-ink-400 flex items-center gap-1">
                  Keep me signed in
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-[14.5px] transition hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "var(--gradient-brand)" }}
              >
                {loading ? <><SpinnerIcon /> Signing in...</> : <>Login <ArrowRightIcon /></>}
              </button>
            </form>

            <div className="my-3 flex items-center gap-3">
              <div className="flex-1 h-px bg-ink-200" />
              <span className="text-[12px] text-ink-400 font-medium">or continue with</span>
              <div className="flex-1 h-px bg-ink-200" />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { name: "Google",    icon: <GoogleIcon /> },
                { name: "Microsoft", icon: <MicrosoftIcon /> },
                { name: "LinkedIn",  icon: <LinkedInIcon /> },
                { name: "Apple",     icon: <AppleIcon /> },
              ].map((s) => (
                <button key={s.name} type="button" className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl border border-ink-200 bg-white hover:bg-ink-50 transition">
                  {s.icon}
                  <span className="text-[12px] font-medium text-ink-700">{s.name}</span>
                </button>
              ))}
            </div>

            <p className="mt-4 text-center text-[13px] text-ink-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-brand-600 font-bold hover:text-brand-700">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* ── Stats strip ── */}
      <div className="bg-white border-t border-ink-100 shrink-0">
        <div className="mx-auto max-w-[1000px] px-6 py-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "500K+", label: "Active Users",      icon: "🛡" },
            { value: "10K+",  label: "Trusted Companies", icon: "🏢" },
            { value: "2M+",   label: "Jobs Posted",       icon: "👥" },
            { value: "98%",   label: "Success Rate",      icon: "🏆" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center text-[16px] shrink-0">{s.icon}</div>
              <div>
                <div className="font-display font-extrabold text-[18px] text-ink-900 leading-none">{s.value}</div>
                <div className="text-[11px] text-ink-500 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-ink-100 bg-white py-2.5 shrink-0">
        <div className="text-center text-[12.5px] text-ink-500 space-x-1">
          <span>© 2024 AI HRMS. All rights reserved.</span>
          <span className="text-ink-300">|</span>
          <Link href="/terms" className="text-brand-600 hover:text-brand-700 transition">Terms &amp; Conditions</Link>
          <span className="text-ink-300">|</span>
          <Link href="/privacy" className="text-brand-600 hover:text-brand-700 transition">Privacy Policy</Link>
          <span className="text-ink-300">|</span>
          <Link href="/contact" className="text-brand-600 hover:text-brand-700 transition">Help Center</Link>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ── */
function FeatureCard({ icon, iconBg, iconColor, title, desc, titleColor }: {
  icon: React.ReactNode; iconBg: string; iconColor: string;
  title: string; desc: string; titleColor: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-ink-100 bg-white">
      <div className={`w-11 h-11 rounded-full ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <div className={`font-bold text-[14px] ${titleColor}`}>{title}</div>
        <div className="text-[12.5px] text-ink-500 mt-0.5 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

/* ── Icons ── */
function CandidateIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M3 21c0-3.866 4.029-7 9-7s9 3.134 9 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function CompanyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M2 9h20" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="6" y="13" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.5"/>
      <rect x="10.5" y="13" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.5"/>
      <rect x="15" y="13" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.5"/>
      <rect x="8" y="17" width="8" height="4" rx="0.5" fill="currentColor" fillOpacity="0.3"/>
    </svg>
  );
}
function ShieldIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function MailIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6"/></svg>; }
function LockIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function EyeIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/></svg>; }
function EyeOffIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function SpinnerIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>; }
function ArrowRightIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function GoogleIcon() { return <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>; }
function MicrosoftIcon() { return <svg width="18" height="18" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#F25022"/><rect x="11" y="1" width="9" height="9" fill="#7FBA00"/><rect x="1" y="11" width="9" height="9" fill="#00A4EF"/><rect x="11" y="11" width="9" height="9" fill="#FFB900"/></svg>; }
function LinkedInIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>; }
function AppleIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>; }
function CreateAccountIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M3 21c0-4 4-7 9-7s9 3 9 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
