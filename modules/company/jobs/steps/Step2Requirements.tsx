"use client";

import JobStepper from "../shared/JobStepper";
import RightRail from "../shared/RightRail";
import type { JobDraft, RequirementsData, SkillRow } from "../shared/types";

interface Props {
  data: JobDraft;
  onChange: (d: JobDraft) => void;
  onBack: () => void;
  onContinue: () => void;
}

const SKILL_COLORS: Record<string, string> = {
  JavaScript: "bg-yellow-100 text-yellow-700",
  "React.js":  "bg-blue-100 text-blue-700",
  "Node.js":   "bg-green-100 text-green-700",
  SQL:         "bg-purple-100 text-purple-700",
  Git:         "bg-orange-100 text-orange-700",
};

export default function Step2Requirements({ data, onChange, onBack, onContinue }: Props) {
  const r = data.requirements;
  const set = <K extends keyof RequirementsData>(k: K, v: RequirementsData[K]) =>
    onChange({ ...data, requirements: { ...r, [k]: v } });

  const setSkillYears = (id: string, years: number) =>
    set("skills", r.skills.map((s) => (s.id === id ? { ...s, years: Math.max(0, years) } : s)));
  const removeSkill = (id: string) => set("skills", r.skills.filter((s) => s.id !== id));
  const addSkill = () => {
    const id = `${Date.now()}`;
    set("skills", [...r.skills, { id, name: "New Skill", years: 1 }]);
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between gap-4 mb-4">
        <button onClick={onBack} className="px-3.5 py-2 rounded-lg border border-ink-200 text-ink-700 text-[12.5px] font-semibold hover:bg-ink-100 transition inline-flex items-center gap-1.5">
          <ArrowLeft /> Back to Job Details
        </button>
        <div className="text-center flex-1">
          <h1 className="font-display text-[22px] font-extrabold">Post a New Job</h1>
          <p className="text-ink-500 text-[12.5px]">Define the requirements and skills needed for this role.</p>
        </div>
        <div className="shrink-0" />
      </div>

      <div className="mb-6"><JobStepper current={2} /></div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">
        <div className="space-y-4">
          {/* Job Requirements */}
          <Card>
            <div className="mb-4">
              <h2 className="font-display text-[16px] font-extrabold">Job Requirements</h2>
              <p className="text-ink-500 text-[12.5px]">Add the key requirements for candidates applying to this role.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label required>Minimum Experience</Label>
                <div className="grid grid-cols-[1fr_140px] gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"><BriefIcon /></span>
                    <input type="number" min={0} value={r.minExperience}
                      onChange={(e) => set("minExperience", Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] focus:outline-none focus:border-brand-400" />
                  </div>
                  <Select value={r.experienceUnit} onChange={(v) => set("experienceUnit", v)} options={["Years", "Months"]} />
                </div>
              </div>
              <Select label="Experience Level" required value={r.experienceLevel} onChange={(v) => set("experienceLevel", v)}
                options={["Entry Level", "Early Career", "Mid Level", "Senior Level", "Lead / Manager"]} />
            </div>

            <div className="mt-4">
              <Label required>Key Responsibilities</Label>
              <RichTextStub />
              <textarea value={r.responsibilities} onChange={(e) => set("responsibilities", e.target.value)}
                className="w-full min-h-[140px] p-3 rounded-b-lg border border-ink-200 border-t-0 text-[13.5px] focus:outline-none focus:border-brand-300 resize-y"
                placeholder="• Develop and maintain scalable web applications.&#10;• Collaborate with cross-functional teams to define and ship new features.&#10;• Write clean, efficient, and well-documented code.&#10;• Ensure performance, quality, and responsiveness of applications.&#10;• Troubleshoot and fix issues across the stack."
                maxLength={3000} />
              <div className="text-right text-[11px] text-ink-400 mt-0.5">{r.responsibilities.length}/3000</div>
            </div>
          </Card>

          {/* Skills & Experience */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-[16px] font-extrabold">Skills & Experience</h2>
                <p className="text-ink-500 text-[12.5px]">Add the essential skills required for this role along with the expected experience for each.</p>
              </div>
              <button onClick={addSkill} className="px-3.5 py-2 rounded-lg border border-brand-300 text-brand-700 text-[12.5px] font-semibold hover:bg-brand-50 transition inline-flex items-center gap-1.5">
                + Add Skill
              </button>
            </div>

            <div className="rounded-lg border border-ink-100 overflow-hidden">
              <div className="grid grid-cols-[36px_1fr_220px_120px_60px] gap-2 px-3 py-2.5 bg-ink-100/50 text-[11.5px] font-bold text-ink-700">
                <div></div>
                <div>Skill</div>
                <div>Minimum Experience</div>
                <div></div>
                <div className="text-right pr-1">Action</div>
              </div>
              <ul className="divide-y divide-ink-100">
                {r.skills.map((s) => (
                  <SkillRowItem key={s.id} skill={s} onYears={(y) => setSkillYears(s.id, y)} onRemove={() => removeSkill(s.id)} />
                ))}
              </ul>
            </div>
          </Card>

          <div className="flex items-center justify-between pt-4">
            <button onClick={onBack} className="px-5 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition">Cancel</button>
            <button onClick={onContinue} className="px-6 py-2.5 rounded-lg text-white text-[13.5px] font-semibold inline-flex items-center gap-2" style={{ background: "var(--gradient-brand)" }}>
              Next: Compensation <ArrowRight />
            </button>
          </div>
        </div>

        <RightRail
          current={2}
          data={data}
          tips={{
            title: "Tips for a great job post",
            tips: ["Add clear and specific requirements", "List key skills with relevant experience", "Keep responsibilities concise and outcome-focused", "Mention must-have vs. preferred skills", "Review before moving to next step"],
          }}
        />
      </div>
    </div>
  );
}

function SkillRowItem({ skill, onYears, onRemove }: { skill: SkillRow; onYears: (y: number) => void; onRemove: () => void }) {
  return (
    <li className="grid grid-cols-[36px_1fr_220px_120px_60px] gap-2 px-3 py-2.5 items-center">
      <span className="text-ink-300 cursor-grab">⋮⋮</span>
      <div className="flex items-center gap-2.5">
        <span className={`w-8 h-8 rounded-md font-bold text-[11px] flex items-center justify-center ${SKILL_COLORS[skill.name] ?? "bg-brand-50 text-brand-700"}`}>
          {skill.name.slice(0, 2).toUpperCase()}
        </span>
        <span className="text-[13px] font-semibold">{skill.name}</span>
      </div>
      <div className="flex items-center border border-ink-200 rounded-md">
        <button onClick={() => onYears(skill.years - 1)} className="w-9 h-9 hover:bg-ink-100 text-ink-700">−</button>
        <span className="flex-1 text-center text-[13px] font-semibold">{skill.years}</span>
        <button onClick={() => onYears(skill.years + 1)} className="w-9 h-9 hover:bg-ink-100 text-ink-700">+</button>
      </div>
      <span className="text-[13px] text-ink-700">Years</span>
      <button onClick={onRemove} className="text-ink-400 hover:text-red-500 transition w-8 h-8 grid place-items-center"><TrashIcon /></button>
    </li>
  );
}

function Card({ children }: { children: React.ReactNode }) { return <section className="bg-white border border-ink-100 rounded-xl p-5">{children}</section>; }
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) { return <label className="block text-[12px] font-semibold text-ink-700 mb-1.5">{children} {required && <span className="text-red-500">*</span>}</label>; }
function Select({ label, required, value, onChange, options }: { label?: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <div className="relative">
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 pr-9 py-2.5 rounded-lg border border-ink-200 text-[13.5px] bg-white focus:outline-none focus:border-brand-400 appearance-none">
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">▾</span>
      </div>
    </div>
  );
}
function RichTextStub() {
  return (
    <div className="flex items-center gap-1 px-2.5 py-2 border border-ink-200 border-b-0 rounded-t-lg bg-ink-100/40 text-ink-500 text-[13px]">
      {["B", "I", "U"].map((c) => <button key={c} className="w-7 h-7 hover:bg-white rounded font-semibold">{c}</button>)}
      <span className="text-ink-300 mx-1">|</span>
      {["≡", "≣", "⫶", "≣"].map((c, i) => <button key={i} className="w-7 h-7 hover:bg-white rounded">{c}</button>)}
      <span className="text-ink-300 mx-1">|</span>
      <button className="w-7 h-7 hover:bg-white rounded">🔗</button>
    </div>
  );
}

function BriefIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function ArrowRight() { return (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function ArrowLeft() { return (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13 8H3m0 0l5-5m-5 5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function TrashIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m1 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
