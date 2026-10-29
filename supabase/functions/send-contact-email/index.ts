// supabase/functions/send-contact-email/index.ts
//
// Runs when someone submits a form on 22signals.com. The browser saves the
// submission to `contact_submissions` first (the /admin inbox), then calls
// this function, which sends two emails through Resend:
//
//   1. A notification to the team inboxes (NOTIFY_TO), with Reply-To set to
//      the visitor so hitting reply answers them directly.
//   2. A short confirmation to the visitor with the booking link, with
//      Reply-To set to CONFIRM_REPLY_TO.
//
// Both emails are sent from business@22signals.com, so the team can reply to
// the visitor from that inbox. The sending service must be authorised for
// 22signals.com (SPF/DKIM) without breaking the domain's existing mail setup.
//
// Secrets (Supabase Dashboard > Edge Functions > Secrets):
//   RESEND_API_KEY     required. From resend.com > API Keys.
//   NOTIFY_FROM        optional. Default "22 Signals <business@22signals.com>"
//   NOTIFY_TO          optional. Comma-separated list. Default: the four inboxes below.
//   CONFIRM_REPLY_TO   optional. Default "business@22signals.com"
//   BOOKING_URL        optional. Default the 15-minute Calendly link.
//
// Deploy:
//   supabase functions deploy send-contact-email

// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

interface ContactPayload {
  form_type?: "quick" | "detailed";
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  country?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  goal?: string;
  message?: string;
  fax_number?: string; // hidden spam trap
}

const DEFAULT_TO = [
  "daniyalmansur.work@gmail.com",
  "22signals.work@gmail.com",
  "business@22signals.com",
  "ataulkarim2003@gmail.com",
];

const env = (k: string, d = "") => Deno.env.get(k) ?? d;
const FROM = env("NOTIFY_FROM", "22 Signals <business@22signals.com>");
const TO = env("NOTIFY_TO") ? env("NOTIFY_TO").split(",").map((s) => s.trim()).filter(Boolean) : DEFAULT_TO;
const CONFIRM_REPLY_TO = env("CONFIRM_REPLY_TO", "business@22signals.com");
const BOOKING_URL = env("BOOKING_URL", "https://calendly.com/business-22signals/15min");

const ALLOWED_ORIGIN = /^https:\/\/((www\.)?22signals\.com|[a-z0-9-]+\.vercel\.app)$|^http:\/\/localhost(:\d+)?$/;

const corsFor = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ALLOWED_ORIGIN.test(origin) ? origin : "https://22signals.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  Vary: "Origin",
});

const json = (body: unknown, status: number, cors: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const esc = (s: string | undefined | null) =>
  (s ?? "").toString().replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]);

// Trim every field and cap its length so a bad request can't send a novel.
const clean = (p: ContactPayload): ContactPayload => {
  const out: any = {};
  for (const [k, v] of Object.entries(p)) {
    if (typeof v === "string") out[k] = v.trim().slice(0, k === "message" ? 5000 : 300);
  }
  return out;
};

// Best-effort rate limit per IP while this function instance is warm.
const hits = new Map<string, number[]>();
const limited = (ip: string) => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
};

