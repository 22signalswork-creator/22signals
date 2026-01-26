import React from "react";
import Group85 from "../assets/Group85.svg";
import Group86 from "../assets/Group86.svg";
import Group87 from "../assets/Group87.svg";
import Group88 from "../assets/Group88.svg";
import Logo from "../assets/logo.png";
import Union from "../assets/Union.svg";
import BgImage from "../assets/footerbg.png";
import OverlayImage from "../assets/Vector.png";
import MyButton from "../components/button.jsx";
import Frame1 from "../assets/Frame1.svg";
import dashiconemail from "../assets/dashicons_email.png";
import Frame3 from "../assets/Frame3.svg";

const Footer = () => {
  return (
    <footer>
      {/* ===== TOP BANNER ===== */}
            <div className="w-full border-t-[1px] border-t-[rgba(80,76,255,1)] bg-black "/>
      <div
        className="w-full relative flex items-center bg-black bg-cover bg-left "
        style={{ backgroundImage: `url(${BgImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={OverlayImage}
            alt="Overlay"
            className="w-full h-full object-contain object-right opacity-50  pr-30"
          />
        </div>

        <div className="container grid grid-cols-1 md:grid-cols-[3fr_1fr]
             items-center gap-8 min-h-[296px]
             px-6 md:px-12 lg:px-20
             py-10 md:py-0
             relative z-10">

          {/* Left */}
          <div className="text-center md:text-left sm:pt-10">
            <h2
              className="recentproject-title flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4
                         text-[28px] sm:text-[32px] md:text-[48px]"
            >
              Schedule a call. Let’s connect!
              <img src={Union} alt="Union" className="ml-2 inline-block w-8 h-8 md:w-10 md:h-10" />
            </h2>

            <p className="white-text">
              Get the signal for what's next... or get left behind in the digital age.
            </p>
          </div>

          {/* Right */}
          <div className="flex justify-center md:justify-end items-center mt-6 md:mt-0">
            <MyButton text="KNOW MORE" />
          </div>
        </div>
      </div>

      {/* ===== DIVIDER ===== */}
     <div className="w-full border-t-[1px] border-t-[rgba(80,76,255,1)]" />

      {/* ===== FOOTER CONTENT ===== */}
      <div className="bg-black">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 
                       md:grid-cols-[3fr_0.5fr_0.5fr_1fr]
                       gap-12 text-center md:text-left"
          >
            {/* Logo + Description */}
            <div>
              <img src={Logo} alt="Logo" className="mb-4 mx-auto md:mx-0" />

              <p className="footer-text-p mb-6 w-[100%] md:w-[70%]">
               We offers a comprehensive suite of digital marketing services that cover all aspects of our online presence. From SEO and social media marketing to content creation and PPC advertising, they have the expertise and resources to handle our diverse marketing needs.
              </p>

              <ul className="flex gap-4 justify-center md:justify-start">
                <li><img src={Group85} alt="Facebook" className="w-6 h-6 rounded-full" /></li>
                <li><img src={Group86} alt="Twitter" className="w-6 h-6 rounded-full" /></li>
                <li><img src={Group87} alt="LinkedIn" className="w-6 h-6 rounded-full" /></li>
                <li><img src={Group88} alt="Instagram" className="w-6 h-6 rounded-full" /></li>
              </ul>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="menu-heading mb-4">Navigation</h4>
              <ul className="text-content">
                <li>Service</li>
                <li>Agency</li>
                <li>Case Study</li>
                <li>Resource</li>
                <li>Contact</li>
              </ul>
            </div>

            {/* Licence */}
            <div>
              <h4 className="menu-heading mb-4">Licence</h4>
              <ul className="text-content">
                <li>Privacy Policy</li>
                <li>Copyright</li>
                <li>Email Address</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="menu-heading mb-4">Contact</h4>
             <ul className=" text-center md:text-left">
  <li className="text-content flex flex-row justify-center md:justify-start items-center gap-3">
    <img src={Frame1} alt="Phone" className="w-6 h-6" />
    <span className="contact-text">(406) 555-0120</span>
  </li>
  <li className="text-content flex flex-row justify-center md:justify-start items-center gap-3">
    <img src={dashiconemail} alt="Email" className="w-6 h-6" />
    <span className="contact-text">Hey@22signals.com</span>
  </li>
  <li className="flex flex-row mt-3 justify-center md:justify-start  gap-3">
    <img src={Frame3} alt="Address" className="w-[27px] h-[27px]" />
    <span className="contact-location">2972 Westheimer Rd. Santa Ana, Illinois 85486</span>
  </li>
</ul>

            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
<div className="w-full border-t border-[rgba(80,76,255,1)] bg-black pb-10 sm:pb-6 lg:pb-0">
  <div
    className=" bottom-bar container mx-auto px-6 md:px-12 lg:px-20 py-6
               flex flex-row items-center justify-between gap-6"
  >
    <span>© 2025 Company</span>

    <div className="flex flex-row gap-10">
      <span>Privacy</span>
      <span>Terms</span>
    </div>
  </div>
</div>

    </footer>
  );
};

export default Footer;
