// Minimal i18n for the app chrome (Arabic / Kurdish / English).
import { useSyncExternalStore } from "react";

export type Lang = "ar" | "ku" | "en";

const STRINGS: Record<Lang, Record<string, string>> = {
  ar: {
    search: "بحث...",
    uploadReport: "رفع تقرير",
    logout: "خروج",
    notifications: "التنبيهات",
    language: "اللغة",
    accessibility: "إمكانية الوصول",
    largeText: "خط كبير",
    highContrast: "تباين عالٍ",
    readAloud: "قراءة صوتية",
    offline: "لا يوجد اتصال — يتم الحفظ محليًا",
    synced: "عاد الاتصال — تمت المزامنة",
  },
  ku: {
    search: "گەڕان...",
    uploadReport: "بارکردنی راپۆرت",
    logout: "دەرچوون",
    notifications: "ئاگادارکردنەوەکان",
    language: "زمان",
    accessibility: "دەستڕاگەیشتن",
    largeText: "فۆنتی گەورە",
    highContrast: "کۆنتراستی بەرز",
    readAloud: "خوێندنەوە بەدەنگ",
    offline: "پەیوەندی نییە — بە شێوەی ناوخۆیی پاشەکەوت دەکرێت",
    synced: "پەیوەندی گەڕایەوە — هاوکاتکردن تەواو بوو",
  },
  en: {
    search: "Search...",
    uploadReport: "Upload report",
    logout: "Sign out",
    notifications: "Notifications",
    language: "Language",
    accessibility: "Accessibility",
    largeText: "Large text",
    highContrast: "High contrast",
    readAloud: "Read aloud",
    offline: "Offline — saving locally",
    synced: "Back online — synced",
  },
};

export const LANGS: { id: Lang; label: string; dir: "rtl" | "ltr" }[] = [
  { id: "ar", label: "العربية", dir: "rtl" },
  { id: "ku", label: "کوردی", dir: "rtl" },
  { id: "en", label: "English", dir: "ltr" },
];

type Prefs = { lang: Lang; largeText: boolean; highContrast: boolean };
const KEY = "ur-sehr-prefs-v1";

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return { lang: "ar", largeText: false, highContrast: false };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...{ lang: "ar", largeText: false, highContrast: false }, ...JSON.parse(raw) };
  } catch {}
  return { lang: "ar", largeText: false, highContrast: false };
}

let prefs: Prefs = loadPrefs();
const listeners = new Set<() => void>();

function apply() {
  if (typeof document === "undefined") return;
  document.documentElement.style.fontSize = prefs.largeText ? "118%" : "";
  document.documentElement.classList.toggle("high-contrast", prefs.highContrast);
  document.documentElement.lang = prefs.lang;
  document.documentElement.dir = LANGS.find((l) => l.id === prefs.lang)?.dir ?? "rtl";
}

export const prefsStore = {
  get: () => prefs,
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  set(patch: Partial<Prefs>) {
    prefs = { ...prefs, ...patch };
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch {}
    apply();
    listeners.forEach((l) => l());
  },
};

export function usePrefs(): Prefs {
  return useSyncExternalStore(prefsStore.subscribe, prefsStore.get, () => ({ lang: "ar" as Lang, largeText: false, highContrast: false }));
}

export function t(key: string): string {
  return STRINGS[prefs.lang][key] ?? STRINGS.ar[key] ?? key;
}

export function readAloud(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = prefs.lang === "en" ? "en-US" : prefs.lang === "ku" ? "ckb-IQ" : "ar-IQ";
  window.speechSynthesis.speak(u);
}

// Apply persisted prefs on module load (client only).
if (typeof window !== "undefined") apply();
