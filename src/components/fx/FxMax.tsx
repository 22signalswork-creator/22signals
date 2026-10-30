/**
 * TEST BUILD ONLY (fx-max-mock branch). Extra homepage effects:
 * top progress bar, velocity skew on headings, scrambled eyebrow labels,
 * 3D tilt with glare on cards. Desktop pointer effects only on fine pointers.
 */
import React, { useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+*";

function scramble(el: HTMLElement) {
  const final = el.dataset.fxText || el.textContent || "";
  el.dataset.fxText = final;
  let f = 0;
  const total = 22;
  const tick = () => {
    f++;
    const shown = final
      .split("")
      .map((ch, i) => (ch === " " ? " " : i < (f / total) * final.length ? ch : CHARS[(Math.random() * CHARS.length) | 0]))
      .join("");
    el.textContent = shown;
    if (f < total) requestAnimationFrame(tick);
    else el.textContent = final;
  };
  tick();
}

const FxMax: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    // progress bar + velocity skew
    let last = window.scrollY, vel = 0, skew = 0, raf = 0;
    const loop = () => {
      const y = window.scrollY;
      vel = y - last;
      last = y;
      const target = Math.max(-5, Math.min(5, vel * 0.12));
      skew += (target - skew) * 0.18;
      root.style.setProperty("--fx-skew", `${skew.toFixed(3)}deg`);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // headings skew with scroll speed
    const tagHeadings = () =>
      document.querySelectorAll("main h2, .services-hero-headline").forEach((h) => h.classList.add("fx-skew"));
    tagHeadings();

    // eyebrow pills scramble in
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { scramble(e.target as HTMLElement); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -15% 0px" }
    );
    const tagEyebrows = () =>
      document.querySelectorAll<HTMLElement>("main .rounded-full.uppercase").forEach((el) => {
        if (el.dataset.fxScr || el.children.length) return;
        el.dataset.fxScr = "1";
        io.observe(el);
      });
    tagEyebrows();
    const mo = new MutationObserver(() => { tagHeadings(); tagEyebrows(); });
    mo.observe(document.body, { childList: true, subtree: true });

    // tilt + glare
    const fine = window.matchMedia("(pointer: fine)").matches;
    let tilted: HTMLElement | null = null;
    const reset = () => { if (tilted) { tilted.style.transform = ""; tilted.classList.remove("fx-tilting"); tilted = null; } };
    const move = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.(".stats-card-compact, .dc-card, .process-grid > *") as HTMLElement | null;
      if (t !== tilted) reset();
      if (!t || t.classList.contains("fx-rise")) return;
      tilted = t;
      const r = t.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      t.classList.add("fx-tilting");
      t.style.setProperty("--gx", `${px * 100}%`);
      t.style.setProperty("--gy", `${py * 100}%`);
      t.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 9}deg) rotateY(${(px - 0.5) * 11}deg) translateZ(0)`;
    };
    if (fine) window.addEventListener("pointermove", move, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      reset();
      window.removeEventListener("pointermove", move);
      root.style.removeProperty("--fx-skew");
    };
  }, []);

  return <div aria-hidden className="fx-progress"><div ref={barRef} /></div>;
};

export default FxMax;