const notificationHtml = (p: ContactPayload) => {
  const row = (label: string, value?: string) =>
    value
      ? `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px;width:140px;">${esc(label)}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#111;font-size:14px;">${esc(value)}</td></tr>`
      : "";
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6e8ef;">
<tr><td style="background:#0A1530;padding:24px 28px;color:#fff;"><div style="font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#7eaaff;">22 Signals</div><div style="font-size:20px;margin-top:6px;font-weight:600;">New ${p.form_type === "detailed" ? "project brief" : "enquiry"} from the website</div></td></tr>
<tr><td style="padding:8px 0;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%">
${row("Name", p.name)}${row("Email", p.email)}${row("Phone", p.phone)}${row("Company", p.company)}${row("Website", p.website)}${row("Country", p.country)}${row("Needs", p.service)}${row("Budget", p.budget)}${row("Timeline", p.timeline)}${row("Goal", p.goal)}
</table></td></tr>
${p.message ? `<tr><td style="padding:16px 28px 24px;"><div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#888;margin-bottom:8px;">Message</div><div style="white-space:pre-wrap;color:#111;font-size:14px;line-height:1.5;background:#fafbff;padding:14px 16px;border-radius:8px;border:1px solid #eef0f6;">${esc(p.message)}</div></td></tr>` : ""}
<tr><td style="padding:16px 28px 22px;color:#888;font-size:12px;border-top:1px solid #eef0f6;">Reply to this email to answer ${esc(p.name || "them")} directly. Also saved in /admin &gt; Contact submissions.</td></tr>
</table></body></html>`;
};

const notificationText = (p: ContactPayload) =>
  [
    `New ${p.form_type === "detailed" ? "project brief" : "enquiry"} from 22signals.com`,
    "",
    `Name: ${p.name ?? ""}`,
    `Email: ${p.email ?? ""}`,
    p.phone && `Phone: ${p.phone}`,
    p.company && `Company: ${p.company}`,
    p.website && `Website: ${p.website}`,
    p.service && `Needs: ${p.service}`,
    p.budget && `Budget: ${p.budget}`,
    p.timeline && `Timeline: ${p.timeline}`,
    p.goal && `Goal: ${p.goal}`,
    p.message && `\nMessage:\n${p.message}`,
  ]
    .filter(Boolean)
    .join("\n");

const firstName = (n?: string) => (n || "").split(/\s+/)[0] || "there";

const confirmationText = (p: ContactPayload) => `Hi ${firstName(p.name)},

Thanks for getting in touch with 22 Signals. We have your message and we will get back to you soon.

If you would like to talk it through sooner, you can book a 15-minute call here:
${BOOKING_URL}

If there is anything you want to add, just reply to this email.

The 22 Signals team
+44 7944 603108 (phone and WhatsApp)
https://22signals.com`;

const confirmationHtml = (p: ContactPayload) => `<!doctype html><html><body style="margin:0;padding:24px;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e6e8ef;">
<tr><td style="padding:28px 28px 8px;font-size:15px;line-height:1.6;">
<p style="margin:0 0 14px;">Hi ${esc(firstName(p.name))},</p>
<p style="margin:0 0 14px;">Thanks for getting in touch with 22 Signals. We have your message and we will get back to you soon.</p>
<p style="margin:0 0 22px;">If you would like to talk it through sooner, you can book a 15-minute call:</p>
<p style="margin:0 0 22px;"><a href="${esc(BOOKING_URL)}" style="display:inline-block;background:#325FEC;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px;">Book a 15-minute call</a></p>
<p style="margin:0 0 14px;">If there is anything you want to add, just reply to this email.</p>
</td></tr>
<tr><td style="padding:8px 28px 26px;font-size:14px;line-height:1.5;color:#444;">The 22 Signals team<br>+44 7944 603108 (phone and WhatsApp)<br><a href="https://22signals.com" style="color:#325FEC;">22signals.com</a></td></tr>
</table></body></html>`;

async function send(apiKey: string, mail: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(mail),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

serve(async (req) => {
  const cors = corsFor(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405, cors);

  let p: ContactPayload;
  try {
    p = clean((await req.json()) as ContactPayload);
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400, cors);
  }

  // Spam trap filled in: pretend it worked, send nothing.
  if (p.fax_number) return json({ ok: true }, 200, cors);

  if (!p.name || !p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
    return json({ ok: false, error: "Name and a valid email are required" }, 400, cors);
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) return json({ ok: false, error: "Too many requests" }, 429, cors);

  const apiKey = env("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("[send-contact-email] RESEND_API_KEY not set; submission is in /admin only.");
    return json({ ok: false, error: "Email not configured" }, 200, cors);
  }

  const subjectBits = [p.name, p.company, p.service].filter(Boolean).join(" · ");
  const results: Record<string, unknown> = {};

  try {
    results.notification = await send(apiKey, {
      from: FROM,
      to: TO,
      reply_to: p.email,
      subject: `${p.form_type === "detailed" ? "Project brief" : "New enquiry"}: ${subjectBits}`.slice(0, 200),
      html: notificationHtml(p),
      text: notificationText(p),
    });
  } catch (e) {
    console.error("[send-contact-email] notification failed:", e);
    return json({ ok: false, error: "Notification failed" }, 502, cors);
  }

  try {
    results.confirmation = await send(apiKey, {
      from: FROM,
      to: [p.email],
      reply_to: CONFIRM_REPLY_TO,
      subject: "Thanks for getting in touch with 22 Signals",
      html: confirmationHtml(p),
      text: confirmationText(p),
    });
  } catch (e) {
    // The team already has the lead; a failed confirmation is not fatal.
    console.error("[send-contact-email] confirmation failed:", e);
  }

  return json({ ok: true, ...results }, 200, cors);
});
