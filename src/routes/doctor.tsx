import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Stethoscope, Search, Users, FileText, Pill, Send, FlaskConical,
  ScanLine, Plus, X, AlertTriangle, CheckCircle2, Clock, Calendar,
  ChevronLeft, Activity, Heart, Sparkles, ArrowLeft, Trash2, Save,
  LogOut, UserPlus,
} from "lucide-react";
import { store, useStore } from "@/lib/app-store";
import {
  NotificationsBell, BookAppointmentDialog, NewReferralDialog,
  RegisterCitizenDialog, UploadReportDialog,
} from "@/components/app-dialogs";

export const Route = createFileRoute("/doctor")({
  component: DoctorDashboard,
  head: () => ({
    meta: [
      { title: "لوحة الطبيب | UR-SEHR" },
      { name: "description", content: "لوحة الطبيب: التشخيص، خطط العلاج، وإنشاء الوصفات." },
    ],
  }),
});

type View = "queue" | "patient" | "prescribe";

const PATIENT = { name: "أحمد محمد", id: "12-4567-8901-23" };

function DoctorDashboard() {
  const [view, setView] = useState<View>("queue");
  const [bookOpen, setBookOpen] = useState(false);
  const [refOpen, setRefOpen] = useState(false);
  const [regOpen, setRegOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="ambient-bg min-h-screen" dir="rtl">
      <TopBar />
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <Sidebar onRegister={() => setRegOpen(true)} onUpload={() => setUploadOpen(true)} />
        <main>
          {view === "queue" && <Queue onOpen={() => setView("patient")} onRegister={() => setRegOpen(true)} />}
          {view === "patient" && (
            <PatientChart
              onBack={() => setView("queue")}
              onPrescribe={() => setView("prescribe")}
              onBook={() => setBookOpen(true)}
              onReferral={() => setRefOpen(true)}
              onUpload={() => setUploadOpen(true)}
            />
          )}
          {view === "prescribe" && <Prescribe onBack={() => setView("patient")} />}
        </main>
      </div>

      <BookAppointmentDialog open={bookOpen} onClose={() => setBookOpen(false)} patient={PATIENT} />
      <NewReferralDialog open={refOpen} onClose={() => setRefOpen(false)} patient={PATIENT} />
      <RegisterCitizenDialog open={regOpen} onClose={() => setRegOpen(false)} />
      <UploadReportDialog open={uploadOpen} onClose={() => setUploadOpen(false)} role="doctor" defaultKind="تقرير طبي" />
    </div>
  );
}

/* =================== Shell =================== */

