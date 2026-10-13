"use client";

import React, { useState } from "react";
import Image from "next/image";
import ProjectDetail, { type DetailProject } from "./ProjectDetail";
import { pcCss } from "./ProjectCabinet";
import type { ProjectRecord } from "@/lib/admin/projects";

/* Nombre de « récentes » affichées en premier. */
const RECENT_COUNT = 6;

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PF_CSS = `
.pfab {
  --pc-bg: #07070a;
  --pc-ink: #eceaf4;
  --pc-dim: rgba(236, 234, 244, 0.62);
  --pc-line: rgba(255, 255, 255, 0.12);
  --pc-orange: #ff6a00;
  --pc-yellow: #ffd000;
  --pc-violet: #8b5cf6;
  --pc-violet-hi: #c4b5fd;
  --pc-display: var(--font-archivo-black, "Archivo Black", "Arial Black", Impact, sans-serif);
  min-height: 100svh;
  background: var(--pc-bg);
  color: var(--pc-ink);
  padding: 72px 20px 96px;
  -webkit-font-smoothing: antialiased;
}
.pfab *, .pfab *::before, .pfab *::after { box-sizing: border-box; }
.pfab :focus-visible { outline: 2px solid var(--pc-yellow); outline-offset: 3px; }
.pf-inner { width: min(100%, 1080px); margin: 0 auto; }
.pf-title {
  margin: 0;
  font-family: var(--pc-display);
  font-weight: 400;
  font-size: clamp(1.9rem, 5.6vw, 3.6rem);
  line-height: 0.98;
  text-transform: uppercase;
  letter-spacing: -0.01em;
}
.pf-sub {
  margin: 14px 0 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--pc-yellow);
}
.pf-sec { margin-top: 56px; }
.pf-sec h2 {
  margin: 0 0 18px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--pc-dim);
}
.pf-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.pf-cell { position: relative; }
/* La carte reprend le style exact de la home, adaptée à la cellule de grille :
   hauteur dictée par le contenu (jamais tronquée), mise en page empilée en
   mobile et sur 3 colonnes à partir de 720px. */
.pf-cell .pc-card { opacity: 1; min-height: clamp(210px, 19vw, 250px); }
.pf-cell .pc-main h3 { font-size: clamp(1rem, 1.35vw, 1.2rem); }
.pf-cell .pc-idx b { font-size: clamp(1.2rem, 2vw, 1.6rem); }
/*
   Carte rectangulaire qui exploite TOUT l'espace de sa cellule :
   - rail numéroté à gauche sur toute la hauteur,
   - contenu (catégorie, titre, technologies, description) en pleine largeur,
   - visuel en bas, même ordre que la version mobile.
   La colonne de contenu n'est donc plus écrasée par le visuel : plus de
   coupure de mot au milieu du titre, plus de badge rogné.
*/
@media (min-width: 720px) {
  .pf-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pf-cell .pc-card {
    grid-template-columns: 52px minmax(0, 1fr);
    grid-template-rows: auto minmax(170px, auto);
  }
  .pf-cell .pc-idx { grid-column: 1; grid-row: 1 / span 2; }
  .pf-cell .pc-main { grid-column: 2; grid-row: 1; }
  .pf-cell .pc-vis {
    grid-column: 2;
    grid-row: 2;
    min-height: 170px;
    /* Le visuel est sous le contenu : fondu vers le haut, comme en mobile. */
    border-top: 1px solid rgba(255, 255, 255, 0.07);
  }
  .pf-cell .pc-vis::after {
    background: linear-gradient(to bottom, #0b0a10 0%, rgba(11, 10, 16, 0) 45%), linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent 55%);
  }
  .pf-cell .pc-status { top: 8px; left: 8px; }
}
@media (min-width: 1080px) {
  .pf-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
`;

export default function PortfolioGrid({ projects }: { projects: ProjectRecord[] }) {
  const [open, setOpen] = useState<DetailProject | null>(null);

  // Les plus récentes d'abord (updated_at desc), puis le reste.
  const byDate = [...projects].sort((a, b) =>
    a.updatedAt === b.updatedAt ? a.sortOrder - b.sortOrder : b.updatedAt.localeCompare(a.updatedAt)
  );
  const recent = byDate.slice(0, RECENT_COUNT);
  const older = byDate.slice(RECENT_COUNT);

  const card = (p: ProjectRecord) => (
    <div key={p.id} className="pf-cell">
      <button
        type="button"
        className="pc-card"
        data-cursor="hover"
        onClick={() => setOpen(p)}
        aria-haspopup="dialog"
        aria-label={`Ouvrir la fiche du projet ${p.title}`}
      >
        <div className="pc-idx">
          <b>{p.id}</b>
          <span>{p.year}</span>
        </div>

        <div className="pc-main">
          <span className="pc-kicker">{p.kicker}</span>
          <h3>{p.title}</h3>
          <ul className="pc-tags">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {p.desc && <p className="pc-desc">{p.desc}</p>}
        </div>

        <div className="pc-vis">
          <div
            className="pc-bg"
            style={p.image ? undefined : { background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
          >
            {p.image && (
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 719px) 92vw, 300px"
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
          {p.status && (
            <span className="pc-status" aria-label={p.status}>
              <i aria-hidden />
              <b aria-hidden>{p.status}</b>
            </span>
          )}
          <span className="pc-go">
            <span>Voir la fiche</span>
            <i>
              <ArrowIcon />
            </i>
          </span>
        </div>
      </button>
    </div>
  );

  return (
    <main className="pfab">
      <style>{pcCss}</style>
      <style>{PF_CSS}</style>

      <div className="pf-inner">
        <header>
          <h1 className="pf-title">Mon portfolio de réalisations</h1>
          <p className="pf-sub">Plus de {projects.length} projets menés et livrés</p>
        </header>

        <section className="pf-sec" aria-labelledby="pf-recent">
          <h2 id="pf-recent">Réalisations récentes</h2>
          <div className="pf-grid">{recent.map(card)}</div>
        </section>

        {older.length > 0 && (
          <section className="pf-sec" aria-labelledby="pf-older">
            <h2 id="pf-older">Réalisations anciennes</h2>
            <div className="pf-grid">{older.map(card)}</div>
          </section>
        )}
      </div>

      {open && <ProjectDetail project={open} onClose={() => setOpen(null)} />}
    </main>
  );
}
