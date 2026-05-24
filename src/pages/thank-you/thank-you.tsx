import React from "react";
import { useNavigate } from "react-router-dom";
import "@/index.css";
import RisingText from "@/transitions/RisingText";
import AnimatedText from "@/transitions/herosectionP.tsx";
import FadeIn from "@/transitions/FadeIn";
import CustomButton from "@/components/CustomButton";
import logo from "@/assets/22signals-logo.png";

const ThankYou: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#000202] min-h-screen flex items-center justify-center pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(50,95,236,0.18) 0%, transparent 60%)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(80,140,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(80,140,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative z-10">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <div className="flex justify-center mb-10">
              <img
                src={logo}
                alt="22 Signals"
                className="h-12 md:h-16 w-auto"
                style={{
                  filter: "drop-shadow(0 0 30px rgba(50,95,236,0.4))",
                }}
                draggable={false}
              />
            </div>

            {/* Checkmark badge */}
            <div className="flex justify-center mb-8">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(50,95,236,0.15) 0%, rgba(50,95,236,0.05) 100%)",
                  border: "1px solid rgba(80,140,255,0.4)",
                }}
              >
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B92FF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <RisingText>
              <h1
                className="text-4xl md:text-[72px] leading-[1.05] mb-6"
                style={{
                  background:
                    "linear-gradient(91.16deg, #325FEC 1.74%, #FFFFFF 50%, #325FEC 102.48%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SIGNAL RECEIVED.
              </h1>
            </RisingText>

            <AnimatedText className="text-white/85 text-lg md:text-xl mb-3">
              Thank you for reaching out to 22 Signals.
            </AnimatedText>

            <p className="text-white/55 text-base md:text-lg leading-relaxed mt-6 max-w-2xl mx-auto">
              At 22 Signals, your time is invaluable, and we operate with a
              streamlined approach to maximize productivity. Our team is reviewing
              your project scope, and a dedicated team member will contact you
              within 24 hours to schedule your discovery call.
            </p>

            <p className="text-white/55 text-base md:text-lg leading-relaxed mt-5 max-w-2xl mx-auto">
              We look forward to helping you scale your operations and engineer
              the future of your business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <CustomButton
                text="READ OUR R&D INSIGHTS"
                variant="primary"
                onClick={() => navigate("/r&d")}
              />
              <CustomButton
                text="BROWSE OUR PORTFOLIO"
                variant="secondary"
                onClick={() => navigate("/portfolio")}
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default ThankYou;
