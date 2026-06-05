import Image from "next/image";
import SidebarFeatures from "./SidebarFeatures";
import SidebarProgress from "./SidebarProgress";

const STEP_MESSAGES = [
  { heading: "Start Your Career Journey", sub: "with HireMind",  desc: "Create your profile, get discovered by top recruiters and find the right opportunities faster with AI." },
  { heading: "You're one step",           sub: "closer!",        desc: "Complete your professional details to help us personalize your experience." },
  { heading: "You're almost",             sub: "there!",         desc: "Add your skills and preferences so we can find the best opportunities for you." },
  { heading: "You're",                    sub: "all set!",       desc: "Review your details before submitting. You can edit any section if needed." },
];

/* chips shown per step */
const STEP_CHIPS: Record<number, React.ReactNode> = {
  1: (
    <>
      <div className="absolute top-[32%] left-2 bg-white rounded-xl shadow-md px-2.5 py-1.5 z-20">
        <div className="text-[9px] font-semibold text-ink-700">Job Match</div>
        <div className="text-yellow-500 text-[9.5px] tracking-widest mt-0.5">★★★★☆</div>
      </div>
      <div className="absolute top-[55%] right-2 bg-white rounded-xl shadow-md px-2.5 py-1.5 z-20">
        <div className="text-[9px] font-semibold text-brand-600">🔔 New Jobs</div>
      </div>
    </>
  ),
  2: (
    <>
      <div className="absolute top-[32%] left-2 bg-white rounded-xl shadow-md px-2.5 py-1.5 z-20 flex flex-col items-center">
        <div className="text-[9px] font-semibold text-ink-700">Profile</div>
        <div className="text-brand-600 font-extrabold text-[13px] leading-none mt-0.5">50%</div>
      </div>
      <div className="absolute top-[55%] right-2 bg-white rounded-xl shadow-md px-2.5 py-1.5 z-20">
        <div className="text-[9px] font-semibold text-green-600">✓ Step 2</div>
      </div>
    </>
  ),
  3: (
    <>
      <div className="absolute top-[32%] left-2 bg-white rounded-xl shadow-md px-2.5 py-1.5 z-20">
        <div className="text-[9px] font-semibold text-ink-700">Skills Added</div>
        <div className="text-brand-600 font-bold text-[11px] mt-0.5">⭐ 8 Skills</div>
      </div>
      <div className="absolute top-[55%] right-2 bg-white rounded-xl shadow-md px-2.5 py-1.5 z-20">
        <div className="text-[9px] font-semibold text-brand-600">🎯 75%</div>
      </div>
    </>
  ),
  4: (
    <>
      <div className="absolute top-[32%] left-2 bg-white rounded-xl shadow-md px-2.5 py-1.5 z-20">
        <div className="text-[9px] font-semibold text-green-600">✓ All Done!</div>
      </div>
      <div className="absolute top-[55%] right-2 bg-white rounded-xl shadow-md px-2.5 py-1.5 z-20">
        <div className="text-[9px] font-semibold text-brand-600">🚀 Ready</div>
      </div>
    </>
  ),
};

interface CandidateSidebarProps {
  step: number;
}

export default function CandidateSidebar({ step }: CandidateSidebarProps) {
  const currentStep = Math.min(step, 4);
  const msg         = STEP_MESSAGES[currentStep - 1];

  return (
    <aside className="hidden lg:flex flex-col p-4 shrink-0 overflow-y-auto min-h-0 w-[300px] xl:w-[340px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

      {/* Step message */}
      <div className="mb-3">
        <h2 className="font-display font-extrabold text-[20px] xl:text-[22px] text-ink-900 leading-[1.2] tracking-tight">
          {msg.heading}{" "}
          {msg.sub && <span className="text-brand-600">{msg.sub}</span>}
        </h2>
        <p className="mt-1.5 text-ink-500 text-[12.5px] leading-relaxed">{msg.desc}</p>
      </div>

      {/* Illustration — same pattern as RoleSelectionPage */}
      <div className="relative rounded-2xl bg-[#EDE9FF] h-[160px] mb-3 shrink-0 overflow-hidden">
        {/* bg circle shade */}
        <div className="absolute inset-x-6 top-6 bottom-0 rounded-full bg-[#C4B5FD]/30 z-0" />
        {/* character */}
        <Image
          src="/images/candidate.png"
          alt="Candidate"
          fill
          sizes="340px"
          className="object-contain object-bottom z-[1]"
        />
        {/* step chips */}
        {STEP_CHIPS[currentStep]}
      </div>

      {/* Step-specific content */}
      {currentStep === 1 ? <SidebarFeatures /> : <SidebarProgress currentStep={currentStep} />}
    </aside>
  );
}
