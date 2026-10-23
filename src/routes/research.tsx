import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Microscope, BarChart3, Table2, FileText, Download, ShieldCheck, Users, Activity, Filter } from "lucide-react";
import { toast } from "sonner";
import { RoleShell, Card, Stat } from "@/components/role-shell";
import { PROV, DX, AGES, filterResearch, type Rec, type ResearchFilters } from "@/lib/research-data";
import { ResearchAssistant } from "@/components/research-assistant";

export const Route = createFileRoute("/research")({
  component: ResearchDashboard,
  head: () => ({
    meta: [
      { title: "البحث العلمي | UR-SEHR" },
      { name: "description", content: "لوحة البحث العلمي — بيانات صحية مجهولة الهوية مع مؤشرات وتصفية وتصدير." },
      { property: "og:title", content: "البحث العلمي | UR-SEHR" },
      { property: "og:description", content: "بيانات صحية مجهولة الهوية للباحثين مع مؤشرات وتصدير." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const TABS = [
  { id: "indicators", label: "المؤشرات", icon: BarChart3 },
  { id: "data", label: "البيانات", icon: Table2 },
  { id: "summary", label: "ملخص النتائج", icon: FileText },
];

const sel = "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none";

function countBy(rows: Rec[], k: keyof Rec) {
  const m: Record<string, number> = {};
  rows.forEach((r) => { const v = String(r[k]); m[v] = (m[v] || 0) + 1; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

function ResearchDashboard() {
  const [tab, setTab] = useState("indicators");
  const [f, setF] = useState<ResearchFilters>({ province: "", diagnosis: "", gender: "", ageGroup: "", year: "" });
  const rows = useMemo(() => filterResearch(f), [f]);

  const exportFile = (type: "csv" | "json") => {
    const cols: (keyof Rec)[] = ["code", "gender", "ageGroup", "province", "diagnosis", "vaccinated", "year", "outcome"];
    const body = type === "csv"
      ? "\uFEFF" + [cols.join(","), ...rows.map((r) => cols.map((c) => String(r[c])).join(","))].join("\n")
      : JSON.stringify(rows, null, 2);
    const blob = new Blob([body], { type: type === "csv" ? "text/csv;charset=utf-8" : "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `UR-SEHR-research-${Date.now()}.${type}`;
    a.click(); URL.revokeObjectURL(a.href);
    toast.success(`تم تصدير ${rows.length} سجل مجهول الهوية`);
  };

  const filters = (
    <Card className="mb-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[13px] font-semibold"><Filter className="h-4 w-4" /> تصفية النتائج</div>
        <div className="flex gap-2">
          <button onClick={() => setF({ province: "", diagnosis: "", gender: "", ageGroup: "", year: "" })} className="rounded-full border border-border px-3 py-1.5 text-xs">مسح</button>
          <button onClick={() => exportFile("csv")} className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><Download className="ml-1 inline h-3 w-3" />CSV</button>
          <button onClick={() => exportFile("json")} className="rounded-full border border-border px-3 py-1.5 text-xs"><Download className="ml-1 inline h-3 w-3" />JSON</button>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-5">
        <select aria-label="المحافظة" className={sel} value={f.province} onChange={(e) => setF({ ...f, province: e.target.value })}><option value="">كل المحافظات</option>{PROV.map((p) => <option key={p}>{p}</option>)}</select>
        <select aria-label="التشخيص" className={sel} value={f.diagnosis} onChange={(e) => setF({ ...f, diagnosis: e.target.value })}><option value="">كل التشخيصات</option>{DX.map((p) => <option key={p}>{p}</option>)}</select>
        <select aria-label="الجنس" className={sel} value={f.gender} onChange={(e) => setF({ ...f, gender: e.target.value })}><option value="">الجنسان</option><option>ذكر</option><option>أنثى</option></select>
        <select aria-label="الفئة العمرية" className={sel} value={f.ageGroup} onChange={(e) => setF({ ...f, ageGroup: e.target.value })}><option value="">كل الأعمار</option>{AGES.map((p) => <option key={p}>{p}</option>)}</select>
        <select aria-label="السنة" className={sel} value={f.year} onChange={(e) => setF({ ...f, year: e.target.value })}><option value="">كل السنوات</option>{[2022, 2023, 2024, 2025, 2026].map((p) => <option key={p}>{p}</option>)}</select>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-success" /> تمت إزالة الاسم والرقم الوطني والهاتف والعنوان — {rows.length} سجل مطابق</div>
    </Card>
  );

  const pct = (n: number) => rows.length ? Math.round((n / rows.length) * 100) : 0;
  const vacc = rows.filter((r) => r.vaccinated).length;
  const hosp = rows.filter((r) => r.outcome === "تنويم").length;
  const chronic = rows.filter((r) => r.outcome === "مزمن").length;
  const byDx = countBy(rows, "diagnosis");
  const byProv = countBy(rows, "province");
  const byAge = countBy(rows, "ageGroup");
  const byYear = countBy(rows, "year").sort((a, b) => a[0].localeCompare(b[0]));

  const Bars = ({ title, data }: { title: string; data: [string, number][] }) => {
    const max = Math.max(1, ...data.map((d) => d[1]));
    return (
      <Card>
        <div className="mb-3 text-[13px] font-semibold">{title}</div>
        {data.map(([k, v]) => (
          <div key={k} className="mb-2">
            <div className="flex justify-between text-[12px]"><span>{k}</span><span className="text-muted-foreground">{v} ({pct(v)}%)</span></div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(v / max) * 100}%` }} /></div>
          </div>
        ))}
        {!data.length && <div className="text-xs text-muted-foreground">لا توجد بيانات</div>}
      </Card>
    );
  };

  return (
    <RoleShell icon={Microscope} title="البحث العلمي" subtitle="بيانات مجهولة الهوية للباحثين المعتمدين"
      tabs={TABS} active={tab} onTab={setTab} roleId="research" reportKind="تقرير بحثي">
      {filters}
      <ResearchAssistant filters={f} count={rows.length} />
      {tab === "indicators" && (
        <>
          <div className="mb-4 grid gap-4 md:grid-cols-4">
            <Stat icon={Users} label="عدد السجلات" value={String(rows.length)} />
            <Stat icon={ShieldCheck} label="نسبة التطعيم" value={`${pct(vacc)}%`} tone="success" />
            <Stat icon={Activity} label="نسبة التنويم" value={`${pct(hosp)}%`} tone="danger" />
            <Stat icon={BarChart3} label="حالات مزمنة" value={`${pct(chronic)}%`} tone="warn" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Bars title="انتشار التشخيصات" data={byDx} />
            <Bars title="التوزيع حسب المحافظة" data={byProv} />
            <Bars title="الفئات العمرية" data={byAge} />
            <Bars title="الاتجاه السنوي" data={byYear} />
          </div>
        </>
      )}
      {tab === "data" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-[12px]">
              <thead className="text-muted-foreground"><tr>{["الرمز", "الجنس", "العمر", "المحافظة", "التشخيص", "مطعّم", "السنة", "النتيجة"].map((h) => <th key={h} className="border-b border-border py-2 font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {rows.slice(0, 100).map((r) => (
                  <tr key={r.code} className="border-b border-border last:border-0">
                    <td className="py-2 font-mono">{r.code}</td><td>{r.gender}</td><td>{r.ageGroup}</td><td>{r.province}</td>
                    <td>{r.diagnosis}</td><td>{r.vaccinated ? "نعم" : "لا"}</td><td>{r.year}</td><td>{r.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 100 && <div className="mt-3 text-[11px] text-muted-foreground">يُعرض أول 100 سجل — صدّر الملف لكامل النتائج ({rows.length}).</div>}
        </Card>
      )}
      {tab === "summary" && (
        <Card>
          <div className="mb-3 text-[13px] font-semibold">ملخص النتائج</div>
          {rows.length === 0 ? <div className="text-sm text-muted-foreground">لا توجد سجلات تطابق التصفية.</div> : (
            <ul className="list-disc space-y-2 pr-5 text-sm leading-relaxed">
              <li>شملت العينة <b>{rows.length}</b> سجلًا مجهول الهوية ({pct(rows.filter((r) => r.gender === "ذكر").length)}% ذكور).</li>
              <li>التشخيص الأكثر انتشارًا: <b>{byDx[0]?.[0]}</b> بنسبة {pct(byDx[0]?.[1] ?? 0)}%.</li>
              <li>المحافظة الأعلى تسجيلًا: <b>{byProv[0]?.[0]}</b> ({byProv[0]?.[1]} حالة).</li>
              <li>الفئة العمرية الأكثر تأثرًا: <b>{byAge[0]?.[0]}</b> سنة.</li>
              <li>نسبة التطعيم <b>{pct(vacc)}%</b>{pct(vacc) < 75 ? " — دون المستهدف الوطني (75%)، يُقترح إطلاق حملة تطعيم." : " — ضمن المستهدف الوطني."}</li>
              <li>نسبة التنويم <b>{pct(hosp)}%</b> والحالات المزمنة <b>{pct(chronic)}%</b>.</li>
            </ul>
          )}
          <button onClick={() => {
            const txt = `ملخص نتائج البحث — UR-SEHR\n${new Date().toLocaleString("ar")}\nعدد السجلات: ${rows.length}\nالتشخيص الأكثر: ${byDx[0]?.[0] ?? "-"}\nالمحافظة الأعلى: ${byProv[0]?.[0] ?? "-"}\nالتطعيم: ${pct(vacc)}%\nالتنويم: ${pct(hosp)}%\nمزمن: ${pct(chronic)}%\n`;
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob(["\uFEFF" + txt], { type: "text/plain;charset=utf-8" }));
            a.download = "UR-SEHR-research-summary.txt"; a.click();
            toast.success("تم تنزيل الملخص");
          }} className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"><Download className="ml-1 inline h-3 w-3" />تنزيل الملخص</button>
        </Card>
      )}
    </RoleShell>
  );
}
