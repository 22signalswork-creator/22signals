/**
 * ProjectDetailPagesAdmin — manage project case-study pages.
 *
 * Each page = one row in `project_detail_pages`.
 * Has: slug, client name, card text, category, cover image,
 *      tagline, intro, sections [{title, body}], up to 4 mockups,
 *      live URL, year, sort order, active flag.
 */
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "../components/ImageUploader";

interface Section {
  title: string;
  body: string;
}

interface ProjectPage {
  id?: string;
  slug: string;
  client_name: string;
  card_text: string;
  category: string;
  cover_image: string;
  tagline: string;
  intro: string;
  sections: Section[];
  mockups: string[];
  /**
   * Discipline tags shown on the portfolio card — e.g. "SEO", "AI",
   * "Web Development". Stored as a JSONB array of strings in
   * `project_detail_pages.tags`.
   *
   * The `category` is still the high-level filter (Digital & AI, Creative
   * & Marketing, etc.); `tags` are the granular labels rendered on each card
   * so visitors can see what disciplines the project drew on.
   */
  tags: string[];
  live_url: string;
  year: string;
  sort_order: number;
  is_active: boolean;
}

const CATEGORIES = [
  "Digital & AI",
  "Creative & Marketing",
  "Broadcasting & Esports",
  "Manufacturing",
  "Outsourcing",
  "Game Development",
];

/**
 * Suggested tags shown as quick-add chips in the admin. Admin can also type
 * any custom tag — the suggestions are just shortcuts.
 */
const SUGGESTED_TAGS = [
  "SEO",
  "AI",
  "Web Development",
  "Mobile App",
  "UI/UX",
  "Branding",
  "Content",
  "Paid Ads",
  "Esports",
  "Broadcasting",
  "Manufacturing",
  "Game Dev",
];

const MAX_MOCKUPS = 4;

