"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export type GlyphKind = "design" | "perf" | "tuning" | "explore" | "vibe";

/*
 * Un glyphe animé par réflexe. Tout est en SVG/CSS (aucun asset), les boucles
 * ne tournent que lorsque la lame est ouverte (sélecteurs [data-on] dans toolbox.css).
 */

function Design() {
  return (
    <svg viewBox="0 0 200 200" className="tbx-g tbx-g--design">
      {[40, 80, 120, 160].map((v) => (
        <g key={v}>
          <line x1={v} y1="10" x2={v} y2="190" className="tbx-grid" />
          <line x1="10" y1={v} x2="190" y2={v} className="tbx-grid" />
        </g>
      ))}
      <line x1="40" y1="160" x2="70" y2="40" className="tbx-handle" />
      <line x1="160" y1="40" x2="130" y2="160" className="tbx-handle" />
      <path d="M40 160 C 70 40, 130 160, 160 40" className="tbx-curve" pathLength={1} />
      {[
        [40, 160],
        [160, 40],
      ].map(([x, y]) => (
        <rect key={x} x={x - 5} y={y - 5} width="10" height="10" className="tbx-node" />
      ))}
      {[
        [70, 40],
        [130, 160],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4.5" className="tbx-knob" />
      ))}
    </svg>
  );
}

function Perf({ on }: { on: boolean }) {
  const num = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!on || !num.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      num.current.textContent = "60";
      return;
    }
    const o = { v: 0 };
    const tw = gsap.to(o, {
      v: 60,
      duration: 1.4,
      ease: "expo.out",
      onUpdate: () => {
        if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(2, "0");
      },
    });
    return () => {
      tw.kill();
    };
  }, [on]);
  return (
    <div className="tbx-g tbx-g--perf">
      <div className="tbx-fps">
        <span ref={num}>60</span>
        <small>fps</small>
      </div>
      <div className="tbx-frames" aria-hidden>
        <div className="tbx-frames-track">
          {Array.from({ length: 48 }, (_, i) => (
            <i key={i} style={{ height: `${28 + ((i * 29) % 52)}%` }} />
          ))}
        </div>
        <span className="tbx-budget" />
      </div>
    </div>
  );
}

function Tuning() {
  return (
    <div className="tbx-g tbx-g--tuning">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="tbx-slider">
          <span className="tbx-slider-fill" />
          <span className="tbx-slider-knob" />
        </div>
      ))}
    </div>
  );
}

function Explore() {
  return (
    <svg viewBox="0 0 200 200" className="tbx-g tbx-g--explore">
      {[30, 55, 80].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} className="tbx-ring" />
      ))}
      <line x1="100" y1="14" x2="100" y2="186" className="tbx-ring" />
      <line x1="14" y1="100" x2="186" y2="100" className="tbx-ring" />
      <g className="tbx-sweep">
        <path d="M100 100 L100 18 A82 82 0 0 1 171 59 Z" className="tbx-sweep-cone" />
        <line x1="100" y1="100" x2="100" y2="18" className="tbx-sweep-line" />
      </g>
      {[
        [136, 70, 0],
        [62, 128, 1.1],
        [128, 146, 2.2],
      ].map(([x, y, d]) => (
        <circle key={x} cx={x} cy={y} r="4" className="tbx-blip" style={{ animationDelay: `${d}s` }} />
      ))}
    </svg>
  );
}

function Vibe() {
  // Sinusoïde lisse (Q + T se reflètent) sur deux périodes : translation de -50 % = boucle sans couture.
  const d = "M0 50 Q 25 4, 50 50 T 100 50 T 150 50 T 200 50";
  return (
    <div className="tbx-g tbx-g--vibe">
      {[0, 1, 2].map((i) => (
        <svg key={i} viewBox="0 0 200 100" preserveAspectRatio="none" className={`tbx-wave tbx-wave--${i}`}>
          <path d={d} />
        </svg>
      ))}
    </div>
  );
}

export default function ToolboxGlyph({ kind, on }: { kind: GlyphKind; on: boolean }) {
  return (
    <div className="tbx-glyph" aria-hidden>
      {kind === "design" && <Design />}
      {kind === "perf" && <Perf on={on} />}
      {kind === "tuning" && <Tuning />}
      {kind === "explore" && <Explore />}
      {kind === "vibe" && <Vibe />}
    </div>
  );
}
