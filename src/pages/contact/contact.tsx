import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/index.css";
import "@/pages/services/services.css";
import RisingText from "@/transitions/RisingText";
import AnimatedText from "@/transitions/herosectionP.tsx";
import FadeIn from "@/transitions/FadeIn";
import CustomButton from "@/components/CustomButton";
import PreCtaSections from "@/components/PreCtaSections";
import { supabase } from "@/lib/supabase";

// Country list (abbreviated to common ones; full list still works)
const COUNTRIES = [
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Pakistan",
  "Saudi Arabia",
  "Singapore",
  "Australia",
  "Canada",
  "Germany",
  "France",
  "Netherlands",
  "Spain",
  "Italy",
  "Japan",
  "South Korea",
  "India",
  "Indonesia",
  "Malaysia",
  "Brazil",
  "Mexico",
  "South Africa",
  "Other",
];

const HELP_OPTIONS = [
  "Digital & AI Infrastructure",
  "Creative & Marketing Campaigns",
  "Esports & Broadcast Management",
  "Global Manufacturing & Supply Chain",
  "Employee Outsourcing & Remote Teams",
  "Game Development & Web3",
  "Other / General Inquiry",
];

const SOLUTIONS = [
  "Digital Solutions (Web, AI, IoT)",
  "Creative Solutions (UI/UX, 3D, Motion)",
  "Esports Solutions (Tournaments, Broadcasts)",
  "Global Manufacturing (Apparel, Tech Accessories)",
  "Employee Outsourcing (Tech, Marketing, Finance)",
  "Game Development (Mobile, Console, AR/VR)",
];

const TIMELINES = [
  "ASAP / Immediate Execution",
  "Within 1-2 Months",
  "Within 3-6 Months",
  "Just exploring options",
];

const BUDGETS = [
  "Under $5,000",
  "$10,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+",
];

// Note: per the brief, the option
//   "Reducing current development or manufacturing costs (40-60%)"
// was removed from this list and must NOT be re-added.
const GOALS = [
  "Scaling operations / Expanding team",
  "Building a new digital product from scratch",
  "Entering a new market (e.g., Web3, Esports)",
];

