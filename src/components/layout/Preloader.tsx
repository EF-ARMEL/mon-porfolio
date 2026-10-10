"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const nousDevRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedMotion = motionQuery.matches;

    // Les états initiaux sont dans le JSX (style opacity:0) pour que le HTML
    // serveur n&apos;affiche jamais le contenu avant l&apos;animation (sinon on voit
    // le preloader « déjà chargé » puis il rejoue → l&apos;illusion d&apos;un double chargement).
    // On repart de ces états de départ sans les effacer.

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          duration: 1.2,
          opacity: 0,
          ease: "expo.inOut",
          onComplete: () => onComplete(),
        });
      },
    });

    if (reducedMotion) {
      tl.to([quoteRef.current, nousDevRef.current], { opacity: 1, duration: 0.5 });
      return;
    }

    // INITIAL STATE - Force absolute starting point
    tl.set(lineRef.current, { scaleX: 0, opacity: 0 });
    tl.set(quoteRef.current, { opacity: 0, y: 40, filter: "blur(15px)" });
    tl.set(nousDevRef.current, { opacity: 0, y: 30, scale: 0.95 });

    // 1. THE SILENCE
    tl.to({}, { duration: 0.6 });

    // 2. THE LINE (The spark)
    tl.to(lineRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut",
    });

    // 3. THE OPENING (Expanding the light)
    tl.to(lineRef.current, {
      scaleX: 1,
      duration: 1.4,
      ease: "expo.inOut",
    });

    // 4. THE REVELATION (Quote)
    tl.to(quoteRef.current, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 2,
      ease: "power3.out",
    }, "-=0.8");

    // 5. THE BRAND (NOUSDEV)
    tl.to(nousDevRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.5,
      ease: "expo.out",
    }, "+=0.4");

    // 6. THE MOMENT OF IMPACT
    tl.to({}, { duration: 2 });

    // 7. THE EXIT
    tl.to(lineRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
    });

    tl.to([quoteRef.current, nousDevRef.current], {
      y: -20,
      opacity: 0,
      duration: 1,
      ease: "power2.in",
    }, "-=0.5");

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-black overflow-hidden"
    >
      {/* The Orange Light Line */}
      <div
        ref={lineRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-px bg-brand-orange z-20"
        style={{ transformOrigin: "center", opacity: 0 }}
      />

      {/* Cinematic Content Stack */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center select-none pointer-events-none px-6">

        {/* Quote Section */}
        <div ref={quoteRef} className="mb-16 flex flex-col items-center" style={{ opacity: 0 }}>
          <span className="text-xs md:text-sm font-body text-brand-orange tracking-[0.6em] uppercase mb-8 opacity-90">
            PROVERBES 16:3
          </span>
          <div className="text-2xl md:text-4xl lg:text-5xl font-body italic text-white leading-[1.4] max-w-4xl mx-auto" style={{ fontWeight: 300 }}>
            &ldquo; Recommande à l&apos;Éternel <br className="hidden md:block" />
            tes œuvres, et tes <br className="hidden md:block" />
            projets réussiront. &rdquo;
          </div>
        </div>

        {/* Brand Section */}
        <div ref={nousDevRef} className="mt-8" style={{ opacity: 0 }}>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading text-white leading-none tracking-tighter uppercase" style={{ fontWeight: 900 }}>
            NOUSDEV
          </h1>
        </div>

      </div>
    </div>
  );
}