function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3.5 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background">
            <Stethoscope className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-foreground">UR-SEHR</div>
            <div className="text-[10px] text-muted-foreground">لوحة الطبيب</div>
          </div>
        </Link>

        <div className="hidden flex-1 max-w-md md:block">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="ابحث برقم المريض أو الاسم…"
              className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface hover:bg-muted">
            <Bell className="h-4 w-4 text-foreground" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-[12px] font-semibold text-primary-foreground">
              س ع
            </div>
            <div className="hidden leading-tight md:block">
              <div className="text-[12px] font-medium text-foreground">د. سارة العبيدي</div>
              <div className="text-[10px] text-muted-foreground">طب الأسرة · MED-4421</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Sidebar() {
  const items = [
    { icon: Users, label: "قائمة المرضى", count: "١٢", active: true },
    { icon: Calendar, label: "المواعيد", count: "٨" },
    { icon: Send, label: "الإحالات", count: "٣" },
    { icon: FlaskConical, label: "نتائج معلّقة", count: "٥" },
    { icon: FileText, label: "السجلات الحديثة" },
    { icon: Sparkles, label: "مساعد ذكي" },
  ];
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 space-y-1.5 rounded-3xl border border-border bg-surface p-3">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <button
              key={i}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] transition ${
                it.active
                  ? "bg-foreground text-background"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-right">{it.label}</span>
              {it.count && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${
                  it.active ? "bg-background/15 text-background" : "bg-muted text-muted-foreground"
                }`}>{it.count}</span>
              )}
            </button>
          );
        })}
        <div className="mt-3 rounded-2xl border border-border bg-accent/40 p-3">
          <div className="flex items-center gap-2 text-[11px] font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> اقتراح ذكي
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            ٣ مرضى لديهم نتائج تحاليل جاهزة تنتظر مراجعتك.
          </p>
        </div>
      </div>
    </aside>
  );
}

/* =================== Queue =================== */

function Queue({ onOpen }: { onOpen: () => void }) {
  const patients = [
    { name: "أحمد محمد", id: "١٢-٤٥٦٧-٨٩٠١-٢٣", age: 42, time: "٠٩:٠٠", reason: "مراجعة دورية", tone: "primary" as const, status: "في الانتظار" },
    { name: "فاطمة علي", id: "١٢-٣٣٢١-٧٧٨٨-١٤", age: 34, time: "٠٩:٢٠", reason: "ألم صدر", tone: "warning" as const, status: "عاجل" },
    { name: "يوسف الكاظمي", id: "١٢-٩٩١٢-٤٤٥٢-٠٨", age: 8, time: "٠٩:٤٠", reason: "حمى", tone: "primary" as const, status: "في الانتظار" },
    { name: "ميسون الجبوري", id: "١٢-٧٧٠١-٢٢١٠-٩٩", age: 56, time: "١٠:٠٠", reason: "ضغط الدم", tone: "primary" as const, status: "في الانتظار" },
    { name: "علي الزبيدي", id: "١٢-٦٥٤٣-٨٨٩٩-٥٥", age: 29, time: "١٠:٢٠", reason: "نتائج تحاليل", tone: "success" as const, status: "جاهز" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-4">
        <Stat icon={Users} label="مرضى اليوم" value="١٢" />
        <Stat icon={Clock} label="في الانتظار" value="٤" />
        <Stat icon={CheckCircle2} label="مكتمل" value="٥" />
        <Stat icon={AlertTriangle} label="عاجل" value="١" tone="warning" />
      </div>

      <section className="rounded-3xl border border-border bg-surface p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">قائمة المرضى — اليوم</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">١٨ مايو ٢٠٢٦ · مستشفى بغداد التعليمي</p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-[12px] text-foreground hover:bg-muted">
            <Plus className="h-3.5 w-3.5" /> إضافة مريض
          </button>
        </div>

        <div className="space-y-2">
          {patients.map((p, i) => (
            <button
              key={i}
              onClick={onOpen}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-background p-3.5 text-right transition hover:border-border-strong hover:bg-muted/40"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-[12px] font-semibold text-primary">
                {p.name.split(" ")[0][0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-foreground">{p.name}</span>
                  <span className="text-[10.5px] text-muted-foreground">· {p.age} سنة</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{p.id} · {p.reason}</div>
              </div>
              <div className="hidden text-[11px] text-muted-foreground sm:block">{p.time}</div>
              <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium ${
                p.tone === "warning" ? "bg-destructive/10 text-destructive" :
                p.tone === "success" ? "bg-success/10 text-success" :
                "bg-accent text-primary"
              }`}>{p.status}</span>
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon, label, value, tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; tone?: "warning";
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className={`grid h-7 w-7 place-items-center rounded-lg ${
          tone === "warning" ? "bg-destructive/10 text-destructive" : "bg-accent text-primary"
        }`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</div>
    </div>
  );
}

/* =================== Patient Chart =================== */

