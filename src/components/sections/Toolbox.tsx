"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PenToolIcon as PenTool } from "@/components/icons/pen-tool";
import { BoltIcon as Bolt } from "@/components/icons/bolt";
import { SlidersHorizontalIcon as SlidersHorizontal } from "@/components/icons/sliders-horizontal";
import { SearchIcon as Search } from "@/components/icons/search";

const TOOL_DATA = [
  {
    id: "design",
    title: "Design",
    label: "Précision",
    desc: "Architecture visuelle et prototypage haute fidélité.",
    Icon: PenTool,
    size: "md:col-span-2 md:row-span-1",
    color: "#FFD000",
  },
  {
    id: "perf",
    title: "Perf",
    label: "Vitesse",
    desc: "Optimisation Core Web Vitals et 60fps constant.",
    Icon: Bolt,
    size: "md:col-span-1 md:row-span-1",
    color: "#8B5CF6",
  },
  {
    id: "config",
    title: "Tuning",
    label: "Rigueur",
    desc: "Configuration sur-mesure et systèmes évolutifs.",
    Icon: SlidersHorizontal,
    size: "md:col-span-1 md:row-span-2",
    color: "#FF6A00",
  },
  {
    id: "research",
    title: "Explore",
    label: "Curiosité",
    desc: "Veille technologique et résolution de problèmes complexes.",
    Icon: Search,
    size: "md:col-span-1 md:row-span-1",
    color: "#FFFFFF",
  },
  {
    id: "vibe",
    title: "Vibe",
    label: "Sensation",
    desc: "L'art de transformer du code en expérience émotionnelle.",
    Icon: Bolt,
    size: "md:col-span-2 md:row-span-1",
    color: "#FFD000",
  },
];

export default function Toolbox() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".tool-card", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "expo.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: container.current,
        start: "top 85%",
        once: true,
      },
    });
  }, { scope: container });

  return (
    <section className="relative w-full py-20 bg-black overflow-hidden">
      <div
        ref={container}
        className="relative w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 px-[5vw]"
      >
        {TOOL_DATA.map((tool) => (
          <div
            key={tool.id}
            className={`tool-card group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-5 md:p-6 transition-all duration-500 hover:border-white/20 hover:bg-zinc-900/80 ${tool.size}`}
          >
            {/* Radial Glow Effect */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), ${tool.color}33 0%, transparent 70%)`
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                e.currentTarget.style.setProperty('--x', `${x}%`);
                e.currentTarget.style.setProperty('--y', `${y}%`);
              }}
            />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                  <tool.Icon size={24} color={tool.color} />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                  {tool.label}
                </span>
              </div>

              <div className="mt-8">
                <h3 className="font-heading text-2xl uppercase leading-none mb-2">
                  {tool.title}
                </h3>
                <p className="font-body text-sm text-zinc-400 leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
