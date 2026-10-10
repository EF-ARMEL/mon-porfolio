"use client";

/**
 * About : « Du moteur à l'expérience »
 *
 * Idée : la page passe de la logique à l'image.
 *  1. Le titre s'écrit en contour, un trait relie « moteur » à « expérience »,
 *     puis le contour se remplit de couleur au fil du scroll.
 *  2. Le manifeste s'allume mot à mot (le mot « pont » reste en orange).
 *  3. Le parcours est lu sur une jauge fixe Moteur ↔ Expérience : à chaque étape
 *     active, le repère glisse vers sa position (voir SPECTRUM).
 *
 * Même stack que le reste du site : GSAP + ScrollTrigger via useGSAP, react-i18next.
 * Toutes les clés i18n existantes sont conservées, avec les mêmes textes par défaut.
 * Nouvelles clés (optionnelles, avec défaut) : about.label, about.headline_1,
 * about.headline_2, about.engine, about.experience, about.steps_count.
 *
 * Le CSS est embarqué (const CSS) et préfixé .abt / .abt-* : aucune collision avec
 * Tailwind ni tes styles globaux. Polices : Archivo Black (titres), ta police de
 * corps (--font-body) et une police mono pour les annotations (--font-mono, avec
 * repli sur ui-monospace).
 *
 * Plus de fond fixe ni d'écouteur mousemove global (fuite mémoire dans l'ancienne
 * version). L'image /image/bg-about.jpg est gardée, sous un voile sombre.
 */

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Position de chaque étape sur l'échelle 0 = moteur, 100 = expérience. À ajuster. */
const SPECTRUM = [8, 36, 64, 92];
const STEPS = [1, 2, 3, 4];

/**
 * Les 4 phases de projet (contenu réel, adapté du cycle de gestion de projet).
 * Servies en défauts i18n : about.stepN_date / _title / _text les surchargent si présentes.
 */
const STEP_CONTENT = [
  {
    label: "Go / No Go",
    title: "Cadrage",
    text: "Poser les bases : objectifs, besoins, budget global et risques majeurs. On valide l'utilité du projet et le feu vert avant d'engager les ressources.",
  },
  {
    label: "Feuille de route",
    title: "Planification",
    text: "Organiser la manière d'atteindre les objectifs : calendrier, échéancier des tâches, répartition des rôles et indicateurs de suivi.",
  },
  {
    label: "Exécution",
    title: "Réalisation",
    text: "Produire les livrables : coordonner les ressources, suivre l'avancement, ajuster le plan en cas d'imprévus et communiquer régulièrement.",
  },
  {
    label: "Bilan",
    title: "Clôture",
    text: "Terminer officiellement le projet : livrer le résultat final, archiver les documents et analyser réussites et axes d'amélioration (retour d'expérience).",
  },
];
const pad = (n: number) => String(n).padStart(2, "0");
const EMPHASIS = /^(pont|bridge)$/i;

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((c, i) => (
        <span key={i} className="abt-ch" data-ch aria-hidden>
          {c === " " ? " " : c}
        </span>
      ))}
    </>
  );
}

