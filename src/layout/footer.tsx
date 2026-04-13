import React from "react";
import Group85 from "../assets/Group85.svg";
import Group86 from "../assets/Group86.svg";
import Group87 from "../assets/Group87.svg";
import Group88 from "../assets/Group88.svg";
import Logo from "../assets/logo.png";
import Union from "../assets/Union.svg";
import BgImage from "../assets/footerbg.png";
import OverlayImage from "../assets/Vector.png";
import MyButton from "../components/CustomButton.js";
import Frame1 from "../assets/Frame1.svg";
import dashiconemail from "../assets/dashicons_email.png";
import Frame3 from "../assets/Frame3.svg";

const Footer = () => {
  return (
    <footer className="w-full bg-black overflow-hidden">
      {/* ===== TOP BANNER ===== */}
      <div className="w-full border-t border-[rgba(80,76,255,1)]" />
      
      <div
        className="relative w-full flex items-center bg-black bg-cover bg-center overflow-hidden min-h-[300px]"
        style={{ backgroundImage: `url(${BgImage})` }}
      >
        {/* Corrected Overlay - Absolute positioning so it stays behind content */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <img
            src={OverlayImage}
            alt=""
            className="w-full h-full object-cover object-right"
          />
        </div>

        <div className="container mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] items-center gap-8 px-6 md:px-12 lg:px-20 py-12 relative z-10">
          {/* Left Side */}
          <div className="text-center md:text-left">
            <h2 className="recentproject-title flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-[28px] sm:text-[32px] md:text-[44px] text-white font-bold leading-tight">
              Schedule a call. Let’s connect!
              <img src={Union} alt="Union" className="w-8 h-8 md:w-10 md:h-10 animate-pulse" />
            </h2>
            <p className="text-gray-300 mt-4 max-w-lg">
              Get the signal for what's next... or get left behind in the digital age.
            </p>
          </div>

          {/* Right Side */}
          <div className="flex justify-center md:justify-end items-center">
            <MyButton text="KNOW MORE" variant="primary" />
          </div>
        </div>
      </div>

      {/* ===== DIVIDER ===== */}
      <div className="w-full border-t border-[rgba(80,76,255,1)]" />

      {/* ===== FOOTER CONTENT ===== */}
      <div className="bg-black">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-16">
<div className="grid gap-12 text-center md:text-left [grid-template-columns:4fr_1fr_1fr_1fr]">            
            {/* Column 1: Logo + Description */}
            <div className="md:col-span-1 pr-60">
              <img src={Logo} alt="Logo" className="mb-6 mx-auto md:mx-0 h-30 object-contain" />
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                We offer a comprehensive suite of digital marketing services. From SEO and social media to content creation and PPC, we have the expertise to scale your presence.
              </p>
              <ul className="flex gap-4 justify-center md:justify-start">
                {[Group85, Group86, Group87, Group88].map((icon, i) => (
                  <li key={i}>
                    <a href="#" className="hover:opacity-80 transition-opacity">
                      <img src={icon} alt="social" className="w-8 h-8" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Navigation */}
            <div className="flex flex-col gap-4">
              <h4 className="text-blue font-bold uppercase tracking-wider text-sm">Navigation</h4>
              <ul className="text-gray-400 space-y-3 text-sm">
                <li><a href="#" className="hover:text-[#504CFF] transition-colors">Service</a></li>
                <li><a href="#" className="hover:text-[#504CFF] transition-colors">Agency</a></li>
                <li><a href="#" className="hover:text-[#504CFF] transition-colors">Case Study</a></li>
                <li><a href="#" className="hover:text-[#504CFF] transition-colors">Resource</a></li>
                <li><a href="#" className="hover:text-[#504CFF] transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Column 3: Licence */}
            <div className="flex flex-col gap-4">
              <h4 className="text-blue font-bold uppercase tracking-wider text-sm">Services</h4>
              <ul className="text-gray-400 space-y-3 text-sm">
                <li><a href="#" className="hover:text-[#504CFF] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#504CFF] transition-colors">Copyright</a></li>
                <li><a href="#" className="hover:text-[#504CFF] transition-colors">Email Address</a></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="flex flex-col gap-4">
              <h4 className="text-blue font-bold uppercase tracking-wider text-sm">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <img src={Frame1} alt="" className="w-5 h-5" />
                  <span className="text-gray-400 text-sm">(406) 555-0120</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <img src={dashiconemail} alt="" className="w-5 h-5" />
                  <span className="text-gray-400 text-sm">Hey@22signals.com</span>
                </li>
                <li className="flex items-start justify-center md:justify-start gap-3">
                  <img src={Frame3} alt="" className="w-6 h-6 mt-1" />
                  <span className="text-gray-400 text-sm max-w-[200px]">
                    2972 Westheimer Rd. Santa Ana, Illinois 85486
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="w-full border-t border-[rgba(80,76,255,1)] bg-black">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>© 2026 22Signals. All rights reserved.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;