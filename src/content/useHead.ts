import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// @ts-ignore - plain JS content module shared with the prerender script
import { CMS_ROUTES, SITE } from "@/content/site.js";
import PAGES from "@/content/generated/manifest.json";

type Meta = { path: string; title: string; description: string; noindex?: boolean };

const setMeta = (selector: string, attr: string, key: string, value: string) => {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = document.createElement(selector.startsWith("link") ? "link" : "meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute(selector.startsWith("link") ? "href" : "content", value);
};

/** Keeps title, description, canonical and robots right on client-side navigation. */
export function useHead() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const path = pathname.replace(/\/$/, "") || "/";
    const all = [...(PAGES as Meta[]), ...(CMS_ROUTES as Meta[])];
    const hit = all.find((m) => m.path === path || m.path === decodeURIComponent(path));
    // Portfolio case pages and blog keep their prerendered head; only fill gaps.
    if (!hit) {
      if (path.startsWith("/portfolio/")) return;
      document.title = `${SITE.name}`;
      return;
    }
    document.title = hit.title;
    setMeta('meta[name="description"]', "name", "description", hit.description);
    setMeta('link[rel="canonical"]', "rel", "canonical", SITE.url + (path === "/" ? "/" : path));
    setMeta('meta[name="robots"]', "name", "robots", hit.noindex ? "noindex, follow" : "index, follow");
  }, [pathname]);
}
