/**
 * ImageUploader — uploads to Supabase Storage and returns the public URL.
 */
import { useState, type ChangeEvent } from "react";
import { uploadImage, deleteImage } from "@/lib/uploadImage";

interface Props {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "general",
  label = "Image",
}: Props) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const url = await uploadImage(file, folder);
      // Best-effort cleanup of the previous file
      if (value) {
        try {
          await deleteImage(value);
        } catch {
          /* ignore */
        }
      }
      onChange(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      // Reset the input so the same file can be re-uploaded if needed
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="flex items-start gap-3">
        {value ? (
          <img
            src={value}
            alt=""
            className="w-20 h-20 rounded-lg object-cover border border-white/15"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg border border-dashed border-white/15 flex items-center justify-center text-white/30 text-xs">
            none
          </div>
        )}
        <div className="flex-1 flex flex-col gap-2">
          <label className="inline-flex items-center justify-center cursor-pointer rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 px-3 py-2 text-sm text-white/80 w-fit">
            <input
              type="file"
              accept="image/*"
              onChange={onFile}
              disabled={busy}
              className="hidden"
            />
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          </label>
          {value && (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/60 font-mono"
              spellCheck={false}
            />
          )}
          {err && <div className="text-red-300 text-xs">{err}</div>}
        </div>
      </div>
    </div>
  );
}
