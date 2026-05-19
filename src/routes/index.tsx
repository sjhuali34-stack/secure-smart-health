import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  User, Stethoscope, Pill, HeartPulse, FlaskConical, ScanLine,
  Activity, Building2, ShieldCheck, Fingerprint, ScanFace, KeyRound,
  CreditCard, ArrowLeft, Globe, Lock, HeartHandshake, Dumbbell,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LoginPortal,
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | UR-SEHR" },
      { name: "description", content: "بوابة الدخول الموحدة لمنصة اور الصحية الوطنية." },
    ],
  }),
});

type Role = {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  to: "/citizen" | "/doctor" | "/pharmacist" | "/nurse" | "/lab" | "/radiology" | "/emergency" | "/ministry" | "/community" | "/physio";
};

const ROLES: Role[] = [
  { id: "citizen", name: "المواطن", desc: "السجل الصحي الشخصي", icon: User, to: "/citizen" },
  { id: "doctor", name: "الطبيب", desc: "التشخيص والوصفات", icon: Stethoscope, to: "/doctor" },
  { id: "pharmacist", name: "الصيدلي", desc: "صرف الأدوية", icon: Pill, to: "/pharmacist" },
  { id: "nurse", name: "التمريض", desc: "العلامات الحيوية", icon: HeartPulse, to: "/nurse" },
  { id: "lab", name: "المختبر", desc: "نتائج التحاليل", icon: FlaskConical, to: "/lab" },
  { id: "radiology", name: "الأشعة", desc: "التصوير والتقارير", icon: ScanLine, to: "/radiology" },
  { id: "emergency", name: "الطوارئ", desc: "الوصول الإسعافي", icon: Activity, to: "/emergency" },
  { id: "ministry", name: "وزارة الصحة", desc: "اللوحة الوطنية", icon: Building2, to: "/ministry" },
  { id: "community", name: "صحة المجتمع", desc: "زيارات وحملات", icon: HeartHandshake, to: "/community" },
  { id: "physio", name: "العلاج الطبيعي", desc: "جلسات التأهيل", icon: Dumbbell, to: "/physio" },
];

type Method = { id: string; name: string; icon: React.ComponentType<{ className?: string }> };

const METHODS: Method[] = [
  { id: "nfc", name: "البطاقة الوطنية NFC", icon: CreditCard },
  { id: "fingerprint", name: "بصمة الإصبع", icon: Fingerprint },
  { id: "face", name: "بصمة الوجه", icon: ScanFace },
  { id: "otp", name: "رمز OTP", icon: KeyRound },
];

