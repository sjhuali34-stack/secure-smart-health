import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  HeartHandshake, Home, Syringe, Users, ClipboardList, MapPin, BarChart3,
} from "lucide-react";
import { RoleShell, Card, Stat, Row } from "@/components/role-shell";

export const Route = createFileRoute("/community")({
  component: CommunityDashboard,
  head: () => ({
    meta: [
      { title: "تقني صحة المجتمع | UR-SEHR" },
      { name: "description", content: "زيارات منزلية وحملات الصحة المجتمعية." },
    ],
  }),
});

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: BarChart3 },
  { id: "visits", label: "الزيارات المنزلية", icon: Home },
  { id: "campaigns", label: "الحملات", icon: Syringe },
  { id: "families", label: "العائلات", icon: Users },
  { id: "reports", label: "التقارير الميدانية", icon: ClipboardList },
];

function CommunityDashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <RoleShell
      icon={HeartHandshake}
      title="تقني صحة المجتمع"
      subtitle="القطاع 14 — حي الزهور · المسؤول: زينب عبدالله"
      tabs={TABS}
      active={tab}
      onTab={setTab}
    >
      {tab === "overview" && (
        <div className="grid gap-4 md:grid-cols-4">
          <Stat icon={Home} label="زيارات اليوم" value="7" />
          <Stat icon={Users} label="عائلات نشطة" value="128" />
          <Stat icon={Syringe} label="تطعيمات هذا الشهر" value="312" tone="success" />
          <Stat icon={ClipboardList} label="حالات للمتابعة" value="14" tone="warn" />
        </div>
      )}
      {tab === "visits" && (
        <Card>
          <Row title="عائلة الجبوري — منزل 24" meta="متابعة حمل · 09:30" status="القادم" statusTone="info" right={
            <button className="rounded-full border border-border bg-background px-3 py-1.5 text-[11px] hover:border-border-strong inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" /> الاتجاه</button>
          } />
          <Row title="عائلة الكناني — منزل 47" meta="متابعة طفل · 10:45" status="القادم" statusTone="info" />
          <Row title="السيد كاظم — منزل 12" meta="ضغط دم · 12:00" status="مكتملة" statusTone="success" />
          <Row title="السيدة أم سارة — منزل 56" meta="ملف سكري · 14:00" status="مؤجلة" statusTone="warn" />
        </Card>
      )}
      {tab === "campaigns" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="text-sm font-semibold">حملة شلل الأطفال — جولة 3</div>
            <div className="mt-2 text-3xl font-semibold">86%</div>
            <div className="mt-1 text-[11px] text-muted-foreground">تغطية القطاع · هدف 95%</div>
          </Card>
          <Card>
            <div className="text-sm font-semibold">حملة الإنفلونزا الموسمية</div>
            <div className="mt-2 text-3xl font-semibold">412</div>
            <div className="mt-1 text-[11px] text-muted-foreground">جرعة منذ بداية الحملة</div>
          </Card>
        </div>
      )}
      {tab === "families" && (
        <Card>
          <Row title="عائلة الجبوري" meta="6 أفراد · حالة عالية الخطورة (حمل)" status="متابعة" statusTone="warn" />
          <Row title="عائلة الكناني" meta="4 أفراد · رضيع 8 أشهر" status="نشطة" statusTone="success" />
          <Row title="عائلة الموسوي" meta="5 أفراد · مسن سكري" status="متابعة" statusTone="warn" />
        </Card>
      )}
      {tab === "reports" && (
        <Card>
          <Row title="تقرير ميداني #218" meta="حالات تسمم غذائي محتملة — 3 منازل" status="مرسل" statusTone="danger" />
          <Row title="تقرير #217" meta="ملاحظات بيئية — مياه راكدة" status="بانتظار الرد" statusTone="warn" />
          <Row title="تقرير #216" meta="نشاط توعوي مدرسي" status="مغلق" statusTone="success" />
        </Card>
      )}
    </RoleShell>
  );
}
