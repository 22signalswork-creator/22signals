import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "../src/layout/header.tsx";
import Footer from "../src/layout/footer.tsx";
import Home from "./pages/home/home.tsx";
import Service from "./pages/services/service.tsx";
import Portfolio from "./pages/portfolio/portfolio.tsx";
import Team from "./pages/team/team.tsx";
import Readdetails from "./pages/r&d/r&d.tsx";
import Blog from "./pages/blog/blog.tsx";
import Preloader from "./layout/Preloader.tsx";
import Test from "./pages/test.tsx";

// Define the theme type for better type safety
type HeaderTheme = "light" | "dark";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";

  // Logic to determine header color based on route
  const getHeaderTheme = (): HeaderTheme => {
    switch (location.pathname) {
      case "/":
        return "light";
      case "/services":
      case "/portfolio":
        return "dark";
      case "/blog":
        return "dark";
      case "/team":
        return "light";
      default:
        return "dark"; // Default fallback
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Pass the theme as a prop to your Header */}
      <Header theme={getHeaderTheme()} />
      
      <main className="flex-1">
        {children}
      </main>
      
      {!isHome && <Footer />}
    </div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <Preloader onComplete={() => setIsLoading(false)} />
      ) : (
        <Router>
          <LayoutWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Service />} />
              <Route path="/services" element={<Service />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/team" element={<Team />} />
              <Route path="/r&d" element={<Readdetails />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/test" element={<Test />} />
            </Routes>
          </LayoutWrapper>
        </Router>
      )}
    </>
  );
}