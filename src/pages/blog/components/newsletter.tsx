import React, { useState } from "react";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import CustomButton from "@/components/CustomButton";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3500);
    }
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
                Get the latest insights on tech infrastructure, esports marketing,
                and efficient business scaling delivered directly to your inbox.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full sm:flex-1 px-6 py-4 bg-white/[0.06] border border-white/15 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <CustomButton text="SUBSCRIBE" variant="primary" onClick={handleSubmit} />
              </div>

              {submitted && (
                <p className="text-blue-300 mt-5 text-sm">
                  Thanks — you're on the list. ✓
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