type FormMode = "quick" | "detailed";

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<FormMode>("quick");

  // FORM 1
  const [f1, setF1] = useState({
    name: "",
    email: "",
    number: "",
    location: "",
    company: "",
    help: "",
    message: "",
  });

  // FORM 2
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
  const formRef = useRef<HTMLDivElement>(null);

  // Switch tab AND scroll the form into view on mobile.
  //
  // Previously the function called `requestAnimationFrame` which fired
  // BEFORE the new form had been mounted, so the page only scrolled to where
  // the empty placeholder was — leaving users staring at a blank black
  // section until they manually scrolled. We now wait two animation frames
  // (one for state commit, one for DOM mount) plus a small timeout fallback,
  // so the form is fully in the layout before measuring.
  const switchMode = (next: FormMode) => {
    setMode(next);
    const scrollIntoView = () => {
      if (!formRef.current) return;
      if (window.innerWidth >= 768) return; // desktop already shows it
      const y = formRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollIntoView();
        // Belt and braces — also schedule a delayed scroll in case
        // <FadeIn>'s entry animation pushes layout shortly after mount.
        setTimeout(scrollIntoView, 150);
      });
    });
  };

  const handleSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // Guard against double-submit
    if (!f1.name || !f1.email || !f1.number || !f1.location || !f1.help) return;
    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("contact_submissions").insert([
      {
        name: f1.name,
        email: f1.email,
        company: f1.company,
        country: f1.location,
        service: f1.help,
        budget: null,
        timeline: null,
        message: f1.message,
      },
    ]);

    if (error) {
      console.error("[Contact] Form 1 Supabase insert failed:", error);
      setSubmitting(false);
      setSubmitError("We couldn't send your message. Please try again.");
      return;
    }

    // Fire-and-forget email send via Supabase Edge Function.
    // Failures here MUST NOT block the user — the submission is already
    // saved in the database and visible in the admin inbox.
    try {
      await supabase.functions.invoke("send-contact-email", {
        body: {
          form_type: "quick",
          name: f1.name,
          email: f1.email,
          phone: f1.number,
          company: f1.company,
          country: f1.location,
          service: f1.help,
          message: f1.message,
        },
      });
    } catch (e) {
      console.warn("[Contact] Email notification failed (non-blocking):", e);
    }

    setSubmitting(false);
    navigate("/thank-you");
  };

  const handleSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // Guard against double-submit
    if (!f2.name || !f2.company || !f2.email || !f2.number) return;
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
      console.error("[Contact] Form 2 Supabase insert failed:", error);
      setSubmitting(false);
      setSubmitError("We couldn't send your message. Please try again.");
      return;
    }

    // Fire-and-forget SMTP send (non-blocking)
    try {
      await supabase.functions.invoke("send-contact-email", {
        body: {
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
        },
      });
    } catch (e) {
      console.warn("[Contact] Email notification failed (non-blocking):", e);
    }

    setSubmitting(false);
    navigate("/thank-you");
  };

  // Shared input style
  const inputCls =
    "w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-blue-400 transition-colors";
  const labelCls = "block text-white/80 text-sm mb-2 font-medium";

  return (
    <div className="bg-[#000202] min-h-screen pt-32 pb-24 text-white">
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
    Let's Build the Future.
  </h1>
</RisingText>
            <AnimatedText className="text-white/65 text-base md:text-lg mt-6">
              Reach out to discuss how our agile network can help you scale
              operations and lead your market.
            </AnimatedText>
          </div>
        </FadeIn>

        {/* Mode toggle */}
        <FadeIn>
          <div className="flex justify-center mb-12">
            <div
              className="inline-flex p-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(80,140,255,0.2)",
              }}
            >
              <button
                onClick={() => switchMode("quick")}
                className="px-6 py-2.5 text-sm rounded-full transition-all"
                style={{
                  background:
                    mode === "quick" ? "#325FEC" : "transparent",
                  color: mode === "quick" ? "#fff" : "rgba(255,255,255,0.6)",
                }}
              >
                Quick Connect
              </button>
              <button
                onClick={() => switchMode("detailed")}
                className="px-6 py-2.5 text-sm rounded-full transition-all"
                style={{
                  background:
                    mode === "detailed" ? "#325FEC" : "transparent",
                  color: mode === "detailed" ? "#fff" : "rgba(255,255,255,0.6)",
                }}
              >
                Project Discovery
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Form scroll anchor */}
        <div ref={formRef} className="scroll-mt-24" />

        {/* FORM 1 — QUICK CONNECT */}
        {mode === "quick" && (
          <FadeIn>
            <form
              onSubmit={handleSubmit1}
              className="max-w-3xl mx-auto rounded-3xl p-8 md:p-12"
              style={{
                background:
                  "linear-gradient(135deg, rgba(50,95,236,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(80,140,255,0.18)",
              }}
            >
              <h2 className="text-2xl md:text-3xl text-white mb-8">
                Quick Connect.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input
                    type="text"
                    required
                    className={inputCls}
                    value={f1.name}
                    onChange={(e) => updateF1("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input
                    type="email"
                    required
                    className={inputCls}
                    value={f1.email}
                    onChange={(e) => updateF1("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Number *</label>
                  <input
                    type="tel"
                    required
                    className={inputCls}
                    value={f1.number}
                    onChange={(e) => updateF1("number", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Location *</label>
                  <select
                    required
                    className={inputCls + " appearance-none"}
                    value={f1.location}
                    onChange={(e) => updateF1("location", e.target.value)}
                  >
                    <option value="">Select country...</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} style={{ color: "#000" }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Company Name</label>
                  <input
                    type="text"
                    className={inputCls}
                    value={f1.company}
                    onChange={(e) => updateF1("company", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>How Can We Help You Scale? *</label>
                  <select
                    required
                    className={inputCls + " appearance-none"}
                    value={f1.help}
                    onChange={(e) => updateF1("help", e.target.value)}
                  >
                    <option value="">Select an option...</option>
                    {HELP_OPTIONS.map((h) => (
                      <option key={h} value={h} style={{ color: "#000" }}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Message</label>
                  <textarea
                    rows={5}
                    className={inputCls}
                    placeholder="Tell us a bit about your current goals or operational bottlenecks..."
                    value={f1.message}
                    onChange={(e) => updateF1("message", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-center md:justify-end mt-8">
                <CustomButton
                  text="INITIATE CONTACT"
                  variant="primary"
                  onClick={() => handleSubmit1({ preventDefault: () => {} } as any)}
                />
              </div>
            </form>
          </FadeIn>
        )}

        {/* FORM 2 — PROJECT DISCOVERY */}
        {mode === "detailed" && (
          <FadeIn>
            <form
              onSubmit={handleSubmit2}
              className="max-w-4xl mx-auto rounded-3xl p-8 md:p-12"
              style={{
                background:
                  "linear-gradient(135deg, rgba(50,95,236,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(80,140,255,0.18)",
              }}
            >
              <h2 className="text-2xl md:text-3xl text-white mb-3">
                Project Discovery.
              </h2>
              <p className="text-white/55 text-sm md:text-base mb-10 max-w-3xl">
                Provide us with the details of your vision. Whether you need a
                single AI developer or an entire outsourced backend office, every
                engagement includes a dedicated supervisor at no additional cost
                to ensure flawless execution.
              </p>

              {/* Section 1: Basics */}
              <div className="mb-10">
                <div className="text-blue-300 text-xs tracking-[0.25em] uppercase mb-5">
                  Section 1 — The Basics
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Full Name *</label>
                    <input
                      type="text"
                      required
                      className={inputCls}
                      value={f2.name}
                      onChange={(e) => updateF2("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Company / Organization *</label>
                    <input
                      type="text"
                      required
                      className={inputCls}
                      value={f2.company}
                      onChange={(e) => updateF2("company", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input
                      type="email"
                      required
                      className={inputCls}
                      value={f2.email}
                      onChange={(e) => updateF2("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Contact Number *</label>
                    <input
                      type="tel"
                      required
                      className={inputCls}
                      value={f2.number}
                      onChange={(e) => updateF2("number", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Company Website</label>
                    <input
                      type="url"
                      placeholder="https://"
                      className={inputCls}
                      value={f2.website}
                      onChange={(e) => updateF2("website", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Scope */}
              <div className="mb-10">
                <div className="text-blue-300 text-xs tracking-[0.25em] uppercase mb-5">
                  Section 2 — The Scope
                </div>

                <label className={labelCls + " mb-3"}>
                  Which solutions do you require? (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {SOLUTIONS.map((s) => {
                    const active = f2.solutions.includes(s);
                    return (
                      <label
                        key={s}
                        className={`cursor-pointer rounded-xl p-3.5 flex items-center gap-3 transition-all ${
                          active
                            ? "bg-blue-500/15 border-blue-400/60"
                            : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                        }`}
                        style={{ border: "1px solid" }}
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-500 w-4 h-4"
                          checked={active}
                          onChange={() => toggleSolution(s)}
                        />
                        <span className="text-sm text-white/85">{s}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Estimated Project Timeline</label>
                    <select
                      className={inputCls + " appearance-none"}
                      value={f2.timeline}
                      onChange={(e) => updateF2("timeline", e.target.value)}
                    >
                      <option value="">Select...</option>
                      {TIMELINES.map((t) => (
                        <option key={t} value={t} style={{ color: "#000" }}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Estimated Budget Range</label>
                    <select
                      className={inputCls + " appearance-none"}
                      value={f2.budget}
                      onChange={(e) => updateF2("budget", e.target.value)}
                    >
                      <option value="">Select...</option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b} style={{ color: "#000" }}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Vision */}
              <div className="mb-10">
                <div className="text-blue-300 text-xs tracking-[0.25em] uppercase mb-5">
                  Section 3 — The Vision
                </div>
                <div>
                  <label className={labelCls}>Project Overview</label>
                  <textarea
                    rows={5}
                    className={inputCls}
                    placeholder="Describe your project, the specific deliverables you need, and any technical requirements..."
                    value={f2.overview}
                    onChange={(e) => updateF2("overview", e.target.value)}
                  />
                </div>

                <label className={labelCls + " mt-6"}>
                  What is the primary goal of this engagement?
                </label>
                <div className="flex flex-col gap-2.5">
                  {GOALS.map((g) => {
                    const active = f2.goal === g;
                    return (
                      <label
                        key={g}
                        className={`cursor-pointer rounded-xl p-3.5 flex items-center gap-3 transition-all ${
                          active
                            ? "bg-blue-500/15 border-blue-400/60"
                            : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                        }`}
                        style={{ border: "1px solid" }}
                      >
                        <input
                          type="radio"
                          name="goal"
                          className="accent-blue-500 w-4 h-4"
                          checked={active}
                          onChange={() => updateF2("goal", g)}
                        />
                        <span className="text-sm text-white/85">{g}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center md:justify-end mt-8">
                <CustomButton
                  text="SUBMIT PROJECT DEBRIEF"
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
