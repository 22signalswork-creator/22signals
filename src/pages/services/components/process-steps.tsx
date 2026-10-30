import React from "react";
import { motion } from "framer-motion";
import "../services.css";
import FadeIn from "@/transitions/FadeIn";

type Step = { number: string; title: string; desc: string };
type Props = { steps?: Step[]; title?: React.ReactNode; text?: string };

const defaultSteps: Step[] = [
  { number: "01", title: "Talk", desc: "A 15-minute call to see if we fit." },
  { number: "02", title: "Plan", desc: "Discovery and a written roadmap in 5 to 7 days." },
  { number: "03", title: "Build", desc: "Specialist teams build it, dates in writing." },
  { number: "04", title: "Grow", desc: "We run it, measure it and grow it with you." },
];

/**
 * Process as a timeline: one line that fills as it comes into view, a node
 * per step, short copy underneath. Vertical on phones.
 */
const ProcessSteps: React.FC<Props> = (props) => {
  const steps = props.steps ?? defaultSteps;

  return (
    <section className="py-20 md:py-28" style={{ background: "#ffffff" }}>
      <div className="container">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-14 md:mb-20">
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(30px, 3.4vw, 48px)",
                lineHeight: 1.08,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#0A1530",
                WebkitTextFillColor: "#0A1530",
                background: "none",
              }}
            >
              {props.title ?? "How we work."}
            </h2>
            {props.text && (
              <p className="m-0 max-w-sm text-[15px] leading-relaxed" style={{ color: "rgba(10,21,48,0.6)" }}>
                {props.text}
              </p>
            )}
          </div>
        </FadeIn>

        <div className="relative">
          {/* the line (desktop: horizontal, phone: vertical) */}
          <div aria-hidden className="absolute hidden md:block left-0 right-0 top-[7px] h-px" style={{ background: "rgba(10,21,48,0.1)" }} />
          <motion.div
            aria-hidden
            className="absolute hidden md:block left-0 right-0 top-[7px] h-px origin-left"
            style={{ background: "linear-gradient(90deg, #325FEC, #93b8ff)" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <div aria-hidden className="absolute md:hidden left-[7px] top-0 bottom-0 w-px" style={{ background: "linear-gradient(180deg, #325FEC, rgba(50,95,236,0.15))" }} />

          <ol className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 list-none p-0 m-0">
            {steps.map((step, i) => (
              <motion.li
                key={step.number}
                className="relative pl-9 md:pl-0"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-1 md:static block w-[15px] h-[15px] rounded-full"
                  style={{ background: "#ffffff", border: "2px solid #325FEC", boxShadow: "0 0 0 5px rgba(50,95,236,0.1)" }}
                />
                <div className="md:mt-8 text-[12px] tracking-[0.3em] tabular-nums" style={{ color: "#325FEC" }}>
                  {step.number}
                </div>
                <h3
                  className="mt-2"
                  style={{ margin: "8px 0 0", fontSize: "clamp(24px, 2.2vw, 32px)", fontWeight: 400, color: "#0A1530", WebkitTextFillColor: "#0A1530", background: "none", letterSpacing: "-0.01em" }}
                >
                  {step.title}
                </h3>
                <p className="mt-2 m-0 text-[15px] leading-relaxed max-w-[260px]" style={{ color: "rgba(10,21,48,0.6)" }}>
                  {step.desc}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
