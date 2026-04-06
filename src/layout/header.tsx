import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import MyButton from "../components/CustomButton.tsx";
import "./headerfooter.css";
import Headericon from "@/assets/headericon.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = location.pathname === "/";
  const isTeamPage = location.pathname === "/team";

  const tabs = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/work" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Team", path: "/team" },
    { label: "R&D", path: "/r&d" },
    { label: "BLOG", path: "/blog" },
  ];

  useEffect(() => {
    // SINCE SCROLLSLIDER IS GONE: Use a simple, fast scroll listener
    const handleScroll = () => {
      // Trigger white background after only 10px of scrolling
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Run once on load to check if user refreshed halfway down the page
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Remove isHomePage dependency to make it global

  // Update active tab based on URL
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab) setActiveTab(currentTab.label);
  }, [location.pathname]);

  return (
    <header
      className={`header ${scrolled ? "scrolled" : "transparent-bg"} ${
        isTeamPage ? "team-header" : ""
      }`}
    >
      <div className="header-container">
        <div className="logo-wrapper">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <nav className="menu desktop-menu">
          {tabs.map((tab) => (
            <a
              key={tab.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(tab.path);
              }}
              className={`menu-item ${
                (isHomePage || isTeamPage) && !scrolled ? "menu-black" : "menu-black"
              } ${activeTab === tab.label ? "active" : ""}`}
            >
              {tab.label}
            </a>
          ))}
        </nav>

        <div className="desktop-button">
          <img src={Headericon} className="w-[44px] h-[44px]" alt="" />
          <MyButton text="GET STARTED" variant="primary" className="header-b" />
        </div>

        {/* Mobile Hamburger */}
        <div className="mobile-hamburger">
          <button className="header-b" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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

      {/* Mobile Sidebar */}
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

      <div className={`overlay ${mobileMenuOpen ? "visible" : ""}`} onClick={() => setMobileMenuOpen(false)}></div>
    </header>
  );
};

export default Header;