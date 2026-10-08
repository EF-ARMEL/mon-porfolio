"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const TEXT =
  "Au-delà du développement traditionnel, j'articule les intelligences artificielles pour décupler les capacités de vos plateformes. Cette démarche s'accompagne d'une exigence absolue quant à l'ergonomie et au raffinement visuel de vos interfaces.";

type Props = {
  label?: string;
  align?: "left" | "right";
};

export default function ConductorButton({
  label = "Chef d'Orchestre",
  align = "left",
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const pointerType = useRef<string>("mouse");

  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      // --- TIMELINE CINÉMATIQUE ---
      const t = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });

      // 1. L'Ignition : Le bouton s'enfonce légèrement
      t.to(btn.current, { scale: 0.95, duration: 0.2 }, 0)

        // 2. Expansion Organique du Panneau (Effet "Portal")
        .fromTo(
          q(".panel"),
          { clipPath: "circle(0% at 50% 50%)", autoAlpha: 0 },
          { clipPath: "circle(150% at 50% 50%)", autoAlpha: 1, duration: 1.2, ease: "expo.inOut" },
          0.1
        )

        // 3. Le "Scan" Lumineux : Le baton parcourt le texte
        .fromTo(q(".scan-line"),
          { top: "-10%" },
          { top: "110%", duration: 1.5, ease: "power2.inOut" },
          0.4
        )

        // 4. Révélation Typographique (Séquence synchronisée au scan)
        .fromTo(
          q(".word"),
          { opacity: 0, y: 20, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.03,
            ease: "power3.out"
          },
          0.5
        );

      tl.current = t;

      // --- Interaction 3D & Magnétisme ---
      if (!reduce && btn.current && window.matchMedia("(pointer: fine)").matches) {
        const xTo = gsap.quickTo(btn.current, "x", { duration: 0.5, ease: "power3" });
        const yTo = gsap.quickTo(btn.current, "y", { duration: 0.5, ease: "power3" });
        const rXTo = gsap.quickTo(btn.current, "rotationX", { duration: 0.5, ease: "power3" });
        const rYTo = gsap.quickTo(btn.current, "rotationY", { duration: 0.5, ease: "power3" });

        const move = (e: MouseEvent) => {
          const r = btn.current!.getBoundingClientRect();
          const centerX = r.left + r.width / 2;
          const centerY = r.top + r.height / 2;
          const dx = e.clientX - centerX;
          const dy = e.clientY - centerY;
          const dist = Math.hypot(dx, dy);

          if (dist < 150) {
            xTo(dx * 0.15);
            yTo(dy * 0.15);
            rYTo(dx * 0.04);
            rXTo(-dy * 0.04);
          } else {
            xTo(0); yTo(0); rXTo(0); rYTo(0);
          }
        };
        const leave = () => { xTo(0); yTo(0); rXTo(0); rYTo(0); };
        btn.current.addEventListener("mousemove", move);
        btn.current.addEventListener("mouseleave", leave);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  const open = () => tl.current?.play();
  const close = () => tl.current?.reverse();

  return (
    <div
      ref={root}
      className="relative inline-block"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") open();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") close();
      }}
      onFocus={open}
      onBlur={close}
      onKeyDown={(e) => e.key === "Escape" && close()}
    >
      <button
        ref={btn}
        type="button"
        aria-describedby="conductor-panel"
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => {
          const t = tl.current;
          if (t) (t.progress() > 0.5 ? close : open)();
        }}
        onPointerDown={(e) => (pointerType.current = e.pointerType)}
        className="relative overflow-hidden rounded-full border border-white/20 bg-black/60 px-8 py-4 backdrop-blur-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD000] transition-colors hover:border-purple-500/50"
      >
        <span className="relative block font-['Archivo_Black'] text-sm uppercase tracking-[0.2em] text-white md:text-base">
          {label}
        </span>
      </button>

      {/* Panneau Cinématique */}
      <div
        id="conductor-panel"
        role="tooltip"
        className={`panel pointer-events-none absolute top-full z-50 mt-6 w-[min(36rem,90vw)] overflow-hidden rounded-[32px] ${
          align === "left" ? "left-0" : "right-0"
        }`}
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      >
        <div
          className="panel-bg absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, #4C1D95 0%, #1E0B4D 100%)",
          }}
        />

        {/* Scan Line (Le Baton Lumineux) */}
        <div className="scan-line absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50 z-20" />

        <p className="relative px-10 py-12 font-['Manrope',sans-serif] text-[17px] leading-relaxed text-white/90 md:text-xl z-10">
          {TEXT.split(" ").map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-top">
              <span className="word inline-block will-change-transform">{w}&nbsp;</span>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
