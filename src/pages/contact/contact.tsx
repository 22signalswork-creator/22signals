import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/index.css";
import "@/pages/services/services.css";
import RisingText from "@/transitions/RisingText";
import AnimatedText from "@/transitions/herosectionP.tsx";
import FadeIn from "@/transitions/FadeIn";
import CustomButton from "@/components/CustomButton";
import PreCtaSections from "@/components/PreCtaSections";
import { supabase } from "@/lib/supabase";

import { BOOKING_URL, bookingUrl, loadCalendly, onCalendlyBooked, openCalendly } from "@/lib/calendly";

// Direct contact details shown beside the form.
const PHONE_DISPLAY = "+44 7944 603108";
const PHONE_TEL = "+447944603108";
const WHATSAPP_URL = "https://wa.me/447944603108";
const DIRECT_EMAIL = "daniyal@22signals.com";

const HELP_OPTIONS = [
  "AI consulting or automation",
  "Cloud, data or business intelligence",
  "Website or app",
  "SEO, GEO or paid media",
  "Video, animation or 3D",
  "Managed team or sourcing",
  "Something else",
];

const SOLUTIONS = [
  "AI consulting and automation",
  "Cloud, data and business intelligence",
  "Websites and apps",
  "SEO, GEO and paid media",
  "Video, animation and 3D",
  "Managed teams and sourcing",
  "Other (manufacturing, esports, games)",
];

const TIMELINES = [
  "As soon as possible",
  "Within 1-2 months",
  "Within 3-6 months",
  "Just exploring options",
];

const BUDGETS = [
  "Under $10,000",
  "$10,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+",
  "Not sure yet",
];

// Note: per the brief, the option
//   "Reducing current development or manufacturing costs (40-60%)"
// was removed from this list and must NOT be re-added.
const GOALS = [
  "Fixing or automating how the business runs today",
  "Building a new product or system",
  "Growing sales or entering a new market",
];

type Payload = Record<string, string | undefined>;

