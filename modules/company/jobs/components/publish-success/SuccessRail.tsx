"use client";

import { useState } from "react";
import { Social } from "./pieces";
import { ArrowRight, BulbIcon, GlobeIcon, LinkIcon, ShareIcon } from "./icons";

/* Right-rail of the publish-success page: share + copy link, live-on, tips. */
export function SuccessRail() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <aside className="flex flex-col gap-3">
      <div className="rounded-xl border border-ink-100 p-4 bg-white">
        <h3 className="font-display font-bold text-[14px] inline-flex items-center gap-1.5 mb-3"><ShareIcon /> Share Your Job</h3>
        <p className="text-[11.5px] text-ink-500 mb-3">Increase your reach by sharing your job on multiple platforms.</p>
        <div className="grid grid-cols-4 gap-2 mb-3">
          <Social icon="in" label="LinkedIn" bg="bg-blue-50 text-blue-700" />
          <Social icon="f" label="Facebook" bg="bg-blue-50 text-blue-700" />
          <Social icon="x" label="Twitter" bg="bg-sky-50 text-sky-700" />
          <Social icon="w" label="WhatsApp" bg="bg-green-50 text-green-700" />
        </div>
        <button
          onClick={copyLink}
          className={`w-full px-3 py-2 rounded-md border text-[12px] font-semibold transition inline-flex items-center justify-center gap-1.5 ${
            copied ? "border-green-300 bg-green-50 text-green-700" : "border-ink-200 text-ink-700 hover:bg-ink-100"
          }`}
        >
          <LinkIcon /> {copied ? "Link Copied!" : "Copy Link"}
        </button>
      </div>

      <div className="rounded-xl border border-ink-100 p-4 bg-white">
        <h3 className="font-display font-bold text-[14px] inline-flex items-center gap-1.5 mb-2.5"><GlobeIcon /> Job Post is Live On</h3>
        <ul className="space-y-1.5 text-[12.5px] text-ink-700">
          <li className="flex items-center gap-2"><span className="text-green-600">✓</span> HireMind Job Board</li>
          <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Email Alerts to Subscribers</li>
          <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> Partner Job Boards (Indeed, Naukri, LinkedIn, etc.)</li>
        </ul>
      </div>

      <div className="rounded-xl border border-ink-100 p-4 bg-white">
        <h3 className="font-display font-bold text-[14px] inline-flex items-center gap-1.5 mb-2.5"><BulbIcon /> Tips to get more applications</h3>
        <ul className="space-y-1.5 text-[12.5px] text-ink-700">
          <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Share your job on social media</li>
          <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Add relevant skills for better matches</li>
          <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Respond quickly to applicants</li>
        </ul>
        <a className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-green-600 font-semibold">View Best Practices <ArrowRight /></a>
      </div>
    </aside>
  );
}
