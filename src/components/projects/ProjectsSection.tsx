"use client";

import React, { useRef } from 'react';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ProjectCabinet from './ProjectCabinet';
import type { ProjectRecord } from "@/lib/admin/projects";

export default function ProjectsSection({ projects }: { projects: ProjectRecord[] }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!titleRef.current) return;

    // On cible les lignes du titre pour une révélation cinématographique
    // L'effet : translation Y vers le haut depuis un masque (overflow-hidden)
    gsap.from(titleRef.current.querySelectorAll(".title-line"), {
      yPercent: 110,
      rotate: 2,
      stagger: 0.15,
      duration: 1.2,
      ease: "expo.out",
      delay: 0.2,
    });
  }, { scope: titleRef });

  return (
    <div className="bg-black text-white">
      <div className="max-w-[1040px] mx-auto px-5 pt-[96px] text-center">
        <h2
          ref={titleRef}
          className="font-[family-name:var(--font-archivo)] text-[clamp(32px,6vw,72px)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-white"
        >
          <span className="block overflow-hidden">
            <span className="title-line block">Une exploration de mes travaux,</span>
          </span>
          <span className="block overflow-hidden">
            <span className="title-line block text-white/60">classés dans le casier.</span>
          </span>
        </h2>
      </div>

      <ProjectCabinet projects={projects} />
    </div>
  );
}
