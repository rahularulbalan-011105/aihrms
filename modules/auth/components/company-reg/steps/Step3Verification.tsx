"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CompanyData, AdminData } from "../shared/types";
import HorizontalStepper from "../shared/HorizontalStepper";
import VerticalStepper from "../shared/VerticalStepper";
import { saveCompanyProfile, uploadCompanyLogo } from "@/modules/auth/services/company.service";
import type { CompanyRegStep1Data } from "@/modules/auth/types/auth.types";

interface Props {
  company: CompanyData;
  admin: AdminData;
  onBack: () => void;
  onEdit: (target: 1 | 2) => void;
}

export default function Step3Verification({ company, admin, onBack, onEdit }: Props) {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  async function handleComplete() {
    setIsCompleting(true);
    try {
      const step1: CompanyRegStep1Data = {
        companyName: company.companyName,
        legalName:   company.legalName,
        website:     company.website,
        industry:    company.industry,
        companySize: company.companySize,
        foundedYear: company.foundedYear,
        companyType: company.companyType,
        gstNumber:   company.gstNumber,
        panNumber:   company.panNumber,
        country:     company.country,
        state:       company.state,
        city:        company.city,
        address:     company.address,
        about:       company.about,
        agree:       company.agree,
      };
      await saveCompanyProfile(step1);
      if (company.logoFile) {
        await uploadCompanyLogo(company.logoFile);
      }
    } catch {
      // non-fatal — profile data can be completed later in the dashboard
    }
    router.push("/company/dashboard");
  }

  return (
    <div className="flex-1 grid lg:grid-cols-[360px_1fr]">
      {/* ─────────────── LEFT SIDEBAR ─────────────── */}
      <aside className="bg-[#F4F1FF] px-7 py-8 hidden lg:flex flex-col gap-5">
        <h2 className="font-display text-[18px] font-extrabold tracking-tight">Create your company account</h2>

        <VerticalStepper
          current={3}
          steps={[
            { n: 1, title: "Company Details", caption: "Completed",                 done: true  },
            { n: 2, title: "Admin Details",   caption: "Completed",                 done: true  },
            { n: 3, title: "Verification",    caption: "Verify your email and phone", done: false },
          ]}
        />

        {/* Account Summary */}
        <div className="rounded-xl border border-brand-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display font-bold text-[13.5px]">Account Summary</div>
            <button onClick={() => onEdit(1)} className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand-700">
              <PencilIcon /> Edit
            </button>
          </div>
          <SummaryGroup label="Company">
            <SummaryLine icon={<BuildingIcon />} title={company.companyName || "—"} sub={`${company.industry || "—"} • ${company.companySize || "—"}`} />
          </SummaryGroup>
          <SummaryGroup label="Admin">
            <SummaryLine icon={<UserIcon />} title={admin.fullName || "—"} sub={`${admin.designation || "—"} • ${admin.email || "—"}`} />
          </SummaryGroup>
          <SummaryGroup label="Contact" last>
            <div className="flex items-center gap-2 text-[12px] text-ink-700 mb-1.5">
              <MailIcon /> {admin.email || "—"}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-ink-700">
              <PhoneIcon /> {admin.countryCode || "+91"} {admin.mobile || "—"}
            </div>
          </SummaryGroup>
        </div>

        {/* Security card */}
        <div className="rounded-xl bg-white border border-brand-200 p-4 flex items-start gap-3">
          <span className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0"><ShieldIcon /></span>
          <div className="leading-snug">
            <div className="text-[13px] font-bold">Your information is secure</div>
            <div className="text-[11px] text-ink-500 mt-0.5">We use industry-standard security to protect your data.</div>
          </div>
        </div>

        <NeedHelpCard />
      </aside>

      {/* ─────────────── RIGHT FORM ─────────────── */}
      <div className="flex flex-col">
        <div className="flex-1 px-8 lg:px-12 py-10">
          <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-7 lg:p-9 max-w-[1100px] mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-6 relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <MailCheckIcon />
                </div>
                <div>
                  <h2 className="font-display text-[22px] font-extrabold tracking-tight">Verify your email and phone</h2>
                  <p className="text-ink-500 text-[13px] mt-0.5">We&apos;ve sent verification codes to your email and phone number.</p>
                </div>
              </div>
              <HorizontalStepper current={3} />
            </div>

            {/* OTP panel — email | + | phone */}
            <div className="mt-7 grid lg:grid-cols-[1fr_auto_1fr] gap-5 items-stretch">
              <OtpCard
                title="Verify Email Address"
                target={admin.email || "—"}
                helperLeft="Didn't receive the code?"
                helperRight="Resend Code"
                helperRightIcon={<RefreshIcon />}
              />
              <div className="hidden lg:flex items-center justify-center">
                <span className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[18px] font-bold">+</span>
              </div>
              <OtpCard
                title="Verify Phone Number"
                target={`${admin.countryCode || "+91"} ${admin.mobile || "—"}`}
                helperLeft="Wrong number?"
                helperRight="Change Number"
                helperRightIcon={<ArrowRight />}
                onChangeTarget={() => onEdit(2)}
              />
            </div>

            {/* Additional Verification */}
            <div className="mt-8">
              <h3 className="font-display font-bold text-[14px]">Additional Verification (Recommended)</h3>
              <p className="text-[12px] text-ink-500 mt-0.5 mb-3.5">Add an extra layer of security to your account</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <ExtraVerify icon="google"  title="Verify with Google"    body="Use your Google account to verify instantly" />
                <ExtraVerify icon="ms"      title="Verify with Microsoft" body="Use your Microsoft account to verify instantly" />
                <ExtraVerify icon="shield"  title="Authenticator App"     body="Use authenticator app for secure verification" />
              </div>
            </div>

            {/* Unlock Powerful Hiring Tools */}
            <div className="mt-6 rounded-xl bg-brand-50/60 border border-brand-100 px-4 py-3.5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3 md:max-w-[400px]">
                <span className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0"><LockIcon /></span>
                <div className="leading-snug">
                  <div className="text-[13.5px] font-bold">Unlock Powerful Hiring Tools</div>
                  <div className="text-[11px] text-ink-500">Once verified, you can start posting jobs, managing candidates and collaborating with your team.</div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                <ToolPill icon={<DocIcon />}     label="Post Jobs" />
                <ToolPill icon={<UsersIcon />}   label="Manage Candidates" />
                <ToolPill icon={<MatchIcon />}   label="AI Matching" />
                <ToolPill icon={<ChartIcon />}   label="Reports & Analytics" />
                <ToolPill icon={<TeamIcon />}    label="Team Collaboration" />
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="mt-7 flex items-center justify-between border-t border-ink-100 pt-5">
              <button onClick={onBack} className="px-5 py-2.5 rounded-lg border border-brand-300 text-brand-700 text-[13.5px] font-semibold hover:bg-brand-50 transition inline-flex items-center gap-2">
                <ArrowLeft /> Back
              </button>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition">
                  Save & Exit
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="px-6 py-2.5 rounded-lg text-white text-[13.5px] font-semibold hover:opacity-95 transition inline-flex items-center gap-2 disabled:opacity-75"
                  style={{ background: "var(--gradient-brand)" }}>
                  {isCompleting
                    ? <><SpinnerIcon /> Setting up…</>
                    : <>Verify &amp; Complete <ArrowRight /></>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────── Pieces ────────────────── */
function OtpCard({ title, target, helperLeft, helperRight, helperRightIcon, onChangeTarget }: {
  title: string; target: string;
  helperLeft: string; helperRight: string; helperRightIcon?: React.ReactNode;
  onChangeTarget?: () => void;
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(292); // 4:52
  const refs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const setAt = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    setDigits((arr) => arr.map((d, j) => (j === i ? ch : d)));
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="rounded-xl border border-ink-100 p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-display font-bold text-[14px]">{title}</h4>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">Sent</span>
      </div>
      <p className="mt-2 text-[12px] text-ink-500">We&apos;ve sent a 6-digit code to</p>
      <div className="text-[13px] font-semibold text-brand-700 mt-0.5 break-all">{target}</div>
      <p className="text-[12px] text-ink-500 mt-2">Enter the code below to verify.</p>

      <div className="mt-3 flex gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { if (el) refs.current[i] = el; }}
            value={d}
            onChange={(e) => setAt(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="w-10 h-12 rounded-lg border border-ink-200 text-center text-[16px] font-semibold focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        ))}
      </div>

      <div className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-ink-700">
        <ClockIcon /> Code expires in <span className="text-green-600 font-bold">{mm}:{ss}</span>
      </div>

      <div className="mt-3 rounded-md bg-ink-100/60 px-3.5 py-2.5 flex items-center justify-between text-[12px]">
        <span className="flex items-center gap-1.5 text-ink-700">
          <InfoIcon /> {helperLeft}
        </span>
        <button onClick={onChangeTarget} className="inline-flex items-center gap-1 text-brand-700 font-semibold">
          {helperRight} {helperRightIcon}
        </button>
      </div>
    </div>
  );
}

function ExtraVerify({ icon, title, body }: { icon: "google" | "ms" | "shield"; title: string; body: string }) {
  return (
    <button type="button" className="rounded-xl border border-ink-100 p-4 text-left hover:border-brand-300 transition flex items-center gap-3">
      <span className="w-10 h-10 rounded-md bg-white flex items-center justify-center shrink-0 border border-ink-100">
        {icon === "google" && <GoogleIcon />}
        {icon === "ms"     && <MSIcon />}
        {icon === "shield" && <span className="text-brand-700"><ShieldIcon /></span>}
      </span>
      <div className="flex-1 leading-snug">
        <div className="text-[13px] font-bold">{title}</div>
        <div className="text-[11px] text-ink-500">{body}</div>
      </div>
      <span className="text-ink-400"><ChevronRight /></span>
    </button>
  );
}

function ToolPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5">
      <span className="w-9 h-9 rounded-md bg-white text-brand-700 flex items-center justify-center border border-brand-100">{icon}</span>
      <span className="text-[10.5px] text-ink-700 font-medium leading-tight">{label}</span>
    </div>
  );
}

function SummaryGroup({ label, last, children }: { label: string; last?: boolean; children: React.ReactNode }) {
  return (
    <div className={last ? "" : "mb-3 pb-3 border-b border-ink-100"}>
      <div className="text-[11px] font-bold text-ink-500 uppercase tracking-wide mb-1.5">{label}</div>
      {children}
    </div>
  );
}
function SummaryLine({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="w-7 h-7 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">{icon}</span>
      <div className="leading-snug flex-1 min-w-0">
        <div className="text-[12.5px] font-bold truncate">{title}</div>
        <div className="text-[10.5px] text-ink-500 truncate">{sub}</div>
      </div>
    </div>
  );
}
function NeedHelpCard() {
  return (
    <div className="rounded-xl border border-brand-200 bg-white p-4 flex items-start gap-3">
      <span className="w-9 h-9 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0"><HeadsetIcon /></span>
      <div>
        <div className="text-[13px] font-bold">Need help?</div>
        <div className="text-[11px] text-ink-500">Our support team is here to help you.</div>
        <a className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-700">Contact Support <ArrowRight /></a>
      </div>
    </div>
  );
}

/* Icons */
function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function PencilIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M16 4l4 4-11 11H5v-4L16 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>); }
function BuildingIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" stroke="currentColor" strokeWidth="1.6" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function UserIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function MailIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function PhoneIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function ShieldIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function MailCheckIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M3 7l9 6 9-6M15 17l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ClockIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function InfoIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>); }
function RefreshIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ArrowRight() { return (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ArrowLeft() { return (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13 8H3m0 0l5-5m-5 5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ChevronRight() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function HeadsetIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1v-5zm16 0h-3v6h2a1 1 0 0 0 1-1v-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>); }
function LockIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function DocIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" /><path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function UsersIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" /><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2-3 3.5-3 2 0 3.5 1 3.5 3" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function MatchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 8h6M4 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><rect x="13" y="5" width="7" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function ChartIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4v16h16" stroke="currentColor" strokeWidth="1.6" /><rect x="7" y="13" width="3" height="5" fill="currentColor" /><rect x="12" y="9" width="3" height="9" fill="currentColor" /><rect x="17" y="6" width="3" height="12" fill="currentColor" /></svg>); }
function TeamIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M4 20c0-3 4-5 8-5s8 2 8 5" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function GoogleIcon() { return (
  <svg width="16" height="16" viewBox="0 0 18 18">
    <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.32z" fill="#FBBC05"/>
    <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.99 8.99 0 0 0 9 0 9 9 0 0 0 .96 4.96l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
); }
function MSIcon() { return (
  <svg width="16" height="16" viewBox="0 0 18 18">
    <rect width="8" height="8" fill="#F25022"/>
    <rect x="10" width="8" height="8" fill="#7FBA00"/>
    <rect y="10" width="8" height="8" fill="#00A4EF"/>
    <rect x="10" y="10" width="8" height="8" fill="#FFB900"/>
  </svg>
); }
