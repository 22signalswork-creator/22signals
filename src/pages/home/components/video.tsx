import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

/* ──────────────────────────────────────────────────────────────────────────
 *  Home video — fully rewritten, with native fullscreen + double marquees.
 *
 *  Hard rules learned from previous iterations:
 *
 *  1. Native HTML5 Fullscreen API. No portal modal. No body.overflow lock.
 *     Past versions froze the page; this one cannot.
 *
 *  2. Two marquees — one above, one below — slide in from opposite sides
 *     when the section enters view, then loop forever via CSS keyframes.
 *
 *  3. The frame itself does a dramatic entrance (scale 0.85 → 1, y 80 → 0,
 *     opacity 0 → 1, 1.1s cubic-bezier). Magnetic 3D tilt on hover.
 *
 *  4. Mobile fullscreen falls back to opening YouTube in a new tab.
 * ────────────────────────────────────────────────────────────────────── */

const FALLBACK_YOUTUBE_ID = "VnRC8PyzBT8";

const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  if (/^[\w-]{10,15}$/.test(url.trim())) return url.trim();
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const m = u.pathname.match(/\/(embed|shorts|v)\/([^/?#]+)/);
      if (m) return m[2];
    }
  } catch {
    /* fall through */
  }
  return null;
};

const isDirectVideoFile = (url: string): boolean =>
  /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(url.trim());

/* Year shown on the reel's overlay labels. Derived from the clock rather than
 * hardcoded so it can't go stale the way the old "2024" literals did.
 * Exported so the showcase eyebrow in ServicesSection stays in step. */
export const REEL_YEAR = new Date().getFullYear();

/** Seconds → "mm:ss". Returns "" when the duration isn't known yet. */
const formatDuration = (secs: number): string => {
  if (!Number.isFinite(secs) || secs <= 0) return "";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/* ── Cross-vendor fullscreen helpers ───────────────────────────────── */

type FsDocument = Document & {
  webkitFullscreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
};
type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
};

const getFullscreenElement = (): Element | null => {
  const d = document as FsDocument;
  return (
    d.fullscreenElement ||
    d.webkitFullscreenElement ||
    d.msFullscreenElement ||
    null
  );
};

const requestFs = (el: HTMLElement): Promise<void> => {
  const e = el as FsElement;
  if (e.requestFullscreen) return e.requestFullscreen();
  if (e.webkitRequestFullscreen) return e.webkitRequestFullscreen();
  if (e.msRequestFullscreen) return e.msRequestFullscreen();
  return Promise.reject(new Error("Fullscreen API not supported"));
};

/* ── Home reel ───────────────────────────────────────────────────────
 * Plays muted on a loop in the background. Two small controls only:
 * sound on/off and fullscreen. No tilt, no click-anywhere behaviour.
 * ──────────────────────────────────────────────────────────────────── */

