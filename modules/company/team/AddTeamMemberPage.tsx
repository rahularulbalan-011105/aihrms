"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createTeamMember,
  getTeamMember,
  updateTeamMember,
  type TeamMemberResponse,
} from "./services/team.service";

/* ── Option lists ─────────────────────────────────────────────────────── */
const COUNTRY_CODES = ["+91", "+1", "+44", "+65", "+971"];
const DEPARTMENTS = ["Operations", "Recruitment", "Business Dev", "Finance", "Sales", "Marketing", "Other"];
const EMPLOYEE_TYPES = ["Full-time", "Part-time", "Contract", "Intern"];
const ROLES = ["Admin", "Manager", "Recruiter", "Viewer"];
const PERMISSIONS = ["Full Access", "Standard", "Limited", "Custom"];
const REPORTING_MANAGERS = ["Ananya Singh", "Rahul Sharma", "Priya Nair"];

const ACCESS_SCOPES = [
  { value: "all", title: "All Clients & Jobs", desc: "Can access all clients, jobs and candidates" },
  { value: "clients", title: "Specific Clients", desc: "Restrict access to selected clients" },
  { value: "department", title: "Specific Department", desc: "Restrict access to department data" },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const genPassword = () => Array.from({ length: 10 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$".charAt(Math.floor(Math.random() * 58))).join("");

interface TeamMemberForm {
  fullName: string; email: string; countryCode: string; phone: string;
  designation: string; department: string; employeeType: string;
  role: string; permissions: string; reportingManager: string; accessScope: string;
  sendVia: "email" | "sms"; tempPasswordEnabled: boolean; twoFactor: boolean;
  message: string;
}

const EMPTY: TeamMemberForm = {
  fullName: "", email: "", countryCode: "+91", phone: "",
  designation: "", department: "", employeeType: "",
  role: "", permissions: "", reportingManager: "", accessScope: "all",
  sendVia: "email", tempPasswordEnabled: true, twoFactor: true,
  message: "",
};

/** Map a backend TeamMemberResponse onto the edit form. */
function toForm(member: TeamMemberResponse): TeamMemberForm {
  return {
    fullName: member.fullName ?? "",
    email: member.email ?? "",
    countryCode: member.countryCode || "+91",
    phone: member.phone ?? "",
    designation: member.designation ?? "",
    department: member.department ?? "",
    employeeType: member.employeeType ?? "",
    role: member.role ?? "",
    permissions: member.permissions ?? "",
    reportingManager: member.reportingManager ?? "",
    accessScope: member.accessScope || "all",
    sendVia: member.invitedVia === "sms" ? "sms" : "email",
    tempPasswordEnabled: member.tempPasswordEnabled,
    twoFactor: member.twoFactorEnabled,
    message: member.message ?? "",
  };
}

export default function AddTeamMemberPage({ memberId }: { memberId?: string } = {}) {
  const router = useRouter();
  const isEdit = Boolean(memberId);
  const [form, setForm] = useState<TeamMemberForm>(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [errors, setErrors] = useState<Partial<Record<keyof TeamMemberForm, string>>>({});
  const [tempPassword, setTempPassword] = useState(genPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = <K extends keyof TeamMemberForm>(key: K, value: TeamMemberForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // Edit mode — load the existing member once and prefill the form.
  const prefilled = useRef(false);
  useEffect(() => {
    if (!memberId || prefilled.current) return; // StrictMode double-invoke guard
    prefilled.current = true;
    getTeamMember(memberId)
      .then((member) => setForm(toForm(member)))
      .catch((err) => setSubmitError(err instanceof Error ? err.message : "Failed to load team member"))
      .finally(() => setLoading(false));
  }, [memberId]);

  function validate(): boolean {
    const errs: Partial<Record<keyof TeamMemberForm, string>> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!EMAIL_RE.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.designation.trim()) errs.designation = "Designation is required";
    if (!form.role) errs.role = "Role is required";
    if (!form.permissions) errs.permissions = "Permissions are required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSend() {
    if (!validate()) return;
    setSaving(true);
    setSubmitError(null);
    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      countryCode: form.countryCode || undefined,
      phone: form.phone.trim() || undefined,
      designation: form.designation.trim(),
      department: form.department || undefined,
      employeeType: form.employeeType || undefined,
      role: form.role,
      permissions: form.permissions,
      reportingManager: form.reportingManager || undefined,
      accessScope: form.accessScope,
      invitedVia: form.sendVia,
      tempPasswordEnabled: form.tempPasswordEnabled,
      twoFactorEnabled: form.twoFactor,
      message: form.message.trim() || undefined,
    };
    try {
      if (isEdit && memberId) await updateTeamMember(memberId, payload);
      else await createTeamMember(payload);
      setSaved(true);
      setTimeout(() => router.push("/company/team"), 1200);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : isEdit ? "Failed to update team member" : "Failed to invite team member");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
        <div className="py-24 text-center text-ink-400 text-[13px]">Loading team member…</div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-ink-500 mb-2">
        <Link href="/company/team" className="hover:text-brand-600 transition-colors">Team</Link>
        <span aria-hidden="true">›</span>
        <span className="text-ink-700 font-medium">{isEdit ? "Edit Team Member" : "Add Team Member"}</span>
      </div>

      <h1 className="font-display font-extrabold text-[22px] text-ink-900 tracking-tight">{isEdit ? "Edit Team Member" : "Add Team Member"}</h1>
      <p className="text-[13.5px] text-ink-500 mt-1 mb-5">{isEdit ? "Update this team member's details, role and access." : "Invite a new team member to collaborate and manage your hiring together."}</p>

      <div className="flex gap-6 items-start">
        {/* ── Main form ── */}
        <div className="flex-1 min-w-0 space-y-5">
          {saved && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[13px] font-semibold flex items-center gap-2">
              <CheckIcon /> {isEdit ? "Team member updated successfully." : "Invitation sent successfully."}
            </div>
          )}
          {submitError && (
            <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] font-semibold">
              {submitError}
            </div>
          )}

          {/* Personal Information */}
          <div className="card p-6">
            <SectionTitle icon={<UserIcon />}>Personal Information</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Full Name" required value={form.fullName} onChange={(v) => set("fullName", v)} placeholder="Enter full name" error={errors.fullName} maxLength={150} />
              <Field label="Email Address" required value={form.email} onChange={(v) => set("email", v)} placeholder="Enter email address" error={errors.email} maxLength={150} />
              <PhoneField label="Phone Number" cc={form.countryCode} onCc={(v) => set("countryCode", v)} value={form.phone} onValue={(v) => set("phone", v)} placeholder="Enter phone number" />
              <Field label="Designation" required value={form.designation} onChange={(v) => set("designation", v)} placeholder="Enter designation" error={errors.designation} maxLength={100} />
              <SelectField label="Department" value={form.department} onChange={(v) => set("department", v)} placeholder="Select department" options={DEPARTMENTS} />
              <SelectField label="Employee Type" value={form.employeeType} onChange={(v) => set("employeeType", v)} placeholder="Select employee type" options={EMPLOYEE_TYPES} />
            </div>
          </div>

          {/* Access & Role */}
          <div className="card p-6">
            <SectionTitle icon={<KeyIcon />}>Access &amp; Role</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField label="Role" required value={form.role} onChange={(v) => set("role", v)} placeholder="Select role" options={ROLES} error={errors.role} />
              <div>
                <SelectField label="Permissions" required value={form.permissions} onChange={(v) => set("permissions", v)} placeholder="Select permissions" options={PERMISSIONS} error={errors.permissions} />
                {!errors.permissions && <p className="mt-1 text-[11px] text-ink-400">Choose the level of access for this team member</p>}
              </div>
              <SelectField label="Reporting Manager" value={form.reportingManager} onChange={(v) => set("reportingManager", v)} placeholder="Select reporting manager" options={REPORTING_MANAGERS} />
            </div>
            <div className="mt-5">
              <Label required>Access Scope</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {ACCESS_SCOPES.map((s) => (
                  <label key={s.value} className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition ${form.accessScope === s.value ? "border-brand-400 bg-brand-50/50" : "border-ink-200 hover:border-ink-300"}`}>
                    <input type="radio" name="accessScope" checked={form.accessScope === s.value} onChange={() => set("accessScope", s.value)} className="mt-0.5 accent-brand-600" />
                    <span>
                      <span className="block text-[13px] font-semibold text-ink-900">{s.title}</span>
                      <span className="block text-[11.5px] text-ink-500 mt-0.5">{s.desc}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Login & Security */}
          <div className="card p-6">
            <SectionTitle icon={<ShieldIcon />}>Login &amp; Security</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <Label required>Send Invitation Using</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-[13px] text-ink-700 cursor-pointer">
                    <input type="radio" name="sendVia" checked={form.sendVia === "email"} onChange={() => set("sendVia", "email")} className="accent-brand-600" />
                    Email <span className="text-ink-400">(Recommended)</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-[13px] text-ink-700 cursor-pointer">
                    <input type="radio" name="sendVia" checked={form.sendVia === "sms"} onChange={() => set("sendVia", "sms")} className="accent-brand-600" />
                    Phone Number (SMS)
                  </label>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label>Temporary Password</Label>
                  <Toggle on={form.tempPasswordEnabled} onChange={(v) => set("tempPasswordEnabled", v)} label="Temporary password" />
                </div>
                <div className={`flex items-center gap-1 rounded-lg border border-ink-200 px-3 py-2.5 ${form.tempPasswordEnabled ? "" : "opacity-50 pointer-events-none"}`}>
                  <input type={showPassword ? "text" : "password"} value={tempPassword} readOnly className="flex-1 min-w-0 bg-transparent text-[13.5px] text-ink-800 outline-none" />
                  <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword((s) => !s)} className="text-ink-400 hover:text-ink-700 p-1"><EyeIcon /></button>
                  <button type="button" aria-label="Regenerate password" onClick={() => setTempPassword(genPassword())} className="text-ink-400 hover:text-ink-700 p-1"><RefreshIcon /></button>
                </div>
                <p className="mt-1 text-[11px] text-ink-400">User will be prompted to change password on first login</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label>Two-Factor Authentication</Label>
                  <Toggle on={form.twoFactor} onChange={(v) => set("twoFactor", v)} label="Two-factor authentication" />
                </div>
                <p className="text-[11.5px] text-ink-500">Require 2FA verification for added security</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="card p-6">
            <SectionTitle icon={<DocIcon />}>Additional Information <span className="text-ink-400 font-normal">(Optional)</span></SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Add a Personal Message</Label>
                <textarea value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Write a message to the team member (optional)..." maxLength={500} className="w-full min-h-[120px] p-3 rounded-lg border border-ink-200 text-[13.5px] focus:outline-none focus:border-brand-400 placeholder:text-ink-400 resize-y" />
              </div>
              <div>
                <Label>Upload Profile Picture</Label>
                <button type="button" className="w-full min-h-[120px] rounded-lg border-2 border-dashed border-ink-200 hover:border-brand-300 transition-colors flex flex-col items-center justify-center text-ink-500">
                  <span className="text-brand-500 mb-1.5"><UploadIcon /></span>
                  <span className="text-[13px] font-semibold text-ink-700">Click to upload</span>
                  <span className="text-[11.5px] text-ink-400 mt-0.5">JPG, PNG or GIF (Max. 2MB)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-end gap-3 border-t border-ink-100 pt-4">
            <button type="button" onClick={() => router.push("/company/team")} className="px-6 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition">Cancel</button>
            <button type="button" onClick={handleSend} disabled={saving || loading} className="px-6 py-2.5 rounded-lg text-white text-[13.5px] font-semibold hover:opacity-95 transition inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed" style={{ background: "var(--gradient-brand)" }}>
              {saving ? (isEdit ? "Saving…" : "Sending…") : (isEdit ? "Save Changes" : "Send Invitation")} <ChevronRight />
            </button>
          </div>
        </div>

        {/* ── Right rail ── */}
        <aside className="w-[320px] shrink-0 hidden xl:block space-y-4">
          <RailCard icon={<UserIcon />} title="About Team Members">
            <p className="text-[12px] text-ink-500 mb-2.5">Team members can help you manage your hiring process more efficiently.</p>
            <ul className="space-y-2">
              {["Collaborate on jobs and candidates", "Share notes and feedback", "Track progress and generate reports", "Secure role-based access"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-[12.5px] text-ink-700"><span className="text-green-600 mt-0.5 shrink-0"><CheckIcon /></span> {t}</li>
              ))}
            </ul>
          </RailCard>

          <RailCard icon={<ShieldIcon />} title="Roles & Permissions">
            <p className="text-[12px] text-ink-500 mb-3">Choose a role based on responsibilities.</p>
            <ul className="space-y-3">
              {[
                { role: "Admin", desc: "Full access to all features and settings" },
                { role: "Manager", desc: "Manage jobs, candidates and clients" },
                { role: "Recruiter", desc: "Access to jobs and candidates" },
                { role: "Viewer", desc: "View access to assigned data only" },
              ].map((r) => (
                <li key={r.role} className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0"><UserIcon small /></span>
                  <span><span className="block text-[13px] font-semibold text-ink-900">{r.role}</span><span className="block text-[11.5px] text-ink-500">{r.desc}</span></span>
                </li>
              ))}
            </ul>
          </RailCard>

          <RailCard icon={<InfoIcon />} title="Important">
            <p className="text-[12.5px] text-ink-600 leading-relaxed">
              An invitation email will be sent to the team member with login instructions and a link to set their password.
            </p>
            <p className="text-[12.5px] text-ink-600 leading-relaxed mt-2">
              You can manage team members and their access anytime from <span className="text-brand-600 font-semibold">Team Settings</span>.
            </p>
          </RailCard>
        </aside>
      </div>
    </div>
  );
}

/* ── Form primitives ──────────────────────────────────────────────────── */
function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return <h2 className="font-display font-bold text-[15px] mb-4 flex items-center gap-2 text-ink-900"><span className="text-brand-600">{icon}</span> {children}</h2>;
}
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">{children} {required && <span className="text-red-500">*</span>}</label>;
}
function Field({ label, required, value, onChange, placeholder, error, maxLength }: { label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder?: string; error?: string; maxLength?: number }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
        className={`w-full px-3 py-2.5 rounded-lg border ${error ? "border-red-400" : "border-ink-200"} text-[13.5px] focus:outline-none focus:border-brand-400 placeholder:text-ink-400`} />
      {error && <p className="mt-1 text-[11px] text-red-500" role="alert">{error}</p>}
    </div>
  );
}
function SelectField({ label, required, value, onChange, placeholder, options, error }: { label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder?: string; options: string[]; error?: string }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="relative">
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-3 pr-9 py-2.5 rounded-lg border ${error ? "border-red-400" : "border-ink-200"} text-[13.5px] bg-white focus:outline-none focus:border-brand-400 ${value ? "text-ink-900" : "text-ink-400"} appearance-none`}>
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><ChevronDown /></span>
      </div>
      {error && <p className="mt-1 text-[11px] text-red-500" role="alert">{error}</p>}
    </div>
  );
}
function PhoneField({ label, cc, onCc, value, onValue, placeholder }: { label: string; cc: string; onCc: (v: string) => void; value: string; onValue: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <div className="relative">
          <select value={cc} onChange={(e) => onCc(e.target.value)} className="pl-3 pr-7 py-2.5 rounded-lg border border-ink-200 text-[13.5px] bg-white focus:outline-none focus:border-brand-400 appearance-none">
            {COUNTRY_CODES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><ChevronDown /></span>
        </div>
        <input value={value ?? ""} onChange={(e) => onValue(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" maxLength={10} placeholder={placeholder}
          className="flex-1 px-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] focus:outline-none focus:border-brand-400 placeholder:text-ink-400" />
      </div>
    </div>
  );
}
function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${on ? "bg-brand-600" : "bg-ink-300"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
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
function UserIcon({ small }: { small?: boolean }) { const s = small ? 13 : 16; return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function KeyIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" /><path d="M11 11l8 8m-3 0l2-2m-5-1l2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ShieldIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.6" /><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function DocIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" /><path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function InfoIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>); }
function UploadIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 9.5a3.5 3.5 0 0 1 .5 6.97" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M12 12v6M9.5 14.5l2.5-2.5 2.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function EyeIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function RefreshIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 1 1-2.64-6.36M21 4v5h-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function CheckIcon() { return (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ChevronDown() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ChevronRight() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
