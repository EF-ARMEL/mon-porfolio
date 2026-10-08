"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiPhp,
  SiLaravel,
  SiJavascript,
  SiThreedotjs,
  SiMysql,
  SiClaude,
} from "react-icons/si";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Tool = {
  id: string;
  name: string;
  color: string;
  role: string;
  desc: string;
  Icon?: IconType;
  src?: string;
};

const TOOLS: Tool[] = [
  { id: "react", name: "React", color: "#61DAFB", Icon: SiReact, role: "Interfaces", desc: "Je découpe chaque écran en composants réutilisables : états, hooks, logique d'affichage propre." },
  { id: "next", name: "Next.js", color: "#FFFFFF", Icon: SiNextdotjs, role: "Framework web", desc: "App Router, rendu serveur et SEO : le cadre qui porte mes portfolios et mes sites." },
  { id: "php", name: "PHP", color: "#8892BF", Icon: SiPhp, role: "Langage serveur", desc: "La logique métier qui tourne en coulisses : règles, calculs, traitements de données." },
  { id: "laravel", name: "Laravel", color: "#FF2D20", Icon: SiLaravel, role: "Backend", desc: "API, authentification, migrations et panneaux Filament : le moteur de mes applications." },
  { id: "js", name: "JavaScript", color: "#F7DF1E", Icon: SiJavascript, role: "Langage du web", desc: "Interactions, animations et logique côté navigateur : tout ce qui rend l'écran vivant." },
  { id: "three", name: "Three.js", color: "#FFFFFF", Icon: SiThreedotjs, role: "3D", desc: "Scènes, caméras et shaders pour des expériences immersives dans le navigateur." },
  { id: "mysql", name: "MySQL", color: "#00A3E0", Icon: SiMysql, role: "Base de données", desc: "Modélisation des tables, relations et requêtes : la mémoire durable des plateformes." },
  { id: "claude", name: "Claude", color: "#D97757", Icon: SiClaude, role: "IA · code", desc: "Pair-programming au quotidien : architecture, refactor, revue et génération de composants." },
  { id: "gpt", name: "ChatGPT", color: "#74AA9C", src: "/logos/chatgpt.svg", role: "IA · idées", desc: "Brainstorming, rédaction et recherche rapide pour débloquer une idée ou un texte." },
  { id: "anti", name: "Antigravity", color: "#4285F4", src: "/logos/antigravity.svg", role: "IA · agent IDE", desc: "Un agent qui exécute des tâches de développement de bout en bout dans l'éditeur." },
];

function Logo({ tool, size }: { tool: Tool; size: number }) {
  if (tool.Icon) return <tool.Icon size={size} color={tool.color} aria-hidden />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={tool.src} width={size} height={size} alt="" aria-hidden />;
}

