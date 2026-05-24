import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../assets/logo.png";
import MyButton from "../components/CustomButton.tsx";
import "./headerfooter.css";
import Headericon from "@/assets/headericon.png";

interface HeaderProps {
  theme?: "light" | "dark";
}

/**
 * Sub-menus shared between desktop dropdown + mobile expandable accordion
 * so both surfaces stay in sync with one source of truth.
 */
const SERVICES_SUBMENU: { label: string; slug: string }[] = [
  { label: "Digital Solutions", slug: "digital-solutions" },
  { label: "Data & AI", slug: "data-ai" },
  { label: "Cloud Solutions", slug: "cloud-solutions" },
  { label: "Creative Solutions", slug: "creative-solutions" },
  { label: "Managed Services", slug: "managed-services" },
  { label: "Broadcasting & Events", slug: "broadcasting-events" },
  { label: "Global Manufacturing", slug: "global-manufacturing" },
];

const PORTFOLIO_SUBMENU: { label: string; path: string }[] = [
  { label: "All Projects", path: "/portfolio" },
  { label: "Digital & AI", path: "/portfolio?cat=Digital%20%26%20AI" },
  { label: "Creative & Marketing", path: "/portfolio?cat=Creative%20%26%20Marketing" },
  { label: "Broadcasting & Esports", path: "/portfolio?cat=Broadcasting%20%26%20Esports" },
  { label: "Manufacturing", path: "/portfolio?cat=Manufacturing" },
];

