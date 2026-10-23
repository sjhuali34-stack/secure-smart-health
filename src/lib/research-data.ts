import { z } from "zod";

export const PROV = ["بغداد", "البصرة", "نينوى", "أربيل", "النجف", "كربلاء"];
export const DX = ["سكري نوع 2", "ارتفاع ضغط الدم", "ربو", "إنفلونزا موسمية", "فقر الدم", "أمراض القلب"];
export const AGES = ["0-17", "18-39", "40-59", "60+"];
export type Rec = { code: string; gender: "ذكر" | "أنثى"; ageGroup: string; province: string; diagnosis: string; vaccinated: boolean; year: number; outcome: "تعافٍ" | "مزمن" | "تنويم" };
export const filtersSchema = z.object({
  province: z.string().refine(v => !v || PROV.includes(v)),
  diagnosis: z.string().refine(v => !v || DX.includes(v)),
  gender: z.string().refine(v => ["", "ذكر", "أنثى"].includes(v)),
  ageGroup: z.string().refine(v => !v || AGES.includes(v)),
  year: z.string().refine(v => ["", "2022", "2023", "2024", "2025", "2026"].includes(v)),
}).strict();
export type ResearchFilters = z.infer<typeof filtersSchema>;
const OUT: Rec["outcome"][] = ["تعافٍ", "مزمن", "تنويم"];
function seeded(n: number) { let s = n; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
export const DATA: Rec[] = (() => {
  const r = seeded(42);
  return Array.from({ length: 600 }, (_, i) => ({
    code: `ANON-${(100000 + i * 37).toString(36).toUpperCase()}`,
    gender: r() > 0.5 ? "ذكر" : "أنثى", ageGroup: AGES[Math.floor(r() * 4)],
    province: PROV[Math.floor(r() * PROV.length)], diagnosis: DX[Math.floor(r() * DX.length)],
    vaccinated: r() > 0.3, year: 2022 + Math.floor(r() * 5), outcome: OUT[Math.floor(r() * 3)],
  }));
})();
export function filterResearch(f: ResearchFilters) {
  return DATA.filter(r => (!f.province || r.province === f.province) && (!f.diagnosis || r.diagnosis === f.diagnosis) &&
    (!f.gender || r.gender === f.gender) && (!f.ageGroup || r.ageGroup === f.ageGroup) && (!f.year || String(r.year) === f.year));
}
export function researchContext(f: ResearchFilters) {
  const rows = filterResearch(f);
  const counts = (key: keyof Rec) => Object.fromEntries([...new Set(rows.map(r => String(r[key])))].map(v => [v, rows.filter(r => String(r[key]) === v).length]));
  return { source: "بيانات تجريبية مولّدة، وليست سجلات مواطنين حقيقية", filters: f, total: rows.length,
    vaccinated: rows.filter(r => r.vaccinated).length,
    percentVaccinated: rows.length ? Math.round(rows.filter(r => r.vaccinated).length / rows.length * 100) : 0,
    diagnosis: counts("diagnosis"), province: counts("province"), ageGroup: counts("ageGroup"),
    gender: counts("gender"), year: counts("year"), outcome: counts("outcome"),
    crossCounts: rows.reduce<Record<string, number>>((a, r) => {
      const key = JSON.stringify([r.province, r.diagnosis, r.gender, r.ageGroup, r.year, r.outcome, r.vaccinated]);
      a[key] = (a[key] ?? 0) + 1; return a;
    }, {}),
  };
}