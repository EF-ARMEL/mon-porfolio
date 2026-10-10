"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ConductorButton from "@/components/ConductorButton";

interface HeroProps {
  startAnimation?: boolean;
}

const NAME = "Nousdev";

export default function Hero({ startAnimation = false }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null); // parallaxe du texte
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null); // parallaxe de la photo
  const photoRef = useRef<HTMLImageElement>(null); // intro + respiration
  const leftParaRef = useRef<HTMLParagraphElement>(null);
  const rightParaRef = useRef<HTMLParagraphElement>(null);
  const socialRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);

  /* ---------- Fit-text : « Nousdev » = 100 % de la largeur ---------- */
  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    if (!container || !title) return;

    const fit = () => {
      title.style.fontSize = "100px";
      const w = title.getBoundingClientRect().width;
      if (w > 0) title.style.fontSize = `${(100 * container.clientWidth) / w}px`;
    };

    let cancelled = false;
    // document.fonts.ready est une PROMESSE (pas une fonction)
    document.fonts.ready.then(() => {
      if (!cancelled) fit();
    });
    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(container);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, []);

  /* ---------- Intro ---------- */
  useGSAP(
    () => {
      if (!startAnimation) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(containerRef.current, { visibility: "visible" });
        return;
      }

      const letters = gsap.utils.toArray<HTMLElement>(".letter-block");
      const paras = [leftParaRef.current, rightParaRef.current].filter(Boolean);
      const socials = socialRefs.current.filter(Boolean);

      // États initiaux : On utilise un masquage plus moderne et un léger décalage
      gsap.set(letters, {
        y: "110%",
        rotateX: -30,
        opacity: 0,
        transformOrigin: "50% 100%"
      });
      gsap.set(photoRef.current, {
        autoAlpha: 0,
        scale: 1.1,
        y: 40,
        filter: "blur(20px) saturate(0) brightness(0.5)",
      });
      gsap.set(paras, { y: 30, opacity: 0 });
      gsap.set(socials, { scale: 0, opacity: 0 });
      gsap.set(ctaButtonRef.current, { opacity: 0, y: 20 });
      gsap.set(".cta-arrow", { rotation: -360 });
      gsap.set(containerRef.current, { visibility: "visible" });

      const breath = gsap.to(photoRef.current, {
        scale: 1.02,
        y: -5,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" }
      });

      // 1. Apparition Cinématique du Titre (Staggered Rise)
      tl.to(letters, {
        y: 0,
        rotateX: 0,
        opacity: 1,
        duration: 1.8,
        stagger: {
          each: 0.05,
          from: "center"
        },
      });

      // 2. Révélation de la Photo (Blur to Focus)
      tl.to(
        photoRef.current,
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px) saturate(1) brightness(1)",
          duration: 2.2,
        },
        0.6
      );

      // 3. Apparition fluide des textes et CTA
      tl.to(paras, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out"
      }, 1.8);

      tl.to(socials, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, 2.0);

      tl.to(
        ctaButtonRef.current,
        { opacity: 1, y: 0, duration: 1, ease: "power4.out" },
        2.2
      );

      tl.to(".cta-arrow", { rotation: 0, duration: 1, ease: "power3.out" }, 2.6);

      tl.add(() => {
        breath.play();
      });
    },
    { dependencies: [startAnimation], scope: containerRef }
  );

  /* ---------- Parallaxe souris (desktop) ---------- */
  useGSAP(
    () => {
      if (!window.matchMedia("(min-width: 768px)").matches) return;

      gsap.set(imageWrapperRef.current, { transformPerspective: 1200 });
      const o = { duration: 0.8, ease: "power3.out" };
      const tX = gsap.quickTo(textWrapperRef.current, "x", o);
      const tY = gsap.quickTo(textWrapperRef.current, "y", o);
      const pX = gsap.quickTo(imageWrapperRef.current, "x", o);
      const pY = gsap.quickTo(imageWrapperRef.current, "y", o);
      const pR = gsap.quickTo(imageWrapperRef.current, "rotationY", o);

      const onMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        tX(-nx * 20);
        tY(-ny * 20);
        pX(nx * 8);
        pY(ny * 8);
        pR(nx * 2);
      };
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    },
    { scope: containerRef }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      style={{ visibility: "hidden" }}
      className="relative min-h-[100svh] w-full overflow-x-clip rounded-[28px]"
    >
      {/* Couche 1 : texte géant */}
      <div
        ref={textWrapperRef}
        className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center"
      >
        <h1
          ref={titleRef}
          aria-label={NAME}
          style={{ fontFamily: "var(--font-anton), Impact, sans-serif", perspective: 800 }}
          className="flex select-none whitespace-nowrap leading-[0.8] tracking-[-0.01em] text-white"
        >
          {NAME.split("").map((char, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="-my-[0.12em] inline-block overflow-hidden py-[0.12em]"
            >
              <span className="letter-block inline-block will-change-transform">{char}</span>
            </span>
          ))}
        </h1>
      </div>

      {/* Couche 2 : photo */}
      <div
        ref={imageWrapperRef}
        className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center"
      >
        <Image
          ref={photoRef}
          src="/image/ma-photo.png"
          alt="Portrait de Nousdev, développeur web"
          width={1200}
          height={1600}
          priority
          className="h-[88svh] w-auto max-w-none object-contain object-bottom drop-shadow-2xl will-change-transform"
        />
      </div>

      {/* Couche 3 : interface */}
      <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-end p-8 md:p-16">
        <div className="flex flex-col items-end justify-between gap-12 md:flex-row">
          <div className="pointer-events-auto flex max-w-[500px] flex-col items-start">
            <div className="overflow-hidden">
              <p ref={leftParaRef} className="text-sm text-white md:text-[16px] leading-relaxed">
                <span className="block text-5xl md:text-7xl font-anton uppercase tracking-tighter text-white leading-[0.85] mb-4">
                  Développeur
                </span>
                <span className="block max-w-sm font-light text-white/60 tracking-wide leading-relaxed">
                  web et mobile passionné, je transforme vos idées en solutions digitales <span className="italic text-white/90 font-medium">performantes, rapides et simples</span> à utiliser.
                </span>
              </p>
            </div>
          </div>

          <div className="pointer-events-auto flex max-w-[340px] flex-col items-end">
            <ConductorButton align="right" />
            <button
              ref={ctaButtonRef}
              className="group relative overflow-hidden rounded-full bg-brand-orange px-6 py-3 font-bold text-brand-black mt-6"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 translate-y-full bg-white transition-transform duration-300 ease-out group-hover:translate-y-0"
              />
              <span className="relative z-10 flex items-center gap-2">
                Parlons-en
                <span className="inline-block transition-transform duration-300 group-hover:rotate-45">
                  <span className="cta-arrow inline-block">↗</span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}