export default function About() {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLElement>(null);

  const headline1 = t("about.headline_1", "Du moteur");
  const headline2 = t("about.headline_2", "à l'expérience.");
  const manifesto = t(
    "about.manifesto_text",
    "La plupart des développeurs choisissent un camp : la logique pure du serveur ou l'esthétique de l'écran. J'ai choisi d'être le pont entre les deux."
  );
  const engine = t("about.engine", "Moteur");
  const experience = t("about.experience", "Expérience");
  const words = manifesto.split(/\s+/).filter(Boolean);
  const stepTitles = STEPS.map((n, i) => t(`about.step${n}_title`, STEP_CONTENT[i].title));

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Mouvement réduit : tout est lisible, le titre est déjà rempli
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-headline]"), { "--abt-p": "100%" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const headline = q("[data-headline]")[0];

        // 1. Titre : les lettres montent depuis un masque
        gsap.fromTo(
          q("[data-ch]"),
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.15,
            ease: "expo.out",
            stagger: { each: 0.028 },
            scrollTrigger: { trigger: headline, start: "top 88%", once: true },
          }
        );

        // 2. Le trait qui relie « moteur » à « expérience » se dessine
        gsap.fromTo(
          q("[data-bridge]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "expo.inOut",
            delay: 0.45,
            scrollTrigger: { trigger: headline, start: "top 88%", once: true },
          }
        );

        // 3. Le contour se remplit de couleur au fil du scroll
        gsap.fromTo(
          headline,
          { "--abt-p": "0%" },
          {
            "--abt-p": "100%",
            ease: "none",
            scrollTrigger: { trigger: headline, start: "top 62%", end: "bottom 22%", scrub: 0.6 },
          }
        );

        // 4. Manifeste : les mots s'allument un à un
        gsap.fromTo(
          q("[data-w]"),
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            duration: 0.6,
            stagger: { each: 0.12 },
            scrollTrigger: { trigger: q("[data-words]")[0], start: "top 82%", end: "bottom 52%", scrub: true },
          }
        );
        gsap.fromTo(
          q("[data-reveal]"),
          { opacity: 0, x: -14 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: q("[data-reveal]")[0], start: "top 88%", once: true },
          }
        );

        // 5. Parcours : la jauge suit l'étape active
        const rows = q("[data-step]") as HTMLElement[];
        const marker = q("[data-g-marker]")[0];
        const gFill = q("[data-g-fill]")[0];
        const groups = [q(".abt-g-pill span"), q(".abt-g-label span"), q(".abt-g-pct span")] as HTMLElement[][];
        let current = 0;

        const setActive = (i: number) => {
          if (i === current) return;
          current = i;
          rows.forEach((r, k) => {
            r.dataset.active = String(k === i);
          });
          groups.forEach((list) =>
            list.forEach((el, k) => {
              el.dataset.on = String(k === i);
            })
          );
          gsap.to(marker, { left: `${SPECTRUM[i]}%`, duration: 1.1, ease: "expo.out", overwrite: "auto" });
          gsap.to(gFill, { width: `${SPECTRUM[i]}%`, duration: 1.1, ease: "expo.out", overwrite: "auto" });
        };

        rows.forEach((row, i) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (self.isActive) setActive(i);
            },
          });
          gsap.fromTo(
            row.querySelector("[data-rule]"),
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top 90%", end: "top 60%", scrub: true },
            }
          );
          gsap.fromTo(
            row.querySelector("[data-tin]"),
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: row, start: "top 72%", once: true },
            }
          );
          gsap.fromTo(
            row.querySelectorAll("[data-fade]"),
            { y: 26, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: { trigger: row, start: "top 68%", once: true },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      id="about"
      aria-labelledby="abt-h"
      className="abt"
      style={{
        backgroundImage:
          "linear-gradient(rgba(5,5,5,0.72), rgba(5,5,5,0.92)), url('/image/bg-about.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <style>{CSS}</style>

      <div className="abt-wrap">
        <div className="abt-guides" aria-hidden />

        <div className="abt-bar">
          <span>{t("about.label", "À propos")}</span>
          <span>
            {engine}
            <em>→</em>
            {experience}
          </span>
        </div>

        {/* Titre */}
        <h2 className="abt-h" id="abt-h" aria-label={`${headline1} ${headline2}`} data-headline>
          <span className="abt-l1" aria-hidden>
            <span className="abt-mask">
              <span>
                <Chars text={headline1} />
              </span>
            </span>
            <span className="abt-bridge" data-bridge />
          </span>
          <span className="abt-l2" aria-hidden>
            <span className="abt-mask">
              <span className="abt-outline">
                <Chars text={headline2} />
              </span>
            </span>
            <span className="abt-wipe">{headline2}</span>
          </span>
        </h2>

        {/* Manifeste */}
        <div className="abt-man">
          <span className="abt-man-label" data-reveal>
            {t("about.manifesto_label", "Ma Vision")}
          </span>
          <p className="abt-man-text" data-words>
            {words.map((w, i) => (
              <React.Fragment key={i}>
                <span
                  className={`abt-w${EMPHASIS.test(w.replace(/[.,;:!?"«»]/g, "")) ? " em" : ""}`}
                  data-w
                >
                  {w}
                </span>
                {i < words.length - 1 ? " " : null}
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* Parcours */}
        <div className="abt-jny">
          <aside className="abt-side">
            <h3 className="abt-j-title">
              {t("about.journey_title", "Méthode")}
              <small>
                {pad(STEPS.length)} {t("about.steps_count", "étapes")}
              </small>
            </h3>
            <p className="abt-j-desc">
              {t(
                "about.journey_description",
                "Quatre phases pour mener un projet de bout en bout : poser les bases, organiser le travail, livrer, puis faire le bilan — avec des points de contrôle clairs à chaque étape."
              )}
            </p>

            <div
              className="abt-gauge"
              role="img"
              aria-label={`${engine} → ${experience}`}
            >
              <div className="abt-g-track">
                <span className="abt-g-base" />
                <span className="abt-g-ticks" />
                <span className="abt-g-fill" data-g-fill />
                <span className="abt-g-marker" data-g-marker>
                  <span className="abt-g-stem" />
                  <span className="abt-g-pill">
                    {STEPS.map((n, i) => (
                      <span key={n} data-on={i === 0 ? "true" : "false"}>
                        {pad(n)}
                      </span>
                    ))}
                  </span>
                </span>
              </div>
              <div className="abt-g-ends">
                <span>{engine}</span>
                <span>{experience}</span>
              </div>
              <div className="abt-g-read">
                <div className="abt-g-label">
                  {STEPS.map((n, i) => (
                    <span key={n} data-on={i === 0 ? "true" : "false"}>
                      {stepTitles[i]}
                    </span>
                  ))}
                </div>
                <div className="abt-g-pct">
                  {STEPS.map((n, i) => (
                    <span key={n} data-on={i === 0 ? "true" : "false"}>
                      {pad(SPECTRUM[i])} %
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <blockquote className="abt-quote">
              <p>
                {t(
                  "about.quote",
                  "L'objectif n'est pas simplement de coder, mais d'orchestrer une expérience."
                )}
              </p>
            </blockquote>
          </aside>

          <ol className="abt-steps">
            {STEPS.map((n, i) => (
              <li
                key={n}
                className="abt-step"
                data-step
                data-active={i === 0 ? "true" : "false"}
                style={{ "--pos": `${SPECTRUM[i]}%` } as React.CSSProperties}
              >
                <span className="abt-rule" data-rule>
                  <i />
                </span>
                <span className="abt-n" aria-hidden>
                  {pad(n)}
                </span>
                <div className="abt-body">
                  <span className="abt-date">{t(`about.step${n}_date`, STEP_CONTENT[i].label)}</span>
                  <h4>
                    <span className="abt-tmask">
                      <span className="abt-tin" data-tin>
                        {stepTitles[i]}
                      </span>
                    </span>
                  </h4>
                  <p data-fade>{t(`about.step${n}_text`, STEP_CONTENT[i].text)}</p>
                  <div className="abt-mini" aria-hidden>
                    <span className="abt-mini-track" />
                    <i />
                    <span className="abt-mini-ends">
                      <span>{engine}</span>
                      <span>{experience}</span>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CSS du composant (identique à l'aperçu HTML)                        */
/* ------------------------------------------------------------------ */

const CSS = `/* ================= STYLES DU COMPOSANT (identiques au .tsx) ================= */
.abt {
  --abt-bg: #050505;
  --abt-ink: #f5f5f2;
  --abt-dim: rgba(245, 245, 242, 0.56);
  --abt-line: rgba(245, 245, 242, 0.14);
  --abt-orange: #ff6a00;
  --abt-yellow: #ffd000;
  --abt-display: var(--font-archivo-black, "Archivo Black", "Arial Black", Impact, sans-serif);
  --abt-body: var(--font-body, "Manrope", system-ui, -apple-system, "Segoe UI", sans-serif);
  --abt-mono: var(--font-mono, "DM Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  position: relative;
  width: 100%;
  overflow-x: clip;
  padding: clamp(88px, 12vw, 160px) clamp(20px, 5vw, 96px) clamp(96px, 12vw, 180px);
  background-color: var(--abt-bg);
  color: var(--abt-ink);
  font-family: var(--abt-body);
  -webkit-font-smoothing: antialiased;
}
.abt *, .abt *::before, .abt *::after { box-sizing: border-box; }
.abt::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.07;
  mix-blend-mode: overlay;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
.abt-wrap { position: relative; z-index: 1; max-width: 1280px; margin-inline: auto; }
.abt-guides {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  border-right: 1px solid rgba(245, 245, 242, 0.05);
  background: linear-gradient(to right, rgba(245, 245, 242, 0.05) 1px, transparent 1px) 0 0 / 25% 100% repeat-x;
}

/* ---------- Barre d'en-tête ---------- */
.abt-bar {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--abt-line);
  font: 500 11px/1 var(--abt-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--abt-dim);
}
.abt-bar em { font-style: normal; color: var(--abt-orange); padding-inline: 0.6em; }

/* ---------- Titre ---------- */
.abt-h {
  position: relative;
  z-index: 2;
  margin: clamp(48px, 8vw, 104px) 0 0;
  font-family: var(--abt-display);
  font-weight: 400;
  font-size: clamp(2.1rem, 7.6vw, 7.2rem);
  line-height: 0.98;
  letter-spacing: -0.015em;
  text-transform: uppercase;
  white-space: nowrap;
}
.abt-l1 { display: flex; align-items: center; gap: clamp(14px, 2.4vw, 40px); }
.abt-mask { display: block; overflow: hidden; padding: 0.16em 0 0.07em; margin: -0.16em 0 -0.07em; }
.abt-ch { display: inline-block; will-change: transform; }
.abt-bridge {
  position: relative;
  flex: 1;
  min-width: 40px;
  height: 2px;
  transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--abt-orange), var(--abt-yellow));
}
.abt-bridge::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  width: 0.15em;
  height: 0.15em;
  border-top: 2px solid var(--abt-yellow);
  border-right: 2px solid var(--abt-yellow);
  transform: translateY(-50%) rotate(45deg);
}
.abt-l2 { position: relative; display: flow-root; margin-top: 0.06em; }
.abt-outline { display: block; color: transparent; -webkit-text-stroke: 1.5px rgba(245, 245, 242, 0.5); }
.abt-wipe {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  white-space: nowrap;
  pointer-events: none;
  background: linear-gradient(90deg, var(--abt-orange), var(--abt-yellow));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  clip-path: inset(-20% calc(100% - var(--abt-p, 0%)) -20% 0);
}

/* ---------- Manifeste ---------- */
.abt-man {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2vw, 32px);
  margin-top: clamp(72px, 10vw, 150px);
}
.abt-man-label {
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 22px;
  font: 500 11px/1.2 var(--abt-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--abt-orange);
}
.abt-man-label::before { content: ""; flex: none; width: 8px; height: 8px; margin-top: 2px; background: var(--abt-orange); }
.abt-man-text {
  grid-column: 1 / -1;
  margin: 0;
  font-weight: 600;
  font-size: clamp(1.45rem, 3.3vw, 3.1rem);
  line-height: 1.14;
  letter-spacing: -0.015em;
}
.abt-w { display: inline-block; }
.abt-w.em { color: var(--abt-orange); }

/* ---------- Parcours ---------- */
.abt-jny {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(16px, 2vw, 32px);
  margin-top: clamp(112px, 16vw, 240px);
  align-items: start;
}
.abt-side { grid-column: 1 / -1; margin-bottom: clamp(32px, 6vw, 64px); }
.abt-steps { grid-column: 1 / -1; margin: 0; padding: 0; list-style: none; }
.abt-j-title {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin: 0 0 clamp(16px, 2vw, 24px);
  font-family: var(--abt-display);
  font-weight: 400;
  font-size: clamp(1.5rem, 2.6vw, 2.2rem);
  text-transform: uppercase;
  letter-spacing: -0.01em;
}
.abt-j-title small { font: 500 11px/1 var(--abt-mono); letter-spacing: 0.14em; color: var(--abt-dim); }
.abt-j-desc {
  margin: 0 0 clamp(28px, 4vw, 48px);
  max-width: 44ch;
  font-size: clamp(1rem, 1.25vw, 1.125rem);
  line-height: 1.65;
  color: var(--abt-dim);
}

/* Jauge Moteur ↔ Expérience */
.abt-gauge { margin-bottom: clamp(28px, 4vw, 52px); }
.abt-g-track { position: relative; height: 14px; margin-top: 72px; }
.abt-g-base { position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: var(--abt-line); }
.abt-g-ticks {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, rgba(245, 245, 242, 0.5) 1px, transparent 1px) 0 100% / 25% 14px repeat-x,
    linear-gradient(to right, rgba(245, 245, 242, 0.22) 1px, transparent 1px) 0 100% / 2.5% 6px repeat-x;
}
.abt-g-ticks::after { content: ""; position: absolute; right: 0; bottom: 0; width: 1px; height: 14px; background: rgba(245, 245, 242, 0.5); }
.abt-g-fill {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 8%;
  height: 2px;
  background: linear-gradient(90deg, var(--abt-orange), var(--abt-yellow));
  box-shadow: 0 0 14px rgba(255, 106, 0, 0.7);
}
.abt-g-marker { position: absolute; left: 8%; bottom: 0; width: 0; height: 46px; }
.abt-g-stem {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 1px;
  height: 100%;
  margin-left: -0.5px;
  background: var(--abt-orange);
  box-shadow: 0 0 10px rgba(255, 106, 0, 0.8);
}
.abt-g-pill {
  position: absolute;
  left: 0;
  bottom: 46px;
  display: grid;
  padding: 5px 9px;
  border-radius: 99px;
  background: var(--abt-orange);
  color: #000;
  font: 700 11px/1 var(--abt-mono);
  letter-spacing: 0.06em;
  transform: translateX(-50%);
}
.abt-g-pill span { grid-area: 1 / 1; text-align: center; opacity: 0; transition: opacity 0.35s; }
.abt-g-pill span[data-on="true"] { opacity: 1; }
.abt-g-ends {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font: 500 11px/1 var(--abt-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--abt-dim);
}
.abt-g-read { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-top: 22px; }
.abt-g-label, .abt-g-pct { display: grid; min-width: 0; }
.abt-g-label { flex: 1; }
.abt-g-label span, .abt-g-pct span {
  grid-area: 1 / 1;
  opacity: 0;
  transform: translateY(40%);
  transition: opacity 0.5s, transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.abt-g-label span {
  font-family: var(--abt-display);
  font-size: clamp(1.05rem, 1.6vw, 1.35rem);
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.abt-g-pct span { font: 500 12px/1 var(--abt-mono); letter-spacing: 0.1em; color: var(--abt-orange); text-align: right; }
.abt-g-label span[data-on="true"], .abt-g-pct span[data-on="true"] { opacity: 1; transform: none; }

.abt-quote { margin: 0; padding-top: 26px; border-top: 1px solid var(--abt-line); }
.abt-quote::before {
  content: "\\201C";
  display: block;
  margin-bottom: 14px;
  font-family: var(--abt-display);
  font-size: 4.2rem;
  line-height: 0.7;
  color: var(--abt-orange);
}
.abt-quote p { margin: 0; max-width: 30ch; font-size: clamp(1.2rem, 1.9vw, 1.6rem); line-height: 1.3; font-weight: 600; letter-spacing: -0.01em; }

/* Étapes */
.abt-step {
  position: relative;
  display: grid;
  grid-template-columns: clamp(48px, 8vw, 104px) minmax(0, 1fr);
  column-gap: clamp(14px, 2vw, 28px);
  padding: clamp(36px, 6svh, 72px) 0 clamp(48px, 10svh, 120px);
  opacity: 0.42;
  transition: opacity 0.7s;
}
.abt-step[data-active="true"] { opacity: 1; }
.abt-rule { position: absolute; left: 0; right: 0; top: 0; height: 1px; background: var(--abt-line); transform-origin: 0 50%; }
.abt-rule i {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--abt-orange), var(--abt-yellow));
  transform: scaleX(0);
  transform-origin: 0 50%;
  transition: transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.abt-step[data-active="true"] .abt-rule i { transform: scaleX(1); }
.abt-n {
  font-family: var(--abt-display);
  font-size: clamp(1.8rem, 4vw, 3.4rem);
  line-height: 0.9;
  color: transparent;
  -webkit-text-stroke: 1px rgba(245, 245, 242, 0.45);
  transition: color 0.6s, -webkit-text-stroke-color 0.6s;
}
.abt-step[data-active="true"] .abt-n { color: var(--abt-orange); -webkit-text-stroke-color: var(--abt-orange); }
.abt-body { min-width: 0; }
.abt-date {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: clamp(14px, 2vw, 22px);
  font: 500 11px/1 var(--abt-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--abt-dim);
  transition: color 0.6s;
}
.abt-date::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.abt-step[data-active="true"] .abt-date { color: var(--abt-orange); }
.abt-step h4 {
  margin: 0 0 clamp(14px, 2vw, 22px);
  font-family: var(--abt-display);
  font-weight: 400;
  font-size: clamp(1.5rem, 3.1vw, 2.7rem);
  line-height: 1;
  letter-spacing: -0.015em;
  text-transform: uppercase;
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.abt-step:hover h4 { transform: translateX(10px); }
.abt-tmask { display: block; overflow: hidden; padding: 0.12em 0 0.06em; margin: -0.12em 0 -0.06em; }
.abt-tin { display: block; }
.abt-step p { margin: 0; max-width: 46ch; font-size: clamp(1rem, 1.2vw, 1.1rem); line-height: 1.65; color: var(--abt-dim); transition: color 0.6s; }
.abt-step[data-active="true"] p { color: var(--abt-ink); }
.abt-mini { position: relative; max-width: 340px; margin-top: 26px; padding-top: 14px; }
.abt-mini-track { position: absolute; left: 0; right: 0; top: 4px; height: 1px; background: var(--abt-line); }
.abt-mini > i {
  position: absolute;
  left: var(--pos);
  top: 4px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--abt-orange);
  box-shadow: 0 0 12px var(--abt-orange);
  transform: translate(-50%, -50%);
}
.abt-mini-ends { display: flex; justify-content: space-between; font: 500 9px/1 var(--abt-mono); letter-spacing: 0.14em; text-transform: uppercase; color: var(--abt-dim); }

@media (min-width: 720px) {
  .abt-man-label { grid-column: 1 / 4; margin-bottom: 0; padding-top: 0.9em; }
  .abt-man-text { grid-column: 4 / 13; }
}
@media (min-width: 1024px) {
  .abt-side { grid-column: 1 / 6; position: sticky; top: 104px; margin-bottom: 0; }
  .abt-steps { grid-column: 7 / 13; }
  .abt-mini { display: none; }
}
@media (min-width: 1024px) and (max-height: 780px) {
  .abt-quote { display: none; }
}
`;