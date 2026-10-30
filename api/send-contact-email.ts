// api/send-contact-email.ts  (Vercel serverless function, POST /api/send-contact-email)
//
// Runs when someone submits a contact form on 22signals.com. The browser saves
// the submission to `contact_submissions` first (the /admin inbox), then calls
// this function, which sends two emails through Brevo SMTP:
//
//   1. A notification to the team inboxes (NOTIFY_TO), with Reply-To set to
//      the visitor so hitting reply answers them directly.
//   2. A short confirmation to the visitor with the booking link and phone
//      number, with Reply-To set to CONFIRM_REPLY_TO (business@).
//
// Both are sent from business@22signals.com, a verified sender in Brevo.
// 22signals.com is authenticated in Brevo (Senders, Domains & Dedicated IPs >
// Domains) via DKIM + DMARC records on Namecheap; the Google Workspace MX
// records are untouched.
//
// Environment variables (Vercel > Project > Settings > Environment Variables,
// set for Production and Preview):
//   BREVO_SMTP_KEY     required. Brevo > SMTP & API > SMTP > Your SMTP Keys.
//   BREVO_SMTP_USER    optional. Default the account's SMTP login below.
//   SMTP_HOST          optional. Default "smtp-relay.brevo.com"
//   SMTP_PORT          optional. Default 587 (STARTTLS)
//   NOTIFY_TO          optional. Comma-separated team inboxes. Default: DEFAULT_TO.
//   NOTIFY_FROM_EMAIL  optional. Default "business@22signals.com"
//   NOTIFY_FROM_NAME   optional. Default "22 Signals"
//   CONFIRM_REPLY_TO   optional. Default "business@22signals.com"
//   BOOKING_URL        optional. Default the 15-minute Calendly link.
//
// The visitor is never blocked by this function: the lead is already saved,
// and the browser ignores whatever this returns.

import nodemailer from "nodemailer";

interface ContactPayload {
  form_type?: string;
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
  "khanajwa950@gmail.com",
];

const env = (k: string, d = "") => process.env[k]?.trim() || d;
const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

const FROM_EMAIL = env("NOTIFY_FROM_EMAIL", "business@22signals.com");
const FROM_NAME = env("NOTIFY_FROM_NAME", "22 Signals");
const TO = env("NOTIFY_TO") ? list(env("NOTIFY_TO")) : DEFAULT_TO;
const CONFIRM_REPLY_TO = env("CONFIRM_REPLY_TO", "business@22signals.com");
const BOOKING_URL = env("BOOKING_URL", "https://calendly.com/business-22signals/15min");
const PHONE = "+44 7944 603108";

const SMTP_HOST = env("SMTP_HOST", "smtp-relay.brevo.com");
const SMTP_PORT = Number(env("SMTP_PORT", "587"));
const SMTP_USER = env("BREVO_SMTP_USER", "c0ba56001@smtp-brevo.com");

