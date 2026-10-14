"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const TEXT =
  "Au-delà du développement traditionnel, j'articule les intelligences artificielles pour décupler les capacités de vos plateformes. Cette démarche s'accompagne d'une exigence absolue quant à l'ergonomie et au raffinement visuel de vos interfaces.";

type Props = {
  label?: string;
  align?: "left" | "right";
};

/**
 * Bouton « Chef d'Orchestre » + panneau-manifeste.
 *
 * Design :
 * - pastille sombre à liseré violet, pastille orange animée = repère visuel
 *   que le bouton « ouvre » quelque chose (affordance) ;
 * - cible tactile ≥ 48 px sur mobile, libellé jamais tronqué ;
 * - panneau violet profond, texte crème haute lisibilité, accent orange ;
 * - le panneau se replie au-dessus du bouton s'il ne passe pas sous le viewport,
 *   se ferme au défilement / Échap / perte de focus.
 */
export default function ConductorButton({
  label = "Chef d'Orchestre",
  align = "left",
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeOnScroll = useRef<(() => void) | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(
    () => () => {
      if (closeOnScroll.current) window.removeEventListener("scroll", closeOnScroll.current);
    },
    []
  );

  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      const t = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });

      // 1. Ignition : le bouton s'enfonce.
      t.to(btn.current, { scale: 0.96, duration: 0.2 }, 0)
        // 2. Expansion « portal » du panneau.
        .fromTo(
          q(".panel"),
          { clipPath: "circle(0% at 50% 50%)", autoAlpha: 0 },
          { clipPath: "circle(150% at 50% 50%)", autoAlpha: 1, duration: 1, ease: "expo.inOut" },
          0.05
        )
        // 3. Scan : le bâton lumineux parcourt le texte.
        .fromTo(
          q(".scan-line"),
          { top: "-6%", opacity: 0 },
          { top: "106%", opacity: 1, duration: 1.2, ease: "power2.inOut" },
          0.35
        )
        // 4. Révélation typographique synchronisée au scan.
        .fromTo(
          q(".word"),
          { opacity: 0, y: 16, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            stagger: 0.025,
            ease: "power3.out",
          },
          0.45
        )
        // 5. Signature en fin de lecture.
        .fromTo(q(".panel-sign"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.9);

      tl.current = t;

      // Magnétisme 3D au pointeur fin uniquement.
      if (!reduce && btn.current && window.matchMedia("(pointer: fine)").matches) {
        const xTo = gsap.quickTo(btn.current, "x", { duration: 0.5, ease: "power3" });
        const yTo = gsap.quickTo(btn.current, "y", { duration: 0.5, ease: "power3" });
        const rXTo = gsap.quickTo(btn.current, "rotationX", { duration: 0.5, ease: "power3" });
        const rYTo = gsap.quickTo(btn.current, "rotationY", { duration: 0.5, ease: "power3" });

        const move = (e: MouseEvent) => {
          const r = btn.current!.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          if (Math.hypot(dx, dy) < 160) {
            xTo(dx * 0.14);
            yTo(dy * 0.14);
            rYTo(dx * 0.035);
            rXTo(-dy * 0.035);
          } else {
            xTo(0);
            yTo(0);
            rXTo(0);
            rYTo(0);
          }
        };
        const leave = () => {
          xTo(0);
          yTo(0);
          rXTo(0);
          rYTo(0);
        };
        btn.current.addEventListener("mousemove", move);
        btn.current.addEventListener("mouseleave", leave);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  /** Ouvre au-dessus du bouton si l'espace en dessous est insuffisant. */
  const placePanel = () => {
    const p = panel.current;
    const b = btn.current;
    if (!p || !b) return;
    const r = b.getBoundingClientRect();
    const h = p.offsetHeight || 260;
    const flip = window.innerHeight - r.bottom < h + 16 && r.top > h + 16;
    p.classList.toggle("above", flip);
  };

  const open = () => {
    placePanel();
    setIsOpen(true);
    tl.current?.play();
    if (!closeOnScroll.current) {
      closeOnScroll.current = () => close();
      window.addEventListener("scroll", closeOnScroll.current, { passive: true, once: true });
    }
  };

  const close = () => {
    setIsOpen(false);
    tl.current?.reverse();
    if (closeOnScroll.current) {
      window.removeEventListener("scroll", closeOnScroll.current);
      closeOnScroll.current = null;
    }
  };

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
      <style>{`.panel.above { top: auto; bottom: 100%; margin-top: 0; margin-bottom: 1.5rem; }`}</style>

      <button
        ref={btn}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls="conductor-panel"
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => {
          const t = tl.current;
          if (t) (t.progress() > 0.5 ? close : open)();
        }}
        className="ctd-btn group relative inline-flex min-h-[42px] items-center gap-2 overflow-hidden rounded-full border border-white/25 bg-gradient-to-b from-[#241033] to-[#0b0710] px-5 py-2 shadow-[0_14px_38px_-22px_rgba(139,92,246,0.9)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-[#8B5CF6]/70 hover:shadow-[0_18px_48px_-20px_rgba(139,92,246,0.95)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD000] md:min-h-[40px] md:gap-2.5 md:px-6 md:py-2"
      >
        {/* Pastille orange : repère d'ouverture, pulse au repos. */}
        <span aria-hidden className="relative flex h-2 w-2 flex-none">
          <span className="ctd-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A00] opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF6A00]" />
        </span>

        <span className="relative block font-[family-name:var(--font-archivo)] text-[11px] uppercase leading-tight tracking-[0.14em] text-white sm:text-[12px] md:text-[13px]">
          {label}
        </span>

        {/* Chevron : indique l'ouverture, bascule à l'état actif. */}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          className={`ctd-caret h-3 w-3 flex-none text-[#FFD000] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Panneau manifeste */}
      <div
        ref={panel}
        id="conductor-panel"
        role="dialog"
        aria-label="Manifeste"
        className={`panel pointer-events-none absolute top-full left-1/2 z-50 mt-5 w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-[28px] border border-white/12 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)] md:w-[min(34rem,90vw)] ${
          align === "left" ? "md:left-0 md:translate-x-0" : "md:right-0 md:left-auto md:translate-x-0"
        }`}
        style={{
          clipPath: "circle(0% at 50% 50%)",
          background: "radial-gradient(120% 120% at 50% 0%, #3B1173 0%, #180A38 55%, #0D0620 100%)",
        }}
      >
        {/* Scan line (bâton lumineux) */}
        <div className="scan-line absolute left-0 top-0 z-20 h-px w-full bg-gradient-to-r from-transparent via-[#FFD000] to-transparent opacity-50" />

        {/* Grain très léger pour éviter le plat */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 px-7 py-8 sm:px-9 sm:py-10">
          <p className="mb-4 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFD000]">
            <span aria-hidden className="inline-block h-px w-6 bg-[#FF6A00]" />
            Manifeste
          </p>

          <p className="font-[family-name:var(--font-body)] text-[15px] leading-[1.7] text-[#F3EEFF] sm:text-base md:text-lg md:leading-[1.75]">
            {TEXT.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-top">
                <span className="word inline-block will-change-transform">{w}&nbsp;</span>
              </span>
            ))}
          </p>

          <p className="panel-sign mt-6 text-[11px] uppercase tracking-[0.24em] text-[#C4B5FD] opacity-0">
            Nousdev — orchestration IA
          </p>
        </div>
      </div>
    </div>
  );
}
