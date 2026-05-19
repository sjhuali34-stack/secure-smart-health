import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FlaskConical, TestTube, Inbox, CheckCircle2, Microscope, BarChart3, Clock,
} from "lucide-react";
import { RoleShell, Card, Stat, Row } from "@/components/role-shell";

export const Route = createFileRoute("/lab")({
  component: LabDashboard,
  head: () => ({
    meta: [
      { title: "لوحة المختبر | UR-SEHR" },
      { name: "description", content: "إدارة عينات وتحاليل المختبر." },
    ],
  }),
});

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: BarChart3 },
  { id: "inbox", label: "طلبات واردة", icon: Inbox },
  { id: "processing", label: "قيد التحليل", icon: Microscope },
  { id: "results", label: "نتائج جاهزة", icon: CheckCircle2 },
];

function LabDashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <RoleShell
      icon={FlaskConical}
      title="مختبر المركز الوطني"
      subtitle="قسم التحاليل الطبية · أخصائي: د. ليلى عبدالله"
      tabs={TABS}
      active={tab}
      onTab={setTab}
    >
      {tab === "overview" && (
        <div className="grid gap-4 md:grid-cols-4">
          <Stat icon={Inbox} label="طلبات اليوم" value="42" trend="+8 خلال الساعة" />
          <Stat icon={Microscope} label="قيد التحليل" value="11" tone="warn" />
          <Stat icon={CheckCircle2} label="نتائج صادرة" value="28" tone="success" />
          <Stat icon={Clock} label="متوسط الإنجاز" value="47د" />
        </div>
      )}
      {tab === "inbox" && (
        <Card>
          <Row title="LAB-20512 — أحمد كريم" meta="CBC + HbA1c · د. عمر — قسم الباطنية" status="جديد" statusTone="info" />
          <Row title="LAB-20513 — مريم سالم" meta="وظائف كبد · د. حسن — العيادات" status="عاجل" statusTone="danger" />
          <Row title="LAB-20514 — يوسف ناصر" meta="فيتامين D · فحص دوري" status="عادي" />
        </Card>
      )}
      {tab === "processing" && (
        <Card>
          <Row title="LAB-20508 — رنا فؤاد" meta="بدأ 09:42 · الجهاز #3" status="جاري" statusTone="info" />
          <Row title="LAB-20509 — محمود طه" meta="بدأ 09:55 · الجهاز #1" status="جاري" statusTone="info" />
          <Row title="LAB-20510 — سلمى نور" meta="إعادة فحص — قيمة شاذة" status="مراجعة" statusTone="warn" />
        </Card>
      )}
      {tab === "results" && (
        <Card>
          <Row title="LAB-20498 — كريم وليد · HbA1c" meta="القيمة 7.8% — مرتفع" status="غير طبيعي" statusTone="warn" />
          <Row title="LAB-20499 — هند فاضل · CBC" meta="ضمن المعدل الطبيعي" status="طبيعي" statusTone="success" />
          <Row title="LAB-20500 — جمال زهير · TSH" meta="القيمة 0.2 — منخفض" status="غير طبيعي" statusTone="warn" />
        </Card>
      )}
    </RoleShell>
  );
}
