import React, { useState } from "react";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import CustomButton from "@/components/CustomButton";
import { subscribe } from "@/lib/newsletter";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (busy) return;
    setError(null);
    if (trap) {
      setSubmitted(true);
      return;
    }
    setBusy(true);
    const r = await subscribe(email, "blog");
    setBusy(false);
    if (!r.ok) {
      setError(r.error || null);
      return;
    }
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="bg-[#000202] py-20 md:py-28">
      <div className="container">
        <FadeIn>
          <div
            className="rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(50,95,236,0.12) 0%, rgba(50,95,236,0.04) 100%)",
              border: "1px solid rgba(80,140,255,0.25)",
            }}
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(50,95,236,0.3) 0%, transparent 60%)",
              }}
            />

            <div className="relative z-10">
              <RisingText>
                <h2 className="text-3xl md:text-5xl text-white leading-tight">
                  Stay Ahead of the Curve.
                </h2>
              </RisingText>
              <p className="text-white/65 text-base md:text-lg mt-5 max-w-2xl mx-auto">
                Practical notes on AI, cloud, data and search from the 22 Signals
                team, sent to your inbox.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
                <input
                  type="text"
                  name="fax_number"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={trap}
                  onChange={(e) => setTrap(e.target.value)}
                  style={{ position: "absolute", left: "-10000px", width: 1, height: 1 }}
                />
                <input
                  type="email"
                  aria-label="Email address"
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full sm:flex-1 px-6 py-4 bg-white/[0.06] border border-white/15 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <CustomButton text={busy ? "..." : "SUBSCRIBE"} variant="primary" onClick={handleSubmit} />
              </div>

              {error && <p className="text-red-300 mt-5 text-sm" role="alert">{error}</p>}
              {submitted && (
                <p className="text-blue-300 mt-5 text-sm">
                  Thanks, you're on the list.
                </p>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Newsletter;
