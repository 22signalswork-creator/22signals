/**
 * Staggered rise-in for groups of homepage blocks (stat cards, process
 * steps, FAQ rows, the logo band, the project slider, the globe). Works on
 * whatever is rendered, including content that arrives later from the CMS:
 * new nodes are picked up by a MutationObserver. Each block animates once,
 * then its helper classes are removed so its own hover styles are untouched.
 */
import { useEffect } from "react";

const GROUPS: { box: string; items?: string }[] = [
  { box: ".home-stats", items: ".stats-card-compact" },
  { box: ".wwd-stage" },
  { box: ".mwwd-stage" },
  { box: ".logos-band-wrap" },
  { box: ".featured-slider" },
  { box: ".process-grid", items: ":scope > *" },
  { box: ".faq-list", items: ":scope > *" },
];

const RevealFx = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const items = (e.target as any).__fxItems as HTMLElement[];
          items.forEach((el) => el.classList.add("fx-in"));
          window.setTimeout(() => items.forEach((el) => el.classList.remove("fx-rise", "fx-in")), 1600 + items.length * 90);
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    const scan = () => {
      GROUPS.forEach((g) => {
        document.querySelectorAll(g.box).forEach((box) => {
          if (seen.has(box)) return;
          const items = g.items ? (Array.from(box.querySelectorAll(g.items)) as HTMLElement[]) : [box as HTMLElement];
          if (!items.length) return;
          const r = box.getBoundingClientRect();
          if (r.top < window.innerHeight * 0.9) return; // already on screen: leave it be
          seen.add(box);
          items.forEach((el, i) => {
            el.classList.add("fx-rise");
            el.style.setProperty("--ri", String(i));
          });
          (box as any).__fxItems = items;
          io.observe(box);
        });
      });
    };
    scan();
    let t = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(scan, 120);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(t);
    };
  }, []);
  return null;
};

export default RevealFx;
