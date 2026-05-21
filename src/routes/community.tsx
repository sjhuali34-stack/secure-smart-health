import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  HeartHandshake, Home, Syringe, Users, ClipboardList, MapPin, BarChart3,
  FileText, FlaskConical, ScanLine, Pill, Send, ShieldCheck, Download,
} from "lucide-react";
import { toast } from "sonner";
import { RoleShell, Card, Stat, Row } from "@/components/role-shell";
import { downloadHealthRecord } from "@/lib/app-store";

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
  { id: "record", label: "السجل الصحي الكامل", icon: FileText },
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
      roleId="community"
      reportKind="تقرير ميداني"
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
      {tab === "record" && <FullRecord />}
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

function FullRecord() {
  const patient = { name: "أحمد محمد", id: "12-4567-8901-23" };
  const download = () => { downloadHealthRecord(patient.name, patient.id); toast.success("تم تنزيل السجل"); };
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{patient.name}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">الرقم الصحي: {patient.id} · ذكر · 42 سنة · O+</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-destructive/10 px-2 py-1 text-[10px] text-destructive">حساسية: بنسلين</span>
              <span className="rounded-full bg-[oklch(0.95_0.1_70)] px-2 py-1 text-[10px] text-[oklch(0.5_0.15_70)]">سكري نوع 2</span>
              <span className="rounded-full bg-accent px-2 py-1 text-[10px] text-accent-foreground">ضغط الدم</span>
            </div>
          </div>
          <button onClick={download} className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-3 py-2 text-[12px] text-background hover:opacity-90">
            <Download className="h-3.5 w-3.5" /> تحميل السجل كاملاً
          </button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold"><FlaskConical className="h-4 w-4 text-primary" /> آخر التحاليل</div>
          <Row title="HbA1c" meta="5.4٪ — طبيعي" status="طبيعي" statusTone="success" />
          <Row title="LDL" meta="138 mg/dL — مرتفع" status="مراجعة" statusTone="warn" />
          <Row title="فيتامين D" meta="21 ng/mL — منخفض" status="منخفض" statusTone="warn" />
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold"><ScanLine className="h-4 w-4 text-primary" /> الأشعة</div>
          <Row title="أشعة صدر — X-Ray" meta="لا توجد ملاحظات مرضية" status="جاهز" statusTone="success" />
          <Row title="إيكو القلب" meta="وظائف القلب طبيعية" status="جاهز" statusTone="success" />
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold"><Pill className="h-4 w-4 text-primary" /> الوصفات الفعّالة</div>
          <Row title="Metformin 500mg" meta="قرص مرتين يومياً — 12 يوم متبقي" status="فعّالة" statusTone="success" />
          <Row title="Vitamin D3 5000 IU" meta="قرص يومياً — 28 يوم متبقي" status="فعّالة" statusTone="success" />
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold"><Syringe className="h-4 w-4 text-primary" /> التطعيمات</div>
          <Row title="إنفلونزا موسمية 2026" meta="موعد قادم 20 نوفمبر" status="مستحقة" statusTone="warn" />
          <Row title="كوفيد-19 (منشطة)" meta="فايزر — مارس 2026" status="مكتملة" statusTone="success" />
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold"><Send className="h-4 w-4 text-primary" /> الإحالات</div>
          <Row title="إلى استشاري القلب" meta="من د. سارة العبيدي · مستعجلة" status="قيد الانتظار" statusTone="warn" />
          <Row title="طب الأسنان" meta="فحص دوري" status="مكتملة" statusTone="success" />
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> سجل الوصول</div>
          <Row title="زينب عبدالله — تقني صحة مجتمع" meta="فتح السجل من ميدان القطاع 14" status="الآن" statusTone="info" />
          <Row title="د. سارة العبيدي" meta="مراجعة — مستشفى بغداد" status="اليوم" statusTone="default" />
        </Card>
      </div>
    </div>
  );
}
