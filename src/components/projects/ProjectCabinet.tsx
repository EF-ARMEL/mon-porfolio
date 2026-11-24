"use client";

import { useRef, useState } from "react";
import type React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import ProjectDetail, { type DetailProject } from "./ProjectDetail";
import { getLenis } from "@/components/providers/SmoothScrollProvider";
import type { ProjectRecord } from "@/lib/admin/projects";
import "./cabinet.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Part de scroll (en « segments ») gardée à la fin pour admirer la dernière fiche. */
const TAIL = 0.45;
/** Nombre de fiches visibles derrière la fiche active. */
const MAX_DEPTH = 3;
/** Tags affichés sur la fiche (le reste est résumé en « +N » ; tous restent dans la fiche détaillée). */
const MAX_TAGS = 5;

/**
 * Le casier vivant.
 * Une scène collante (sticky) reste à l'écran pendant que l'on défile :
 * à chaque segment, un tiroir s'ouvre, la fiche du projet en sort et prend
 * la scène ; la fiche précédente recule dans la pile. Tout est piloté par le
 * scroll (scrub), donc réversible. Les tiroirs sont des boutons qui sautent
 * directement au projet. Sans animation (reduced-motion) : simple liste.
 */
export default function ProjectCabinet({ projects }: { projects: ProjectRecord[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<DetailProject | null>(null);
  const list: DetailProject[] = projects.map((p, i) => ({ ...p, id: String(i + 1).padStart(2, "0") }));
  const N = list.length;

  useGSAP(
    () => {
      const el = root.current;
      if (!el || N === 0) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, el);
      const cards = q(".pcab-card");
      const fronts = q(".pcab-dr-front");
      const drawers = q(".pcab-drawer");
      const dims = q(".pcab-dim");
      const imgs = q(".pcab-img");
      const count = q(".pcab-count b")[0];
      const hint = q(".pcab-hint")[0];
      const mobile = () => window.matchMedia("(max-width: 899px)").matches;

      // Décalage carte → tiroir (recalculé à chaque refresh : responsive).
      // Géométrie par offsets (indépendante des transformations GSAP en cours).
      const stage = q(".pcab-stage")[0];
      const offsetIn = (node: HTMLElement) => {
        let x = 0;
        let y = 0;
        let n: HTMLElement | null = node;
        while (n && n !== stage) {
          x += n.offsetLeft;
          y += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        return { x: x + node.offsetWidth / 2, y: y + node.offsetHeight / 2 };
      };
      const fromDrawer = (i: number) => {
        const c = offsetIn(cards[i]);
        const d = offsetIn(drawers[i]);
        return {
          x: d.x - c.x,
          y: d.y - c.y,
          s: Math.max(0.12, Math.min(0.3, drawers[i].offsetWidth / cards[i].offsetWidth)),
        };
      };

      gsap.set(cards, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: q(".pcab-track")[0],
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Compteur : projet dont la fiche est majoritairement sortie.
            const at = self.progress * (N + TAIL);
            const idx = Math.max(0, Math.min(N - 1, Math.floor(at - 0.35)));
            const txt = String(idx + 1).padStart(2, "0");
            if (count && count.textContent !== txt) {
              count.textContent = txt;
              gsap.fromTo(count, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: "expo.out" });
            }
            drawers.forEach((d, k) => d.classList.toggle("is-on", k === idx));
          },
        },
      });

      tl.to(q(".pcab-progress i"), { scaleX: 1, duration: N + TAIL }, 0);
      if (hint) tl.to(hint, { autoAlpha: 0, y: -20, duration: 0.25 }, 0.05);

      cards.forEach((card, i) => {
        const t = i;
        // 1. Le tiroir s'ouvre (vers la scène sur desktop, vers le bas sur mobile).
        tl.to(
          fronts[i],
          { xPercent: () => (mobile() ? 0 : 34), yPercent: () => (mobile() ? 26 : 0), duration: 0.3, ease: "power2.out" },
          t
        );
        // 2. La fiche sort du tiroir et prend la scène.
        tl.fromTo(
          card,
          {
            autoAlpha: 0,
            x: () => fromDrawer(i).x,
            y: () => fromDrawer(i).y,
            scale: () => fromDrawer(i).s,
            rotate: -7,
          },
          { autoAlpha: 1, x: 0, y: 0, scale: 1, rotate: 0, duration: 0.6, ease: "power3.out", immediateRender: false },
          t + 0.12
        );
        // Parallaxe interne de l'image pendant son arrivée et sa vie à l'écran.
        if (imgs[i]) tl.fromTo(imgs[i], { yPercent: -5, scale: 1.08 }, { yPercent: 4, scale: 1.02, duration: 1.2 }, t + 0.12);
        // 3. Les fiches précédentes reculent dans la pile. Seules les 3 dernières
        //    restent visibles ; la 4e s'efface (au lieu de rétrécir à l'infini quand
        //    il y a beaucoup de projets) et le nombre de tweens reste borné.
        for (let j = Math.max(0, i - MAX_DEPTH - 1); j < i; j++) {
          const depth = i - j;
          if (depth > MAX_DEPTH) {
            tl.to(cards[j], { autoAlpha: 0, duration: 0.4 }, t + 0.12);
            continue;
          }
          tl.to(
            cards[j],
            { scale: 1 - 0.055 * depth, y: () => (mobile() ? -12 : -22) * depth, duration: 0.6, ease: "power3.out" },
            t + 0.12
          );
          tl.to(dims[j], { opacity: Math.min(0.78, 0.42 * depth), duration: 0.6 }, t + 0.12);
        }
        // 4. Le tiroir se referme.
        tl.to(fronts[i], { xPercent: 0, yPercent: 0, duration: 0.25, ease: "power2.inOut" }, t + 0.72);
      });
      // Temps mort final pour profiter de la dernière fiche.
      tl.to({}, { duration: TAIL }, N);
    },
    { scope: root, dependencies: [N] }
  );

  /** Saut direct au segment d'un projet (tiroirs cliquables). */
  const goTo = (i: number) => {
    const track = root.current?.querySelector<HTMLElement>(".pcab-track");
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const span = track.offsetHeight - window.innerHeight;
    const y = top + (span * (i + 0.85)) / (N + TAIL);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (N === 0) {
    return (
      <div className="pcab pcab--empty">
        <p>
          <b>Casier en cours de remplissage.</b> Les prochains projets arrivent bientôt.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={root}
      className="pcab"
      style={{
        ["--n" as string]: N,
        // Mobile : tiroirs en grille, 5 par ligne (6 au-delà de 10 projets pour rester sur 2 lignes).
        ["--mcols" as string]: Math.min(N, N > 10 ? 6 : 5),
        // Desktop : deux colonnes de tiroirs au-delà de 9 projets.
        ["--dcols" as string]: N > 9 ? 2 : 1,
        ["--drows" as string]: Math.ceil(N / (N > 9 ? 2 : 1)),
      }}
    >
      <div className="pcab-track">
        <div className="pcab-stage">
          <div className="pcab-bar">
            <span>
              <b>Casier</b> · Nousdev
            </span>
            <span className="pcab-progress" aria-hidden>
              <i />
            </span>
            <span className="pcab-count" aria-hidden>
              <b>01</b> / {String(N).padStart(2, "0")}
            </span>
          </div>

          {/* Le meuble : un tiroir par projet. */}
          <div className="pcab-cab" role="group" aria-label="Tiroirs du casier">
            {list.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className="pcab-drawer"
                data-i={i}
                onClick={() => goTo(i)}
                aria-label={`Aller au projet ${p.id} : ${p.title}`}
              >
                <span className="pcab-dr-slot" aria-hidden />
                <span className="pcab-dr-front" aria-hidden>
                  <span className="pcab-dr-num">{p.id}</span>
                  <span className="pcab-dr-name">{p.title}</span>
                  <span className="pcab-dr-handle" />
                </span>
              </button>
            ))}
          </div>

          {/* La pile de fiches. */}
          <div className="pcab-deck">
            <p className="pcab-hint" aria-hidden>
              <span>Fais défiler</span> pour ouvrir le casier
              <i />
            </p>
            {list.map((p, i) => (
              <article
                key={p.id}
                className="pcab-card"
                style={{ zIndex: i + 1 }}
                onClick={() => setOpen(p)}
                aria-labelledby={`pcab-t-${p.id}`}
              >
                <div className="pcab-vis">
                  <div className="pcab-img" style={p.image ? undefined : { background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}>
                    {p.image && (
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        sizes="(max-width: 899px) 92vw, 72vw"
                        // Chargement immédiat : les fiches sont cachées jusqu'au scroll, le lazy
                        // natif ne les demanderait qu'au moment où elles sortent (visuel vide).
                        loading="eager"
                        unoptimized={p.image.startsWith("https://")}
                        style={{ objectFit: "cover" }}
                      />
                    )}
                    {/* Sans visuel : couverture typographique au nom du projet. */}
                    {!p.image && (
                      <span className="pcab-cover" aria-hidden>
                        {p.title}
                      </span>
                    )}
                  </div>
                  <span className="pcab-num" aria-hidden>
                    {p.id}
                  </span>
                  {p.status && (
                    <span className="pcab-status">
                      <i aria-hidden />
                      {p.status}
                    </span>
                  )}
                </div>

                <div className="pcab-body">
                  <div className="pcab-b1">
                  <p className="pcab-kicker">{p.kicker}</p>
                  <h3
                    id={`pcab-t-${p.id}`}
                    className="pcab-title"
                    // Titres longs : corps réduit, jamais tronqué en plein mot.
                    data-len={p.title.length > 40 ? "xl" : p.title.length > 22 ? "l" : undefined}
                  >
                    {p.title}
                  </h3>
                  <ul className="pcab-tags">
                    {p.tags.slice(0, MAX_TAGS).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                    {p.tags.length > MAX_TAGS && (
                      <li className="pcab-more" aria-label={`et ${p.tags.length - MAX_TAGS} autres technologies`}>
                        +{p.tags.length - MAX_TAGS}
                      </li>
                    )}
                  </ul>
                  </div>
                  <div className="pcab-b2">
                  {p.desc && <p className="pcab-desc">{p.desc}</p>}
                  <div className="pcab-foot">
                    <span>{p.year}</span>
                    <button
                      type="button"
                      className="pcab-cta"
                      data-magnetic
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setOpen(p);
                      }}
                      aria-haspopup="dialog"
                    >
                      <span>Voir la fiche</span>
                      <i>
                        <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden />
                      </i>
                    </button>
                  </div>
                  </div>
                </div>
                <span className="pcab-dim" aria-hidden />
              </article>
            ))}
          </div>
        </div>
      </div>

      {open && <ProjectDetail project={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
