import { useEffect, useState } from "react";
import { Globe, Accessibility, WifiOff, Volume2, Check } from "lucide-react";
import { toast } from "sonner";
import { LANGS, prefsStore, readAloud, t, usePrefs } from "@/lib/i18n";

export function LanguageSwitcher() {
  const prefs = usePrefs();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface hover:border-border-strong"
        aria-label={t("language")}
        title={t("language")}
      >
        <Globe className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-40 mt-2 w-44 overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-elevated)]">
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => { prefsStore.set({ lang: l.id }); setOpen(false); toast.success(l.label); }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-[12.5px] text-foreground hover:bg-muted"
              >
                {l.label}
                {prefs.lang === l.id && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function AccessibilityMenu() {
  const prefs = usePrefs();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface hover:border-border-strong"
        aria-label={t("accessibility")}
        title={t("accessibility")}
      >
        <Accessibility className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-[var(--shadow-elevated)]">
            <button
              onClick={() => prefsStore.set({ largeText: !prefs.largeText })}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[12.5px] text-foreground hover:bg-muted"
            >
              {t("largeText")}
              <span className={`h-4 w-7 rounded-full p-0.5 transition ${prefs.largeText ? "bg-primary" : "bg-muted"}`}>
                <span className={`block h-3 w-3 rounded-full bg-surface transition ${prefs.largeText ? "-translate-x-3" : ""}`} />
              </span>
            </button>
            <button
              onClick={() => prefsStore.set({ highContrast: !prefs.highContrast })}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[12.5px] text-foreground hover:bg-muted"
            >
              {t("highContrast")}
              <span className={`h-4 w-7 rounded-full p-0.5 transition ${prefs.highContrast ? "bg-primary" : "bg-muted"}`}>
                <span className={`block h-3 w-3 rounded-full bg-surface transition ${prefs.highContrast ? "-translate-x-3" : ""}`} />
              </span>
            </button>
            <button
              onClick={() => readAloud(document.title + ". " + (document.querySelector("h1")?.textContent ?? ""))}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] text-foreground hover:bg-muted"
            >
              <Volume2 className="h-3.5 w-3.5 text-primary" /> {t("readAloud")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function OfflineIndicator() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => { setOnline(true); toast.success(t("synced")); };
    const off = () => { setOnline(false); toast.warning(t("offline")); };
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  if (online) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-[11px] font-medium text-destructive">
      <WifiOff className="h-3.5 w-3.5" /> {t("offline")}
    </span>
  );
}
