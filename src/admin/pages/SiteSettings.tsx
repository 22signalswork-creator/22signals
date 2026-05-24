/**
 * Site Settings editor — for the key/value `site_settings` table.
 * Loads all rows, lets you edit each value inline, save in bulk.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Setting {
  id?: string;
  key: string;
  value: string;
  type?: string;
}

const KNOWN_KEYS: { key: string; label: string; hint?: string }[] = [
  { key: "phone", label: "Phone number", hint: "Shown in footer contact" },
  { key: "email", label: "Email address", hint: "Shown in footer contact" },
  { key: "address", label: "Office address", hint: "Shown in footer contact" },
  { key: "footer_tagline", label: "Footer tagline" },
  { key: "footer_description", label: "Footer description" },
  { key: "copyright_year", label: "Copyright year" },
  {
    key: "home_video_url",
    label: "Home page video URL",
    hint: "Paste a YouTube link (e.g. https://youtu.be/VnRC8PyzBT8 or https://www.youtube.com/watch?v=…) OR a direct .mp4 link. Auto-detected.",
  },
];

export default function SiteSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error) setError(error.message);
    else {
      // Ensure known keys exist (as blanks) even if not yet inserted
      const map = new Map<string, Setting>();
      for (const row of (data ?? []) as Setting[]) map.set(row.key, row);
      for (const k of KNOWN_KEYS) {
        if (!map.has(k.key)) map.set(k.key, { key: k.key, value: "", type: "text" });
      }
      setSettings(Array.from(map.values()));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateValue = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
  };

  const save = async () => {
    setSaving(true);
    setError(null);

    // Upsert all rows (insert if new, update if exists)
    const payload = settings.map((s) => ({
      key: s.key,
      value: s.value,
      type: s.type ?? "text",
    }));
    const { error } = await supabase
      .from("site_settings")
      .upsert(payload, { onConflict: "key" });

    setSaving(false);
    if (error) setError(error.message);
    else {
      setSavedAt(new Date());
      load();
    }
  };

  if (loading) return <div className="text-white/40 text-sm">Loading…</div>;

  // Sort: known keys first in defined order, then any extras alphabetically
  const known = KNOWN_KEYS.map((k) => settings.find((s) => s.key === k.key)).filter(
    Boolean
  ) as Setting[];
  const extras = settings
    .filter((s) => !KNOWN_KEYS.some((k) => k.key === s.key))
    .sort((a, b) => a.key.localeCompare(b.key));

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium mb-1">Site settings</h1>
      <p className="text-white/60 text-sm mb-6">
        Global values used across the site (footer, copyright, contact info).
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm px-4 py-2">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-5">
        {known.map((s) => {
          const meta = KNOWN_KEYS.find((k) => k.key === s.key)!;
          return (
            <div key={s.key}>
              <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                {meta.label}
              </label>
              <input
                type="text"
                value={s.value}
                onChange={(e) => updateValue(s.key, e.target.value)}
                className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-colors"
              />
              <div className="text-white/30 text-[10px] mt-1 font-mono">
                key: {s.key}
                {meta.hint && <span className="ml-2">— {meta.hint}</span>}
              </div>
            </div>
          );
        })}

        {extras.length > 0 && (
          <>
            <div className="border-t border-white/10 mt-2 pt-4 text-white/50 text-xs uppercase tracking-wider">
              Other keys
            </div>
            {extras.map((s) => (
              <div key={s.key}>
                <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                  {s.key}
                </label>
                <input
                  type="text"
                  value={s.value}
                  onChange={(e) => updateValue(s.key, e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
            ))}
          </>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 transition-colors"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {savedAt && (
            <span className="text-emerald-300 text-xs">
              Saved at {savedAt.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
