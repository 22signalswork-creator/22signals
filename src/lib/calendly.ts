// Calendly booking helpers.
//
// - loadCalendly() injects Calendly's widget script and stylesheet once.
// - openCalendly() opens the booking calendar in a pop-up, optionally
//   pre-filled with the visitor's name and email.
// - installCalendlyLinks() makes every <a href="https://calendly.com/...">
//   on the site open the pop-up instead of leaving the site. Links still work
//   as normal links if the script fails to load or JavaScript is off.

import { SITE } from "@/content/site.js";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (o: { url: string }) => void;
      initInlineWidget: (o: { url: string; parentElement: HTMLElement; prefill?: Record<string, unknown> }) => void;
    };
  }
}

export const BOOKING_URL: string = SITE.booking;

let loading: Promise<void> | null = null;

export function loadCalendly(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise<void>((resolve, reject) => {
    if (!document.querySelector('link[data-calendly]')) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://assets.calendly.com/assets/external/widget.css";
      css.setAttribute("data-calendly", "");
      document.head.appendChild(css);
    }
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error("Calendly failed to load"));
    };
    document.body.appendChild(s);
  });
  return loading;
}

export type Prefill = { name?: string; email?: string };

// Builds the booking URL with display options and prefill parameters.
export function bookingUrl(prefill: Prefill = {}, base = BOOKING_URL): string {
  // Encode with %20 for spaces: Calendly's embed re-encodes the URL, which
  // would turn a "+" space into a literal plus sign in the name field.
  const params: [string, string][] = [
    ["hide_gdpr_banner", "1"],
    ["background_color", "0a0f1f"],
    ["text_color", "ffffff"],
    ["primary_color", "325fec"],
  ];
  if (prefill.name) params.push(["name", prefill.name]);
  if (prefill.email) params.push(["email", prefill.email]);
  const q = params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  return `${base.split("?")[0]}?${q}`;
}

export async function openCalendly(prefill: Prefill = {}, base = BOOKING_URL): Promise<void> {
  try {
    await loadCalendly();
    window.Calendly!.initPopupWidget({ url: bookingUrl(prefill, base) });
  } catch {
    window.open(bookingUrl(prefill, base), "_blank", "noopener");
  }
}

// Fires `cb` when a visitor completes a booking in any Calendly widget.
export function onCalendlyBooked(cb: () => void): () => void {
  const handler = (e: MessageEvent) => {
    if (typeof e.data === "object" && e.data?.event === "calendly.event_scheduled") cb();
  };
  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}

let installed = false;
export function installCalendlyLinks(): void {
  if (installed || typeof document === "undefined") return;
  installed = true;
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a || !/^https:\/\/calendly\.com\//.test(a.href)) return;
    e.preventDefault();
    openCalendly({}, a.href.split("?")[0]);
  });
}
