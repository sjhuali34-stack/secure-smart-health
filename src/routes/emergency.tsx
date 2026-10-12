import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity, Ambulance, Bed, AlertTriangle, Users, Siren, Heart, MapPin, Plus, Minus, Hospital,
} from "lucide-react";
import { toast } from "sonner";
import { RoleShell, Card, Stat, Row } from "@/components/role-shell";
import { store } from "@/lib/app-store";

export const Route = createFileRoute("/emergency")({
  component: EmergencyDashboard,
  head: () => ({
    meta: [
      { title: "الطوارئ | UR-SEHR" },
      { name: "description", content: "وحدة الطوارئ — فرز وتتبع الحالات." },
    ],
  }),
});

const TABS = [
  { id: "triage", label: "الفرز", icon: Siren },
  { id: "ambulance", label: "سيارات الإسعاف", icon: Ambulance },
  { id: "beds", label: "الأسرّة", icon: Bed },
  { id: "disaster", label: "وضع الكوارث", icon: AlertTriangle },
];

function EmergencyDashboard() {
  const [tab, setTab] = useState("triage");
  return (
    <RoleShell
      icon={Activity}
      title="وحدة الطوارئ"
      subtitle="المستشفى المركزي · غرفة الفرز — مناوبة 24/7"
      tabs={TABS}
      active={tab}
      onTab={setTab}
      roleId="emergency"
      reportKind="تقرير طوارئ"
    >
      {tab === "triage" && (
        <>
          <div className="mb-4 grid gap-4 md:grid-cols-4">
            <Stat icon={Users} label="حالات الآن" value="18" />
            <Stat icon={Heart} label="حرجة" value="3" tone="danger" />
            <Stat icon={AlertTriangle} label="عاجلة" value="7" tone="warn" />
            <Stat icon={Bed} label="أسرّة شاغرة" value="5" tone="success" />
          </div>
          <Card>
            <Row title="ER-901 — ذكر، 54 سنة" meta="ألم صدري · ECG غير طبيعي" status="أحمر" statusTone="danger" />
            <Row title="ER-902 — أنثى، 32 سنة" meta="حادث مروري · كسور متعددة" status="أحمر" statusTone="danger" />
            <Row title="ER-903 — ذكر، 8 سنوات" meta="ربو حاد · SpO₂ 89%" status="برتقالي" statusTone="warn" />
            <Row title="ER-904 — أنثى، 67 سنة" meta="دوار وارتفاع ضغط" status="أصفر" statusTone="warn" />
            <Row title="ER-905 — ذكر، 25 سنة" meta="جرح سطحي باليد" status="أخضر" statusTone="success" />
          </Card>
        </>
      )}
      {tab === "ambulance" && (
        <Card>
          <Row title="AMB-12 · حي الجامعة" meta="ETA 4د · حالة قلبية · المستشفى المركزي" status="قادمة" statusTone="danger" />
          <Row title="AMB-07 · شارع النصر" meta="ETA 11د · حادث مروري" status="قادمة" statusTone="warn" />
          <Row title="AMB-15 · المستشفى" meta="متاحة الآن" status="متاحة" statusTone="success" />
          <div className="mt-4 grid h-56 place-items-center rounded-xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> خريطة التتبع المباشر</div>
          </div>
        </Card>
      )}
      {tab === "beds" && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card><div className="text-xs text-muted-foreground">العناية المركزة</div><div className="mt-2 text-3xl font-semibold">9/12</div><div className="mt-1 text-[11px] text-muted-foreground">75% إشغال</div></Card>
          <Card><div className="text-xs text-muted-foreground">طوارئ بالغين</div><div className="mt-2 text-3xl font-semibold">15/20</div><div className="mt-1 text-[11px] text-muted-foreground">75% إشغال</div></Card>
          <Card><div className="text-xs text-muted-foreground">طوارئ أطفال</div><div className="mt-2 text-3xl font-semibold">4/10</div><div className="mt-1 text-[11px] text-success">متاح</div></Card>
        </div>
      )}
      {tab === "disaster" && <DisasterMode />}
    </RoleShell>
  );
}

/* ---------- Disaster mode ---------- */
type TriageColor = "red" | "orange" | "yellow" | "green";
const TRIAGE: { id: TriageColor; label: string; cls: string }[] = [
  { id: "red", label: "أحمر — إنعاش فوري", cls: "text-destructive" },
  { id: "orange", label: "برتقالي — عاجل جدًا", cls: "text-[oklch(0.7_0.15_70)]" },
  { id: "yellow", label: "أصفر — يمكن الانتظار", cls: "text-[oklch(0.75_0.13_95)]" },
  { id: "green", label: "أخضر — إصابات طفيفة", cls: "text-success" },
];

