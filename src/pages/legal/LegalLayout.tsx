import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "@/index.css";

interface Props {
  /** Page title, e.g. "Privacy Policy" */
  title: string;
  /** Short line under the title, e.g. "Last updated: 15 July 2026" */
  lastUpdated: string;
  /** Rendered legal body. */
  children: React.ReactNode;
}

/**
 * Shared shell for the legal pages (Privacy Policy, Terms of Service).
 * A short dark header in the site style, then the document on a light page
 * in a readable column. No scroll animations on long text.
 */
const LegalLayout: React.FC<Props> = ({ title, lastUpdated, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <header
        className="relative overflow-hidden pt-40 md:pt-48 pb-14 md:pb-16"
        style={{ background: "linear-gradient(135deg, #050A18 0%, #0E1628 60%, #1a3392 130%)" }}
      >
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="text-[11px] tracking-[0.3em] uppercase mb-4" style={{ color: "#93b8ff" }}>
              Legal
            </div>
            <h1
              style={{
                display: "block",
                margin: 0,
                fontSize: "clamp(34px, 4vw, 52px)",
                lineHeight: 1.08,
                fontWeight: 400,
                color: "#ffffff",
                WebkitTextFillColor: "#ffffff",
                background: "none",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h1>
            <div className="mt-4 text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>
              {lastUpdated}
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white py-14 md:py-20">
        <div className="container">
          <article className="legal-body max-w-3xl">{children}</article>

          <nav className="max-w-3xl mt-16 pt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm" style={{ borderTop: "1px solid rgba(10,21,48,0.1)" }}>
            <Link to="/privacy-policy" className="legal-link">Privacy Policy</Link>
            <Link to="/terms-of-service" className="legal-link">Terms of Service</Link>
            <Link to="/contact" className="legal-link">Contact</Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

/** Numbered section inside a legal page. */
export const LegalSection: React.FC<{
  n: number;
  title: string;
  children: React.ReactNode;
}> = ({ n, title, children }) => (
  <section>
    <h2>
      <span className="legal-num">{String(n).padStart(2, "0")}</span>
      {title}
    </h2>
    <div className="legal-section-body">{children}</div>
  </section>
);

export default LegalLayout;
