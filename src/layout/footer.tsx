import React from "react";
import { motion } from "framer-motion";
import Group85 from "../assets/Group85.svg";
import Group86 from "../assets/Group86.svg";
import Group87 from "../assets/Group87.svg";
import Group88 from "../assets/Group88.svg";
import Logo from "../assets/logo.png";
import Union from "../assets/Union.svg";
import BgImage from "../assets/footerbg.png";
import MyButton from "../components/CustomButton.js";
import Frame1 from "../assets/Frame1.svg";
import dashiconemail from "../assets/dashicons_email.png";
import Frame3 from "../assets/Frame3.svg";
import { Link } from "react-router-dom";
import FadeIn from "@/transitions/FadeIn.js";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <footer className="w-full bg-black overflow-hidden">
      {/* ===== TOP BANNER ===== */}
      <div className="w-full border-t border-[rgba(80,76,255,1)]" />
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="w-full flex items-center bg-black bg-cover bg-center overflow-hidden min-h-[300px]"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${BgImage})`,
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] items-center gap-8 px-6 md:px-12 lg:px-20 py-12">
          {/* Left Side */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center md:text-left"
          >
            <h2 className="recentproject-title flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-[28px] sm:text-[32px] md:text-[44px] text-white font-bold leading-tight">
              Schedule a call. Let’s connect!
              <img src={Union} alt="Union" className="w-8 h-8 md:w-10 md:h-10 animate-pulse" />
            </h2>
            <p className="text-gray-300 mt-4 max-w-lg">
              Get the signal for what's next... or get left behind in the digital age.
            </p>
          </motion.div>

          {/* Right Side */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex justify-center md:justify-end items-center"
          >
            <MyButton text="KNOW MORE" variant="primary" />
          </motion.div>
        </div>
      </motion.div>

      {/* ===== DIVIDER ===== */}
      <div className="w-full border-t border-[rgba(80,76,255,1)]" />

      {/* ===== FOOTER CONTENT ===== */}
      <div className="bg-black">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto px-6 md:px-12 lg:px-20 py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">        
            {/* Column 1: Logo + Description */}
            <motion.div variants={itemVariants} className="w-full text-center md:text-left">
              <Link to="/">
                <img
                  src={Logo}
                  alt="Logo"
                  className="mb-6 mx-auto md:mx-0 h-30 object-contain cursor-pointer hover:scale-105 transition-transform"
                />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                We offer a comprehensive suite of digital marketing services. From SEO and social media to content creation and PPC, we have the expertise to scale your presence.
              </p>
              <ul className="flex gap-4 justify-center md:justify-start">
                {[Group85, Group86, Group87, Group88].map((icon, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a href="#" className="hover:opacity-80 transition-opacity">
                      <img src={icon} alt="social" className="w-8 h-8" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Column 2: Navigation */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <h4 className="text-[#504CFF] font-bold uppercase tracking-wider text-sm">Navigation</h4>
              <ul className="text-gray-400 space-y-3 text-sm">
                {["Services", "Portfolio", "Team", "R&D", "Blog", "Contact"].map((item) => (
                  <li key={item}>
                    <Link to={`/${item.toLowerCase()}`} className="hover:text-[#504CFF] hover:pl-2 transition-all duration-300 block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 3: Legal */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <h4 className="text-[#504CFF] font-bold uppercase tracking-wider text-sm">Legal</h4>
              <ul className="text-gray-400 space-y-3 text-sm">
                <li><a href="#" className="hover:text-[#504CFF] hover:pl-2 transition-all duration-300 block">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#504CFF] hover:pl-2 transition-all duration-300 block">Copyright</a></li>
                <li><a href="#" className="hover:text-[#504CFF] hover:pl-2 transition-all duration-300 block">Email Address</a></li>
              </ul>
            </motion.div>

            {/* Column 4: Contact */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <h4 className="text-[#504CFF] font-bold uppercase tracking-wider text-sm">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-center justify-center md:justify-start gap-3 group">
                  <img src={Frame1} alt="" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-400 text-sm">(406) 555-0120</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3 group">
                  <img src={dashiconemail} alt="" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-400 text-sm">Hey@22signals.com</span>
                </li>
                <li className="flex items-start justify-center md:justify-start gap-3 group">
                  <img src={Frame3} alt="" className="w-6 h-6 mt-1 group-hover:rotate-12 transition-transform" />
                  <span className="text-gray-400 text-sm max-w-[200px]">
                    2972 Westheimer Rd. Santa Ana, Illinois 85486
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full border-t border-[rgba(80,76,255,1)] bg-black"
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>© 2026 22Signals. All rights reserved.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;