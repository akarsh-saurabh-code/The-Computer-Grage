import { useState, useEffect, useCallback } from "react";
/* ═══ COMPANY INFO ═════════════════════════════════════════════ */
const CO = {
  name:     "The Computer Garage",
  owner:    "Saurabh Singh",
  tagline:  "Powering Technology with Trust, Security & Performance.",
  sub:      "IT Infrastructure Solutions",
  phone:    "+91 8400281723",
  email:    "thecomputergarage@gmail.com",
  website:  "www.thecomputergarage.in",
  location: "Varanasi, Uttar Pradesh",
  pin:      "221010",
  cities:   ["Varanasi ★","Prayagraj","Lucknow","Gorakhpur","Mirzapur"],
};


import CCTVCalculator from "./CCTVCalculator";

const API = "https://tcg-backend-fvnc.onrender.com/api";

/* ─── API helper ─────────────────────────────────────────────── */
async function req(method, path, body, token) {
  const res = await fetch(API + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

/* ═══ ICONS ══════════════════════════════════════════════════ */
const I = {
  monitor:  (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/><line x1="8" y1="21" x2="16" y2="21"/></svg>,
  network:  (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-4h14v4"/><path d="M12 12V8"/></svg>,
  server:   (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="18" r="1" fill="currentColor"/></svg>,
  camera:   (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7 16 12 23 17z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  shield:   (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  chart:    (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  ticket:   (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/></svg>,
  users:    (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  user:     (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  lock:     (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  logout:   (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  home:     (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  list:     (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  file:     (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  clock:    (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  arrow:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  plus:     (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  menu:     (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  alert:    (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  mail:     (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phone:    (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  zap:      (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  printer:  (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  finger:   (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>,
  doorlock: (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="2" width="18" height="20" rx="2"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="14" x2="12" y2="17"/></svg>,
  intercom: (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="8" r="2"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
  iot:      (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M6.3 6.3a8 8 0 0 0 0 11.4"/><path d="M17.7 6.3a8 8 0 0 1 0 11.4"/><path d="M3.5 3.5a13 13 0 0 0 0 17"/><path d="M20.5 3.5a13 13 0 0 1 0 17"/></svg>,
  tag:      (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  edit:     (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>,
  send:     (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  key:      (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  rupee:    (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="18" y2="3"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="13" x2="12" y2="21"/><path d="M6 8a6 6 0 0 1 0-5"/><path d="M6 8h12a6 6 0 0 1 0 5H6"/></svg>,
  bell:     (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  settings: (s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  down:     (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  wrench:   (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
};

/* ═══ GLOBAL STYLES ══════════════════════════════════════════ */
const GS = () => <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --ink:#f4f7ff; --ink2:#8ba4cc; --ink3:#4a6490;
    --bg:#03080f; --bg1:#060d18; --bg2:#080f1e; --bg3:#0c1628;
    --panel:#0d1e35; --panel2:#102340;
    --blue:#1a6cff; --sky:#22d3f0; --red:#c41a1a;
    --ok:#06d6a0; --warn:#fbb02d; --err:#ff4560;
    --fh:'Space Grotesk',sans-serif;
    --fb:'Plus Jakarta Sans',sans-serif;
    --fm:'JetBrains Mono',monospace;
    --grad:linear-gradient(135deg,#1a6cff,#22d3f0);
  }
  html{scroll-behavior:smooth}
  body{font-family:var(--fb);background:var(--bg);color:var(--ink);overflow-x:hidden;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:2px}::-webkit-scrollbar-thumb{background:var(--blue);border-radius:2px}
  h1,h2,h3,h4{font-family:var(--fh);letter-spacing:-.025em}

  .btn{display:inline-flex;align-items:center;gap:8px;border:none;cursor:pointer;font-family:var(--fb);font-weight:600;font-size:14px;border-radius:10px;transition:all .2s;white-space:nowrap}
  .btn-p{background:var(--grad);color:#fff;padding:11px 24px;box-shadow:0 4px 20px rgba(26,108,255,.3)}.btn-p:hover{opacity:.88;transform:translateY(-1px);box-shadow:0 8px 28px rgba(26,108,255,.4)}
  .btn-o{background:rgba(26,108,255,.06);color:var(--sky);border:1px solid rgba(34,211,240,.25);padding:10px 24px}.btn-o:hover{background:rgba(34,211,240,.1);border-color:var(--sky)}
  .btn-g{background:transparent;color:var(--ink2);border:none;padding:8px 14px;font-size:13px}.btn-g:hover{background:var(--panel);color:var(--ink)}
  .btn-r{background:rgba(255,69,96,.1);color:var(--err);border:1px solid rgba(255,69,96,.2);padding:8px 14px}.btn-r:hover{background:rgba(255,69,96,.18)}
  .btn-sm{padding:7px 16px;font-size:13px}.btn-xs{padding:5px 11px;font-size:12px}

  .card{background:var(--panel);border:1px solid rgba(26,108,255,.1);border-radius:16px;padding:24px;transition:all .25s}
  .card:hover{border-color:rgba(34,211,240,.2);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.3)}

  .input{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(26,108,255,.2);border-radius:9px;padding:11px 14px;color:var(--ink);font-family:var(--fb);font-size:14px;outline:none;transition:border-color .18s}
  .input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(26,108,255,.12)}.input::placeholder{color:var(--ink3)}
  select.input option{background:var(--bg2)}textarea.input{resize:vertical;min-height:90px}
  .lbl{font-size:11px;font-weight:600;color:var(--ink3);letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;display:block;font-family:var(--fm)}

  .bdg{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;font-family:var(--fm);letter-spacing:.03em}
  .bdg-b{background:rgba(26,108,255,.15);color:var(--sky);border:1px solid rgba(34,211,240,.2)}
  .bdg-g{background:rgba(6,214,160,.1);color:var(--ok);border:1px solid rgba(6,214,160,.2)}
  .bdg-y{background:rgba(251,176,45,.1);color:var(--warn);border:1px solid rgba(251,176,45,.2)}
  .bdg-r{background:rgba(255,69,96,.1);color:var(--err);border:1px solid rgba(255,69,96,.2)}
  .bdg-n{background:rgba(255,255,255,.04);color:var(--ink3);border:1px solid rgba(255,255,255,.08)}

  .stag{display:inline-flex;align-items:center;gap:8px;font-family:var(--fm);font-size:10px;color:var(--sky);letter-spacing:.14em;text-transform:uppercase;margin-bottom:16px}
  .stag::before{content:'';width:24px;height:1.5px;background:linear-gradient(90deg,var(--sky),transparent)}

  .g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
  @media(max-width:1100px){.g4{grid-template-columns:repeat(2,1fr)}.g3{grid-template-columns:1fr 1fr}}
  @media(max-width:768px){.g2,.g3,.g4{grid-template-columns:1fr}.hm{display:none!important}}

  .fi{animation:fi .45s ease both}@keyframes fi{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  .glowline{height:1px;background:linear-gradient(90deg,transparent,rgba(26,108,255,.6),rgba(34,211,240,.4),transparent)}

  table{width:100%;border-collapse:collapse}
  th{font-family:var(--fm);font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.1em;color:var(--ink3);padding:10px 16px;text-align:left;border-bottom:1px solid rgba(26,108,255,.1)}
  td{padding:12px 16px;border-bottom:1px solid rgba(26,108,255,.06);font-size:13px;color:var(--ink2)}
  tr:hover td{background:rgba(26,108,255,.03)}tr:last-child td{border-bottom:none}

  .moverlay{position:fixed;inset:0;background:rgba(3,8,15,.93);backdrop-filter:blur(10px);z-index:1000;display:flex;align-items:center;justify-content:center}
  .modal{background:var(--bg2);border:1px solid rgba(26,108,255,.22);border-radius:20px;padding:32px;width:90%;max-width:540px;max-height:88vh;overflow-y:auto}
  .modal-lg{max-width:700px}

  .topbar{position:sticky;top:0;z-index:100;background:rgba(3,8,15,.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(26,108,255,.1);padding:0 40px;height:66px;display:flex;align-items:center;justify-content:space-between}

  .slink{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;color:var(--ink2);font-size:13.5px;font-weight:500;cursor:pointer;transition:all .15s;border:1px solid transparent}
  .slink:hover{background:var(--panel);color:var(--ink)}.slink.on{background:rgba(26,108,255,.14);color:var(--sky);border-color:rgba(34,211,240,.2)}

  .pb{height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden}
  .pbf{height:100%;border-radius:2px;background:var(--grad);transition:width .8s ease}
  .sc{background:var(--panel);border:1px solid rgba(26,108,255,.1);border-radius:14px;padding:20px 22px}
  .sv{font-family:var(--fh);font-size:30px;font-weight:700;color:var(--ink);line-height:1;margin:8px 0 3px}.sl{font-size:12px;color:var(--ink3)}

  .dot{width:7px;height:7px;border-radius:50%;background:var(--ok);animation:pulse 2s infinite;display:inline-block}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(6,214,160,.4)}50%{box-shadow:0 0 0 6px rgba(6,214,160,0)}}

  .offer-banner{background:linear-gradient(135deg,rgba(251,176,45,.1),rgba(251,176,45,.04));border:1px solid rgba(251,176,45,.22);border-radius:12px;padding:14px 20px;display:flex;align-items:center;gap:12px;margin-bottom:18px}

  .hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(26,108,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(26,108,255,.06) 1px,transparent 1px);background-size:44px 44px;pointer-events:none}
  .hero-glow{position:absolute;border-radius:50%;pointer-events:none}

  @media(max-width:768px){.topbar{padding:0 16px}}
`}</style>;
/* ═══ LOGO ══════════════════════════════════════════════════ */
function Logo({ size=38, showText=true, textSize=15 }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
      <img src="/logo.jpeg" alt="TCG" style={{width:size,height:size,objectFit:"contain",borderRadius:8,background:"#fff",padding:3}}/>
      {showText && <span style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:textSize,color:"var(--ink)",letterSpacing:"-.02em",lineHeight:1.15}}>
        The Computer<br/><span style={{color:"var(--red)"}}>Garage</span>
      </span>}
    </div>
  );
}

/* ═══ TOAST ══════════════════════════════════════════════════ */
function Toast({ msg, type="ok" }) {
  if (!msg) return null;
  const c = type==="err" ? "var(--err)" : type==="warn" ? "var(--warn)" : "var(--ok)";
  return (
    <div style={{position:"fixed",bottom:24,right:24,background:"var(--bg2)",border:`1px solid ${c}`,borderRadius:10,padding:"12px 20px",color:c,fontWeight:600,fontSize:13,zIndex:9999,display:"flex",gap:8,alignItems:"center",boxShadow:"0 8px 32px rgba(0,0,0,.4)",animation:"fi .3s ease"}}>
      {type==="err"?I.alert(14):I.check(14)} {msg}
    </div>
  );
}

/* ═══ ROOT ══════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("tcg_user")); } catch { return null; } });
  const [token, setToken] = useState(() => localStorage.getItem("tcg_token") || "");
  const [as, setAs] = useState("dashboard");
  const [cs, setCs] = useState("overview");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type="ok") => {
    setToast({msg,type});
    setTimeout(() => setToast(null), 3000);
  }, []);

  const nav = (p) => { setPage(p); window.scrollTo(0,0); };

  const login = async (email, password) => {
    const data = await req("POST", "/login", { email, password });
    setUser(data.user); setToken(data.token);
    localStorage.setItem("tcg_user", JSON.stringify(data.user));
    localStorage.setItem("tcg_token", data.token);
    data.user.role === "client" ? (setPage("portal"), setCs("overview")) : (setPage("admin"), setAs("dashboard"));
  };

  const logout = () => {
    setUser(null); setToken("");
    localStorage.removeItem("tcg_user"); localStorage.removeItem("tcg_token");
    setPage("home");
  };

  return <>
    <GS/>
    <Toast msg={toast?.msg} type={toast?.type}/>
    {page==="home"   &&<Home nav={nav}/>}
    {page==="about"  &&<About nav={nav}/>}
    {page==="services"&&<Services nav={nav}/>}
    {page==="quote"  &&<Quote nav={nav} token={token} showToast={showToast}/>}
    {page==="contact"&&<Contact nav={nav} showToast={showToast}/>}
    {page==="login"  &&<Login nav={nav} login={login} showToast={showToast}/>}
    {page==="cctv"   &&<CCTVCalculator nav={nav}/>}
    {page==="admin"  &&user&&<Admin user={user} token={token} s={as} setS={setAs} logout={logout} nav={nav} showToast={showToast}/>}
    {page==="portal" &&user&&<Portal user={user} token={token} s={cs} setS={setCs} logout={logout} nav={nav} showToast={showToast}/>}
  </>;
}

/* ═══ NAV ════════════════════════════════════════════════════ */
function Nav({nav,cur}) {
  const [open, setOpen] = useState(false);
  const links=[["home","Home"],["about","About"],["services","Services"],["cctv","CCTV Calculator"],["quote","AMC Quote"],["contact","Contact"]];
  return (
    <nav className="topbar" style={{position:"relative"}}>
      <div onClick={()=>nav("home")}><Logo/></div>
      <div className="hm" style={{display:"flex",gap:2}}>
        {links.map(([id,lb])=><button key={id} className="btn btn-g" onClick={()=>nav(id)} style={{color:cur===id?"var(--sky)":"",fontWeight:cur===id?600:400}}>{lb}</button>)}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button className="btn btn-o btn-sm hm" onClick={()=>nav("login")}>Client Login</button>
        <button className="btn btn-p btn-sm" onClick={()=>nav("quote")}>Get Quote</button>
        <button className="btn btn-g" onClick={()=>setOpen(v=>!v)}>{I.menu(20)}</button>
      </div>
      {open&&<div style={{position:"absolute",top:64,left:0,right:0,background:"var(--bg1)",borderBottom:"1px solid rgba(0,85,255,.12)",padding:12,display:"flex",flexDirection:"column",gap:2,zIndex:200}}>
        {links.map(([id,lb])=><button key={id} className="btn btn-g" style={{textAlign:"left",justifyContent:"flex-start"}} onClick={()=>{nav(id);setOpen(false)}}>{lb}</button>)}
        <button className="btn btn-g" style={{textAlign:"left",justifyContent:"flex-start"}} onClick={()=>{nav("login");setOpen(false)}}>Client Login</button>
      </div>}
    </nav>
  );
}

/* ═══ FOOTER ════════════════════════════════════════════════ */
function Footer({nav}) {
  return (
    <footer style={{background:"var(--bg1)",borderTop:"1px solid rgba(0,85,255,.1)",padding:"48px 40px 24px"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:36,marginBottom:40}}>
          <div>
            <div onClick={()=>nav("home")} style={{marginBottom:14}}><Logo size={42} textSize={15}/></div>
            <p style={{fontSize:13,color:"var(--ink3)",lineHeight:1.8,maxWidth:260}}>End-to-end IT infrastructure, system integration & technology solutions. 9 services, one AMC, one trusted partner.</p>
            <div style={{marginTop:16,display:"flex",gap:8,alignItems:"center"}}><span className="dot"/><span style={{fontSize:12,color:"var(--ok)",fontFamily:"var(--fm)"}}>All systems operational</span></div>
          </div>
          {[
            {title:"Company",links:[["Home","home"],["About","about"],["Services","services"],["Contact","contact"]]},
            {title:"Services",links:[["IT AMC","services"],["Networking","services"],["CCTV Calculator","cctv"],["Biometrics","services"],["IoT & Smart Locks","services"]]},
            {title:"Portal",links:[["Client Login","login"],["AMC Quote","quote"],["Support","contact"]]},
          ].map((col,i)=>(
            <div key={i}>
              <div style={{fontSize:10,fontFamily:"var(--fm)",color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>{col.title}</div>
              {col.links.map(([lb,t],j)=><div key={j} onClick={()=>nav(t)} style={{fontSize:13,color:"var(--ink3)",marginBottom:9,cursor:"pointer",transition:"color .15s"}} onMouseEnter={e=>e.target.style.color="var(--ink)"} onMouseLeave={e=>e.target.style.color="var(--ink3)"}>{lb}</div>)}
            </div>
          ))}
        </div>
        <div className="glowline" style={{marginBottom:18}}/>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
          <span style={{fontSize:12,color:"var(--ink3)"}}>© 2026 The Computer Garage | Saurabh Singh, Varanasi.</span>
          <span style={{fontSize:12,color:"var(--ink3)",fontFamily:"var(--fm)"}}>Varanasi · Prayagraj · Lucknow · Gorakhpur</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════ */
function Home({nav}) {
  const [offers, setOffers] = useState([]);
  useEffect(()=>{ req("GET","/offers").then(setOffers).catch(()=>{}); },[]);

  const svcs=[
    {icon:I.monitor,title:"IT AMC",desc:"Computers, laptops, UPS, peripherals — unlimited visits, 4-hr SLA."},
    {icon:I.network,title:"Networking",desc:"CAT6A cabling, managed switches, Wi-Fi 6, firewall setup."},
    {icon:I.server,title:"Servers",desc:"Windows/Linux, VMware, NAS, Active Directory, backups."},
    {icon:I.camera,title:"CCTV",desc:"4K IP cameras, NVR/DVR, mobile remote viewing."},
    {icon:I.printer,title:"Printers",desc:"HP, Canon, Ricoh, Xerox — servicing, toner, AMC."},
    {icon:I.intercom,title:"Intercom",desc:"IP intercom, video door phone, office PA systems."},
    {icon:I.finger,title:"Biometrics",desc:"Fingerprint & face attendance, HRMS/Payroll integration."},
    {icon:I.doorlock,title:"Smart Locks",desc:"RFID, app-controlled locks — server rooms, offices."},
    {icon:I.iot,title:"IoT & Smart Office",desc:"Smart sensors, lighting, energy monitoring, BMS."},
  ];

  return (
    <div>
      <Nav nav={nav} cur="home"/>

      {/* Active offer banners */}
      {offers.length>0 && (
        <div style={{background:"var(--bg1)",borderBottom:"1px solid rgba(245,166,35,.2)",padding:"12px 40px",display:"flex",gap:12,overflowX:"auto"}}>
          {offers.map(o=>(
            <div key={o.id} className="offer-banner" style={{flexShrink:0,margin:0}}>
              {I.tag(16)}<div>
                <div style={{fontSize:13,fontWeight:700,color:"var(--warn)"}}>{o.title} — {o.discount_percent}% OFF</div>
                <div style={{fontSize:12,color:"var(--ink3)",marginTop:2}}>{o.description} · Code: <span style={{fontFamily:"var(--fm)",color:"var(--warn)"}}>{o.code}</span> · Valid till {o.valid_to}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hero */}
      <section style={{minHeight:"90vh",display:"flex",alignItems:"center",padding:"72px 40px",position:"relative",overflow:"hidden",background:"linear-gradient(160deg,var(--bg),var(--bg1))"}}>
        <div className="hero-grid"/>
        <div className="hero-glow" style={{top:"-10%",right:"0%",width:700,height:700,background:"radial-gradient(circle,rgba(26,108,255,.12),transparent 60%)"}}/>
        <div className="hero-glow" style={{bottom:"0%",left:"-5%",width:400,height:400,background:"radial-gradient(circle,rgba(34,211,240,.06),transparent 65%)"}}/>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%",position:"relative",zIndex:1}}>
          <div className="fi">
            <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:36,flexWrap:"wrap"}}>
              <img src="/logo.jpeg" alt="TCG" style={{width:80,height:80,objectFit:"contain",borderRadius:14,background:"#fff",padding:6,boxShadow:"0 0 32px rgba(0,85,255,.18)"}}/>
              <div>
                <div style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--sky)",letterSpacing:".14em",textTransform:"uppercase"}}>IT Infrastructure Solutions · Varanasi, UP</div>
                <div style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:22}}>The Computer <span style={{color:"var(--red)"}}>Garage</span></div>
              </div>
            </div>
            <h1 style={{fontFamily:"var(--fh)",fontSize:"clamp(32px,5.5vw,70px)",fontWeight:900,lineHeight:1.05,marginBottom:22,maxWidth:840}}>
              Powering Technology with<br/>
              <span style={{background:"linear-gradient(90deg,var(--blue),var(--sky))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Trust, Security & Performance.</span>
            </h1>
            <p style={{fontSize:"clamp(14px,1.5vw,17px)",color:"var(--ink2)",maxWidth:560,lineHeight:1.8,marginBottom:38}}>
              End-to-end IT infrastructure, system integration & technology solutions. Serving businesses across Varanasi & eastern UP since 2017.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button className="btn btn-p" onClick={()=>nav("quote")} style={{padding:"13px 32px",fontSize:15}}>Request AMC Quote {I.arrow(14)}</button>
              <button className="btn btn-o" onClick={()=>nav("services")} style={{padding:"12px 32px",fontSize:15}}>9 Services</button>
            </div>
          </div>

          <div style={{marginTop:64,display:"grid",gridTemplateColumns:"repeat(4,1fr)",background:"var(--panel)",border:"1px solid rgba(0,85,255,.12)",borderRadius:16,overflow:"hidden"}}>
            {[{val:"500+",lb:"Devices Managed",icon:I.monitor},{val:"9",lb:"Service Types",icon:I.zap},{val:"50+",lb:"AMC Clients",icon:I.users},{val:"8+ Yrs",lb:"Experience",icon:I.shield}].map((s,i)=>(
              <div key={i} style={{padding:"22px 24px",borderLeft:i>0?"1px solid rgba(0,85,255,.1)":"none",display:"flex",gap:12,alignItems:"center"}}>
                <div style={{color:"var(--sky)",opacity:.6}}>{s.icon(20)}</div>
                <div><div style={{fontFamily:"var(--fh)",fontSize:24,fontWeight:900,color:"var(--sky)",lineHeight:1}}>{s.val}</div><div style={{fontSize:11,color:"var(--ink3)",marginTop:3}}>{s.lb}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="glowline"/>

      {/* Services grid */}
      <section style={{padding:"72px 40px",maxWidth:1200,margin:"0 auto"}}>
        <div className="stag">What We Do</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:40,flexWrap:"wrap",gap:12}}>
          <h2 style={{fontSize:"clamp(22px,3.5vw,40px)",fontWeight:800,maxWidth:520}}>9 Services. One Contract.</h2>
          <button className="btn btn-o btn-sm" onClick={()=>nav("services")}>View Details {I.arrow(13)}</button>
        </div>
        <div className="g3">
          {svcs.map((s,i)=>(
            <div key={i} className="card fi" style={{cursor:"pointer",animationDelay:`${i*.05}s`}} onClick={()=>nav("services")}>
              <div style={{width:44,height:44,borderRadius:10,background:"rgba(26,108,255,.12)",border:"1px solid rgba(0,85,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--sky)",marginBottom:14}}>{s.icon(18)}</div>
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:6}}>{s.title}</h3>
              <p style={{fontSize:12.5,color:"var(--ink2)",lineHeight:1.6}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CCTV Calculator Banner */}
      <section style={{padding:"0 40px 56px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{background:"linear-gradient(135deg,rgba(196,26,26,.1),rgba(26,108,255,.08))",border:"1px solid rgba(196,26,26,.25)",borderRadius:18,padding:"28px 36px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20}}>
            <div style={{display:"flex",gap:18,alignItems:"center"}}>
              <div style={{width:52,height:52,borderRadius:12,background:"rgba(196,26,26,.12)",border:"1px solid rgba(196,26,26,.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--red)",flexShrink:0}}>{I.camera(22)}</div>
              <div>
                <div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:18,marginBottom:5}}>CCTV Price Calculator — HD &amp; IP Systems</div>
                <div style={{fontSize:13,color:"var(--ink2)"}}>Select cameras, DVR/NVR, HDD, wire — accessories auto-calculated. Instant price estimate!</div>
              </div>
            </div>
            <button className="btn btn-p" style={{padding:"12px 28px",fontSize:14,background:"var(--red)",boxShadow:"0 4px 16px rgba(196,26,26,.3)",flexShrink:0}} onClick={()=>nav("cctv")}>
              Open Calculator
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"64px 40px",background:"var(--bg1)"}}>
        <div style={{maxWidth:720,margin:"0 auto",textAlign:"center",background:"linear-gradient(135deg,rgba(26,108,255,.1),rgba(34,211,240,.04))",border:"1px solid rgba(26,108,255,.2)",borderRadius:22,padding:"52px 40px"}}>
          <div className="stag" style={{justifyContent:"center"}}>Get Started</div>
          <h2 style={{fontSize:"clamp(20px,3.5vw,38px)",fontWeight:800,marginBottom:12,lineHeight:1.2}}>Get Your Custom IT Quote</h2>
          <p style={{color:"var(--ink2)",fontSize:15,marginBottom:30,lineHeight:1.7}}>Free on-site survey for Varanasi clients. Response within 24 hours.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn btn-p" style={{padding:"13px 32px",fontSize:15}} onClick={()=>nav("quote")}>Request Free Quote</button>
            <button className="btn btn-o" style={{padding:"12px 32px",fontSize:15}} onClick={()=>nav("contact")}>Call Us</button>
          </div>
        </div>
      </section>

      <Footer nav={nav}/>
    </div>
  );
}

/* ═══ ABOUT (concise) ════════════════════════════════════════ */
function About({nav}) {
  return (
    <div>
      <Nav nav={nav} cur="about"/>
      <div style={{padding:"72px 40px",maxWidth:1100,margin:"0 auto"}}>
        <div className="stag">Our Story</div>
        <h1 style={{fontSize:"clamp(26px,4vw,50px)",fontWeight:900,maxWidth:640,marginBottom:48,lineHeight:1.1}}>IT Infrastructure Solutions — Varanasi</h1>
        <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:56,alignItems:"start"}}>
          <div>
            <p style={{color:"var(--ink2)",lineHeight:1.85,fontSize:15,marginBottom:18}}>Founded and led by <strong style={{color:"var(--ink)"}}>Saurabh Singh</strong>, The Computer Garage is a professional IT solutions and technology services company specializing in end-to-end digital infrastructure, system integration, and technical support services.</p>
            <p style={{color:"var(--ink2)",lineHeight:1.85,marginBottom:36}}>Today we manage computers, servers, networking, printers, CCTV, intercoms, biometric attendance, smart door locks, and IoT devices for 50+ businesses across Varanasi, Prayagraj, Lucknow, and Gorakhpur.</p>
            {[{icon:I.zap,t:"Reliability",d:"SLA-backed — when you call, we show up on time."},
              {icon:I.check,t:"Transparency",d:"No hidden charges, itemized proposals."},
              {icon:I.shield,t:"Proactive Care",d:"Monthly preventive visits before failures happen."},
            ].map((v,i)=>(
              <div key={i} style={{display:"flex",gap:14,marginBottom:18}}>
                <div style={{width:40,height:40,borderRadius:9,background:"rgba(0,85,255,.1)",border:"1px solid rgba(0,85,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--sky)",flexShrink:0}}>{v.icon(16)}</div>
                <div><div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{v.t}</div><div style={{fontSize:13,color:"var(--ink2)",lineHeight:1.6}}>{v.d}</div></div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{textAlign:"center",background:"var(--panel)",border:"1px solid rgba(0,85,255,.14)",borderRadius:14,padding:"24px 16px",marginBottom:4}}>
              <img src="/logo.jpeg" alt="TCG" style={{width:90,height:90,objectFit:"contain",borderRadius:12,background:"#fff",padding:7,marginBottom:14}}/>
              <div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:16}}>The Computer <span style={{color:"var(--red)"}}>Garage</span></div>
              <div style={{fontSize:11,color:"var(--ink3)",marginTop:3,fontFamily:"var(--fm)"}}>Est. 2017 · Varanasi</div>
            </div>
            {[["HQ","Varanasi — 221010, UP"],["Team","12+ Certified Engineers"],["Services","9 complete service types"],["Cities","Varanasi, Prayagraj, Lucknow, Gorakhpur"],["Hours","Mon–Sat 9AM–7PM"],["Emergency","24/7 for AMC clients"]].map(([lb,val],i)=>(
              <div key={i} style={{background:"var(--panel)",border:"1px solid rgba(0,85,255,.1)",borderRadius:10,padding:"10px 14px"}}>
                <div style={{fontSize:10,color:"var(--ink3)",fontFamily:"var(--fm)",textTransform:"uppercase",marginBottom:2}}>{lb}</div>
                <div style={{fontSize:13,fontWeight:600}}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer nav={nav}/>
    </div>
  );
}

/* ═══ SERVICES (concise cards) ═══════════════════════════════ */
function Services({nav}) {
  const [prices, setPrices] = useState([]);
  useEffect(()=>{ req("GET","/prices").then(setPrices).catch(()=>{}); },[]);
  const getPrice = (key) => prices.find(p=>p.service_key===key)?.price_per_unit || "—";

  const svcs=[
    {icon:I.monitor,k:"systems",title:"IT Infrastructure AMC",desc:"Full maintenance for computers, laptops, UPS, peripherals. 4-hr SLA, monthly preventive visits.",
     items:["Unlimited on-site visits","Monthly preventive maintenance","Asset tagging","Phone & remote support"]},
    {icon:I.network,k:null,title:"Networking & Cabling",desc:"CAT6A structured cabling, managed switches, Wi-Fi 6, firewall, full documentation.",
     items:["CAT6/CAT6A cabling","Cisco & HP switches","Wi-Fi 6 APs","Firewall & VLAN setup"]},
    {icon:I.server,k:"servers",title:"Server Management",desc:"Deployment, virtualization, AD, NAS/SAN, backup, 24/7 monitoring.",
     items:["Windows & Linux","VMware/Hyper-V","Active Directory","Backup & DR"]},
    {icon:I.camera,k:"cctv",title:"CCTV & Surveillance",desc:"4K IP cameras, NVR/DVR, remote mobile access, motion detection.",
     items:["Hikvision, Dahua, CP Plus","NVR/DVR setup","Mobile viewing","Multi-site monitoring"]},
    {icon:I.printer,k:"printers",title:"Printer & Copier AMC",desc:"HP, Canon, Ricoh, Xerox — all brands, laser & inkjet, toner supply.",
     items:["All brands serviced","Toner/cartridge supply","Network printer setup","On-site repair"]},
    {icon:I.intercom,k:null,title:"Intercom & PA Systems",desc:"IP intercom, video door phones, multi-floor paging, hotel/hospital PA.",
     items:["IP video door phone","Multi-floor intercom","PA/paging systems","Annual maintenance"]},
    {icon:I.finger,k:"biometrics",title:"Biometric Attendance",desc:"Fingerprint & face recognition. HRMS/payroll integration.",
     items:["Fingerprint & face recognition","RFID card systems","HRMS/Payroll API","Shift management"]},
    {icon:I.doorlock,k:"smartlocks",title:"Smart Door Locks",desc:"RFID, fingerprint, app-controlled locks for offices and server rooms.",
     items:["Fingerprint & RFID locks","Remote access control","Access logs & audit","Visitor management"]},
    {icon:I.iot,k:null,title:"IoT & Smart Office",desc:"Smart sensors, lighting automation, energy monitoring, BMS.",
     items:["Smart lighting","Energy monitoring","Temperature control","Custom IoT dashboards"]},
  ];

  return (
    <div>
      <Nav nav={nav} cur="services"/>
      <div style={{padding:"72px 40px",maxWidth:1200,margin:"0 auto"}}>
        <div className="stag">All Services</div>
        <h1 style={{fontSize:"clamp(24px,4vw,48px)",fontWeight:900,marginBottom:10}}>9 Services. One Contract.</h1>
        <p style={{color:"var(--ink2)",fontSize:16,marginBottom:56,maxWidth:560}}>Everything from computers to smart locks under one AMC across eastern UP.</p>
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          {svcs.map((s,i)=>(
            <div key={i} className="card" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"center"}}>
              <div>
                <div style={{width:48,height:48,borderRadius:11,background:"rgba(26,108,255,.12)",border:"1px solid rgba(0,85,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--sky)",marginBottom:16}}>{s.icon(20)}</div>
                <h2 style={{fontSize:20,fontWeight:800,marginBottom:6}}>{s.title}</h2>
                {s.k && prices.length>0 && <div style={{display:"inline-flex",padding:"3px 11px",background:"rgba(0,85,255,.09)",borderRadius:20,fontSize:11,color:"var(--sky)",fontFamily:"var(--fm)",marginBottom:10}}>₹{getPrice(s.k)} {prices.find(p=>p.service_key===s.k)?.unit}</div>}
                <p style={{color:"var(--ink2)",lineHeight:1.7,fontSize:13.5,marginBottom:18}}>{s.desc}</p>
                <button className="btn btn-p btn-sm" onClick={()=>nav("quote")}>Get Quote {I.arrow(12)}</button>
              </div>
              <div style={{background:"var(--bg2)",borderRadius:10,padding:20}}>
                <div style={{fontSize:10,color:"var(--ink3)",fontFamily:"var(--fm)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>What's Included</div>
                {s.items.map((item,j)=>(
                  <div key={j} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:"rgba(0,214,143,.1)",border:"1px solid rgba(0,214,143,.18)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--ok)",flexShrink:0}}>{I.check(9)}</div>
                    <span style={{fontSize:13,color:"var(--ink2)"}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer nav={nav}/>
    </div>
  );
}

/* ═══ QUOTE ══════════════════════════════════════════════════ */
function Quote({nav, token, showToast}) {
  const [f, setF] = useState({company:"",contact:"",email:"",phone:"",systems:"",cctv:"",servers:"",printers:"",biometrics:"",smartlocks:"",location:"",message:""});
  const [prices, setPrices] = useState([]);
  const [offerCode, setOfferCode] = useState("");
  const [offer, setOffer] = useState(null);
  const [offerErr, setOfferErr] = useState("");
  const [done, setDone] = useState(false);

  useEffect(()=>{ req("GET","/prices").then(setPrices).catch(()=>{}); },[]);

  const getP = (k) => prices.find(p=>p.service_key===k)?.price_per_unit||0;
  const n = {sys:parseInt(f.systems)||0,cctv:parseInt(f.cctv)||0,srv:parseInt(f.servers)||0,prt:parseInt(f.printers)||0,bio:parseInt(f.biometrics)||0,sl:parseInt(f.smartlocks)||0};
  const base = (n.sys*getP("systems")+n.cctv*getP("cctv")+n.srv*getP("servers")+n.prt*getP("printers")+n.bio*getP("biometrics")+n.sl*getP("smartlocks"))*12;
  const discount = offer ? Math.round(base * offer.discount_percent / 100) : 0;
  const total = base - discount;

  const applyCode = async () => {
    setOfferErr("");
    try { const o = await req("POST","/offers/validate",{code:offerCode}); setOffer(o); showToast(`${o.discount_percent}% discount applied!`); }
    catch(e) { setOfferErr(e.message); setOffer(null); }
  };

  const submit = async () => {
    if(!f.company||!f.email||!f.phone) return showToast("Company, email and phone required","err");
    try {
      await req("POST","/leads",{...f,...n,systems:n.sys,cctv:n.cctv,servers:n.srv,printers:n.prt,biometrics:n.bio,smartlocks:n.sl,message:f.message});
      setDone(true);
    } catch(e) { showToast(e.message,"err"); }
  };

  const fields=[{k:"systems",lb:"Computers",icon:I.monitor},{k:"cctv",lb:"CCTV Cameras",icon:I.camera},{k:"servers",lb:"Servers",icon:I.server},{k:"printers",lb:"Printers",icon:I.printer},{k:"biometrics",lb:"Biometrics",icon:I.finger},{k:"smartlocks",lb:"Smart Locks",icon:I.doorlock}];

  return (
    <div>
      <Nav nav={nav} cur="quote"/>
      <div style={{padding:"72px 40px",maxWidth:880,margin:"0 auto"}}>
        <div className="stag">Get a Quote</div>
        <h1 style={{fontSize:"clamp(22px,3.5vw,44px)",fontWeight:900,marginBottom:10}}>Request Your AMC Quote</h1>
        <p style={{color:"var(--ink2)",fontSize:15,marginBottom:44}}>Custom proposal in 24 hours. Free site visit for Varanasi clients.</p>

        {!done ? (
          <div className="card" style={{padding:"36px 40px"}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--sky)",fontFamily:"var(--fm)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14,paddingBottom:10,borderBottom:"1px solid rgba(0,85,255,.1)"}}>Company Information</div>
            <div className="g2" style={{gap:14,marginBottom:22}}>
              <div><label className="lbl">Company Name *</label><input className="input" placeholder="Organisation name" value={f.company} onChange={e=>setF({...f,company:e.target.value})}/></div>
              <div><label className="lbl">Contact Person</label><input className="input" placeholder="Your name" value={f.contact} onChange={e=>setF({...f,contact:e.target.value})}/></div>
              <div><label className="lbl">Email *</label><input className="input" type="email" placeholder="name@company.com" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></div>
              <div><label className="lbl">Phone *</label><input className="input" placeholder="+91 XXXXX XXXXX" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/></div>
              <div style={{gridColumn:"1/-1"}}><label className="lbl">Location</label><input className="input" placeholder="Locality, City" value={f.location} onChange={e=>setF({...f,location:e.target.value})}/></div>
            </div>

            <div style={{fontSize:11,fontWeight:700,color:"var(--sky)",fontFamily:"var(--fm)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14,paddingBottom:10,borderBottom:"1px solid rgba(0,85,255,.1)"}}>Devices (enter 0 if not needed)</div>
            <div className="g3" style={{gap:14,marginBottom:22}}>
              {fields.map(({k,lb,icon})=>(
                <div key={k}><label className="lbl" style={{display:"flex",alignItems:"center",gap:5}}><span style={{color:"var(--sky)"}}>{icon(12)}</span>{lb}</label>
                  <input className="input" type="number" min="0" placeholder="0" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/></div>
              ))}
            </div>

            <div style={{marginBottom:22}}>
              <label className="lbl">Notes (Networking, Intercom, IoT, etc.)</label>
              <textarea className="input" placeholder="Any other requirements..." value={f.message} onChange={e=>setF({...f,message:e.target.value})}/>
            </div>

            {/* Offer code */}
            <div style={{marginBottom:22}}>
              <label className="lbl">Offer / Promo Code</label>
              <div style={{display:"flex",gap:8}}>
                <input className="input" style={{flex:1}} placeholder="e.g. SUMMER10" value={offerCode} onChange={e=>setOfferCode(e.target.value.toUpperCase())}/>
                <button className="btn btn-o btn-sm" onClick={applyCode}>Apply</button>
              </div>
              {offerErr&&<div style={{fontSize:12,color:"var(--err)",marginTop:6}}>{offerErr}</div>}
              {offer&&<div style={{fontSize:12,color:"var(--ok)",marginTop:6,display:"flex",gap:5,alignItems:"center"}}>{I.check(12)}{offer.title} — {offer.discount_percent}% discount applied!</div>}
            </div>

            {/* Live estimate */}
            {base>0&&(
              <div style={{marginBottom:24,background:"rgba(0,85,255,.06)",border:"1px solid rgba(0,184,255,.18)",borderRadius:10,padding:"18px 20px"}}>
                <div style={{fontSize:10,fontFamily:"var(--fm)",color:"var(--sky)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Cost Estimate (Annual)</div>
                <div style={{display:"flex",gap:18,flexWrap:"wrap",marginBottom:12}}>
                  {[[n.sys,"Computers","systems"],[n.cctv,"CCTV","cctv"],[n.srv,"Servers","servers"],[n.prt,"Printers","printers"],[n.bio,"Biometrics","biometrics"],[n.sl,"Smart Locks","smartlocks"]].filter(([x])=>x>0).map(([x,lb,k])=>(
                    <div key={lb}><div style={{fontSize:10,color:"var(--ink3)",marginBottom:2}}>{lb}</div><div style={{fontFamily:"var(--fh)",fontSize:14,fontWeight:700}}>₹{(x*getP(k)*12).toLocaleString()}</div></div>
                  ))}
                </div>
                {discount>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:"1px solid rgba(0,85,255,.1)",marginBottom:4}}>
                  <span style={{fontSize:13,color:"var(--ok)"}}>Discount ({offer.discount_percent}%)</span>
                  <span style={{color:"var(--ok)",fontWeight:600}}>−₹{discount.toLocaleString()}</span>
                </div>}
                <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid rgba(0,85,255,.1)"}}>
                  <span style={{fontSize:13,color:"var(--ink2)"}}>Total Annual Estimate</span>
                  <span style={{fontFamily:"var(--fh)",fontSize:22,fontWeight:800,color:"var(--sky)"}}>₹{total.toLocaleString()}</span>
                </div>
                <div style={{fontSize:11,color:"var(--ink3)",marginTop:6}}>* Indicative. Final after site visit. GST extra.</div>
              </div>
            )}

            <button className="btn btn-p" style={{padding:"12px 32px",fontSize:15}} onClick={submit}>Submit Request {I.arrow(13)}</button>
          </div>
        ) : (
          <div className="card" style={{textAlign:"center",padding:"60px 40px"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(0,214,143,.1)",border:"2px solid rgba(0,214,143,.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",color:"var(--ok)"}}>{I.check(24)}</div>
            <h2 style={{fontSize:24,fontWeight:800,marginBottom:10}}>Quote Request Received!</h2>
            <p style={{color:"var(--ink2)",marginBottom:28,fontSize:14,maxWidth:380,margin:"0 auto 28px"}}>Our team will review and send a detailed proposal within 24 hours.</p>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="btn btn-p" onClick={()=>nav("home")}>Back to Home</button>
              <button className="btn btn-o" onClick={()=>nav("contact")}>Contact Directly</button>
            </div>
          </div>
        )}
      </div>
      <Footer nav={nav}/>
    </div>
  );
}

/* ═══ CONTACT ════════════════════════════════════════════════ */
function Contact({nav,showToast}) {
  return (
    <div>
      <Nav nav={nav} cur="contact"/>
      <div style={{padding:"72px 40px",maxWidth:1060,margin:"0 auto"}}>
        <div className="stag">Contact Us</div>
        <h1 style={{fontSize:"clamp(22px,3.5vw,46px)",fontWeight:900,marginBottom:44}}>Let's Talk</h1>
        <div className="g2" style={{gap:40,alignItems:"start"}}>
          <div>
            <div className="card" style={{marginBottom:12}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <img src="/logo.jpeg" alt="TCG" style={{width:48,height:48,objectFit:"contain",borderRadius:8,background:"#fff",padding:4,flexShrink:0}}/>
                <div><div style={{fontWeight:800,fontSize:15,marginBottom:4}}>The Computer Garage</div><p style={{color:"var(--ink2)",lineHeight:1.8,fontSize:13}}>IT Infrastructure Solutions<br/>Varanasi — 221010, UP, UP</p></div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              {[{icon:I.phone,lb:"Phone",val:"+91 8400281723"},{icon:I.mail,lb:"Email",val:"thecomputergarage@gmail.com"},{icon:I.clock,lb:"Hours",val:"Mon–Sat 9AM–7PM"},{icon:I.shield,lb:"Emergency",val:"24/7 for AMC Clients"}].map((c,i)=>(
                <div key={i} className="card" style={{padding:"14px 16px"}}>
                  <div style={{color:"var(--sky)",marginBottom:6}}>{c.icon(15)}</div>
                  <div style={{fontSize:10,color:"var(--ink3)",fontFamily:"var(--fm)",textTransform:"uppercase"}}>{c.lb}</div>
                  <div style={{fontSize:12,fontWeight:500,marginTop:2}}>{c.val}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{padding:28}}>
            <h3 style={{fontSize:17,fontWeight:700,marginBottom:18}}>Send a Message</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div className="g2" style={{gap:12}}><div><label className="lbl">Name</label><input className="input" placeholder="Full name"/></div><div><label className="lbl">Phone</label><input className="input" placeholder="+91..."/></div></div>
              <div><label className="lbl">Email</label><input className="input" type="email" placeholder="your@email.com"/></div>
              <div><label className="lbl">Subject</label><select className="input"><option>General Inquiry</option><option>AMC Quote</option><option>Printer Service</option><option>CCTV</option><option>Biometric</option><option>Smart Lock</option><option>Intercom</option><option>IoT / Smart Office</option><option>Technical Support</option></select></div>
              <div><label className="lbl">Message</label><textarea className="input" placeholder="How can we help?"/></div>
              <button className="btn btn-p" style={{justifyContent:"center",width:"100%",padding:12}} onClick={()=>showToast("Message sent! We'll contact you soon.")}>Send Message {I.arrow(13)}</button>
            </div>
          </div>
        </div>
      </div>
      <Footer nav={nav}/>
    </div>
  );
}

/* ═══ LOGIN ══════════════════════════════════════════════════ */
function Login({nav,login,showToast}) {
  const [em,setEm]=useState(""); const [pw,setPw]=useState(""); const [ld,setLd]=useState(false);
  const go=async()=>{
    setLd(true);
    try { await login(em,pw); } catch(e){ showToast(e.message,"err"); }
    setLd(false);
  };
  const demos=[["Admin","admin@thecomputergarage.in","admin123"],["Client 1","meera@prayagfinance.com","client123"],["Client 2","sunil@gangaresidency.in","hotel456"]];
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:"var(--bg)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"20%",right:"15%",width:360,height:360,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,85,255,.07),transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:20,left:32,cursor:"pointer"}} onClick={()=>nav("home")}><Logo/></div>
      <div style={{width:"100%",maxWidth:400}}>
        <div className="card" style={{padding:"36px 32px"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{width:48,height:48,borderRadius:11,background:"rgba(0,85,255,.1)",border:"1px solid rgba(0,85,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",color:"var(--sky)"}}>{I.lock(20)}</div>
            <h2 style={{fontSize:20,fontWeight:800,marginBottom:3}}>Secure Login</h2>
            <p style={{fontSize:12,color:"var(--ink3)"}}>Admin · Technician · Client Portal</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:13,marginBottom:18}}>
            <div><label className="lbl">Email</label><input className="input" type="email" placeholder="your@email.com" value={em} onChange={e=>setEm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/></div>
            <div><label className="lbl">Password</label><input className="input" type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/></div>
            <button className="btn btn-p" style={{padding:12,justifyContent:"center",width:"100%"}} onClick={go}>{ld?"Authenticating…":<>Login {I.arrow(14)}</>}</button>
          </div>
          <div style={{background:"var(--bg3)",borderRadius:9,padding:"13px 14px"}}>
            <div style={{fontSize:10,fontFamily:"var(--fm)",color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:8}}>Demo — Click to Fill</div>
            {demos.map(([role,e,p])=>(
              <div key={role} style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",padding:"5px 7px",borderRadius:6,transition:"background .15s"}}
                onClick={()=>{setEm(e);setPw(p)}} onMouseEnter={x=>x.currentTarget.style.background="rgba(0,85,255,.08)"} onMouseLeave={x=>x.currentTarget.style.background="transparent"}>
                <span className="bdg bdg-b">{role}</span>
                <span style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--ink3)"}}>{e}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMIN PANEL
═══════════════════════════════════════════════════════════ */
function Admin({user,token,s,setS,logout,nav,showToast}) {
  const T = (method,path,body) => req(method,path,body,token);
  const menu=[{id:"dashboard",lb:"Dashboard",icon:I.home},{id:"clients",lb:"Clients",icon:I.users},{id:"leads",lb:"Leads",icon:I.list},{id:"tickets",lb:"Tickets",icon:I.ticket},{id:"offers",lb:"Offers",icon:I.tag},{id:"prices",lb:"AMC Pricing",icon:I.rupee},{id:"cctv_prices",lb:"CCTV Pricing",icon:I.camera},{id:"reports",lb:"Reports",icon:I.chart},{id:"settings",lb:"Settings",icon:I.settings}];

  return (
    <div style={{display:"flex",minHeight:"100vh"}}>
      {/* Sidebar */}
      <div style={{width:240,background:"var(--bg1)",borderRight:"1px solid rgba(0,85,255,.1)",padding:"18px 12px",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",flexShrink:0}}>
        <div style={{marginBottom:22,paddingLeft:6,cursor:"pointer"}} onClick={()=>nav("home")}><Logo size={30} textSize={13}/></div>
        <nav style={{flex:1,display:"flex",flexDirection:"column",gap:2}}>
          {menu.map(m=><div key={m.id} className={`slink ${s===m.id?"on":""}`} onClick={()=>setS(m.id)}><span style={{color:s===m.id?"var(--sky)":"var(--ink3)"}}>{m.icon(15)}</span>{m.lb}</div>)}
        </nav>
        <div style={{borderTop:"1px solid rgba(0,85,255,.1)",paddingTop:12,marginTop:12}}>
          <div style={{display:"flex",gap:9,padding:"7px 10px",marginBottom:4}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"var(--panel2)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--sky)"}}>{I.user(13)}</div>
            <div><div style={{fontSize:13,fontWeight:600}}>{user.name}</div><div style={{fontSize:10,color:"var(--ink3)"}}>Admin</div></div>
          </div>
          <div className="slink" onClick={logout}>{I.logout(14)} Logout</div>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,overflow:"auto"}}>
        {s==="dashboard"&&<ADash T={T} setS={setS} showToast={showToast}/>}
        {s==="clients"  &&<AClients T={T} showToast={showToast}/>}
        {s==="leads"    &&<ALeads T={T} showToast={showToast}/>}
        {s==="tickets"  &&<ATickets T={T} showToast={showToast}/>}
        {s==="offers"   &&<AOffers T={T} showToast={showToast}/>}
        {s==="prices"   &&<APrices T={T} showToast={showToast}/>}
        {s==="reports"     &&<AReports T={T}/>}
        {s==="cctv_prices" &&<ACCTVPrices T={T} showToast={showToast}/>}
        {s==="settings" &&<ASettings T={T} showToast={showToast} user={user}/>}
      </div>
    </div>
  );
}

function Pg({title,sub,children,action}) {
  return (
    <div style={{padding:32}} className="fi">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div><h1 style={{fontSize:22,fontWeight:800,marginBottom:2}}>{title}</h1>{sub&&<p style={{fontSize:12,color:"var(--ink3)",fontFamily:"var(--fm)"}}>{sub}</p>}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ── DASHBOARD ────────────────────────────────────────────── */
function ADash({T,setS,showToast}) {
  const [d,setD]=useState(null);
  const load=()=>T("GET","/dashboard").then(setD).catch(()=>{});
  useEffect(()=>{ load(); },[]);
  if(!d) return <div style={{padding:32,color:"var(--ink3)"}}>Loading…</div>;

  return (
    <Pg title="Dashboard" sub="The Computer Garage · Varanasi">
      <div className="g4" style={{marginBottom:22}}>
        {[{icon:I.users,lb:"Active Clients",val:d.totalClients,b:<span className="bdg bdg-g">Active</span>},
          {icon:I.rupee,lb:"Monthly Revenue",val:`₹${(d.monthlyRevenue/1000).toFixed(1)}K`,b:<span className="bdg bdg-b">MRR</span>},
          {icon:I.ticket,lb:"Open Tickets",val:d.openTickets,b:d.openTickets>0?<span className="bdg bdg-y">{d.openTickets}</span>:<span className="bdg bdg-g">Clear</span>,click:"tickets"},
          {icon:I.alert,lb:"AMC Expiring",val:d.expiringCount,b:d.expiringCount>0?<span className="bdg bdg-r">Soon</span>:<span className="bdg bdg-g">OK</span>,click:"clients"},
        ].map((s,i)=>(
          <div key={i} className="sc" style={{cursor:s.click?"pointer":"default"}} onClick={s.click?()=>setS(s.click):undefined}>
            <div style={{display:"flex",justifyContent:"space-between"}}><div style={{color:"var(--sky)",opacity:.6}}>{s.icon(18)}</div>{s.b}</div>
            <div className="sv">{s.val}</div><div className="sl">{s.lb}</div>
          </div>
        ))}
      </div>

      <div className="g2" style={{marginBottom:18}}>
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><h3 style={{fontSize:14,fontWeight:700}}>Recent Leads</h3><button className="btn btn-g btn-xs" onClick={()=>setS("leads")}>All {I.arrow(11)}</button></div>
          {d.recentLeads.map(l=>(
            <div key={l.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(0,85,255,.07)"}}>
              <div><div style={{fontSize:13,fontWeight:600,color:"var(--ink)"}}>{l.company}</div><div style={{fontSize:11,color:"var(--ink3)"}}>{l.location}</div></div>
              <span className={`bdg ${l.status==="Won"?"bdg-g":l.status==="New Lead"?"bdg-b":l.status==="Negotiation"?"bdg-y":"bdg-n"}`}>{l.status}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><h3 style={{fontSize:14,fontWeight:700}}>Open Tickets</h3><button className="btn btn-g btn-xs" onClick={()=>setS("tickets")}>All {I.arrow(11)}</button></div>
          {d.openTicketsList.length===0?<div style={{textAlign:"center",padding:"20px 0",color:"var(--ink3)",fontSize:13}}>No open tickets</div>:d.openTicketsList.map(t=>(
            <div key={t.id} style={{padding:"8px 0",borderBottom:"1px solid rgba(0,85,255,.07)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--sky)"}}>{t.id}</span><span className={`bdg ${t.priority==="Critical"?"bdg-r":t.priority==="High"?"bdg-y":"bdg-n"}`}>{t.priority}</span></div>
              <div style={{fontSize:13,fontWeight:600,color:"var(--ink)"}}>{t.subject}</div>
              <div style={{fontSize:11,color:"var(--ink3)"}}>{t.company}</div>
            </div>
          ))}
        </div>
      </div>

      {d.expiringClients.length>0&&(
        <div style={{background:"rgba(245,166,35,.05)",border:"1px solid rgba(245,166,35,.2)",borderRadius:12,padding:"16px 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,color:"var(--warn)"}}>{I.bell(16)}<span style={{fontSize:14,fontWeight:700}}>AMC Expiring Soon — Follow Up Required</span></div>
          {d.expiringClients.map(c=>{
            const days=Math.ceil((new Date(c.amc_expiry)-new Date())/864e5);
            return (
              <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(245,166,35,.1)",flexWrap:"wrap",gap:8}}>
                <div><div style={{fontSize:13,fontWeight:600,color:"var(--ink)"}}>{c.company}</div><div style={{fontSize:11,color:"var(--ink3)"}}>{c.contact} · {c.email}</div></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontFamily:"var(--fm)",fontSize:12,color:days<=15?"var(--err)":"var(--warn)",fontWeight:700}}>{days} days left</span>
                  <span style={{fontSize:11,color:"var(--ink3)"}}>{c.amc_expiry}</span>
                  <button className="btn btn-p btn-xs" onClick={async()=>{try{await T("POST",`/notifications/send-reminder/${c.id}`);showToast("Reminder sent to "+c.email);}catch(e){showToast(e.message,"err");}}}>{I.send(11)} Remind</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Pg>
  );
}

/* ── CLIENTS ──────────────────────────────────────────────── */
function AClients({T,showToast}) {
  const [clients,setClients]=useState([]);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState(null);
  const blank={company:"",contact:"",email:"",phone:"",location:"",systems:0,cctv:0,servers:0,printers:0,biometrics:0,smartlocks:0,amc_start:"",amc_expiry:"",monthly_rev:0,technician:"",status:"Active",paid:1,notes:"",password:""};

  const load=()=>T("GET","/clients").then(setClients).catch(()=>{});
  useEffect(()=>{load();},[]);

  const save=async()=>{
    try {
      if(form.id) await T("PUT",`/clients/${form.id}`,form);
      else await T("POST","/clients",form);
      showToast(form.id?"Client updated!":"Client added!"); setForm(null); load();
    } catch(e){showToast(e.message,"err");}
  };

  const del=async(id)=>{
    if(!confirm("Delete this client?")) return;
    try{await T("DELETE",`/clients/${id}`);showToast("Client deleted.");load();}catch(e){showToast(e.message,"err");}
  };

  const sendReminder=async(c)=>{
    try{await T("POST",`/notifications/send-reminder/${c.id}`);showToast("Renewal reminder sent to "+c.email);}catch(e){showToast(e.message,"err");}
  };

  return (
    <Pg title="Clients" sub={`${clients.length} total`} action={<button className="btn btn-p btn-sm" onClick={()=>setForm({...blank})}>{I.plus(13)} Add Client</button>}>
      <div className="g2" style={{marginBottom:12}}>
        {clients.map(c=>{
          const days=c.amc_expiry?Math.ceil((new Date(c.amc_expiry)-new Date())/864e5):999;
          return (
            <div key={c.id} className="card" style={{cursor:"pointer"}} onClick={()=>setModal(c)}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                <div><div style={{fontWeight:800,fontSize:14,color:"var(--ink)"}}>{c.company}</div><div style={{fontSize:11,color:"var(--ink3)",marginTop:2}}>{c.contact} · {c.location}</div></div>
                <span className={`bdg ${c.status==="Active"?"bdg-g":c.status==="Expiring"?"bdg-y":c.status==="Expired"?"bdg-r":"bdg-n"}`}>{c.status}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,marginBottom:10}}>
                {[["PC",c.systems],["CAM",c.cctv],["PRN",c.printers||0],["BIO",c.biometrics||0],["SRV",c.servers],["₹K",(c.monthly_rev/1000).toFixed(1)]].map(([lb,val])=>(
                  <div key={lb} style={{textAlign:"center",background:"var(--bg2)",borderRadius:6,padding:"6px 2px"}}>
                    <div style={{fontFamily:"var(--fh)",fontSize:14,fontWeight:700,color:"var(--sky)"}}>{val}</div>
                    <div style={{fontSize:9,color:"var(--ink3)",fontFamily:"var(--fm)"}}>{lb}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--ink3)"}}>
                <span>Expiry: {c.amc_expiry} {days<=30&&<span style={{color:days<=15?"var(--err)":"var(--warn)",fontWeight:700}}>({days}d)</span>}</span>
                <span style={{color:c.paid?"var(--ok)":"var(--err)",fontWeight:600}}>{c.paid?"Paid":"Due"}</span>
              </div>
              <div style={{display:"flex",gap:6,marginTop:10}} onClick={e=>e.stopPropagation()}>
                <button className="btn btn-g btn-xs" onClick={()=>setForm({...c,password:""})}>{I.edit(11)} Edit</button>
                <button className="btn btn-g btn-xs" onClick={()=>sendReminder(c)}>{I.send(11)} Remind</button>
                <button className="btn btn-r btn-xs" onClick={()=>del(c.id)}>{I.trash(11)}</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View modal */}
      {modal&&!form&&(
        <div className="moverlay" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{fontSize:18,fontWeight:800}}>{modal.company}</h3><button className="btn btn-g" onClick={()=>setModal(null)}>{I.close(14)}</button></div>
            {[["Contact",modal.contact],["Email",modal.email],["Phone",modal.phone],["Location",modal.location],["Computers",modal.systems],["CCTV",modal.cctv],["Printers",modal.printers||0],["Biometrics",modal.biometrics||0],["Servers",modal.servers],["AMC Period",`${modal.amc_start} → ${modal.amc_expiry}`],["Monthly Rev",`₹${modal.monthly_rev?.toLocaleString()}`],["Technician",modal.technician],["Payment",modal.paid?"Paid":"Pending"],["Notes",modal.notes||"—"]].map(([lb,val])=>(
              <div key={lb} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(0,85,255,.07)"}}>
                <span style={{fontSize:12,color:"var(--ink3)"}}>{lb}</span><span style={{fontSize:13,fontWeight:600,color:"var(--ink)",maxWidth:"60%",textAlign:"right"}}>{val}</span>
              </div>
            ))}
            <button className="btn btn-p btn-sm" style={{marginTop:16}} onClick={()=>{setForm({...modal,password:""});setModal(null);}}>Edit Client</button>
          </div>
        </div>
      )}

      {/* Add/Edit form */}
      {form&&(
        <div className="moverlay" onClick={()=>setForm(null)}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()} style={{padding:28}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}><h3 style={{fontSize:18,fontWeight:800}}>{form.id?"Edit Client":"Add New Client"}</h3><button className="btn btn-g" onClick={()=>setForm(null)}>{I.close(14)}</button></div>
            <div className="g2" style={{gap:12,marginBottom:12}}>
              {[["company","Company Name *"],["contact","Contact Person"],["email","Email"],["phone","Phone"],["location","Location"],["technician","Assigned Technician"]].map(([k,lb])=>(
                <div key={k}><label className="lbl">{lb}</label><input className="input" value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})}/></div>
              ))}
            </div>
            <div className="g3" style={{gap:12,marginBottom:12}}>
              {[["systems","PCs"],["cctv","CCTV"],["servers","Servers"],["printers","Printers"],["biometrics","Biometrics"],["smartlocks","Smart Locks"]].map(([k,lb])=>(
                <div key={k}><label className="lbl">{lb}</label><input className="input" type="number" min="0" value={form[k]||0} onChange={e=>setForm({...form,[k]:e.target.value})}/></div>
              ))}
            </div>
            <div className="g2" style={{gap:12,marginBottom:12}}>
              <div><label className="lbl">AMC Start</label><input className="input" type="date" value={form.amc_start||""} onChange={e=>setForm({...form,amc_start:e.target.value})}/></div>
              <div><label className="lbl">AMC Expiry</label><input className="input" type="date" value={form.amc_expiry||""} onChange={e=>setForm({...form,amc_expiry:e.target.value})}/></div>
              <div><label className="lbl">Monthly Revenue (₹)</label><input className="input" type="number" value={form.monthly_rev||0} onChange={e=>setForm({...form,monthly_rev:e.target.value})}/></div>
              <div><label className="lbl">Status</label><select className="input" value={form.status||"Active"} onChange={e=>setForm({...form,status:e.target.value})}><option>Active</option><option>Expiring</option><option>Expired</option><option>On Hold</option></select></div>
              <div><label className="lbl">Payment</label><select className="input" value={form.paid||1} onChange={e=>setForm({...form,paid:parseInt(e.target.value)})}><option value={1}>Paid</option><option value={0}>Due</option></select></div>
              {!form.id&&<div><label className="lbl">Portal Password (for login)</label><input className="input" type="password" placeholder="Set client login password" value={form.password||""} onChange={e=>setForm({...form,password:e.target.value})}/></div>}
            </div>
            <div style={{marginBottom:16}}><label className="lbl">Notes</label><textarea className="input" value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn btn-p" onClick={save}>{I.check(13)} {form.id?"Update Client":"Add Client"}</button>
              <button className="btn btn-o" onClick={()=>setForm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Pg>
  );
}

/* ── LEADS ────────────────────────────────────────────────── */
function ALeads({T,showToast}) {
  const [leads,setLeads]=useState([]); const [modal,setModal]=useState(null);
  const load=()=>T("GET","/leads").then(setLeads).catch(()=>{});
  useEffect(()=>{load();},[]);
  const stages=["New Lead","Contacted","Site Visit Done","Proposal Sent","Negotiation","Won","Lost"];
  const sc={"New Lead":"bdg-b","Won":"bdg-g","Lost":"bdg-r","Negotiation":"bdg-y","Proposal Sent":"bdg-y","default":"bdg-n"};
  const upd=async(id,status)=>{try{await T("PUT",`/leads/${id}`,{status});setModal(p=>p?{...p,status}:null);load();}catch(e){showToast(e.message,"err");}};

  return (
    <Pg title="Lead Pipeline" sub={`${leads.length} leads`}>
      <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
        {stages.map(st=>{const n=leads.filter(l=>l.status===st).length;return(
          <div key={st} style={{flexShrink:0,textAlign:"center",padding:"10px 16px",background:"var(--panel)",border:"1px solid rgba(0,85,255,.1)",borderRadius:9,minWidth:100}}>
            <div style={{fontFamily:"var(--fh)",fontSize:22,fontWeight:800,color:n>0?"var(--sky)":"var(--ink3)"}}>{n}</div>
            <div style={{fontSize:10,color:"var(--ink3)",marginTop:1,fontFamily:"var(--fm)"}}>{st}</div>
          </div>
        );})}
      </div>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <table>
          <thead><tr><th>Company</th><th>Contact</th><th>Devices</th><th>Status</th><th>Value</th><th></th></tr></thead>
          <tbody>{leads.map(l=>(
            <tr key={l.id}>
              <td><div style={{fontWeight:600,color:"var(--ink)"}}>{l.company}</div><div style={{fontSize:10,color:"var(--ink3)",fontFamily:"var(--fm)"}}>{l.date}</div></td>
              <td><div style={{color:"var(--ink)"}}>{l.contact}</div><div style={{fontSize:11,color:"var(--ink3)"}}>{l.phone}</div></td>
              <td style={{fontFamily:"var(--fm)",fontSize:10}}>PC:{l.systems} CAM:{l.cctv} PRN:{l.printers}</td>
              <td><span className={`bdg ${sc[l.status]||"bdg-n"}`}>{l.status}</span></td>
              <td style={{color:"var(--ok)",fontFamily:"var(--fm)",fontWeight:600}}>₹{l.value?.toLocaleString()}</td>
              <td><button className="btn btn-g btn-xs" onClick={()=>setModal(l)}>Update</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&(
        <div className="moverlay" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{fontSize:17,fontWeight:800}}>{modal.company}</h3><button className="btn btn-g" onClick={()=>setModal(null)}>{I.close(14)}</button></div>
            <p style={{fontSize:12,color:"var(--ink3)",marginBottom:16}}>{modal.contact} · {modal.email} · {modal.location}</p>
            <label className="lbl">Move to Stage</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {stages.map(st=><button key={st} onClick={()=>upd(modal.id,st)} className={`btn btn-sm ${modal.status===st?"btn-p":"btn-o"}`} style={{fontSize:12,padding:"6px 12px"}}>{st}</button>)}
            </div>
          </div>
        </div>
      )}
    </Pg>
  );
}

/* ── TICKETS ──────────────────────────────────────────────── */
function ATickets({T,showToast}) {
  const [tickets,setTickets]=useState([]); const [modal,setModal]=useState(null); const [note,setNote]=useState("");
  const load=()=>T("GET","/tickets").then(setTickets).catch(()=>{});
  useEffect(()=>{load();},[]);
  const techs=["Abhishek T.","Sanjay P.","Rahul M.","Vikram K."];
  const upd=async(id,u)=>{try{await T("PUT",`/tickets/${id}`,u);load();setModal(p=>p?{...p,...u}:null);showToast("Ticket updated");}catch(e){showToast(e.message,"err");}};
  const pc={Critical:"bdg-r",High:"bdg-y",Medium:"bdg-b",Low:"bdg-n"};
  const sc={Open:"bdg-y","In Progress":"bdg-b",Resolved:"bdg-g",Closed:"bdg-n"};

  return (
    <Pg title="Support Tickets" sub={`${tickets.filter(t=>t.status!=="Resolved"&&t.status!=="Closed").length} open`}>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <table>
          <thead><tr><th>ID</th><th>Client</th><th>Issue</th><th>Priority</th><th>Status</th><th>Technician</th><th></th></tr></thead>
          <tbody>{tickets.map(t=>(
            <tr key={t.id}>
              <td><span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--sky)"}}>{t.id}</span></td>
              <td style={{fontWeight:600,color:"var(--ink)"}}>{t.company}</td>
              <td style={{maxWidth:200}}><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.subject}</div></td>
              <td><span className={`bdg ${pc[t.priority]||"bdg-n"}`}>{t.priority}</span></td>
              <td><span className={`bdg ${sc[t.status]||"bdg-n"}`}>{t.status}</span></td>
              <td style={{fontSize:12}}>{t.technician||<span style={{color:"var(--err)",fontSize:11}}>Unassigned</span>}</td>
              <td><button className="btn btn-g btn-xs" onClick={()=>{setModal(t);setNote(t.notes||"");}}>Manage</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&(
        <div className="moverlay" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
              <div><div style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--sky)",marginBottom:3}}>{modal.id}</div><h3 style={{fontSize:16,fontWeight:800}}>{modal.subject}</h3><div style={{fontSize:12,color:"var(--ink3)"}}>{modal.company}</div></div>
              <button className="btn btn-g" onClick={()=>setModal(null)}>{I.close(14)}</button>
            </div>
            <div style={{marginBottom:12}}><label className="lbl">Assign Technician</label>
              <select className="input" value={modal.technician||""} onChange={e=>{upd(modal.id,{status:modal.status,technician:e.target.value,notes:note});setModal(p=>({...p,technician:e.target.value}))}}>
                <option value="">— Unassigned —</option>{techs.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{marginBottom:12}}><label className="lbl">Status</label>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {["Open","In Progress","Resolved","Closed"].map(st=><button key={st} className={`btn btn-sm ${modal.status===st?"btn-p":"btn-o"}`} style={{fontSize:12,padding:"6px 12px"}} onClick={()=>{upd(modal.id,{status:st,technician:modal.technician,notes:note});setModal(p=>({...p,status:st}));}}>{st}</button>)}
              </div>
            </div>
            <div><label className="lbl">Notes</label><textarea className="input" value={note} onChange={e=>setNote(e.target.value)}/>
              <button className="btn btn-p btn-sm" style={{marginTop:8}} onClick={()=>upd(modal.id,{status:modal.status,technician:modal.technician,notes:note})}>Save Notes</button>
            </div>
          </div>
        </div>
      )}
    </Pg>
  );
}

/* ── OFFERS ───────────────────────────────────────────────── */
function AOffers({T,showToast}) {
  const [offers,setOffers]=useState([]); const [form,setForm]=useState(null);
  const blank={title:"",description:"",discount_percent:10,code:"",valid_from:"",valid_to:"",active:1};
  const load=()=>T("GET","/offers/all").then(setOffers).catch(()=>{});
  useEffect(()=>{load();},[]);
  const save=async()=>{
    try{if(form.id)await T("PUT",`/offers/${form.id}`,form);else await T("POST","/offers",form);showToast(form.id?"Offer updated!":"Offer created!");setForm(null);load();}catch(e){showToast(e.message,"err");}
  };
  const del=async(id)=>{if(!confirm("Delete offer?"))return;try{await T("DELETE",`/offers/${id}`);load();showToast("Deleted.");}catch(e){showToast(e.message,"err");}};

  return (
    <Pg title="Offers & Discounts" sub="Manage promotional offers and promo codes" action={<button className="btn btn-p btn-sm" onClick={()=>setForm({...blank})}>{I.plus(13)} New Offer</button>}>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {offers.map(o=>(
          <div key={o.id} className="card" style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:44,height:44,borderRadius:10,background:"rgba(245,166,35,.1)",border:"1px solid rgba(245,166,35,.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--warn)",flexShrink:0}}>{I.tag(18)}</div>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:"var(--ink)",marginBottom:3}}>{o.title}</div>
                <div style={{fontSize:12,color:"var(--ink2)",marginBottom:6}}>{o.description}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <span className="bdg bdg-y">{o.discount_percent}% OFF</span>
                  <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--sky)",background:"rgba(0,85,255,.1)",padding:"2px 10px",borderRadius:20}}>Code: {o.code}</span>
                  {o.valid_to&&<span style={{fontSize:11,color:"var(--ink3)"}}>Valid till {o.valid_to}</span>}
                  <span className={`bdg ${o.active?"bdg-g":"bdg-n"}`}>{o.active?"Active":"Inactive"}</span>
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:7}}>
              <button className="btn btn-g btn-xs" onClick={()=>setForm({...o})}>{I.edit(11)}</button>
              <button className="btn btn-r btn-xs" onClick={()=>del(o.id)}>{I.trash(11)}</button>
            </div>
          </div>
        ))}
        {offers.length===0&&<div className="card" style={{textAlign:"center",padding:"40px",color:"var(--ink3)"}}>No offers yet. Create one to attract customers!</div>}
      </div>

      {form&&(
        <div className="moverlay" onClick={()=>setForm(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{fontSize:17,fontWeight:800}}>{form.id?"Edit Offer":"New Offer"}</h3><button className="btn btn-g" onClick={()=>setForm(null)}>{I.close(14)}</button></div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div><label className="lbl">Offer Title *</label><input className="input" placeholder="e.g. New Year 2026 Special" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div><label className="lbl">Description</label><textarea className="input" style={{minHeight:70}} placeholder="Explain the offer..." value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})}/></div>
              <div className="g2" style={{gap:12}}>
                <div><label className="lbl">Discount % *</label><input className="input" type="number" min="1" max="99" value={form.discount_percent} onChange={e=>setForm({...form,discount_percent:parseInt(e.target.value)})}/></div>
                <div><label className="lbl">Promo Code *</label><input className="input" placeholder="e.g. NY2026" value={form.code||""} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})}/></div>
                <div><label className="lbl">Valid From</label><input className="input" type="date" value={form.valid_from||""} onChange={e=>setForm({...form,valid_from:e.target.value})}/></div>
                <div><label className="lbl">Valid Till</label><input className="input" type="date" value={form.valid_to||""} onChange={e=>setForm({...form,valid_to:e.target.value})}/></div>
              </div>
              <div><label className="lbl">Status</label><select className="input" value={form.active} onChange={e=>setForm({...form,active:parseInt(e.target.value)})}><option value={1}>Active</option><option value={0}>Inactive</option></select></div>
              <div style={{display:"flex",gap:10,marginTop:4}}>
                <button className="btn btn-p" onClick={save}>{I.check(13)} {form.id?"Update":"Create"} Offer</button>
                <button className="btn btn-o" onClick={()=>setForm(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Pg>
  );
}

/* ── PRICES ───────────────────────────────────────────────── */
function APrices({T,showToast}) {
  const [prices,setPrices]=useState([]); const [editing,setEditing]=useState({});
  const load=()=>T("GET","/prices").then(p=>{setPrices(p);const e={};p.forEach(x=>e[x.service_key]=x.price_per_unit);setEditing(e);}).catch(()=>{});
  useEffect(()=>{load();},[]);
  const save=async(key)=>{
    try{await T("PUT",`/prices/${key}`,{price_per_unit:parseInt(editing[key])});showToast("Price updated!");load();}catch(e){showToast(e.message,"err");}
  };

  return (
    <Pg title="Pricing Management" sub="Update AMC prices for each service type">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {prices.map(p=>(
          <div key={p.service_key} className="card" style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:14}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{p.service_name}</div>
              <div style={{fontSize:11,color:"var(--ink3)",fontFamily:"var(--fm)"}}>{p.unit}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{position:"relative"}}><span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--ink3)",fontSize:14}}>₹</span>
                <input className="input" type="number" value={editing[p.service_key]||""} onChange={e=>setEditing({...editing,[p.service_key]:e.target.value})} style={{width:110,paddingLeft:24}}/></div>
              <button className="btn btn-p btn-xs" onClick={()=>save(p.service_key)}>Save</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:20,padding:"14px 18px",background:"rgba(245,166,35,.05)",border:"1px solid rgba(245,166,35,.15)",borderRadius:10}}>
        <div style={{fontSize:12,color:"var(--warn)",display:"flex",gap:6,alignItems:"center"}}>{I.alert(13)} Price changes will reflect immediately in new AMC quotes and estimates.</div>
      </div>
    </Pg>
  );
}

/* ── CCTV PRICES ──────────────────────────────────────────── */
function ACCTVPrices({T,showToast}) {
  const [rows,setRows]=useState([]);
  const [edits,setEdits]=useState({});
  const [saving,setSaving]=useState({});
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");

  const load=()=>T("GET","/cctv-prices").then(d=>{
    const flat=d.flat||[];
    setRows(flat);
    const e={};flat.forEach(r=>e[r.id]=r.price);
    setEdits(e);
  }).catch(()=>{});
  useEffect(()=>{load();},[]);

  const saveOne=async(id)=>{
    setSaving(s=>({...s,[id]:true}));
    try{
      await T("PUT",`/cctv-prices/${id}`,{price:parseInt(edits[id])});
      showToast("Price saved!");
      load();
    }catch(e){showToast(e.message,"err");}
    setSaving(s=>({...s,[id]:false}));
  };

  const saveAll=async()=>{
    const updates=rows.map(r=>({id:r.id,price:parseInt(edits[r.id])||0}));
    try{
      await T("POST","/cctv-prices/bulk",{updates});
      showToast(`All ${updates.length} prices saved!`);
      load();
    }catch(e){showToast(e.message,"err");}
  };

  const CATS={
    all:"All Items",
    hd_dvr:"HD DVR Units",hd_cam:"HD Cameras",hd_hdd:"HD Hard Disks",
    hd_wire:"HD Cables",hd_acc:"HD Accessories",
    ip_nvr:"IP NVR Units",ip_cam:"IP Cameras",ip_hdd:"IP Hard Disks",
    ip_wire:"IP Cables",ip_acc:"IP Accessories",
  };

  const CAT_COLORS={
    hd_dvr:"rgba(0,85,255,.12)",hd_cam:"rgba(0,85,255,.12)",hd_hdd:"rgba(0,85,255,.12)",hd_wire:"rgba(0,85,255,.12)",hd_acc:"rgba(0,85,255,.12)",
    ip_nvr:"rgba(0,184,255,.1)",ip_cam:"rgba(0,184,255,.1)",ip_hdd:"rgba(0,184,255,.1)",ip_wire:"rgba(0,184,255,.1)",ip_acc:"rgba(0,184,255,.1)",
  };

  const visible=rows.filter(r=>{
    if(filter!=="all"&&r.category!==filter) return false;
    if(search&&!r.label.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const hasChanges=rows.some(r=>parseInt(edits[r.id])!==r.price);

  const grouped={};
  visible.forEach(r=>{
    if(!grouped[r.category]) grouped[r.category]=[];
    grouped[r.category].push(r);
  });

  return (
    <Pg title="CCTV Calculator Pricing" sub="Manage all HD & IP system prices shown in CCTV calculator">
      {/* Top bar */}
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        <input className="input" placeholder="Search items…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:180,maxWidth:280}}/>
        <select className="input" value={filter} onChange={e=>setFilter(e.target.value)} style={{width:"auto",minWidth:160}}>
          {Object.entries(CATS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
        </select>
        {hasChanges&&(
          <button className="btn btn-p btn-sm" onClick={saveAll} style={{flexShrink:0}}>
            {I.check(13)} Save All Changes
          </button>
        )}
      </div>

      {/* Info banner */}
      <div style={{background:"rgba(0,85,255,.06)",border:"1px solid rgba(0,85,255,.18)",borderRadius:12,padding:"14px 18px",marginBottom:20,display:"flex",gap:10,alignItems:"flex-start"}}>
        {I.alert(14)}
        <div style={{fontSize:13,color:"var(--ink2)",lineHeight:1.6}}>
          Prices change ho jaate hain toh CCTV Calculator mein <strong>turant reflect</strong> hote hain — koi restart nahi chahiye. "Save All Changes" se ek baar mein sab save ho jaata hai.
        </div>
      </div>

      {/* Grouped price tables */}
      {Object.entries(grouped).map(([cat,items])=>(
        <div key={cat} style={{marginBottom:20}}>
          {/* Category header */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,paddingBottom:8,borderBottom:"2px solid rgba(0,85,255,.15)"}}>
            <div style={{width:10,height:10,borderRadius:50,background:cat.startsWith("hd")?"var(--blue)":"var(--sky)"}}/>
            <h3 style={{fontSize:15,fontWeight:700,color:"var(--ink)"}}>{CATS[cat]}</h3>
            <span style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--ink3)",marginLeft:"auto"}}>{items.length} items</span>
          </div>

          {/* Price rows */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:10}}>
            {items.map(r=>{
              const changed=parseInt(edits[r.id])!==r.price;
              return (
                <div key={r.id} style={{
                  background: changed?"rgba(245,166,35,.06)":"var(--panel)",
                  border:`1px solid ${changed?"rgba(245,166,35,.3)":"rgba(0,85,255,.12)"}`,
                  borderRadius:12,padding:"14px 16px",
                  display:"flex",alignItems:"center",gap:12,
                  transition:"all .18s"
                }}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--ink)",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.label}</div>
                    <div style={{fontSize:10,color:"var(--ink3)",fontFamily:"var(--fm)",textTransform:"uppercase",letterSpacing:".05em"}}>{r.category} · {r.item_key}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                    <div style={{position:"relative"}}>
                      <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:"var(--ink3)",fontSize:13,fontFamily:"var(--fm)"}}>₹</span>
                      <input
                        className="input"
                        type="number"
                        value={edits[r.id]??r.price}
                        onChange={e=>setEdits(prev=>({...prev,[r.id]:e.target.value}))}
                        style={{width:100,paddingLeft:22,fontSize:13,padding:"8px 8px 8px 22px",
                          borderColor:changed?"rgba(245,166,35,.5)":"rgba(0,85,255,.18)",
                          background:changed?"rgba(245,166,35,.04)":"var(--bg3)"
                        }}
                        onKeyDown={e=>e.key==="Enter"&&saveOne(r.id)}
                      />
                    </div>
                    <button
                      className="btn btn-xs"
                      style={{
                        background:changed?"var(--warn)":"transparent",
                        color:changed?"#000":"var(--ink3)",
                        border:`1px solid ${changed?"var(--warn)":"rgba(255,255,255,.1)"}`,
                        fontWeight:changed?700:400,
                        minWidth:46
                      }}
                      onClick={()=>saveOne(r.id)}
                      disabled={saving[r.id]}
                    >
                      {saving[r.id]?"…":"Save"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {visible.length===0&&(
        <div className="card" style={{textAlign:"center",padding:"40px",color:"var(--ink3)"}}>
          No items found. Try changing the filter or search.
        </div>
      )}

      {/* Bottom save all */}
      {hasChanges&&(
        <div style={{position:"sticky",bottom:20,background:"rgba(2,11,24,.95)",backdropFilter:"blur(12px)",border:"1px solid rgba(245,166,35,.3)",borderRadius:14,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:20,zIndex:10}}>
          <div style={{fontSize:13,color:"var(--warn)",display:"flex",gap:8,alignItems:"center"}}>{I.alert(14)} You have unsaved price changes</div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-g btn-sm" onClick={()=>{const e={};rows.forEach(r=>e[r.id]=r.price);setEdits(e);}}>Discard</button>
            <button className="btn btn-p btn-sm" onClick={saveAll}>{I.check(13)} Save All Changes</button>
          </div>
        </div>
      )}
    </Pg>
  );
}

/* ── REPORTS ──────────────────────────────────────────────── */
function AReports({T}) {
  const [clients,setClients]=useState([]); const [leads,setLeads]=useState([]);
  useEffect(()=>{ T("GET","/clients").then(setClients).catch(()=>{}); T("GET","/leads").then(setLeads).catch(()=>{}); },[]);
  const rev=clients.reduce((a,c)=>a+c.monthly_rev,0);
  const maxR=Math.max(...clients.map(c=>c.monthly_rev),1);
  const won=leads.filter(l=>l.status==="Won").length;

  return (
    <Pg title="Reports & Analytics">
      <div className="g4" style={{marginBottom:22}}>
        {[{lb:"Projected Annual",val:`₹${(rev*12/100000).toFixed(1)}L`},{lb:"Lead Conversion",val:leads.length?`${Math.round(won/leads.length*100)}%`:"0%"},{lb:"Avg/Client",val:clients.length?`₹${Math.round(rev/clients.length).toLocaleString()}`:"—"},{lb:"Devices Under AMC",val:clients.reduce((s,c)=>s+c.systems+c.cctv+c.servers+(c.printers||0)+(c.biometrics||0),0)}].map((s,i)=>(
          <div key={i} className="sc"><div className="sv">{s.val}</div><div className="sl">{s.lb}</div></div>
        ))}
      </div>
      <div className="g2">
        <div className="card">
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:16}}>Revenue by Client</h3>
          {[...clients].sort((a,b)=>b.monthly_rev-a.monthly_rev).map(c=>(
            <div key={c.id} style={{marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span>{c.company}</span><span style={{fontFamily:"var(--fm)",color:"var(--sky)",fontWeight:600}}>₹{c.monthly_rev.toLocaleString()}</span></div>
              <div className="pb"><div className="pbf" style={{width:`${c.monthly_rev/maxR*100}%`}}/></div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:16}}>Lead Pipeline</h3>
          {["New Lead","Contacted","Site Visit Done","Proposal Sent","Negotiation","Won","Lost"].map(st=>{const n=leads.filter(l=>l.status===st).length;return(
            <div key={st} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid rgba(0,85,255,.07)"}}>
              <span style={{fontSize:12,color:"var(--ink2)"}}>{st}</span>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <div style={{width:80,height:3,background:"var(--bg3)",borderRadius:2}}><div style={{width:`${n*20}%`,height:"100%",background:st==="Won"?"var(--ok)":st==="Lost"?"var(--err)":"var(--blue)",borderRadius:2}}/></div>
                <span style={{fontFamily:"var(--fm)",fontSize:12,color:"var(--sky)",minWidth:12,textAlign:"right"}}>{n}</span>
              </div>
            </div>
          );})}
        </div>
      </div>
    </Pg>
  );
}

/* ── ADMIN SETTINGS ───────────────────────────────────────── */
function ASettings({T,showToast,user}) {
  return (
    <Pg title="Settings">
      <div className="g2" style={{gap:20}}>
        <ChangePassword T={T} showToast={showToast}/>
        <div className="card">
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:4}}>Account Info</h3>
          <p style={{fontSize:12,color:"var(--ink3)",marginBottom:18}}>Your admin account details</p>
          {[["Name",user.name],["Email",user.email],["Role","Administrator"]].map(([lb,val])=>(
            <div key={lb} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(0,85,255,.07)"}}>
              <span style={{fontSize:13,color:"var(--ink3)"}}>{lb}</span><span style={{fontSize:13,fontWeight:600}}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </Pg>
  );
}

/* ─── Shared change-password card ─────────────────────────── */
function ChangePassword({T,showToast}) {
  const [f,setF]=useState({cur:"",new1:"",new2:""});
  const [ld,setLd]=useState(false);
  const save=async()=>{
    if(!f.cur||!f.new1) return showToast("All fields required","err");
    if(f.new1!==f.new2) return showToast("Passwords don't match","err");
    if(f.new1.length<6) return showToast("Minimum 6 characters","err");
    setLd(true);
    try{await T("POST","/change-password",{currentPassword:f.cur,newPassword:f.new1});showToast("Password changed successfully!");setF({cur:"",new1:"",new2:""});}
    catch(e){showToast(e.message,"err");}
    setLd(false);
  };
  return (
    <div className="card">
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4}}>{I.key(18)}<h3 style={{fontSize:16,fontWeight:700}}>Change Password</h3></div>
      <p style={{fontSize:12,color:"var(--ink3)",marginBottom:18}}>Update your login password</p>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div><label className="lbl">Current Password</label><input className="input" type="password" placeholder="Current password" value={f.cur} onChange={e=>setF({...f,cur:e.target.value})}/></div>
        <div><label className="lbl">New Password</label><input className="input" type="password" placeholder="Min 6 characters" value={f.new1} onChange={e=>setF({...f,new1:e.target.value})}/></div>
        <div><label className="lbl">Confirm New Password</label><input className="input" type="password" placeholder="Repeat new password" value={f.new2} onChange={e=>setF({...f,new2:e.target.value})}/></div>
        <button className="btn btn-p btn-sm" onClick={save} style={{justifyContent:"center"}}>{ld?"Saving…":"Update Password"}</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CLIENT PORTAL — Redesigned Simple & Clean
═══════════════════════════════════════════════════════════ */
function Portal({user,token,s,setS,logout,nav,showToast}) {
  const T=(method,path,body)=>req(method,path,body,token);
  const [client,setClient]=useState(null);
  const load=()=>T("GET",`/clients/${user.clientId}`).then(setClient).catch(()=>{});
  useEffect(()=>{load();},[]);

  const myTickets_fn=()=>T("GET","/tickets");
  const menu=[{id:"overview",lb:"Home",icon:I.home},{id:"tickets",lb:"Support",icon:I.ticket},{id:"assets",lb:"My Devices",icon:I.monitor},{id:"invoices",lb:"Payments",icon:I.rupee},{id:"settings",lb:"Settings",icon:I.settings}];

  if(!client) return <div style={{padding:40,color:"var(--ink3)"}}>Loading…</div>;

  const days=client.amc_expiry?Math.ceil((new Date(client.amc_expiry)-new Date())/864e5):0;
  const pct=Math.max(0,Math.min(100,Math.round((1-days/365)*100)));

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      {/* Clean top nav for portal */}
      <div style={{background:"var(--bg1)",borderBottom:"1px solid rgba(0,85,255,.1)",padding:"0 24px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(16px)"}}>
        <div onClick={()=>nav("home")} style={{cursor:"pointer"}}><Logo size={32} textSize={13}/></div>
        <div style={{display:"flex",gap:4}}>
          {menu.map(m=>(
            <button key={m.id} onClick={()=>setS(m.id)} className="btn btn-g" style={{color:s===m.id?"var(--sky)":"var(--ink3)",fontWeight:s===m.id?600:400,fontSize:13,gap:5,padding:"7px 12px"}}>
              <span style={{color:s===m.id?"var(--sky)":"var(--ink3)"}}>{m.icon(14)}</span><span className="hm">{m.lb}</span>
            </button>
          ))}
        </div>
        <button className="btn btn-g btn-sm" onClick={logout}>{I.logout(14)} <span className="hm">Logout</span></button>
      </div>

      {/* Status bar */}
      <div style={{background:days<=30?"rgba(245,166,35,.06)":"rgba(0,214,143,.04)",borderBottom:`1px solid ${days<=30?"rgba(245,166,35,.2)":"rgba(0,214,143,.12)"}`,padding:"10px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <span className="dot" style={{background:days<=30?"var(--warn)":"var(--ok)"}}/>
          <span style={{fontSize:13,fontWeight:600,color:days<=30?"var(--warn)":"var(--ok)"}}>{client.company}</span>
          <span className="bdg bdg-g">AMC {client.status}</span>
        </div>
        <div style={{fontSize:12,color:"var(--ink3)",fontFamily:"var(--fm)"}}>
          Expiry: {client.amc_expiry} · {days>0?<span style={{color:days<=30?"var(--warn)":"var(--ink3)"}}>{days} days remaining</span>:<span style={{color:"var(--err)"}}>Expired</span>}
        </div>
      </div>

      <div style={{padding:"28px 24px",maxWidth:1000,margin:"0 auto"}}>
        {s==="overview" &&<POverview client={client} days={days} pct={pct} showToast={showToast}/>}
        {s==="tickets"  &&<PTickets T={T} client={client} user={user} showToast={showToast}/>}
        {s==="assets"   &&<PAssets client={client}/>}
        {s==="invoices" &&<PInvoices T={T} client={client} showToast={showToast}/>}
        {s==="settings" &&<PSettings T={T} showToast={showToast} user={user}/>}
      </div>
    </div>
  );
}

function POverview({client,days,pct,showToast}) {
  return (
    <div className="fi">
      <h2 style={{fontSize:20,fontWeight:800,marginBottom:20}}>Welcome back, {client.contact?.split(" ")[0] || client.company} 👋</h2>

      {days>0&&days<=60&&(
        <div style={{background:"rgba(245,166,35,.07)",border:"1px solid rgba(245,166,35,.25)",borderRadius:12,padding:"14px 18px",marginBottom:20,display:"flex",gap:10,alignItems:"center"}}>
          {I.alert(16)}<div><div style={{fontSize:13,fontWeight:600,color:"var(--warn)"}}>AMC Renewing in {days} days ({client.amc_expiry})</div><div style={{fontSize:12,color:"var(--ink3)"}}>Contact +91 8400281723 to renew without interruption.</div></div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
        {[{icon:I.monitor,lb:"Computers",val:client.systems},{icon:I.camera,lb:"CCTV",val:client.cctv},{icon:I.printer,lb:"Printers",val:client.printers||0},{icon:I.finger,lb:"Biometrics",val:client.biometrics||0},{icon:I.server,lb:"Servers",val:client.servers}].map((s,i)=>(
          <div key={i} className="sc" style={{textAlign:"center",padding:"16px 10px"}}>
            <div style={{color:"var(--sky)",opacity:.7,display:"flex",justifyContent:"center",marginBottom:8}}>{s.icon(18)}</div>
            <div style={{fontFamily:"var(--fh)",fontSize:26,fontWeight:800,lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:11,color:"var(--ink3)",marginTop:4}}>{s.lb}</div>
          </div>
        ))}
      </div>

      <div className="g2">
        <div className="card">
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>AMC Details</h3>
          {[["Company",client.company],["Location",client.location],["AMC Period",`${client.amc_start} → ${client.amc_expiry}`],["Monthly Charge",`₹${client.monthly_rev?.toLocaleString()}`],["Annual Value",`₹${((client.monthly_rev||0)*12).toLocaleString()}`],["Your Engineer",client.technician],["Payment",client.paid?"Current ✓":"Due"]].map(([lb,val])=>(
            <div key={lb} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(0,85,255,.07)"}}>
              <span style={{fontSize:12,color:"var(--ink3)"}}>{lb}</span>
              <span style={{fontSize:13,fontWeight:600,color:lb==="Payment"?(client.paid?"var(--ok)":"var(--err)"):"var(--ink)"}}>{val}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>Contract Progress</h3>
          <div style={{textAlign:"center",paddingBottom:16}}>
            <div style={{fontFamily:"var(--fh)",fontSize:48,fontWeight:900,color:"var(--sky)",lineHeight:1}}>{pct}%</div>
            <div style={{fontSize:12,color:"var(--ink3)",marginBottom:16,marginTop:4}}>of contract period elapsed</div>
            <div className="pb" style={{height:7}}><div className="pbf" style={{width:pct+"%"}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:10,fontFamily:"var(--fm)",color:"var(--ink3)"}}><span>{client.amc_start}</span><span>{client.amc_expiry}</span></div>
          </div>
          <div style={{background:"var(--bg2)",borderRadius:8,padding:"12px 14px",marginTop:8}}>
            <div style={{fontSize:12,fontWeight:600,color:"var(--ink)",marginBottom:4}}>Need help? We're available 24/7</div>
            <div style={{fontSize:12,color:"var(--sky)"}}>{I.phone(12)} +91 8400281723</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PTickets({T,client,user,showToast}) {
  const [tickets,setTickets]=useState([]); const [form,setForm]=useState(null);
  const load=()=>T("GET","/tickets").then(setTickets).catch(()=>{});
  useEffect(()=>{load();},[]);
  const submit=async()=>{
    if(!form.subject) return showToast("Subject required","err");
    try{await T("POST","/tickets",{...form,client_id:user.clientId,company:client.company});showToast("Ticket raised! Our team will respond shortly.");setForm(null);load();}catch(e){showToast(e.message,"err");}
  };
  const sc={Open:"bdg-y","In Progress":"bdg-b",Resolved:"bdg-g",Closed:"bdg-n"};
  const open=tickets.filter(t=>t.status!=="Resolved"&&t.status!=="Closed").length;

  return (
    <div className="fi">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div><h2 style={{fontSize:20,fontWeight:800}}>Support Tickets</h2><p style={{fontSize:12,color:"var(--ink3)",marginTop:2}}>{open} open · {tickets.length} total</p></div>
        <button className="btn btn-p btn-sm" onClick={()=>setForm({subject:"",priority:"Medium",notes:""})}>{I.plus(13)} Raise Ticket</button>
      </div>

      {tickets.length===0?(
        <div className="card" style={{textAlign:"center",padding:"48px 32px"}}>
          {I.ticket(32)}<div style={{marginTop:14,color:"var(--ink3)",fontSize:14}}>No tickets yet. Raise one if you need support.</div>
          <button className="btn btn-p btn-sm" style={{marginTop:16}} onClick={()=>setForm({subject:"",priority:"Medium",notes:""})}>Raise Support Ticket</button>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {tickets.map(t=>(
            <div key={t.id} className="card" style={{padding:"16px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                    <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--sky)"}}>{t.id}</span>
                    <span className={`bdg ${t.priority==="Critical"?"bdg-r":t.priority==="High"?"bdg-y":"bdg-b"}`}>{t.priority}</span>
                  </div>
                  <div style={{fontSize:14,fontWeight:700,color:"var(--ink)",marginBottom:4}}>{t.subject}</div>
                  {t.notes&&<div style={{fontSize:12,color:"var(--ink2)",background:"var(--bg2)",padding:"7px 11px",borderRadius:7}}>{t.notes}</div>}
                </div>
                <div style={{textAlign:"right"}}>
                  <span className={`bdg ${sc[t.status]||"bdg-n"}`}>{t.status}</span>
                  {t.technician&&<div style={{fontSize:11,color:"var(--ink3)",marginTop:5}}>{I.wrench(11)} {t.technician}</div>}
                  <div style={{fontSize:10,fontFamily:"var(--fm)",color:"var(--ink3)",marginTop:4}}>{t.updated}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {form&&(
        <div className="moverlay" onClick={()=>setForm(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{fontSize:17,fontWeight:800}}>Raise Support Ticket</h3><button className="btn btn-g" onClick={()=>setForm(null)}>{I.close(14)}</button></div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div><label className="lbl">Subject *</label><input className="input" placeholder="What's the issue?" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></div>
              <div><label className="lbl">Priority</label><select className="input" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
              <div><label className="lbl">Details</label><textarea className="input" placeholder="Which device? What error? When did it start?" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
              <div style={{display:"flex",gap:10}}><button className="btn btn-p" style={{flex:1,justifyContent:"center"}} onClick={submit}>Submit Ticket</button><button className="btn btn-o" onClick={()=>setForm(null)}>Cancel</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PAssets({client}) {
  const assets=[
    ...Array.from({length:Math.min(client.systems||0,8)},(_,i)=>({type:"Workstation",id:`WS-${String(i+1).padStart(3,"0")}`,model:["Dell OptiPlex 7090","HP ProDesk 600","Lenovo ThinkCentre","Acer Veriton"][i%4],loc:`Floor ${Math.floor(i/2)+1}`,status:"Active"})),
    ...Array.from({length:Math.min(client.cctv||0,6)},(_,i)=>({type:"CCTV",id:`CAM-${String(i+1).padStart(3,"0")}`,model:["Hikvision DS-2CD2143G2","Dahua IPC-HDW2831T","CP Plus"][i%3],loc:["Lobby","Floor 1","Floor 2","Parking","Reception","Exit"][i],status:"Active"})),
    ...Array.from({length:Math.min(client.printers||0,4)},(_,i)=>({type:"Printer",id:`PRN-${String(i+1).padStart(3,"0")}`,model:["HP LaserJet Pro M404","Canon iR 2625","Epson M15140"][i%3],loc:`Floor ${i+1}`,status:"Active"})),
    ...Array.from({length:Math.min(client.biometrics||0,3)},(_,i)=>({type:"Biometric",id:`BIO-${String(i+1).padStart(3,"0")}`,model:["ZKTeco F18","eSSL X990","Realand A-C091"][i%3],loc:["Main Entry","Floor 2","Server Room"][i],status:"Active"})),
    ...Array.from({length:Math.min(client.servers||0,2)},(_,i)=>({type:"Server",id:`SRV-${String(i+1).padStart(3,"0")}`,model:["Dell PowerEdge T440","HP ProLiant ML350"][i]||"Dell Server",loc:"Server Room",status:"Active"})),
  ];

  return (
    <div className="fi">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:20,fontWeight:800}}>My Devices</h2>
        <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--ink3)"}}>{assets.length} devices under AMC</span>
      </div>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <table>
          <thead><tr><th>Device ID</th><th>Type</th><th>Model</th><th>Location</th><th>Status</th></tr></thead>
          <tbody>{assets.map((a,i)=>(
            <tr key={i}>
              <td><span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--sky)"}}>{a.id}</span></td>
              <td><span className="bdg bdg-b">{a.type}</span></td>
              <td style={{fontWeight:600,color:"var(--ink)"}}>{a.model}</td>
              <td style={{fontSize:12,color:"var(--ink3)"}}>{a.loc}</td>
              <td><span className="bdg bdg-g">{a.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function PInvoices({T,client,showToast}) {
  const [payments,setPayments]=useState([]);
  const [paying,setPaying]=useState(false);
  useEffect(()=>{ T("GET","/payments").then(setPayments).catch(()=>{}); },[]);

  const payNow=async()=>{
    setPaying(true);
    try {
      const d=await T("POST","/payments/create-order",{amount:client.monthly_rev,description:`AMC - ${new Date().toLocaleString("en-IN",{month:"long",year:"numeric"})}`});
      if(d.mock){
        await T("POST","/payments/verify",{orderId:d.orderId,paymentId:"mock_"+Date.now(),amount:client.monthly_rev,description:`March 2026 AMC`});
        showToast("Payment successful! Confirmation email sent.");
        T("GET","/payments").then(setPayments);
      } else {
        // Real Razorpay
        const options={key:d.key,amount:d.amount*100,currency:"INR",name:"The Computer Garage",description:"AMC Payment",order_id:d.orderId,
          handler:async(r)=>{ await T("POST","/payments/verify",{orderId:d.orderId,paymentId:r.razorpay_payment_id,amount:client.monthly_rev,description:"March AMC"}); showToast("Payment successful!"); T("GET","/payments").then(setPayments); },
          prefill:{name:client.contact,email:client.email},theme:{color:"#0055ff"}};
        new window.Razorpay(options).open();
      }
    } catch(e){ showToast(e.message,"err"); }
    setPaying(false);
  };

  return (
    <div className="fi">
      <h2 style={{fontSize:20,fontWeight:800,marginBottom:20}}>Payments & Invoices</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
        <div className="sc"><div className="sv" style={{fontSize:22}}>₹{client.monthly_rev?.toLocaleString()}</div><div className="sl">Monthly AMC</div></div>
        <div className="sc"><div className="sv" style={{fontSize:22}}>₹{((client.monthly_rev||0)*12).toLocaleString()}</div><div className="sl">Annual Value</div></div>
        <div className="sc" style={{display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
          <div><div className="sv" style={{fontSize:20,color:client.paid?"var(--ok)":"var(--err)"}}>{client.paid?"Current":"Due"}</div><div className="sl">Payment Status</div></div>
          {!client.paid&&<button className="btn btn-p btn-sm" style={{marginTop:10}} onClick={payNow} disabled={paying}>{I.rupee(13)} {paying?"Processing…":"Pay Now"}</button>}
        </div>
      </div>

      {payments.length>0&&(
        <div className="card" style={{padding:0,overflow:"hidden"}}>
          <table>
            <thead><tr><th>Description</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>{payments.map((p,i)=>(
              <tr key={i}>
                <td style={{color:"var(--ink)"}}>{p.description||"AMC Payment"}</td>
                <td style={{fontFamily:"var(--fh)",fontWeight:700,color:"var(--ink)"}}>₹{p.amount?.toLocaleString()}</td>
                <td><span className={`bdg ${p.status==="paid"?"bdg-g":"bdg-y"}`}>{p.status}</span></td>
                <td style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--ink3)"}}>{p.created_at?.split(" ")[0]}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {payments.length===0&&<div className="card" style={{textAlign:"center",padding:"36px",color:"var(--ink3)",fontSize:13}}>No payment history yet.</div>}
    </div>
  );
}

function PSettings({T,showToast,user}) {
  return (
    <div className="fi">
      <h2 style={{fontSize:20,fontWeight:800,marginBottom:20}}>Settings</h2>
      <div style={{maxWidth:480}}>
        <ChangePassword T={T} showToast={showToast}/>
        <div className="card" style={{marginTop:14}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>Account</div>
          {[["Name",user.name],["Email",user.email],["Role","Client Portal"]].map(([lb,val])=>(
            <div key={lb} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(0,85,255,.07)"}}>
              <span style={{fontSize:12,color:"var(--ink3)"}}>{lb}</span><span style={{fontSize:13,fontWeight:600}}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
