import React, { useState } from "react";
import { openCalendly } from "@/lib/calendly";
import { subscribe } from "@/lib/newsletter";
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
import { useCMS } from "@/hooks/useCMS";

interface Setting {
  id?: string;
  key: string;
  value: string;
  type?: string;
}

// Contact details hidden temporarily — the company is remote, so there is no
// office address to publish. Flip these back to `true` to show the rows again;
// they render whatever `site_settings` holds for those keys.
const SHOW_PHONE = true;
const SHOW_ADDRESS = false;

// Defaults — used until rows are inserted into `site_settings`.
// Phone and address are intentionally blank rather than hardcoded: the
// literals would otherwise ship in the public JS bundle even while hidden.
const FALLBACK_SETTINGS: Setting[] = [
  { key: "phone", value: "+44 7944 603108" },
  { key: "email", value: "business@22signals.com" },
  { key: "address", value: "" },
  { key: "copyright_year", value: "2026" },
];

// Compact newsletter sign-up shown on every page.
const FooterNewsletter = () => {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "busy") return;
    if (trap) { setState("done"); return; }
    setState("busy");
    const r = await subscribe(email, "footer");
    if (r.ok) { setState("done"); setEmail(""); }
    else { setState("error"); setMsg(r.error || ""); }
  };
  if (state === "done") return <p className="text-blue-300 text-sm mb-8">Thanks, you're on the list.</p>;
  return (
    <form onSubmit={submit} className="mb-8 max-w-sm" noValidate>
      <label htmlFor="footer-newsletter" className="block text-white text-sm mb-2">Subscribe to our newsletter</label>
      <input type="text" name="fax_number" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} style={{ position: "absolute", left: "-10000px", width: 1, height: 1 }} />
      <div className="flex gap-2">
        <input id="footer-newsletter" type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 min-w-0 bg-white/[0.06] border border-white/15 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#504CFF]" />
        <button type="submit" className="rounded-full px-5 py-2.5 text-sm text-white bg-[#325FEC] hover:bg-[#504CFF] transition-colors">{state === "busy" ? "..." : "Subscribe"}</button>
      </div>
      {state === "error" && <p className="text-red-300 text-xs mt-2" role="alert">{msg}</p>}
    </form>
  );
};