// The site, its Vercel previews, and local dev.
const ALLOWED_ORIGIN = /^https:\/\/((www\.)?22signals\.com|22signals[a-z0-9-]*\.vercel\.app)$|^http:\/\/localhost(:\d+)?$/;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const esc = (s: string | undefined | null) =>
  (s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Keep only known string fields, trimmed and capped so a bad request can't send a novel.
const FIELDS: (keyof ContactPayload)[] = [
  "form_type", "name", "email", "phone", "company", "website", "country",
  "service", "budget", "timeline", "goal", "message", "fax_number",
];
const clean = (raw: Record<string, unknown>): ContactPayload => {
  const out: ContactPayload = {};
  for (const k of FIELDS) {
    const v = raw[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, k === "message" ? 5000 : 300);
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

const isDetailed = (p: ContactPayload) => p.form_type === "detailed";

const fieldRows = (p: ContactPayload): [string, string | undefined][] => [
  ["Name", p.name],
  ["Email", p.email],
  ["Phone", p.phone],
  ["Company", p.company],
  ["Website", p.website],
  ["Country", p.country],
  ["What they need", p.service],
  ["Budget", p.budget],
  ["Timeline", p.timeline],
  ["Goal", p.goal],
];

const notificationHtml = (p: ContactPayload) => {
  const rows = fieldRows(p)
    .filter(([, v]) => v)
    .map(
      ([label, v]) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px;width:140px;vertical-align:top;">${esc(label)}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#111;font-size:14px;">${esc(v)}</td></tr>`
    )
    .join("");
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6e8ef;">
<tr><td style="background:#0A1530;padding:24px 28px;color:#fff;"><div style="font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#7eaaff;">22 Signals</div><div style="font-size:20px;margin-top:6px;font-weight:600;">New ${isDetailed(p) ? "project brief" : "enquiry"} from the website</div></td></tr>
<tr><td style="padding:8px 0;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%">${rows}</table></td></tr>
${p.message ? `<tr><td style="padding:16px 28px 24px;"><div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#888;margin-bottom:8px;">Message</div><div style="white-space:pre-wrap;color:#111;font-size:14px;line-height:1.5;background:#fafbff;padding:14px 16px;border-radius:8px;border:1px solid #eef0f6;">${esc(p.message)}</div></td></tr>` : ""}
<tr><td style="padding:16px 28px 22px;color:#888;font-size:12px;border-top:1px solid #eef0f6;">Reply to this email to answer ${esc(p.name)} directly. Also saved in /admin &gt; Contact submissions.</td></tr>
</table></body></html>`;
};

const notificationText = (p: ContactPayload) =>
  [
    `New ${isDetailed(p) ? "project brief" : "enquiry"} from 22signals.com`,
    "",
    ...fieldRows(p).filter(([, v]) => v).map(([label, v]) => `${label}: ${v}`),
    p.message && `\nMessage:\n${p.message}`,
    "",
    `Reply to this email to answer ${p.name} directly.`,
  ]
    .filter((l) => typeof l === "string")
    .join("\n");

const firstName = (n?: string) => (n || "").split(/\s+/)[0] || "there";

const confirmationText = (p: ContactPayload) => `Hi ${firstName(p.name)},

Thanks for getting in touch with 22 Signals. We got your message and we will get back to you soon.

If you would like to talk it through sooner, you can book a 15-minute call here:
${BOOKING_URL}

Or call or WhatsApp us on ${PHONE}. If there is anything you want to add, just reply to this email.

The 22 Signals team
https://22signals.com`;

const confirmationHtml = (p: ContactPayload) => `<!doctype html><html><body style="margin:0;padding:24px;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e6e8ef;">
<tr><td style="padding:28px 28px 8px;font-size:15px;line-height:1.6;">
<p style="margin:0 0 14px;">Hi ${esc(firstName(p.name))},</p>
<p style="margin:0 0 14px;">Thanks for getting in touch with 22 Signals. We got your message and we will get back to you soon.</p>
<p style="margin:0 0 22px;">If you would like to talk it through sooner, you can book a 15-minute call:</p>
<p style="margin:0 0 22px;"><a href="${esc(BOOKING_URL)}" style="display:inline-block;background:#325FEC;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px;">Book a 15-minute call</a></p>
<p style="margin:0 0 14px;">Or call or WhatsApp us on <a href="tel:+447944603108" style="color:#325FEC;">${PHONE}</a>. If there is anything you want to add, just reply to this email.</p>
</td></tr>
<tr><td style="padding:8px 28px 26px;font-size:14px;line-height:1.5;color:#444;">The 22 Signals team<br><a href="https://22signals.com" style="color:#325FEC;">22signals.com</a></td></tr>
</table></body></html>`;

const transport = (pass: string) =>
  nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    requireTLS: SMTP_PORT !== 465 && SMTP_HOST !== "localhost",
    auth: { user: SMTP_USER, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

const FROM = { name: FROM_NAME, address: FROM_EMAIL };

export async function POST(req: Request): Promise<Response> {
  const origin = req.headers.get("origin");
  if (origin && !ALLOWED_ORIGIN.test(origin)) return json({ ok: false, error: "Forbidden" }, 403);

  let p: ContactPayload;
  try {
    p = clean((await req.json()) as Record<string, unknown>);
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  // Spam trap filled in: pretend it worked, send nothing.
  if (p.fax_number) return json({ ok: true });

  if (!p.name || !p.email || !EMAIL_RE.test(p.email)) {
    return json({ ok: false, error: "Name and a valid email are required" }, 400);
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) return json({ ok: false, error: "Too many requests" }, 429);

  const smtpKey = env("BREVO_SMTP_KEY");
  if (!smtpKey) {
    console.warn("[send-contact-email] BREVO_SMTP_KEY not set; submission is in /admin only.");
    return json({ ok: false, error: "Email not configured" }, 503);
  }

  const mailer = transport(smtpKey);
  const subjectBits = [p.name, p.company, p.service].filter(Boolean).join(" · ");
  const results: Record<string, string | undefined> = {};

  try {
    try {
      const r = await mailer.sendMail({
        from: FROM,
        to: TO,
        replyTo: { name: p.name, address: p.email },
        subject: `${isDetailed(p) ? "Project brief" : "New enquiry"}: ${subjectBits}`.slice(0, 200),
        html: notificationHtml(p),
        text: notificationText(p),
      });
      results.notification = r.messageId;
    } catch (e) {
      console.error("[send-contact-email] notification failed:", e);
      return json({ ok: false, error: "Notification failed" }, 502);
    }

    try {
      const r = await mailer.sendMail({
        from: FROM,
        to: { name: p.name, address: p.email },
        replyTo: { name: FROM_NAME, address: CONFIRM_REPLY_TO },
        subject: "Thanks for getting in touch with 22 Signals",
        html: confirmationHtml(p),
        text: confirmationText(p),
      });
      results.confirmation = r.messageId;
    } catch (e) {
      // The team already has the lead; a failed confirmation is not fatal.
      console.error("[send-contact-email] confirmation failed:", e);
    }
  } finally {
    mailer.close();
  }

  return json({ ok: true, ...results });
}
