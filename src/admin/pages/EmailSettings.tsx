/**
 * EmailSettings — admin editor for the `email_settings` singleton row.
 *
 * Lets the admin:
 *   - Configure SMTP (works with Brevo out of the box — defaults shown).
 *   - Set the "From" name/email used on outgoing mail.
 *   - Set the THREE recipient inboxes that should receive every contact
 *     form submission.
 *   - Toggle email sending on/off without losing credentials.
 *
 * The actual email send is handled server-side by the
 * `send-contact-email` Supabase Edge Function so credentials never reach
 * the browser.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface EmailSettings {
  id?: number;
  smtp_host?: string | null;
  smtp_port?: number | null;
  smtp_user?: string | null;
  smtp_pass?: string | null;
  smtp_secure?: boolean | null;
  from_name?: string | null;
  from_email?: string | null;
  recipient_1?: string | null;
  recipient_2?: string | null;
  recipient_3?: string | null;
  is_enabled?: boolean | null;
}

const BREVO_DEFAULTS = {
  smtp_host: "smtp-relay.brevo.com",
  smtp_port: 587,
  smtp_secure: false,
};

export default function EmailSettingsPage() {
  const [data, setData] = useState<EmailSettings>({ id: 1 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: row, error } = await supabase
        .from("email_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) setError(error.message);
      else if (row) setData(row as EmailSettings);
      else setData({ id: 1 });
      setLoading(false);
    })();
  }, []);

  const update = <K extends keyof EmailSettings>(k: K, v: EmailSettings[K]) =>
    setData((p) => ({ ...p, [k]: v }));

  const applyBrevoDefaults = () => {
    setData((p) => ({ ...p, ...BREVO_DEFAULTS }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    const payload: EmailSettings = { ...data, id: 1 };
    // Coerce port to a number
    if (typeof payload.smtp_port === "string") {
      payload.smtp_port = parseInt(payload.smtp_port as unknown as string, 10) || null;
    }
    const { error } = await supabase
      .from("email_settings")
      .upsert(payload as any, { onConflict: "id" });
    setSaving(false);
    if (error) setError(error.message);
    else setSavedAt(new Date());
  };

  if (loading) return <div className="text-white/40 text-sm">Loading…</div>;

  const inputCls =
    "w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-colors";
  const labelCls =
    "block text-white/70 text-xs uppercase tracking-wider mb-2";

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-medium mb-1">Email settings</h1>
      <p className="text-white/60 text-sm mb-6 leading-relaxed">
        Configure SMTP (Brevo recommended) and the three inboxes that
        should receive every contact form submission. When email is
        <span className="text-blue-200"> enabled</span>, submissions
        are sent <span className="text-blue-200">from</span> your
        configured sender to all three recipients. When disabled,
        submissions still land in the <em>Contact submissions</em> inbox
        but no email is sent.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm px-4 py-2">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-6">
        {/* Master switch */}
        <label className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3">
          <div>
            <div className="text-white text-sm font-medium">
              Send email on every submission
            </div>
            <div className="text-white/50 text-xs mt-0.5">
              Master switch. Leave OFF until SMTP + recipients are saved
              and tested.
            </div>
          </div>
          <input
            type="checkbox"
            className="w-5 h-5 accent-blue-500"
            checked={!!data.is_enabled}
            onChange={(e) => update("is_enabled", e.target.checked)}
          />
        </label>

        {/* SMTP block */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-white text-sm font-medium">
              SMTP server
            </div>
            <button
              type="button"
              onClick={applyBrevoDefaults}
              className="text-xs px-3 py-1.5 rounded-lg border border-blue-500/40 text-blue-200 hover:bg-blue-500/10 transition-colors"
            >
              Use Brevo defaults
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelCls}>SMTP host</label>
              <input
                type="text"
                placeholder="smtp-relay.brevo.com"
                className={inputCls}
                value={data.smtp_host ?? ""}
                onChange={(e) => update("smtp_host", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Port</label>
              <input
                type="number"
                placeholder="587"
                className={inputCls}
                value={data.smtp_port ?? ""}
                onChange={(e) =>
                  update(
                    "smtp_port",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 text-white/80 text-sm">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-500"
                  checked={!!data.smtp_secure}
                  onChange={(e) => update("smtp_secure", e.target.checked)}
                />
                Use SSL/TLS (port 465)
              </label>
            </div>
            <div>
              <label className={labelCls}>SMTP username / login</label>
              <input
                type="text"
                placeholder="your-brevo-login@example.com"
                className={inputCls}
                value={data.smtp_user ?? ""}
                onChange={(e) => update("smtp_user", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>
                SMTP password / API key
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="ml-2 text-blue-300/80 text-[10px] underline-offset-2 hover:underline"
                >
                  {showPass ? "hide" : "show"}
                </button>
              </label>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className={inputCls}
                value={data.smtp_pass ?? ""}
                onChange={(e) => update("smtp_pass", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* From identity */}
        <div>
          <div className="text-white text-sm font-medium mb-3">
            Sender identity ("From")
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>From name</label>
              <input
                type="text"
                placeholder="22 Signals"
                className={inputCls}
                value={data.from_name ?? ""}
                onChange={(e) => update("from_name", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>From email</label>
              <input
                type="email"
                placeholder="hello@22signals.com"
                className={inputCls}
                value={data.from_email ?? ""}
                onChange={(e) => update("from_email", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Recipients */}
        <div>
          <div className="text-white text-sm font-medium mb-1">
            Recipient inboxes
          </div>
          <p className="text-white/50 text-xs mb-4">
            Each contact submission is sent to all three addresses below.
            Leave any unused field blank.
          </p>
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((n) => {
              const key = `recipient_${n}` as keyof EmailSettings;
              return (
                <div key={n}>
                  <label className={labelCls}>Recipient {n}</label>
                  <input
                    type="email"
                    placeholder={`team${n}@yourcompany.com`}
                    className={inputCls}
                    value={(data[key] as string | null) ?? ""}
                    onChange={(e) => update(key, e.target.value as any)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Save row */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 transition-colors"
          >
            {saving ? "Saving…" : "Save email settings"}
          </button>
          {savedAt && (
            <span className="text-emerald-300 text-xs">
              Saved at {savedAt.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 text-white/50 text-xs leading-relaxed">
        <div className="font-medium text-white/70 mb-1">Setup checklist</div>
        <ol className="list-decimal list-inside space-y-1">
          <li>Run <code>supabase_email_settings.sql</code> in your Supabase SQL editor.</li>
          <li>Deploy the edge function: <code>supabase functions deploy send-contact-email</code></li>
          <li>
            In Supabase Dashboard → Edge Functions → Secrets, set{" "}
            <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>.
          </li>
          <li>Fill in the form above, turn ON the master switch, save.</li>
        </ol>
      </div>
    </div>
  );
}
