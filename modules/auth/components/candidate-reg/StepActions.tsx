"use client";

interface StepActionsProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  isLoading?: boolean;
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M13 8H3m0 0l5-5M3 8l5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10m0 0L8 3m5 5l-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function StepActions({
  onBack,
  onNext,
  nextLabel = "Save & Continue",
  isLoading = false,
}: StepActionsProps) {
  return (
    <div className="flex items-center justify-between pt-2 pb-2 border-t border-ink-100">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-ink-200 text-[13.5px] font-semibold text-ink-700 hover:bg-ink-50 transition"
        >
          <ArrowLeftIcon /> Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={isLoading}
        className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-[14px] hover:opacity-95 transition disabled:opacity-60"
        style={{ background: "var(--gradient-brand)" }}
      >
        {nextLabel} <ArrowRightIcon />
      </button>
    </div>
  );
}
