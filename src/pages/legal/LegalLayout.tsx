import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "@/index.css";
import FadeIn from "@/transitions/FadeIn";
import logo from "@/assets/22signals-logo.png";

interface Props {
  /** Page title, e.g. "Privacy Policy" */
  title: string;
  /** Short line under the title, e.g. "Last updated: 15 July 2026" */
  lastUpdated: string;
  /** Rendered legal body. */
  children: React.ReactNode;
}

/**
 * Shared shell for the static legal pages (Privacy Policy, Terms of Service).
 *
 * Deliberately calm: legal copy needs to be readable, so we keep the site's
 * dark theme + blue accents but avoid heavy scroll animations over long text.
 */
const LegalLayout: React.FC<Props> = ({ title, lastUpdated, children }) => {
  // Long documents — make sure we always open at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#000202] min-h-screen pt-32 pb-24 px-6 relative overflow-hidden text-white">
      {/* Ambient background glow to match the rest of the site */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(50,95,236,0.16) 0%, transparent 55%)",
        }}
      />

      <div className="container relative z-10">
        <FadeIn>
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="flex justify-center mb-8">
                <Link to="/">
                  <img
                    src={logo}
                    alt="22 Signals"
                    className="h-10 md:h-12 w-auto"
                    style={{ filter: "drop-shadow(0 0 30px rgba(50,95,236,0.4))" }}
                    draggable={false}
                  />
                </Link>
              </div>
              <h1
                className="text-4xl md:text-[56px] leading-[1.05] mb-4"
                style={{
                  background:
                    "linear-gradient(91.16deg, #325FEC 1.74%, #FFFFFF 50%, #325FEC 102.48%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {title}
              </h1>
              <p className="text-white/45 text-sm tracking-wide uppercase">
                {lastUpdated}
              </p>
            </div>

            {/* Body */}
            <div className="legal-body text-white/70 text-[15px] md:text-base leading-relaxed space-y-8">
              {children}
            </div>

            {/* Footer nav between the two legal pages */}
            <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-x-8 gap-y-3 justify-center text-sm">
              <Link
                to="/privacy-policy"
                className="text-white/60 hover:text-[#6B92FF] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-white/60 hover:text-[#6B92FF] transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="text-white/60 hover:text-[#6B92FF] transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

/** Section heading used inside the legal pages. */
export const LegalSection: React.FC<{
  n: number;
  title: string;
  children: React.ReactNode;
}> = ({ n, title, children }) => (
  <section>
    <h2 className="text-white text-xl md:text-2xl font-semibold mb-3">
      <span className="text-[#6B92FF] mr-2">{n}.</span>
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </section>
);

export default LegalLayout;