const IconBtn: React.FC<{ label: string; onClick: () => void; children: React.ReactNode }> = ({ label, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    className="flex items-center justify-center w-11 h-11 rounded-full transition-colors"
    style={{ background: "rgba(5,10,24,0.55)", border: "1px solid rgba(255,255,255,0.25)", color: "#ffffff", backdropFilter: "blur(8px)" }}
  >
    {children}
  </button>
);

const Video: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const htmlVideoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [muted, setMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "home_video_url")
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setVideoUrl(data?.value?.trim() ?? "");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Only start downloading the reel when it is close to the screen.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || hasEnteredView) return;
    if (typeof IntersectionObserver === "undefined") {
      setHasEnteredView(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((x) => x.isIntersecting)) {
          setHasEnteredView(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasEnteredView]);

  // Phones only autoplay when the video is muted as a real attribute, and
  // React does not write that attribute. Set it and start playback by hand.
  useEffect(() => {
    const v = htmlVideoRef.current;
    if (!hasEnteredView || !v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    const go = () => v.play().catch(() => {});
    go();
    v.addEventListener("loadeddata", go, { once: true });
    // resume when it comes back on screen (some phones pause off-screen video)
    const io = new IntersectionObserver((es) => { if (es[0]?.isIntersecting && v.paused) go(); }, { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, [hasEnteredView, videoUrl]);

  useEffect(() => {
    const h = () => setIsFullscreen(getFullscreenElement() === frameRef.current);
    document.addEventListener("fullscreenchange", h);
    document.addEventListener("webkitfullscreenchange", h);
    return () => {
      document.removeEventListener("fullscreenchange", h);
      document.removeEventListener("webkitfullscreenchange", h);
    };
  }, []);

  const youTubeId = extractYouTubeId(videoUrl) ?? (videoUrl ? null : FALLBACK_YOUTUBE_ID);
  const directFile = isDirectVideoFile(videoUrl) ? videoUrl : null;

  const ytCommand = (func: string) =>
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");

  const toggleSound = useCallback(() => {
    const next = !muted;
    setMuted(next);
    if (htmlVideoRef.current) {
      htmlVideoRef.current.muted = next;
      if (!next) htmlVideoRef.current.play().catch(() => {});
    }
    ytCommand(next ? "mute" : "unMute");
  }, [muted]);

  const toggleFullscreen = useCallback(async () => {
    const el = frameRef.current;
    if (!el) return;
    if (getFullscreenElement()) {
      const d = document as FsDocument;
      (d.exitFullscreen || d.webkitExitFullscreen)?.call(d);
      return;
    }
    try {
      await requestFs(el);
    } catch {
      // iPhone Safari: use the video element's own fullscreen, or YouTube.
      const v = htmlVideoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
      if (v?.webkitEnterFullscreen) v.webkitEnterFullscreen();
      else if (youTubeId) window.open(`https://www.youtube.com/watch?v=${youTubeId}`, "_blank");
    }
  }, [youTubeId]);

  const ytSrc =
    youTubeId &&
    `https://www.youtube-nocookie.com/embed/${youTubeId}` +
      `?autoplay=1&mute=1&loop=1&playlist=${youTubeId}` +
      `&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <div
        ref={frameRef}
        className={isFullscreen ? "relative w-full h-full bg-black" : "relative w-full aspect-[4/3] md:aspect-[16/9] rounded-[24px] md:rounded-[28px] overflow-hidden shadow-2xl"}
        style={{ backgroundColor: "#0a0f1f" }}
      >
        {directFile ? (
          <video
            ref={htmlVideoRef}
            className={`absolute inset-0 w-full h-full ${isFullscreen ? "object-contain" : "object-cover"}`}
            src={hasEnteredView ? directFile : undefined}
            autoPlay
            muted={muted}
            loop
            playsInline
            preload="none"
          />
        ) : ytSrc && hasEnteredView ? (
          <iframe
            ref={iframeRef}
            className="absolute pointer-events-none"
            src={ytSrc}
            title="22 Signals showcase reel"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            style={
              isFullscreen
                ? { inset: 0, width: "100%", height: "100%", border: 0 }
                : { top: "-60px", left: "-5%", width: "110%", height: "calc(100% + 120px)", border: 0 }
            }
          />
        ) : null}

        <div className="absolute right-4 bottom-4 md:right-6 md:bottom-6 flex gap-2 z-10">
          <IconBtn label={muted ? "Turn sound on" : "Turn sound off"} onClick={toggleSound}>
            {muted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M11 5 6 9H2v6h4l5 4z" /><line x1="22" y1="9" x2="16" y2="15" /><line x1="16" y1="9" x2="22" y2="15" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M11 5 6 9H2v6h4l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M19 5a10 10 0 0 1 0 14" /></svg>
            )}
          </IconBtn>
          <IconBtn label={isFullscreen ? "Exit full screen" : "Full screen"} onClick={toggleFullscreen}>
            {isFullscreen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
            )}
          </IconBtn>
        </div>
      </div>
    </motion.div>
  );
};

export default Video;
