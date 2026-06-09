"use client";

import { useState } from "react";

interface Alert {
  id: string;
  title: string;
  sub: string;
  enabled: boolean;
}

const INITIAL_ALERTS: Alert[] = [
  { id: "1", title: "Software Engineer in Bangalore", sub: "Daily alerts at 9:00 AM", enabled: true },
];

export default function JobAlertsPanel() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  function toggle(id: string) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-[15px] text-ink-900">Job Alerts</h3>
        <button className="text-[12.5px] text-brand-600 font-semibold hover:text-brand-800 transition-colors">Manage</button>
      </div>
      <p className="text-[12px] text-ink-400 mb-4">Get notified about new jobs matching your preferences.</p>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-ink-100/60">
            <div>
              <div className="text-[13px] font-semibold text-ink-800">{alert.title}</div>
              <div className="text-[11.5px] text-ink-500 mt-0.5">{alert.sub}</div>
            </div>
            {/* Toggle */}
            <button
              onClick={() => toggle(alert.id)}
              className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${alert.enabled ? "bg-brand-600" : "bg-ink-300"}`}
              aria-label="Toggle alert"
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${alert.enabled ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </div>

      <button className="mt-3 flex items-center gap-1.5 text-[12.5px] text-brand-600 font-semibold hover:text-brand-800 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add New Alert
      </button>
    </div>
  );
}