function LoginPortal() {
  const [role, setRole] = useState<string>("citizen");
  const [method, setMethod] = useState<string>("nfc");
  const selectedRole = ROLES.find((r) => r.id === role)!;
  const isProfessional = !["citizen", "emergency"].includes(role);

  return (
    <div className="ambient-bg relative min-h-screen overflow-hidden" dir="rtl">
      <div className="pointer-events-none absolute inset-0 grid-faint" />

      {/* Top Bar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight text-foreground">UR-SEHR</div>
            <div className="text-[11px] text-muted-foreground">منصة اور الصحية الوطنية</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1.5 backdrop-blur transition hover:border-border-strong">
            <Globe className="h-3.5 w-3.5" /> العربية
          </button>
          <span className="hidden items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1.5 backdrop-blur md:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            اتصال مشفّر
          </span>
        </div>
      </header>

      {/* Main */}
      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-12">
        {/* Hero */}
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            النظام الوطني الموحّد للسجلات الصحية
          </span>

          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
            صحّتك،
            <br />
            <span className="text-primary">في مكان واحد آمن.</span>
          </h1>

          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            بوّابة دخول موحّدة للمواطنين والكوادر الطبية والجهات الصحية.
            سجلّ صحي ذكي، وصفات، تطعيمات، وإحالات — مترابطة على المستوى الوطني.
          </p>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
            <Stat value="٣٢M" label="مواطن مسجَّل" />
            <Stat value="٤٫٢K" label="منشأة صحية" />
            <Stat value="٩٩٫٩٪" label="جاهزية النظام" />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <Badge icon={Lock} label="تشفير من طرف إلى طرف" />
            <Badge icon={ShieldCheck} label="وزارة الصحة" />
            <Badge icon={Activity} label="دعم وضع الطوارئ" />
          </div>
        </div>

        {/* Card */}
        <div className="relative">
          <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-primary/15 via-transparent to-transparent blur-xl" aria-hidden />
          <div className="relative rounded-[24px] border border-border bg-surface/90 p-7 shadow-[var(--shadow-elevated)] backdrop-blur-xl md:p-9">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">تسجيل الدخول</h2>
                <p className="mt-1 text-xs text-muted-foreground">اختر دورك ثم طريقة التحقق</p>
              </div>
              <div className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                v1.0 · آمن
              </div>
            </div>

            {/* Role grid */}
            <div className="mb-6">
              <Label>الدور</Label>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const active = role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`group flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition ${
                        active
                          ? "border-primary bg-accent text-accent-foreground shadow-[var(--shadow-soft)]"
                          : "border-border bg-background hover:border-border-strong hover:bg-muted"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-[11px] font-medium leading-tight text-foreground">{r.name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                مُحدَّد: <span className="text-foreground">{selectedRole.name}</span> — {selectedRole.desc}
              </p>
            </div>

            {/* Method tabs */}
            <div className="mb-5">
              <Label>طريقة التحقق</Label>
              <div className="mt-2 grid grid-cols-4 gap-1.5 rounded-xl bg-muted p-1">
                {METHODS.map((m) => {
                  const Icon = m.icon;
                  const active = method === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-[10.5px] font-medium transition ${
                        active
                          ? "bg-surface text-foreground shadow-[var(--shadow-soft)]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="leading-tight">{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <Field
                label="الرقم الصحي الوطني"
                placeholder="١٢ - XXXX - XXXX - XX"
              />
              {isProfessional && (
                <Field
                  label="رقم البطاقة المهنية"
                  placeholder="MED - XXXX - XXXX"
                />
              )}
              <MethodPrompt method={method} />
            </div>

            <Link
              to={selectedRole.to}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-[14px] font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:bg-primary-hover"
            >
              متابعة
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="mt-5 flex items-center justify-between text-[11px]">
              <button className="text-muted-foreground hover:text-foreground">نسيت رقمك الصحي؟</button>
              <button className="text-primary hover:underline">تسجيل جديد للمواطنين</button>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-success" />
              يتم تسجيل كل عمليات الدخول وعرضها لك في سجل الأمان.
            </div>
          </div>

          {/* Emergency strip */}
          <button className="mt-4 flex w-full items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-3.5 text-right transition hover:bg-destructive/10">
            <div>
              <div className="text-[13px] font-semibold text-destructive">وضع الطوارئ الإسعافي</div>
              <div className="text-[11px] text-muted-foreground">عرض البيانات الحيوية فقط — دون كلمة مرور</div>
            </div>
            <Activity className="h-5 w-5 text-destructive" />
          </button>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border bg-surface/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-[11px] text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} منصة اور الصحية الوطنية — UR-SEHR</div>
          <div className="flex items-center gap-4">
            <a className="hover:text-foreground" href="#">سياسة الخصوصية</a>
            <a className="hover:text-foreground" href="#">شروط الاستخدام</a>
            <a className="hover:text-foreground" href="#">الدعم</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ----- helpers ----- */

function Logo() {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-foreground text-background shadow-[var(--shadow-soft)]">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-4.5-7-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-7 11-7 11" opacity=".25" />
        <path d="M3 12h4l2-3 3 6 2-3h7" />
      </svg>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{children}</div>;
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        placeholder={placeholder}
        dir="ltr"
      />
    </label>
  );
}

function MethodPrompt({ method }: { method: string }) {
  const map: Record<string, { icon: React.ComponentType<{ className?: string }>; title: string; hint: string }> = {
    nfc: { icon: CreditCard, title: "قرّب البطاقة من القارئ", hint: "ضع البطاقة الوطنية بالقرب من جهازك" },
    fingerprint: { icon: Fingerprint, title: "ضع إصبعك على المستشعر", hint: "تأكّد من نظافة المستشعر والإصبع" },
    face: { icon: ScanFace, title: "انظر إلى الكاميرا", hint: "أبقِ وجهك داخل الإطار في إضاءة جيدة" },
    otp: { icon: KeyRound, title: "رمز التحقق المرسل لهاتفك", hint: "تم إرسال رمز مكوّن من ٦ أرقام" },
  };
  const { icon: Icon, title, hint } = map[method];
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-background px-4 py-3">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-medium text-foreground">{title}</div>
        <div className="text-[11px] text-muted-foreground">{hint}</div>
      </div>
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:120ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:240ms]" />
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/70 px-4 py-3 backdrop-blur">
      <div className="text-xl font-semibold tracking-tight text-foreground">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function Badge({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-primary" />
      {label}
    </span>
  );
}
