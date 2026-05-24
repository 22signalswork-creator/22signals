import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "../src/layout/header.tsx";
import Footer from "../src/layout/footer.tsx";
import Home from "./pages/home/home.tsx";
import Service from "./pages/services/service.tsx";
import Portfolio from "./pages/portfolio/portfolio.tsx";
import Team from "./pages/team/team.tsx";
import Readdetails from "./pages/r&d/r&d.tsx";
import Blog from "./pages/blog/blog.tsx";
import Contact from "./pages/contact/contact.tsx";
import ThankYou from "./pages/thank-you/thank-you.tsx";
import Preloader from "./layout/Preloader.tsx";
import Test from "./pages/test.tsx";
import ProjectDetailPagesAdmin from "./admin/pages/ProjectDetailPagesAdmin";
import ProjectDetailPage from "./pages/portfolio/ProjectDetailPage";

// Admin imports
import { AuthProvider } from "./admin/AuthContext";
import ProtectedRoute from "./admin/ProtectedRoute";
import AdminLayout from "./admin/AdminLayout";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import HeroEditor from "./admin/pages/HeroEditor";
import SiteSettings from "./admin/pages/SiteSettings";
import EmailSettings from "./admin/pages/EmailSettings";
import ContactSubmissions from "./admin/pages/ContactSubmissions";
import {
  ServicesAdmin,
  StatsAdmin,
  ProcessStepsAdmin,
  FaqsAdmin,
  ProjectsAdmin,
  TestimonialsAdmin,
  BlogPostsAdmin,
  TeamMembersAdmin,
  ClientLogosAdmin,
} from "./admin/pages/CrudPages";
import PageContentAdmin from "./admin/pages/PageContent";
import ServicePillarsAdmin from "./admin/pages/ServicePillarsAdmin";
import ServiceDetailPagesAdmin from "./admin/pages/ServiceDetailPagesAdmin";
import ServiceDetailPage from "./pages/services/ServiceDetailPage";
import RDResearchPagesAdmin from "./admin/pages/RDResearchPagesAdmin";
import RDResearchDetailPage from "./pages/r&d/RDResearchDetailPage";

type HeaderTheme = "light" | "dark";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";

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
    );
  }

 // Public layout — render PublicLayout ALWAYS so the hero section is
  // already painted underneath the preloader. When the preloader fades
  // out, the hero is right there, no white flash in between.
  return (
    <>
      {isLoading && <Preloader onComplete={onPreloaderDone} />}
      <PublicLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Service />} />
          <Route path="/services" element={<Service />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/team" element={<Team />} />
          <Route path="/r&d" element={<Readdetails />} />
          <Route path="/r&d/:slug" element={<RDResearchDetailPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/test" element={<Test />} />
          <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </PublicLayout>
    </>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      <AuthProvider>
        <AppShell
          isLoading={isLoading}
          onPreloaderDone={() => setIsLoading(false)}
        />
      </AuthProvider>
    </Router>
  );
}
