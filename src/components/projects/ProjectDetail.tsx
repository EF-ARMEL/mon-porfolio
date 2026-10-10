"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type DetailProject = {
  id: string;
  title: string;
  year: string;
  kicker: string;
  tags: string[];
  href?: string;
  image?: string;
  desc?: string;
  status?: string;
  detail: {
    objective: string;
    blocks: { title: string; desc: string }[];
    facts: string[];
  };
  from: string;
  to: string;
};

type Props = {
  project: DetailProject;
  onClose: () => void;
};

/* ------------------------------------------------------------------ */
/* Icônes                                                              */
/* ------------------------------------------------------------------ */

function ArrowOutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Composant                                                           */
/* ------------------------------------------------------------------ */

export default function ProjectDetail({ project, onClose }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  /* ── Fermeture : animation sortie puis callback ── */
  const requestClose = () => {
    if (closing.current || !rootRef.current) return;
    closing.current = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onClose();
      return;
    }

    const q = gsap.utils.selector(rootRef);
    gsap
      .timeline({ onComplete: onClose })
      .to(q("[data-d-body]"), { y: 26, opacity: 0, duration: 0.4, ease: "power2.in", stagger: 0.03 }, 0)
      .to(q("[data-d-head]"), { y: -20, opacity: 0, duration: 0.4, ease: "power2.in" }, 0)
      .to(q("[data-d-panel]"), { yPercent: 6, opacity: 0, duration: 0.55, ease: "power3.in" }, 0.12)
      .to(q("[data-d-back]"), { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 0.2);

    // Filet de sécurité : si le onComplete GSAP ne se déclenche pas (ticker
    // suspendu, onglet en arrière-plan…), on démonte quand même.
    window.setTimeout(onClose, 1000);
  };

  /* ── Fermeture : Échap ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Verrou du scroll arrière ── */
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  /* ── Timeline d'entrée cinématographique ── */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = gsap.utils.selector(root);

      if (reduce) return;

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        // 1. Le rideau : le fond monte en opacité
        .fromTo(q("[data-d-back]"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
        // 2. Le panneau se déplie comme une planche de film (clip vertical)
        .fromTo(
          q("[data-d-panel]"),
          { clipPath: "inset(100% 0% 0% 0%)", opacity: 1 },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.inOut" },
          0.1
        )
        // 3. Bandeau haut : kicker + titre en révélation masquée
        .fromTo(q("[data-d-head] .d-line"), { yPercent: 115 }, { yPercent: 0, duration: 1.05, stagger: 0.09 }, 0.55)
        .fromTo(q("[data-d-head] .d-meta"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.8)
        // 4. Visuel : léger punch-in
        .fromTo(
          q("[data-d-visual]"),
          { scale: 1.16, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.3, ease: "power3.out" },
          0.5
        )
        // 5. Corps : objectif puis blocs en cascade
        .fromTo(
          q("[data-d-body]"),
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.08 },
          0.85
        )
        // 6. Tague stack : pop élastique
        .fromTo(
          q("[data-d-tag]"),
          { opacity: 0, scale: 0.6, y: 14 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "back.out(2.2)" },
          1.15
        )
        // 7. CTA : dernière pièce, rotation légère
        .fromTo(
          q("[data-d-cta]"),
          { opacity: 0, y: 40, rotateX: -35 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: "power3.out" },
          1.3
        );
    },
    { scope: rootRef }
  );

  if (typeof document === "undefined") return null;

  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return createPortal(
    <div ref={rootRef} className={`d-root ${reduce ? "d-reduce" : ""}`} role="dialog" aria-modal="true" aria-label={`Détail du projet ${project.title}`}>
      <style>{CSS}</style>

      {/* Backdrop */}
      <button className="d-back" data-d-back aria-label="Fermer la fiche" onClick={requestClose} type="button" />

      {/* Panneau */}
      <article className="d-panel" data-d-panel data-lenis-prevent>
        {/* ── Bandeau haut : titre + meta ── */}
        <header className="d-head" data-d-head>
          <div className="d-head-row">
            <span className="d-id">
              Projet <b>{project.id}</b> — {project.year}
            </span>
            <button className="d-close" type="button" onClick={requestClose} aria-label="Fermer" data-cursor="hover">
              <CloseIcon />
            </button>
          </div>

          <h2 className="d-title">
            <span className="d-mask">
              <span className="d-line">{project.kicker}</span>
            </span>
            <span className="d-mask">
              <span className="d-line d-title-main">{project.title}</span>
            </span>
          </h2>

          <div className="d-meta d-meta-row">
            <span className={`d-status ${project.status ? "is-wip" : "is-live"}`}>
              <i aria-hidden />
              {project.status ?? "En ligne"}
            </span>
            {project.desc && <p className="d-desc">{project.desc}</p>}
          </div>
        </header>

        {/* ── Corps : visuel + contenu ── */}
        <div className="d-grid">
          {/* Visuel */}
          <div className="d-visual-wrap" data-d-body>
            <div
              className="d-visual"
              data-d-visual
              style={project.image ? { background: `linear-gradient(135deg, ${project.from}, ${project.to})` } : { background: `linear-gradient(135deg, ${project.from}, ${project.to})` }}
            >
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 900px) 92vw, 44vw"
                  style={{ objectFit: "cover" }}
                />
              )}
              <span className="d-visual-num" aria-hidden>
                {project.id}
              </span>
            </div>

            {/* Stack */}
            <div className="d-stack" data-d-body>
              <span className="d-label">Stack technique</span>
              <ul className="d-tags">
                {project.tags.map((t) => (
                  <li key={t} data-d-tag>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contenu */}
          <div className="d-content">
            {/* Objectif */}
            <section className="d-block" data-d-body>
              <span className="d-label">Objectif du projet</span>
              <p className="d-objective">{project.detail.objective}</p>
            </section>

            {/* Ce qu'il faut savoir */}
            <section className="d-facts" data-d-body>
              <span className="d-label">Ce qu&apos;il faut savoir</span>
              <div className="d-fact-list">
                {project.detail.blocks.map((b, i) => (
                  <div className="d-fact" key={b.title}>
                    <span className="d-fact-n">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{b.title}</h3>
                      <p>{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Fiche technique */}
            <section className="d-specs" data-d-body>
              {project.detail.facts.map((f) => {
                const [k, ...rest] = f.split(" — ");
                return (
                  <div className="d-spec" key={f}>
                    <span className="d-label">{k}</span>
                    <span className="d-spec-v">{rest.join(" — ")}</span>
                  </div>
                );
              })}
            </section>

            {/* CTA */}
            <div className="d-cta-wrap" data-d-body>
              {project.href ? (
                <a
                  className="d-cta"
                  data-d-cta
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  style={{ background: `linear-gradient(120deg, ${project.from}, ${project.to})` }}
                >
                  <span>Voir le projet</span>
                  <i>
                    <ArrowOutIcon />
                  </i>
                </a>
              ) : (
                <span className="d-cta d-cta-off" data-d-cta style={{ borderColor: project.to, color: project.to }}>
                  <span>{project.status ?? "Bientôt en ligne"}</span>
                  <i aria-hidden>·</i>
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>,
    document.body
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const CSS = `
.d-root {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(10px, 3vh, 32px) clamp(10px, 3vw, 40px);
  font-family: var(--font-body, system-ui, sans-serif);
  color: #eceaf4;
  -webkit-font-smoothing: antialiased;
}
.d-root *, .d-root *::before, .d-root *::after { box-sizing: border-box; }

.d-back {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  cursor: zoom-out;
  background: rgba(4, 4, 6, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
/* Grain sur le fond */
.d-back::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.16;
  mix-blend-mode: overlay;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

.d-panel {
  position: relative;
  z-index: 1;
  width: min(1120px, 100%);
  max-height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: linear-gradient(165deg, #16141f 0%, #0a090f 55%, #0d0b13 100%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: clamp(18px, 2.4vw, 30px);
  box-shadow: 0 60px 140px -40px rgba(0, 0, 0, 0.95), 0 0 120px -50px rgba(255, 106, 0, 0.4);
  padding: clamp(18px, 3vw, 40px);
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.25) transparent;
}
.d-panel::-webkit-scrollbar { width: 6px; }
.d-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 99px; }

/* ── Bandeau haut ── */
.d-head-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.d-id {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(236, 234, 244, 0.55);
}
.d-id b { color: #ff6a00; font-weight: 700; }

.d-close {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #eceaf4;
  cursor: pointer;
  transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.3s, border-color 0.3s, rotate 0.45s;
}
.d-close:hover {
  background: #ff6a00;
  border-color: #ff6a00;
  color: #0a090f;
  rotate: 90deg;
  transform: scale(1.06);
}

.d-title {
  margin: clamp(14px, 2.4vh, 26px) 0 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.d-mask { display: block; overflow: hidden; }
.d-line {
  display: block;
  font-size: clamp(11px, 1.4vw, 14px);
  font-weight: 700;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: #c4b5fd;
  padding-bottom: 0.14em;
}
.d-title-main {
  font-family: var(--font-archivo-black, "Archivo Black", "Arial Black", Impact, sans-serif);
  font-weight: 400;
  font-size: clamp(2rem, 6vw, 4.4rem);
  line-height: 0.96;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: #fff;
  background: linear-gradient(115deg, #ffffff 55%, rgba(255, 255, 255, 0.55));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.d-meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(10px, 1.6vw, 18px);
  margin-top: clamp(10px, 1.8vh, 18px);
}
.d-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: rgba(236, 234, 244, 0.75);
}
.d-status i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
.d-status.is-live { border-color: rgba(52, 211, 153, 0.5); color: #6ee7b7; }
.d-status.is-wip { border-color: rgba(255, 106, 0, 0.55); color: #ffb37a; }
.d-status.is-wip i { background: #ff6a00; box-shadow: 0 0 8px #ff6a00; animation: d-blink 1.4s ease-in-out infinite; }
@keyframes d-blink { 50% { opacity: 0.25; } }

.d-desc {
  margin: 0;
  flex: 1 1 320px;
  min-width: 0;
  font-size: clamp(12.5px, 1.3vw, 14px);
  line-height: 1.55;
  color: rgba(236, 234, 244, 0.6);
}

/* ── Grille corps ── */
.d-grid {
  display: grid;
  grid-template-columns: minmax(0, 44%) minmax(0, 1fr);
  gap: clamp(18px, 3vw, 40px);
  margin-top: clamp(18px, 3vh, 34px);
}

.d-visual-wrap { display: flex; flex-direction: column; gap: clamp(16px, 2.4vh, 26px); min-width: 0; }

.d-visual {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 30px 70px -30px rgba(0, 0, 0, 0.9);
}
.d-visual::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.3;
  mix-blend-mode: overlay;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
.d-visual-num {
  position: absolute;
  right: 10px;
  bottom: -14px;
  z-index: 2;
  font-family: var(--font-archivo-black, "Archivo Black", Impact, sans-serif);
  font-size: clamp(4rem, 9vw, 7rem);
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.4);
  pointer-events: none;
}

.d-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ff6a00;
  margin-bottom: 10px;
}

.d-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.d-tags li {
  padding: 7px 14px;
  border-radius: 99px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(236, 234, 244, 0.8);
}

/* ── Contenu droit ── */
.d-content { display: flex; flex-direction: column; gap: clamp(18px, 3vh, 30px); min-width: 0; }

.d-objective {
  margin: 0;
  font-size: clamp(15px, 1.7vw, 18px);
  line-height: 1.6;
  color: rgba(236, 234, 244, 0.9);
  max-width: 56ch;
}

.d-fact-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.d-fact {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  transition: border-color 0.35s, background 0.35s, transform 0.35s;
}
.d-fact:hover {
  border-color: rgba(255, 106, 0, 0.5);
  background: rgba(255, 106, 0, 0.06);
  transform: translateX(4px);
}
.d-fact-n {
  font-family: var(--font-archivo-black, "Archivo Black", Impact, sans-serif);
  font-size: 14px;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.45);
  padding-top: 2px;
}
.d-fact h3 {
  margin: 0 0 4px;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
}
.d-fact p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.55;
  color: rgba(236, 234, 244, 0.62);
}

.d-specs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}
.d-spec {
  padding: 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
}
.d-spec .d-label { margin-bottom: 6px; color: rgba(236, 234, 244, 0.45); }
.d-spec-v { font-size: 13.5px; font-weight: 600; color: #fff; }

/* ── CTA ── */
.d-cta-wrap { margin-top: 2px; perspective: 600px; }
.d-cta {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 16px 22px 16px 28px;
  border-radius: 99px;
  font-family: var(--font-archivo-black, "Archivo Black", Impact, sans-serif);
  font-size: clamp(13px, 1.5vw, 15px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  color: #0a090f;
  border: 1px solid transparent;
  box-shadow: 0 24px 50px -20px rgba(255, 106, 0, 0.55);
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s, filter 0.4s;
}
.d-cta i {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(10, 9, 15, 0.9);
  color: #fff;
  font-style: normal;
  transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.d-cta:hover { transform: translateY(-3px) scale(1.02); filter: brightness(1.08); }
.d-cta:hover i { transform: rotate(45deg); }
.d-cta-off {
  cursor: default;
  background: transparent !important;
  color: #ffb37a !important;
  box-shadow: none;
  border-color: rgba(255, 106, 0, 0.55) !important;
}
.d-cta-off:hover { transform: none; filter: none; }

/* ── Focus ── */
.d-root :focus-visible { outline: 2px solid #ffd000; outline-offset: 3px; }

/* ── Mobile : une colonne ── */
@media (max-width: 860px) {
  .d-grid { grid-template-columns: minmax(0, 1fr); }
  .d-visual { aspect-ratio: 16 / 9; }
  .d-visual-num { font-size: 4.4rem; }
}

/* ── Réduction de mouvement ── */
.d-reduce .d-back { opacity: 1; }
`;
