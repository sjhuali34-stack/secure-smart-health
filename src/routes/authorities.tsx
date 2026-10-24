import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Landmark, Building2, Hospital, Stethoscope, Pill, FlaskConical,
  BarChart3, ShieldCheck, Activity, MapPin, Phone, Globe,
} from "lucide-react";
import { RoleShell, Card, Stat, Row } from "@/components/role-shell";

export const Route = createFileRoute("/authorities")({
  component: AuthoritiesDashboard,
  head: () => ({
    meta: [
      { title: "الهيئات الصحية | UR-SEHR" },
      { name: "description", content: "دليل الهيئات والمؤسسات الصحية ومؤشرات جاهزيتها." },
      { property: "og:title", content: "الهيئات الصحية | UR-SEHR" },
      { property: "og:description", content: "دليل الهيئات والمؤسسات الصحية ومؤشرات جاهزيتها." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: BarChart3 },
  { id: "directory", label: "دليل الهيئات", icon: Landmark },
  { id: "readiness", label: "الجاهزية", icon: ShieldCheck },
  { id: "performance", label: "الأداء", icon: Activity },
];

type Authority = {
  id: string;
  name: string;
  kind: "ministry" | "directorate" | "hospital" | "center" | "agency";
  governorate: string;
  staff: number;
  readiness: number; // %
  phone: string;
  status: "active" | "limited" | "offline";
};

const KIND_META: Record<Authority["kind"], { label: string; icon: typeof Building2 }> = {
  ministry: { label: "وزارة/هيئة مركزية", icon: Landmark },
  directorate: { label: "دائرة صحة محافظة", icon: Building2 },
  hospital: { label: "مستشفى", icon: Hospital },
  center: { label: "مركز صحي", icon: Stethoscope },
  agency: { label: "جهة ساندة", icon: Pill },
};

const AUTHORITIES: Authority[] = [
  { id: "A1", name: "وزارة الصحة — المكتب المركزي", kind: "ministry", governorate: "بغداد", staff: 2400, readiness: 98, phone: "0790-000-0001", status: "active" },
  { id: "A2", name: "دائرة صحة بغداد / الرصافة", kind: "directorate", governorate: "بغداد", staff: 18500, readiness: 91, phone: "0790-000-0002", status: "active" },
  { id: "A3", name: "دائرة صحة بغداد / الكرخ", kind: "directorate", governorate: "بغداد", staff: 16200, readiness: 89, phone: "0790-000-0003", status: "active" },
  { id: "A4", name: "دائرة صحة البصرة", kind: "directorate", governorate: "البصرة", staff: 12400, readiness: 84, phone: "0790-000-0004", status: "active" },
  { id: "A5", name: "دائرة صحة نينوى", kind: "directorate", governorate: "نينوى", staff: 9800, readiness: 76, phone: "0790-000-0005", status: "limited" },
  { id: "A6", name: "دائرة صحة أربيل", kind: "directorate", governorate: "أربيل", staff: 8600, readiness: 93, phone: "0790-000-0006", status: "active" },
  { id: "A7", name: "مستشفى بغداد التعليمي", kind: "hospital", governorate: "بغداد", staff: 2100, readiness: 88, phone: "0790-000-0007", status: "active" },
  { id: "A8", name: "مستشفى البصرة العام", kind: "hospital", governorate: "البصرة", staff: 1750, readiness: 81, phone: "0790-000-0008", status: "active" },
  { id: "A9", name: "مركز الزهور الصحي", kind: "center", governorate: "بغداد", staff: 64, readiness: 95, phone: "0790-000-0009", status: "active" },
  { id: "A10", name: "الهيئة العامة للغذاء والدواء", kind: "agency", governorate: "بغداد", staff: 540, readiness: 90, phone: "0790-000-0010", status: "active" },
  { id: "A11", name: "مختبر الصحة العامة المركزي", kind: "agency", governorate: "بغداد", staff: 320, readiness: 87, phone: "0790-000-0011", status: "active" },
  { id: "A12", name: "دائرة صحة ذي قار", kind: "directorate", governorate: "ذي قار", staff: 7200, readiness: 72, phone: "0790-000-0012", status: "limited" },
];

const STATUS_META = {
  active: { label: "نشطة", tone: "success" as const },
  limited: { label: "قدرة محدودة", tone: "warn" as const },
  offline: { label: "خارج الخدمة", tone: "danger" as const },
};

function AuthoritiesDashboard() {
  const [tab, setTab] = useState("overview");
  const [kindFilter, setKindFilter] = useState<"all" | Authority["kind"]>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => AUTHORITIES.filter((a) =>
    (kindFilter === "all" || a.kind === kindFilter) &&
    (!query.trim() || a.name.includes(query.trim()) || a.governorate.includes(query.trim()))
  ), [kindFilter, query]);

  const avgReadiness = Math.round(AUTHORITIES.reduce((s, a) => s + a.readiness, 0) / AUTHORITIES.length);
  const totalStaff = AUTHORITIES.reduce((s, a) => s + a.staff, 0);

  return (
    <RoleShell
      icon={Landmark}
      title="الهيئات الصحية"
      subtitle="دليل المؤسسات الصحية ومؤشرات الجاهزية والأداء"
      tabs={TABS}
      active={tab}
      onTab={setTab}
      roleId="authorities"
      reportKind="تقرير هيئة"
    >
      {tab === "overview" && (
        <>
          <div className="mb-4 grid gap-4 md:grid-cols-4">
            <Stat icon={Landmark} label="هيئات مسجلة" value={String(AUTHORITIES.length)} />
            <Stat icon={Activity} label="متوسط الجاهزية" value={`${avgReadiness}%`} tone="success" />
            <Stat icon={ShieldCheck} label="كوادر عاملة" value={totalStaff.toLocaleString("ar")} />
            <Stat icon={Building2} label="قدرة محدودة" value={String(AUTHORITIES.filter((a) => a.status === "limited").length)} tone="warn" />
          </div>
          <Card>
            <div className="mb-3 text-sm font-semibold">أعلى الهيئات جاهزية</div>
            {[...AUTHORITIES].sort((a, b) => b.readiness - a.readiness).slice(0, 5).map((a) => (
              <Row key={a.id} title={a.name} meta={`${KIND_META[a.kind].label} · ${a.governorate}`} status={`${a.readiness}%`} statusTone={a.readiness >= 90 ? "success" : "warn"} />
            ))}
          </Card>
        </>
      )}

      {tab === "directory" && (
        <Card>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو المحافظة…"
              className="w-full max-w-xs rounded-xl border border-border bg-background px-3 py-2 text-[13px] focus:border-primary focus:outline-none"
            />
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setKindFilter("all")}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${kindFilter === "all" ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground"}`}>
                الكل
              </button>
              {(Object.keys(KIND_META) as Authority["kind"][]).map((k) => (
                <button key={k} onClick={() => setKindFilter(k)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${kindFilter === k ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground"}`}>
                  {KIND_META[k].label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((a) => {
              const KIcon = KIND_META[a.kind].icon;
              const st = STATUS_META[a.status];
              return (
                <div key={a.id} className="rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-primary">
                        <KIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[13.5px] font-semibold text-foreground">{a.name}</div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">{KIND_META[a.kind].label}</div>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${st.tone === "success" ? "bg-success/10 text-success" : st.tone === "warn" ? "bg-[oklch(0.95_0.1_70)] text-[oklch(0.5_0.15_70)]" : "bg-destructive/10 text-destructive"}`}>
                      {st.label}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.governorate}</span>
                    <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {a.phone}</span>
                    <span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" /> {a.staff.toLocaleString("ar")} موظف</span>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-[10.5px] text-muted-foreground">
                      <span>الجاهزية التشغيلية</span><span>{a.readiness}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full ${a.readiness >= 90 ? "bg-success" : a.readiness >= 75 ? "bg-primary" : "bg-[oklch(0.7_0.15_70)]"}`} style={{ width: `${a.readiness}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-border bg-background p-8 text-center text-[12px] text-muted-foreground">
                لا توجد هيئات مطابقة للبحث.
              </div>
            )}
          </div>
        </Card>
      )}

      {tab === "readiness" && (
        <Card>
          <div className="mb-3 text-sm font-semibold">الجاهزية حسب المحافظة</div>
          {["بغداد", "البصرة", "نينوى", "أربيل", "ذي قار"].map((g) => {
            const list = AUTHORITIES.filter((a) => a.governorate === g);
            const avg = list.length ? Math.round(list.reduce((s, a) => s + a.readiness, 0) / list.length) : 0;
            return (
              <Row key={g} title={g} meta={`${list.length} هيئة · ${list.reduce((s, a) => s + a.staff, 0).toLocaleString("ar")} موظف`}
                status={`${avg}%`} statusTone={avg >= 90 ? "success" : avg >= 78 ? "info" : "warn"} />
            );
          })}
        </Card>
      )}

      {tab === "performance" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="text-sm font-semibold">زيارات المرضى هذا الشهر</div>
            <div className="mt-2 text-3xl font-semibold">5.4M</div>
            <div className="mt-1 text-[11px] text-success">+6% عن الشهر السابق</div>
          </Card>
          <Card>
            <div className="text-sm font-semibold">متوسط زمن الانتظار</div>
            <div className="mt-2 text-3xl font-semibold">23 د</div>
            <div className="mt-1 text-[11px] text-muted-foreground">هدف الوزارة: أقل من 30 دقيقة</div>
          </Card>
          <Card>
            <div className="text-sm font-semibold">بلاغات الجودة المغلقة</div>
            <div className="mt-2 text-3xl font-semibold">184</div>
            <div className="mt-1 text-[11px] text-muted-foreground">من أصل 211 هذا الربع</div>
          </Card>
          <Card>
            <div className="text-sm font-semibold">التزام رفع التقارير</div>
            <div className="mt-2 text-3xl font-semibold">96%</div>
            <div className="mt-1 text-[11px] text-success">ضمن المستهدف الوطني</div>
          </Card>
        </div>
      )}
    </RoleShell>
  );
}
