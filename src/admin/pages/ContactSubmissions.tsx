/**
 * Contact submissions — read-only inbox of contact form entries.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Submission {
  id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  country: string | null;
  service: string | null;
  budget: string | null;
  timeline: string | null;
  message: string | null;
  created_at: string;
}

export default function ContactSubmissions() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setRows((data ?? []) as Submission[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);
    if (error) setError(error.message);
    else load();
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-medium">Contact submissions</h1>
          <p className="text-white/60 text-sm mt-1">
            Inbox of messages submitted via the contact form.
          </p>
        </div>
        <button
          onClick={load}
          className="rounded-lg border border-white/15 text-white/80 hover:bg-white/[0.05] text-sm px-4 py-2 transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm px-4 py-2">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-white/40 text-sm">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/50 text-sm">
          No submissions yet.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => {
            const isOpen = openId === r.id;
            return (
              <li
                key={r.id}
                className="rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : r.id)}
                  className="w-full px-4 py-3 flex items-center gap-4 text-left hover:bg-white/[0.03] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">
                      {r.name || "(no name)"}
                      {r.email && (
                        <span className="text-white/50 font-normal ml-2">
                          {r.email}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/45 mt-0.5">
                      {[r.company, r.country, r.service]
                        .filter(Boolean)
                        .join(" • ") || "—"}
                    </div>
                  </div>
                  <div className="text-xs text-white/45 shrink-0">
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-white/40 text-lg">{isOpen ? "−" : "+"}</div>
                </button>

                {isOpen && (
                  <div className="border-t border-white/10 px-4 py-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <Cell label="Name" value={r.name} />
                    <Cell label="Email" value={r.email} />
                    <Cell label="Company" value={r.company} />
                    <Cell label="Country" value={r.country} />
                    <Cell label="Service" value={r.service} />
                    <Cell label="Budget" value={r.budget} />
                    <Cell label="Timeline" value={r.timeline} />
                    <Cell
                      label="Submitted"
                      value={new Date(r.created_at).toLocaleString()}
                    />
                    {r.message && (
                      <div className="col-span-2 mt-2">
                        <div className="text-white/50 text-[10px] uppercase tracking-wider mb-1">
                          Message
                        </div>
                        <div className="rounded-lg bg-white/[0.03] border border-white/10 p-3 whitespace-pre-wrap text-white/85">
                          {r.message}
                        </div>
                      </div>
                    )}
                    <div className="col-span-2 flex justify-end mt-3">
                      <button
                        onClick={() => remove(r.id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">
        {label}
      </div>
      <div className="text-white/85">{value || "—"}</div>
    </div>
  );
}
