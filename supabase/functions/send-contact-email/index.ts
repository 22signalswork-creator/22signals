// supabase/functions/send-contact-email/index.ts
//
// Deno Deploy Edge Function that fires when a contact form is submitted.
//
// What it does:
//   1. Reads `email_settings` (singleton row, id=1) using the SUPABASE
//      service-role key so SMTP credentials are never exposed to the
//      browser.
//   2. Connects to the configured SMTP server (e.g. Brevo:
//      smtp-relay.brevo.com:587) and sends the submission body to the
//      three recipient inboxes configured by the admin.
//   3. Falls back gracefully if email_settings.is_enabled is false or
//      the table is empty — submissions still land in
//      `contact_submissions` via the regular insert.
//
// Deploy:
//   supabase functions deploy send-contact-email
//
// Env vars required (set in Supabase Dashboard → Edge Functions → Secrets):
//   SUPABASE_URL              — your project URL
//   SUPABASE_SERVICE_ROLE_KEY — service role key (DO NOT use anon key)
//
// Client call (see src/pages/contact/contact.tsx):
//   await supabase.functions.invoke("send-contact-email", { body: payload })

// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

interface ContactPayload {
  name?: string;
  email?: string;
  company?: string;
  country?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  phone?: string;
  website?: string;
  goal?: string;
  form_type?: "quick" | "detailed";
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const escape = (s: string | undefined | null) =>
  (s ?? "").toString().replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  } as any)[c]);

const buildHtml = (p: ContactPayload): string => {
  const row = (label: string, value: string | undefined | null) =>
    value
      ? `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px;width:140px;">${escape(
          label
        )}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#111;font-size:14px;">${escape(
          value
        )}</td></tr>`
      : "";

  return `
<!doctype html>
<html><body style="margin:0;padding:24px;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e8ef;">
    <tr>
      <td style="background:#0A1530;padding:24px 28px;color:#fff;">
        <div style="font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#7eaaff;">22 Signals</div>
        <div style="font-size:20px;margin-top:6px;font-weight:600;">New contact submission</div>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          ${row("Form", p.form_type)}
          ${row("Name", p.name)}
          ${row("Email", p.email)}
          ${row("Phone", p.phone)}
          ${row("Company", p.company)}
          ${row("Website", p.website)}
          ${row("Country", p.country)}
          ${row("Service", p.service)}
          ${row("Budget", p.budget)}
          ${row("Timeline", p.timeline)}
          ${row("Goal", p.goal)}
        </table>
      </td>
    </tr>
    ${p.message ? `<tr><td style="padding:16px 28px 24px;"><div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#888;margin-bottom:8px;">Message</div><div style="white-space:pre-wrap;color:#111;font-size:14px;line-height:1.5;background:#fafbff;padding:14px 16px;border-radius:8px;border:1px solid #eef0f6;">${escape(p.message)}</div></td></tr>` : ""}
    <tr>
      <td style="padding:16px 28px 22px;color:#888;font-size:12px;border-top:1px solid #eef0f6;">
        Sent via the website contact form.
      </td>
    </tr>
  </table>
</body></html>`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const payload = (await req.json()) as ContactPayload;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ ok: false, error: "Supabase env not configured" }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: settings, error } = await admin
      .from("email_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("email_settings read failed:", error);
      return new Response(
        JSON.stringify({ ok: false, error: error.message }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    if (!settings || !settings.is_enabled) {
      // SMTP not configured / disabled — silently succeed so the form
      // still completes (submission is already saved in Supabase table).
      return new Response(
        JSON.stringify({ ok: true, skipped: true, reason: "disabled" }),
        { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_pass) {
      return new Response(
        JSON.stringify({ ok: false, error: "SMTP credentials missing" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const recipients = [
      settings.recipient_1,
      settings.recipient_2,
      settings.recipient_3,
    ].filter((r): r is string => !!r && /\S+@\S+\.\S+/.test(r));

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "No recipient emails configured" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const client = new SMTPClient({
      connection: {
        hostname: settings.smtp_host,
        port: settings.smtp_port || 587,
        tls: !!settings.smtp_secure,
        auth: {
          username: settings.smtp_user,
          password: settings.smtp_pass,
        },
      },
    });

    const fromEmail = settings.from_email || settings.smtp_user;
    const fromName = settings.from_name || "22 Signals";

    const html = buildHtml(payload);
    const subject =
      payload.form_type === "detailed"
        ? `New project debrief — ${payload.name || "Unknown"}`
        : `New contact form — ${payload.name || "Unknown"}`;

    // denomailer supports sending to multiple recipients in `to`
    await client.send({
      from: `${fromName} <${fromEmail}>`,
      to: recipients,
      replyTo: payload.email || undefined,
      subject,
      content: "auto",
      html,
    });

    await client.close();

    return new Response(
      JSON.stringify({ ok: true, sent_to: recipients.length }),
      { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-contact-email failed:", err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err?.message || err) }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
