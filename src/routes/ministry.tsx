import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Building2, BarChart3, Map, Activity, Syringe, ShieldAlert, TrendingUp, Users, Megaphone, Send, Bell,
  Leaf, Camera, CheckCircle2, Truck, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { RoleShell, Card, Stat, Row } from "@/components/role-shell";
import { BroadcastAlertDialog } from "@/components/app-dialogs";
import { IraqEnvMap } from "@/components/iraq-env-map";
import { store, useStore, type EnvReport } from "@/lib/app-store";
import {
  SEED_HOTSPOTS, HAZARD_META, SEVERITY_META, hotspotsByGovernorate,
  type EnvHazardType, type EnvHotspot,
} from "@/lib/env-data";

export const Route = createFileRoute("/ministry")({
  component: MinistryDashboard,
  head: () => ({
    meta: [
      { title: "وزارة الصحة | UR-SEHR" },
      { name: "description", content: "اللوحة الوطنية لمؤشرات الصحة العامة والترصد البيئي." },
      { property: "og:title", content: "وزارة الصحة | UR-SEHR" },
      { property: "og:description", content: "اللوحة الوطنية لمؤشرات الصحة العامة والترصد البيئي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const TABS = [
  { id: "national", label: "المؤشرات الوطنية", icon: BarChart3 },
  { id: "envmap", label: "الترصد البيئي", icon: Leaf },
  { id: "epidemic", label: "الترصد الوبائي", icon: ShieldAlert },
  { id: "vaccines", label: "التطعيمات", icon: Syringe },
  { id: "facilities", label: "المنشآت", icon: Building2 },
  { id: "alerts", label: "التنبيهات الوطنية", icon: Megaphone },
];

function MinistryDashboard() {
  const [tab, setTab] = useState("national");
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const broadcasts = useStore((s) =>
    s.notifications.filter((n) => n.id.startsWith("BRD-")).slice(0, 20)
  );

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
      {/* Sticky action bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-surface/80 p-3 backdrop-blur">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Megaphone className="h-4 w-4 text-primary" />
          قناة الإخطارات الرسمية للوزارة — للمؤسسات الصحية والمواطنين
        </div>
        <button
          onClick={() => setBroadcastOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-[12.5px] font-medium text-background hover:opacity-90"
        >
          <Send className="h-3.5 w-3.5" /> إرسال تنبيه وطني
        </button>
      </div>

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
      {tab === "envmap" && <EnvSurveillance />}
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
      {tab === "alerts" && (
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">سجل التنبيهات المرسلة</div>
              <div className="text-[11px] text-muted-foreground">آخر {broadcasts.length} تنبيه صادر من الوزارة</div>
            </div>
            <button
              onClick={() => setBroadcastOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-[11.5px] font-medium text-foreground hover:bg-muted"
            >
              <Send className="h-3.5 w-3.5" /> تنبيه جديد
            </button>
          </div>
          {broadcasts.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-background p-6 text-center text-[12px] text-muted-foreground">
              لم يتم إرسال أي تنبيه بعد — اضغط "إرسال تنبيه وطني" لإصدار أول إخطار.
            </div>
          )}
          <div className="space-y-2">
            {broadcasts.map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-primary">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-foreground">{n.title}</div>
                  <div className="mt-0.5 text-[11.5px] text-muted-foreground">{n.body}</div>
                  <div className="mt-1 flex items-center gap-2 text-[10.5px] text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5">إلى: {n.for === "all" ? "الجميع" : n.for}</span>
                    <span>{new Date(n.at).toLocaleString("ar")}</span>
                    <span className={`rounded-full px-2 py-0.5 ${
                      n.tone === "danger" ? "bg-destructive/10 text-destructive" :
                      n.tone === "warn" ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" :
                      n.tone === "success" ? "bg-success/10 text-success" : "bg-accent text-primary"
                    }`}>{n.tone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <BroadcastAlertDialog open={broadcastOpen} onClose={() => setBroadcastOpen(false)} />
    </RoleShell>
  );
}

/* ---------- الترصد البيئي ---------- */
const ALL_TYPES = Object.keys(HAZARD_META) as EnvHazardType[];

function EnvSurveillance() {
  const envReports = useStore((s) => s.envReports);
  const [activeTypes, setActiveTypes] = useState<Set<EnvHazardType>>(new Set(ALL_TYPES));
  const [selected, setSelected] = useState<EnvHotspot | null>(null);

  const toggleType = (t: EnvHazardType) =>
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });

  const byGov = useMemo(() => hotspotsByGovernorate(SEED_HOTSPOTS), []);
  const critical = SEED_HOTSPOTS.filter((h) => h.severity === "critical").length;
  const totalCases = SEED_HOTSPOTS.reduce((s, h) => s + (h.cases ?? 0), 0);
  const newReports = envReports.filter((r) => r.status === "new").length;

  const setReportStatus = (r: EnvReport, status: EnvReport["status"], msg: string) => {
    store.updateEnvReportStatus(r.id, status);
    toast.success(msg);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon={Leaf} label="بؤر بيئية نشطة" value={String(SEED_HOTSPOTS.length)} />
        <Stat icon={ShieldAlert} label="بؤر حرجة" value={String(critical)} tone="danger" />
        <Stat icon={Activity} label="حالات مرتبطة بالبيئة" value={totalCases.toLocaleString("ar")} tone="warn" />
        <Stat icon={Camera} label="بلاغات ميدانية جديدة" value={String(newReports)} tone={newReports > 0 ? "warn" : "success"} />
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2">
        {ALL_TYPES.map((tk) => {
          const on = activeTypes.has(tk);
          return (
            <button key={tk} onClick={() => toggleType(tk)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition ${on ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}>
              <span className="h-2 w-2 rounded-full" style={{ background: HAZARD_META[tk].color }} />
              {HAZARD_META[tk].label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <IraqEnvMap hotspots={SEED_HOTSPOTS} activeTypes={activeTypes} onSelect={setSelected} selectedId={selected?.id} />

        <Card>
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">{selected.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{HAZARD_META[selected.type].label} · {selected.governorate}</div>
                </div>
                <span className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: HAZARD_META[selected.type].bg, color: HAZARD_META[selected.type].color }}>
                  {SEVERITY_META[selected.severity].label}
                </span>
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">{selected.detail}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl border border-border bg-background p-2.5">
                  <div className="text-lg font-semibold">{(selected.cases ?? 0).toLocaleString("ar")}</div>
                  <div className="text-[10px] text-muted-foreground">حالة مرتبطة</div>
                </div>
                <div className="rounded-xl border border-border bg-background p-2.5">
                  <div className="text-lg font-semibold">{selected.trend === "up" ? "↑ تصاعد" : selected.trend === "down" ? "↓ تراجع" : "— مستقر"}</div>
                  <div className="text-[10px] text-muted-foreground">الاتجاه</div>
                </div>
              </div>
              <button
                onClick={() => {
                  store.broadcastAlert({
                    title: `تحذير بيئي — ${selected.governorate}`,
                    body: `${selected.title}: ${selected.detail}`,
                    tone: selected.severity === "critical" ? "danger" : "warn",
                    targets: ["all"],
                  });
                  toast.success("تم بث التحذير البيئي للمواطنين والمؤسسات");
                }}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-[12.5px] font-medium text-background hover:opacity-90"
              >
                <Megaphone className="h-3.5 w-3.5" /> بث تحذير للمنطقة
              </button>
            </>
          ) : (
            <div className="grid h-full min-h-40 place-items-center text-center text-[12px] text-muted-foreground">
              اختر بؤرة على الخريطة لعرض التفاصيل وبث تحذير للمنطقة.
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Hotspots by governorate */}
        <Card>
          <div className="mb-3 text-sm font-semibold">البؤر حسب المحافظة</div>
          {[...byGov.entries()].map(([gov, list]) => (
            <Row key={gov} title={gov}
              meta={list.map((h) => HAZARD_META[h.type].label).join(" · ")}
              status={`${list.length} بؤرة`} statusTone={list.some((h) => h.severity === "critical") ? "danger" : list.some((h) => h.severity === "high") ? "warn" : "info"} />
          ))}
        </Card>

        {/* Incoming field reports from community health */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">بلاغات صحة المجتمع الميدانية</div>
            <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] text-muted-foreground">{envReports.length} بلاغ</span>
          </div>
          {envReports.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-background p-6 text-center text-[12px] text-muted-foreground">
              لا توجد بلاغات بعد — تصل هنا بلاغات تقنيي صحة المجتمع مع الصور.
            </div>
          )}
          <div className="space-y-3">
            {envReports.map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-background p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[13px] font-medium text-foreground">{HAZARD_META[r.type].label} — {r.governorate}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">{r.location} · {r.reporter} · {new Date(r.at).toLocaleString("ar")}</div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    r.status === "new" ? "bg-destructive/10 text-destructive" :
                    r.status === "reviewing" ? "bg-accent text-primary" :
                    r.status === "dispatched" ? "bg-[oklch(0.95_0.1_70)] text-[oklch(0.5_0.15_70)]" :
                    "bg-success/10 text-success"
                  }`}>
                    {r.status === "new" ? "جديد" : r.status === "reviewing" ? "قيد المراجعة" : r.status === "dispatched" ? "تم إرسال فريق" : "مغلق"}
                  </span>
                </div>
                <p className="mt-2 text-[11.5px] text-muted-foreground">{r.description}</p>
                {r.photos.length > 0 && (
                  <div className="mt-2 flex gap-1.5">
                    {r.photos.map((p, i) => (
                      <img key={i} src={p} alt={`صورة البلاغ ${i + 1}`} className="h-14 w-14 rounded-lg border border-border object-cover" />
                    ))}
                  </div>
                )}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {r.status === "new" && (
                    <button onClick={() => setReportStatus(r, "reviewing", "بدأت مراجعة البلاغ")}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-[10.5px] hover:bg-muted">
                      <Eye className="h-3 w-3" /> بدء المراجعة
                    </button>
                  )}
                  {(r.status === "new" || r.status === "reviewing") && (
                    <button onClick={() => setReportStatus(r, "dispatched", "تم إرسال فريق ميداني")}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-[10.5px] hover:bg-muted">
                      <Truck className="h-3 w-3" /> إرسال فريق
                    </button>
                  )}
                  {r.status !== "closed" && (
                    <button onClick={() => setReportStatus(r, "closed", "تم إغلاق البلاغ")}
                      className="inline-flex items-center gap-1 rounded-lg border border-success/30 bg-success/5 px-2.5 py-1 text-[10.5px] text-success hover:bg-success/10">
                      <CheckCircle2 className="h-3 w-3" /> إغلاق
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
