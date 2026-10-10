"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Voice = {
  id: string;
  name: string;
  initials: string;
  role: string;
  quote: string;
  color: string;
  fg: string;
  /** Placement dans la grille éditoriale (6 colonnes en md+) */
  span: string;
  offset: string;
};

const VOICES: Voice[] = [
  {
    id: "miss-kre",
    name: "Miss Kre",
    initials: "MK",
    role: "Community Management",
    quote:
      "Sur les réseaux, Franck ne se contente pas de poster : il écoute la communauté, répond, et transforme chaque interaction en fidélité. Notre engagement a triplé en trois mois.",
    color: "#FF6A00",
    fg: "#FFFFFF",
    span: "md:col-span-3",
    offset: "",
  },
  {
    id: "keke",
    name: "Kéké",
    initials: "K",
    role: "IA Project Building",
    quote:
      "Il orchestre l'IA sans jamais lui donner le dernier mot. En une semaine, notre prototype était en production — documenté, testé, et de niveau pro.",
    color: "#FFD000",
    fg: "#000000",
    span: "md:col-span-3",
    offset: "md:mt-14",
  },
  {
    id: "irika",
    name: "Irika",
    initials: "I",
    role: "Commercial",
    quote:
      "Depuis qu'il a refait nos supports de vente, je passe moins de temps à expliquer et plus de temps à closer. Les prospects comprennent tout du premier coup.",
    color: "#FF8A00",
    fg: "#000000",
    span: "md:col-span-2",
    offset: "",
  },
  {
    id: "zarah",
    name: "Zarah",
    initials: "Z",
    role: "Comptable",
    quote:
      "Ponctuel, structuré, zéro mauvaise surprise. Il livre ce qu'il promet, quand il le promet — en comptabilité, ça n'a pas de prix.",
    color: "#8B5CF6",
    fg: "#FFFFFF",
    span: "md:col-span-2",
    offset: "md:mt-7",
  },
  {
    id: "emmanuel-dabre",
    name: "Emmanuel Dabre",
    initials: "ED",
    role: "Développeur",
    quote:
      "Son code se lit comme un bon livre : propre, commenté au bon endroit, sans sur-ingénierie. Nos revues de PR sont devenues un plaisir.",
    color: "#F4F4F5",
    fg: "#000000",
    span: "md:col-span-2",
    offset: "md:mt-14",
  },
];

export default function Testimonials() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const marquee = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const q = gsap.utils.selector(root);

      // Titre : les lignes montent depuis leur masque (même grammaire que Stack/Quiz)
      gsap.fromTo(
        q(".tm-line"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.15,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "clamp(top 85%)", once: true },
        }
      );

      // Cartes : montée + légère rotation, en cascade éditoriale
      gsap.fromTo(
        q(".tm-card"),
        { y: 56, opacity: 0, rotate: 1.2 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 1,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "clamp(top 78%)", once: true },
        }
      );

      // Bandeau infini : une largeur de copie = -50% du track (double copie identique)
      if (marquee.current) {
        gsap.to(marquee.current, { xPercent: -50, duration: 42, ease: "none", repeat: -1 });
      }
    },
    { scope: root }
  );

  const strip = (key: number) => (
    <div key={key} className="flex shrink-0 items-center gap-8 pr-8" aria-hidden>
      {VOICES.map((v) => (
        <React.Fragment key={v.id}>
          <span className="font-heading text-3xl uppercase leading-none tracking-tight text-white/15 md:text-5xl">
            {v.name}
          </span>
          <span className="text-sm text-brand-orange">✦</span>
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/30 md:text-xs">
            {t(`testimonials.${v.id}.role`, v.role)}
          </span>
          <span className="text-sm text-white/20">✦</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section
      ref={root}
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="relative w-full overflow-x-clip bg-black px-[5vw] py-[12vh] text-white"
    >
      <header className="mb-[5vh]">
        <span className="mb-4 block font-body text-xs font-semibold text-brand-orange">
          {t("testimonials.eyebrow", "Témoignages")}
        </span>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2
            id="testimonials-title"
            className="font-heading text-[clamp(2.4rem,7vw,6.2rem)] uppercase leading-[0.95] tracking-tighter"
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="tm-line block">{t("testimonials.title_1", "Ce qu'ils")}</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="tm-line block bg-gradient-to-r from-[#FF6A00] to-[#FFD000] bg-clip-text text-transparent">
                {t("testimonials.title_2", "disent de moi.")}
              </span>
            </span>
          </h2>
          <p className="max-w-xs font-body text-sm leading-relaxed text-zinc-400 md:text-right">
            {t(
              "testimonials.lead",
              "Cinq regards sur ma façon de travailler, de l'IA au chiffre."
            )}
          </p>
        </div>
      </header>

      {/* Bandeau des voix en défilement continu */}
      <div className="relative mb-[6vh] overflow-hidden border-y border-white/10 bg-white/[0.02] py-5">
        <div ref={marquee} className="flex w-max">
          {strip(0)}
          {strip(1)}
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-6">
        {VOICES.map((v, i) => (
          <figure
            key={v.id}
            className={`tm-card group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-6 transition-colors duration-500 hover:border-white/25 md:p-7 ${v.span} ${v.offset}`}
          >
            {/* Halo radial suivant le curseur (grammaire de Toolbox) */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), ${v.color}26 0%, transparent 70%)`,
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                e.currentTarget.style.setProperty("--x", `${x}%`);
                e.currentTarget.style.setProperty("--y", `${y}%`);
              }}
            />

            {/* Guillemet géant, volontairement rogné par le coin de la carte */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-7 right-3 select-none font-heading text-[6.5rem] leading-none text-white/[0.06] transition-colors duration-500 group-hover:text-white/[0.12]"
            >
              «
            </span>

            <div className="relative z-10 flex h-full flex-col">
              <blockquote className="flex-1">
                <p
                  className={`font-body leading-relaxed text-white/85 ${
                    i === 0 ? "text-base md:text-lg" : "text-sm md:text-base"
                  }`}
                >
                  « {t(`testimonials.${v.id}.quote`, v.quote)} »
                </p>
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 font-heading text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${v.color}, ${v.color}99)`,
                    color: v.fg,
                  }}
                >
                  {v.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-heading text-lg uppercase leading-none">
                    {v.name}
                  </span>
                  <span className="mt-1 block font-body text-[11px] font-semibold uppercase tracking-wider text-brand-orange">
                    {t(`testimonials.${v.id}.role`, v.role)}
                  </span>
                </span>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
