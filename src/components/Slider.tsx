import React, { useMemo } from "react";

/**
 * Three-row infinite logo marquee — alternating directions.
 *
 *  Row 1  →  scroll LEFT  (track moves -50%)
 *  Row 2  →  scroll RIGHT (track moves +50%)
 *  Row 3  →  scroll LEFT  (track moves -50%)
 *
 * Each row is its own duplicated track. Logos are evenly split across the
 * three rows so each band stays full. The whole component is a clean white
 * surface that spans the full viewport width.
 */

interface SliderComponentProps {
  /** Image URLs to show in the carousel. */
  slides: string[];
  /** seconds per logo (controls speed). Higher = slower. Default 4. */
  secondsPerLogo?: number;
}

/** Split into ~3 evenly sized chunks so each row has its own set. */
const splitIntoRows = (slides: string[]): string[][] => {
  if (slides.length === 0) return [[], [], []];
  if (slides.length <= 3) {
    // Too few logos for 3 distinct rows — repeat the same list in each row
    return [slides, slides, slides];
  }
  const rows: string[][] = [[], [], []];
  slides.forEach((s, i) => rows[i % 3].push(s));
  return rows;
};

const buildTrack = (row: string[]): string[] => {
  if (row.length === 0) return [];
  // Repeat enough times so the visible frame is never empty even for short
  // lists. Final track is duplicated 2x at minimum so the keyframe
  // `to: translateX(-50%)` produces a seamless loop.
  const minCells = 8;
  let out = row.slice();
  while (out.length < minCells) out = [...out, ...row];
  return [...out, ...out];
};

interface RowProps {
  track: string[];
  direction: "left" | "right";
  duration: number;
  rowIndex: number;
}

const MarqueeRow: React.FC<RowProps> = ({ track, direction, duration, rowIndex }) => {
  if (track.length === 0) return null;
  return (
    <div className="logos-row-wrapper overflow-hidden relative">
      <div
        className={`logos-track logos-track--${direction}`}
        style={{
          ["--row-duration" as never]: `${duration}s`,
        } as React.CSSProperties}
      >
        {track.map((img, i) => (
          <div
            key={`${rowIndex}-${i}`}
            className="logos-cell"
          >
            <img
              src={img}
              alt=""
              className="logos-img"
              draggable={false}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const SliderComponent: React.FC<SliderComponentProps> = ({
  slides,
  secondsPerLogo = 4,
}) => {
  const rows = useMemo(() => splitIntoRows(slides ?? []), [slides]);
  const tracks = useMemo(() => rows.map(buildTrack), [rows]);

  // Speed scales with row length so a sparse row doesn't fly past too fast.
  const baseRowLen = Math.max(...rows.map((r) => r.length), 1);
  const duration = Math.max(baseRowLen * secondsPerLogo, 20);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="logos-carousel-root">
      <div className="logos-carousel-inner">
        <MarqueeRow track={tracks[0]} direction="left"  duration={duration}        rowIndex={0} />
        <MarqueeRow track={tracks[1]} direction="right" duration={duration * 1.15} rowIndex={1} />
        <MarqueeRow track={tracks[2]} direction="left"  duration={duration * 0.95} rowIndex={2} />
      </div>

      <style>{`
        /* Full-bleed band that matches the page's light-bluish surface
           so the carousel reads as part of the same canvas, not a
           pasted-in white strip. */
        .logos-carousel-root {
          position: relative;
          width: 100vw;
          left: 50%;
          transform: translateX(-50%);
          background: #f0f1fa;
          padding: 10px 0 18px 0;
        }
        .logos-carousel-inner {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .logos-row-wrapper {
          width: 100%;
        }
        .logos-track {
          display: flex;
          width: max-content;
          align-items: center;
          will-change: transform;
        }
        .logos-track--left {
          animation: logos-scroll-left var(--row-duration) linear infinite;
        }
        .logos-track--right {
          animation: logos-scroll-right var(--row-duration) linear infinite;
        }
        @keyframes logos-scroll-left {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes logos-scroll-right {
          from { transform: translate3d(-50%, 0, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }
        .logos-cell {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 95px;
          width: 240px;
          padding: 0 18px;
        }
        .logos-img {
          max-height: 80px;
          max-width: 100%;
          object-fit: contain;
          user-select: none;
          filter: grayscale(15%);
          opacity: 0.95;
          transition: filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
        }
        .logos-img:hover {
          filter: grayscale(0%);
          opacity: 1;
          transform: scale(1.05);
        }

        /* Tablet */
        @media (min-width: 640px) {
          .logos-carousel-inner {
            gap: 8px;
          }
          .logos-cell {
            height: 115px;
            width: 290px;
            padding: 0 24px;
          }
          .logos-img {
            max-height: 100px;
          }
        }

        /* Desktop & 16:10 wide screens — logos stay prominent, rows tight */
        @media (min-width: 1024px) {
          .logos-carousel-root {
            padding: 14px 0 26px 0;
          }
          .logos-carousel-inner {
            gap: 10px;
          }
          .logos-cell {
            height: 140px;
            width: 360px;
            padding: 0 32px;
          }
          .logos-img {
            max-height: 125px;
          }
        }

        @media (min-width: 1600px) {
          .logos-carousel-inner {
            gap: 12px;
          }
          .logos-cell {
            width: 400px;
            height: 155px;
            padding: 0 38px;
          }
          .logos-img {
            max-height: 140px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .logos-track--left,
          .logos-track--right {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SliderComponent;