function DisasterMode() {
  const [active, setActive] = useState(false);
  const [counts, setCounts] = useState<Record<TriageColor, number>>({ red: 0, orange: 0, yellow: 0, green: 0 });
  const total = counts.red + counts.orange + counts.yellow + counts.green;

  const bump = (c: TriageColor, d: number) =>
    setCounts((s) => ({ ...s, [c]: Math.max(0, s[c] + d) }));

  const toggle = () => {
    const next = !active;
    setActive(next);
    if (next) {
      store.broadcastAlert({
        title: "تفعيل وضع الكوارث",
        body: "تم تفعيل بروتوكول الإصابات الجماعية في المستشفى المركزي — على جميع الوحدات الاستعداد.",
        tone: "danger",
        targets: ["doctor", "nurse", "emergency", "ministry"],
      });
      toast.error("تم تفعيل وضع الكوارث وإشعار الوحدات");
    } else {
      toast.success("تم إنهاء وضع الكوارث");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">وضع الكوارث {active && <span className="mr-2 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">مفعّل الآن</span>}</div>
            <div className="mt-1 text-xs text-muted-foreground">بروتوكول الإصابات الجماعية — فرز، إسعاف، أسرّة، ضغط المستشفيات</div>
          </div>
          <button
            onClick={toggle}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${active ? "border border-border bg-surface text-foreground" : "bg-destructive text-destructive-foreground"}`}
          >
            {active ? "إنهاء الوضع" : "تفعيل"}
          </button>
        </div>

        {active && (
          <>
            <div className="mt-5 grid gap-3 md:grid-cols-4 text-center">
              {TRIAGE.map((tr) => (
                <div key={tr.id} className="rounded-xl border border-border p-3">
                  <div className={`text-2xl font-semibold ${tr.cls}`}>{counts[tr.id]}</div>
                  <div className="text-[11px] text-muted-foreground">{tr.label}</div>
                  <div className="mt-2 flex justify-center gap-1.5">
                    <button onClick={() => bump(tr.id, 1)} className="grid h-6 w-6 place-items-center rounded-md border border-border hover:bg-muted" aria-label={`إضافة ${tr.label}`}><Plus className="h-3 w-3" /></button>
                    <button onClick={() => bump(tr.id, -1)} className="grid h-6 w-6 place-items-center rounded-md border border-border hover:bg-muted" aria-label={`إنقاص ${tr.label}`}><Minus className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-border bg-background px-3 py-2 text-[12px] text-muted-foreground">
              إجمالي المصابين المفرزين: <b className="text-foreground">{total}</b>
            </div>
          </>
        )}
      </Card>

      {active && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold"><Ambulance className="h-4 w-4 text-primary" /> تتبع سيارات الإسعاف</div>
            <Row title="AMB-12 · حي الجامعة" meta="ETA 4د · تنقل مصابًا أحمر" status="في الطريق" statusTone="danger" />
            <Row title="AMB-07 · شارع النصر" meta="ETA 11د · تنقل مصابين أصفر" status="في الطريق" statusTone="warn" />
            <Row title="AMB-15 · المستشفى" meta="جاهزة للانطلاق" status="متاحة" statusTone="success" />
            <Row title="AMB-03 · المنطقة الصناعية" meta="تم إرسالها لموقع الحادث" status="مشغولة" statusTone="info" />
          </Card>
          <Card>
            <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold"><Hospital className="h-4 w-4 text-primary" /> الضغط على المستشفيات</div>
            {[
              { name: "المستشفى المركزي", beds: "5/37", pct: 86, tone: "bg-destructive" },
              { name: "مستشفى بغداد التعليمي", beds: "12/40", pct: 70, tone: "bg-[oklch(0.7_0.15_70)]" },
              { name: "مستشفى الأطفال", beds: "6/10", pct: 40, tone: "bg-success" },
            ].map((h) => (
              <div key={h.name} className="mb-3 last:mb-0">
                <div className="flex justify-between text-[12px]">
                  <span className="font-medium">{h.name}</span>
                  <span className="text-muted-foreground">أسرّة شاغرة: {h.beds}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${h.tone}`} style={{ width: `${h.pct}%` }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
