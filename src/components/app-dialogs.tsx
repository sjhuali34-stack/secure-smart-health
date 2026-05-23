import { useEffect, useState, type ReactNode } from "react";
import { X, Upload, Bell, CheckCircle2, AlertTriangle, Info, FileText, Users, Trash2, Plus, Send, Download, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { store, useStore, downloadHealthRecord, type RoleId } from "@/lib/app-store";

/* ---------- Modal primitive ---------- */
export function Modal({
  open, onClose, title, children, footer, wide,
}: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 backdrop-blur-sm p-4" onClick={onClose} dir="rtl">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? "max-w-3xl" : "max-w-md"} overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-elevated)]`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-border bg-background/50 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({
  label, value, onChange, placeholder, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

export function TextArea({
  label, value, onChange, placeholder, rows = 3,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <label className="block">
      <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
      <textarea
        value={value} placeholder={placeholder} rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

export function PrimaryButton({ children, onClick, type = "button", disabled }: { children: ReactNode; onClick?: () => void; type?: "button"|"submit"; disabled?: boolean }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50">
      {children}
    </button>
  );
}
export function GhostButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted">
      {children}
    </button>
  );
}

/* ---------- Book Appointment ---------- */
export function BookAppointmentDialog({ open, onClose, patient }: { open: boolean; onClose: () => void; patient?: { name: string; id: string } }) {
  const session = useStore((s) => s.session);
  const [doctor, setDoctor] = useState("د. سارة العبيدي");
  const [spec, setSpec] = useState("طب الأسرة");
  const [facility, setFacility] = useState("مستشفى بغداد التعليمي");
  const [date, setDate] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [reason, setReason] = useState("مراجعة دورية");
  const p = patient ?? { name: session?.name ?? "أحمد محمد", id: session?.healthId ?? "12-4567-8901-23" };

  const submit = () => {
    store.bookAppointment({ patient: p.name, patientId: p.id, doctor, spec, facility, date: new Date(date).toISOString(), reason });
    toast.success("تم حجز الموعد بنجاح");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="حجز موعد جديد"
      footer={<div className="flex justify-end gap-2"><GhostButton onClick={onClose}>إلغاء</GhostButton><PrimaryButton onClick={submit}>تأكيد الحجز</PrimaryButton></div>}>
      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-background px-3 py-2 text-[12px] text-muted-foreground">المريض: <b className="text-foreground">{p.name}</b> · {p.id}</div>
        <Field label="الطبيب" value={doctor} onChange={setDoctor} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="التخصص" value={spec} onChange={setSpec} />
          <Field label="المنشأة" value={facility} onChange={setFacility} />
        </div>
        <Field label="التاريخ والوقت" type="datetime-local" value={date} onChange={setDate} />
        <TextArea label="سبب الزيارة" value={reason} onChange={setReason} />
      </div>
    </Modal>
  );
}

/* ---------- New Referral ---------- */
export function NewReferralDialog({ open, onClose, patient, from }: { open: boolean; onClose: () => void; patient?: { name: string; id: string }; from?: string }) {
  const session = useStore((s) => s.session);
  const [to, setTo] = useState("د. محمد الزبيدي — استشاري القلب");
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState<"routine"|"urgent"|"emergency">("routine");
  const [notes, setNotes] = useState("");
  const p = patient ?? { name: session?.name ?? "أحمد محمد", id: session?.healthId ?? "12-4567-8901-23" };
  const f = from ?? (session?.role === "doctor" ? session.name : "د. سارة العبيدي");

  const submit = () => {
    if (!reason.trim()) { toast.error("سبب الإحالة مطلوب"); return; }
    store.createReferral({ patient: p.name, patientId: p.id, from: f, to, reason, urgency, notes });
    toast.success("تم إنشاء الإحالة");
    onClose();
    setReason(""); setNotes("");
  };

  return (
    <Modal open={open} onClose={onClose} title="إحالة طبية جديدة"
      footer={<div className="flex justify-end gap-2"><GhostButton onClick={onClose}>إلغاء</GhostButton><PrimaryButton onClick={submit}>إرسال الإحالة</PrimaryButton></div>}>
      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-background px-3 py-2 text-[12px] text-muted-foreground">من: <b className="text-foreground">{f}</b> — إلى: <b className="text-foreground">{to}</b></div>
        <Field label="المريض" value={p.name} onChange={() => {}} />
        <Field label="إحالة إلى" value={to} onChange={setTo} />
        <Field label="سبب الإحالة" value={reason} onChange={setReason} placeholder="مثلاً: ألم صدر متكرر يستدعي تقييم القلب" />
        <div>
          <div className="text-[11px] font-medium text-muted-foreground">درجة الأولوية</div>
          <div className="mt-1 flex gap-2">
            {[
              { id: "routine", label: "اعتيادية" },
              { id: "urgent", label: "عاجلة" },
              { id: "emergency", label: "إسعافية" },
            ].map((u) => (
              <button key={u.id} onClick={() => setUrgency(u.id as typeof urgency)}
                className={`rounded-full px-3 py-1.5 text-[11.5px] font-medium border transition ${urgency===u.id ? "bg-foreground text-background border-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}>
                {u.label}
              </button>
            ))}
          </div>
        </div>
        <TextArea label="ملاحظات إكلينيكية" value={notes} onChange={setNotes} />
      </div>
    </Modal>
  );
}

/* ---------- Upload Report ---------- */
export function UploadReportDialog({ open, onClose, role, defaultKind }: { open: boolean; onClose: () => void; role: RoleId; defaultKind: string }) {
  const session = useStore((s) => s.session);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState(defaultKind);
  const [patient, setPatient] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const submit = () => {
    if (!title.trim() || !patient.trim()) { toast.error("اكمل بيانات التقرير"); return; }
    store.uploadReport({
      role, kind, patient, title,
      fileName: file?.name ?? `${kind}.pdf`,
      size: file?.size ?? 124000,
      author: session?.name ?? "مستخدم النظام",
    });
    toast.success("تم رفع التقرير وربطه بالسجل");
    onClose();
    setTitle(""); setPatient(""); setFile(null);
  };

  return (
    <Modal open={open} onClose={onClose} title={`رفع تقرير — ${defaultKind}`}
      footer={<div className="flex justify-end gap-2"><GhostButton onClick={onClose}>إلغاء</GhostButton><PrimaryButton onClick={submit}>رفع وحفظ</PrimaryButton></div>}>
      <div className="space-y-3">
        <Field label="نوع التقرير" value={kind} onChange={setKind} />
        <Field label="المريض / الرقم الصحي" value={patient} onChange={setPatient} placeholder="مثلاً: أحمد محمد — 12-4567-8901-23" />
        <Field label="عنوان التقرير" value={title} onChange={setTitle} placeholder="مثلاً: نتيجة فحص CBC" />
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-background px-4 py-4 text-[12px] text-muted-foreground hover:border-border-strong">
          <Upload className="h-4 w-4 text-primary" />
          <span className="flex-1">{file ? `${file.name} · ${(file.size/1024).toFixed(0)} KB` : "اختر ملف للرفع (PDF/JPG/PNG/DICOM)"}</span>
          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
      </div>
    </Modal>
  );
}

/* ---------- Register Citizen ---------- */
export function RegisterCitizenDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodType, setBloodType] = useState("O+");

  const submit = () => {
    if (!name.trim() || !id.trim()) { toast.error("الاسم والرقم الصحي مطلوبان"); return; }
    store.registerCitizen({ name, id, dob, phone, bloodType });
    toast.success("تم إنشاء بطاقة صحية جديدة");
    onClose();
    setName(""); setId(""); setDob(""); setPhone("");
  };

  return (
    <Modal open={open} onClose={onClose} title="تسجيل بطاقة صحية جديدة"
      footer={<div className="flex justify-end gap-2"><GhostButton onClick={onClose}>إلغاء</GhostButton><PrimaryButton onClick={submit}>تسجيل وإصدار</PrimaryButton></div>}>
      <div className="space-y-3">
        <Field label="الاسم الرباعي" value={name} onChange={setName} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="الرقم الصحي الوطني" value={id} onChange={setId} placeholder="12-XXXX-XXXX-XX" />
          <Field label="تاريخ الميلاد" type="date" value={dob} onChange={setDob} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="رقم الهاتف" value={phone} onChange={setPhone} placeholder="07XX-XXX-XXXX" />
          <Field label="فصيلة الدم" value={bloodType} onChange={setBloodType} />
        </div>
        <div className="rounded-xl border border-border bg-background p-3 text-[11.5px] text-muted-foreground">
          سيتم إصدار ملف صحي إلكتروني فوراً وربطه بالهوية الوطنية.
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Notifications popover ---------- */
export function NotificationsBell({ role }: { role: RoleId }) {
  const [open, setOpen] = useState(false);
  const notifs = useStore((s) => s.notifications.filter((n) => !n.for || n.for === role || n.for === "all"));
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen((o) => !o); if (!open) setTimeout(() => store.markAllRead(role), 800); }}
        className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-surface hover:border-border-strong"
        aria-label="التنبيهات"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -left-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-semibold text-destructive-foreground">{unread}</span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-elevated)]" dir="rtl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="text-[13px] font-semibold">التنبيهات</div>
              <button onClick={() => store.markAllRead(role)} className="text-[11px] text-primary hover:underline">تحديد الكل كمقروء</button>
            </div>
            <div className="max-h-96 divide-y divide-border overflow-y-auto">
              {notifs.length === 0 && <div className="p-6 text-center text-[12px] text-muted-foreground">لا توجد تنبيهات</div>}
              {notifs.map((n) => {
                const Icon = n.tone === "success" ? CheckCircle2 : n.tone === "warn" ? AlertTriangle : n.tone === "danger" ? AlertTriangle : Info;
                const tone = n.tone === "success" ? "text-success" : n.tone === "danger" ? "text-destructive" : n.tone === "warn" ? "text-[oklch(0.6_0.15_70)]" : "text-primary";
                return (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3">
                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium text-foreground">{n.title}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{n.body}</div>
                      <div className="mt-1 text-[10px] text-muted-foreground">{timeAgo(n.at)}</div>
                    </div>
                    {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function timeAgo(at: number) {
  const s = Math.floor((Date.now() - at) / 1000);
  if (s < 60) return "الآن";
  if (s < 3600) return `قبل ${Math.floor(s/60)} د`;
  if (s < 86400) return `قبل ${Math.floor(s/3600)} س`;
  return `قبل ${Math.floor(s/86400)} يوم`;
}

/* ---------- Generic small badge/list for store data ---------- */
export function StoreListEmpty({ icon: Icon = FileText, label }: { icon?: typeof FileText; label: string }) {
  return (
    <div className="grid place-items-center gap-2 rounded-xl border border-dashed border-border bg-background py-8 text-[12px] text-muted-foreground">
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}

/* ---------- Family Management ---------- */
export function FamilyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const family = useStore((s) => s.family);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("الابن");
  const [age, setAge] = useState("");
  const [healthId, setHealthId] = useState("");
  const [note, setNote] = useState("");

  const add = () => {
    if (!name.trim()) { toast.error("اسم الفرد مطلوب"); return; }
    store.addFamilyMember({ name, relation, age, healthId, note });
    toast.success("تمت إضافة الفرد إلى الأسرة");
    setName(""); setAge(""); setHealthId(""); setNote("");
  };
  const remove = (id: string, n: string) => {
    store.removeFamilyMember(id);
    toast.success(`تم حذف ${n}`);
  };

  return (
    <Modal open={open} onClose={onClose} title="إدارة سجل الأسرة" wide
      footer={<div className="flex justify-end gap-2"><GhostButton onClick={onClose}>إغلاق</GhostButton></div>}>
      <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-2">
          <div className="text-[12px] font-semibold text-foreground">أفراد الأسرة المرتبطون ({family.length})</div>
          {family.length === 0 && <StoreListEmpty icon={Users} label="لا يوجد أفراد بعد" />}
          {family.map((m) => (
            <div key={m.id} className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-primary font-semibold">{m.name.slice(0, 1)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-foreground truncate">{m.name}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{m.relation}</span>
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground truncate">{[m.age, m.healthId, m.note].filter(Boolean).join(" · ")}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <button onClick={() => { downloadHealthRecord(m.name, m.healthId ?? "غير معروف"); toast.success("تم تجهيز السجل"); }}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1 text-[10.5px] text-foreground hover:bg-muted">
                    <Download className="h-3 w-3" /> السجل الصحي
                  </button>
                  <button onClick={() => remove(m.id, m.name)}
                    className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/5 px-2 py-1 text-[10.5px] text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3 w-3" /> حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3 rounded-2xl border border-dashed border-border bg-background/40 p-4">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-foreground">
            <Plus className="h-3.5 w-3.5 text-primary" /> إضافة فرد جديد
          </div>
          <Field label="الاسم" value={name} onChange={setName} placeholder="الاسم الكامل" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="صلة القرابة" value={relation} onChange={setRelation} />
            <Field label="العمر" value={age} onChange={setAge} placeholder="مثلاً: ٨ سنوات" />
          </div>
          <Field label="الرقم الصحي الوطني" value={healthId} onChange={setHealthId} placeholder="12-XXXX-XXXX-XX" />
          <Field label="ملاحظات" value={note} onChange={setNote} placeholder="حساسية / لقاحات قادمة" />
          <PrimaryButton onClick={add}><Plus className="h-3.5 w-3.5" /> إضافة للأسرة</PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Broadcast Alert (Ministry of Health) ---------- */
const ALL_ROLES: { id: RoleId; label: string }[] = [
  { id: "doctor", label: "الأطباء" },
  { id: "nurse", label: "الممرضون" },
  { id: "pharmacist", label: "الصيدليات" },
  { id: "lab", label: "المختبرات" },
  { id: "radiology", label: "الأشعة" },
  { id: "emergency", label: "الطوارئ" },
  { id: "community", label: "صحة المجتمع" },
  { id: "physio", label: "العلاج الطبيعي" },
];

export function BroadcastAlertDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tone, setTone] = useState<"info" | "success" | "warn" | "danger">("info");
  const [mode, setMode] = useState<"all" | "citizens" | "institutions" | "custom">("all");
  const [picked, setPicked] = useState<RoleId[]>([]);

  const toggle = (r: RoleId) => setPicked((p) => p.includes(r) ? p.filter((x) => x !== r) : [...p, r]);

  const send = () => {
    if (!title.trim() || !body.trim()) { toast.error("عنوان ونص التنبيه مطلوبان"); return; }
    let targets: Array<RoleId | "all"> = [];
    if (mode === "all") targets = ["all"];
    else if (mode === "citizens") targets = ["citizen"];
    else if (mode === "institutions") targets = ALL_ROLES.map((r) => r.id);
    else targets = picked.length ? picked : ["all"];
    store.broadcastAlert({ title, body, tone, targets });
    toast.success(`تم إرسال التنبيه (${targets.includes("all") ? "للجميع" : `${targets.length} جهة`})`);
    onClose();
    setTitle(""); setBody(""); setPicked([]); setMode("all");
  };

  return (
    <Modal open={open} onClose={onClose} title="إرسال تنبيه وطني" wide
      footer={<div className="flex justify-end gap-2"><GhostButton onClick={onClose}>إلغاء</GhostButton><PrimaryButton onClick={send}><Send className="h-3.5 w-3.5" /> إرسال التنبيه</PrimaryButton></div>}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-border bg-accent/40 p-3">
          <Megaphone className="mt-0.5 h-4 w-4 text-primary" />
          <div className="text-[11.5px] text-muted-foreground">
            هذه القناة الرسمية لوزارة الصحة لإرسال إخطارات فورية إلى المؤسسات الصحية أو إلى جميع المواطنين المسجلين في المنصة.
          </div>
        </div>
        <Field label="عنوان التنبيه" value={title} onChange={setTitle} placeholder="مثلاً: ارتفاع حالات الإنفلونزا في البصرة" />
        <TextArea label="نص التنبيه" value={body} onChange={setBody} rows={4} placeholder="تفاصيل التنبيه والإجراءات الموصى بها…" />

        <div>
          <div className="text-[11px] font-medium text-muted-foreground mb-1.5">مستوى الأهمية</div>
          <div className="flex flex-wrap gap-2">
            {([
              { id: "info", label: "إعلامي" },
              { id: "success", label: "إيجابي" },
              { id: "warn", label: "تحذير" },
              { id: "danger", label: "خطر / إنذار" },
            ] as const).map((t) => (
              <button key={t.id} onClick={() => setTone(t.id)}
                className={`rounded-full px-3 py-1.5 text-[11.5px] font-medium border transition ${tone===t.id ? "bg-foreground text-background border-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-medium text-muted-foreground mb-1.5">الفئة المستهدفة</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {([
              { id: "all", label: "جميع المستخدمين (مواطنون + مؤسسات)" },
              { id: "citizens", label: "جميع المواطنين فقط" },
              { id: "institutions", label: "جميع المؤسسات الصحية" },
              { id: "custom", label: "مؤسسات مختارة…" },
            ] as const).map((opt) => (
              <button key={opt.id} onClick={() => setMode(opt.id)}
                className={`rounded-xl border px-3 py-2 text-right text-[12px] transition ${mode===opt.id ? "border-primary bg-accent text-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "custom" && (
          <div className="rounded-xl border border-border bg-background p-3">
            <div className="text-[11px] font-medium text-muted-foreground mb-2">اختر المؤسسات</div>
            <div className="flex flex-wrap gap-2">
              {ALL_ROLES.map((r) => (
                <button key={r.id} onClick={() => toggle(r.id)}
                  className={`rounded-full px-3 py-1 text-[11px] border transition ${picked.includes(r.id) ? "bg-primary text-primary-foreground border-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
