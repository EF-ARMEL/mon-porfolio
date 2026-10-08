"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* DATA                                                                 */
/* ------------------------------------------------------------------ */

type Project = {
  id: string;
  title: string;
  year: string;
  kicker: string;
  tags: string[];
  href: string;
  image?: string;
  from: string;
  to: string;
};

const PROJECTS: Project[] = [
  { id: "01", title: "Projet Un", year: "2026", kicker: "Plateforme web · IA", tags: ["Next.js", "GSAP", "IA"], href: "#", from: "#ff6a00", to: "#ffd000" },
  { id: "02", title: "Projet Deux", year: "2025", kicker: "Application · WebGL", tags: ["TypeScript", "Tailwind", "WebGL"], href: "#", from: "#7c3aed", to: "#ff6a00" },
  { id: "03", title: "Projet Trois", year: "2025", kicker: "Design system · Produit", tags: ["UX / UI", "Design system"], href: "#", from: "#ffd000", to: "#7c3aed" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function offsetIn(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

function Folder() {
  return (
    <svg viewBox="0 0 120 96" aria-hidden="true">
      <path
        d="M8 14a8 8 0 0 1 8-8h26l10 10h52a8 8 0 0 1 8 8v58a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8z"
        fill="url(#pc-fold-back)"
      />
      <rect x="4" y="28" width="112" height="62" rx="9" fill="url(#pc-fold-front)" />
      <rect x="4.5" y="28.5" width="111" height="61" rx="8.5" fill="none" stroke="#fff" strokeOpacity="0.35" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Composant                                                           */
/* ------------------------------------------------------------------ */

export default function ProjectCabinet() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      section.classList.add("pc-reduce");
      return;
    }

    const all = (sel: string) => gsap.utils.toArray(sel, section) as HTMLElement[];

    const cards = all("[data-card]");
    const drawers = all("[data-drawer]");
    const fronts = all("[data-front]");
    const folders = all("[data-folder]");
    const grounds = all("[data-ground]");
    const pulses = all("[data-pulse]");
    const nodeFills = all("[data-node-fill]");
    const nodeNums = all("[data-node-n]");
    const railFill = section.querySelector<HTMLElement>("[data-rail-fill]");
    const hint = section.querySelector<HTMLElement>("[data-hint]");
    const N = cards.length;

    const delta = (i: number) => {
      const c = offsetIn(cards[i], section);
      const d = offsetIn(drawers[i], section);
      return {
        x: d.x + drawers[i].offsetWidth / 2 - (c.x + cards[i].offsetWidth / 2),
        y: d.y + drawers[i].offsetHeight / 2 - (c.y + cards[i].offsetHeight / 2),
        s: Math.min(0.46, (drawers[i].offsetWidth * 0.5) / cards[i].offsetWidth),
      };
    };

    const STEP = 2.4;
    const START = 0.4;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=380%",
        pin: true,
        pinReparent: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    if (hint) tl.to(hint, { autoAlpha: 0, duration: 0.3 }, 0);

    cards.forEach((card, i) => {
      const base = START + i * STEP;

      tl.to(fronts[i], { yPercent: 70, scale: 1.04, duration: 0.6, ease: "power3.inOut" }, base)
        .to(folders[i], { y: -6, duration: 0.5 }, base + 0.1)
        .fromTo(
          card,
          {
            autoAlpha: 0,
            x: () => delta(i).x,
            y: () => delta(i).y,
            scale: () => delta(i).s,
            rotate: (i - 1) * 6,
            transformOrigin: "50% 50%",
          },
          {
            autoAlpha: 1,
            y: () => delta(i).y - 46,
            rotate: (1 - i) * 3,
            duration: 0.55,
            ease: "power2.out",
            immediateRender: true,
          },
          base + 0.4
        )
        .to(card, { x: 0, y: 0, scale: 1, rotate: 0, duration: 1.15, ease: "back.out(1.25)" }, base + 0.98)
        .fromTo(
          grounds[i],
          { autoAlpha: 0, scaleX: 0.45 },
          { autoAlpha: 1, scaleX: 1, duration: 1.0, ease: "power2.in" },
          base + 0.98
        );

      if (i > 0 && railFill) {
        tl.to(railFill, { scaleY: i / (N - 1), duration: 0.9, ease: "power2.inOut" }, base + 0.9);
      }
      tl.fromTo(
        nodeFills[i],
        { autoAlpha: 0, scale: 0.4 },
        { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" },
        base + 1.7
      )
        .to(nodeNums[i], { color: "#ffffff", duration: 0.3 }, base + 1.7)
        .fromTo(
          pulses[i],
          { autoAlpha: 0, scale: 1 },
          { autoAlpha: 1, scale: 1.012, duration: 0.18, ease: "power2.out" },
          base + 1.72
        )
        .to(pulses[i], { autoAlpha: 0, scale: 1.045, duration: 0.6, ease: "power2.out" }, base + 1.9)
        .to(fronts[i], { yPercent: 0, scale: 1, duration: 0.6, ease: "power3.inOut" }, base + 1.5)
        .to(folders[i], { y: 0, duration: 0.5 }, base + 1.5);
    });

    tl.to({}, { duration: 0.9 });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="projets" aria-label="Projets" className="pcab">
      <style>{CSS}</style>

      <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <linearGradient id="pc-fold-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#5b21b6" />
          </linearGradient>
          <linearGradient id="pc-fold-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c4b5fd" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="pc-head">
        <span>Sélection de projets</span>
        <span>({String(PROJECTS.length).padStart(2, "0")})</span>
      </div>

      <div className="pc-cab" data-cabinet>
        <div className="pc-grid">
          {PROJECTS.map((p) => (
            <div key={p.id} className="pc-drawer" data-drawer>
              <div className="pc-drawer-in" />
              <div className="pc-folder-wrap">
                <div className="pc-folder" data-folder>
                  <Folder />
                </div>
              </div>
              <div className="pc-front" data-front>
                <div className="pc-front-top">
                  <b>{p.id}</b>
                  <span>{p.year}</span>
                </div>
                <p className="pc-front-name">{p.title}</p>
                <span className="pc-grip" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pc-stack">
        <div className="pc-rail" aria-hidden="true">
          <span className="pc-rail-fill" data-rail-fill />
        </div>

        {PROJECTS.map((p) => (
          <div key={p.id} className="pc-slot">
            <span className="pc-node" aria-hidden="true">
              <span className="pc-node-fill" data-node-fill />
              <span className="pc-node-n" data-node-n>
                {p.id}
              </span>
            </span>

            <div className="pc-cell">
              <span className="pc-ground" data-ground />

              <a
                className="pc-card"
                href={p.href}
                data-card
                data-cursor="hover"
                aria-label={`Voir le projet ${p.title}`}
              >
                <div className="pc-idx">
                  <b>{p.id}</b>
                  <span>{p.year}</span>
                </div>

                <div className="pc-main">
                  <span className="pc-kicker">{p.kicker}</span>
                  <h3>{p.title}</h3>
                  <ul className="pc-tags">
                    {p.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="pc-vis">
                  <div
                    className="pc-bg"
                    style={p.image ? undefined : { background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                  >
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 880px) 34vw, 300px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <span className="pc-go">
                    <span>Voir le projet</span>
                    <i>
                      <ArrowIcon />
                    </i>
                  </span>
                </div>
              </a>

              <span className="pc-pulse" data-pulse />
            </div>
          </div>
        ))}

        <div className="pc-hint" data-hint>
          Scroll
          <i></i>
        </div>
      </div>
    </section>
  );
}

const CSS = `/* ================= STYLES DU COMPOSANT ================= */
.pcab {
  --pc-bg: #07070a;
  --pc-ink: #eceaf4;
  --pc-dim: rgba(236, 234, 244, 0.62);
  --pc-line: rgba(255, 255, 255, 0.12);
  --pc-orange: #ff6a00;
  --pc-yellow: #ffd000;
  --pc-violet: #8b5cf6;
  --pc-violet-hi: #c4b5fd;
  --pc-display: var(--font-archivo-black, "Archivo Black", "Arial Black", Impact, sans-serif);
  --cab-h: clamp(120px, 19svh, 180px);
  --card-h: clamp(108px, 17svh, 168px);
  --gap: clamp(16px, 3.6svh, 36px);
  position: relative;
  height: 100svh;
  min-height: 600px;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(18px, 4svh, 40px);
  padding: 64px 16px 20px;
  color: var(--pc-ink);
  -webkit-font-smoothing: antialiased;
}
.pcab *, .pcab *::before, .pcab *::after { box-sizing: border-box; }
.pcab a { color: inherit; text-decoration: none; }
.pcab :focus-visible { outline: 2px solid var(--pc-yellow); outline-offset: 3px; }

.pc-head {
  position: absolute;
  inset: 0 0 auto 0;
  z-index: 30;
  display: flex;
  justify-content: space-between;
  padding: 24px 20px 0;
  pointer-events: none;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}
.pc-head span:first-child { color: var(--pc-dim); }
.pc-head span:last-child { color: var(--pc-yellow); }

/* ---------- Casier ---------- */
.pc-cab {
  position: relative;
  z-index: 5;
  flex: none;
  width: min(100%, 880px);
  height: var(--cab-h);
  padding: 10px;
  border-radius: 24px;
  border: 1px solid var(--pc-line);
  background: linear-gradient(160deg, #1c1a26, #0c0b12);
  box-shadow: 0 40px 120px -30px rgba(0, 0, 0, 0.9), 0 0 80px -30px rgba(139, 92, 246, 0.35);
}
.pc-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; height: 100%; }
.pc-drawer { position: relative; height: 100%; }
.pc-drawer-in {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.82);
  box-shadow: inset 0 10px 28px rgba(0, 0, 0, 0.95);
}
.pc-folder-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.pc-folder { height: 66%; aspect-ratio: 120 / 96; max-width: 80%; }
.pc-folder svg { display: block; width: 100%; height: 100%; filter: drop-shadow(0 12px 18px rgba(139, 92, 246, 0.45)); }
.pc-front {
  position: absolute;
  inset: 0;
  z-index: 10;
  border-radius: 12px;
  border: 1px solid var(--pc-line);
  background: linear-gradient(180deg, #2b2a35, #16151c);
  box-shadow: 0 18px 30px -10px rgba(0, 0, 0, 0.8);
}
.pc-front-top {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px 0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.pc-front-top b { color: var(--pc-orange); font-weight: 700; }
.pc-front-name {
  margin: 8px 0 0;
  padding-inline: 10px;
  text-align: center;
  font-family: var(--pc-display);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.82);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pc-grip {
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 34%;
  height: 5px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(-50%);
}

/* ---------- Pile : rail + fiches ---------- */
.pc-stack {
  position: relative;
  z-index: 10;
  flex: none;
  width: min(100%, 880px);
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
.pc-rail {
  position: absolute;
  left: 14px;
  top: calc(var(--card-h) / 2);
  bottom: calc(var(--card-h) / 2);
  width: 1px;
  margin-left: -0.5px;
  background: rgba(255, 255, 255, 0.12);
}
.pc-rail-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, var(--pc-violet-hi), var(--pc-orange));
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.8);
  transform: scaleY(0);
  transform-origin: 50% 0;
}
.pc-slot {
  position: relative;
  height: var(--card-h);
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
}
.pc-node {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: #0b0a10;
}
.pc-node-fill {
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a78bfa, #6d28d9);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.18), 0 0 22px rgba(139, 92, 246, 0.75);
  opacity: 0;
  transform: scale(0.4);
}
.pc-node-n {
  position: relative;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.45);
  font-variant-numeric: tabular-nums;
}
.pc-cell { position: relative; height: 100%; min-width: 0; }
.pc-ground {
  position: absolute;
  left: 6%;
  right: 6%;
  bottom: -14px;
  height: 22px;
  z-index: 0;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(139, 92, 246, 0.6), rgba(139, 92, 246, 0));
  filter: blur(8px);
  opacity: 0;
}
.pc-pulse {
  position: absolute;
  inset: -1px;
  z-index: 2;
  border-radius: 23px;
  border: 1px solid var(--pc-violet-hi);
  box-shadow: 0 0 44px rgba(139, 92, 246, 0.6), inset 0 0 30px rgba(139, 92, 246, 0.25);
  opacity: 0;
  pointer-events: none;
}

.pc-card {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  grid-template-columns: clamp(52px, 9vw, 84px) minmax(0, 1fr) 34%;
  overflow: hidden;
  border-radius: 22px;
  background: linear-gradient(135deg, #15131d 0%, #0b0a10 70%);
  box-shadow: 0 30px 60px -24px rgba(0, 0, 0, 0.95);
  opacity: 0;
  will-change: transform;
}
.pc-card::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 3;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(120deg, rgba(167, 139, 250, 0.75), rgba(255, 255, 255, 0.07) 38%, rgba(255, 255, 255, 0.04) 62%, rgba(255, 106, 0, 0.45));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  pointer-events: none;
}
.pc-idx {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-right: 1px solid rgba(255, 255, 255, 0.07);
}
.pc-idx b {
  font-family: var(--pc-display);
  font-weight: 400;
  font-size: clamp(1.5rem, 4.2vw, 2.5rem);
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
  transition: color 0.5s, -webkit-text-stroke-color 0.5s;
}
.pc-card:hover .pc-idx b { color: var(--pc-orange); -webkit-text-stroke-color: var(--pc-orange); }
.pc-idx span {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--pc-dim);
  font-variant-numeric: tabular-nums;
}
.pc-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(6px, 1.2svh, 12px);
  min-width: 0;
  padding: 0 clamp(14px, 2.4vw, 28px);
}
.pc-kicker {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--pc-violet-hi);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pc-main h3 {
  margin: 0;
  font-family: var(--pc-display);
  font-weight: 400;
  font-size: clamp(1.15rem, 3.6vw, 2rem);
  line-height: 1.02;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pc-tags { display: none; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
.pc-tags li {
  padding: 4px 11px;
  border-radius: 99px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--pc-dim);
}
.pc-vis { position: relative; overflow: hidden; }
.pc-bg { position: absolute; inset: 0; transition: transform 1s cubic-bezier(0.2, 0.7, 0.2, 1); }
.pc-bg img { object-fit: cover; }
.pc-card:hover .pc-bg { transform: scale(1.08); }
.pc-vis::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.35;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
.pc-vis::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(to right, #0b0a10 0%, rgba(11, 10, 16, 0) 45%), linear-gradient(to top, rgba(0, 0, 0, 0.45), transparent 50%);
}
.pc-go {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 99px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(11, 10, 16, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.pc-go span { display: none; }
.pc-go i {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--pc-orange), var(--pc-yellow));
  color: #000;
  transition: transform 0.5s;
}
.pc-card:hover .pc-go i { transform: rotate(45deg); }

.pc-hint {
  position: absolute;
  inset: 0 0 0 42px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  pointer-events: none;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}
.pc-hint i { display: block; width: 1px; height: 32px; background: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), transparent); }

/* Mouvement réduit : pile statique, rail allumé, sans casier */
.pc-reduce { height: auto; min-height: 0; padding-bottom: 64px; }
.pc-reduce .pc-cab, .pc-reduce .pc-hint { display: none; }
.pc-reduce .pc-card { opacity: 1; }
.pc-reduce .pc-node-fill { opacity: 1; transform: none; }
.pc-reduce .pc-node-n { color: #fff; }
.pc-reduce .pc-rail-fill { transform: scaleY(1); }
.pc-reduce .pc-ground { opacity: 0.8; }

@media (max-width: 719px) {
  .pc-card { grid-template-columns: clamp(52px, 9vw, 84px) minmax(0, 1fr) 30%; }
  .pc-main { padding: 0 12px; }
  .pc-kicker { font-size: 9px; letter-spacing: 0.14em; }
}
@media (min-width: 720px) {
  .pc-head { padding-inline: 48px; }
  .pc-front-name { font-size: 14px; }
  .pc-tags { display: flex; }
  .pc-go { padding: 6px 6px 6px 14px; }
  .pc-go span { display: inline; }
}
`;
