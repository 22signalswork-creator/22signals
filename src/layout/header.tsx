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
    { label: "Work", path: "/work" },
    { label: "Services", path: "/services" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Team", path: "/team" },
    { label: "R&D", path: "/r&d" },
    { label: "BLOG", path: "/blog" },
  ];

  useEffect(() => {
    if (isHomePage) {
      // Use MutationObserver to detect when ScrollSlider changes sections
      const checkScrollSliderPosition = () => {
        const sections = document.querySelectorAll('.section-container');
        let currentSectionIndex = -1;

        sections.forEach((section, index) => {
          const computedStyle = window.getComputedStyle(section as HTMLElement);
          const opacity = parseFloat(computedStyle.opacity);
          if (opacity > 0) {
            currentSectionIndex = index;
          }
        });

        // If we're on any section other than the first, consider it scrolled
        setScrolled(currentSectionIndex > 0);
      };

      // Check immediately
      checkScrollSliderPosition();

      // Set up MutationObserver to watch for section changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            checkScrollSliderPosition();
          }
        });
      });

      // Observe all section containers
      const sections = document.querySelectorAll('.section-container');
      sections.forEach(section => {
        observer.observe(section, { attributes: true, attributeFilter: ['style'] });
      });

      // Also observe for new sections being added
      const container = document.querySelector('.relative.w-screen.h-screen.overflow-hidden');
      if (container) {
        observer.observe(container, { childList: true });
      }

      return () => observer.disconnect();
    } else {
      // Normal scroll detection for other pages
      const handleScroll = () => {
        setScrolled(window.scrollY > 50);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isHomePage]);

  return (
    <header
      className={`header ${scrolled ? "scrolled" : ""} ${
        isTeamPage ? "team-header" : ""
      } ${isHomePage && !scrolled ? "home-header-transparent" : ""}`}
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
  isTeamPage && !scrolled ? "menu-white" : "menu-black"
} ${activeTab === tab.label ? "active" : ""}`}

            >
              {tab.label}
            </a>
          ))}
        </nav>

        <div className="desktop-button">
          <img src={Headericon} className="w-[44px] h-[44px]" alt="" />
          <div className="">
            <MyButton text="GET STARTED" variant="primary" className="header-b" />
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
