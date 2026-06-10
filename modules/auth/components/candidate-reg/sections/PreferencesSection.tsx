"use client";

import { useState, useEffect } from "react";
import { NOTICE_OPTIONS, SALARY_OPTIONS, SALARY_TYPE, LOCATION_OPTIONS, BENEFIT_OPTIONS, EMPLOYMENT_TYPE_MAP, EMPLOYMENT_TYPES } from "../shared/constants";
import { SelectField } from "../shared/ui";
import { PrefsIcon } from "../shared/icons";
import type { PreferencesData } from "../shared/types";
import { fetchEmploymentTypes } from "../../../services/candidate.service";
import { toLabel } from "@/lib/utils";

interface Props {
  data: PreferencesData;
  onChange: (data: PreferencesData) => void;
}

/** { label: "Full Time", enumName: "FULL_TIME" } */
interface EmpTypeOption { label: string; enumName: string; }

// Fallback built from hardcoded constants
const FALLBACK_EMP_OPTIONS: EmpTypeOption[] = EMPLOYMENT_TYPES.map((label) => ({
  label,
  enumName: EMPLOYMENT_TYPE_MAP[label] ?? label.toUpperCase().replace(/ /g, "_"),
}));

export default function PreferencesSection({ data, onChange }: Props) {
  const [pref, setPref]         = useState<PreferencesData>(data);
  const [roleInput, setRoleInput] = useState("");
  const [empOptions, setEmpOptions] = useState<EmpTypeOption[]>(FALLBACK_EMP_OPTIONS);

  useEffect(() => {
    fetchEmploymentTypes()
      .then((items) => {
        if (!items.length) return;
        setEmpOptions(items.map((i) => ({ label: toLabel(i.name), enumName: i.name })));
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  const set = <K extends keyof PreferencesData>(key: K, value: PreferencesData[K]) => {
    const next = { ...pref, [key]: value };
    setPref(next);
    onChange(next);
  };

  const toggle = (field: "employmentTypes" | "benefits", value: string) => {
    const arr = pref[field];
    set(field, arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  const addRole = () => {
    const role = roleInput.trim();
    if (role && !pref.jobRolePreferences.includes(role)) {
      set("jobRolePreferences", [...pref.jobRolePreferences, role]);
    }
    setRoleInput("");
  };

  const removeRole = (role: string) =>
    set("jobRolePreferences", pref.jobRolePreferences.filter(r => r !== role));

  return (
    <section className="p-5">
      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0"><PrefsIcon /></div>
            <span className="font-display font-bold text-[15px] text-ink-900">Preferences</span>
          </div>
          <p className="text-[12px] text-ink-500 pl-[42px]">Tell us your preferences to get better job recommendations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <SelectField label="Notice Period" required value={pref.noticePeriod} onChange={v => set("noticePeriod", v)} options={NOTICE_OPTIONS} />
          <SelectField label="Expected Salary (Annual CTC)" required value={pref.expectedSalary} onChange={v => set("expectedSalary", v)} options={SALARY_OPTIONS} />
          <SelectField label="Salary Type" value={pref.salaryType} onChange={v => set("salaryType", v)} options={SALARY_TYPE} />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
            Job Role Preferences <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-ink-200 bg-white/80 min-h-[44px]">
            {pref.jobRolePreferences.map(role => (
              <span key={role} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[13px] font-semibold border border-brand-200">
                {role}
                <button type="button" onClick={() => removeRole(role)} className="text-brand-400 hover:text-brand-700 transition leading-none text-[15px]">×</button>
              </span>
            ))}
            <input value={roleInput} onChange={e => setRoleInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addRole(); } }}
              onBlur={addRole}
              placeholder="+ Add Role"
              className="px-2 py-1 text-[12.5px] text-ink-600 placeholder:text-ink-400 outline-none bg-transparent min-w-[80px]" />
          </div>
          <p className="text-[11.5px] text-ink-400 mt-1">Press Enter or comma to add a role</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 items-start">
          <SelectField label="Preferred Work Location" required value={pref.preferredLocation} onChange={v => set("preferredLocation", v)} options={LOCATION_OPTIONS} />
          <div className="pt-7">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={pref.openToRelocate} onChange={e => set("openToRelocate", e.target.checked)} className="w-4 h-4 rounded accent-brand-600" />
              <span className="text-[13.5px] font-medium text-ink-700 flex items-center gap-1.5">
                Open to relocate
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-ink-700 mb-2.5">Preferred Employment Type</label>
          <div className="flex flex-wrap gap-4">
            {empOptions.map(({ label, enumName }) => (
              <label key={enumName} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={pref.employmentTypes.includes(enumName)} onChange={() => toggle("employmentTypes", enumName)} className="w-4 h-4 rounded accent-brand-600" />
                <span className="text-[13.5px] text-ink-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-ink-700 mb-2.5">
            Other Benefits You&apos;re Looking For <span className="text-ink-400 font-normal">(Select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {BENEFIT_OPTIONS.map(b => (
              <label key={b} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={pref.benefits.includes(b)} onChange={() => toggle("benefits", b)} className="w-4 h-4 rounded accent-brand-600" />
                <span className="text-[13.5px] text-ink-700">{b}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
            Additional Preferences / Notes <span className="text-ink-400 font-normal">(Optional)</span>
          </label>
          <textarea value={pref.additionalNotes}
            onChange={e => set("additionalNotes", e.target.value.slice(0, 250))}
            placeholder="Tell us anything else that can help us find the right opportunities for you..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-ink-200 text-[14px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition resize-none" />
          <p className="mt-1 text-right text-[12px] text-ink-400">{pref.additionalNotes.length}/250</p>
        </div>
      </div>
    </section>
  );
}
