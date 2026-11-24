"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { X } from "lucide-react";
import "@/components/conductor/conductor.css";

/** Manifeste découpé en segments : les mots-clés sont surlignés. */
const SEGMENTS: { t: string; mark?: boolean }[] = [
  { t: "Au-delà du développement traditionnel, j'articule les" },
  { t: "intelligences artificielles", mark: true },
  { t: "pour décupler les capacités de vos plateformes. Cette démarche s'accompagne d'une exigence absolue quant à l'" },
  { t: "ergonomie", mark: true },
  { t: "et au" },
  { t: "raffinement visuel", mark: true },
  { t: "de vos interfaces." },
];

type Mode = "pop" | "sheet";
type Props = { label?: string; align?: "left" | "right" };

const noopSubscribe = () => () => {};
const GAP = 14; // espace bouton ↔ panneau
const EDGE = 16; // marge minimale avec les bords de l'écran

/**
 * Bouton « Chef d'Orchestre » + manifeste.
 * - Desktop (pointeur précis, ≥ 768 px) : popover rendu dans <body> (jamais rogné
 *   par le Hero), calé sur le bouton, contraint dans l'écran, au-dessus ou en dessous.
 * - Mobile / tactile : bottom sheet pleine largeur avec voile, bouton fermer, Échap.
 */
