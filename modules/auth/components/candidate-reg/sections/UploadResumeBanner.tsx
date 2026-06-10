"use client";

import { UploadIcon } from "../shared/icons";

export default function UploadResumeBanner() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-brand-200 bg-brand-50/40 px-4 py-2.5">
      <div className="w-10 h-10 rounded-xl bg-white border border-brand-200 flex items-center justify-center shrink-0 text-brand-600">
        <UploadIcon />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[13.5px] text-brand-700">
          Upload Your Resume{" "}
          <span className="text-[11px] font-semibold text-brand-500">(Paid Plan Feature)</span>
        </div>
        <div className="text-[12px] text-ink-500 mt-0.5">Stand out to recruiters by uploading your resume.</div>
        <div className="text-[11px] text-ink-400 mt-0.5">Allowed format: PDF, DOCX only &nbsp;•&nbsp; Max size: 5MB</div>
      </div>
      <button type="button"
        className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-300 bg-white text-[13px] font-semibold text-brand-700 hover:bg-brand-50 transition whitespace-nowrap">
        <UploadIcon /> Upload Resume
        <br />
        <span className="text-[10px] font-normal text-ink-400">PDF, DOCX only</span>
      </button>
    </div>
  );
}
