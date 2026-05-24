import React from "react";
import CustomButton from "@/components/CustomButton";

type ButtonVariant = "primary" | "secondary" | "white" | "danger";
type CardTone = "blue" | "dark";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  tone?: CardTone;
  buttonVariant?: ButtonVariant;
  customClass?: string;
  decoration?: React.ReactNode;
  highlight?: string;
  size?: "regular" | "tall";
  /** Where the GET STARTED button takes the user (e.g., "/services/digital-solutions") */
  onClick?: () => void;
  /** Where the whole card click should take the user (defaults to onClick) */
  onCardClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  tone = "dark",
  buttonVariant = "white",
  customClass = "",
  decoration,
  highlight,
  size = "regular",
  onClick,
  onCardClick,
}) => {
  const isBlue = tone === "blue";

  const bgStyle: React.CSSProperties = isBlue
    ? {
        background:
          "radial-gradient(circle at 0% 0%, #4571F5 0%, #2447b8 60%, #1a3392 100%)",
      }
    : {
        background:
          "radial-gradient(circle at 100% 0%, #0E1628 0%, #050A18 60%, #02040D 100%)",
      };

  const minH = size === "tall" ? "min-h-[420px]" : "min-h-[330px]";

  return (
    <div
      role={onCardClick || onClick ? "button" : undefined}
      tabIndex={onCardClick || onClick ? 0 : undefined}
      onClick={onCardClick ?? onClick}
      onKeyDown={(e) => {
        const handler = onCardClick ?? onClick;
        if (handler && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handler();
        }
      }}
      className={`group relative h-full ${minH} rounded-[24px] overflow-hidden flex flex-col transition-transform duration-500 ease-out hover:-translate-y-1 ${onCardClick || onClick ? "cursor-pointer" : ""} ${customClass}`}
      style={bgStyle}
    >
      {/* Decoration */}
      {decoration && (
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-end overflow-hidden opacity-90">
          {decoration}
        </div>
      )}

      {/* Soft gradient corner glow */}
      <div
        className="absolute -top-32 -right-20 w-[280px] h-[280px] rounded-full pointer-events-none opacity-30 blur-3xl"
        style={{
          background: isBlue ? "rgba(255,255,255,0.4)" : "rgba(50,95,236,0.6)",
        }}
      />

      {/* Inner gradient border (1px) */}
      <div
        className="absolute inset-0 rounded-[24px] pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(80,140,255,0.18) 100%)",
          padding: "1px",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-8 text-white">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div
              className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${
                isBlue ? "bg-white/15" : "bg-white/[0.08]"
              }`}
              style={{
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <img
                src={icon}
                alt={title}
                className="w-7 h-7 object-contain"
                style={{ filter: isBlue ? "brightness(0) invert(1)" : "" }}
              />
            </div>
            {highlight && (
              <span
                className="text-[10px] tracking-[0.25em] uppercase opacity-60"
                style={{ color: isBlue ? "rgba(255,255,255,0.85)" : "#7eaaff" }}
              >
                {highlight}
              </span>
            )}
          </div>

          <h3
            className="font-medium leading-tight text-white"
            style={{
              fontSize: "clamp(17px, 1.55vw, 22px)",
              wordBreak: "keep-all",
              overflowWrap: "normal",
              hyphens: "manual",
            }}
          >
            {title}
          </h3>
          <p className="text-sm md:text-[14px] max-w-[340px] text-white/80 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="w-full sm:w-auto flex justify-start mt-6">
          <CustomButton variant={buttonVariant} text="GET STARTED" onClick={onClick} />
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
