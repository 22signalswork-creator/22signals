import React from "react";
import CustomButton from "@/components/CustomButton";

// 1. Define the exact same types your Button accepts
type ButtonVariant = "primary" | "secondary" | "white" | "danger";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  bgImage?: string;
  bgColorClass?: string;
  bgPosition?: string;
  titleColorClass?: string;
  buttonVariant?: ButtonVariant; // 2. Change 'string' to 'ButtonVariant'
  customClass?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  bgImage,
  bgColorClass = "bg-black",
  bgPosition,
  titleColorClass = "text-white",
  buttonVariant = "primary",
  customClass = "",
}) => {
  return (
    <div className={`h-[435px] relative rounded-[24px] overflow-hidden shadow-lg flex flex-col ${customClass}`}>
      {/* Background Layer */}
      <div className={`absolute inset-0 z-0 ${bgColorClass}`}></div>
      
      {bgImage && (
        <div
          className="absolute inset-0 bg-no-repeat bg-contain bg-right object-contain z-10"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundPosition: bgPosition || "right center",
          }}
        ></div>
      )}

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col justify-between h-full p-[30px] md:p-[48px] text-white">
        <div className="space-y-4">
          <img src={icon} alt={title} className="w-[60px] h-[60px]" />
          <h3 className={`text-2xl font-semibold ${titleColorClass}`}>{title}</h3>
          <p className="text-base max-w-[340px] opacity-90">{description}</p>
        </div>
        <div className="w-full sm:w-auto flex justify-start">
          {/* 3. Pass the prop directly */}
          <CustomButton variant={buttonVariant} text="GET STARTED" />
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;