import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Activity, FileText, FlaskConical, ScanLine, Pill, Send, Download,
  Calendar, Bell, ShieldCheck, ChevronLeft, Search, Heart, Droplet,
  AlertTriangle, Syringe, Users, Eye, Clock, ArrowUpRight, Plus,
  Stethoscope, FileDown, CheckCircle2, LogOut,
} from "lucide-react";
import { store, useStore, downloadHealthRecord } from "@/lib/app-store";
import { BookAppointmentDialog, NewReferralDialog, NotificationsBell } from "@/components/app-dialogs";

export const Route = createFileRoute("/citizen")({
  component: CitizenDashboard,
  head: () => ({
    meta: [
      { title: "لوحة المواطن | UR-SEHR" },
      { name: "description", content: "السجل الصحي الذكي للمواطن: التحاليل، الأشعة، الوصفات، والإحالات." },
    ],
  }),
});

type TabId = "overview" | "labs" | "imaging" | "prescriptions" | "referrals" | "vaccines" | "security";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "نظرة عامة", icon: Activity },
  { id: "labs", label: "التحاليل", icon: FlaskConical },
  { id: "imaging", label: "الأشعة", icon: ScanLine },
  { id: "prescriptions", label: "الوصفات", icon: Pill },
  { id: "referrals", label: "الإحالات", icon: Send },
  { id: "vaccines", label: "التطعيمات", icon: Syringe },
  { id: "security", label: "سجل الأمان", icon: ShieldCheck },
];

function CitizenDashboard() {
  const [tab, setTab] = useState<TabId>("overview");
  const [bookOpen, setBookOpen] = useState(false);
  const [refOpen, setRefOpen] = useState(false);
  const session = useStore((s) => s.session);
  const appointments = useStore((s) => s.appointments);
  const referrals = useStore((s) => s.referrals);
  const me = { name: session?.name ?? "أحمد محمد", id: session?.healthId ?? "12-4567-8901-23" };

  const download = () => {
    downloadHealthRecord(me.name, me.id);
    toast.success("تم تجهيز نسخة من السجل");
  };

  return (
    <div className="ambient-bg min-h-screen" dir="rtl">
      <TopBar onDownload={download} />

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-6 lg:px-8">
        <Greeting onBook={() => setBookOpen(true)} onDownload={download} />

        {/* Tab Pills */}
        <div className="mt-7 -mx-1 overflow-x-auto">
          <div className="flex min-w-max gap-1.5 rounded-2xl border border-border bg-surface/80 p-1.5 backdrop-blur">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-medium transition ${
                    active
                      ? "bg-foreground text-background shadow-[var(--shadow-soft)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7">
          {tab === "overview" && <Overview onBook={() => setBookOpen(true)} onReferral={() => setRefOpen(true)} onDownload={download} appointments={appointments} referrals={referrals} />}
          {tab === "labs" && <Labs />}
          {tab === "imaging" && <Imaging />}
          {tab === "prescriptions" && <Prescriptions />}
          {tab === "referrals" && <Referrals onNew={() => setRefOpen(true)} />}
          {tab === "vaccines" && <Vaccines />}
          {tab === "security" && <Security />}
        </div>
      </div>

      <BookAppointmentDialog open={bookOpen} onClose={() => setBookOpen(false)} patient={me} />
      <NewReferralDialog open={refOpen} onClose={() => setRefOpen(false)} patient={me} />
    </div>
  );
}

/* =================== Top Bar =================== */

function TopBar({ onDownload }: { onDownload: () => void }) {
  const navigate = useNavigate();
  const session = useStore((s) => s.session);
  const logout = () => {
    store.logout();
    toast.success("تم تسجيل الخروج");
    navigate({ to: "/" });
  };
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3.5 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background">
            <Heart className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-foreground">UR-SEHR</div>
            <div className="text-[10px] text-muted-foreground">لوحة المواطن</div>
          </div>
        </Link>

        <div className="hidden flex-1 max-w-md md:block">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="ابحث في سجلك الصحي…"
              className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={onDownload} className="hidden items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-[12px] text-foreground hover:bg-muted md:inline-flex">
            <FileDown className="h-3.5 w-3.5" /> تحميل
          </button>
          <NotificationsBell role="citizen" />
          <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-[12px] text-foreground hover:bg-muted">
            <LogOut className="h-3.5 w-3.5" /> خروج
          </button>
          <Avatar name={session?.name} />
        </div>
      </div>
    </header>
  );
}

