import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import MyButton from "../components/button.tsx";
import "./headerfooter.css";
import Headericon from "@/assets/headericon.png";


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const [activeTab, setActiveTab] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isTeamPage = location.pathname === "/team";

  const tabs = [
    { label: "Home", path: "/" },
    { label: "Work", path: "/work" },
    { label: "Services", path: "/services" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Team", path: "/team" },
    { label: "R&D", path: "/r&d" },
    { label: "BLOG", path: "/blog" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`header ${scrolled ? "scrolled" : ""} ${
        isTeamPage ? "team-header" : ""
      }`}
    >
      <div className="header-container">
        <div className="logo-wrapper">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        {/* Desktop Menu */}
        <nav className="menu desktop-menu">
          {tabs.map((tab) => (
            <a
              key={tab.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.label);
                navigate(tab.path);
              }}
             className={`menu-item ${
  activeTab === tab.label ? "active" : ""
} ${isTeamPage && !scrolled ? "menu-white" : "menu-black"}`}

            >
              {tab.label}
            </a>
          ))}
        </nav>

        <div className="desktop-button">
          <img src={Headericon} className="w-[44px] h-[44px]" alt="" />
          <div className="btn">
            <MyButton text="GET STARTED" className="header-b" />
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="mobile-hamburger">
          <button className="header-b" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
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
                  setActiveTab(tab.label);
                  navigate(tab.path);
                  setMobileMenuOpen(false);
                }}
               className={`mobile-menu-item ${
  activeTab === tab.label ? "active" : ""
} ${isTeamPage && !scrolled ? "menu-white" : "menu-black"}`}
              >
                {tab.label}
              </a>
            </li>
          ))}

          <div className="mobile-menu-button">
            <MyButton />
          </div>
        </ul>
      </div>

      {/* Overlay */}
      <div
        className={`overlay ${mobileMenuOpen ? "visible" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>
    </header>
  );
};

export default Header;