const Header = ({ theme = "dark" }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  // Which desktop dropdown is open (null = none). Controlled via React state
  // so we can (a) bridge the hover gap reliably, (b) close on navigation, and
  // (c) close on outside-click / Escape.
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const openDropdownNow = (label: string) => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(label);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setOpenDropdown(null);
      closeTimerRef.current = null;
    }, 180);
  };

  const closeDropdown = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(null);
  };

  const isHome = location.pathname === "/" || location.pathname === "";

  const tabs = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Team", path: "/team" },
    { label: "R&D", path: "/r&d" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ];

  /* Track minimal scroll state for header background */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active tab from current route */
  useEffect(() => {
    const cur = tabs.find((t) => t.path === location.pathname);
    if (cur) setActiveTab(cur.label);
    // Close any open desktop dropdown when route changes — fixes the bug
    // where clicking an item navigates but leaves the panel open over the
    // newly-loaded page.
    closeDropdown();
  }, [location.pathname]);

  /* Close dropdown on Escape key */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDropdown();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Cleanup any pending close timer on unmount */
  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  /* Lock body scroll while drawer is open */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  };
  const goTo = (path: string) => {
    navigate(path);
    closeMobile();
  };

  const getTextColorClass = () => {
    if (isHome) return "menu-white";
    const themeMenu = theme === "dark" ? "menu-black" : "menu-white";
    return scrolled ? "menu-black" : themeMenu;
  };

  /* ---- Framer-motion variants for the drawer ---- */
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
    exit: { opacity: 0, transition: { duration: 0.25, ease: "easeIn" as const } },
  };

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { duration: 0.55, ease: [0.86, 0, 0.07, 1] as [number, number, number, number] },
    },
    exit: {
      x: "100%",
      transition: { duration: 0.45, ease: [0.86, 0, 0.07, 1] as [number, number, number, number] },
    },
  };

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 28 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  };

  return (
    <header
      className={`header
        ${scrolled ? "scrolled" : "transparent-bg"}
        ${theme === "light" ? "theme-light" : "theme-dark"}
        ${isHome ? "is-home" : ""}
      `}
    >
      <div className="header-container">
        {/* LOGO */}
        <div className="logo-wrapper">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo cursor-pointer" />
          </Link>
        </div>

        {/* DESKTOP MENU */}
        <nav className="menu desktop-menu">
          {tabs.map((tab) => {
            if (tab.label === "Services") {
              const isOpen = openDropdown === "Services";
              return (
                <div
                  key={tab.label}
                  className={`header-dropdown-wrap ${isOpen ? "is-open" : ""}`}
                  onMouseEnter={() => openDropdownNow("Services")}
                  onMouseLeave={scheduleClose}
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      closeDropdown();
                      navigate(tab.path);
                    }}
                    className={`menu-item ${getTextColorClass()} ${
                      activeTab === tab.label ? "active" : ""
                    }`}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                  >
                    <span>{tab.label}</span>
                    <span className="header-dropdown-caret" aria-hidden>▾</span>
                  </a>
                  <div className="header-dropdown-menu">
                    {SERVICES_SUBMENU.map((s) => (
                      <a
                        key={s.slug}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          closeDropdown();
                          navigate(`/services/${s.slug}`);
                        }}
                        className="header-dropdown-item"
                      >
                        {s.label}
                      </a>
                    ))}
                    <div className="header-dropdown-divider" />
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        closeDropdown();
                        navigate("/services");
                      }}
                      className="header-dropdown-item header-dropdown-all"
                    >
                      View all services →
                    </a>
                  </div>
                </div>
              );
            }
            if (tab.label === "Portfolio") {
              const isOpen = openDropdown === "Portfolio";
              return (
                <div
                  key={tab.label}
                  className={`header-dropdown-wrap ${isOpen ? "is-open" : ""}`}
                  onMouseEnter={() => openDropdownNow("Portfolio")}
                  onMouseLeave={scheduleClose}
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      closeDropdown();
                      navigate(tab.path);
                    }}
                    className={`menu-item ${getTextColorClass()} ${
                      activeTab === tab.label ? "active" : ""
                    }`}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                  >
                    <span>{tab.label}</span>
                    <span className="header-dropdown-caret" aria-hidden>▾</span>
                  </a>
                  <div className="header-dropdown-menu">
                    {PORTFOLIO_SUBMENU.map((p) => (
                      <a
                        key={p.label}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          closeDropdown();
                          navigate(p.path);
                        }}
                        className="header-dropdown-item"
                      >
                        {p.label}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <a
                key={tab.label}
                href="#"
                onClick={(e) => { e.preventDefault(); navigate(tab.path); }}
                className={`menu-item ${getTextColorClass()} ${
                  activeTab === tab.label ? "active" : ""
                }`}
              >
                {tab.label}
              </a>
            );
          })}
        </nav>

        {/* DESKTOP RIGHT */}
        <div className="desktop-button">
          <img src={Headericon} className="w-[44px] h-[44px]" alt="" />
          <MyButton
            text="GET STARTED"
            variant={theme === "light" && !scrolled ? "secondary" : "primary"}
            className="header-b"
            onClick={() => navigate("/contact")}
          />
        </div>

        {/* MOBILE HAMBURGER — always white over dark hero, black after scroll */}
        <div className="mobile-hamburger">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            className={`mobile-hamburger-btn ${mobileMenuOpen ? "is-open" : ""} ${
              scrolled ? "text-black" : "text-white"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="hamburger-line line-1" />
            <span className="hamburger-line line-2" />
            <span className="hamburger-line line-3" />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER — premium dark glassmorphic panel with framer-motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dim + blur backdrop */}
            <motion.div
              key="mobile-backdrop"
              className="mobile-menu-backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeMobile}
            />

            {/* The drawer */}
            <motion.aside
              key="mobile-drawer"
              className="mobile-menu-drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              {/* Glowing accent ribbon down the left edge */}
              <span aria-hidden className="mobile-menu-accent" />

              {/* Header row — logo + close */}
              <div className="mobile-menu-header">
                <Link to="/" onClick={closeMobile} className="mobile-menu-logo-link">
                  <img src={logo} alt="22 Signals" className="mobile-menu-logo" />
                </Link>
                <button
                  type="button"
                  className="mobile-menu-close-btn"
                  onClick={closeMobile}
                  aria-label="Close menu"
                >
                  <span aria-hidden="true" style={{ fontSize: "18px", lineHeight: 1, fontWeight: 300 }}>
                    ✕
                  </span>
                </button>
              </div>

              {/* Nav list */}
              <motion.ul
                className="mobile-menu-list"
                variants={listVariants}
                initial="hidden"
                animate="visible"
              >
                {tabs.map((tab) => {
                  // Services with expandable sub-menu
                  if (tab.label === "Services") {
                    const expanded = mobileExpanded === "Services";
                    return (
                      <motion.li key={tab.label} variants={itemVariants}>
                        <button
                          type="button"
                          onClick={() =>
                            setMobileExpanded(expanded ? null : "Services")
                          }
                          className={`mobile-menu-item mobile-menu-trigger ${
                            activeTab === tab.label ? "active" : ""
                          }`}
                          aria-expanded={expanded}
                        >
                          <span>{tab.label}</span>
                          <span className={`mobile-menu-caret ${expanded ? "open" : ""}`}>▾</span>
                        </button>
                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.ul
                              className="mobile-submenu"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <li>
                                <a
                                  href="#"
                                  onClick={(e) => { e.preventDefault(); goTo("/services"); }}
                                  className="mobile-submenu-item mobile-submenu-all"
                                >
                                  All services →
                                </a>
                              </li>
                              {SERVICES_SUBMENU.map((s) => (
                                <li key={s.slug}>
                                  <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); goTo(`/services/${s.slug}`); }}
                                    className="mobile-submenu-item"
                                  >
                                    {s.label}
                                  </a>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  }
                  if (tab.label === "Portfolio") {
                    const expanded = mobileExpanded === "Portfolio";
                    return (
                      <motion.li key={tab.label} variants={itemVariants}>
                        <button
                          type="button"
                          onClick={() =>
                            setMobileExpanded(expanded ? null : "Portfolio")
                          }
                          className={`mobile-menu-item mobile-menu-trigger ${
                            activeTab === tab.label ? "active" : ""
                          }`}
                          aria-expanded={expanded}
                        >
                          <span>{tab.label}</span>
                          <span className={`mobile-menu-caret ${expanded ? "open" : ""}`}>▾</span>
                        </button>
                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.ul
                              className="mobile-submenu"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            >
                              {PORTFOLIO_SUBMENU.map((p) => (
                                <li key={p.label}>
                                  <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); goTo(p.path); }}
                                    className="mobile-submenu-item"
                                  >
                                    {p.label}
                                  </a>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  }
                  // Standard item
                  return (
                    <motion.li key={tab.label} variants={itemVariants}>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); goTo(tab.path); }}
                        className={`mobile-menu-item ${
                          activeTab === tab.label ? "active" : ""
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className="mobile-menu-arrow" aria-hidden>→</span>
                      </a>
                    </motion.li>
                  );
                })}
              </motion.ul>

              {/* Footer CTA */}
              <motion.div
                className="mobile-menu-footer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
              >
                <button
                  type="button"
                  className="mobile-menu-cta"
                  onClick={() => goTo("/contact")}
                >
                  <span>Get Started</span>
                  <span className="mobile-menu-cta-arrow">↗</span>
                </button>
                <p className="mobile-menu-tagline">22 Signals · Engineering the Future</p>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
