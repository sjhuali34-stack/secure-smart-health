import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ScanLine, Image as ImageIcon, Inbox, CheckCircle2, FileText, BarChart3, Clock,
} from "lucide-react";
import { RoleShell, Card, Stat, Row } from "@/components/role-shell";

export const Route = createFileRoute("/radiology")({
  component: RadiologyDashboard,
  head: () => ({
    meta: [
      { title: "لوحة الأشعة | UR-SEHR" },
      { name: "description", content: "إدارة طلبات وتقارير الأشعة." },
    ],
  }),
});

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: BarChart3 },
  { id: "queue", label: "قائمة المرضى", icon: Inbox },
  { id: "viewer", label: "عارض الصور", icon: ImageIcon },
  { id: "reports", label: "التقارير", icon: FileText },
];

function RadiologyDashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <RoleShell
      icon={ScanLine}
      title="قسم الأشعة"
      subtitle="مستشفى المدينة الطبية · فني الأشعة: م. عبدالرحمن"
      tabs={TABS}
      active={tab}
      onTab={setTab}
    >
      {tab === "overview" && (
        <div className="grid gap-4 md:grid-cols-4">
          <Stat icon={Inbox} label="طلبات اليوم" value="36" />
          <Stat icon={Clock} label="بانتظار التصوير" value="9" tone="warn" />
          <Stat icon={CheckCircle2} label="تقارير صادرة" value="21" tone="success" />
          <Stat icon={ScanLine} label="استخدام MRI" value="78%" />
        </div>
      )}
      {tab === "queue" && (
        <Card>
          <Row title="RAD-3018 — أحمد كريم" meta="صدر · بدون تباين · من قسم الطوارئ" status="عاجل" statusTone="danger" />
          <Row title="RAD-3019 — فاطمة علي" meta="ركبة يمنى · MRI" status="مجدول 11:30" statusTone="info" />
          <Row title="RAD-3020 — يوسف ناصر" meta="بطن · CT بتباين" status="بانتظار" statusTone="warn" />
        </Card>
      )}
      {tab === "viewer" && (
        <Card>
          <div className="grid h-80 place-items-center rounded-xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
            عارض DICOM — اختر دراسة من القائمة
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            <button className="rounded-xl border border-border bg-background px-3 py-2 text-xs hover:border-border-strong">تكبير</button>
            <button className="rounded-xl border border-border bg-background px-3 py-2 text-xs hover:border-border-strong">قياس</button>
            <button className="rounded-xl border border-border bg-background px-3 py-2 text-xs hover:border-border-strong">تعليق توضيحي</button>
          </div>
        </Card>
      )}
      {tab === "reports" && (
        <Card>
          <Row title="RAD-3010 — أشعة صدر" meta="د. سليم — لا يوجد ارتشاح واضح" status="صادر" statusTone="success" />
          <Row title="RAD-3011 — MRI دماغ" meta="د. هاني — مراجعة استشارية مطلوبة" status="مراجعة" statusTone="warn" />
          <Row title="RAD-3012 — CT بطن" meta="مسودة — بانتظار التوقيع" status="مسودة" />
        </Card>
      )}
    </RoleShell>
  );
}