// Sends the notification and confirmation emails. Never blocks the visitor:
// the submission is already saved in the admin inbox before this runs.
async function notify(body: Payload) {
  try {
    await supabase.functions.invoke("send-contact-email", { body });
  } catch (e) {
    console.warn("[Contact] Email notification failed (non-blocking):", e);
  }
}

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [showDetailed, setShowDetailed] = useState(false);

  // Quick form
  const [f1, setF1] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    help: "",
    phone: "",
    message: "",
    trap: "",
  });

  // Detailed form (secondary)
  const [f2, setF2] = useState({
    name: "",
    company: "",
    email: "",
    number: "",
    website: "",
    solutions: [] as string[],
    timeline: "",
    budget: "",
    overview: "",
    goal: "",
    trap: "",
  });

  const updateF1 = (k: keyof typeof f1, v: string) =>
    setF1((p) => ({ ...p, [k]: v }));
  const updateF2 = <K extends keyof typeof f2>(k: K, v: (typeof f2)[K]) =>
    setF2((p) => ({ ...p, [k]: v }));

  const toggleSolution = (s: string) => {
    setF2((p) => ({
      ...p,
      solutions: p.solutions.includes(s)
        ? p.solutions.filter((x) => x !== s)
        : [...p.solutions, s],
    }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null);
  const detailedRef = useRef<HTMLDivElement>(null);
  const inlineRef = useRef<HTMLDivElement>(null);

  // Inline booking calendar at the top of the page.
  useEffect(() => {
    let cancelled = false;
    loadCalendly()
      .then(() => {
        if (cancelled || !inlineRef.current || !window.Calendly) return;
        inlineRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({ url: bookingUrl(), parentElement: inlineRef.current });
      })
      .catch(() => {});
    const off = onCalendlyBooked(() => navigate("/thank-you?booked=1"));
    return () => {
      cancelled = true;
      off();
    };
  }, [navigate]);

  const openDetailed = () => {
    setShowDetailed(true);
    setTimeout(() => {
      if (!detailedRef.current) return;
      const y = detailedRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 120);
  };

  const handleSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // Guard against double-submit
    if (!f1.name || !f1.email || !f1.help) {
      setSubmitError("Please add your name, email and what you need.");
      return;
    }
    // Hidden field: real visitors never fill it, bots usually do.
    if (f1.trap) {
      setSent({ name: f1.name, email: f1.email });
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    const extra = [f1.phone && `Phone: ${f1.phone}`, f1.website && `Website: ${f1.website}`]
      .filter(Boolean)
      .join("\n");
    const details = [f1.message, extra].filter(Boolean).join("\n\n");

    const { error } = await supabase.from("contact_submissions").insert([
      {
        name: f1.name,
        email: f1.email,
        company: f1.company || null,
        country: null,
        service: f1.help,
        budget: null,
        timeline: null,
        message: details,
      },
    ]);

    if (error) {
      console.error("[Contact] Quick form insert failed:", error);
      setSubmitting(false);
      setSubmitError("We couldn't send your message. Please try again, or email " + DIRECT_EMAIL + ".");
      return;
    }

    notify({
      form_type: "quick",
      name: f1.name,
      email: f1.email,
      phone: f1.phone,
      company: f1.company,
      website: f1.website,
      service: f1.help,
      message: f1.message,
    });

    setSubmitting(false);
    setSent({ name: f1.name, email: f1.email });
    // Straight into booking, with their details already filled in.
    openCalendly({ name: f1.name, email: f1.email });
  };

  const handleSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // Guard against double-submit
    if (!f2.name || !f2.company || !f2.email || !f2.number) {
      setSubmitError("Please fill in the required fields.");
      return;
    }
    if (f2.trap) {
      navigate("/thank-you");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("contact_submissions").insert([
      {
        name: f2.name,
        email: f2.email,
        company: f2.company,
        country: null,
        service: f2.solutions.join(", "),
        budget: f2.budget,
        timeline: f2.timeline,
        message: `${f2.overview}\n\nGoal: ${f2.goal}\nWebsite: ${f2.website}\nPhone: ${f2.number}`,
      },
    ]);

    if (error) {
      console.error("[Contact] Detailed form insert failed:", error);
      setSubmitting(false);
      setSubmitError("We couldn't send your message. Please try again, or email " + DIRECT_EMAIL + ".");
      return;
    }

    await notify({
      form_type: "detailed",
      name: f2.name,
      email: f2.email,
      phone: f2.number,
      company: f2.company,
      website: f2.website,
      service: f2.solutions.join(", "),
      budget: f2.budget,
      timeline: f2.timeline,
      goal: f2.goal,
      message: f2.overview,
    });

    setSubmitting(false);
    navigate("/thank-you");
  };

  // Shared input style
  const inputCls =
    "w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-blue-400 transition-colors";
  const labelCls = "block text-white/80 text-sm mb-2 font-medium";

  const cardStyle = {
    background:
      "linear-gradient(135deg, rgba(50,95,236,0.06) 0%, rgba(255,255,255,0.02) 100%)",
    border: "1px solid rgba(80,140,255,0.18)",
  };

  // Hidden from people and screen readers; bots tend to fill every field.
  const trapField = (value: string, onChange: (v: string) => void) => (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Leave this field empty
        <input type="text" name="fax_number" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );

  return (
    <div className="contact-page bg-[#000202] min-h-screen pt-32 pb-24 text-white">
      {/* HERO */}
      <div className="container">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <RisingText>
              <h1
                className="text-4xl md:text-[64px] leading-tight"
                style={{
                  color: "#ffffff",
                  background: "none",
                  WebkitTextFillColor: "#ffffff",
                  WebkitBackgroundClip: "unset",
                  backgroundClip: "unset",
                }}
              >
                Let's build what's next.
              </h1>
            </RisingText>
            <AnimatedText className="text-white/65 text-base md:text-lg mt-6">
              Book a 15-minute call below, or send us a message and we will
              get back to you.
            </AnimatedText>
          </div>
        </FadeIn>

        {/* 1. BOOK A CALL */}
        <FadeIn>
          <section className="max-w-5xl mx-auto rounded-3xl p-3 md:p-6 mb-16" style={cardStyle} aria-labelledby="book-heading">
            <div className="px-3 md:px-4 pt-3 pb-2 flex flex-col md:flex-row md:items-end md:justify-between gap-2">
              <h2 id="book-heading" className="text-2xl md:text-3xl text-white">
                Book a 15-minute call.
              </h2>
              <p className="text-white/55 text-sm">Pick a time that suits you. Times show in your own time zone.</p>
            </div>
            <div ref={inlineRef} className="w-full rounded-2xl overflow-hidden" style={{ minWidth: 300, height: 700 }}>
              <div className="h-full flex items-center justify-center text-center p-8">
                <a href={BOOKING_URL} className="text-blue-300 underline">
                  Open the booking calendar
                </a>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 2. QUICK MESSAGE + DIRECT CONTACT */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
          <FadeIn>
            {sent ? (
              <div className="rounded-3xl p-8 md:p-12" style={cardStyle} role="status">
                <h2 className="text-2xl md:text-3xl text-white mb-4">Thanks, {sent.name.split(" ")[0]}. We have your message.</h2>
                <p className="text-white/65 leading-relaxed">
                  We will get back to you at {sent.email}. The quickest next step
                  is to pick a time for a call, and your details are already
                  filled in.
                </p>
                <div className="mt-8">
                  <CustomButton
                    text="BOOK A CALL"
                    variant="primary"
                    onClick={() => openCalendly({ name: sent.name, email: sent.email })}
                  />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit1} className="relative rounded-3xl p-8 md:p-12" style={cardStyle} noValidate>
                <h2 className="text-2xl md:text-3xl text-white mb-2">Or send us a message.</h2>
                <p className="text-white/55 text-sm mb-8">
                  When you send it, the booking calendar opens with your details filled in.
                </p>
                {trapField(f1.trap, (v) => updateF1("trap", v))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="q-name" className={labelCls}>Full name *</label>
                    <input id="q-name" type="text" required autoComplete="name" className={inputCls} value={f1.name} onChange={(e) => updateF1("name", e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="q-email" className={labelCls}>Email *</label>
                    <input id="q-email" type="email" required autoComplete="email" className={inputCls} value={f1.email} onChange={(e) => updateF1("email", e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="q-company" className={labelCls}>Company</label>
                    <input id="q-company" type="text" autoComplete="organization" className={inputCls} value={f1.company} onChange={(e) => updateF1("company", e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="q-website" className={labelCls}>Website (optional)</label>
                    <input id="q-website" type="text" inputMode="url" placeholder="yourcompany.com" className={inputCls} value={f1.website} onChange={(e) => updateF1("website", e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="q-help" className={labelCls}>What do you need? *</label>
                    <select id="q-help" required className={inputCls + " appearance-none"} value={f1.help} onChange={(e) => updateF1("help", e.target.value)}>
                      <option value="">Select an option...</option>
                      {HELP_OPTIONS.map((h) => (
                        <option key={h} value={h} style={{ color: "#000" }}>{h}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="q-phone" className={labelCls}>Phone or WhatsApp (optional)</label>
                    <input id="q-phone" type="tel" autoComplete="tel" className={inputCls} value={f1.phone} onChange={(e) => updateF1("phone", e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="q-message" className={labelCls}>Message</label>
                    <textarea id="q-message" rows={5} className={inputCls} placeholder="What are you trying to fix, build or grow?" value={f1.message} onChange={(e) => updateF1("message", e.target.value)} />
                  </div>
                </div>

                {submitError && !showDetailed && <p className="text-red-300 text-sm mt-5" role="alert">{submitError}</p>}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
                  <button type="button" onClick={openDetailed} className="text-blue-300 text-sm underline underline-offset-4 text-left">
                    Want to share the full project brief instead?
                  </button>
                  <CustomButton
                    text={submitting ? "SENDING..." : "SEND AND BOOK"}
                    variant="primary"
                    onClick={() => handleSubmit1({ preventDefault: () => {} } as any)}
                  />
                </div>
              </form>
            )}
          </FadeIn>

          {/* Direct contact */}
          <FadeIn>
            <aside className="rounded-3xl p-8" style={cardStyle} aria-label="Contact details">
              <h2 className="text-xl text-white mb-6">Talk to us directly</h2>
              <ul className="space-y-5 text-sm">
                <li>
                  <div className="text-white/45 text-xs uppercase tracking-[0.2em] mb-1">Phone</div>
                  <a href={`tel:${PHONE_TEL}`} className="text-white hover:text-blue-300">{PHONE_DISPLAY}</a>
                </li>
                <li>
                  <div className="text-white/45 text-xs uppercase tracking-[0.2em] mb-1">WhatsApp</div>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300">Message us on WhatsApp</a>
                </li>
                <li>
                  <div className="text-white/45 text-xs uppercase tracking-[0.2em] mb-1">Email</div>
                  <a href={`mailto:${DIRECT_EMAIL}`} className="text-white hover:text-blue-300 break-all">{DIRECT_EMAIL}</a>
                </li>
                <li className="text-white/55">London, United Kingdom</li>
              </ul>
            </aside>
          </FadeIn>
        </div>

        {/* 3. DETAILED BRIEF (secondary) */}
        <div ref={detailedRef} className="scroll-mt-24" />
        {!showDetailed ? (
          <div className="max-w-5xl mx-auto text-center mt-12">
            <button type="button" onClick={openDetailed} className="text-white/60 hover:text-white text-sm">
              Have a full brief ready? <span className="text-blue-300 underline underline-offset-4">Open the project discovery form</span>
            </button>
          </div>
        ) : (
          <FadeIn>
            <form onSubmit={handleSubmit2} className="relative max-w-5xl mx-auto rounded-3xl p-8 md:p-12 mt-12" style={cardStyle} noValidate>
              {trapField(f2.trap, (v) => updateF2("trap", v))}
              <h2 className="text-2xl md:text-3xl text-white mb-3">Project discovery.</h2>
              <p className="text-white/55 text-sm md:text-base mb-10 max-w-3xl">
                Tell us about the project in as much detail as you like. We read
                every brief and come back with questions or a written plan.
              </p>

              {/* Section 1: Basics */}
              <div className="mb-10">
                <div className="text-blue-300 text-xs tracking-[0.25em] uppercase mb-5">Section 1: The basics</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="d-name" className={labelCls}>Full name *</label>
                    <input id="d-name" type="text" required autoComplete="name" className={inputCls} value={f2.name} onChange={(e) => updateF2("name", e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="d-company" className={labelCls}>Company or organization *</label>
                    <input id="d-company" type="text" required autoComplete="organization" className={inputCls} value={f2.company} onChange={(e) => updateF2("company", e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="d-email" className={labelCls}>Email *</label>
                    <input id="d-email" type="email" required autoComplete="email" className={inputCls} value={f2.email} onChange={(e) => updateF2("email", e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="d-phone" className={labelCls}>Phone or WhatsApp *</label>
                    <input id="d-phone" type="tel" required autoComplete="tel" className={inputCls} value={f2.number} onChange={(e) => updateF2("number", e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="d-website" className={labelCls}>Company website</label>
                    <input id="d-website" type="text" inputMode="url" placeholder="yourcompany.com" className={inputCls} value={f2.website} onChange={(e) => updateF2("website", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Section 2: Scope */}
              <div className="mb-10">
                <div className="text-blue-300 text-xs tracking-[0.25em] uppercase mb-5">Section 2: The scope</div>
                <div className={labelCls + " mb-3"}>Which areas do you need help with? (Select all that apply)</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {SOLUTIONS.map((s) => {
                    const active = f2.solutions.includes(s);
                    return (
                      <label
                        key={s}
                        className={`cursor-pointer rounded-xl p-3.5 flex items-center gap-3 transition-all ${
                          active ? "bg-blue-500/15 border-blue-400/60" : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                        }`}
                        style={{ border: "1px solid" }}
                      >
                        <input type="checkbox" className="accent-blue-500 w-4 h-4" checked={active} onChange={() => toggleSolution(s)} />
                        <span className="text-sm text-white/85">{s}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="d-timeline" className={labelCls}>Timeline</label>
                    <select id="d-timeline" className={inputCls + " appearance-none"} value={f2.timeline} onChange={(e) => updateF2("timeline", e.target.value)}>
                      <option value="">Select...</option>
                      {TIMELINES.map((t) => (
                        <option key={t} value={t} style={{ color: "#000" }}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="d-budget" className={labelCls}>Budget range</label>
                    <select id="d-budget" className={inputCls + " appearance-none"} value={f2.budget} onChange={(e) => updateF2("budget", e.target.value)}>
                      <option value="">Select...</option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b} style={{ color: "#000" }}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Vision */}
              <div className="mb-10">
                <div className="text-blue-300 text-xs tracking-[0.25em] uppercase mb-5">Section 3: The goal</div>
                <div>
                  <label htmlFor="d-overview" className={labelCls}>Project overview</label>
                  <textarea
                    id="d-overview"
                    rows={5}
                    className={inputCls}
                    placeholder="What you need, what exists today, and anything we should know about tools, data or deadlines..."
                    value={f2.overview}
                    onChange={(e) => updateF2("overview", e.target.value)}
                  />
                </div>

                <div className={labelCls + " mt-6"}>What is the main goal?</div>
                <div className="flex flex-col gap-2.5">
                  {GOALS.map((g) => {
                    const active = f2.goal === g;
                    return (
                      <label
                        key={g}
                        className={`cursor-pointer rounded-xl p-3.5 flex items-center gap-3 transition-all ${
                          active ? "bg-blue-500/15 border-blue-400/60" : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                        }`}
                        style={{ border: "1px solid" }}
                      >
                        <input type="radio" name="goal" className="accent-blue-500 w-4 h-4" checked={active} onChange={() => updateF2("goal", g)} />
                        <span className="text-sm text-white/85">{g}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {submitError && showDetailed && <p className="text-red-300 text-sm mb-5" role="alert">{submitError}</p>}

              <div className="flex justify-center md:justify-end mt-8">
                <CustomButton
                  text={submitting ? "SENDING..." : "SEND PROJECT BRIEF"}
                  variant="primary"
                  onClick={() => handleSubmit2({ preventDefault: () => {} } as any)}
                />
              </div>
            </form>
          </FadeIn>
        )}
      </div>

      {/* Reusable testimonials + featured projects, before footer/CTA */}
      <div className="mt-16 md:mt-24">
        <PreCtaSections />
      </div>
    </div>
  );
};

export default Contact;
