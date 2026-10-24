// Environmental hazard report dialog — community health field workers
// photograph a polluted site and file a report straight to the ministry.
import { useRef, useState } from "react";
import { Camera, MapPin, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Modal, Field, TextArea, PrimaryButton, GhostButton } from "@/components/app-dialogs";
import { store, useStore } from "@/lib/app-store";
import { GOVERNORATES, HAZARD_META, type EnvHazardType, type EnvSeverity } from "@/lib/env-data";

const MAX_PHOTOS = 3;

// Downscale to a small JPEG data URL so localStorage stays within quota.
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, 480 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function EnvReportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const session = useStore((s) => s.session);
  const [type, setType] = useState<EnvHazardType>("waste");
  const [severity, setSeverity] = useState<EnvSeverity>("medium");
  const [governorate, setGovernorate] = useState("بغداد");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickPhoto = async (f: File | undefined) => {
    if (!f) return;
    if (photos.length >= MAX_PHOTOS) { toast.error(`الحد الأقصى ${MAX_PHOTOS} صور`); return; }
    setBusy(true);
    try {
      const dataUrl = await fileToDataUrl(f);
      setPhotos((p) => [...p, dataUrl]);
    } catch {
      toast.error("تعذّر قراءة الصورة");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setType("waste"); setSeverity("medium"); setGovernorate("بغداد");
    setLocation(""); setDescription(""); setPhotos([]);
  };

  const submit = () => {
    if (!location.trim() || !description.trim()) {
      toast.error("الموقع ووصف الخطر مطلوبان");
      return;
    }
    store.submitEnvReport({
      type, severity, governorate, location, description, photos,
      reporter: session?.name ?? "تقني صحة مجتمع",
    });
    toast.success("تم إرسال البلاغ البيئي إلى وزارة الصحة");
    onClose();
    reset();
  };

  return (
    <Modal open={open} onClose={onClose} title="بلاغ عن خطر بيئي" wide
      footer={<div className="flex justify-end gap-2"><GhostButton onClick={onClose}>إلغاء</GhostButton><PrimaryButton onClick={submit} disabled={busy}><Send className="h-3.5 w-3.5" /> إرسال للوزارة</PrimaryButton></div>}>
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-accent/40 p-3 text-[11.5px] text-muted-foreground">
          واجب صحة المجتمع الوقائي: وثّق الخطر بالصور والموقع، ويصل البلاغ فورًا إلى غرفة الترصد البيئي في وزارة الصحة.
        </div>

        <div>
          <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">نوع الخطر</div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(HAZARD_META) as EnvHazardType[]).map((k) => (
              <button key={k} onClick={() => setType(k)}
                className={`rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition ${type === k ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}>
                {HAZARD_META[k].label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="text-[11px] font-medium text-muted-foreground">المحافظة</div>
            <select value={governorate} onChange={(e) => setGovernorate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] text-foreground focus:border-primary focus:outline-none">
              {GOVERNORATES.map((g) => <option key={g.name} value={g.name}>{g.name}</option>)}
            </select>
          </label>
          <label className="block">
            <div className="text-[11px] font-medium text-muted-foreground">درجة الخطورة</div>
            <select value={severity} onChange={(e) => setSeverity(e.target.value as EnvSeverity)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] text-foreground focus:border-primary focus:outline-none">
              <option value="low">منخفض</option>
              <option value="medium">متوسط</option>
              <option value="high">مرتفع</option>
              <option value="critical">حرج</option>
            </select>
          </label>
        </div>

        <Field label="الموقع التفصيلي" value={location} onChange={setLocation} placeholder="مثلاً: حي الزهور — قرب محطة المياه القديمة" />
        <TextArea label="وصف الخطر" value={description} onChange={setDescription} rows={3} placeholder="ما الذي لاحظته؟ الحجم التقريبي، الأثر على السكان…" />

        <div>
          <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">صور الموقع ({photos.length}/{MAX_PHOTOS})</div>
          <div className="flex flex-wrap gap-2">
            {photos.map((p, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-xl border border-border">
                <img src={p} alt={`صورة البلاغ ${i + 1}`} className="h-full w-full object-cover" />
                <button onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))}
                  className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-foreground/70 text-background" aria-label="حذف الصورة">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button onClick={() => fileRef.current?.click()} disabled={busy}
                className="grid h-20 w-20 place-items-center rounded-xl border border-dashed border-border bg-background text-muted-foreground hover:border-border-strong hover:text-foreground">
                <Camera className="h-5 w-5" />
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={(e) => { void pickPhoto(e.target.files?.[0]); e.target.value = ""; }} />
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
            <MapPin className="h-3 w-3" /> يُرفق الموقع التقريبي تلقائيًا عند الإرسال من الميدان.
          </div>
        </div>
      </div>
    </Modal>
  );
}
