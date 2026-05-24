import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
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

/* ── PLAY OUR SHOWCASE marquee ─────────────────────────────────────── */

interface MarqueeProps {
  direction?: "left" | "right";
  speed?: number;
}

const ShowcaseMarquee: React.FC<MarqueeProps> = ({
  direction = "left",
  speed = 32,
}) => {
  const half = Array.from({ length: 10 }).map((_, i) => (
    <span key={i} className="sm-item">
      <span className="sm-arrow">▶▶▶</span>
      <span className="sm-text">PLAY&nbsp;OUR&nbsp;SHOWCASE</span>
    </span>
  ));

  return (
    <div className="sm-wrap" aria-hidden="true">
      <div
        className={`sm-track ${direction === "right" ? "sm-reverse" : ""}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {half}
        {half}
      </div>

      <style>{`
        .sm-wrap {
          width: 100%;
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
          position: relative;
          line-height: 1;
          mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
        }
        .sm-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation-name: sm-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          transform: translate3d(0, 0, 0);
        }
        .sm-reverse {
          animation-direction: reverse;
        }
        .sm-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #0A1530;
          white-space: nowrap;
          font-size: clamp(13px, 1.3vw, 16px);
        }
        .sm-arrow {
          color: #325FEC;
          font-size: 0.85em;
          letter-spacing: 2px;
        }
        @keyframes sm-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sm-track { animation: none; }
        }
      `}</style>
    </div>
  );
};

/* ── Main component ─────────────────────────────────────────────────── */

const Video: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const htmlVideoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [introVisible, setIntroVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Magnetic 3D tilt — only active when NOT in fullscreen.
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [playOffset, setPlayOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "home_video_url")
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setVideoUrl(data?.value?.trim() ?? "");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIntroVisible(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const sendInlineCommand = useCallback(
    (cmd: "playVideo" | "pauseVideo") => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: cmd, args: [] }),
          "*"
        );
      }
      if (htmlVideoRef.current) {
        if (cmd === "playVideo") htmlVideoRef.current.play().catch(() => {});
        else htmlVideoRef.current.pause();
      }
    },
    []
  );

  const openFullscreen = useCallback(
    async (e?: React.MouseEvent | React.KeyboardEvent) => {
      if (e) e.stopPropagation();
      const el = frameRef.current;
      if (!el) return;
      try {
        sendInlineCommand("pauseVideo");
        await requestFs(el);
      } catch (err) {
        // iOS / unsupported → open YouTube as fallback
        const ytId = extractYouTubeId(videoUrl) || FALLBACK_YOUTUBE_ID;
        if (ytId) {
          window.open(`https://www.youtube.com/watch?v=${ytId}`, "_blank");
        }
        console.warn("Fullscreen not supported, opened tab fallback", err);
      }
    },
    [sendInlineCommand, videoUrl]
  );

  useEffect(() => {
    const handler = () => {
      const active = getFullscreenElement() === frameRef.current;
      setIsFullscreen(active);
      if (active) {
        setTilt({ rx: 0, ry: 0 });
        setPlayOffset({ x: 0, y: 0 });
      } else {
        setTimeout(() => sendInlineCommand("playVideo"), 80);
      }
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, [sendInlineCommand]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFullscreen) return;
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    setTilt({ rx: -dy * 5, ry: dx * 7 });
    setPlayOffset({ x: dx * 18, y: dy * 18 });
  };
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
    setPlayOffset({ x: 0, y: 0 });
  };

  const youTubeId =
    extractYouTubeId(videoUrl) ?? (videoUrl ? null : FALLBACK_YOUTUBE_ID);
  const directFile = isDirectVideoFile(videoUrl) ? videoUrl : null;

  const ytInlineSrc =
    youTubeId &&
    `https://www.youtube-nocookie.com/embed/${youTubeId}` +
      `?autoplay=1&mute=1&loop=1&playlist=${youTubeId}` +
      `&controls=0&showinfo=0&modestbranding=1&rel=0` +
      `&playsinline=1&enablejsapi=1&iv_load_policy=3` +
      `&disablekb=1&fs=0&cc_load_policy=0`;

  const ytFsSrc =
    youTubeId &&
    `https://www.youtube-nocookie.com/embed/${youTubeId}` +
      `?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`;

  return (
    <div className="w-full min-w-0 max-w-full flex flex-col items-stretch">
      {/* ░ TOP MARQUEE — slides in from LEFT on first view ░ */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 md:mb-8 w-full min-w-0"
      >
        <ShowcaseMarquee direction="left" speed={28} />
      </motion.div>

      {/* ░ VIDEO FRAME ░ */}
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.88 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        className="self-center w-full"
        style={{ perspective: 1400 }}
      >
        <motion.div
          ref={frameRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          animate={{
            rotateX: tilt.rx,
            rotateY: tilt.ry,
          }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 18,
            mass: 0.4,
          }}
          className={
            isFullscreen
              ? "relative w-full h-full bg-black"
              : "relative w-full aspect-[16/10] rounded-[28px] overflow-hidden shadow-2xl cursor-pointer group"
          }
          style={{
            transformStyle: "preserve-3d",
            backgroundColor: "#0a0f1f",
          }}
        >
          {directFile ? (
            <video
              ref={htmlVideoRef}
              className={
                isFullscreen
                  ? "absolute inset-0 w-full h-full object-contain"
                  : "absolute inset-0 w-full h-full object-cover pointer-events-none"
              }
              src={directFile}
              autoPlay
              muted={!isFullscreen}
              loop={!isFullscreen}
              controls={isFullscreen}
              playsInline
              preload="auto"
            />
          ) : ytInlineSrc ? (
            <iframe
              key={isFullscreen ? "fs" : "inline"}
              ref={iframeRef}
              className={
                isFullscreen
                  ? "absolute inset-0 w-full h-full"
                  : "absolute pointer-events-none"
              }
              src={isFullscreen ? ytFsSrc ?? undefined : ytInlineSrc}
              title="22 Signals — Showcase"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              style={
                isFullscreen
                  ? { border: 0 }
                  : {
                      top: "-60px",
                      left: "-5%",
                      width: "110%",
                      height: "calc(100% + 120px)",
                      border: 0,
                    }
              }
            />
          ) : null}

          {!isFullscreen && (
            <>
              <AnimatePresence>
                {!directFile && introVisible && (
                  <motion.div
                    key="intro-tint"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, #0a0f1f 0%, #1a3392 70%, #325FEC 130%)",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(50,95,236,0.12) 0%, rgba(50,95,236,0.02) 50%, rgba(50,95,236,0.10) 100%)",
                }}
              />

              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-[28px] pointer-events-none"
                initial={false}
                animate={{
                  boxShadow: isHovered
                    ? "inset 0 0 0 1px rgba(50,95,236,0.5), 0 30px 80px rgba(50,95,236,0.25)"
                    : "inset 0 0 0 1px rgba(255,255,255,0.06), 0 16px 50px rgba(10,21,48,0.18)",
                }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={false}
                animate={{
                  backgroundColor:
                    isHovered && !introVisible
                      ? "rgba(0,0,0,0.34)"
                      : "rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.3 }}
              />

              {/* TOP-LEFT label */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-4 left-4 md:top-5 md:left-5 z-10 pointer-events-none"
              >
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] tracking-[0.3em] uppercase"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    color: "#0A1530",
                    boxShadow: "0 10px 28px rgba(10,21,48,0.18)",
                  }}
                >
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: "#ff3d3d" }}
                  />
                  Live · 2024
                </span>
              </motion.div>

              {/* TOP-RIGHT fullscreen icon */}
              <AnimatePresence>
                {isHovered && !introVisible && (
                  <motion.button
                    key="fs-icon"
                    type="button"
                    aria-label="Expand to fullscreen"
                    onClick={(e) => openFullscreen(e)}
                    initial={{ opacity: 0, scale: 0.7, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: -6 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.94 }}
                    className="absolute top-4 right-4 md:top-5 md:right-5 flex items-center justify-center w-10 h-10 rounded-full z-20"
                    style={{
                      background: "rgba(255,255,255,0.95)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                      border: "none",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0A1530"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9V3h6" />
                      <path d="M21 9V3h-6" />
                      <path d="M3 15v6h6" />
                      <path d="M21 15v6h-6" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* BOTTOM-LEFT label */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-4 left-4 md:bottom-5 md:left-5 z-10 pointer-events-none"
              >
                <span
                  className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase"
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  Reel 022 · Showcase 2024
                </span>
              </motion.div>

              {/* BOTTOM-RIGHT label */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-4 right-4 md:bottom-5 md:right-5 z-10 pointer-events-none"
              >
                <span
                  className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase"
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  02:15
                </span>
              </motion.div>

              {/* Centered play button — appears on hover, magnetic + rotating ring */}
              <AnimatePresence>
                {isHovered && !introVisible && (
                  <motion.div
                    key="play-btn"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <motion.div
                      animate={{ x: playOffset.x, y: playOffset.y }}
                      transition={{ type: "spring", stiffness: 150, damping: 18, mass: 0.4 }}
                      className="relative"
                    >
                      <motion.div
                        aria-hidden
                        animate={{ rotate: 360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-4 rounded-full pointer-events-none"
                        style={{
                          border: "1px dashed rgba(255,255,255,0.55)",
                        }}
                      />
                      <motion.button
                        type="button"
                        aria-label="Watch in fullscreen"
                        onClick={(e) => openFullscreen(e)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full"
                        style={{
                          pointerEvents: "auto",
                          border: "none",
                          background: "transparent",
                        }}
                      >
                        <motion.span
                          aria-hidden
                          className="absolute inset-0 rounded-full"
                          animate={{
                            boxShadow: [
                              "0 14px 50px rgba(50,95,236,0.4), 0 0 0 8px rgba(255,255,255,0.18)",
                              "0 14px 70px rgba(50,95,236,0.75), 0 0 0 14px rgba(255,255,255,0.05)",
                              "0 14px 50px rgba(50,95,236,0.4), 0 0 0 8px rgba(255,255,255,0.18)",
                            ],
                          }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                          style={{ background: "#325FEC" }}
                        />
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="white"
                          style={{ marginLeft: 4, position: "relative", zIndex: 1 }}
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Click-anywhere-on-frame still triggers fullscreen */}
              <button
                type="button"
                aria-label="Open video in fullscreen"
                onClick={(e) => openFullscreen(e)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openFullscreen(e);
                  }
                }}
                className="absolute inset-0 z-[1]"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            </>
          )}
        </motion.div>
      </motion.div>

      {/* ░ BOTTOM MARQUEE — slides in from RIGHT on first view ░ */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        className="mt-6 md:mt-8 w-full min-w-0"
      >
        <ShowcaseMarquee direction="right" speed={32} />
      </motion.div>
    </div>
  );
};

export default Video;
