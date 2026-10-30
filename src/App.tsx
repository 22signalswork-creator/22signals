import React, { Suspense, useState, useEffect, useLayoutEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "../src/layout/header.tsx";
import Footer from "../src/layout/footer.tsx";
import Home from "./pages/home/home.tsx";
import Preloader from "./layout/Preloader.tsx";
import { useHead } from "./content/useHead";
import MANIFEST from "./content/generated/manifest.json";
const PAGES = MANIFEST as { path: string }[];
import { Navigate } from "react-router-dom";

// Admin imports
import { AuthProvider } from "./admin/AuthContext";
import ProtectedRoute from "./admin/ProtectedRoute";

import { R, preloadRest } from "./routes";

// Admin screens load only when someone opens /admin.
const ProjectDetailPagesAdmin = React.lazy(() => import("./admin/pages/ProjectDetailPagesAdmin"));
const AdminLayout = React.lazy(() => import("./admin/AdminLayout"));
const Login = React.lazy(() => import("./admin/pages/Login"));
const Dashboard = React.lazy(() => import("./admin/pages/Dashboard"));
const HeroEditor = React.lazy(() => import("./admin/pages/HeroEditor"));
const SiteSettings = React.lazy(() => import("./admin/pages/SiteSettings"));
const EmailSettings = React.lazy(() => import("./admin/pages/EmailSettings"));
const ContactSubmissions = React.lazy(() => import("./admin/pages/ContactSubmissions"));
const PageContentAdmin = React.lazy(() => import("./admin/pages/PageContent"));
const ServicePillarsAdmin = React.lazy(() => import("./admin/pages/ServicePillarsAdmin"));
const ServiceDetailPagesAdmin = React.lazy(() => import("./admin/pages/ServiceDetailPagesAdmin"));
const RDResearchPagesAdmin = React.lazy(() => import("./admin/pages/RDResearchPagesAdmin"));
const ServicesAdmin = React.lazy(() => import("./admin/pages/CrudPages").then((m) => ({ default: m.ServicesAdmin })));
const StatsAdmin = React.lazy(() => import("./admin/pages/CrudPages").then((m) => ({ default: m.StatsAdmin })));
const ProcessStepsAdmin = React.lazy(() => import("./admin/pages/CrudPages").then((m) => ({ default: m.ProcessStepsAdmin })));
const FaqsAdmin = React.lazy(() => import("./admin/pages/CrudPages").then((m) => ({ default: m.FaqsAdmin })));
const ProjectsAdmin = React.lazy(() => import("./admin/pages/CrudPages").then((m) => ({ default: m.ProjectsAdmin })));
const TestimonialsAdmin = React.lazy(() => import("./admin/pages/CrudPages").then((m) => ({ default: m.TestimonialsAdmin })));
const BlogPostsAdmin = React.lazy(() => import("./admin/pages/CrudPages").then((m) => ({ default: m.BlogPostsAdmin })));
const TeamMembersAdmin = React.lazy(() => import("./admin/pages/CrudPages").then((m) => ({ default: m.TeamMembersAdmin })));
const ClientLogosAdmin = React.lazy(() => import("./admin/pages/CrudPages").then((m) => ({ default: m.ClientLogosAdmin })));

type HeaderTheme = "light" | "dark";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";
  useHead();

  useLayoutEffect(() => {
    // Disable smooth-scroll temporarily so navigation JUMPS instantly to the
    // top instead of animating from the previous page's scroll position.
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Restore the smooth behavior on the next frame so in-page anchor links
    // still scroll smoothly.
    requestAnimationFrame(() => {
      html.style.scrollBehavior = prev || "";
    });
  }, [location.pathname]);

 const getHeaderTheme = (): HeaderTheme => {
    const path = location.pathname;
    // Service detail pages /services/:slug have a dark background → need light (white) text
    if (path.startsWith("/services/") || path.startsWith("/portfolio/")) return "light";
    if (path.startsWith("/r&d") || path.startsWith("/r%26d")) return "light";
    // /services uses the original light Services page design, so dark header text.
    if (path === "/services") return "dark";
    if ((PAGES as { path: string }[]).some((p) => p.path === path)) return "light";
    switch (path) {
      case "/":
        return "light";
      case "/services":
      case "/portfolio":
      case "/blog":
        return "dark";
      case "/team":
        return "light";
      case "/contact":
      case "/thank-you":
      case "/privacy-policy":
      case "/terms-of-service":
        return "light";
      default:
        return "dark";
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header theme={getHeaderTheme()} />
      <main className="flex-1">{children}</main>
      {!isHome && <Footer />}
    </div>
  );
};

/**
 * AppShell — decides which layout to use based on the URL.
 * /admin/*  → admin shell (no public header/footer/preloader)
 * everything else → public layout
 */
const AppShell = ({
  isLoading,
  onPreloaderDone,
}: {
  isLoading: boolean;
  onPreloaderDone: () => void;
}) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  // Admin routes never show the preloader
  if (isAdmin) {
    return (
      <Suspense fallback={null}>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="page-content" element={<PageContentAdmin />} />
          <Route path="hero" element={<HeroEditor />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="service-pillars" element={<ServicePillarsAdmin />} />
          <Route path="service-detail-pages" element={<ServiceDetailPagesAdmin />} />
          <Route path="stats" element={<StatsAdmin />} />
          <Route path="process-steps" element={<ProcessStepsAdmin />} />
          <Route path="faqs" element={<FaqsAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="testimonials" element={<TestimonialsAdmin />} />
          <Route path="blog-posts" element={<BlogPostsAdmin />} />
          <Route path="team-members" element={<TeamMembersAdmin />} />
          <Route path="client-logos" element={<ClientLogosAdmin />} />
          <Route path="site-settings" element={<SiteSettings />} />
          <Route path="email-settings" element={<EmailSettings />} />
          <Route path="contact-submissions" element={<ContactSubmissions />} />
          <Route path="project-detail-pages" element={<ProjectDetailPagesAdmin />} />
          <Route path="rd-research-pages" element={<RDResearchPagesAdmin />} />
        </Route>
      </Routes>
      </Suspense>
    );
  }

 // Public layout — render PublicLayout ALWAYS so the hero section is
  // already painted underneath the preloader. When the preloader fades
  // out, the hero is right there, no white flash in between.
  return (
    <>
      {isLoading && <Preloader onComplete={onPreloaderDone} />}
      <PublicLayout>
        <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Navigate to="/portfolio" replace />} />
          {(PAGES as { path: string }[])
            .filter((p) => p.path !== "/")
            .map((p) => (
              <Route key={p.path} path={p.path} element={<R.Content path={p.path} />} />
            ))}
          <Route path="/services/:slug" element={<R.ServiceDetail />} />
          <Route path="/portfolio" element={<R.Portfolio />} />
          <Route path="/team" element={<R.Team />} />
          <Route path="/r&d" element={<R.RD />} />
          <Route path="/r&d/:slug" element={<R.RDDetail />} />
          <Route path="/blog" element={<R.Blog />} />
          <Route path="/contact" element={<R.Contact />} />
          <Route path="/thank-you" element={<R.ThankYou />} />
          <Route path="/privacy-policy" element={<R.Privacy />} />
          <Route path="/terms-of-service" element={<R.Terms />} />
          <Route path="/portfolio/:slug" element={<R.ProjectDetail />} />
          <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
          <Route
            path="*"
            element={
              <div className="bg-[#000202] min-h-screen pt-40 px-6 text-center text-white">
                <h1 className="text-4xl mb-4">Page not found</h1>
                <a href="/" className="text-[#6B92FF]">Go to the homepage</a>
              </div>
            }
          />
        </Routes>
        </Suspense>
      </PublicLayout>
    </>
  );
};

// The intro animation plays once per visit, not on every page load.
const seenIntro = (() => {
  try {
    return sessionStorage.getItem("22s-intro") === "1";
  } catch {
    return false;
  }
})();

export default function App() {
  const [isLoading, setIsLoading] = useState(!seenIntro);
  useEffect(() => {
    preloadRest();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppShell
          isLoading={isLoading}
          onPreloaderDone={() => {
            try {
              sessionStorage.setItem("22s-intro", "1");
            } catch {
              /* private mode */
            }
            setIsLoading(false);
          }}
        />
      </AuthProvider>
    </Router>
  );
}
