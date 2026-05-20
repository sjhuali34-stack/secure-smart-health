import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2, BarChart3, Map, Activity, Syringe, ShieldAlert, TrendingUp, Users,
} from "lucide-react";
import { RoleShell, Card, Stat, Row } from "@/components/role-shell";

export const Route = createFileRoute("/ministry")({
  component: MinistryDashboard,
  head: () => ({
    meta: [
      { title: "وزارة الصحة | UR-SEHR" },
      { name: "description", content: "اللوحة الوطنية لمؤشرات الصحة العامة." },
    ],
  }),
});

const TABS = [
  { id: "national", label: "المؤشرات الوطنية", icon: BarChart3 },
  { id: "epidemic", label: "الترصد الوبائي", icon: ShieldAlert },
  { id: "vaccines", label: "التطعيمات", icon: Syringe },
  { id: "facilities", label: "المنشآت", icon: Building2 },
];

function MinistryDashboard() {
  const [tab, setTab] = useState("national");
  return (
    <RoleShell
      icon={Building2}
      title="اللوحة الوطنية الصحية"
      subtitle="وزارة الصحة — التحليلات الفورية على مستوى الدولة"
      tabs={TABS}
      active={tab}
      onTab={setTab}
      roleId="ministry"
      reportKind="تقرير وزاري"
    >
      {tab === "national" && (
        <>
          <div className="mb-4 grid gap-4 md:grid-cols-4">
            <Stat icon={Users} label="مواطنون مسجّلون" value="41.2M" trend="+12k هذا الأسبوع" />
            <Stat icon={Activity} label="زيارات اليوم" value="184,302" />
            <Stat icon={Building2} label="منشآت نشطة" value="2,847" />
            <Stat icon={TrendingUp} label="رضا المرضى" value="92%" tone="success" />
          </div>
          <Card>
            <div className="mb-3 text-sm font-semibold">الزيارات حسب المحافظة</div>
            <Row title="بغداد" meta="42,103 زيارة" status="+5%" statusTone="success" />
            <Row title="البصرة" meta="18,452 زيارة" status="+2%" statusTone="success" />
            <Row title="نينوى" meta="14,890 زيارة" status="-1%" statusTone="warn" />
            <Row title="أربيل" meta="11,206 زيارة" status="+8%" statusTone="success" />
          </Card>
        </>
      )}
      {tab === "epidemic" && (
        <Card>
          <Row title="إنفلونزا موسمية" meta="3,210 حالة هذا الأسبوع" status="ارتفاع" statusTone="warn" />
          <Row title="حمى الضنك — البصرة" meta="48 حالة مؤكدة" status="مراقبة" statusTone="danger" />
          <Row title="حصبة — نينوى" meta="12 حالة" status="مستقر" statusTone="info" />
          <Row title="كوفيد-19" meta="معدّل R = 0.8" status="متراجع" statusTone="success" />
        </Card>
      )}
      {tab === "vaccines" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card><div className="text-xs text-muted-foreground">التغطية الوطنية (أطفال &lt; 5)</div><div className="mt-2 text-4xl font-semibold">94.2%</div><div className="mt-1 text-[11px] text-success">هدف 95% — قريب</div></Card>
          <Card><div className="text-xs text-muted-foreground">جرعات هذا الشهر</div><div className="mt-2 text-4xl font-semibold">312,488</div><div className="mt-1 text-[11px] text-muted-foreground">منها 41% للأطفال</div></Card>
        </div>
      )}
      {tab === "facilities" && (
        <Card>
          <Row title="مستشفيات حكومية" meta="412 منشأة · إشغال متوسط 71%" status="نشط" statusTone="success" />
          <Row title="مراكز صحية" meta="1,892 مركز" status="نشط" statusTone="success" />
          <Row title="عيادات خاصة مرخّصة" meta="543 عيادة" status="نشط" statusTone="success" />
          <div className="mt-4 grid h-48 place-items-center rounded-xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Map className="h-4 w-4" /> الخريطة الجغرافية للمنشآت</div>
          </div>
        </Card>
      )}
    </RoleShell>
  );
}
