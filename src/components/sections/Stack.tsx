"use client";

import { useCallback, useRef, useState } from "react";
import type React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import StackRow from "@/components/stack/StackRow";
import StackLens from "@/components/stack/StackLens";
import Chars from "@/components/stack/Chars";
import { SECTIONS, TOOL_COUNT, type Tool } from "@/components/stack/stack-data";
import "@/components/stack/stack.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ROMAN = ["I", "II", "III", "IV", "V"];

// Index global de chaque outil (numérotation continue 01 → 10 à travers les pupitres).
const FLAT: Tool[] = SECTIONS.flatMap((s) => s.tools);

/**
 * Section Stack — « La partition ».
 * Les outils sont rangés par pupitres d'orchestre. Desktop : survol = la ligne
 * se remplit d'orange, son vumètre joue, une lentille suit le curseur.
 * Tactile / clavier : chaque ligne s'ouvre en accordéon.
 */
export default function Stack() {
  const { t } = useTranslation();
  const [active, setActive] = useState(-1);
  const root = useRef<HTMLElement>(null);
  const lensArea = useRef<HTMLDivElement>(null);
  const lastPointer = useRef<string>("");

  const title1 = t("stack.title_1", "Ma boîte");
  const title2 = t("stack.title_2", "à outils");

  /* ───── Entrées au scroll ───── */
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);

      gsap
        .timeline({ scrollTrigger: { trigger: q(".stk-head")[0], start: "top 82%", toggleActions: "play none none none" } })
        .from(q(".stk-meta i"), { scaleX: 0, duration: 1.2, ease: "expo.inOut" }, 0)
        .from(q(".stk-meta > *:not(i)"), { opacity: 0, x: -14, duration: 0.9, stagger: 0.08, ease: "expo.out" }, 0.1)
        .from(
          q(".stk-ch"),
          { yPercent: 118, rotate: 7, duration: 1.35, stagger: 0.032, ease: "expo.out" },
          0.05
        )
        .from(q(".stk-intro"), { opacity: 0, y: 24, duration: 1.1, ease: "expo.out" }, 0.55);

      q(".stk-group").forEach((g) => {
        const sel = gsap.utils.selector(g);
        gsap
          .timeline({ scrollTrigger: { trigger: g, start: "top 85%", toggleActions: "play none none none" } })
          .from(sel(".stk-gline"), { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0)
          .from(sel(".stk-ghead > *:not(.stk-gline)"), { opacity: 0, y: 10, duration: 0.8, stagger: 0.06, ease: "expo.out" }, 0.1)
          .from(sel(".stk-name-in"), { yPercent: 108, duration: 1.25, stagger: 0.09, ease: "expo.out" }, 0.15)
          .from(
            sel(".stk-meter"),
            { clipPath: "inset(100% 0 0 0)", duration: 1.1, stagger: 0.09, ease: "expo.out", clearProps: "clipPath" },
            0.35
          )
          .from(sel(".stk-num, .stk-role, .stk-plus"), { opacity: 0, duration: 0.9, stagger: 0.03, ease: "power2.out" }, 0.4);
      });

      gsap.from(q(".stk-foot > *"), {
        opacity: 0,
        y: 12,
        duration: 0.9,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: q(".stk-foot")[0], start: "top 95%", toggleActions: "play none none none" },
      });
    },
    { scope: root }
  );

  const onHover = useCallback((i: number) => setActive(i), []);
  const onKeyFocus = useCallback((i: number) => setActive(i), []);
  const onBlurRow = useCallback(() => {
    // Au clavier, la ligne se referme quand le focus part (sauf vers une autre ligne, qui prend le relais).
    if (lastPointer.current === "") setActive(-1);
  }, []);
  const onPointerDownRow = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    lastPointer.current = e.pointerType;
  }, []);
  const onActivate = useCallback((i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const pointer = lastPointer.current;
    lastPointer.current = "";
    if (e.detail === 0) return; // Entrée/Espace : le focus a déjà ouvert la ligne
    const fineMouse = pointer === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fineMouse) return; // le survol pilote déjà l'état
    setActive((a) => (a === i ? -1 : i)); // toucher : accordéon
  }, []);

  return (
    <section ref={root} id="stack" className="stk" data-active={active >= 0} aria-labelledby="stk-title">
      <header className="stk-head">
        <div>
          <p className="stk-meta">
            <b>(04)</b>
            <i aria-hidden />
            <span>{t("stack.eyebrow", "Stack")}</span>
            <span>
              {String(TOOL_COUNT).padStart(2, "0")} {t("stack.instruments", "instruments")}
            </span>
          </p>
          <h2 id="stk-title" className="stk-title" aria-label={`${title1} ${title2}.`}>
            <span className="stk-ln">
              <Chars text={title1} />
            </span>
            <span className="stk-ln stk-ln--outline">
              <Chars text={title2} />
              <span className="stk-ch stk-dot" aria-hidden />
            </span>
          </h2>
        </div>
        <p className="stk-intro">
          <strong>{t("stack.intro_strong", "Dix instruments, un seul chef.")}</strong>{" "}
          {t(
            "stack.intro",
            "Chaque outil tient sa partie de la partition, du premier pixel à la base de données. Choisis une ligne pour l'écouter jouer."
          )}
        </p>
      </header>

      <div ref={lensArea} onPointerLeave={(e) => e.pointerType === "mouse" && setActive(-1)}>
        {SECTIONS.map((s, si) => (
          <div key={s.id} className="stk-group">
            <div className="stk-ghead">
              <span>{ROMAN[si]}.</span>
              <span>
                <strong>{t(`stack.group.${s.id}`, s.label)}</strong> — <em>{s.family}</em>
              </span>
              <span>{String(s.tools.length).padStart(2, "0")}</span>
              <span className="stk-gline" aria-hidden />
            </div>
            <ul className="stk-list">
              {s.tools.map((tool) => {
                const i = FLAT.indexOf(tool);
                return (
                  <StackRow
                    key={tool.id}
                    tool={tool}
                    index={i}
                    on={active === i}
                    onHover={onHover}
                    onKeyFocus={onKeyFocus}
                    onBlurRow={onBlurRow}
                    onActivate={onActivate}
                    onPointerDownRow={onPointerDownRow}
                  />
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="stk-foot">
        <span>
          <b>{String(TOOL_COUNT).padStart(2, "0")}</b> {t("stack.foot_1", "instruments")} ·{" "}
          <b>{String(SECTIONS.length).padStart(2, "0")}</b> {t("stack.foot_2", "pupitres")} · <b>01</b>{" "}
          {t("stack.foot_3", "chef")}
        </span>
        <span>
          <span className="md:hidden">{t("stack.hint_touch", "Touche une ligne")}</span>
          <span className="hidden md:inline">{t("stack.hint", "Survole une ligne")}</span>
        </span>
      </div>

      <StackLens tool={active >= 0 ? FLAT[active] : null} area={lensArea} />
    </section>
  );
}
