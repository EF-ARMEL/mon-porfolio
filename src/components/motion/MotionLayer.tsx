"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/components/providers/SmoothScrollProvider";
import BatonTrail from "./BatonTrail";
import "./motion.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Couche de motion globale (une seule instance, montée dans Home) :
 * 1. barre de progression de lecture ;
 * 2. la « baguette » du chef d'orchestre (trace du geste + temps fort au clic) ;
 * 3. aimantation des éléments [data-magnetic] ;
 * 4. inclinaison des grands titres [data-skew] selon la vitesse de défilement.
 * Le curseur natif est toujours conservé. Rien ne tourne sur tactile ni sous
 * prefers-reduced-motion (la barre de progression reste).
 */
export default function MotionLayer() {
  const bar = useRef<HTMLDivElement>(null);

  // 1. Progression de lecture.
  useEffect(() => {
    if (!bar.current) return;
    const tw = gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
    };
  }, []);

  // 3. Aimantation : l'élément suit le pointeur (35 % de l'écart), retour élastique.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let magnet: HTMLElement | null = null;
    let mx: ((v: number) => void) | null = null;
    let my: ((v: number) => void) | null = null;
    const release = () => {
      mx?.(0);
      my?.(0);
      magnet = null;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const m = (e.target as Element | null)?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) {
        release();
        if (m) {
          magnet = m;
          mx = gsap.quickTo(m, "x", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
          my = gsap.quickTo(m, "y", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
        }
      }
      if (magnet && mx && my) {
        const b = magnet.getBoundingClientRect();
        mx((e.clientX - (b.left + b.width / 2)) * 0.35);
        my((e.clientY - (b.top + b.height / 2)) * 0.35);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", release);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", release);
    };
  }, []);

  // 4. Inclinaison selon la vitesse (lissée, bornée, uniquement si ça bouge).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let skew = 0;
    let setters: ((v: number) => void)[] = [];
    const collect = () => {
      setters = gsap.utils
        .toArray<HTMLElement>("[data-skew]")
        .map((t) => gsap.quickSetter(t, "skewY", "deg") as (v: number) => void);
    };
    collect();
    const late = window.setTimeout(collect, 2500);

    const tick = () => {
      const v = getLenis()?.velocity ?? 0;
      const target = gsap.utils.clamp(-5, 5, -v * 0.18);
      const next = skew + (target - skew) * 0.12;
      if (Math.abs(next) < 0.01 && Math.abs(skew) < 0.01) return;
      skew = Math.abs(next) < 0.01 ? 0 : next;
      setters.forEach((s) => s(skew));
    };
    gsap.ticker.add(tick);
    return () => {
      window.clearTimeout(late);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <>
      <div ref={bar} className="mc-progress" aria-hidden />
      <BatonTrail />
    </>
  );
}
