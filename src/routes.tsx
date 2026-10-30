/**
 * Route-level code splitting.
 *
 * Each page is its own chunk, so the homepage no longer downloads the admin,
 * portfolio, blog and content-page code. `lazyRoute` throws the import promise
 * while the chunk loads (Suspense), and main.tsx preloads the chunk for the
 * first URL before React renders, so the prerendered HTML is never replaced
 * by an empty screen. Once the page is idle the rest are fetched quietly, so
 * later navigation is instant.
 */
import React from "react";
// @ts-ignore - plain JS content module
import { PAGES } from "./content/site.js";

type Mod = { default: React.ComponentType<any> };

export function lazyRoute(factory: () => Promise<Mod>) {
  let mod: Mod | null = null;
  let promise: Promise<Mod> | null = null;
  const load = () => (promise ??= factory().then((m) => (mod = m)));
  const Route = (props: any) => {
    if (mod) {
      const C = mod.default;
      return <C {...props} />;
    }
    throw load();
  };
  Route.preload = load;
  return Route as React.FC<any> & { preload: () => Promise<Mod> };
}

export const R = {
  Content: lazyRoute(() => import("./pages/content/ContentPage")),
  Portfolio: lazyRoute(() => import("./pages/portfolio/portfolio.tsx")),
  ProjectDetail: lazyRoute(() => import("./pages/portfolio/ProjectDetailPage")),
  Team: lazyRoute(() => import("./pages/team/team.tsx")),
  RD: lazyRoute(() => import("./pages/r&d/r&d.tsx")),
  RDDetail: lazyRoute(() => import("./pages/r&d/RDResearchDetailPage")),
  Blog: lazyRoute(() => import("./pages/blog/blog.tsx")),
  Contact: lazyRoute(() => import("./pages/contact/contact.tsx")),
  ThankYou: lazyRoute(() => import("./pages/thank-you/thank-you.tsx")),
  Privacy: lazyRoute(() => import("./pages/legal/PrivacyPolicy.tsx")),
  Terms: lazyRoute(() => import("./pages/legal/TermsOfService.tsx")),
  ServiceDetail: lazyRoute(() => import("./pages/services/ServiceDetailPage")),
};

const contentPaths = new Set((PAGES as { path: string }[]).map((p) => p.path));

export function routeFor(pathname: string) {
  const p = decodeURIComponent(pathname).replace(/\/+$/, "") || "/";
  if (p === "/") return null;
  if (contentPaths.has(p)) return R.Content;
  if (p === "/portfolio") return R.Portfolio;
  if (p.startsWith("/portfolio/")) return R.ProjectDetail;
  if (p === "/team") return R.Team;
  if (p === "/r&d") return R.RD;
  if (p.startsWith("/r&d/")) return R.RDDetail;
  if (p === "/blog") return R.Blog;
  if (p === "/contact") return R.Contact;
  if (p === "/thank-you") return R.ThankYou;
  if (p === "/privacy-policy") return R.Privacy;
  if (p === "/terms-of-service") return R.Terms;
  if (p.startsWith("/services/")) return R.ServiceDetail;
  return null;
}

export function preloadRest() {
  const go = () => Object.values(R).forEach((r) => r.preload().catch(() => {}));
  const w = window as any;
  if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 4000 });
  else setTimeout(go, 2500);
}
