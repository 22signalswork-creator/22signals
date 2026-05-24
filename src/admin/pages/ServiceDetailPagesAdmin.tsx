/**
 * ServiceDetailPagesAdmin — manage the 8 service detail pages.
 *
 * Each page has: slug (URL part), number, title, tagline, intro,
 * and a list of sections. Each section has title, optional intro,
 * and a bulleted items list.
 */
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

interface Section {
  title: string;
  intro?: string;
  items: string[];
}

interface ServicePage {
  id?: string;
  slug: string;
  number: string;
  title: string;
  tagline: string;
  intro: string;
  sections: Section[];
  sort_order: number;
  is_active: boolean;
}

const EMPTY: ServicePage = {
  slug: "",
  number: "",
  title: "",
  tagline: "",
  intro: "",
  sections: [],
  sort_order: 0,
  is_active: true,
};

const parseSections = (s: unknown): Section[] => {
  if (Array.isArray(s)) return s as Section[];
  if (typeof s === "string") {
    try {
      const x = JSON.parse(s);
      return Array.isArray(x) ? x : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default function ServiceDetailPagesAdmin() {
  const [rows, setRows] = useState<ServicePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServicePage | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("service_detail_pages")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else
      setRows(
        (data ?? []).map((r: any) => ({
          ...r,
          sections: parseSections(r.sections),
        })) as ServicePage[]
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

  const startEdit = (row: ServicePage) => {
    setEditing({
      ...row,
      sections: row.sections.map((s) => ({
        title: s.title,
        intro: s.intro ?? "",
        items: [...s.items],
      })),
    });
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

    // Strip empty intros so they're stored as null
    const cleanSections = editing.sections.map((s) => ({
      title: s.title,
      intro: s.intro && s.intro.trim() ? s.intro : undefined,
      items: s.items.filter((it) => it.trim().length > 0),
    }));

    const payload = {
      slug: editing.slug,
      number: editing.number,
      title: editing.title,
      tagline: editing.tagline,
      intro: editing.intro,
      sections: cleanSections,
      sort_order: editing.sort_order,
      is_active: editing.is_active,
      updated_at: new Date().toISOString(),
    };

    const { error } =
      creating || !editing.id
        ? await supabase.from("service_detail_pages").insert([payload])
        : await supabase
            .from("service_detail_pages")
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

  const remove = async (row: ServicePage) => {
    if (!row.id) return;
    if (!confirm(`Delete the "${row.title}" page? This cannot be undone.`))
      return;
    const { error } = await supabase
      .from("service_detail_pages")
      .delete()
      .eq("id", row.id);
    if (error) setError(error.message);
    else load();
  };

  // Section helpers
  const addSection = () => {
    if (!editing) return;
    setEditing({
      ...editing,
      sections: [...editing.sections, { title: "", intro: "", items: [""] }],
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
  const updateItem = (sectionIdx: number, itemIdx: number, value: string) => {
    if (!editing) return;
    const next = [...editing.sections];
    const items = [...next[sectionIdx].items];
    items[itemIdx] = value;
    next[sectionIdx] = { ...next[sectionIdx], items };
    setEditing({ ...editing, sections: next });
  };
  const addItem = (sectionIdx: number) => {
    if (!editing) return;
    const next = [...editing.sections];
    next[sectionIdx] = {
      ...next[sectionIdx],
      items: [...next[sectionIdx].items, ""],
    };
    setEditing({ ...editing, sections: next });
  };
  const removeItem = (sectionIdx: number, itemIdx: number) => {
    if (!editing) return;
    const next = [...editing.sections];
    next[sectionIdx] = {
      ...next[sectionIdx],
      items: next[sectionIdx].items.filter((_, j) => j !== itemIdx),
    };
    setEditing({ ...editing, sections: next });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-medium">Service detail pages</h1>
          <p className="text-white/60 text-sm mt-1">
            Each row is a public page at <code>/services/&lt;slug&gt;</code>.
            Edit titles, intros, and sections. Sections support multiple
            bulleted items.
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

      {/* Edit panel */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-stretch justify-end p-0 sm:p-6">
          <form
            onSubmit={save}
            className="w-full sm:max-w-3xl bg-[#101218] border border-white/10 sm:rounded-2xl flex flex-col"
          >
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="text-base font-medium">
                {creating
                  ? "New service detail page"
                  : `Edit: ${editing.title}`}
              </div>
              <button
                type="button"
                onClick={cancel}
                className="text-white/50 hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-3">
                <Field
                  label="Number"
                  value={editing.number}
                  onChange={(v) => setEditing({ ...editing, number: v })}
                  placeholder="01"
                />
                <Field
                  label="URL slug"
                  value={editing.slug}
                  onChange={(v) =>
                    setEditing({
                      ...editing,
                      slug: v.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  placeholder="digital-solutions"
                />
                <Field
                  label="Sort order"
                  value={String(editing.sort_order)}
                  onChange={(v) =>
                    setEditing({ ...editing, sort_order: Number(v) })
                  }
                  type="number"
                />
              </div>

              <Field
                label="Title"
                value={editing.title}
                onChange={(v) => setEditing({ ...editing, title: v })}
              />

              <TextArea
                label="Tagline (italic line at top)"
                value={editing.tagline}
                onChange={(v) => setEditing({ ...editing, tagline: v })}
                rows={2}
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
                    Sections
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
                    <div
                      key={i}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                    >
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
                        onChange={(e) =>
                          updateSection(i, { title: e.target.value })
                        }
                        className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3 py-2 text-sm text-white mb-2 focus:outline-none focus:border-blue-400"
                      />

                      <textarea
                        placeholder="Optional intro text (e.g. 'For larger organisations…:')"
                        value={section.intro ?? ""}
                        onChange={(e) =>
                          updateSection(i, { intro: e.target.value })
                        }
                        rows={2}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3 py-2 text-sm text-white mb-3 focus:outline-none focus:border-blue-400 resize-y"
                      />

                      <div className="text-white/50 text-[10px] uppercase tracking-wider mb-2">
                        Bullet items
                      </div>
                      <div className="flex flex-col gap-2">
                        {section.items.map((item, j) => (
                          <div key={j} className="flex gap-2 items-start">
                            <span className="text-blue-400 mt-2.5">•</span>
                            <textarea
                              value={item}
                              onChange={(e) =>
                                updateItem(i, j, e.target.value)
                              }
                              rows={2}
                              className="flex-1 bg-white/[0.04] border border-white/15 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-400 resize-y"
                            />
                            <button
                              type="button"
                              onClick={() => removeItem(i, j)}
                              className="text-red-300 hover:text-red-200 text-xs px-2 self-start mt-2"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addItem(i)}
                          className="text-xs px-3 py-1 rounded-lg border border-white/15 text-white/80 hover:bg-white/[0.05] transition-colors w-fit mt-1"
                        >
                          + Add item
                        </button>
                      </div>
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
                  onChange={(e) =>
                    setEditing({ ...editing, is_active: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-sm text-white/80">
                  Active (visible at /services/{editing.slug || "<slug>"})
                </span>
              </label>
            </div>

            <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-2">
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

      {loading ? (
        <div className="text-white/40 text-sm">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/50 text-sm">
          No service detail pages yet. Click <strong>+ Add new</strong>.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((row) => (
            <li
              key={row.id ?? row.slug}
              className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] px-4 py-3 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="text-blue-300 text-sm font-mono shrink-0 w-10">
                  {row.number}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">
                    {row.title}
                  </div>
                  <div className="text-[10px] text-white/40 mt-1 font-mono">
                    /services/{row.slug}
                  </div>
                  <div className="text-[10px] text-white/40 mt-1">
                    {row.sections.length} section
                    {row.sections.length === 1 ? "" : "s"} ·{" "}
                    {row.sections.reduce((n, s) => n + s.items.length, 0)} bullets ·{" "}
                    {row.is_active ? "active" : "hidden"}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={`/services/${row.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/15 text-white/80 hover:bg-white/[0.05] transition-colors"
                  >
                    View ↗
                  </a>
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
      <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
        {label}
      </label>
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
      <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-colors resize-y"
      />
    </div>
  );
}
