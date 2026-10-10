"use client";

import React, { useEffect, useRef, useState } from "react";
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
  // SVG inline (pas <img>) : le currentColor des fichiers /logos/* se résout
  // uniquement dans le DOM, sinon le logo disparaît sur fond noir.
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      style={{ color: tool.color }}
      aria-hidden
    >
      {tool.id === "gpt" ? (
        /* Fleur officielle OpenAI/ChatGPT : compound path avec trous (windings opposés),
           le disque plat d'avant venait d'un tracé 100% horaire en fill-rule nonzero. */
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
      ) : (
        <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
      )}
    </svg>
  );
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
  const card = useRef<HTMLDivElement>(null);
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

      if (card.current) {
        gsap.fromTo(
          card.current.children,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.05, ease: "expo.out", overwrite: "auto" }
        );
      }
    },
    { dependencies: [active], scope: root }
  );

  /* ───── Mobile : l'orchestre se joue tout seul jusqu'au premier toucher ───── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!mq.matches || reduce) return;

    let timer = 0;
    let stopped = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !stopped && !timer) {
          timer = window.setInterval(() => {
            setActive((a) => (a + 1) % TOOLS.length);
          }, 2600);
        } else if (!e.isIntersecting && timer) {
          clearInterval(timer);
          timer = 0;
        }
      },
      { threshold: 0.35 }
    );
    if (root.current) io.observe(root.current);

    const stop = () => {
      stopped = true;
      if (timer) {
        clearInterval(timer);
        timer = 0;
      }
    };
    window.addEventListener("pointerdown", stop, { once: true });

    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
      window.removeEventListener("pointerdown", stop);
    };
  }, []);

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
        className="relative h-[min(52vh,700px)] min-h-[400px] w-full md:h-[min(70vh,700px)] md:min-h-[480px]"
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
                <p className="hidden font-body text-[11px] leading-[1.45] text-white/90 md:block md:text-sm">
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

      {/* Mobile : la carte détail sous l'anneau (le cercle reste lisible au doigt) */}
      <div
        ref={card}
        className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center md:hidden"
      >
        {cur ? (
          <div key={cur.id}>
            <span className="mb-2 flex justify-center">
              <Logo tool={cur} size={34} />
            </span>
            <small className="font-body text-xs font-semibold text-[#FFD000]">
              {t(`stack.${cur.id}.role`, cur.role)}
            </small>
            <h3 className="font-heading text-2xl uppercase leading-none">{cur.name}</h3>
            <p className="mt-1.5 font-body text-xs leading-[1.5] text-white/85">
              {t(`stack.${cur.id}.desc`, cur.desc)}
            </p>
          </div>
        ) : (
          <p className="font-body text-xs leading-[1.5] text-zinc-400">
            {t("stack.card_teaser", "Dix instruments, un seul chef. Touche un instrument pour écouter sa partition.")}
          </p>
        )}
      </div>

      <p className="mt-6 text-center font-body text-xs text-zinc-500">
        <span className="md:hidden">{t("stack.hint_touch", "Touche un instrument")}</span>
        <span className="hidden md:inline">{t("stack.hint", "Survole un instrument")}</span>
      </p>
    </section>
  );
}
