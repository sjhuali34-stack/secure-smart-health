// Lightweight global app store backed by localStorage.
// Used to make the prototype's actions interactive without a backend.
import { useSyncExternalStore } from "react";

export type RoleId =
  | "citizen" | "doctor" | "pharmacist" | "nurse" | "lab"
  | "radiology" | "emergency" | "ministry" | "community" | "physio";

export type Notification = {
  id: string;
  title: string;
  body: string;
  tone: "info" | "success" | "warn" | "danger";
  at: number;
  read?: boolean;
  for?: RoleId | "all";
};

export type Appointment = {
  id: string;
  patient: string;
  patientId: string;
  doctor: string;
  spec: string;
  facility: string;
  date: string; // ISO
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
};

export type Referral = {
  id: string;
  from: string;
  to: string;
  patient: string;
  patientId: string;
  reason: string;
  urgency: "routine" | "urgent" | "emergency";
  notes: string;
  at: number;
  status: "pending" | "accepted" | "completed";
};

export type ReportFile = {
  id: string;
  role: RoleId;
  kind: string;       // e.g. "نتيجة مختبر", "تقرير أشعة"
  patient: string;
  title: string;
  fileName: string;
  size: number;
  at: number;
  author: string;
};

export type Citizen = {
  id: string;          // national health id
  name: string;
  dob: string;
  phone: string;
  bloodType?: string;
  at: number;
};

export type Session = {
  role: RoleId;
  name: string;
  healthId: string;
} | null;

type State = {
  session: Session;
  notifications: Notification[];
  appointments: Appointment[];
  referrals: Referral[];
  reports: ReportFile[];
  citizens: Citizen[];
};

const KEY = "ur-sehr-store-v1";
const initial: State = {
  session: null,
  notifications: [
    { id: "n1", title: "نتيجة تحليل جاهزة", body: "HbA1c ضمن المعدل الطبيعي.", tone: "success", at: Date.now() - 1000 * 60 * 30, for: "citizen" },
    { id: "n2", title: "موعد لقاح قادم", body: "لقاح الإنفلونزا قبل ٣٠ نوفمبر.", tone: "info", at: Date.now() - 1000 * 60 * 90, for: "citizen" },
    { id: "n3", title: "إحالة جديدة بانتظارك", body: "إحالة من د. سارة العبيدي.", tone: "warn", at: Date.now() - 1000 * 60 * 10, for: "doctor" },
  ],
  appointments: [],
  referrals: [],
  reports: [],
  citizens: [],
};

function load(): State {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch { return initial; }
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}
function set(next: Partial<State>) {
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
}

export const store = {
  get: () => state,
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },

  // session
  login(s: NonNullable<Session>) {
    set({ session: s });
    pushNotification({ title: "تم تسجيل الدخول", body: `مرحبًا ${s.name}`, tone: "success", for: s.role });
  },
  logout() { set({ session: null }); },

  // citizens
  registerCitizen(c: Omit<Citizen, "at">) {
    set({ citizens: [{ ...c, at: Date.now() }, ...state.citizens] });
    pushNotification({ title: "تم تسجيل بطاقة صحية جديدة", body: `${c.name} — ${c.id}`, tone: "success", for: "ministry" });
  },

  // appointments
  bookAppointment(a: Omit<Appointment, "id" | "status">) {
    const item: Appointment = { ...a, id: `APT-${Date.now()}`, status: "scheduled" };
    set({ appointments: [item, ...state.appointments] });
    pushNotification({ title: "تم تأكيد الموعد", body: `${a.doctor} · ${new Date(a.date).toLocaleString("ar")}`, tone: "success", for: "citizen" });
    pushNotification({ title: "موعد جديد", body: `${a.patient} — ${a.reason}`, tone: "info", for: "doctor" });
    return item;
  },

  // referrals
  createReferral(r: Omit<Referral, "id" | "at" | "status">) {
    const item: Referral = { ...r, id: `REF-${Date.now()}`, at: Date.now(), status: "pending" };
    set({ referrals: [item, ...state.referrals] });
    pushNotification({ title: "إحالة جديدة", body: `${r.patient} → ${r.to}`, tone: "warn", for: "doctor" });
    pushNotification({ title: "تم إنشاء إحالة لك", body: `${r.to} — ${r.reason}`, tone: "info", for: "citizen" });
    return item;
  },

  // reports
  uploadReport(r: Omit<ReportFile, "id" | "at">) {
    const item: ReportFile = { ...r, id: `RPT-${Date.now()}`, at: Date.now() };
    set({ reports: [item, ...state.reports] });
    pushNotification({ title: "تم رفع تقرير", body: `${r.kind} · ${r.title}`, tone: "success", for: r.role });
    return item;
  },

  // notifications
  markAllRead(role?: RoleId) {
    set({
      notifications: state.notifications.map((n) =>
        !role || n.for === role || n.for === "all" ? { ...n, read: true } : n
      ),
    });
  },
};

function pushNotification(n: Omit<Notification, "id" | "at">) {
  const item: Notification = { ...n, id: `NTF-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: Date.now() };
  set({ notifications: [item, ...state.notifications].slice(0, 50) });
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(initial),
  );
}

// Trigger a PDF-ish download (HTML wrapper -> .pdf-like blob).
export function downloadHealthRecord(name: string, healthId: string) {
  const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>السجل الصحي — ${name}</title>
<style>body{font-family:system-ui;padding:32px;color:#111}h1{margin:0}small{color:#666}hr{margin:16px 0;border:none;border-top:1px solid #eee}.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #eee}</style>
</head><body>
<h1>UR-SEHR — السجل الصحي الموحّد</h1>
<small>صادر بتاريخ ${new Date().toLocaleString("ar")}</small><hr/>
<div class="row"><b>الاسم</b><span>${name}</span></div>
<div class="row"><b>الرقم الصحي الوطني</b><span>${healthId}</span></div>
<div class="row"><b>فصيلة الدم</b><span>O+</span></div>
<div class="row"><b>الحساسية</b><span>بنسلين</span></div>
<div class="row"><b>الحالات المزمنة</b><span>سكري نوع 2 — ضغط الدم</span></div>
<h3>آخر التحاليل</h3>
<div class="row"><span>HbA1c</span><span>5.4% — طبيعي</span></div>
<div class="row"><span>LDL</span><span>138 mg/dL — مرتفع</span></div>
<h3>الوصفات الفعّالة</h3>
<div class="row"><span>Metformin 500mg</span><span>مرتين يومياً</span></div>
<div class="row"><span>Vitamin D3 5000IU</span><span>مرة يومياً</span></div>
<hr/><small>وثيقة موقعة رقمياً عبر منصة UR-SEHR.</small>
</body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `UR-SEHR-Record-${healthId}.html`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
