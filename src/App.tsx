import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "../src/layout/header.tsx";
import Footer from "../src/layout/footer.tsx";
import Home from "./pages/home/home.tsx";
import Work from "./pages/work/work.tsx";
import Service from "./pages/services/service.tsx";
import Portfolio from "./pages/portfolio/portfolio.tsx";
import Team from "./pages/team/team.tsx"
import Readdetails from "./pages/r&d/r&d.tsx"
import Blog from "./pages/blog/blog.tsx"
import Preloader from "./layout/Preloader.tsx";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* 1. Show ONLY the preloader while isLoading is true */}
      {isLoading ? (
        <Preloader onComplete={() => setIsLoading(false)} />
      ) : (
        /* 2. ONLY load the rest of the app once preloader is gone */
        <Router>
          <div className="min-h-screen flex flex-col animate-fadeIn">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/services" element={<Service />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/team" element={<Team />} />
                <Route path="/r&d" element={<Readdetails />} />
                <Route path="/blog" element={<Blog />} />
              </Routes>
            </main>
             <Footer />
          </div>
         
        </Router>
      )}
    </>
  );
}
