"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ProjectHero() {
  const container = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const TEXT = "Au-delà du développement traditionnel, j'articule les intelligences artificielles pour décupler les capacités de vos plateformes. Cette démarche s'accompagne d'une exigence absolue quant à l'ergonomie et au raffinement visuel de vos interfaces.";
  const LABEL = "Chef d'Orchestre";

  useGSAP(() => {
    if (!container.current) return;
    const current = container.current;

    const panel = current.querySelector('[data-panel]');
    const words = current.querySelectorAll('[data-word]');
    const kicker = current.querySelector('[data-kicker]');
    const glow = current.querySelector('[data-glow]');
    const charsA = current.querySelectorAll('[data-char-a]');
    const charsB = current.querySelectorAll('[data-char-b]');
    const fill = current.querySelector('[data-fill]');
    const arrow = current.querySelector('[data-arrow]');
    const line = current.querySelector('[data-line]');

    if (!panel) return;

    gsap.set(panel, { clipPath: "inset(100% 0% 0% 0% round 28px)", autoAlpha: 0, y: 36, scale: 0.94, filter: "blur(14px)" });
    gsap.set(words, { yPercent: 115, rotate: 4 });
    gsap.set(kicker, { autoAlpha: 0, x: -14 });
    gsap.set(glow, { autoAlpha: 0, scale: 0.6 });
    gsap.set(charsB, { yPercent: 120 });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "expo.out" }
    });

    tl.to(fill, { scaleY: 1, duration: 0.7, ease: "expo.inOut" }, 0)
      .to(charsA, { yPercent: -120, duration: 0.6, stagger: 0.018, ease: "power4.inOut" }, 0)
      .to(charsB, { yPercent: 0, duration: 0.6, stagger: 0.018, ease: "power4.inOut" }, 0.05)
      .to(arrow, { x: 6, duration: 0.5 }, 0.1)
      .to(glow, { autoAlpha: 1, scale: 1, duration: 1.1 }, 0.05)
      .to(panel, { clipPath: "inset(0% 0% 0% 0% round 28px)", autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1 }, 0.08)
      .to(kicker, { autoAlpha: 1, x: 0, duration: 0.7 }, 0.35)
      .to(line, { scaleX: 1, duration: 1.1, ease: "expo.inOut" }, 0.4)
      .to(words, { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.014 }, 0.45);

    (current as any)._chefTl = tl;
  }, { scope: container });

  const toggleChef = () => {
    setIsOpen(!isOpen);
    const tl = (container.current as any)?._chefTl;
    if (!tl) return;

    if (!isOpen) {
      tl.play();
    } else {
      tl.reverse();
    }
  };

  return (
    <section className="relative min-h-[560px] py-[72px] pb-[64px] px-5 flex flex-col justify-end items-start gap-8 max-w-[1040px] mx-auto" ref={container}>
      <div className="absolute inset-0 -mx-[50vw] pointer-events-none z-[-1]"
           style={{ background: 'radial-gradient(60% 60% at 80% 10%, rgba(255, 106, 0, 0.16), transparent 70%), radial-gradient(50% 50% at 10% 90%, rgba(139, 92, 246, 0.14), transparent 70%)' }} />

      <div className={`relative inline-block ${isOpen ? 'is-open' : ''}`} id="chef">
        <div className="absolute left-0 bottom-full mb-6 z-40 pointer-events-none w-[min(calc(100vw-40px),480px)]">
          <div data-glow className="absolute inset-[-40px] z-[-1] bg-[radial-gradient(closest-side,rgba(139,92,246,0.55),rgba(139,92,246,0)_70%)] blur-[24px] opacity-0" />
          <div data-panel className="relative overflow-hidden p-[30px] rounded-[28px] border border-[#c4b5fd38] bg-gradient-to-br from-[#4c1d95f2] via-[#2a1065f6] to-[#180838f9] shadow-[0_30px_90px_-20px_rgba(109,40,217,0.7)]" role="tooltip">
            <div className="absolute top-[-64px] right-[-64px] w-[192px] h-[192px] rounded-full bg-[#ff6a0073] blur-[40px] opacity-40 pointer-events-none" />
            <span data-kicker className="block mb-4 text-[11px] font-bold tracking-[0.28em] uppercase text-[#ffd000]">Direction technique & IA</span>
            <p className="relative z-10 m-0 text-[15px] leading-[1.7] text-white/90">
              {TEXT.split(" ").map((word, i) => (
                <span key={i} className="inline-block overflow-hidden vertical-top mr-[0.28em]">
                  <span data-word className="inline-block">{word}</span>
                </span>
              ))}
            </p>
            <div data-line className="h-px mt-6 bg-gradient-to-r from-[#ff6a00] via-[#ffd000] to-transparent scale-x-0 origin-left" />
          </div>
        </div>

        <button
          onClick={toggleChef}
          className="relative inline-flex items-center gap-4 px-9 py-5 rounded-full border border-white/30 bg-black/35 backdrop-blur-[10px] cursor-pointer overflow-hidden transition-all duration-300 group"
          id="chef-btn"
        >
          <span data-fill className="absolute inset-0 bg-gradient-to-r from-[#ff6a00] to-[#ffd000] scale-y-0 origin-bottom" />
          <span className="relative overflow-hidden">
            <span className="flex whitespace-pre text-[13px] font-bold tracking-[0.2em] uppercase text-white" id="row-a">
              {LABEL.split("").map((c, i) => <span key={i} data-char-a>{c}</span>)}
            </span>
            <span className="absolute inset-0 flex whitespace-pre text-[13px] font-bold tracking-[0.2em] uppercase text-black" id="row-b">
              {LABEL.split("").map((c, i) => <span key={i} data-char-b>{c}</span>)}
            </span>
          </span>
          <svg data-arrow className="relative w-[18px] h-[18px] transition-colors duration-400 text-white group-hover:text-black" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  );
}
