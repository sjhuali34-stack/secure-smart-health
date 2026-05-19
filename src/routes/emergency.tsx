import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity, Ambulance, Bed, AlertTriangle, Users, Siren, Heart, MapPin,
} from "lucide-react";
import { RoleShell, Card, Stat, Row } from "@/components/role-shell";

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
      {tab === "disaster" && (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">وضع الكوارث</div>
              <div className="mt-1 text-xs text-muted-foreground">تفعيل بروتوكول الإصابات الجماعية</div>
            </div>
            <button className="rounded-full bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground">تفعيل</button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-4 text-center">
            <div className="rounded-xl border border-border p-3"><div className="text-2xl font-semibold text-destructive">0</div><div className="text-[11px] text-muted-foreground">أحمر</div></div>
            <div className="rounded-xl border border-border p-3"><div className="text-2xl font-semibold text-[oklch(0.7_0.15_70)]">0</div><div className="text-[11px] text-muted-foreground">برتقالي</div></div>
            <div className="rounded-xl border border-border p-3"><div className="text-2xl font-semibold text-[oklch(0.75_0.13_95)]">0</div><div className="text-[11px] text-muted-foreground">أصفر</div></div>
            <div className="rounded-xl border border-border p-3"><div className="text-2xl font-semibold text-success">0</div><div className="text-[11px] text-muted-foreground">أخضر</div></div>
          </div>
        </Card>
      )}
    </RoleShell>
  );
}
