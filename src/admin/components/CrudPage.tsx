/**
 * CrudPage — a generic table editor configured via a `Field[]` schema.
 *
 * Renders a list of rows from a Supabase table with inline edit/create/delete.
 * Use this for simple flat tables; fall back to a custom page when a table
 * needs special UI (e.g. hero_section, site_settings).
 */
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "./ImageUploader";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "image"
  | "select"
  | "date";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];        // for select
  folder?: string;           // for image (Storage subfolder)
  rows?: number;             // for textarea
  placeholder?: string;
  defaultValue?: unknown;
  preview?: boolean;         // show this field as a card preview value
}

export interface CrudConfig {
  table: string;
  title: string;
  description?: string;
  fields: Field[];
  /** Column to sort by in the listing (e.g. "sort_order", "created_at") */
  defaultSort?: string;
  defaultSortAscending?: boolean;
  /** Optional fixed filter applied to all queries (e.g. { page: "home" }) */
  filter?: Record<string, unknown>;
}

type Row = Record<string, unknown> & { id?: string | number };

export default function CrudPage({ config }: { config: CrudConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);

  const filterKey = JSON.stringify(config.filter ?? {});

  const fetchRows = async () => {
    setLoading(true);
    let q = supabase.from(config.table).select("*");
    if (config.filter) {
      for (const [k, v] of Object.entries(config.filter)) {
        q = q.eq(k, v as never);
      }
    }
    if (config.defaultSort) {
      q = q.order(config.defaultSort, {
        ascending: config.defaultSortAscending ?? true,
      });
    }
    const { data, error } = await q;
    if (error) setError(error.message);
    else setRows((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.table, filterKey]);

  const startCreate = () => {
    const blank: Row = {};
    for (const f of config.fields) {
      blank[f.name] = f.defaultValue ?? defaultForType(f.type);
    }
    if (config.filter) Object.assign(blank, config.filter);
    setEditing(blank);
    setCreating(true);
  };

  const startEdit = (row: Row) => {
    setEditing({ ...row });
    setCreating(false);
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
  };

  const save = async () => {
    if (!editing) return;
    const payload: Row = {};
    for (const f of config.fields) {
      payload[f.name] = editing[f.name];
    }
    if (config.filter) Object.assign(payload, config.filter);

    const { error } =
      creating || !editing.id
        ? await supabase.from(config.table).insert([payload])
        : await supabase
            .from(config.table)
            .update(payload)
            .eq("id", editing.id);

    if (error) {
      setError(error.message);
      return;
    }
    setEditing(null);
    setCreating(false);
    setError(null);
    fetchRows();
  };

  const remove = async (row: Row) => {
    if (!row.id) return;
    if (!confirm("Delete this row? This cannot be undone.")) return;
    const { error } = await supabase
      .from(config.table)
      .delete()
      .eq("id", row.id);
    if (error) setError(error.message);
    else fetchRows();
  };

  const previewFields = useMemo(
    () => config.fields.filter((f) => f.preview),
    [config.fields]
  );

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-medium">{config.title}</h1>
          {config.description && (
            <p className="text-white/60 text-sm mt-1">{config.description}</p>
          )}
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

      {/* Edit modal (slide-in panel style, inline) */}
      {editing && (
        <EditPanel
          fields={config.fields}
          row={editing}
          onChange={(next) => setEditing(next)}
          onSave={save}
          onCancel={cancel}
          isNew={creating}
          title={creating ? `New ${config.title.toLowerCase()}` : `Edit ${config.title.toLowerCase()}`}
        />
      )}

      {loading ? (
        <div className="text-white/40 text-sm">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/50 text-sm">
          No rows yet. Click <strong>+ Add new</strong> to create one.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((row, idx) => (
            <li
              key={String(row.id ?? idx)}
              className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] px-4 py-3 flex items-center gap-4 transition-colors"
            >
              {previewFields.map((f) => (
                <PreviewCell key={f.name} field={f} value={row[f.name]} />
              ))}
              <div className="ml-auto flex gap-2 shrink-0">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function defaultForType(t: FieldType): unknown {
  switch (t) {
    case "boolean":
      return false;
    case "number":
      return 0;
    default:
      return "";
  }
}

function PreviewCell({ field, value }: { field: Field; value: unknown }) {
  if (field.type === "image") {
    return value ? (
      <img
        src={value as string}
        alt=""
        className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
      />
    ) : (
      <div className="w-12 h-12 rounded-lg border border-dashed border-white/15 shrink-0" />
    );
  }
  if (field.type === "boolean") {
    return (
      <span
        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${
          value
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            : "bg-white/[0.04] border-white/15 text-white/50"
        }`}
      >
        {value ? "Yes" : "No"}
      </span>
    );
  }
  return (
    <div className="min-w-0 flex-shrink truncate text-sm text-white/85">
      <span className="text-white/40 text-[10px] uppercase tracking-wider mr-2">
        {field.label}
      </span>
      {String(value ?? "")}
    </div>
  );
}

interface EditPanelProps {
  fields: Field[];
  row: Row;
  onChange: (next: Row) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew: boolean;
  title: string;
}

function EditPanel({
  fields,
  row,
  onChange,
  onSave,
  onCancel,
  title,
}: EditPanelProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-stretch justify-end p-0 sm:p-6">
      <div className="w-full sm:max-w-lg bg-[#101218] border border-white/10 sm:rounded-2xl flex flex-col">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="text-base font-medium">{title}</div>
          <button
            onClick={onCancel}
            className="text-white/50 hover:text-white text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          {fields.map((f) => (
            <FieldInput
              key={f.name}
              field={f}
              value={row[f.name]}
              onChange={(v) => onChange({ ...row, [f.name]: v })}
            />
          ))}
        </div>

        <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/[0.05] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium px-4 py-2 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const baseInput =
    "w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 transition-colors";

  if (field.type === "image") {
    return (
      <ImageUploader
        label={field.label}
        value={(value as string) || ""}
        folder={field.folder ?? "general"}
        onChange={onChange}
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 accent-blue-500"
        />
        <span className="text-sm text-white/80">{field.label}</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
          {field.label}
        </label>
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
        >
          <option value="">— select —</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
          {field.label}
        </label>
        <textarea
          rows={field.rows ?? 4}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseInput + " resize-y"}
        />
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div>
        <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
          {field.label}
        </label>
        <input
          type="number"
          value={(value as number) ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={field.placeholder}
          className={baseInput}
        />
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div>
        <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
          {field.label}
        </label>
        <input
          type="date"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
        />
      </div>
    );
  }

  // text
  return (
    <div>
      <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
        {field.label}
      </label>
      <input
        type="text"
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={baseInput}
      />
    </div>
  );
}
