"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import StackLogo from "./StackLogo";
import type { Tool } from "./stack-data";

/** Texte circulaire répété pour couvrir tout le tour (~60 caractères). */
function ringText(tool: Tool | null) {
  const unit = tool ? `${tool.name} · ${tool.role} · ` : "nousdev · stack · ";
  return unit.repeat(Math.max(1, Math.ceil(60 / unit.length))).slice(0, 62);
}

/**
 * Lentille qui suit le curseur avec inertie et s'incline selon la vitesse.
 * Desktop à pointeur précis uniquement (masquée en CSS ailleurs et sous reduced-motion).
 */
export default function StackLens({ tool, area }: { tool: Tool | null; area: React.RefObject<HTMLElement | null> }) {
  const lens = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const shown = tool !== null;

  // Suivi du curseur : quickTo = une seule tween réutilisée, pas de création par mouvement.
  useEffect(() => {
    const el = lens.current;
    const zone = area.current;
    if (!el || !zone) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.65, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.65, ease: "power3.out" });
    const rTo = gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3.out" });
    let lastX = 0;
    let settle = 0;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      xTo(e.clientX);
      yTo(e.clientY);
      // Inclinaison proportionnelle à la vitesse horizontale, bornée.
      rTo(gsap.utils.clamp(-22, 22, (e.clientX - lastX) * 0.9));
      lastX = e.clientX;
      window.clearTimeout(settle);
      settle = window.setTimeout(() => rTo(0), 90);
    };
    const enter = (e: PointerEvent) => {
      lastX = e.clientX;
      gsap.set(el, { x: e.clientX, y: e.clientY });
    };
    zone.addEventListener("pointermove", move);
    zone.addEventListener("pointerenter", enter);
    return () => {
      zone.removeEventListener("pointermove", move);
      zone.removeEventListener("pointerenter", enter);
      window.clearTimeout(settle);
    };
  }, [area]);

  // Apparition / disparition du disque.
  useEffect(() => {
    if (!disc.current) return;
    gsap.to(disc.current, {
      scale: shown ? 1 : 0,
      duration: shown ? 0.7 : 0.45,
      ease: shown ? "expo.out" : "power3.in",
      overwrite: "auto",
    });
  }, [shown]);

  // Changement d'outil : le logo « tourne la page ».
  useEffect(() => {
    if (!tool || !logo.current) return;
    gsap.fromTo(
      logo.current,
      { scale: 0.35, rotation: -35, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: "back.out(1.8)", overwrite: "auto" }
    );
  }, [tool]);

  return (
    <div ref={lens} className="stk-lens" aria-hidden>
      <div ref={disc} className="stk-lens-disc" style={{ ["--lens-c" as string]: tool?.color ?? "#ff6a00" }}>
        <div className="stk-lens-glow" />
        <svg className="stk-lens-ring" viewBox="0 0 200 200">
          <defs>
            <path id="stk-ring-path" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" />
          </defs>
          <text>
            <textPath href="#stk-ring-path">
              {ringText(tool)}
            </textPath>
          </text>
        </svg>
        <div ref={logo} className="stk-lens-logo">
          {tool && <StackLogo tool={tool} size={78} color={tool.color} />}
        </div>
      </div>
    </div>
  );
}
