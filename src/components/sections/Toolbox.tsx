"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import Chars from "@/components/stack/Chars";
import ToolboxGlyph, { type GlyphKind } from "@/components/toolbox/ToolboxGlyph";
import "@/components/stack/stack.css";
import "@/components/toolbox/toolbox.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Reflex = { id: GlyphKind; title: string; label: string; desc: string };

const REFLEXES: Reflex[] = [
  { id: "design", title: "Design", label: "Précision", desc: "Architecture visuelle et prototypage haute fidélité : chaque pixel a une intention." },
  { id: "perf", title: "Perf", label: "Vitesse", desc: "Core Web Vitals au vert et 60 images par seconde constantes, même quand ça bouge beaucoup." },
  { id: "tuning", title: "Tuning", label: "Rigueur", desc: "Configuration sur-mesure et systèmes évolutifs, réglés au cran près plutôt qu'au jugé." },
  { id: "explore", title: "Explore", label: "Curiosité", desc: "Veille technologique et résolution de problèmes complexes : je vais chercher la bonne réponse." },
  { id: "vibe", title: "Vibe", label: "Sensation", desc: "L'art de transformer du code en expérience émotionnelle, celle dont on se souvient." },
];

/**
 * Section « Méthode » — cinq réflexes en lames verticales.
 * Desktop : la lame survolée / focalisée s'élargit et révèle son glyphe animé.
 * Mobile : accordéon vertical. Une lame est toujours ouverte (jamais de section vide).
 */
export default function Toolbox() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);

  const title1 = t("toolbox.title_1", "Ma façon");
  const title2 = t("toolbox.title_2", "de jouer");

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 78%", toggleActions: "play none none none" } })
        .from(q(".stk-meta i"), { scaleX: 0, duration: 1.2, ease: "expo.inOut" }, 0)
        .from(q(".stk-meta > *:not(i)"), { opacity: 0, x: -14, duration: 0.9, stagger: 0.08, ease: "expo.out" }, 0.1)
        .from(q(".stk-ch"), { yPercent: 118, rotate: 7, duration: 1.35, stagger: 0.032, ease: "expo.out" }, 0.05)
        .from(
          q(".tbx-blade"),
          { clipPath: "inset(100% 0% 0% 0%)", duration: 1.3, stagger: 0.09, ease: "expo.inOut", clearProps: "clipPath" },
          0.3
        )
        .from(q(".tbx-num"), { yPercent: 100, opacity: 0, duration: 1, stagger: 0.09, ease: "expo.out" }, 0.8);
    },
    { scope: root }
  );

  return (
    <section ref={root} id="methode" className="stk tbx" aria-labelledby="tbx-title">
      <header className="tbx-head">
        <p className="stk-meta">
          <b>(05)</b>
          <i aria-hidden />
          <span>{t("toolbox.eyebrow", "Méthode")}</span>
          <span>05 {t("toolbox.reflexes", "réflexes")}</span>
        </p>
        <h2 id="tbx-title" className="stk-title tbx-title" data-skew aria-label={`${title1} ${title2}.`}>
          <span className="stk-ln">
            <Chars text={title1} />
          </span>
          <span className="stk-ln stk-ln--outline">
            <Chars text={title2} />
            <span className="stk-ch stk-dot" aria-hidden />
          </span>
        </h2>
      </header>

      <ul className="tbx-blades">
        {REFLEXES.map((r, i) => {
          const on = active === i;
          const title = t(`toolbox.${r.id}.title`, r.title);
          const label = t(`toolbox.${r.id}.label`, r.label);
          return (
            <li key={r.id} className="tbx-blade" data-on={on}>
              <button
                type="button"
                className="tbx-btn"
                aria-expanded={on}
                aria-controls={`tbx-body-${r.id}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="tbx-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="tbx-vert" aria-hidden>
                  {title}
                </span>
                <span className="tbx-label">{label}</span>
                <span className="tbx-name">{title}</span>
              </button>
              <div id={`tbx-body-${r.id}`} className="tbx-body" role="region" aria-label={title}>
                <div className="tbx-body-in">
                  <ToolboxGlyph kind={r.id} on={on} />
                  <p className="tbx-desc">{t(`toolbox.${r.id}.desc`, r.desc)}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