function Avatar({ name }: { name?: string }) {
  const display = name ?? "أحمد محمد";
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-[12px] font-semibold text-primary-foreground">
        {display.slice(0, 1)}
      </div>
      <div className="hidden leading-tight md:block">
        <div className="text-[12px] font-medium text-foreground">{display}</div>
        <div className="text-[10px] text-muted-foreground">١٢-٤٥٦٧-٨٩٠١-٢٣</div>
      </div>
    </div>
  );
}

/* =================== Greeting + Vitals =================== */

function Greeting({ onBook, onDownload }: { onBook: () => void; onDownload: () => void }) {
  const session = useStore((s) => s.session);
  const name = session?.name?.split(" ")[0] ?? "أحمد";
  return (
    <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-accent/40 p-6 md:p-8">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> متصل · مزامنة فورية
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          مساء الخير، {name}
        </h1>
        <p className="mt-2 max-w-md text-[14px] text-muted-foreground">
          سجلّك الصحي محدّث. لديك <span className="text-foreground font-medium">٣ تنبيهات ذكية</span> ووصفة فعّالة واحدة.
        </p>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <button onClick={onBook} className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-[13px] font-medium text-background hover:opacity-90">
            <Calendar className="h-4 w-4" /> حجز موعد
          </button>
          <button onClick={onDownload} className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted">
            <FileDown className="h-4 w-4" /> تحميل نسخة من السجل
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[13px] font-semibold text-foreground">المعطيات الحيوية</div>
          <span className="text-[11px] text-muted-foreground">آخر قياس · اليوم ٠٩:٢١</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Vital icon={Heart} label="النبض" value="٧٢" unit="bpm" tone="primary" />
          <Vital icon={Activity} label="ضغط الدم" value="١٢٠/٨٠" unit="mmHg" tone="success" />
          <Vital icon={Droplet} label="فصيلة الدم" value="O+" unit="" tone="destructive" />
          <Vital icon={AlertTriangle} label="الحساسية" value="بنسلين" unit="" tone="warning" />
        </div>
      </div>
    </section>
  );
}

