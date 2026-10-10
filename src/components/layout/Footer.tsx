"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NAV = [
  { label: "Accueil", href: "#hero" },
  { label: "À propos", href: "#about" },
  { label: "Projets", href: "#projets" },
  { label: "Stack", href: "#stack" },
  { label: "Quiz", href: "#quiz" },
];

const SOCIAL = [
  { label: "GitHub", href: "https://github.com/EF-ARMEL", Icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/franck-armel-ettien-8413a52a1", Icon: FaLinkedinIn },
  { label: "TikTok", href: "https://www.tiktok.com/@armel.nikanor410", Icon: FaTiktok },
  { label: "WhatsApp", href: "https://wa.me/", Icon: FaWhatsapp },
  { label: "Email", href: "mailto:franckarmelettien@gmail.com", Icon: MdEmail },
];

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Reveals non bloquants : le contenu reste visible si le scrollTrigger ne joue pas.
      gsap.from(".ft-col", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "expo.out",
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
      gsap.from(".ft-word", {
        yPercent: 30,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <footer
      ref={root}
      id="footer"
      className="relative w-full overflow-x-clip bg-[#0b0b0c] px-[5vw] pt-[9vh] text-white"
    >
      <div className="grid gap-10 border-t border-white/10 pt-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
        {/* CTA */}
        <div className="ft-col">
          <p className="max-w-sm font-body text-lg leading-snug text-white/90">
            Un projet en tête&nbsp;? Donnons-lui une forme, du premier pixel à la mise en ligne.
          </p>
          <a href="#contact" className="group mt-7 inline-flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full border border-white/25 transition-all duration-300 group-hover:border-[#FF6A3D] group-hover:bg-[#FF6A3D]">
              <ArrowUpRight size={22} className="transition-transform duration-300 group-hover:rotate-45" />
            </span>
            <span className="font-body text-lg underline decoration-[#FF6A3D] decoration-2 underline-offset-4">
              Prendre contact
            </span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="ft-col" aria-label="Navigation du site">
          <h4 className="font-body text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Navigation
          </h4>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="font-body text-white/85 transition-colors hover:text-[#FF6A3D]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact + réseaux */}
        <div className="ft-col">
          <h4 className="font-body text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Contact
          </h4>
          <a
            href="mailto:franckarmelettien@gmail.com"
            className="mt-4 inline-flex items-center gap-2 break-all font-body text-white/85 transition-colors hover:text-[#FF6A3D]"
          >
            <MdEmail size={17} aria-hidden /> franckarmelettien@gmail.com
          </a>
          <div className="mt-5 flex items-center gap-3">
            {SOCIAL.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:border-[#FF6A3D] hover:bg-[#FF6A3D] hover:text-white"
              >
                <Icon size={17} aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* NOUSDEV en grand */}
      <div className="mt-[8vh] overflow-hidden">
        <a href="#hero" aria-label="Retour en haut de page">
          <span
            style={{ fontFamily: "var(--font-anton), Impact, sans-serif" }}
            className="ft-word block bg-gradient-to-r from-white via-white to-[#FF6A3D] bg-clip-text text-center text-[clamp(96px,26vw,480px)] uppercase leading-[0.82] tracking-[-0.02em] text-transparent"
          >
            nousdev
          </span>
        </a>
      </div>

      {/* Baseline */}
      <div className="flex flex-col items-center gap-2 border-t border-white/10 py-6 md:flex-row md:justify-between">
        <span className="font-body text-xs text-zinc-500">
          © 2026 Nousdev — Tous droits réservés.
        </span>
        <span className="font-body text-xs text-zinc-500">Conçu et développé avec exigence.</span>
      </div>
    </footer>
  );
}
