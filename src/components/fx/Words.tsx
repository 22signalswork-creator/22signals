/**
 * Word-by-word reveal for headings: each word rises out of a mask when the
 * heading scrolls into view, once. Works on plain text and nested spans
 * (accent colours keep their styles). Respects reduced motion via CSS.
 *
 *   <h2><Words>One team <span className="accent">instead of ten.</span></Words></h2>
 */
import React, { useEffect, useRef, useState } from "react";

function split(node: React.ReactNode, counter: { n: number }): React.ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((part, i) => {
      if (!part) return null;
      if (/^\s+$/.test(part)) return " ";
      const idx = counter.n++;
      return (
        <span className="rw" key={`w${idx}-${i}`}>
          <span className="rw-i" style={{ ["--i" as any]: idx }}>{part}</span>
        </span>
      );
    });
  }
  if (Array.isArray(node)) return node.map((c, i) => <React.Fragment key={i}>{split(c, counter)}</React.Fragment>);
  if (React.isValidElement(node)) {
    const el = node as React.ReactElement<any>;
    if (el.type === "br") return el;
    return React.cloneElement(el, el.props, split(el.props.children, counter));
  }
  return node;
}

const Words: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return setOn(true);
    const io = new IntersectionObserver(
      (es) => {
        if (es[0]?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className={`rw-wrap ${on ? "is-in" : ""}`} style={{ ["--d" as any]: `${delay}ms` }}>
      {split(children, { n: 0 })}
    </span>
  );
};

export default Words;
