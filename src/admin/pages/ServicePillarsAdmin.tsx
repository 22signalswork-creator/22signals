/**
 * Service Pillars admin — manage the 6 detailed service entries
 * shown on /services. Each pillar has a title, tagline, body and
 * a list of label/text bullets.
 */
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

interface Bullet {
  label: string;
  text: string;
}

interface Pillar {
  id?: string;
  pillar_number: string;
  title: string;
  tagline: string;
  body: string;
  bullets: Bullet[];
  visual_key: string;
  sort_order: number;
  is_active: boolean;
}

const VISUAL_OPTIONS = [
  "digital",
  "creative",
  "broadcast",
  "manufacturing",
  "outsourcing",
  "game",
];

const EMPTY: Pillar = {
  pillar_number: "",
  title: "",
  tagline: "",
  body: "",
  bullets: [],
  visual_key: "digital",
  sort_order: 0,
  is_active: true,
};

const parseBullets = (b: unknown): Bullet[] => {
  if (Array.isArray(b)) return b as Bullet[];
  if (typeof b === "string") {
    try {
      const x = JSON.parse(b);
      return Array.isArray(x) ? x : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default function ServicePillarsAdmin() {
  const [rows, setRows] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Pillar | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("service_pillars")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else
      setRows(
        (data ?? []).map((r: any) => ({
          ...r,
          bullets: parseBullets(r.bullets),
        })) as Pillar[]
      );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (row: Pillar) => {
    setEditing({ ...row, bullets: [...row.bullets] });
    setCreating(false);
  };

  const startCreate = () => {
    setEditing({ ...EMPTY, sort_order: rows.length + 1 });
    setCreating(true);
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setError(null);

    const payload = {
      pillar_number: editing.pillar_number,
      title: editing.title,
      tagline: editing.tagline,
      body: editing.body,
      bullets: editing.bullets,
      visual_key: editing.visual_key,
      sort_order: editing.sort_order,
      is_active: editing.is_active,
    };

    const { error } =
      creating || !editing.id
        ? await supabase.from("service_pillars").insert([payload])
        : await supabase
            .from("service_pillars")
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

  const remove = async (row: Pillar) => {
    if (!row.id) return;
    if (!confirm(`Delete pillar "${row.title}"?`)) return;
    const { error } = await supabase
      .from("service_pillars")
      .delete()
      .eq("id", row.id);
    if (error) setError(error.message);
    else load();
  };

  // Bullet helpers (only used inside the editor)
  const updateBullet = (i: number, patch: Partial<Bullet>) => {
    if (!editing) return;
    const next = [...editing.bullets];
    next[i] = { ...next[i], ...patch };
    setEditing({ ...editing, bullets: next });
  };
  const addBullet = () => {
    if (!editing) return;
    setEditing({
      ...editing,
      bullets: [...editing.bullets, { label: "", text: "" }],
    });
  };
  const removeBullet = (i: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      bullets: editing.bullets.filter((_, j) => j !== i),
    });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-medium">Service pillars</h1>
          <p className="text-white/60 text-sm mt-1">
            The 6 detailed service entries on the <strong>/services</strong> page
            (the big cards with bullet lists).
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
            className="w-full sm:max-w-2xl bg-[#101218] border border-white/10 sm:rounded-2xl flex flex-col"
          >
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="text-base font-medium">
                {creating ? "New pillar" : `Edit pillar ${editing.pillar_number}`}
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
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Pillar number"
                  value={editing.pillar_number}
                  onChange={(v) =>
                    setEditing({ ...editing, pillar_number: v })
                  }
                  placeholder="01, 02, 03…"
                />
                <Field
                  label="Sort order"
                  type="number"
                  value={String(editing.sort_order)}
                  onChange={(v) =>
                    setEditing({ ...editing, sort_order: Number(v) })
                  }
                />
              </div>

              <Field
                label="Title"
                value={editing.title}
                onChange={(v) => setEditing({ ...editing, title: v })}
              />

              <Field
                label="Tagline (italic line)"
                value={editing.tagline}
                onChange={(v) => setEditing({ ...editing, tagline: v })}
              />

              <div>
                <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                  Body paragraph
                </label>
                <textarea
                  value={editing.body}
                  onChange={(e) =>
                    setEditing({ ...editing, body: e.target.value })
                  }
                  rows={5}
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-colors resize-y"
                />
              </div>

              <div>
                <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                  Visual style
                </label>
                <select
                  value={editing.visual_key}
                  onChange={(e) =>
                    setEditing({ ...editing, visual_key: e.target.value })
                  }
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  {VISUAL_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <div className="text-white/40 text-xs mt-1">
                  Picks which decorative graphic appears in the card header.
                </div>
              </div>

              {/* Bullets editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/70 text-xs uppercase tracking-wider">
                    Bullets
                  </label>
                  <button
                    type="button"
                    onClick={addBullet}
                    className="text-xs px-3 py-1 rounded-lg border border-white/15 text-white/80 hover:bg-white/[0.05] transition-colors"
                  >
                    + Add bullet
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {editing.bullets.map((b, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/40 text-[10px] uppercase tracking-wider">
                          Bullet {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeBullet(i)}
                          className="text-red-300 hover:text-red-200 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Label"
                        value={b.label}
                        onChange={(e) =>
                          updateBullet(i, { label: e.target.value })
                        }
                        className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3 py-1.5 text-sm text-white mb-2 focus:outline-none focus:border-blue-400"
                      />
                      <textarea
                        placeholder="Description text"
                        value={b.text}
                        onChange={(e) =>
                          updateBullet(i, { text: e.target.value })
                        }
                        rows={2}
                        className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-400 resize-y"
                      />
                    </div>
                  ))}
                  {editing.bullets.length === 0 && (
                    <div className="text-white/40 text-xs italic">
                      No bullets yet — click "+ Add bullet" above.
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
                  Active (visible on services page)
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
          No pillars yet. Click <strong>+ Add new</strong>.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((row) => (
            <li
              key={row.id ?? row.pillar_number}
              className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] px-4 py-3 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="text-blue-300 text-sm font-mono shrink-0 w-10">
                  {row.pillar_number}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">
                    {row.title}
                  </div>
                  <div className="text-xs text-white/45 truncate mt-0.5">
                    {row.tagline}
                  </div>
                  <div className="text-[10px] text-white/40 mt-1">
                    {row.bullets.length} bullets · visual: {row.visual_key} ·{" "}
                    {row.is_active ? "active" : "hidden"}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
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
