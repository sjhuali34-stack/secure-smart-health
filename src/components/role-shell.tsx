import { Link } from "@tanstack/react-router";
import { Bell, Search, LogOut, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function RoleShell({
  icon: Icon,
  title,
  subtitle,
  tabs,
  active,
  onTab,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  tabs: { id: string; label: string; icon: LucideIcon }[];
  active: string;
  onTab: (id: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="ambient-bg min-h-screen" dir="rtl">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3.5 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background">
              <Icon className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold text-foreground">UR-SEHR</div>
              <div className="text-[10px] text-muted-foreground">{subtitle}</div>
            </div>
          </Link>
          <div className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="بحث..."
                className="w-full rounded-full border border-border bg-background py-2 pr-9 pl-4 text-sm outline-none transition focus:border-border-strong"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface hover:border-border-strong">
              <Bell className="h-4 w-4" />
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs hover:border-border-strong"
            >
              <LogOut className="h-3.5 w-3.5" /> خروج
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-1.5 rounded-2xl border border-border bg-surface p-1.5">
          {tabs.map((t) => {
            const TIcon = t.icon;
            const isActive = t.id === active;
            return (
              <button
                key={t.id}
                onClick={() => onTab(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-medium transition ${
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <TIcon className="h-3.5 w-3.5" /> {t.label}
              </button>
            );
          })}
        </div>

        <main>{children}</main>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-surface p-5 shadow-soft ${className}`}>
      {children}
    </div>
  );
}

export function Stat({
  icon: Icon,
  label,
  value,
  trend,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  tone?: "default" | "success" | "warn" | "danger";
}) {
  const toneCls =
    tone === "success"
      ? "text-success"
      : tone === "warn"
        ? "text-[oklch(0.7_0.15_70)]"
        : tone === "danger"
          ? "text-destructive"
          : "text-foreground";
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${toneCls}`} />
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      {trend && <div className="mt-1 text-[11px] text-muted-foreground">{trend}</div>}
    </Card>
  );
}

export function Row({
  title,
  meta,
  right,
  status,
  statusTone = "default",
}: {
  title: string;
  meta: string;
  right?: ReactNode;
  status?: string;
  statusTone?: "default" | "success" | "warn" | "danger" | "info";
}) {
  const tone =
    statusTone === "success"
      ? "bg-success/10 text-success"
      : statusTone === "warn"
        ? "bg-[oklch(0.95_0.1_70)] text-[oklch(0.5_0.15_70)]"
        : statusTone === "danger"
          ? "bg-destructive/10 text-destructive"
          : statusTone === "info"
            ? "bg-accent text-accent-foreground"
            : "bg-muted text-muted-foreground";
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{title}</div>
        <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{meta}</div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {status && (
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${tone}`}>{status}</span>
        )}
        {right}
      </div>
    </div>
  );
}