const Footer = () => {

  const { data: settings } = useCMS<Setting>("site_settings", {
    fallback: FALLBACK_SETTINGS,
  });

  const get = (key: string, fallback = "") =>
    settings.find((s) => s.key === key)?.value ?? fallback;

  const phone = get("phone");
  const email = get("email", "business@22signals.com");
  const address = get("address");
  const year = get("copyright_year", "2026");

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
        className="w-full flex items-center bg-black bg-cover bg-center overflow-hidden min-h-[180px] md:min-h-[300px]"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${BgImage})`,
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] items-center gap-5 md:gap-8 px-6 md:px-12 lg:px-20 py-8 md:py-12">
          {/* Left Side */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-left"
          >
            <h2 className="recentproject-title flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 text-[24px] sm:text-[32px] md:text-[44px] text-white font-bold leading-tight">
              {/* Fixed copy (the CMS value carried a reel offer that belongs in emails and VSLs, not on the site) */}
              Schedule a call. Let's connect!
              <img src={Union} alt="Union" className="w-8 h-8 md:w-10 md:h-10 animate-pulse" />
            </h2>
            <p className="text-gray-300 mt-3 md:mt-4 max-w-lg text-sm md:text-base">
              Get the signal for what's next... or get left behind in the digital age.
            </p>
          </motion.div>

          {/* Right Side */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex justify-start md:justify-end items-center"
          >
            <MyButton text="BOOK A CALL" variant="primary" onClick={() => openCalendly()} />
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
          className="container mx-auto px-6 md:px-12 lg:px-20 pt-10 md:pt-24 pb-8 md:pb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-x-6 gap-y-8 md:gap-16 text-left">
            {/* Column 1: Logo + Description */}
            <motion.div variants={itemVariants} className="col-span-2 md:col-span-1 w-full text-left md:pr-8">
              <Link to="/">
                <img
                  src={Logo}
                  alt="Logo"
                  className="mb-4 md:mb-6 h-10 md:h-14 object-contain cursor-pointer hover:scale-105 transition-transform"
                />
              </Link>
              <p className="hidden md:block text-gray-400 text-sm leading-relaxed mb-6">
                22 Signals is a global business solutions company. We build intelligent systems so companies can operate in the new era of business, then we grow them and execute with them.
              </p>
              <FooterNewsletter />
              <ul className="flex gap-4 justify-start">
                {[
                  { icon: Group88, href: "https://www.instagram.com/22signals.gg/", label: "22 Signals on Instagram" },
                  { icon: Group87, href: "https://www.linkedin.com/company/22-signals/", label: "22 Signals on LinkedIn" },
                  { icon: Group85, href: "https://www.facebook.com/share/19uFyzBXmj/", label: "22 Signals on Facebook" },
                  { icon: Group86, href: "https://x.com/22Signals", label: "22 Signals on X" },
                ].map(({ icon, href, label }) => (
                  <motion.li 
                    key={href}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="hover:opacity-80 transition-opacity">
                      <img src={icon} alt="" className="w-8 h-8" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Column 2: Navigation */}
            <motion.div variants={itemVariants} className="col-span-2 md:col-span-1 flex flex-col gap-3 md:gap-4 text-left">
              <h4 className="text-[#504CFF] font-bold uppercase tracking-wider text-sm">Navigation</h4>
              <ul className="text-gray-400 grid grid-cols-3 md:grid-cols-1 gap-x-4 gap-y-2 md:gap-y-3 text-sm">
                {[
                  ["Services", "/services"],
                  ["Portfolio", "/portfolio"],
                  ["Locations", "/locations"],
                  ["Case studies", "/case-studies"],
                  ["Insights", "/insights"],
                  ["About", "/about"],
                  ["How we work", "/how-we-work"],
                  ["For agencies", "/partners"],
                  ["FAQ", "/faq"],
                  ["Blog", "/blog"],
                  ["Contact", "/contact"],
                ].map(([item, to]) => (
                  <li key={item}>
                    <Link to={to} className="hover:text-[#504CFF] hover:pl-2 transition-all duration-300 block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 3: Legal */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3 md:gap-4 text-left">
              <h4 className="text-[#504CFF] font-bold uppercase tracking-wider text-sm">Legal</h4>
              <ul className="text-gray-400 space-y-2 md:space-y-3 text-sm">
                <li><Link to="/privacy-policy" className="hover:text-[#504CFF] hover:pl-2 transition-all duration-300 block">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-[#504CFF] hover:pl-2 transition-all duration-300 block">Terms of Service</Link></li>
                <li className="hidden md:list-item"><a href={`mailto:${email}`} className="hover:text-[#504CFF] hover:pl-2 transition-all duration-300 block">{email}</a></li>
              </ul>
            </motion.div>

            {/* Column 4: Contact */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3 md:gap-4 text-left">
              <h4 className="text-[#504CFF] font-bold uppercase tracking-wider text-sm">Contact</h4>
              <ul className="space-y-2 md:space-y-4">
                {SHOW_PHONE && (
                  <li className="flex items-center justify-start gap-3 group">
                    <img src={Frame1} alt="" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-gray-400 text-sm hover:text-white">{phone}</a>
                  </li>
                )}
                <li className="flex items-center justify-start gap-3 group">
                  <img src={Frame1} alt="" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <a href="https://wa.me/447944603108" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white">WhatsApp</a>
                </li>
                <li className="flex items-center justify-start gap-3 group">
                  <img src={dashiconemail} alt="" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <a href={`mailto:${email}`} className="text-gray-400 text-sm hover:text-white break-all">{email}</a>
                </li>
                <li className="text-gray-400 text-sm">London, United Kingdom</li>
                {SHOW_ADDRESS && (
                  <li className="flex items-start justify-start gap-3 group">
                    <img src={Frame3} alt="" className="w-6 h-6 mt-1 group-hover:rotate-12 transition-transform" />
                    <span className="text-gray-400 text-sm max-w-[260px]">
                      {address}
                    </span>
                  </li>
                )}
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
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between gap-4 text-xs text-gray-500 text-left">
          <span>© {year} 22 Signals. All rights reserved.</span>
          <div className="flex gap-8">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
