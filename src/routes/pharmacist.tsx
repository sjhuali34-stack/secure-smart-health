import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Pill, Inbox, CheckCircle2, AlertTriangle, Package, BarChart3, ScanLine,
} from "lucide-react";
import { RoleShell, Card, Stat, Row } from "@/components/role-shell";

export const Route = createFileRoute("/pharmacist")({
  component: PharmacistDashboard,
  head: () => ({
    meta: [
      { title: "لوحة الصيدلي | UR-SEHR" },
      { name: "description", content: "صرف الوصفات وإدارة المخزون الدوائي." },
    ],
  }),
});

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: BarChart3 },
  { id: "queue", label: "وصفات بانتظار الصرف", icon: Inbox },
  { id: "verify", label: "تحقّق وتفاعلات", icon: AlertTriangle },
  { id: "inventory", label: "المخزون", icon: Package },
];

function PharmacistDashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <RoleShell
      icon={Pill}
      title="صيدلية المركز"
      subtitle="الصيدلي المسؤول: د. منى عادل — وردية الصباح"
      tabs={TABS}
      active={tab}
      onTab={setTab}
    >
      {tab === "overview" && (
        <div className="grid gap-4 md:grid-cols-4">
          <Stat icon={Inbox} label="وصفات اليوم" value="87" />
          <Stat icon={CheckCircle2} label="تم الصرف" value="61" tone="success" />
          <Stat icon={AlertTriangle} label="تحتاج مراجعة" value="4" tone="warn" />
          <Stat icon={Package} label="أدوية منخفضة" value="9" tone="danger" />
        </div>
      )}
      {tab === "queue" && (
        <Card>
          <Row title="RX-77821 — أحمد كريم" meta="باراسيتامول 500mg · أموكسيسيلين 875mg" status="جديد" statusTone="info" right={
            <button className="rounded-full border border-border bg-background px-3 py-1.5 text-[11px] hover:border-border-strong inline-flex items-center gap-1.5"><ScanLine className="h-3 w-3" /> مسح</button>
          } />
          <Row title="RX-77822 — فاطمة علي" meta="ميتفورمين 1000mg · أتورفاستاتين 20mg" status="جاهز للصرف" statusTone="success" />
          <Row title="RX-77823 — يوسف ناصر" meta="إنسولين قاعدي · شرائط فحص سكر" status="بانتظار التأمين" statusTone="warn" />
        </Card>
      )}
      {tab === "verify" && (
        <Card>
          <Row title="تحذير تفاعل — RX-77819" meta="وارفارين + أسبرين — خطر نزيف" status="حرج" statusTone="danger" />
          <Row title="حساسية مسجّلة — RX-77820" meta="بنسلين على ملف المريض" status="حرج" statusTone="danger" />
          <Row title="جرعة عالية — RX-77815" meta="ميتفورمين 2500mg/يوم" status="مراجعة" statusTone="warn" />
        </Card>
      )}
      {tab === "inventory" && (
        <Card>
          <Row title="أموكسيسيلين 500mg" meta="المخزون: 28 علبة" status="منخفض" statusTone="warn" />
          <Row title="إنسولين قاعدي" meta="المخزون: 6 أقلام" status="حرج" statusTone="danger" />
          <Row title="باراسيتامول 500mg" meta="المخزون: 412 علبة" status="مرتفع" statusTone="success" />
          <Row title="أتورفاستاتين 20mg" meta="ينتهي 06/2026 — 14 علبة" status="قارب الانتهاء" statusTone="warn" />
        </Card>
      )}
    </RoleShell>
  );
}
