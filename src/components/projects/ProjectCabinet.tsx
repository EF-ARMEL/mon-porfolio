"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ProjectDetail, { type DetailProject } from "./ProjectDetail";
import type { ProjectRecord } from "@/lib/admin/projects";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* TYPE                                                                 */
/* ------------------------------------------------------------------ */

type Project = DetailProject;

/* Les données proviennent de la base (voir src/lib/admin/projects.ts) et
   sont injectées par la page serveur via la prop `projects`. */

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

export default function ProjectCabinet({ projects }: { projects: ProjectRecord[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<DetailProject | null>(null);
  const PROJECTS: Project[] = projects;

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

    /* ── Pile adaptative : chaque fiche tient dans la hauteur disponible,
       quel que soit le nombre de projets. Si même le minimum tient plus,
       on masque le casier (pc-tiny) plutôt que de couper la dernière fiche. */
    const stackEl = section.querySelector<HTMLElement>(".pc-stack");
    const setRailInset = () => {
      const slot = stackEl?.querySelector<HTMLElement>(".pc-slot");
      if (slot) section.style.setProperty("--rail-inset", `${slot.offsetHeight / 2}px`);
    };
    const fit = () => {
      if (!stackEl) return;
      const slots = stackEl.querySelectorAll<HTMLElement>(".pc-slot");
      const gapPx = parseFloat(getComputedStyle(stackEl).rowGap) || 0;
      const minH = 64; // .pc-slot { min-height }
      // Vrai manque de place : même au minimum, les emplacements ne tiennent pas.
      const squeezed =
        slots.length > 0 &&
        stackEl.clientHeight < slots.length * minH + (slots.length - 1) * gapPx - 2;
      if (squeezed !== section.classList.contains("pc-tiny")) {
        section.classList.toggle("pc-tiny", squeezed);
        setRailInset();
        return;
      }
      setRailInset();
    };
    fit();
    const stackRO = new ResizeObserver(fit);
    stackRO.observe(section);

    const delta = (i: number) => {
      const c = offsetIn(cards[i], section);
      const d = offsetIn(drawers[i], section);
      // Casier masqué (pc-tiny, beaucoup de projets) : la fiche entre du haut.
      if (drawers[i].offsetWidth === 0) {
        return { x: 0, y: -(c.y - 56), s: 0.5 };
      }
      return {
        x: d.x + drawers[i].offsetWidth / 2 - (c.x + cards[i].offsetWidth / 2),
        y: d.y + drawers[i].offsetHeight / 2 - (c.y + cards[i].offsetHeight / 2),
        s: Math.min(0.46, (drawers[i].offsetWidth * 0.5) / cards[i].offsetWidth),
      };
    };

    const STEP = 2.4;
    const START = 0.4;
    const TAIL = 3.4; // dernière carte (≈2.5) + temps mort final (0.9)

    // Distance de scroll adaptative : proportionnelle au nombre de projets.
    // Avant : 380 % fixes — le rythme s'écrasait quand on ajoutait des projets
    // et le dernier restait coupé à la fin du pin.
    const pinLen = () =>
      "+=" +
      Math.round((START + Math.max(0, N - 1) * STEP + TAIL) * 0.35 * window.innerHeight);

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: pinLen,
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
        {PROJECTS.length > 6 && (
          <span className="pc-head-cta">
            <Link href="/portfolio">Voir tout ↗</Link>
          </span>
        )}
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

              <button
                type="button"
                className="pc-card"
                data-card
                data-cursor="hover"
                onClick={() => setOpen(p)}
                aria-haspopup="dialog"
                aria-label={`Ouvrir la fiche du projet ${p.title}`}
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
                  {p.desc && <p className="pc-desc">{p.desc}</p>}
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
                  {p.status && (
                    <span className="pc-status" aria-label={p.status}>
                      <i aria-hidden />
                      <b className="s-full" aria-hidden>
                        {p.status}
                      </b>
                      <b className="s-short" aria-hidden>
                        Bientôt
                      </b>
                    </span>
                  )}
                  <span className="pc-go">
                    <span>Voir la fiche</span>
                    <i>
                      <ArrowIcon />
                    </i>
                  </span>
                </div>
              </button>

              <span className="pc-pulse" data-pulse />
            </div>
          </div>
        ))}

        <div className="pc-hint" data-hint>
          Scroll
          <i></i>
        </div>
      </div>

      {open && <ProjectDetail project={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

const CSS = `/* ================= STYLES DU COMPOSANT ================= */\r
.pcab {\r
  --pc-bg: #07070a;\r
  --pc-ink: #eceaf4;\r
  --pc-dim: rgba(236, 234, 244, 0.62);\r
  --pc-line: rgba(255, 255, 255, 0.12);\r
  --pc-orange: #ff6a00;\r
  --pc-yellow: #ffd000;\r
  --pc-violet: #8b5cf6;\r
  --pc-violet-hi: #c4b5fd;\r
  --pc-display: var(--font-archivo-black, "Archivo Black", "Arial Black", Impact, sans-serif);\r
  --cab-h: clamp(120px, 19svh, 180px);\r
  --card-h: clamp(108px, 17svh, 168px);\r
  --gap: clamp(16px, 3.6svh, 36px);\r
  --pc-slot-gap: var(--gap);\r
  position: relative;\r
  height: 100svh;\r
  min-height: 600px;\r
  width: 100%;\r
  overflow: hidden;\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  gap: clamp(18px, 4svh, 40px);\r
  padding: 64px 16px 20px;\r
  color: var(--pc-ink);\r
  -webkit-font-smoothing: antialiased;\r
}\r
.pcab *, .pcab *::before, .pcab *::after { box-sizing: border-box; }\r
.pcab a { color: inherit; text-decoration: none; }\r
.pcab :focus-visible { outline: 2px solid var(--pc-yellow); outline-offset: 3px; }\r

.pc-head {\r
  position: absolute;\r
  inset: 0 0 auto 0;\r
  z-index: 30;\r
  display: flex;\r
  justify-content: space-between;\r
  padding: 24px 20px 0;\r
  pointer-events: none;\r
  font-size: 11px;\r
  font-weight: 700;\r
  letter-spacing: 0.3em;\r
  text-transform: uppercase;\r
}\r
.pc-head span:first-child { color: var(--pc-dim); }\r
.pc-head span:last-child { color: var(--pc-yellow); }\r
.pc-head-cta a {\r
  pointer-events: auto;\r
  color: var(--pc-yellow);\r
  border: 1px solid var(--pc-line);\r
  border-radius: 99px;\r
  padding: 6px 14px;\r
  transition: border-color 0.3s, color 0.3s;\r
}\r
.pc-head-cta a:hover { border-color: var(--pc-yellow); }\r

/* ---------- Casier ---------- */\r
.pc-cab {\r
  position: relative;\r
  z-index: 5;\r
  flex: none;\r
  width: min(100%, 880px);\r
  height: var(--cab-h);\r
  padding: 10px;\r
  border-radius: 24px;\r
  border: 1px solid var(--pc-line);\r
  background: linear-gradient(160deg, #1c1a26, #0c0b12);\r
  box-shadow: 0 40px 120px -30px rgba(0, 0, 0, 0.9), 0 0 80px -30px rgba(139, 92, 246, 0.35);\r
}\r
.pc-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; height: 100%; }\r
.pc-drawer { position: relative; height: 100%; }\r
.pc-drawer-in {\r
  position: absolute;\r
  inset: 0;\r
  border-radius: 12px;\r
  background: rgba(0, 0, 0, 0.82);\r
  box-shadow: inset 0 10px 28px rgba(0, 0, 0, 0.95);\r
}\r
.pc-folder-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }\r
.pc-folder { height: 66%; aspect-ratio: 120 / 96; max-width: 80%; }\r
.pc-folder svg { display: block; width: 100%; height: 100%; filter: drop-shadow(0 12px 18px rgba(139, 92, 246, 0.45)); }\r
.pc-front {\r
  position: absolute;\r
  inset: 0;\r
  z-index: 10;\r
  border-radius: 12px;\r
  border: 1px solid var(--pc-line);\r
  background: linear-gradient(180deg, #2b2a35, #16151c);\r
  box-shadow: 0 18px 30px -10px rgba(0, 0, 0, 0.8);\r
}\r
.pc-front-top {\r
  display: flex;\r
  justify-content: space-between;\r
  padding: 10px 12px 0;\r
  font-size: 10px;\r
  font-weight: 700;\r
  letter-spacing: 0.25em;\r
  text-transform: uppercase;\r
  color: rgba(255, 255, 255, 0.55);\r
}\r
.pc-front-top b { color: var(--pc-orange); font-weight: 700; }\r
.pc-front-name {\r
  margin: 8px 0 0;\r
  padding-inline: 10px;\r
  text-align: center;\r
  font-family: var(--pc-display);\r
  font-size: 12px;\r
  text-transform: uppercase;\r
  letter-spacing: 0.02em;\r
  color: rgba(255, 255, 255, 0.82);\r
  white-space: nowrap;\r
  overflow: hidden;\r
  text-overflow: ellipsis;\r
}\r
.pc-grip {\r
  position: absolute;\r
  bottom: 10px;\r
  left: 50%;\r
  width: 34%;\r
  height: 5px;\r
  border-radius: 99px;\r
  background: rgba(255, 255, 255, 0.25);\r
  transform: translateX(-50%);\r
}\r

/* ---------- Pile : rail + fiches ---------- */\r
.pc-stack {\r
  position: relative;\r
  z-index: 10;\r
  flex: 1 1 auto;\r
  min-height: 0;\r
  width: min(100%, 880px);\r
  display: flex;\r
  flex-direction: column;\r
  gap: var(--pc-slot-gap, var(--gap));\r
}\r
.pc-rail {\r
  position: absolute;\r
  left: 14px;\r
  top: var(--rail-inset, calc(var(--card-h) / 2));\r
  bottom: var(--rail-inset, calc(var(--card-h) / 2));\r
  width: 1px;\r
  margin-left: -0.5px;\r
  background: rgba(255, 255, 255, 0.12);\r
}\r
.pc-rail-fill {\r
  position: absolute;\r
  inset: 0;\r
  background: linear-gradient(to bottom, var(--pc-violet-hi), var(--pc-orange));\r
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.8);\r
  transform: scaleY(0);\r
  transform-origin: 50% 0;\r
}\r
.pc-slot {\r
  position: relative;\r
  /* Les emplacements partagent la hauteur restante : aucune fiche n'est coupée,\r
     quel que soit le nombre de projets. */\r
  flex: 1 1 0;\r
  height: auto;\r
  min-height: var(--slot-min, 64px);\r
  max-height: var(--card-h);\r
  display: grid;\r
  grid-template-columns: 28px minmax(0, 1fr);\r
  gap: 14px;\r
  align-items: center;\r
}\r
/* Séparateur entre les fiches : visible uniquement lorsque les emplacements ont\r
   la taille réelle (pas en mode pc-tiny où le casier est masqué). */\r
.pc-slot + .pc-slot::before {\r
  content: "";\r
  grid-column: 1 / -1;\r
  height: 1px;\r
  background: rgba(255, 255, 255, 0.12);\r
  margin-block: 0;\r
}\r
/* Beaucoup de projets pour la hauteur disponible : le casier cède la place. */\r
.pcab.pc-tiny { padding-top: 44px; }\r
.pcab.pc-tiny .pc-cab { display: none; }\r
.pcab.pc-tiny .pc-slot + .pc-slot::before { display: none; }\r

.pc-node {\r
  position: relative;\r
  z-index: 2;\r
  display: grid;\r
  place-items: center;\r
  width: 28px;\r
  height: 28px;\r
  border-radius: 50%;\r
  border: 1px solid rgba(255, 255, 255, 0.22);\r
  background: #0b0a10;\r
}\r
.pc-node-fill {\r
  position: absolute;\r
  inset: -1px;\r
  border-radius: 50%;\r
  background: linear-gradient(135deg, #a78bfa, #6d28d9);\r
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.18), 0 0 22px rgba(139, 92, 246, 0.75);\r
  opacity: 0;\r
  transform: scale(0.4);\r
}\r
.pc-node-n {\r
  position: relative;\r
  font-size: 9px;\r
  font-weight: 800;\r
  letter-spacing: 0.06em;\r
  color: rgba(255, 255, 255, 0.45);\r
  font-variant-numeric: tabular-nums;\r
}\r
.pc-cell { position: relative; height: 100%; min-width: 0; }\r
.pc-ground {\r
  position: absolute;\r
  left: 6%;\r
  right: 6%;\r
  bottom: -14px;\r
  height: 22px;\r
  z-index: 0;\r
  border-radius: 50%;\r
  background: radial-gradient(closest-side, rgba(139, 92, 246, 0.6), rgba(139, 92, 246, 0));\r
  filter: blur(8px);\r
  opacity: 0;\r
}\r
.pc-pulse {\r
  position: absolute;\r
  inset: -1px;\r
  z-index: 2;\r
  border-radius: 23px;\r
  border: 1px solid var(--pc-violet-hi);\r
  box-shadow: 0 0 44px rgba(139, 92, 246, 0.6), inset 0 0 30px rgba(139, 92, 246, 0.25);\r
  opacity: 0;\r
  pointer-events: none;\r
}\r

.pc-card {\r
  position: absolute;\r
  inset: 0;\r
  z-index: 1;\r
  display: grid;\r
  grid-template-columns: clamp(52px, 9vw, 84px) minmax(0, 1fr) 34%;\r
  overflow: hidden;\r
  border-radius: 22px;\r
  border: 0;\r
  margin: 0;\r
  padding: 0;\r
  appearance: none;\r
  -webkit-appearance: none;\r
  font: inherit;\r
  color: inherit;\r
  text-align: left;\r
  cursor: pointer;\r
  background: linear-gradient(135deg, #15131d 0%, #0b0a10 70%);\r
  box-shadow: 0 30px 60px -24px rgba(0, 0, 0, 0.95);\r
  opacity: 0;\r
  will-change: transform;\r
}\r
.pc-card::before {\r
  content: "";\r
  position: absolute;\r
  inset: 0;\r
  z-index: 3;\r
  padding: 1px;\r
  border-radius: inherit;\r
  background: linear-gradient(120deg, rgba(167, 139, 250, 0.75), rgba(255, 255, 255, 0.07) 38%, rgba(255, 255, 255, 0.04) 62%, rgba(255, 106, 0, 0.45));\r
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);\r
  -webkit-mask-composite: xor;\r
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);\r
  pointer-events: none;\r
}\r
.pc-idx {\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  justify-content: center;\r
  gap: 8px;\r
  border-right: 1px solid rgba(255, 255, 255, 0.07);\r
}\r
.pc-idx b {\r
  font-family: var(--pc-display);\r
  font-weight: 400;\r
  font-size: clamp(1.5rem, 4.2vw, 2.5rem);\r
  line-height: 1;\r
  color: transparent;\r
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);\r
  transition: color 0.5s, -webkit-text-stroke-color 0.5s;\r
}\r
.pc-card:hover .pc-idx b { color: var(--pc-orange); -webkit-text-stroke-color: var(--pc-orange); }\r
.pc-idx span {\r
  font-size: 10px;\r
  font-weight: 700;\r
  letter-spacing: 0.2em;\r
  color: var(--pc-dim);\r
  font-variant-numeric: tabular-nums;\r
}\r
.pc-main {\r
  display: flex;\r
  flex-direction: column;\r
  justify-content: center;\r
  gap: clamp(6px, 1.2svh, 12px);\r
  min-width: 0;\r
  padding: 0 clamp(14px, 2.4vw, 28px);\r
}\r
.pc-kicker {\r
  font-size: 10px;\r
  font-weight: 700;\r
  letter-spacing: 0.24em;\r
  text-transform: uppercase;\r
  color: var(--pc-violet-hi);\r
  white-space: nowrap;\r
  overflow: hidden;\r
  text-overflow: ellipsis;\r
}\r
.pc-main h3 {\r
  margin: 0;\r
  font-family: var(--pc-display);\r
  font-weight: 400;\r
  font-size: clamp(1.15rem, 3.6vw, 2rem);\r
  line-height: 1.02;\r
  text-transform: uppercase;\r
  letter-spacing: -0.01em;\r
  white-space: nowrap;\r
  overflow: hidden;\r
  text-overflow: ellipsis;\r
}\r
.pc-tags { display: none; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }\r
.pc-tags li {\r
  padding: 4px 11px;\r
  border-radius: 99px;\r
  border: 1px solid rgba(255, 255, 255, 0.16);\r
  font-size: 10px;\r
  letter-spacing: 0.15em;\r
  text-transform: uppercase;\r
  color: var(--pc-dim);\r
}\r
.pc-desc {\r
  margin: 0;\r
  font-size: 11.5px;\r
  line-height: 1.5;\r
  color: rgba(255, 255, 255, 0.58);\r
  display: -webkit-box;\r
  -webkit-line-clamp: 2;\r
  -webkit-box-orient: vertical;\r
  overflow: hidden;\r
}\r
.pc-status {\r
  position: absolute;\r
  top: 10px;\r
  left: 10px;\r
  z-index: 2;\r
  display: inline-flex;\r
  align-items: center;\r
  gap: 7px;\r
  padding: 5px 11px;\r
  border-radius: 99px;\r
  border: 1px solid rgba(255, 106, 0, 0.55);\r
  background: rgba(11, 10, 16, 0.78);\r
  backdrop-filter: blur(6px);\r
  -webkit-backdrop-filter: blur(6px);\r
  font-size: 9px;\r
  font-weight: 700;\r
  letter-spacing: 0.18em;\r
  text-transform: uppercase;\r
  color: #ffb37a;\r
  white-space: nowrap;\r
}\r
.pc-status i {\r
  width: 6px;\r
  height: 6px;\r
  border-radius: 50%;\r
  background: var(--pc-orange);\r
  box-shadow: 0 0 8px var(--pc-orange);\r
  animation: pc-blink 1.4s ease-in-out infinite;\r
}\r
.pc-status .s-short { display: none; }\r
@keyframes pc-blink {\r
  50% { opacity: 0.25; }\r
}\r
@media (prefers-reduced-motion: reduce) {\r
  .pc-status i { animation: none; }\r
}\r
.pc-vis { position: relative; overflow: hidden; }\r
.pc-bg { position: absolute; inset: 0; transition: transform 1s cubic-bezier(0.2, 0.7, 0.2, 1); }\r
.pc-bg img { object-fit: cover; }\r
.pc-card:hover .pc-bg { transform: scale(1.08); }\r
.pc-vis::before {\r
  content: "";\r
  position: absolute;\r
  inset: 0;\r
  z-index: 1;\r
  opacity: 0.35;\r
  mix-blend-mode: overlay;\r
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");\r
}\r
.pc-vis::after {\r
  content: "";\r
  position: absolute;\r
  inset: 0;\r
  z-index: 1;\r
  background: linear-gradient(to right, #0b0a10 0%, rgba(11, 10, 16, 0) 45%), linear-gradient(to top, rgba(0, 0, 0, 0.45), transparent 50%);\r
}\r
.pc-go {\r
  position: absolute;\r
  right: 12px;\r
  bottom: 12px;\r
  z-index: 2;\r
  display: inline-flex;\r
  align-items: center;\r
  gap: 8px;\r
  padding: 6px;\r
  border-radius: 99px;\r
  border: 1px solid rgba(255, 255, 255, 0.18);\r
  background: rgba(11, 10, 16, 0.7);\r
  backdrop-filter: blur(8px);\r
  -webkit-backdrop-filter: blur(8px);\r
  font-size: 10px;\r
  font-weight: 700;\r
  letter-spacing: 0.2em;\r
  text-transform: uppercase;\r
}\r
.pc-go span { display: none; }\r
.pc-go i {\r
  display: grid;\r
  place-items: center;\r
  width: 26px;\r
  height: 26px;\r
  border-radius: 50%;\r
  background: linear-gradient(135deg, var(--pc-orange), var(--pc-yellow));\r
  color: #000;\r
  transition: transform 0.5s;\r
}\r
.pc-card:hover .pc-go i { transform: rotate(45deg); }\r

.pc-hint {\r
  position: absolute;\r
  inset: 0 0 0 42px;\r
  z-index: 3;\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  justify-content: center;\r
  gap: 8px;\r
  pointer-events: none;\r
  font-size: 10px;\r
  font-weight: 700;\r
  letter-spacing: 0.3em;\r
  text-transform: uppercase;\r
  color: rgba(255, 255, 255, 0.5);\r
}\r
.pc-hint i { display: block; width: 1px; height: 32px; background: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), transparent); }\r

/* Mouvement réduit : pile statique, rail allumé, sans casier */\r
.pc-reduce { height: auto; min-height: 0; padding-bottom: 64px; }\r
.pc-reduce .pc-cab, .pc-reduce .pc-hint { display: none; }\r
.pc-reduce .pc-card { opacity: 1; }\r
.pc-reduce .pc-node-fill { opacity: 1; transform: none; }\r
.pc-reduce .pc-node-n { color: #fff; }\r
.pc-reduce .pc-rail-fill { transform: scaleY(1); }\r
.pc-reduce .pc-ground { opacity: 0.8; }\r

@media (max-width: 719px) {\r
  .pc-card { grid-template-columns: clamp(52px, 9vw, 84px) minmax(0, 1fr) 30%; }\r
  .pc-main { padding: 0 12px; }\r
  .pc-kicker { font-size: 9px; letter-spacing: 0.14em; }\r
  .pc-desc { -webkit-line-clamp: 2; font-size: 11px; }\r
  .pc-status { top: 7px; left: 7px; font-size: 7.5px; letter-spacing: 0.06em; padding: 4px 6px; gap: 4px; }\r
  /* Le visuel ne fait ~90px en mobile : texte long remplacé par sa forme courte */\r
  .pc-status .s-full { display: none; }\r
  .pc-status .s-short { display: inline; }\r
}\r
/* Ecran court : la carte fait 108-140px, la description déborderait du overflow:hidden */\r
@media (max-height: 760px) {\r
  .pc-desc { display: none; }\r
}\r
@media (min-width: 720px) {\r
  .pc-head { padding-inline: 48px; }\r
  .pc-front-name { font-size: 14px; }\r
  .pc-tags { display: flex; }\r
  .pc-go { padding: 6px 6px 6px 14px; }\r
  .pc-go span { display: inline; }\r
}\r
`;

/* CSS partagé avec la page /portfolio (cartes identiques). */
export { CSS as pcCss };