const EMPTY: ProjectPage = {
  slug: "",
  client_name: "",
  card_text: "",
  category: "Digital & AI",
  cover_image: "",
  tagline: "",
  intro: "",
  sections: [],
  mockups: [],
  tags: [],
  live_url: "",
  year: "",
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

export default function ProjectDetailPagesAdmin() {
  const [rows, setRows] = useState<ProjectPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProjectPage | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("project_detail_pages")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else
      setRows(
        (data ?? []).map((r: any) => ({
          ...r,
          sections: parseJsonArray<Section>(r.sections),
          mockups: parseJsonArray<string>(r.mockups),
          tags: parseJsonArray<string>(r.tags),
        })) as ProjectPage[]
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

  const startEdit = (row: ProjectPage) => {
    setEditing({
      ...row,
      sections: row.sections.map((s) => ({ title: s.title, body: s.body })),
      mockups: [...row.mockups],
      tags: [...(row.tags ?? [])],
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

    const cleanSections = editing.sections
      .map((s) => ({ title: s.title.trim(), body: s.body.trim() }))
      .filter((s) => s.title || s.body);

    const cleanMockups = editing.mockups
      .filter((m) => m && m.trim())
      .slice(0, MAX_MOCKUPS);

    const cleanTags = (editing.tags ?? [])
      .map((t) => (t ?? "").trim())
      .filter(Boolean);

    const payload = {
      slug: editing.slug,
      client_name: editing.client_name,
      card_text: editing.card_text,
      category: editing.category,
      cover_image: editing.cover_image || null,
      tagline: editing.tagline || null,
      intro: editing.intro,
      sections: cleanSections,
      mockups: cleanMockups,
      tags: cleanTags,
      live_url: editing.live_url || null,
      year: editing.year || null,
      sort_order: editing.sort_order,
      is_active: editing.is_active,
      updated_at: new Date().toISOString(),
    };

    const { error } =
      creating || !editing.id
        ? await supabase.from("project_detail_pages").insert([payload])
        : await supabase
            .from("project_detail_pages")
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

  const remove = async (row: ProjectPage) => {
    if (!row.id) return;
    if (
      !confirm(`Delete the "${row.client_name}" project page? This cannot be undone.`)
    )
      return;
    const { error } = await supabase
      .from("project_detail_pages")
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

  // ---- Mockup helpers ----
  const setMockupAt = (idx: number, url: string) => {
    if (!editing) return;
    const next = [...editing.mockups];
    while (next.length <= idx) next.push("");
    next[idx] = url;
    setEditing({ ...editing, mockups: next });
  };
  const removeMockupAt = (idx: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      mockups: editing.mockups.filter((_, j) => j !== idx),
    });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-medium">Project detail pages</h1>
          <p className="text-white/60 text-sm mt-1">
            Each row is a public case study page at{" "}
            <code>/portfolio/&lt;slug&gt;</code>. Edit content, sections, and up
            to {MAX_MOCKUPS} mockup images per project.
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

      {/* ---- Edit drawer ---- */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={cancel}
          />
          <form
            onSubmit={save}
            className="relative w-full max-w-3xl bg-[#0c1428] border-l border-white/10 overflow-y-auto"
          >
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0c1428] z-10">
              <h2 className="text-lg font-medium">
                {creating ? "New project page" : `Edit: ${editing.client_name}`}
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
                  placeholder="bringardner"
                />
                <Field
                  label="Client name"
                  value={editing.client_name}
                  onChange={(v) => setEditing({ ...editing, client_name: v })}
                  placeholder="Bringardner Injury Law Firm"
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
                  label="Year"
                  value={editing.year}
                  onChange={(v) => setEditing({ ...editing, year: v })}
                  placeholder="2024"
                />
                <Field
                  label="Sort order"
                  value={String(editing.sort_order)}
                  onChange={(v) =>
                    setEditing({ ...editing, sort_order: Number(v) || 0 })
                  }
                  type="number"
                />
              </div>

              <Field
                label="Live URL (optional)"
                value={editing.live_url}
                onChange={(v) => setEditing({ ...editing, live_url: v })}
                placeholder="https://miradorlaw.com"
              />

              <TextArea
                label="Card text (short, for portfolio grid)"
                value={editing.card_text}
                onChange={(v) => setEditing({ ...editing, card_text: v })}
                rows={3}
              />

              <ImageUploader
                label="Cover image (used on hero + portfolio card)"
                value={editing.cover_image}
                folder="projects"
                onChange={(url) =>
                  setEditing({ ...editing, cover_image: url })
                }
              />

              {/* ----- Tags editor ----- */}
              <div>
                <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                  Tags (e.g., SEO, AI, Web Development)
                </label>
                <p className="text-white/40 text-xs mb-3">
                  Tags appear as small chips on the portfolio card. Click a
                  suggestion to add it, or type your own and press Enter.
                </p>

                {/* Active chips */}
                {editing.tags && editing.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {editing.tags.map((tag, i) => (
                      <span
                        key={`${tag}-${i}`}
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
                        style={{
                          background: "rgba(80,140,255,0.15)",
                          border: "1px solid rgba(80,140,255,0.4)",
                          color: "#bcd0ff",
                        }}
                      >
                        {tag}
                        <button
                          type="button"
                          aria-label={`Remove ${tag}`}
                          onClick={() =>
                            setEditing({
                              ...editing,
                              tags: editing.tags.filter((_, j) => j !== i),
                            })
                          }
                          className="text-white/60 hover:text-white"
                          style={{
                            background: "transparent",
                            padding: 0,
                            border: "none",
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add by typing */}
                <input
                  type="text"
                  placeholder="Type a tag and press Enter…"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 mb-3"
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    const input = e.currentTarget;
                    const val = input.value.trim();
                    if (!val) return;
                    if (!editing.tags.includes(val)) {
                      setEditing({
                        ...editing,
                        tags: [...editing.tags, val],
                      });
                    }
                    input.value = "";
                  }}
                />

                {/* Suggested chips */}
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TAGS.filter(
                    (t) => !editing.tags.includes(t)
                  ).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setEditing({ ...editing, tags: [...editing.tags, t] })
                      }
                      className="rounded-full px-3 py-1 text-xs hover:opacity-90 transition-opacity"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      + {t}
                    </button>
                  ))}
                </div>
              </div>

              <Field
                label="Tagline (optional, italic intro line)"
                value={editing.tagline}
                onChange={(v) => setEditing({ ...editing, tagline: v })}
                placeholder="A bold one-liner about the project."
              />

              <TextArea
                label="Intro paragraph"
                value={editing.intro}
                onChange={(v) => setEditing({ ...editing, intro: v })}
                rows={5}
              />

              {/* Mockups (up to 4) */}
              <div>
                <label className="block text-white/70 text-xs uppercase tracking-wider mb-3">
                  Mockup images (up to {MAX_MOCKUPS}, optional)
                </label>
                <p className="text-white/40 text-xs mb-4">
                  Leave any of them empty — the public page hides empty slots
                  and the entire mockup section if none are uploaded.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: MAX_MOCKUPS }).map((_, i) => {
                    const url = editing.mockups[i] ?? "";
                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/40 text-[10px] uppercase tracking-wider">
                            Mockup {i + 1}
                          </span>
                          {url && (
                            <button
                              type="button"
                              onClick={() => removeMockupAt(i)}
                              className="text-red-300 hover:text-red-200 text-xs"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <ImageUploader
                          label=""
                          value={url}
                          folder="project-mockups"
                          onChange={(u) => setMockupAt(i, u)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sections editor */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white/70 text-xs uppercase tracking-wider">
                    Sections (case-study chapters)
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
                        placeholder="Section title (e.g., 'Managed Services')"
                        value={section.title}
                        onChange={(e) =>
                          updateSection(i, { title: e.target.value })
                        }
                        className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3 py-2 text-sm text-white mb-2 focus:outline-none focus:border-blue-400"
                      />

                      <textarea
                        placeholder="Section body. Multiple paragraphs supported — separate them with a blank line."
                        value={section.body}
                        onChange={(e) =>
                          updateSection(i, { body: e.target.value })
                        }
                        rows={8}
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
                  onChange={(e) =>
                    setEditing({ ...editing, is_active: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-sm text-white/80">
                  Active (visible at /portfolio/{editing.slug || "<slug>"})
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

      {/* ---- List ---- */}
      {loading ? (
        <div className="text-white/40 text-sm">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/50 text-sm">
          No project pages yet. Click <strong>+ Add new</strong>.
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
                    <h3 className="text-white font-medium truncate">
                      {row.client_name}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-200">
                      {row.category}
                    </span>
                    {!row.is_active && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/15 text-white/50">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="text-white/40 text-xs mt-1 font-mono truncate">
                    /portfolio/{row.slug}
                  </div>
                  <div className="text-white/50 text-xs mt-2 flex gap-4">
                    <span>{row.sections.length} section(s)</span>
                    <span>{row.mockups.length} mockup(s)</span>
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

// ---- Field helpers ----

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
      <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
        {label}
      </label>
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
