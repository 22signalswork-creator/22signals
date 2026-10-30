/**
 * The round "−" next to Get Started. Press it to send a signal: rings ripple
 * out across the screen from the button, the minus spins into a plus and back,
 * and a short line pops up underneath. Purely for fun.
 */
import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";

const LINES = [
  "Signal sent.",
  "Signal received. Loud and clear.",
  "That's signal 23 of 22.",
  "Ping. We heard you.",
  "Want a real one? Get started.",
];

type Ring = { id: number; x: number; y: number };

const SignalButton: React.FC<{ src?: string }> = () => {
  const [rings, setRings] = useState<Ring[]>([]);
  const [line, setLine] = useState<string | null>(null);
  const [spin, setSpin] = useState(0);
  const n = useRef(0);
  const t = useRef<number>(0);

  const fire = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = ++n.current;
    const ring = { id, x: r.left + r.width / 2, y: r.top + r.height / 2 };
    setRings((rs) => [...rs.slice(-4), ring]);
    window.setTimeout(() => setRings((rs) => rs.filter((q) => q.id !== id)), 1800);
    setSpin((s) => s + 180);
    setLine(LINES[(id - 1) % LINES.length]);
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setLine(null), 2200);
    // a gentle haptic tick where supported
    (navigator as any).vibrate?.(12);
  };

  return (
    <span className="signal-btn-wrap">
      <button type="button" className="signal-btn" onClick={fire} aria-label="Send a signal" data-magnetic>
        <span className="signal-glyph" style={{ transform: `rotate(${spin}deg)` }} aria-hidden>
          <span className={`signal-plus ${spin % 360 ? "is-on" : ""}`} />
        </span>
      </button>
      {line && (
        <span key={line + n.current} className="signal-tip" role="status">
          {line}
        </span>
      )}
      {typeof document !== "undefined" &&
        createPortal(
          <>
            {rings.map((q) => (
              <span key={q.id} className="signal-rings" style={{ left: q.x, top: q.y }} aria-hidden>
                <i />
                <i />
                <i />
              </span>
            ))}
          </>,
          document.body
        )}
    </span>
  );
};

export default SignalButton;
