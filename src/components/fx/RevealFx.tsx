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
  // other pages: any card grid in the page body rises in, row by row
  { box: "main .grid", items: ":scope > *" },
];

const RevealFx = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seen = new WeakSet<Element>();
    const pending = new Set<Element>();
    const reveal = (box: Element) => {
      if (!pending.has(box)) return;
      pending.delete(box);
      io.unobserve(box);
      const items = (box as any).__fxItems as HTMLElement[];
      items.forEach((el) => el.classList.add("fx-in"));
      window.setTimeout(() => items.forEach((el) => el.classList.remove("fx-rise", "fx-in")), 1700);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && reveal(e.target)),
      { rootMargin: "0px 0px -10% 0px" }
    );
    // Backstop for fast flicks: anything already scrolled past is revealed.
    let st = 0;
    const sweep = () => {
      st = 0;
      pending.forEach((box) => {
        if (box.getBoundingClientRect().top < window.innerHeight * 0.9) reveal(box);
      });
    };
    const onScroll = () => { if (!st) st = window.setTimeout(sweep, 150); };
    window.addEventListener("scroll", onScroll, { passive: true });
    const scan = () => {
      GROUPS.forEach((g) => {
        document.querySelectorAll(g.box).forEach((box) => {
          if (seen.has(box)) return;
          if (box.closest("header, footer, .slick-slider, .mwwd, .wwd-stage, .legal-body, form")) return;
          if (g.box === "main .grid" && box.closest(".home-stats, .process-grid, .faq-list")) return;
          const items = g.items ? (Array.from(box.querySelectorAll(g.items)) as HTMLElement[]) : [box as HTMLElement];
          if (!items.length) return;
          const r = box.getBoundingClientRect();
          if (!r.width || !r.height) return; // not displayed at this size
          if (r.top < window.innerHeight * 0.9) return; // already on screen: leave it be
          seen.add(box);
          items.forEach((el, i) => {
            el.classList.add("fx-rise");
            el.style.setProperty("--ri", String(Math.min(i, 8)));
          });
          (box as any).__fxItems = items;
          pending.add(box);
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
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(st);
      window.clearTimeout(t);
    };
  }, []);
  return null;
};

export default RevealFx;
