import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/research-answer")({
  server: { handlers: { POST: async ({ request }) => {
    try {
      const { answerResearch } = await import("@/lib/research-ai/answer.server");
      return await answerResearch(request);
    } catch (error) {
      if (request.signal.aborted || (error instanceof Error && error.name === "AbortError")) return new Response(null, { status: 499 });
      console.error("Research answer failed", error);
      return Response.json({ message: "تعذر تشغيل المساعد البحثي الآن." }, { status: 500 });
    }
  } } },
});