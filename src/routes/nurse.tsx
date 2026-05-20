import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  HeartPulse, Activity, ClipboardList, Syringe, Droplets, Bed,
  Thermometer, Gauge, Users, AlertTriangle,
} from "lucide-react";
import { RoleShell, Card, Stat, Row } from "@/components/role-shell";

export const Route = createFileRoute("/nurse")({
  component: NurseDashboard,
  head: () => ({
    meta: [
      { title: "لوحة الممرض | UR-SEHR" },
      { name: "description", content: "إدارة العلامات الحيوية والمهام التمريضية." },
    ],
  }),
});

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: Activity },
  { id: "vitals", label: "العلامات الحيوية", icon: HeartPulse },
  { id: "tasks", label: "المهام", icon: ClipboardList },
  { id: "meds", label: "صرف الأدوية", icon: Syringe },
  { id: "rounds", label: "الجولات", icon: Bed },
];

function NurseDashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <RoleShell
      icon={HeartPulse}
      title="مرحبًا، الممرضة سارة"
      subtitle="قسم الباطنية — الطابق الثالث · مناوبة الصباح"
      tabs={TABS}
      active={tab}
      onTab={setTab}
      roleId="nurse"
      reportKind="تقرير تمريض"
    >
      {tab === "overview" && (
        <div className="grid gap-4 md:grid-cols-4">
          <Stat icon={Users} label="مرضى تحت الرعاية" value="14" trend="+2 منذ بداية المناوبة" />
          <Stat icon={ClipboardList} label="مهام معلّقة" value="6" tone="warn" />
          <Stat icon={Syringe} label="جرعات اليوم" value="23" />
          <Stat icon={AlertTriangle} label="تنبيهات حرجة" value="1" tone="danger" />
        </div>
      )}
      {tab === "vitals" && (
        <Card>
          <Row title="غرفة 305 — أحمد كريم" meta="ضغط 145/92 · نبض 98 · حرارة 38.4°" status="مرتفع" statusTone="warn" />
          <Row title="غرفة 312 — فاطمة علي" meta="ضغط 118/76 · نبض 72 · حرارة 36.8°" status="طبيعي" statusTone="success" />
          <Row title="غرفة 318 — محمد ياسين" meta="ضغط 90/60 · نبض 110 · SpO₂ 91%" status="حرج" statusTone="danger" />
          <Row title="غرفة 322 — هدى سامي" meta="ضغط 122/80 · نبض 80 · حرارة 37.0°" status="طبيعي" statusTone="success" />
        </Card>
      )}
      {tab === "tasks" && (
        <Card>
          <Row title="قياس العلامات الحيوية — غرفة 305" meta="مجدول 10:30 ص" status="عاجل" statusTone="danger" />
          <Row title="تبديل الضمادة — غرفة 318" meta="مجدول 11:00 ص" status="قيد التنفيذ" statusTone="info" />
          <Row title="سحب عينة دم — غرفة 312" meta="طلب د. عمر — CBC" status="معلّق" statusTone="warn" />
        </Card>
      )}
      {tab === "meds" && (
        <Card>
          <Row title="باراسيتامول 500mg — غرفة 305" meta="عبر الفم · كل 6 ساعات" status="موعد الآن" statusTone="warn" />
          <Row title="إنسولين 10IU — غرفة 312" meta="تحت الجلد · قبل الإفطار" status="تم" statusTone="success" />
          <Row title="سيفترياكسون 1g — غرفة 318" meta="وريدي · كل 12 ساعة" status="معلّق" />
        </Card>
      )}
      {tab === "rounds" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="mb-3 text-sm font-semibold">جولة الصباح 09:00</h3>
            <Row title="غرف 301-310" meta="10 مرضى · مكتملة" status="تمت" statusTone="success" />
            <Row title="غرف 311-320" meta="9 مرضى · جارية" status="جارية" statusTone="info" />
          </Card>
          <Card>
            <h3 className="mb-3 text-sm font-semibold">إشغال الأسرّة</h3>
            <div className="flex items-end gap-2">
              <div className="text-4xl font-semibold">14/20</div>
              <div className="mb-1 text-xs text-muted-foreground">سرير مشغول</div>
            </div>
          </Card>
        </div>
      )}
    </RoleShell>
  );
}
