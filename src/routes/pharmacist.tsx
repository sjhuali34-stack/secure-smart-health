import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Pill, Inbox, CheckCircle2, AlertTriangle, Package, BarChart3, ScanLine,
} from "lucide-react";
import { RoleShell, Card, Stat, Row } from "@/components/role-shell";
import { checkDrugSafety } from "@/lib/drug-safety";

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
      roleId="pharmacist"
      reportKind="تقرير صرف"
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
      {tab === "verify" && <InteractionChecker />}
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

/* ---------- Live interaction checker ---------- */
const CHECKABLE = ["Warfarin 5mg", "Aspirin 81mg", "Ibuprofen 400mg", "Metformin 1000mg", "Atorvastatin 20mg", "Amoxicillin 875mg", "Omeprazole 20mg", "Losartan 50mg", "Insulin Glargine", "Paracetamol 500mg"];

function InteractionChecker() {
  const [picked, setPicked] = useState<string[]>(["Warfarin 5mg", "Aspirin 81mg"]);
  const issues = checkDrugSafety(picked);

  const toggle = (m: string) =>
    setPicked((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]));

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-3 text-[13px] font-semibold">فحص التداخلات قبل الصرف</div>
        <div className="mb-3 text-[11px] text-muted-foreground">اختر أدوية الوصفة لفحص الحساسية والتداخلات والجرعات تلقائيًا:</div>
        <div className="flex flex-wrap gap-1.5">
          {CHECKABLE.map((m) => (
            <button
              key={m}
              onClick={() => toggle(m)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition ${picked.includes(m) ? "border-primary bg-accent text-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        {issues.length === 0 ? (
          <div className="flex items-center gap-2 text-[12.5px] text-success">
            <CheckCircle2 className="h-4 w-4" /> لا توجد تداخلات أو حساسية — الوصفة آمنة للصرف.
          </div>
        ) : (
          issues.map((i, idx) => (
            <Row
              key={idx}
              title={i.title}
              meta={i.suggestion ? `${i.detail} · البديل: ${i.suggestion}` : i.detail}
              status={i.severity === "critical" ? "حرج" : "مراجعة"}
              statusTone={i.severity === "critical" ? "danger" : "warn"}
            />
          ))
        )}
      </Card>
    </div>
  );
}
