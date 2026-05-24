/**
 * Page Content editor — edits the `page_content` table.
 *
 * Each row is a key/value pair with a human-readable label and
 * a `page` group. The UI groups rows by page so editors can
 * scan and update all text on a given page in one place.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { invalidatePageContent } from "@/hooks/usePageContent";

interface Row {
  id?: string;
  key: string;
  value: string;
  page: string;
  label: string;
  type: "text" | "textarea";
  sort_order: number;
}

const PAGE_LABELS: Record<string, string> = {
  home: "Home page",
  services: "Services page",
  portfolio: "Portfolio page",
  team: "Team page",
  blog: "Blog page",
  contact: "Contact page",
  global: "Global (footer, headers, shared)",
};

export default function PageContentAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("page_content")
      .select("*")
      .order("page", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setRows((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateValue = (key: string, value: string) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, value } : r)));
  };

  const save = async () => {
    setSaving(true);
    setError(null);

    const payload = rows.map((r) => ({
      id: r.id,
      key: r.key,
      value: r.value,
      page: r.page,
      label: r.label,
      type: r.type,
      sort_order: r.sort_order,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("page_content")
      .upsert(payload, { onConflict: "key" });

    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setSavedAt(new Date());
      invalidatePageContent();   // public site pulls fresh values on next render
    }
  };

  if (loading) return <div className="text-white/40 text-sm">Loading…</div>;

  // Group rows by page
  const grouped: Record<string, Row[]> = {};
  for (const r of rows) {
    const k = r.page || "other";
    (grouped[k] ??= []).push(r);
  }
  const orderedPages = ["home", "services", "portfolio", "team", "blog", "contact", "global"]
    .filter((p) => grouped[p])
    .concat(Object.keys(grouped).filter((p) => !["home","services","portfolio","team","blog","contact","global"].includes(p)));

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-medium">Page text</h1>
          <p className="text-white/60 text-sm mt-1">
            Every editable headline, paragraph and label across the site, grouped by page.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {savedAt && (
            <span className="text-emerald-300 text-xs">
              Saved {savedAt.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 transition-colors"
          >
            {saving ? "Saving…" : "Save all changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm px-4 py-2">
          {error}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/50 text-sm">
          No page content yet. Run <code>supabase_extension.sql</code> first.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orderedPages.map((page) => (
            <section
              key={page}
              className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-white/10 bg-white/[0.03]">
                <div className="text-sm font-medium">
                  {PAGE_LABELS[page] ?? page}
                </div>
                <div className="text-white/40 text-[11px] mt-0.5">
                  {grouped[page].length} field{grouped[page].length === 1 ? "" : "s"}
                </div>
              </div>

              <div className="p-5 flex flex-col gap-5">
                {grouped[page].map((r) => (
                  <div key={r.key}>
                    <label className="block text-white/80 text-sm mb-2">
                      {r.label || r.key}
                    </label>
                    {r.type === "textarea" ? (
                      <textarea
                        value={r.value ?? ""}
                        onChange={(e) => updateValue(r.key, e.target.value)}
                        rows={3}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-colors resize-y"
                      />
                    ) : (
                      <input
                        type="text"
                        value={r.value ?? ""}
                        onChange={(e) => updateValue(r.key, e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-colors"
                      />
                    )}
                    <div className="text-white/30 text-[10px] mt-1 font-mono">
                      key: {r.key}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="h-20" />
    </div>
  );
}