function PatientChart({ onBack, onPrescribe }: { onBack: () => void; onPrescribe: () => void }) {
  const [reason, setReason] = useState("مراجعة");
  const [diagnosis, setDiagnosis] = useState("");
  const [plan, setPlan] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5 rotate-180" /> العودة لقائمة المرضى
      </button>

      {/* Patient header */}
      <section className="rounded-3xl border border-border bg-gradient-to-br from-surface to-accent/40 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-foreground text-background text-lg font-semibold">
              أ
            </div>
            <div>
              <div className="text-[18px] font-semibold tracking-tight text-foreground">أحمد محمد</div>
              <div className="mt-0.5 text-[12px] text-muted-foreground">
                ذكر · ٤٢ سنة · O+ · ١٢-٤٥٦٧-٨٩٠١-٢٣
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Chip tone="destructive" icon={AlertTriangle}>حساسية: بنسلين</Chip>
                <Chip tone="warning">سكري نوع ٢</Chip>
                <Chip>ضغط الدم</Chip>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Mini label="نبض" value="٧٢" />
            <Mini label="ضغط" value="١٢٠/٨٠" />
            <Mini label="حرارة" value="٣٦٫٧" />
          </div>
        </div>

        {/* Access reason — security */}
        <div className="mt-5 rounded-2xl border border-border bg-surface p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[12px] text-foreground">
              <Activity className="h-4 w-4 text-primary" />
              سبب فتح السجل (يُسجَّل في سجل الأمان):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["مراجعة", "إحالة", "طوارئ", "استشارة", "تنويم"].map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                    reason === r
                      ? "bg-foreground text-background"
                      : "border border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >{r}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Diagnosis & plan */}
        <div className="space-y-5">
          <Card title="التشخيص" icon={FileText}>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {["التهاب حاد", "متابعة سكري", "ارتفاع ضغط", "زكام موسمي"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setDiagnosis((d) => (d ? `${d}، ${s}` : s))}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
                  >+ {s}</button>
                ))}
              </div>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows={4}
                placeholder="اكتب التشخيص الأساسي والأعراض المصاحبة…"
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex items-start gap-2 rounded-xl bg-accent/40 p-3">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <p className="text-[11.5px] leading-relaxed text-foreground">
                  <span className="font-medium">اقتراح ذكي:</span> بناءً على الأعراض وتاريخ المريض،
                  يُنصح بفحص HbA1c وضغط الدم خلال هذه الزيارة.
                </p>
              </div>
            </div>
          </Card>

          <Card title="خطة العلاج" icon={Heart}>
            <textarea
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              rows={4}
              placeholder="الخطة العلاجية، الإرشادات، المتابعة المطلوبة…"
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <ActionTile icon={FlaskConical} label="طلب تحاليل" />
              <ActionTile icon={ScanLine} label="طلب أشعة" />
              <ActionTile icon={Send} label="إنشاء إحالة" />
            </div>
          </Card>

          <Card title="ملاحظات الطبيب" icon={FileText}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="ملاحظات خاصة بالزيارة…"
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4">
            <div className="text-[11px] text-muted-foreground">
              سيتم حفظ نسخة سابقة من السجل تلقائياً (لا يُسمح بالحذف النهائي).
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-[12px] text-foreground hover:bg-muted">
                <Save className="h-3.5 w-3.5" /> حفظ كمسودة
              </button>
              <button
                onClick={onPrescribe}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12px] font-medium text-primary-foreground hover:bg-primary-hover"
              >
                <Pill className="h-3.5 w-3.5" /> إنشاء وصفة
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right column — history */}
        <div className="space-y-5">
          <Card title="آخر التحاليل" icon={FlaskConical} action="عرض الكل">
            <div className="space-y-2">
              <MiniRow title="HbA1c" sub="٥٫٤٪ — طبيعي" date="١٢ أكتوبر" tone="success" />
              <MiniRow title="LDL" sub="١٣٨ mg/dL — مرتفع" date="١٢ أغسطس" tone="warning" />
              <MiniRow title="فيتامين D" sub="٢١ ng/mL — منخفض" date="٠٢ أكتوبر" tone="warning" />
            </div>
          </Card>

          <Card title="الوصفات الفعّالة" icon={Pill}>
            <div className="space-y-2">
              <MiniRow title="Metformin 500mg" sub="مرتين يومياً" date="١٢ يوم متبقي" tone="primary" />
              <MiniRow title="Vitamin D3" sub="مرة يومياً" date="٢٨ يوم متبقي" tone="primary" />
            </div>
          </Card>

          <Card title="الزيارات السابقة" icon={Clock}>
            <div className="space-y-2 text-[12px]">
              <div className="rounded-xl border border-border bg-background p-2.5">
                <div className="font-medium text-foreground">د. علي الكاظمي · باطنية</div>
                <div className="text-[11px] text-muted-foreground">متابعة سكري · ٢٨ أكتوبر</div>
              </div>
              <div className="rounded-xl border border-border bg-background p-2.5">
                <div className="font-medium text-foreground">د. ميسون الجبوري · عيون</div>
                <div className="text-[11px] text-muted-foreground">فحص دوري · ١٥ سبتمبر</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Chip({
  children, tone = "muted", icon: Icon,
}: {
  children: React.ReactNode;
  tone?: "destructive" | "warning" | "muted";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const cls = {
    destructive: "bg-destructive/10 text-destructive",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    muted: "bg-muted text-muted-foreground",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium ${cls}`}>
      {Icon && <Icon className="h-3 w-3" />}{children}
    </span>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-[14px] font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Card({
  title, icon: Icon, action, children,
}: {
  title: string; icon: React.ComponentType<{ className?: string }>;
  action?: string; children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-5">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-primary">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
        </div>
        {action && (
          <button className="text-[11px] font-medium text-primary hover:underline">{action}</button>
        )}
      </div>
      {children}
    </section>
  );
}

function ActionTile({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-[12px] text-foreground transition hover:border-border-strong hover:bg-muted">
      <Icon className="h-3.5 w-3.5 text-primary" />
      {label}
    </button>
  );
}

function MiniRow({
  title, sub, date, tone,
}: { title: string; sub: string; date: string; tone: "success" | "warning" | "primary" }) {
  const dot = {
    success: "bg-success",
    warning: "bg-amber-500",
    primary: "bg-primary",
  }[tone];
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background p-2.5">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium text-foreground truncate">{title}</div>
        <div className="text-[10.5px] text-muted-foreground truncate">{sub}</div>
      </div>
      <div className="text-[10.5px] text-muted-foreground">{date}</div>
    </div>
  );
}

/* =================== Prescribe =================== */

type Med = {
  id: number;
  name: string;
  dose: string;
  freq: string;
  duration: string;
  notes?: string;
  warning?: string;
};

function Prescribe({ onBack }: { onBack: () => void }) {
  const [meds, setMeds] = useState<Med[]>([
    { id: 1, name: "Metformin 500mg", dose: "قرص واحد", freq: "مرتين يومياً", duration: "٣٠ يوم" },
  ]);
  const [query, setQuery] = useState("");

  const suggestions = ["Amoxicillin 875mg", "Ibuprofen 400mg", "Paracetamol 500mg", "Atorvastatin 20mg", "Losartan 50mg", "Omeprazole 20mg"];
  const filtered = query
    ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : suggestions.slice(0, 4);

  const addMed = (name: string) => {
    // simulate AI warning for penicillin allergy
    const warning =
      name.toLowerCase().includes("amoxicillin")
        ? "تحذير: المريض لديه حساسية من البنسلين — قد يحدث تفاعل خطير."
        : undefined;
    setMeds((m) => [
      ...m,
      { id: Date.now(), name, dose: "قرص واحد", freq: "مرة يومياً", duration: "٧ أيام", warning },
    ]);
    setQuery("");
  };

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5 rotate-180" /> العودة للسجل
      </button>

      <section className="rounded-3xl border border-border bg-gradient-to-br from-surface to-accent/30 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">إنشاء وصفة طبية جديدة</h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              المريض: أحمد محمد · ١٢-٤٥٦٧-٨٩٠١-٢٣
            </p>
          </div>
          <div className="rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] text-muted-foreground">
            رقم الوصفة: <span className="text-foreground font-medium">RX-2026-{Math.floor(Math.random()*9000+1000)}</span>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          {/* Search */}
          <Card title="إضافة دواء" icon={Plus}>
            <div className="relative">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث عن دواء بالاسم العلمي أو التجاري…"
                  className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {filtered.map((s) => (
                  <button
                    key={s}
                    onClick={() => addMed(s)}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-foreground hover:border-primary hover:bg-accent"
                  >
                    <Plus className="h-3 w-3 text-primary" /> {s}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Med list */}
          <section className="space-y-3">
            {meds.map((m, idx) => (
              <div key={m.id} className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
                      <Pill className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-foreground">{m.name}</div>
                      <div className="text-[10.5px] text-muted-foreground">دواء #{idx + 1}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMeds((all) => all.filter((x) => x.id !== m.id))}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <DoseField label="الجرعة" value={m.dose} onChange={(v) => updateMed(setMeds, m.id, { dose: v })} />
                  <DoseField label="التكرار" value={m.freq} onChange={(v) => updateMed(setMeds, m.id, { freq: v })} />
                  <DoseField label="المدة" value={m.duration} onChange={(v) => updateMed(setMeds, m.id, { duration: v })} />
                </div>

                <input
                  placeholder="ملاحظات للصيدلي أو المريض…"
                  value={m.notes ?? ""}
                  onChange={(e) => updateMed(setMeds, m.id, { notes: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

                {m.warning && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <div className="flex-1">
                      <div className="text-[12px] font-medium text-destructive">{m.warning}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        يُنصح باختيار بديل غير بنسليني (مثلاً Azithromycin).
                      </div>
                    </div>
                    <button
                      onClick={() => updateMed(setMeds, m.id, { warning: undefined })}
                      className="grid h-7 w-7 place-items-center rounded-lg text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {meds.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-[12px] text-muted-foreground">
                لم تتم إضافة أي دواء بعد.
              </div>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside className="space-y-5">
          <Card title="فحوصات السلامة" icon={Sparkles}>
            <div className="space-y-2">
              <CheckRow ok label="فحص الحساسية" />
              <CheckRow ok label="فحص التداخلات الدوائية" />
              <CheckRow ok label="فحص الجرعات غير الطبيعية" />
              <CheckRow ok label="فحص الصرف المكرر" />
            </div>
          </Card>

          <Card title="تفاصيل الوصفة" icon={FileText}>
            <div className="space-y-2 text-[12px]">
              <Row k="الطبيب" v="د. سارة العبيدي" />
              <Row k="التخصص" v="طب الأسرة" />
              <Row k="المؤسسة" v="مستشفى بغداد التعليمي" />
              <Row k="تاريخ الإصدار" v="١٨ مايو ٢٠٢٦" />
              <Row k="صالحة حتى" v="١٨ يونيو ٢٠٢٦" />
              <Row k="عدد الأدوية" v={`${meds.length}`} />
            </div>
          </Card>

          <div className="space-y-2">
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[13px] font-medium text-primary-foreground hover:bg-primary-hover">
              <CheckCircle2 className="h-4 w-4" /> إصدار الوصفة وإرسالها للصيدلية
            </button>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-[13px] text-foreground hover:bg-muted">
              <Save className="h-4 w-4" /> حفظ كمسودة
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function updateMed(setter: React.Dispatch<React.SetStateAction<Med[]>>, id: number, patch: Partial<Med>) {
  setter((all) => all.map((m) => (m.id === id ? { ...m, ...patch } : m)));
}

function DoseField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[12px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function CheckRow({ ok, label }: { ok?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-2.5">
      <span className={`grid h-6 w-6 place-items-center rounded-full ${ok ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>
        {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
      </span>
      <span className="flex-1 text-[12px] text-foreground">{label}</span>
      <span className="text-[10.5px] text-muted-foreground">{ok ? "تم" : "انتبه"}</span>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-foreground">{v}</span>
    </div>
  );
}
