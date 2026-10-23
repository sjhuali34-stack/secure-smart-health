import { useEffect, useRef, useState } from "react";
import { Send, Square, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResearchFilters } from "@/lib/research-data";

export function ResearchAssistant({ filters, count }: { filters: ResearchFilters; count: number }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [stopped, setStopped] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const scope = JSON.stringify(filters);
  useEffect(() => {
    controller.current?.abort(); controller.current = null;
    setBusy(false); setAnswer(""); setReasoning(""); setError(""); setStopped(false);
    return () => { controller.current?.abort(); controller.current = null; };
  }, [scope]);

  async function ask() {
    const active = new AbortController(); controller.current = active;
    setBusy(true); setAnswer(""); setReasoning(""); setError(""); setStopped(false);
    let text = "";
    try {
      const response = await fetch("/api/research-answer", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, filters }), signal: active.signal });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message ?? "تعذر الحصول على الإجابة.");
      }
      if (!response.body) throw new Error("لم تصل إجابة من المساعد.");
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let pending = "";
      while (true) {
        const { value, done } = await reader.read();
        pending += decoder.decode(value, { stream: !done });
        const lines = pending.split("\n"); pending = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ") || line.slice(6).trim() === "[DONE]") continue;
          const event = JSON.parse(line.slice(6)) as { type: string; delta?: string; errorText?: string };
          if (controller.current !== active) return;
          if (event.type === "text-delta") { text += event.delta ?? ""; setAnswer(text); }
          if (event.type === "reasoning-delta") setReasoning(v => v + (event.delta ?? ""));
          if (event.type === "error") throw new Error(event.errorText ?? "تعذر إكمال الإجابة.");
        }
        if (done) break;
      }
      if (!text) throw new Error("لم ينتج المساعد إجابة؛ لم يتم إعادة الطلب تلقائيًا.");
    } catch (e) {
      if (controller.current !== active) return;
      if (active.signal.aborted) setStopped(true);
      else setError(e instanceof Error ? e.message : "تعذر إكمال الإجابة.");
    } finally {
      if (controller.current === active) { controller.current = null; setBusy(false); }
    }
  }

  return <section className="mt-5 border-t border-border pt-5" aria-label="المساعد البحثي">
    <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-primary" />المساعد البحثي</h2>
    <div className="mb-3 text-xs text-muted-foreground">مصدر الإجابة: {count} سجل ضمن التصفية الحالية · بيانات تجريبية مولّدة وليست سجلات فعلية</div>
    <form onSubmit={e => { e.preventDefault(); if (!busy && count && question.trim().length >= 2) void ask(); }} className="flex items-end gap-2">
      <div className="min-w-0 flex-1"><label htmlFor="research-question" className="mb-1 block text-xs">سؤال الباحث</label>
        <textarea id="research-question" value={question} onChange={e => setQuestion(e.target.value)} maxLength={1200} rows={3}
          placeholder="ما نسبة التطعيم، وما أبرز القيود على تفسيرها؟" disabled={busy}
          className="w-full resize-y rounded-md border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" /></div>
      {busy ? <Button type="button" variant="outline" onClick={() => controller.current?.abort()} aria-label="إيقاف الإجابة" title="إيقاف الإجابة"><Square />إيقاف</Button>
        : <Button type="submit" disabled={!count || question.trim().length < 2} aria-label="إرسال السؤال" title="إرسال السؤال"><Send /></Button>}
    </form>
    {!count && <p className="mt-2 text-sm text-muted-foreground">لا توجد نتائج للإجابة عنها.</p>}
    {busy && <p role="status" className="mt-3 text-xs text-muted-foreground">{answer ? "جارٍ إكمال الإجابة…" : "جارٍ تحليل النتائج المصفّاة…"}</p>}
    {reasoning && <details className="mt-3 text-xs text-muted-foreground"><summary>ملخص التحليل</summary><p className="mt-2 whitespace-pre-wrap">{reasoning}</p></details>}
    {answer && <div className="mt-4 whitespace-pre-wrap break-words border-s-2 border-primary ps-4 text-sm leading-7" aria-label="إجابة المساعد">{answer}</div>}
    {stopped && <p role="status" className="mt-2 text-xs text-muted-foreground">تم إيقاف الإجابة؛ النص الظاهر غير مكتمل.</p>}
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    <p className="mt-3 text-xs text-muted-foreground">الإجابات قد تخطئ؛ لا تمثل إحصاءات وطنية ولا تُستخدم للتشخيص أو اتخاذ قرار علاجي.</p>
  </section>;
}