export default function ConductorButton({ label = "Chef d'Orchestre", align = "left" }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const hideTimer = useRef(0);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("pop");
  const [pos, setPos] = useState<{ left: number; top: number; maxH: number; side: "above" | "below" }>({
    left: EDGE,
    top: EDGE,
    maxH: 600,
    side: "below",
  });

  // Vrai uniquement côté client (le portail vers <body> n'existe pas au rendu serveur).
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const isSheet = () =>
    window.matchMedia("(max-width: 767px)").matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /**
   * Position du popover : toujours dans l'écran et jamais par-dessus le bouton.
   * Côté choisi = celui qui a la place (sinon le plus grand) ; la hauteur est
   * bornée à l'espace disponible, le contenu défile alors à l'intérieur.
   */
  const place = useCallback(() => {
    const b = btn.current;
    const p = panel.current;
    if (!b || !p) return;
    const r = b.getBoundingClientRect();
    const w = p.offsetWidth;
    const h = p.scrollHeight; // hauteur naturelle, indépendante du max-height courant
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const wanted = align === "right" ? r.right - w : r.left;
    const left = Math.min(Math.max(EDGE, wanted), vw - w - EDGE);
    const below = vh - r.bottom - GAP - EDGE;
    const above = r.top - GAP - EDGE;
    const side = below >= h || below >= above ? "below" : "above";
    const maxH = Math.max(220, side === "below" ? below : above);
    const shown = Math.min(h, maxH);
    const top = side === "below" ? r.bottom + GAP : r.top - GAP - shown;
    setPos({ left, top: Math.max(EDGE, top), maxH, side });
  }, [align]);

  const show = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    setMode(isSheet() ? "sheet" : "pop");
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    setOpen(false);
  }, []);

  /** Fermeture différée : laisse le temps au curseur de passer du bouton au panneau. */
  const hideSoon = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setOpen(false), 180);
  }, []);

  // Positionnement avant affichage + suivi du redimensionnement.
  useLayoutEffect(() => {
    if (!open || mode !== "pop") return;
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, mode, place]);

  // Popover : se ferme au défilement (il est ancré au bouton).
  useEffect(() => {
    if (!open || mode !== "pop") return;
    const onScroll = () => hide();
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open, mode, hide]);

  // Échap ferme ; la sheet reçoit le focus et le rend au bouton à la fermeture.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hide();
        btn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    if (mode === "sheet") closeBtn.current?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [open, mode, hide]);

  // Révélation du contenu : baguette, mots, puces.
  useEffect(() => {
    const p = panel.current;
    if (!open || !p || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = gsap.utils.selector(p);
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(q(".ctd-baton path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: "power3.inOut" }, 0.15)
      .fromTo(q(".ctd-baton circle"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.5, ease: "back.out(3)" }, 1.1)
      .fromTo(q(".ctd-lead .ctd-w"), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06 }, 0.25)
      .fromTo(q(".ctd-text .ctd-w"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.012 }, 0.45)
      .fromTo(q(".ctd-chips li, .ctd-sign"), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 }, 0.8);
    return () => {
      tl.kill();
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const popHover =
    mode === "pop"
      ? {
          onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && window.clearTimeout(hideTimer.current),
          onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && hideSoon(),
        }
      : {};

  const panelEl = (
    <>
      {mode === "sheet" && <div className="ctd ctd-backdrop" data-open={open} onClick={hide} aria-hidden />}
      <div
        ref={panel}
        id="conductor-panel"
        role="dialog"
        aria-modal={mode === "sheet" ? true : undefined}
        aria-labelledby="ctd-title"
        aria-hidden={!open}
        className={`ctd ctd-panel ctd-panel--${mode}`}
        data-open={open}
        data-side={pos.side}
        style={mode === "pop" ? { left: pos.left, top: pos.top, maxHeight: pos.maxH } : undefined}
        {...popHover}
      >
        {mode === "sheet" && <span className="ctd-grip" aria-hidden />}
        <div className="ctd-in">
          <div className="ctd-top">
            <span>
              <b>(Manifeste)</b> · Nousdev
            </span>
            <button ref={closeBtn} type="button" className="ctd-close" onClick={hide} aria-label="Fermer le manifeste">
              <X size={16} aria-hidden />
            </button>
          </div>

          <svg className="ctd-baton" viewBox="0 0 340 44" preserveAspectRatio="none" aria-hidden>
            <path d="M4 34 C 60 4, 110 44, 170 20 S 270 2, 326 18" pathLength={1} strokeDasharray="1" />
            <circle cx="326" cy="18" r="5" />
          </svg>

          <h3 id="ctd-title" className="ctd-lead">
            {["Le", "code", "joue."].map((w) => (
              <span key={w} className="ctd-w">
                {w}&nbsp;
              </span>
            ))}
            <em>
              {["J'orchestre."].map((w) => (
                <span key={w} className="ctd-w">
                  {w}
                </span>
              ))}
            </em>
          </h3>

          <p className="ctd-text">
            {SEGMENTS.map((s, si) => {
              const list = s.t.split(" ");
              const words = list.map((w, wi) => (
                <span key={wi} className="ctd-w">
                  {w}
                  {/* Espace insécable entre les mots du segment, jamais après le dernier
                      (sinon le surlignage déborde) ; « l' » se colle au mot suivant. */}
                  {wi < list.length - 1 ? " " : ""}
                </span>
              ));
              const sep = si < SEGMENTS.length - 1 && !s.t.endsWith("'") ? " " : "";
              return (
                <span key={si}>
                  {s.mark ? <mark>{words}</mark> : words}
                  {sep}
                </span>
              );
            })}
          </p>

          <ul className="ctd-chips" aria-label="Piliers">
            <li>IA · orchestration</li>
            <li>Ergonomie</li>
            <li>Raffinement visuel</li>
          </ul>

          <p className="ctd-sign">
            <span>
              <b>Nousdev</b> — chef d&apos;orchestre
            </span>
            <span aria-hidden>01 / 01</span>
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div
      className="ctd relative inline-block"
      onPointerEnter={(e) => e.pointerType === "mouse" && !isSheet() && show()}
      onPointerLeave={(e) => e.pointerType === "mouse" && mode === "pop" && hideSoon()}
    >
      <button
        ref={btn}
        type="button"
        className="ctd-btn"
        data-magnetic
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="conductor-panel"
        onClick={() => (open ? hide() : show())}
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && show()}
        onBlur={(e) => {
          // Au clavier, on ne ferme pas si le focus entre dans le panneau.
          if (mode === "pop" && !panel.current?.contains(e.relatedTarget as Node)) hideSoon();
        }}
      >
        <span className="ctd-dot" aria-hidden>
          <i className="ctd-ping" />
          <b />
        </span>
        <span>{label}</span>
        <svg className="ctd-caret" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {mounted && createPortal(panelEl, document.body)}
    </div>
  );
}
