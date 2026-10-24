// Environmental surveillance data model + seed hotspots for the Iraq map.
// Coordinates are normalized (0..100) over the stylized Iraq SVG viewBox.

export type EnvHazardType =
  | "dust"        // عواصف ترابية
  | "water"       // تلوث مياه / شح
  | "air"         // تلوث هواء / غازات
  | "waste"       // نفايات / تسرب
  | "outbreak"    // بؤرة وبائية
  | "chemical";   // تسرب كيميائي

export type EnvSeverity = "low" | "medium" | "high" | "critical";

export type EnvHotspot = {
  id: string;
  type: EnvHazardType;
  governorate: string;
  title: string;
  detail: string;
  severity: EnvSeverity;
  x: number; // 0..100
  y: number; // 0..100
  cases?: number;
  trend?: "up" | "down" | "stable";
};

export const HAZARD_META: Record<EnvHazardType, { label: string; color: string; bg: string }> = {
  dust:     { label: "عواصف ترابية",   color: "oklch(0.62 0.14 70)",  bg: "oklch(0.95 0.06 70)" },
  water:    { label: "تلوث/شح مياه",   color: "oklch(0.55 0.15 220)", bg: "oklch(0.94 0.05 220)" },
  air:      { label: "تلوث هواء",      color: "oklch(0.5 0.08 280)",  bg: "oklch(0.94 0.04 280)" },
  waste:    { label: "نفايات وتسرب",   color: "oklch(0.55 0.14 145)", bg: "oklch(0.94 0.06 145)" },
  outbreak: { label: "بؤرة وبائية",    color: "oklch(0.58 0.22 27)",  bg: "oklch(0.94 0.05 27)" },
  chemical: { label: "تسرب كيميائي",   color: "oklch(0.55 0.16 320)", bg: "oklch(0.94 0.05 320)" },
};

export const SEVERITY_META: Record<EnvSeverity, { label: string; weight: number }> = {
  low:      { label: "منخفض",  weight: 1 },
  medium:   { label: "متوسط",  weight: 2 },
  high:     { label: "مرتفع",  weight: 3 },
  critical: { label: "حرج",    weight: 4 },
};

// Approximate governorate positions on the stylized map (0..100).
export const GOVERNORATES: { name: string; x: number; y: number }[] = [
  { name: "دهوك", x: 30, y: 6 },
  { name: "نينوى", x: 38, y: 16 },
  { name: "أربيل", x: 55, y: 12 },
  { name: "السليمانية", x: 62, y: 22 },
  { name: "كركوك", x: 52, y: 22 },
  { name: "صلاح الدين", x: 44, y: 30 },
  { name: "الأنبار", x: 22, y: 42 },
  { name: "ديالى", x: 58, y: 34 },
  { name: "بغداد", x: 48, y: 40 },
  { name: "بابل", x: 50, y: 50 },
  { name: "كربلاء", x: 42, y: 50 },
  { name: "النجف", x: 38, y: 58 },
  { name: "واسط", x: 58, y: 46 },
  { name: "القادسية", x: 48, y: 60 },
  { name: "المثنى", x: 38, y: 72 },
  { name: "ذي قار", x: 52, y: 70 },
  { name: "ميسان", x: 62, y: 62 },
  { name: "البصرة", x: 58, y: 84 },
];

export const SEED_HOTSPOTS: EnvHotspot[] = [
  { id: "HZ-1", type: "dust", governorate: "الأنبار", title: "عاصفة ترابية كثيفة", detail: "موجة غبار قادمة من الغرب — تحذير لمرضى الربو", severity: "high", x: 20, y: 40, cases: 340, trend: "up" },
  { id: "HZ-2", type: "dust", governorate: "النجف", title: "غبار متكرر", detail: "3 موجات هذا الشهر — ارتفاع مراجعات الجهاز التنفسي", severity: "medium", x: 36, y: 57, cases: 180, trend: "up" },
  { id: "HZ-3", type: "water", governorate: "البصرة", title: "ملوحة وتلوث مياه الشرب", detail: "ارتفاع الأملاح في شط العرب — حالات إسهال متزايدة", severity: "critical", x: 58, y: 85, cases: 1240, trend: "up" },
  { id: "HZ-4", type: "water", governorate: "ذي قار", title: "شح مياه الأهوار", detail: "انخفاض مناسيب المياه — تأثر الثروة الحيوانية والصحة", severity: "high", x: 50, y: 72, cases: 420, trend: "stable" },
  { id: "HZ-5", type: "air", governorate: "بغداد", title: "تلوث هواء — PM2.5 مرتفع", detail: "مولدات وازدحام — تجاوز الحدود الصحية 3 أيام", severity: "high", x: 48, y: 41, cases: 890, trend: "up" },
  { id: "HZ-6", type: "air", governorate: "كركوك", title: "حرق غاز مصاحب", detail: "انبعاثات حقول النفط — شكاوى تنفسية في القرى المجاورة", severity: "medium", x: 53, y: 23, cases: 150, trend: "stable" },
  { id: "HZ-7", type: "outbreak", governorate: "البصرة", title: "بؤرة حمى الضنك", detail: "48 حالة مؤكدة — مرتبطة بتكاثر البعوض في المياه الراكدة", severity: "critical", x: 60, y: 82, cases: 48, trend: "up" },
  { id: "HZ-8", type: "outbreak", governorate: "نينوى", title: "حصبة — مخيمات النازحين", detail: "12 حالة — حملة تطعيم جارية", severity: "medium", x: 40, y: 17, cases: 12, trend: "down" },
  { id: "HZ-9", type: "waste", governorate: "بغداد", title: "تراكم نفايات طبية", detail: "مكب غير نظامي قرب منشأة صحية — خطر تلوث", severity: "high", x: 50, y: 43, cases: 0, trend: "stable" },
  { id: "HZ-10", type: "chemical", governorate: "ميسان", title: "تسرب من منشأة صناعية", detail: "روائح كيميائية — فحص عينات الهواء جارٍ", severity: "high", x: 63, y: 63, cases: 65, trend: "up" },
  { id: "HZ-11", type: "water", governorate: "ديالى", title: "تلوث نهر ديالى", detail: "صرف صحي خام — إنذار للمناطق المستهلكة", severity: "medium", x: 59, y: 35, cases: 210, trend: "stable" },
  { id: "HZ-12", type: "dust", governorate: "المثنى", title: "تصحر وغبار موسمي", detail: "زحف رمال — تأثر مزارع ومناطق سكنية", severity: "medium", x: 37, y: 73, cases: 95, trend: "up" },
];

export function hotspotsByGovernorate(hotspots: EnvHotspot[]) {
  const map = new Map<string, EnvHotspot[]>();
  for (const h of hotspots) {
    const list = map.get(h.governorate) ?? [];
    list.push(h);
    map.set(h.governorate, list);
  }
  return map;
}

export function severityScore(h: EnvHotspot) {
  return SEVERITY_META[h.severity].weight;
}