function Vital({
  icon: Icon, label, value, unit, tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; unit: string;
  tone: "primary" | "success" | "destructive" | "warning";
}) {
  const toneClass = {
    primary: "bg-accent text-primary",
    success: "bg-success/10 text-success",
    destructive: "bg-destructive/10 text-destructive",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  }[tone];
  return (
    <div className="rounded-2xl border border-border bg-background p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className={`grid h-7 w-7 place-items-center rounded-lg ${toneClass}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-xl font-semibold tracking-tight text-foreground">{value}</span>
        {unit && <span className="text-[11px] text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

/* =================== Overview =================== */

function Overview({
  onBook, onReferral, onDownload, appointments, referrals,
}: {
  onBook: () => void; onReferral: () => void; onDownload: () => void;
  appointments: Array<{ id: string; doctor: string; spec: string; facility: string; reason: string; date: string }>;
  referrals: Array<{ id: string; to: string; reason: string; urgency: string }>;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Panel title="تنبيهات ذكية" hint="مدعومة بالذكاء الاصطناعي">
          <div className="space-y-2.5">
            <Alert tone="warning" title="موعد فحص الأسنان متأخر" desc="آخر مراجعة قبل ١٤ شهراً — يُنصح بمراجعة عيادة الأسنان." />
            <Alert tone="primary" title="جرعة لقاح الإنفلونزا الموسمي" desc="ينصح بأخذ الجرعة قبل ٣٠ نوفمبر." />
            <Alert tone="success" title="تحليل سكر تراكمي ضمن الطبيعي" desc="HbA1c = 5.4٪ — استمر على نمط حياتك الحالي." />
          </div>
        </Panel>

        {appointments.length > 0 && (
          <Panel title="مواعيدك القادمة">
            <div className="space-y-2">
              {appointments.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-foreground truncate">{a.doctor} — {a.spec}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{a.facility} · {a.reason}</div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{new Date(a.date).toLocaleString("ar")}</span>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {referrals.length > 0 && (
          <Panel title="إحالاتك الأخيرة">
            <div className="space-y-2">
              {referrals.slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
                    <Send className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-foreground truncate">{r.to}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{r.reason}</div>
                  </div>
                  <span className="rounded-full bg-accent px-2 py-1 text-[10px] text-primary">{r.urgency}</span>
                </div>
              ))}
            </div>
          </Panel>
        )}

        <Panel title="الزيارات الأخيرة" action="عرض الكل">
          <div className="divide-y divide-border">
            {[
              { date: "اليوم", doctor: "د. سارة العبيدي", spec: "طب الأسرة", hosp: "مستشفى بغداد التعليمي" },
              { date: "أمس", doctor: "د. علي الكاظمي", spec: "أمراض الباطنية", hosp: "مركز الكرخ الصحي" },
              { date: "قبل ٣ أيام", doctor: "د. ميسون الجبوري", spec: "طب العيون", hosp: "مستشفى ابن الهيثم" },
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-3 py-3.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-foreground">{v.doctor}</div>
                  <div className="text-[11px] text-muted-foreground">{v.spec} · {v.hosp}</div>
                </div>
                <span className="text-[11px] text-muted-foreground">{v.date}</span>
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="space-y-5">
        <Panel title="الأسرة" action="إدارة">
          <div className="space-y-2.5">
            {[
              { n: "فاطمة (الزوجة)", a: "٣٤ سنة" },
              { n: "يوسف (الابن)", a: "٨ سنوات · لقاح قادم" },
              { n: "نور (الابنة)", a: "٥ سنوات" },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background p-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                  {m.n[0]}
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-medium text-foreground">{m.n}</div>
                  <div className="text-[10px] text-muted-foreground">{m.a}</div>
                </div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="إجراءات سريعة">
          <div className="grid grid-cols-2 gap-2">
            <Quick icon={Download} label="نسخة PDF" onClick={onDownload} />
            <Quick icon={Calendar} label="حجز موعد" onClick={onBook} />
            <Quick icon={Send} label="إحالة جديدة" onClick={onReferral} />
            <Quick icon={ShieldCheck} label="سجل الأمان" />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Alert({ tone, title, desc }: { tone: "primary" | "warning" | "success"; title: string; desc: string }) {
  const tones = {
    primary: "border-primary/20 bg-accent",
    warning: "border-amber-500/20 bg-amber-50 dark:bg-amber-500/5",
    success: "border-success/20 bg-success/5",
  }[tone];
  const dotTone = { primary: "bg-primary", warning: "bg-amber-500", success: "bg-success" }[tone];
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3.5 ${tones}`}>
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotTone}`} />
      <div className="flex-1">
        <div className="text-[13px] font-medium text-foreground">{title}</div>
        <div className="mt-0.5 text-[11.5px] text-muted-foreground">{desc}</div>
      </div>
      <button className="text-[11px] text-muted-foreground hover:text-foreground">تفاصيل</button>
    </div>
  );
}

function Quick({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-start gap-2 rounded-xl border border-border bg-background p-3 text-right transition hover:border-border-strong hover:bg-muted">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-[12px] font-medium text-foreground">{label}</span>
    </button>
  );
}

/* =================== Tab Content =================== */

function Panel({
  title, action, hint, children,
}: { title: string; action?: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-semibold text-foreground">{title}</h2>
          {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
        </div>
        {action && (
          <button className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline">
            {action} <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function ListRow({
  icon: Icon, title, sub, meta, status,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string; sub: string; meta: string;
  status?: { label: string; tone: "success" | "warning" | "primary" | "muted" };
}) {
  const toneMap = {
    success: "bg-success/10 text-success",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    primary: "bg-accent text-primary",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3.5 transition hover:border-border-strong">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-foreground truncate">{title}</div>
        <div className="text-[11px] text-muted-foreground truncate">{sub}</div>
      </div>
      <div className="hidden text-[11px] text-muted-foreground sm:block">{meta}</div>
      {status && (
        <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium ${toneMap[status.tone]}`}>
          {status.label}
        </span>
      )}
      <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Labs() {
  return (
    <Panel title="نتائج التحاليل" action="تصفية">
      <div className="space-y-2.5">
        <ListRow icon={FlaskConical} title="فحص الدم الشامل (CBC)" sub="مختبر بغداد المركزي · د. حسن عبد الله" meta="١٥ أكتوبر ٢٠٢٦" status={{ label: "طبيعي", tone: "success" }} />
        <ListRow icon={FlaskConical} title="سكر تراكمي HbA1c" sub="٥٫٤٪ — ضمن المعدل الطبيعي" meta="١٢ أكتوبر ٢٠٢٦" status={{ label: "طبيعي", tone: "success" }} />
        <ListRow icon={FlaskConical} title="فيتامين D" sub="٢١ ng/mL — منخفض قليلاً" meta="٠٢ أكتوبر ٢٠٢٦" status={{ label: "منخفض", tone: "warning" }} />
        <ListRow icon={FlaskConical} title="وظائف الكبد" sub="ALT/AST ضمن النطاق" meta="٢٠ سبتمبر ٢٠٢٦" status={{ label: "طبيعي", tone: "success" }} />
        <ListRow icon={FlaskConical} title="الكوليسترول" sub="LDL مرتفع قليلاً — ١٣٨ mg/dL" meta="١٢ أغسطس ٢٠٢٦" status={{ label: "مراجعة", tone: "warning" }} />
      </div>
    </Panel>
  );
}

function Imaging() {
  return (
    <Panel title="الأشعة والتصوير" action="رفع جديد">
      <div className="grid gap-2.5 md:grid-cols-2">
        <ListRow icon={ScanLine} title="أشعة صدر — X-Ray" sub="د. ميسون الجبوري · لا توجد ملاحظات مرضية" meta="١٠ أكتوبر" status={{ label: "جاهز", tone: "success" }} />
        <ListRow icon={ScanLine} title="رنين مغناطيسي — الركبة" sub="مركز الأشعة التشخيصية" meta="٢٢ سبتمبر" status={{ label: "جاهز", tone: "success" }} />
        <ListRow icon={ScanLine} title="إيكو القلب" sub="وظائف القلب طبيعية" meta="١٤ سبتمبر" status={{ label: "جاهز", tone: "success" }} />
        <ListRow icon={ScanLine} title="أشعة بطن — Ultrasound" sub="بانتظار تقرير الطبيب" meta="اليوم" status={{ label: "قيد التقرير", tone: "warning" }} />
      </div>
    </Panel>
  );
}

function Prescriptions() {
  return (
    <Panel title="الوصفات الطبية" action="جميع الوصفات">
      <div className="space-y-2.5">
        <PrescriptionCard active title="Metformin 500mg" doctor="د. علي الكاظمي" dose="قرص واحد مرتين يومياً" until="ينتهي خلال ١٢ يوماً" pharmacy="صيدلية الرشيد" />
        <PrescriptionCard active title="Vitamin D3 5000 IU" doctor="د. سارة العبيدي" dose="قرص واحد يومياً" until="ينتهي خلال ٢٨ يوماً" pharmacy="لم تُصرف بعد" />
        <PrescriptionCard title="Amoxicillin 875mg" doctor="د. حسن عبد الله" dose="قرص كل ١٢ ساعة لـ ٧ أيام" until="منتهية" pharmacy="صيدلية الكرخ" />
      </div>
    </Panel>
  );
}

function PrescriptionCard({
  title, doctor, dose, until, pharmacy, active,
}: { title: string; doctor: string; dose: string; until: string; pharmacy: string; active?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${active ? "border-primary/30 bg-accent/40" : "border-border bg-background"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            <Pill className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-foreground">{title}</div>
            <div className="mt-0.5 text-[11.5px] text-muted-foreground">{doctor} · {dose}</div>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium ${active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
          {active ? "فعّالة" : "منتهية"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {until}</span>
        <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> {pharmacy}</span>
      </div>
    </div>
  );
}

function Referrals({ onNew }: { onNew: () => void }) {
  const referrals = useStore((s) => s.referrals);
  return (
    <Panel title="الإحالات" action="إحالة جديدة">
      <div className="space-y-2.5">
        <button onClick={onNew} className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-border bg-background px-3 py-2 text-[12px] text-foreground hover:border-primary hover:bg-accent/40">
          <Plus className="h-3.5 w-3.5 text-primary" /> إنشاء إحالة جديدة
        </button>
        {referrals.map((r) => (
          <ListRow key={r.id} icon={Send} title={`إلى: ${r.to}`} sub={`${r.from} · ${r.reason}`} meta={new Date(r.at).toLocaleDateString("ar")} status={{ label: r.status === "pending" ? "قيد الانتظار" : "مكتملة", tone: r.status === "pending" ? "warning" : "success" }} />
        ))}
        <ListRow icon={Send} title="إحالة إلى استشاري القلب" sub="من د. سارة العبيدي → د. محمد الزبيدي · مستعجلة" meta="اليوم" status={{ label: "قيد الانتظار", tone: "warning" }} />
        <ListRow icon={Send} title="إحالة لطب الأسنان" sub="فحص دوري" meta="قبل أسبوع" status={{ label: "مكتملة", tone: "success" }} />
      </div>
    </Panel>
  );
}

function Vaccines() {
  return (
    <Panel title="سجل التطعيمات" action="جدول كامل">
      <div className="space-y-2.5">
        <ListRow icon={Syringe} title="إنفلونزا موسمية ٢٠٢٦" sub="مركز الكرخ الصحي" meta="موعد قادم · ٢٠ نوفمبر" status={{ label: "مستحقة", tone: "warning" }} />
        <ListRow icon={Syringe} title="كوفيد-١٩ (جرعة منشطة)" sub="فايزر · المركز الوطني" meta="مارس ٢٠٢٦" status={{ label: "مكتملة", tone: "success" }} />
        <ListRow icon={Syringe} title="التيتانوس Tdap" sub="جرعة معززة" meta="٢٠٢٤" status={{ label: "مكتملة", tone: "success" }} />
      </div>
    </Panel>
  );
}

function Security() {
  return (
    <Panel title="سجل الوصول والأمان" hint="كل عملية فتح لسجلك تظهر هنا — مع السبب والمؤسسة">
      <div className="space-y-2.5">
        {[
          { who: "د. سارة العبيدي", role: "طب الأسرة", hosp: "مستشفى بغداد", time: "اليوم ١٠:١٤", reason: "مراجعة" },
          { who: "صيدلية الرشيد", role: "صيدلي", hosp: "فرع الكرادة", time: "أمس ١٧:٣٢", reason: "صرف وصفة" },
          { who: "د. علي الكاظمي", role: "أمراض باطنية", hosp: "مركز الكرخ", time: "٠٢ نوفمبر", reason: "استشارة" },
          { who: "مختبر بغداد", role: "تقني مختبر", hosp: "المختبر المركزي", time: "٢٨ أكتوبر", reason: "رفع نتيجة" },
        ].map((e, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
              <Eye className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-foreground">{e.who}</div>
              <div className="text-[11px] text-muted-foreground">{e.role} · {e.hosp} · سبب: {e.reason}</div>
            </div>
            <span className="text-[11px] text-muted-foreground">{e.time}</span>
            <button className="text-[11px] font-medium text-destructive hover:underline">إبلاغ</button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
