import { useState, useRef } from "react";
import Blogarrow from "@/assets/blogarrow.png";
import Bigimg1 from "@/assets/blog1.png";
import "../../../pages/home/home.css";
import "../../services/work.css";
import Calendar from "@/assets/clander.png";
import Clock from "@/assets/clock.png";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect";
import { useCMS } from "@/hooks/useCMS";

interface Article {
  id?: number | string;
  title: string;
  description: string;
  bigImage?: string;        // local fallback
  image_url?: string;       // Supabase Storage URL
  category: string;
  author: string;
  read_time?: number;
  published_at?: string;
  is_published?: boolean;
}

// Fallback used when `blog_posts` table is empty
const FALLBACK_ARTICLES: Article[] = [
  {
    id: "f1",
    title: "How AI Agents Are Reshaping Backend Operations",
    description:
      "Multi-agentic systems are no longer experimental — they are reducing operational overhead by up to 60% in real deployments.",
    bigImage: Bigimg1,
    category: "AI & Automation",
    author: "Daniyal Mansur",
    read_time: 6,
  },
  {
    id: "f2",
    title: "Esports Marketing: The Untapped ROI Channel",
    description:
      "Why traditional sports advertising is losing ground and how brands can win the youth demographic through tournament sponsorships.",
    bigImage: Bigimg1,
    category: "Esports",
    author: "Sarah Chen",
    read_time: 6,
  },
  {
    id: "f3",
    title: "Reducing Manufacturing Cost Without Cutting Quality",
    description:
      "A breakdown of supply chain strategies that delivered 40-60% savings for our retail clients in 2025.",
    bigImage: Bigimg1,
    category: "Manufacturing",
    author: "22 Signals Editorial",
    read_time: 6,
  },
  {
    id: "f4",
    title: "GEO & AEO: The New Frontier After SEO",
    description:
      "Generative and Answer Engine Optimization explained — and how to position your brand inside AI-driven search.",
    bigImage: Bigimg1,
    category: "Digital Strategy",
    author: "Daniyal Mansur",
    read_time: 6,
  },
  {
    id: "f5",
    title: "Web3 Beyond the Hype: Practical Applications",
    description:
      "Cutting through the noise — where blockchain actually creates business value in 2026.",
    bigImage: Bigimg1,
    category: "Web3",
    author: "Sarah Chen",
    read_time: 6,
  },
  {
    id: "f6",
    title: "Building a Global Backend Office in 30 Days",
    description:
      "How we deploy fully managed offshore teams with built-in supervision and zero management overhead.",
    bigImage: Bigimg1,
    category: "Operations",
    author: "22 Signals Editorial",
    read_time: 6,
  },
];

// Format ISO date → "Mar 15, 2026"
const formatDate = (iso?: string) => {
  if (!iso) return "Mar 15, 2026";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Mar 15, 2026";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("All");
  const tabsRef = useRef<HTMLDivElement>(null);

  const { data: articles } = useCMS<Article>("blog_posts", {
    filter: { is_published: true },
    orderBy: "published_at",
    ascending: false,
    fallback: FALLBACK_ARTICLES,
  });

  // Build tabs list dynamically from the categories that actually exist
  const categoriesFromData = Array.from(
    new Set(articles.map((a) => a.category).filter(Boolean))
  );
  const tabs = ["All", ...categoriesFromData];

  const filtered =
    activeTab === "All"
      ? articles
      : articles.filter((a) => a.category === activeTab);

  const scrollLeft = () =>
    tabsRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  const scrollRight = () =>
    tabsRef.current?.scrollBy({ left: 200, behavior: "smooth" });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Tabs - fixed alignment */}
      <div className="tabs-container">
        <div className="tabs">
          <button className="chevron-button" onClick={scrollLeft} aria-label="Scroll left">
            ‹
          </button>
          <div ref={tabsRef} className="tabs-scroll flex gap-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="chevron-button" onClick={scrollRight} aria-label="Scroll right">
            ›
          </button>
        </div>
      </div>

      <div className="tab-content grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {filtered.map((article, idx) => {
          const imgSrc = article.image_url || article.bigImage || Bigimg1;
          return (
            <FadeIn key={article.id ?? idx} delay={idx * 0.1}>
              <Cardhovereffect>
                <div className="bg-white rounded-[24px] shadow-lg overflow-hidden flex flex-col w-full h-full">
                  <div className="w-full h-[260px] overflow-hidden rounded-t-[24px]">
                    <img
                      src={imgSrc}
                      alt={article.title}
                      className="w-full h-full object-cover block"
                    />
                  </div>
                  <div className="p-6 flex flex-col gap-4 flex-grow">
                    <div>
                      <span className="services-badge-secondry">
                        {article.category}
                      </span>
                    </div>
                    <h1 className="tab-card-heading text-[24px] md:text-[28px]">
                      <span className="text-blue-600">
                        {article.title.split(" ")[0]}
                      </span>{" "}
                      {article.title.split(" ").slice(1).join(" ")}
                    </h1>
                    <p className="blog-text flex-grow">{article.description}</p>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span className="text-[16px] font-thin flex items-center gap-2">
                        <img src={Calendar} alt="" className="w-[18px] h-[18px]" />
                        {formatDate(article.published_at)}
                      </span>
                      <span className="text-[16px] font-thin flex items-center gap-2">
                        <img src={Clock} alt="" className="w-[18px] h-[18px]" />
                        {article.read_time ?? 6} min read
                      </span>
                    </div>
                    <hr style={{ borderColor: "#BCBCBC" }} />
                    <div className="flex justify-between items-center pt-2">
                      <p className="blog-text">Written by: {article.author}</p>
                      <img src={Blogarrow} alt="arrow" className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Cardhovereffect>
            </FadeIn>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-20">
            No articles found in <strong>{activeTab}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Tabs;
