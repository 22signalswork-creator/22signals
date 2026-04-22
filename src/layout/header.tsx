import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import MyButton from "../components/CustomButton.tsx";
import "./headerfooter.css";
import Headericon from "@/assets/headericon.png";

interface HeaderProps {
  theme?: "light" | "dark";
}

const Header = ({ theme = "dark" }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // SCROLL STATES (unchanged)
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const tabs = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Team", path: "/team" },
    { label: "R&D", path: "/r&d" },
    { label: "BLOG", path: "/blog" },
  ];

  /* =====================
     SCROLL BEHAVIOR
  ===================== */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 10);

      if (Math.abs(currentScrollY - lastScrollY) < 5) return;

      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* =====================
     ACTIVE TAB
  ===================== */
  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.path === location.pathname);
    if (currentTab) setActiveTab(currentTab.label);
  }, [location.pathname]);

  /* =====================
     FIXED TEXT COLOR (FOR ALL PAGES)
  ===================== */
  const getTextColorClass = () => {

     return scrolled ?  "menu-black" :  "menu-white"; // force same color everywhere
    return theme == "dark" ? "menu-black" : "menu-white"; // force same color everywhere
  };

  return (
    <header
      className={`header 
        ${scrolled ? "scrolled" : "transparent-bg"} 
        ${theme === "light" ? "theme-light" : "theme-dark"}
        ${showHeader ? "header-show" : "header-hide"}
      `}
    >
      <div className="header-container">
        
        {/* LOGO */}
        <div className="logo-wrapper">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="logo cursor-pointer" // removed invert logic
            />
          </Link>
        </div>

        {/* DESKTOP MENU */}
        <nav className="menu desktop-menu">
          {tabs.map((tab) => (
            <a
              key={tab.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(tab.path);
              }}
              className={`menu-item ${getTextColorClass()} ${
                activeTab === tab.label ? "active" : ""
              }`}
            >
              {tab.label}
            </a>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="desktop-button">
          <img src={Headericon} className="w-[44px] h-[44px]" alt="" />
          <MyButton 
            text="GET STARTED" 
            variant={theme === "light" && !scrolled ? "secondary" : "primary"} 
            className="header-b" 
          />
        </div>

        {/* MOBILE HAMBURGER */}
        <div className="mobile-hamburger">
          <button 
            className={`header-b ${theme === "light" && !scrolled ? "text-white" : "text-black"}`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-close">
          <button onClick={() => setMobileMenuOpen(false)}>✕</button>
        </div>

        <ul className="mobile-menu-list">
          {tabs.map((tab) => (
            <li key={tab.label}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(tab.path);
                  setMobileMenuOpen(false);
                }}
                className={`mobile-menu-item ${activeTab === tab.label ? "active" : ""}`}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* OVERLAY */}
      <div
        className={`overlay ${mobileMenuOpen ? "visible" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>
    </header>
  );
};

export default Header;