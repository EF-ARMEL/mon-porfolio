"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Durée de vie d'un point du geste (ms) : la trace s'efface derrière la main. */
const LIFE = 420;
/** Durée du « temps fort » au clic (ms). */
const BEAT = 620;
const ORANGE = [255, 106, 0];
const YELLOW = [255, 208, 0];

type Pt = { x: number; y: number; t: number };
type Beat = { x: number; y: number; t: number };

/**
 * La baguette du chef d'orchestre.
 * Le curseur natif reste en place ; le mouvement laisse un trait effilé qui
 * s'efface en ~1/3 s, comme le geste d'une baguette dans l'air. Au clic, un
 * « temps fort » : une mesure qui se dessine (arc + quatre battues).
 * Canvas unique, ne dessine que lorsqu'il y a quelque chose à montrer.
 * Inactif sur tactile et sous prefers-reduced-motion.
 */
export default function BatonTrail() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!c || !fine || reduce) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(window.innerWidth * dpr);
      c.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const pts: Pt[] = [];
    const beats: Beat[] = [];
    let accent = false; // la baguette « s'allume » au-dessus d'un élément interactif
    let running = false;

    const mix = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k));

    const draw = () => {
      const now = performance.now();
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      while (beats.length && now - beats[0].t > BEAT) beats.shift();
      ctx.clearRect(0, 0, c.width / dpr, c.height / dpr);

      // Trait effilé : épaisseur et opacité croissent vers la pointe.
      if (pts.length > 2) {
        const col = accent ? YELLOW : ORANGE;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let i = 1; i < pts.length - 1; i++) {
          const k = i / (pts.length - 1);
          const life = 1 - (now - pts[i].t) / LIFE;
          const a = pts[i - 1];
          const b = pts[i];
          const n = pts[i + 1];
          const [r, g, bl] = mix(ORANGE, col, k);
          ctx.strokeStyle = `rgba(${r},${g},${bl},${(0.15 + 0.85 * k) * life})`;
          ctx.lineWidth = 0.5 + 3.6 * k * life;
          ctx.beginPath();
          ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
          ctx.quadraticCurveTo(b.x, b.y, (b.x + n.x) / 2, (b.y + n.y) / 2);
          ctx.stroke();
        }
      }

      // Temps fort : un arc qui s'ouvre + quatre battues qui s'écartent.
      for (const bt of beats) {
        const p = (now - bt.t) / BEAT;
        const e = 1 - Math.pow(1 - p, 3);
        const alpha = 1 - p;
        ctx.strokeStyle = `rgba(255,106,0,${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(bt.x, bt.y, 10 + 32 * e, -Math.PI * 0.85, -Math.PI * 0.15);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,208,0,${alpha})`;
        for (let k = 0; k < 4; k++) {
          const ang = -Math.PI / 2 + (k - 1.5) * 0.55;
          const rad = 18 + 38 * e;
          ctx.beginPath();
          ctx.arc(bt.x + Math.cos(ang) * rad, bt.y + Math.sin(ang) * rad + 18 * e, 2 * (1 - p) + 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!pts.length && !beats.length) stop();
    };

    const start = () => {
      if (running) return;
      running = true;
      gsap.ticker.add(draw);
    };
    function stop() {
      running = false;
      gsap.ticker.remove(draw);
      ctx!.clearRect(0, 0, c!.width / dpr, c!.height / dpr);
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target as Element | null;
      // Zones qui ont déjà leur propre réponse au curseur (lentille de la Stack) ou de la saisie.
      if (t?.closest("[data-cursor='none'], input, textarea, select")) return;
      accent = !!t?.closest("a, button, [role='button'], [data-magnetic]");
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (pts.length > 48) pts.shift();
      start();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      beats.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(draw);
    };
  }, []);

  return <canvas ref={canvas} className="mc-baton" aria-hidden />;
}