export default function Stack() {
  const { t } = useTranslation();
  const [active, setActive] = useState(-1);

  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const prev = useRef(-1);
  const S = useRef({ a: 0, sp: 1, tg: 1, k: 0, R: 0, rot: 1 });

  /* ───── Montage : géométrie, orbite, entrée au scroll ───── */
  useGSAP(
    () => {
      const st = stage.current;
      const rg = ring.current;
      const co = core.current;
      if (!st || !rg || !co) return;

      const s = S.current;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      s.rot = reduce ? 0 : 1;

      const size = () => {
        s.R = Math.max(80, Math.min(st.clientWidth, st.clientHeight) / 2 - 34);
        const c = Math.max(60, 2 * (s.R - 58));
        rg.style.width = `${2 * s.R}px`;
        rg.style.height = `${2 * s.R}px`;
        rg.style.margin = `${-s.R}px 0 0 ${-s.R}px`;
        co.style.width = `${c}px`;
        co.style.height = `${c}px`;
        co.style.margin = `${-c / 2}px 0 0 ${-c / 2}px`;
      };
      size();
      const ro = new ResizeObserver(size);
      ro.observe(st);

      const tick = () => {
        s.sp += (s.tg - s.sp) * 0.06;
        s.a += s.sp * s.rot * 0.0014 * gsap.ticker.deltaRatio(60);
        nodes.current.forEach((n, i) => {
          if (!n) return;
          const th = s.a + (i * Math.PI * 2) / TOOLS.length;
          gsap.set(n, { x: Math.cos(th) * s.R * s.k, y: Math.sin(th) * s.R * s.k });
        });
      };
      gsap.ticker.add(tick);

      if (reduce) {
        s.k = 1;
      } else {
        const nodeEls = nodes.current.filter(Boolean) as HTMLElement[];
        const lines = gsap.utils.toArray<HTMLElement>(".st-line", root.current);

        gsap.set(nodeEls, { opacity: 0, scale: 0.2 });
        gsap.set([co, rg], { opacity: 0, scale: 0.6 });
        gsap.set(lines, { yPercent: 110 });

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "clamp(top 70%)", once: true } })
          .to(lines, { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" }, 0)
          .to(s, { k: 1, duration: 2, ease: "expo.out" }, 0.1)
          .to(nodeEls, { opacity: 1, scale: 1, duration: 1.2, stagger: 0.08, ease: "expo.out" }, 0.1)
          .to([co, rg], { opacity: 1, scale: 1, duration: 1.5, ease: "expo.out" }, 0);
      }

      return () => {
        gsap.ticker.remove(tick);
        ro.disconnect();
      };
    },
    { scope: root }
  );

  /* ───── Changement d'outil actif : arrêt de l'orbite, halo, voile violet, texte ligne par ligne ───── */
  useGSAP(
    () => {
      if (active === -1 && prev.current === -1) return;
      prev.current = active;

      S.current.tg = active < 0 ? 1 : 0;

      nodes.current.forEach((n, j) => {
        if (!n) return;
        const on = j === active;
        gsap.to(n, {
          scale: on ? 2 : 1,
          boxShadow: on ? `0 0 60px ${TOOLS[j].color}cc` : "0 0 0px rgba(0,0,0,0)",
          borderColor: on ? TOOLS[j].color : "rgba(255,255,255,0.13)",
          zIndex: on ? 5 : 1,
          duration: 0.6,
          ease: "expo.out",
          overwrite: "auto",
        });
      });

      gsap.to(veil.current, { opacity: active < 0 ? 0 : 1, duration: 0.7, overwrite: "auto" });

      if (content.current) {
        gsap.fromTo(
          content.current.children,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "expo.out" }
        );
      }
    },
    { dependencies: [active], scope: root }
  );

  const cur = active >= 0 ? TOOLS[active] : null;

  return (
    <section
      ref={root}
      id="stack"
      className="relative w-full overflow-x-clip bg-black px-[5vw] py-[12vh] text-white"
    >
      <header className="mb-[4vh]">
        <span className="mb-4 block font-body text-xs font-semibold text-brand-orange">
          {t("stack.eyebrow", "Stack")}
        </span>
        <h2 className="font-heading text-[clamp(2.4rem,7vw,6.2rem)] uppercase leading-[0.95] tracking-tighter">
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="st-line block">{t("stack.title_1", "Ma boîte")}</span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="st-line block bg-gradient-to-r from-[#FF6A00] to-[#FFD000] bg-clip-text text-transparent">
              {t("stack.title_2", "à outils.")}
            </span>
          </span>
        </h2>
      </header>

      <div
        ref={stage}
        onClick={() => setActive(-1)}
        className="relative h-[min(70vh,700px)] min-h-[480px] w-full"
      >
        {/* Anneau pointillé */}
        <div
          ref={ring}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-dashed border-white/15"
        />

        {/* Centre : le chef d'orchestre */}
        <div
          ref={core}
          className="absolute left-1/2 top-1/2 overflow-hidden rounded-full border border-[#7C3AED66] bg-[radial-gradient(circle,#1a0b3a,#000_72%)]"
        >
          <div
            ref={veil}
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#8B5CF6,#4C1D95_55%,#1e0a4a)] opacity-0"
          />
          <div
            ref={content}
            aria-live="polite"
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-[12%] text-center"
          >
            {cur ? (
              <>
                <Logo tool={cur} size={52} />
                <small className="font-body text-xs font-semibold text-[#FFD000]">
                  {t(`stack.${cur.id}.role`, cur.role)}
                </small>
                <h3 className="font-heading text-[clamp(1.4rem,3vw,2.4rem)] uppercase leading-none">{cur.name}</h3>
                <p className="font-body text-[11px] leading-[1.45] text-white/90 md:text-sm">
                  {t(`stack.${cur.id}.desc`, cur.desc)}
                </p>
              </>
            ) : (
              <>
                <small className="font-body text-xs font-semibold text-[#FFD000]">{t("stack.center_label", "Au centre")}</small>
                <h3 className="font-heading text-[clamp(1.4rem,3vw,2.4rem)] uppercase leading-none">
                  {t("stack.center_title", "L'orchestre")}
                </h3>
                <p className="font-body text-[11px] leading-[1.45] text-white/90 md:text-sm">
                  {t("stack.center_text", "Dix instruments, un seul chef.")}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Les instruments */}
        {TOOLS.map((tool, i) => (
          <button
            key={tool.id}
            ref={(el) => {
              nodes.current[i] = el;
            }}
            type="button"
            aria-label={tool.name}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setActive(-1)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(-1)}
            onClick={(e) => {
              e.stopPropagation();
              setActive(i);
            }}
            className="absolute left-1/2 top-1/2 -ml-8 -mt-8 grid h-16 w-16 cursor-pointer place-items-center rounded-full border border-white/[0.13] bg-[#0b0b0b] p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD000]"
          >
            <Logo tool={tool} size={30} />
          </button>
        ))}
      </div>

      <p className="mt-6 text-center font-body text-xs text-zinc-500">
        {t("stack.hint", "Survole un instrument")}
      </p>
    </section>
  );
}
