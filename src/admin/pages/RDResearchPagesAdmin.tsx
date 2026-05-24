/**
 * RDResearchPagesAdmin — manage R&D research pages.
 *
 * Each row = one research entry. Shown as a card on /r&d, and as a full
 * detail page at /r&d/<slug>.
 *
 * Mirrors ProjectDetailPagesAdmin but with R&D-specific fields:
 * percent (progress 0–100), category, sections [{title, body}].
 */
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "../components/ImageUploader";

interface Section {
  title: string;
  body: string;
}

interface ResearchPage {
  id?: string;
  slug: string;
  title: string;
  category: string;
  percent: number;
  card_text: string;
  cover_image: string;
  tagline: string;
  intro: string;
  sections: Section[];
  sort_order: number;
  is_active: boolean;
}

const CATEGORIES = [
  "AI Architecture",
  "Marketing",
  "Operations",
  "Broadcasting",
  "Other",
];

const EMPTY: ResearchPage = {
  slug: "",
  title: "",
  category: "AI Architecture",
  percent: 0,
  card_text: "",
  cover_image: "",
  tagline: "",
  intro: "",
  sections: [],
  sort_order: 0,
  is_active: true,
};

const parseJsonArray = <T,>(s: unknown): T[] => {
  if (Array.isArray(s)) return s as T[];
  if (typeof s === "string") {
    try {
      const x = JSON.parse(s);
      return Array.isArray(x) ? (x as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default function RDResearchPagesAdmin() {
  const [rows, setRows] = useState<ResearchPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ResearchPage | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rd_research_pages")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else
      setRows(
        (data ?? []).map((r: any) => ({
          ...r,
          sections: parseJsonArray<Section>(r.sections),
        })) as ResearchPage[]
      );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setEditing({ ...EMPTY, sort_order: rows.length + 1 });
    setCreating(true);
  };
  const startEdit = (row: ResearchPage) => {
    setEditing({ ...row, sections: row.sections.map((s) => ({ ...s })) });
    setCreating(false);
  };
  const cancel = () => {
    setEditing(null);
    setCreating(false);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setError(null);

    const cleanSections = editing.sections
      .map((s) => ({ title: s.title.trim(), body: s.body.trim() }))
      .filter((s) => s.title || s.body);

    const payload = {
      slug: editing.slug,
      title: editing.title,
      category: editing.category || null,
      percent: Math.max(0, Math.min(100, Math.round(editing.percent))),
      card_text: editing.card_text || null,
      cover_image: editing.cover_image || null,
      tagline: editing.tagline || null,
      intro: editing.intro,
      sections: cleanSections,
      sort_order: editing.sort_order,
      is_active: editing.is_active,
      updated_at: new Date().toISOString(),
    };

    const { error } =
      creating || !editing.id
        ? await supabase.from("rd_research_pages").insert([payload])
        : await supabase
            .from("rd_research_pages")
            .update(payload)
            .eq("id", editing.id);

    if (error) {
      setError(error.message);
      return;
    }
    setEditing(null);
    setCreating(false);
    load();
  };

  const remove = async (row: ResearchPage) => {
    if (!row.id) return;
    if (!confirm(`Delete the "${row.title}" research page? This cannot be undone.`)) return;
    const { error } = await supabase
      .from("rd_research_pages")
      .delete()
      .eq("id", row.id);
    if (error) setError(error.message);
    else load();
  };

  // ---- Section helpers ----
  const addSection = () => {
    if (!editing) return;
    setEditing({
      ...editing,
      sections: [...editing.sections, { title: "", body: "" }],
    });
  };
  const updateSection = (i: number, patch: Partial<Section>) => {
    if (!editing) return;
    const next = [...editing.sections];
    next[i] = { ...next[i], ...patch };
    setEditing({ ...editing, sections: next });
  };
  const removeSection = (i: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      sections: editing.sections.filter((_, j) => j !== i),
    });
  };
  const moveSection = (i: number, dir: -1 | 1) => {
    if (!editing) return;
    const next = [...editing.sections];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setEditing({ ...editing, sections: next });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-medium">R&amp;D research pages</h1>
          <p className="text-white/60 text-sm mt-1">
            Each row is a public research detail page at{" "}
            <code>/r&amp;d/&lt;slug&gt;</code>. Add 2–3 demo entries to start.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium px-4 py-2 transition-colors"
        >
          + Add new
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm px-4 py-2">
          {error}
        </div>
      )}

      {/* Edit drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cancel} />
          <form
            onSubmit={save}
            className="relative w-full max-w-3xl bg-[#0c1428] border-l border-white/10 overflow-y-auto"
          >
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0c1428] z-10">
              <h2 className="text-lg font-medium">
                {creating ? "New research page" : `Edit: ${editing.title}`}
              </h2>
              <button
                type="button"
                onClick={cancel}
                className="text-white/60 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Slug (URL part)"
                  value={editing.slug}
                  onChange={(v) =>
                    setEditing({ ...editing, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })
                  }
                  placeholder="haptic-web-interfaces"
                />
                <Field
                  label="Research title"
                  value={editing.title}
                  onChange={(v) => setEditing({ ...editing, title: v })}
                  placeholder="Haptic Web Interfaces"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField
                  label="Category"
                  value={editing.category}
                  options={CATEGORIES}
                  onChange={(v) => setEditing({ ...editing, category: v })}
                />
                <Field
                  label="Progress %"
                  value={String(editing.percent)}
                  onChange={(v) => setEditing({ ...editing, percent: Number(v) || 0 })}
                  type="number"
                />
                <Field
                  label="Sort order"
                  value={String(editing.sort_order)}
                  onChange={(v) => setEditing({ ...editing, sort_order: Number(v) || 0 })}
                  type="number"
                />
              </div>

              <TextArea
                label="Card text (short, for /r&d listing)"
                value={editing.card_text}
                onChange={(v) => setEditing({ ...editing, card_text: v })}
                rows={2}
              />

              <ImageUploader
                label="Cover image (optional)"
                value={editing.cover_image}
                folder="research"
                onChange={(url) => setEditing({ ...editing, cover_image: url })}
              />

              <Field
                label="Tagline (optional, italic intro line)"
                value={editing.tagline}
                onChange={(v) => setEditing({ ...editing, tagline: v })}
                placeholder="A bold one-liner about the research."
              />

              <TextArea
                label="Intro paragraph"
                value={editing.intro}
                onChange={(v) => setEditing({ ...editing, intro: v })}
                rows={5}
              />

              {/* Sections editor */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white/70 text-xs uppercase tracking-wider">
                    Sections (chapters)
                  </label>
                  <button
                    type="button"
                    onClick={addSection}
                    className="text-xs px-3 py-1 rounded-lg border border-white/15 text-white/80 hover:bg-white/[0.05] transition-colors"
                  >
                    + Add section
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {editing.sections.map((section, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white/40 text-[10px] uppercase tracking-wider">
                          Section {i + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveSection(i, -1)}
                            disabled={i === 0}
                            className="text-white/60 hover:text-white disabled:opacity-30 text-xs px-2 py-1 rounded hover:bg-white/[0.05]"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(i, 1)}
                            disabled={i === editing.sections.length - 1}
                            className="text-white/60 hover:text-white disabled:opacity-30 text-xs px-2 py-1 rounded hover:bg-white/[0.05]"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSection(i)}
                            className="text-red-300 hover:text-red-200 text-xs px-2 py-1 rounded hover:bg-red-500/10"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Section title"
                        value={section.title}
                        onChange={(e) => updateSection(i, { title: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3 py-2 text-sm text-white mb-2 focus:outline-none focus:border-blue-400"
                      />
                      <textarea
                        placeholder="Section body. Multiple paragraphs supported — separate with a blank line."
                        value={section.body}
                        onChange={(e) => updateSection(i, { body: e.target.value })}
                        rows={6}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400 resize-y"
                      />
                    </div>
                  ))}
                  {editing.sections.length === 0 && (
                    <div className="text-white/40 text-xs italic">
                      No sections yet — click "+ Add section" above.
                    </div>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-sm text-white/80">
                  Active (visible at /r&amp;d/{editing.slug || "<slug>"})
                </span>
              </label>
            </div>

            <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-2 sticky bottom-0 bg-[#0c1428]">
              <button
                type="button"
                onClick={cancel}
                className="rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/[0.05] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium px-4 py-2 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-white/40 text-sm">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/50 text-sm">
          No research pages yet. Click <strong>+ Add new</strong>.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((row) => (
            <li
              key={row.id ?? row.slug}
              className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] px-4 py-3 transition-colors"
            >
              <div className="flex items-start gap-4">
                {row.cover_image ? (
                  <img
                    src={row.cover_image}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg border border-dashed border-white/15 shrink-0 flex items-center justify-center text-white/30 text-[9px] uppercase">
                    no img
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-white font-medium truncate">{row.title}</h3>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-200">
                      {row.category || "—"}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/15 text-white/70">
                      {row.percent}%
                    </span>
                    {!row.is_active && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/15 text-white/50">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="text-white/40 text-xs mt-1 font-mono truncate">
                    /r&amp;d/{row.slug}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(row)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/15 text-white/80 hover:bg-white/[0.05] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(row)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---- Field helpers (mirror the ones in ProjectDetailPagesAdmin) ----
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-colors"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-colors resize-y"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0c1428]">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
