// Drug safety engine: allergy checks + drug–drug interaction database.
// Prototype-grade reference data for the UR-SEHR demo.

export type SafetyIssue = {
  severity: "critical" | "warning";
  title: string;
  detail: string;
  suggestion?: string;
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// Known interacting pairs (normalized substrings of drug names).
const INTERACTIONS: { a: string; b: string; severity: "critical" | "warning"; detail: string; suggestion?: string }[] = [
  { a: "warfarin", b: "aspirin", severity: "critical", detail: "وارفارين + أسبرين — خطر نزيف مرتفع", suggestion: "تجنّب الجمع أو مراقبة INR بشكل مكثّف" },
  { a: "warfarin", b: "ibuprofen", severity: "critical", detail: "وارفارين + إيبوبروفين — مضادات الالتهاب ترفع خطر النزيف", suggestion: "استخدم باراسيتامول كبديل للألم" },
  { a: "metformin", b: "contrast", severity: "warning", detail: "ميتفورمين + صبغة أشعة — خطر حماض لبني", suggestion: "إيقاف ميتفورمين 48 ساعة حول التصوير بالصبغة" },
  { a: "atorvastatin", b: "clarithromycin", severity: "warning", detail: "أتورفاستاتين + كلاريثروميسين — خطر انحلال العضلات", suggestion: "إيقاف الستاتين مؤقتًا أثناء المضاد الحيوي" },
  { a: "losartan", b: "potassium", severity: "warning", detail: "لوسارتان + مكملات البوتاسيوم — فرط بوتاسيوم الدم", suggestion: "مراقبة K+ دوريًا" },
  { a: "insulin", b: "betablocker", severity: "warning", detail: "إنسولين + حاصرات بيتا — قد يُخفي أعراض هبوط السكر" },
  { a: "amoxicillin", b: "methotrexate", severity: "warning", detail: "أموكسيسيلين + ميثوتريكسات — يرفع سمية الميثوتريكسات" },
  { a: "omeprazole", b: "clopidogrel", severity: "warning", detail: "أوميبرازول + كلوبيدوغريل — يقلل فعالية مميّع الدم", suggestion: "استخدم بانتوبرازول بدلًا منه" },
];

// Allergy groups: if patient is allergic to the group, any drug matching `drugs` triggers a critical issue.
const ALLERGY_GROUPS: { allergy: string; drugs: string[]; detail: string; suggestion: string }[] = [
  { allergy: "penicillin", drugs: ["amoxicillin", "ampicillin", "penicillin", "augmentin"], detail: "المريض لديه حساسية موثّقة من البنسلين — قد يحدث تفاعل تحسسي خطير", suggestion: "اختر بديلًا غير بنسليني (مثلاً Azithromycin)" },
  { allergy: "sulfa", drugs: ["sulfamethoxazole", "cotrimoxazole"], detail: "حساسية سلفا موثّقة في الملف", suggestion: "تجنّب مشتقات السلفا" },
  { allergy: "nsaid", drugs: ["ibuprofen", "aspirin", "diclofenac", "naproxen"], detail: "حساسية من مضادات الالتهاب غير الستيرويدية", suggestion: "استخدم باراسيتامول" },
];

export function checkDrugSafety(meds: string[], allergies: string[] = ["penicillin"]): SafetyIssue[] {
  const issues: SafetyIssue[] = [];
  const names = meds.map(norm);
  const allergyNorm = allergies.map(norm);

  // allergy checks
  for (const g of ALLERGY_GROUPS) {
    if (!allergyNorm.some((a) => a.includes(norm(g.allergy)) || norm(g.allergy).includes(a))) continue;
    for (const d of g.drugs) {
      const hit = meds.find((_, i) => names[i].includes(d));
      if (hit) {
        issues.push({ severity: "critical", title: `حساسية — ${hit}`, detail: g.detail, suggestion: g.suggestion });
      }
    }
  }

  // pairwise interactions
  for (const inter of INTERACTIONS) {
    const ma = meds.find((_, i) => names[i].includes(inter.a));
    const mb = meds.find((_, i) => names[i].includes(inter.b));
    if (ma && mb && ma !== mb) {
      issues.push({ severity: inter.severity, title: `تداخل دوائي — ${ma} + ${mb}`, detail: inter.detail, suggestion: inter.suggestion });
    }
  }

  return issues;
}
