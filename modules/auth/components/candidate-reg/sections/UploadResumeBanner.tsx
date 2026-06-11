"use client";

import { useRef, useState } from "react";
import { uploadResume } from "../../../services/candidate.service";
import { UploadIcon, SpinnerIcon } from "../shared/icons";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const ALLOWED_EXT   = [".pdf", ".docx"];

interface Props {
  /** S3 key returned by the backend after a previous upload — truthy means resume exists. */
  resumeFileKey?: string;
  /** Called with the file name and S3 key after a successful upload. */
  onUploaded?: (fileName: string, resumeFileKey: string | null) => void;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function UploadResumeBanner({ resumeFileKey, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus]       = useState<UploadStatus>(resumeFileKey ? "success" : "idle");
  const [fileName, setFileName]   = useState<string>("");
  const [errorMsg, setErrorMsg]   = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setStatus("error");
      setErrorMsg("Only PDF or DOCX files are allowed.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setStatus("error");
      setErrorMsg("File exceeds the 5 MB limit.");
      return;
    }

    setStatus("uploading");
    setErrorMsg("");
    setFileName(file.name);

    try {
      const key = await uploadResume(file);
      setStatus("success");
      onUploaded?.(file.name, key);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed. Please try again.");
    }
  };

  const isUploaded = status === "success";

  return (
    <div className={`flex items-center gap-4 rounded-xl border px-4 py-2.5 transition
      ${isUploaded ? "border-green-200 bg-green-50/40" : "border-brand-200 bg-brand-50/40"}`}>
      {/* hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_EXT.join(",")}
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload resume"
      />

      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition
        ${isUploaded ? "border-green-200 bg-white text-green-600" : "border-brand-200 bg-white text-brand-600"}`}>
        {isUploaded ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <UploadIcon />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className={`font-bold text-[13.5px] ${isUploaded ? "text-green-700" : "text-brand-700"}`}>
          {isUploaded
            ? <>Resume Uploaded <span className="text-[11px] font-semibold text-green-500">✓</span></>
            : <>Upload Your Resume <span className="text-[11px] font-semibold text-brand-500">(Paid Plan Feature)</span></>}
        </div>
        {isUploaded ? (
          <div className="text-[12px] text-ink-500 mt-0.5 truncate">{fileName || "Resume on file"}</div>
        ) : (
          <div className="text-[12px] text-ink-500 mt-0.5">Stand out to recruiters by uploading your resume.</div>
        )}
        {status === "error" && (
          <div className="text-[12px] text-red-600 mt-0.5" role="alert">{errorMsg}</div>
        )}
        {!isUploaded && (
          <div className="text-[11px] text-ink-400 mt-0.5">
            Allowed format: PDF, DOCX only&nbsp;•&nbsp;Max size: 5 MB
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={status === "uploading"}
        onClick={() => inputRef.current?.click()}
        className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border text-[13px] font-semibold transition whitespace-nowrap disabled:opacity-50
          ${isUploaded
            ? "border-green-300 bg-white text-green-700 hover:bg-green-50"
            : "border-brand-300 bg-white text-brand-700 hover:bg-brand-50"}`}>
        {status === "uploading"
          ? <><SpinnerIcon /> Uploading…</>
          : isUploaded
            ? "Replace"
            : <><UploadIcon /> Upload Resume</>}
      </button>
    </div>
  );
}
