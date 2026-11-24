"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCabinet from "./ProjectCabinet";
import Chars from "@/components/stack/Chars";
import type { ProjectRecord } from "@/lib/admin/projects";
import "@/components/stack/stack.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Section Projets : en-tête éditorial (même système que Stack / Méthode) + le casier vivant. */
export default function ProjectsSection({ projects }: { projects: ProjectRecord[] }) {
  const head = useRef<HTMLElement>(null);
  const n = String(projects.length).padStart(2, "0");

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(head);
      gsap
        .timeline({ scrollTrigger: { trigger: head.current, start: "top 80%", toggleActions: "play none none none" } })
        .from(q(".stk-meta i"), { scaleX: 0, duration: 1.2, ease: "expo.inOut" }, 0)
        .from(q(".stk-meta > *:not(i)"), { opacity: 0, x: -14, duration: 0.9, stagger: 0.08, ease: "expo.out" }, 0.1)
        .from(q(".stk-ch"), { yPercent: 118, rotate: 7, duration: 1.35, stagger: 0.03, ease: "expo.out" }, 0.05)
        .from(q(".stk-intro"), { opacity: 0, y: 24, duration: 1.1, ease: "expo.out" }, 0.55);
    },
    { scope: head }
  );

  return (
    <section id="projets" aria-labelledby="pcab-title" className="bg-black text-white">
      <header ref={head} className="stk pcab-head" style={{ paddingBottom: 0 }}>
        <div className="stk-head" style={{ marginBottom: 0 }}>
          <div>
            <p className="stk-meta">
              <b>(03)</b>
              <i aria-hidden />
              <span>Projets</span>
              <span>{n} dossiers</span>
            </p>
            <h2 id="pcab-title" className="stk-title" data-skew aria-label="Mes travaux, dans le casier.">
              <span className="stk-ln">
                <Chars text="Mes travaux," />
              </span>
              <span className="stk-ln stk-ln--outline">
                <Chars text="le casier" />
                <span className="stk-ch stk-dot" aria-hidden />
              </span>
            </h2>
          </div>
          <p className="stk-intro">
            <strong>Chaque projet dort dans son tiroir.</strong> Fais défiler : ils sortent un par un, ou touche un tiroir
            pour l&apos;ouvrir directement.
          </p>
        </div>
      </header>

      <ProjectCabinet projects={projects} />
    </section>
  );
}
