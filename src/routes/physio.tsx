import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Dumbbell, Calendar, Users, ClipboardList, Activity, TrendingUp, BarChart3,
} from "lucide-react";
import { RoleShell, Card, Stat, Row } from "@/components/role-shell";

export const Route = createFileRoute("/physio")({
  component: PhysioDashboard,
  head: () => ({
    meta: [
      { title: "العلاج الطبيعي | UR-SEHR" },
      { name: "description", content: "جلسات وخطط التأهيل البدني." },
    ],
  }),
});

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: BarChart3 },
  { id: "sessions", label: "جلسات اليوم", icon: Calendar },
  { id: "patients", label: "خطط المرضى", icon: Users },
  { id: "exercises", label: "مكتبة التمارين", icon: Dumbbell },
  { id: "progress", label: "متابعة التقدم", icon: TrendingUp },
];

function PhysioDashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <RoleShell
      icon={Dumbbell}
      title="قسم العلاج الطبيعي"
      subtitle="مركز التأهيل — أخصائي: د. حسين الربيعي"
      tabs={TABS}
      active={tab}
      onTab={setTab}
      roleId="physio"
      reportKind="تقرير جلسة تأهيل"
    >
      {tab === "overview" && (
        <div className="grid gap-4 md:grid-cols-4">
          <Stat icon={Calendar} label="جلسات اليوم" value="12" />
          <Stat icon={Users} label="مرضى نشطون" value="48" />
          <Stat icon={Activity} label="جلسات الأسبوع" value="74" />
          <Stat icon={TrendingUp} label="معدّل التحسن" value="+18%" tone="success" />
        </div>
      )}
      {tab === "sessions" && (
        <Card>
          <Row title="09:00 — علي مهدي" meta="ما بعد جراحة الركبة · جلسة 8/24" status="مكتملة" statusTone="success" />
          <Row title="10:00 — نور سامي" meta="ألم أسفل الظهر · جلسة 4/12" status="جارية" statusTone="info" />
          <Row title="11:00 — كريم وليد" meta="تأهيل سكتة دماغية · جلسة 16/40" status="القادمة" statusTone="info" />
          <Row title="14:00 — هدى فؤاد" meta="إصابة كتف رياضية · جلسة 2/10" status="مجدولة" />
        </Card>
      )}
      {tab === "patients" && (
        <Card>
          <Row title="علي مهدي — ركبة يمنى" meta="خطة 24 جلسة · 3 جلسات/أسبوع" status="نشطة" statusTone="success" />
          <Row title="نور سامي — ظهر" meta="خطة 12 جلسة · 2 جلسات/أسبوع" status="نشطة" statusTone="success" />
          <Row title="جاسم حيدر — كاحل" meta="مكتملة 10/10" status="منتهية" statusTone="info" />
        </Card>
      )}
      {tab === "exercises" && (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "تمديد العضلة الرباعية", d: "3 مجموعات × 15 تكرار" },
            { n: "تقوية الظهر السفلي", d: "3 مجموعات × 12 تكرار" },
            { n: "توازن على قدم واحدة", d: "3 × 30 ثانية" },
            { n: "دوران الكتف", d: "2 مجموعات × 20 تكرار" },
            { n: "مشي بمساعدة", d: "10 دقائق" },
            { n: "تمديد أوتار الركبة", d: "3 × 30 ثانية" },
          ].map((e) => (
            <Card key={e.n}>
              <div className="text-sm font-semibold">{e.n}</div>
              <div className="mt-1 text-xs text-muted-foreground">{e.d}</div>
              <button className="mt-3 w-full rounded-xl border border-border bg-background py-2 text-[11px] hover:border-border-strong">إضافة لخطة مريض</button>
            </Card>
          ))}
        </div>
      )}
      {tab === "progress" && (
        <Card>
          <Row title="علي مهدي" meta="نطاق حركة الركبة: 65° → 115° (+50°)" status="ممتاز" statusTone="success" />
          <Row title="نور سامي" meta="مقياس الألم: 8 → 4" status="تحسن" statusTone="success" />
          <Row title="كريم وليد" meta="قوة العضلات: 2/5 → 3/5" status="تحسن بطيء" statusTone="warn" />
        </Card>
      )}
    </RoleShell>
  );
}
