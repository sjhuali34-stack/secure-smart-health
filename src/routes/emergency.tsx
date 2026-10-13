import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity, Ambulance, Bed, AlertTriangle, Users, Siren, Heart, Plus, Minus, Hospital, Trash2, Send, Check,
} from "lucide-react";
import { toast } from "sonner";
import { RoleShell, Card, Stat } from "@/components/role-shell";
import { store } from "@/lib/app-store";

export const Route = createFileRoute("/emergency")({
  component: EmergencyDashboard,
  head: () => ({
    meta: [
      { title: "الطوارئ | UR-SEHR" },
      { name: "description", content: "وحدة الطوارئ — فرز الحالات وتتبع الإسعاف والأسرّة ووضع الكوارث." },
      { property: "og:title", content: "الطوارئ | UR-SEHR" },
      { property: "og:description", content: "وحدة الطوارئ — فرز الحالات وتتبع الإسعاف والأسرّة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const TABS = [
  { id: "triage", label: "الفرز", icon: Siren },
  { id: "ambulance", label: "سيارات الإسعاف", icon: Ambulance },
  { id: "beds", label: "الأسرّة", icon: Bed },
  { id: "disaster", label: "وضع الكوارث", icon: AlertTriangle },
];

type TriageColor = "red" | "orange" | "yellow" | "green";
const COLORS: { id: TriageColor; label: string; cls: string; dot: string }[] = [
  { id: "red", label: "أحمر — إنعاش فوري", cls: "text-destructive", dot: "bg-destructive" },
  { id: "orange", label: "برتقالي — عاجل جدًا", cls: "text-warning", dot: "bg-warning" },
  { id: "yellow", label: "أصفر — يمكن الانتظار", cls: "text-primary", dot: "bg-primary" },
  { id: "green", label: "أخضر — إصابات طفيفة", cls: "text-success", dot: "bg-success" },
];
type Case = { id: string; desc: string; complaint: string; color: TriageColor; at: number };
type Amb = { id: string; loc: string; status: "available" | "enroute" | "busy"; eta: number; task: string };
type Ward = { id: string; name: string; used: number; total: number };
type ER = { cases: Case[]; ambs: Amb[]; wards: Ward[]; disaster: boolean; casualties: Record<TriageColor, number> };

const INIT: ER = {
  cases: [
    { id: "ER-901", desc: "ذكر، 54 سنة", complaint: "ألم صدري · ECG غير طبيعي", color: "red", at: Date.now() },
    { id: "ER-902", desc: "أنثى، 32 سنة", complaint: "حادث مروري · كسور متعددة", color: "red", at: Date.now() },
    { id: "ER-903", desc: "ذكر، 8 سنوات", complaint: "ربو حاد · SpO₂ 89%", color: "orange", at: Date.now() },
    { id: "ER-904", desc: "أنثى، 67 سنة", complaint: "دوار وارتفاع ضغط", color: "yellow", at: Date.now() },
    { id: "ER-905", desc: "ذكر، 25 سنة", complaint: "جرح سطحي باليد", color: "green", at: Date.now() },
  ],
  ambs: [
    { id: "AMB-12", loc: "حي الجامعة", status: "enroute", eta: 4, task: "حالة قلبية" },
    { id: "AMB-07", loc: "شارع النصر", status: "enroute", eta: 11, task: "حادث مروري" },
    { id: "AMB-15", loc: "المستشفى", status: "available", eta: 0, task: "" },
    { id: "AMB-03", loc: "المستشفى", status: "available", eta: 0, task: "" },
  ],
  wards: [
    { id: "icu", name: "العناية المركزة", used: 9, total: 12 },
    { id: "adult", name: "طوارئ بالغين", used: 15, total: 20 },
    { id: "kids", name: "طوارئ أطفال", used: 4, total: 10 },
  ],
  disaster: false,
  casualties: { red: 0, orange: 0, yellow: 0, green: 0 },
};
const KEY = "ur-sehr-er-v1";

function useER() {
  const [s, setS] = useState<ER>(INIT);
  useEffect(() => {
    try { const r = localStorage.getItem(KEY); if (r) setS({ ...INIT, ...JSON.parse(r) }); } catch {}
  }, []);
  const update = (fn: (p: ER) => ER) => setS((p) => {
    const n = fn(p);
    try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {}
    return n;
  });
  return [s, update] as const;
}

const input = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-border-strong";
const btn = "rounded-full px-3 py-1.5 text-xs font-semibold";

function EmergencyDashboard() {
  const [tab, setTab] = useState("triage");
  const [s, update] = useER();
  return (
    <RoleShell icon={Activity} title="وحدة الطوارئ" subtitle="المستشفى المركزي · غرفة الفرز — مناوبة 24/7"
      tabs={TABS} active={tab} onTab={setTab} roleId="emergency" reportKind="تقرير طوارئ">
      {tab === "triage" && <Triage s={s} update={update} />}
      {tab === "ambulance" && <Ambulances s={s} update={update} />}
      {tab === "beds" && <Beds s={s} update={update} />}
      {tab === "disaster" && <Disaster s={s} update={update} />}
    </RoleShell>
  );
}

type P = { s: ER; update: (fn: (p: ER) => ER) => void };

function Triage({ s, update }: P) {
  const [desc, setDesc] = useState("");
  const [complaint, setComplaint] = useState("");
  const [color, setColor] = useState<TriageColor>("yellow");
  const free = s.wards.reduce((a, w) => a + w.total - w.used, 0);
  const order: TriageColor[] = ["red", "orange", "yellow", "green"];
  const sorted = [...s.cases].sort((a, b) => order.indexOf(a.color) - order.indexOf(b.color));

  const add = () => {
    if (!desc.trim() || !complaint.trim()) return toast.error("أدخل وصف المريض والشكوى");
    const c: Case = { id: `ER-${Math.floor(Math.random() * 9000 + 1000)}`, desc, complaint, color, at: Date.now() };
    update((p) => ({ ...p, cases: [c, ...p.cases] }));
    if (color === "red") store.broadcastAlert({ title: "حالة حرجة جديدة", body: `${c.id} — ${complaint}`, tone: "danger", targets: ["doctor", "nurse"] });
    toast.success(`تمت إضافة ${c.id}`);
    setDesc(""); setComplaint("");
  };
  const admit = (c: Case) => {
    const ward = s.wards.find((w) => w.used < w.total);
    if (!ward) return toast.error("لا توجد أسرّة شاغرة");
    update((p) => ({ ...p, cases: p.cases.filter((x) => x.id !== c.id), wards: p.wards.map((w) => w.id === ward.id ? { ...w, used: w.used + 1 } : w) }));
    toast.success(`تم تنويم ${c.id} في ${ward.name}`);
  };
  const discharge = (c: Case) => {
    update((p) => ({ ...p, cases: p.cases.filter((x) => x.id !== c.id) }));
    toast.success(`تم تخريج ${c.id}`);
  };

  return (
    <>
      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <Stat icon={Users} label="حالات الآن" value={String(s.cases.length)} />
        <Stat icon={Heart} label="حرجة" value={String(s.cases.filter((c) => c.color === "red").length)} tone="danger" />
        <Stat icon={AlertTriangle} label="عاجلة" value={String(s.cases.filter((c) => c.color === "orange" || c.color === "yellow").length)} tone="warn" />
        <Stat icon={Bed} label="أسرّة شاغرة" value={String(free)} tone="success" />
      </div>
      <Card>
        <div className="mb-3 text-[13px] font-semibold">تسجيل حالة جديدة</div>
        <div className="grid gap-2 md:grid-cols-4">
          <input className={input} placeholder="الوصف (مثال: ذكر، 40 سنة)" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <input className={input} placeholder="الشكوى / العلامات" value={complaint} onChange={(e) => setComplaint(e.target.value)} />
          <select className={input} value={color} onChange={(e) => setColor(e.target.value as TriageColor)}>
            {COLORS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <button onClick={add} className={`${btn} bg-primary text-primary-foreground`}><Plus className="ml-1 inline h-3 w-3" />إضافة</button>
        </div>
      </Card>
      <div className="mt-4" />
      <Card>
        {sorted.length === 0 && <div className="py-6 text-center text-sm text-muted-foreground">لا توجد حالات حالياً</div>}
        {sorted.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-3 last:border-0">
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${COLORS.find((x) => x.id === c.color)!.dot}`} />
              <div>
                <div className="text-sm font-medium">{c.id} — {c.desc}</div>
                <div className="text-[11px] text-muted-foreground">{c.complaint}</div>
              </div>
            </div>
            <div className="flex gap-1.5">
              <select aria-label="تغيير الفرز" className="rounded-md border border-border bg-background px-2 py-1 text-xs" value={c.color}
                onChange={(e) => update((p) => ({ ...p, cases: p.cases.map((x) => x.id === c.id ? { ...x, color: e.target.value as TriageColor } : x) }))}>
                {COLORS.map((x) => <option key={x.id} value={x.id}>{x.label.split(" — ")[0]}</option>)}
              </select>
              <button onClick={() => admit(c)} className={`${btn} border border-border`}><Bed className="ml-1 inline h-3 w-3" />تنويم</button>
              <button onClick={() => discharge(c)} className={`${btn} border border-border`}><Check className="ml-1 inline h-3 w-3" />تخريج</button>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}

function Ambulances({ s, update }: P) {
  const [loc, setLoc] = useState("");
  const [task, setTask] = useState("");
  const dispatch = () => {
    const a = s.ambs.find((x) => x.status === "available");
    if (!a) return toast.error("لا توجد سيارة إسعاف متاحة");
    if (!loc.trim()) return toast.error("أدخل موقع البلاغ");
    const eta = Math.floor(Math.random() * 12) + 3;
    update((p) => ({ ...p, ambs: p.ambs.map((x) => x.id === a.id ? { ...x, status: "enroute", loc, task: task || "بلاغ طارئ", eta } : x) }));
    toast.success(`تم إرسال ${a.id} إلى ${loc} — ETA ${eta}د`);
    setLoc(""); setTask("");
  };
  const next = (a: Amb) => {
    if (a.status === "enroute") {
      update((p) => ({ ...p, ambs: p.ambs.map((x) => x.id === a.id ? { ...x, status: "busy", eta: 0 } : x) }));
      toast.info(`${a.id} وصلت وتنقل المريض`);
    } else {
      update((p) => ({
        ...p,
        ambs: p.ambs.map((x) => x.id === a.id ? { ...x, status: "available", loc: "المستشفى", task: "" } : x),
        cases: [{ id: `ER-${Math.floor(Math.random() * 9000 + 1000)}`, desc: `وارد عبر ${a.id}`, complaint: a.task, color: "orange", at: Date.now() }, ...p.cases],
      }));
      toast.success(`${a.id} سلّمت المريض للفرز وأصبحت متاحة`);
    }
  };
  const label = { available: "متاحة", enroute: "في الطريق", busy: "تنقل مريضًا" };
  const tone = { available: "bg-success/10 text-success", enroute: "bg-destructive/10 text-destructive", busy: "bg-warning/10 text-warning" };
  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-3 text-[13px] font-semibold">إرسال سيارة إسعاف</div>
        <div className="grid gap-2 md:grid-cols-3">
          <input className={input} placeholder="موقع البلاغ" value={loc} onChange={(e) => setLoc(e.target.value)} />
          <input className={input} placeholder="نوع الحالة" value={task} onChange={(e) => setTask(e.target.value)} />
          <button onClick={dispatch} className={`${btn} bg-primary text-primary-foreground`}><Send className="ml-1 inline h-3 w-3" />إرسال أقرب سيارة</button>
        </div>
      </Card>
      <Card>
        {s.ambs.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-3 last:border-0">
            <div>
              <div className="text-sm font-medium">{a.id} · {a.loc}</div>
              <div className="text-[11px] text-muted-foreground">{a.status === "enroute" ? `ETA ${a.eta}د · ${a.task}` : a.task || "جاهزة للانطلاق"}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${tone[a.status]}`}>{label[a.status]}</span>
              {a.status !== "available" && (
                <button onClick={() => next(a)} className={`${btn} border border-border`}>{a.status === "enroute" ? "وصلت" : "تسليم للمستشفى"}</button>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function Beds({ s, update }: P) {
  const bump = (id: string, d: number) =>
    update((p) => ({ ...p, wards: p.wards.map((w) => w.id === id ? { ...w, used: Math.min(w.total, Math.max(0, w.used + d)) } : w) }));
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {s.wards.map((w) => {
        const pct = Math.round((w.used / w.total) * 100);
        return (
          <Card key={w.id}>
            <div className="text-xs text-muted-foreground">{w.name}</div>
            <div className="mt-2 text-3xl font-semibold">{w.used}/{w.total}</div>
            <div className={`mt-1 text-[11px] ${pct >= 85 ? "text-destructive" : pct >= 70 ? "text-warning" : "text-success"}`}>{pct}% إشغال</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full ${pct >= 85 ? "bg-destructive" : pct >= 70 ? "bg-warning" : "bg-success"}`} style={{ width: `${pct}%` }} /></div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => bump(w.id, 1)} className={`${btn} border border-border`}>إشغال سرير</button>
              <button onClick={() => bump(w.id, -1)} className={`${btn} border border-border`}>إخلاء سرير</button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function Disaster({ s, update }: P) {
  const total = Object.values(s.casualties).reduce((a, b) => a + b, 0);
  const free = s.wards.reduce((a, w) => a + w.total - w.used, 0);
  const needBeds = s.casualties.red + s.casualties.orange;
  const toggle = () => {
    const next = !s.disaster;
    update((p) => ({ ...p, disaster: next, casualties: next ? p.casualties : { red: 0, orange: 0, yellow: 0, green: 0 } }));
    if (next) {
      store.broadcastAlert({ title: "تفعيل وضع الكوارث", body: "تم تفعيل بروتوكول الإصابات الجماعية في المستشفى المركزي — على جميع الوحدات الاستعداد.", tone: "danger", targets: ["doctor", "nurse", "emergency", "ministry"] });
      toast.error("تم تفعيل وضع الكوارث وإشعار الوحدات");
    } else toast.success("تم إنهاء وضع الكوارث");
  };
  const bump = (c: TriageColor, d: number) => update((p) => ({ ...p, casualties: { ...p.casualties, [c]: Math.max(0, p.casualties[c] + d) } }));
  const sendAll = () => {
    const avail = s.ambs.filter((a) => a.status === "available");
    if (!avail.length) return toast.error("كل سيارات الإسعاف مشغولة");
    update((p) => ({ ...p, ambs: p.ambs.map((a) => a.status === "available" ? { ...a, status: "enroute", loc: "موقع الكارثة", task: "إصابات جماعية", eta: 8 } : a) }));
    toast.success(`تم إرسال ${avail.length} سيارة إسعاف لموقع الكارثة`);
  };
  const requestSupport = () => {
    store.broadcastAlert({ title: "طلب دعم أسرّة", body: `المستشفى المركزي يحتاج ${Math.max(0, needBeds - free)} سرير إضافي — يُرجى استقبال التحويلات.`, tone: "warn", targets: ["ministry", "emergency"] });
    toast.success("تم إرسال طلب الدعم للوزارة والمستشفيات");
  };
  const hospitals = [
    { name: "المستشفى المركزي", free, total: s.wards.reduce((a, w) => a + w.total, 0) },
    { name: "مستشفى بغداد التعليمي", free: 12, total: 40 },
    { name: "مستشفى الأطفال", free: 6, total: 10 },
  ];
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">وضع الكوارث {s.disaster && <span className="mr-2 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] text-destructive">مفعّل الآن</span>}</div>
            <div className="mt-1 text-xs text-muted-foreground">بروتوكول الإصابات الجماعية — فرز، إسعاف، أسرّة، ضغط المستشفيات</div>
          </div>
          <button onClick={toggle} className={`${btn} ${s.disaster ? "border border-border" : "bg-destructive text-destructive-foreground"}`}>{s.disaster ? "إنهاء الوضع" : "تفعيل"}</button>
        </div>
        {s.disaster && (
          <>
            <div className="mt-5 grid gap-3 text-center md:grid-cols-4">
              {COLORS.map((c) => (
                <div key={c.id} className="rounded-xl border border-border p-3">
                  <div className={`text-2xl font-semibold ${c.cls}`}>{s.casualties[c.id]}</div>
                  <div className="text-[11px] text-muted-foreground">{c.label}</div>
                  <div className="mt-2 flex justify-center gap-1.5">
                    <button onClick={() => bump(c.id, 1)} className="grid h-7 w-7 place-items-center rounded-md border border-border hover:bg-muted" aria-label={`إضافة ${c.label}`}><Plus className="h-3 w-3" /></button>
                    <button onClick={() => bump(c.id, -1)} className="grid h-7 w-7 place-items-center rounded-md border border-border hover:bg-muted" aria-label={`إنقاص ${c.label}`}><Minus className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2 text-[12px]">
              <span>الإجمالي: <b>{total}</b> · يحتاجون سريرًا: <b>{needBeds}</b> · الشاغر: <b>{free}</b>
                {needBeds > free && <span className="mr-2 text-destructive">عجز {needBeds - free} سرير</span>}</span>
              <div className="flex gap-2">
                <button onClick={sendAll} className={`${btn} bg-primary text-primary-foreground`}><Ambulance className="ml-1 inline h-3 w-3" />إرسال كل الإسعاف</button>
                <button onClick={requestSupport} className={`${btn} border border-border`}><Hospital className="ml-1 inline h-3 w-3" />طلب دعم أسرّة</button>
              </div>
            </div>
          </>
        )}
      </Card>
      {s.disaster && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <div className="mb-3 text-[13px] font-semibold">سيارات الإسعاف</div>
            {s.ambs.map((a) => (
              <div key={a.id} className="flex justify-between border-b border-border py-2 text-[12px] last:border-0">
                <span>{a.id} · {a.loc}</span>
                <span className="text-muted-foreground">{a.status === "available" ? "متاحة" : a.status === "enroute" ? `في الطريق · ${a.eta}د` : "تنقل مريضًا"}</span>
              </div>
            ))}
          </Card>
          <Card>
            <div className="mb-3 text-[13px] font-semibold">الضغط على المستشفيات</div>
            {hospitals.map((h) => {
              const pct = Math.round(((h.total - h.free) / h.total) * 100);
              return (
                <div key={h.name} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-[12px]"><span>{h.name}</span><span className="text-muted-foreground">شاغر {h.free}/{h.total}</span></div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full ${pct >= 85 ? "bg-destructive" : pct >= 70 ? "bg-warning" : "bg-success"}`} style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </Card>
        </div>
      )}
      {!s.disaster && <div className="text-center text-xs text-muted-foreground"><Trash2 className="hidden" />فعّل الوضع لبدء فرز الإصابات الجماعية.</div>}
    </div>
  );
}
