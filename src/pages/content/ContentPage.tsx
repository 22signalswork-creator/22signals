import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DetailPage from "./DetailPage";
import ServicesHubPage from "./ServicesHubPage";
import AboutPage from "./AboutPage";
import FounderPage from "./FounderPage";
// @ts-ignore - plain JS content module shared with the prerender script
import { PAGES, SERVICES, INDUSTRIES, MARKETS } from "@/content/site.js";
// @ts-ignore - plain JS helper shared with the prerender script
import { linkBlocks } from "@/content/links.js";
import MANIFEST from "@/content/generated/manifest.json";

type Section = { id?: string; h: string; p?: string[]; list?: string[] };
type Faq = { q: string; a: string };
type Page = {
  path: string;
  subtitle?: string;
  kind: string;
  eyebrow: string;
  h1: string;
  intro: string;
  sections: Section[];
  faqs: Faq[];
  related: string[];
};
type NavItem = { path: string; label: string; blurb?: string };

type ManifestItem = { path: string; file: string; kind: string; eyebrow?: string; h1?: string };
const ALL_LINKS: NavItem[] = [...SERVICES, ...INDUSTRIES, ...MARKETS];
const labelFor = (path: string) => {
  const hit = ALL_LINKS.find((l) => l.path === path);
  if (hit) return hit.label;
  const m = (MANIFEST as ManifestItem[]).find((p) => p.path === path);
  return m ? m.eyebrow || m.h1 || path : path;
};

/** Page data: prerendered JSON embedded in the HTML on first load, otherwise fetched. */
function usePage(current: string): Page | null {
  const local = (PAGES as Page[]).find((p) => p.path === current) || null;
  const initial = (): Page | null => {
    if (typeof document !== "undefined") {
      const el = document.getElementById("page-data");
      if (el) {
        try {
          const d = JSON.parse(el.textContent || "null");
          if (d && d.path === current) return d;
        } catch {
          /* ignore */
        }
      }
    }
    return null;
  };
  const [page, setPage] = useState<Page | null>(initial);
  useEffect(() => {
    if (page && page.path === current) return;
    const m = (MANIFEST as ManifestItem[]).find((p) => p.path === current);
    if (!m) {
      setPage(local);
      return;
    }
    let cancelled = false;
    fetch(`/content/${m.file}.json`)
      .then((r) => r.json())
      .then((d) => !cancelled && setPage(d))
      .catch(() => !cancelled && setPage(local));
    return () => {
      cancelled = true;
    };
  }, [current]);
  return page && page.path === current ? page : null;
}

/**
 * Every route defined in src/content/site.js renders through here. Each page
 * type uses one of the site's original designs, filled with the page content:
 *   /services          -> original Services page design (ServicesHubPage)
 *   /about             -> original Team page design (AboutPage)
 *   /about/<founder>   -> Team page founder card design (FounderPage)
 *   everything else    -> original service detail design (DetailPage)
 * The same content is written into static HTML at build time by
 * scripts/prerender.mjs, so crawlers and AI assistants see it without JavaScript.
 * The previous generic layout is kept in the archive/seo-launch-2026-10-29 branch.
 */
const ContentPage: React.FC<{ path?: string }> = ({ path }) => {
  const location = useLocation();
  const current = path || location.pathname.replace(/\/$/, "") || "/";
  const page = usePage(current);

  if (!page) return <div className="bg-[#000202] min-h-screen" />;
  if (page.kind === "hub" && page.path === "/services") return <ServicesHubPage page={page} />;
  if (page.kind === "about") return <AboutPage page={page} />;
  if (page.kind === "person") return <FounderPage page={page} />;

  const blocks = linkBlocks(page, MANIFEST) as { title: string; items: NavItem[] }[];
  return <DetailPage page={page} blocks={blocks} labelFor={labelFor} />;
};

export default ContentPage;
