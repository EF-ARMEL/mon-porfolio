"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./contact-terminal.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Découpage du titre, comme l'ancienne section contact. */
const WORDS = ["Collab-", "orer", "avec", "nousdev"];

/* ───────────────────────── Session terminal ───────────────────────── */

type FieldKey = "name" | "email" | "tel" | "projet" | "budget" | "delai" | "message";
type Vals = Record<FieldKey, string>;

type FieldDef = {
  key: FieldKey;
  label: string;
  btn: string;
  kind: "text" | "email" | "tel" | "select" | "textarea";
  /** Facultatif : Entrée vide passe au champ suivant. */
  optional?: boolean;
  options?: string[];
  placeholder?: string;
  autoComplete?: string;
  maxLength: number;
  /** Longueur minimale (0 = champ libre). */
  min: number;
  err: string;
};

const BUDGETS = ["< 2 000 €", "2 000 – 5 000 €", "5 000 – 10 000 €", "> 10 000 €", "À définir"];
const DELAIS = ["Urgent (< 1 mois)", "Dans 1 mois", "2 – 3 mois", "Flexible"];

const FIELDS: FieldDef[] = [
  {
    key: "name",
    label: "nom",
    btn: "↵ Entrée",
    kind: "text",
    placeholder: "Jean Dupont",
    autoComplete: "name",
    maxLength: 80,
    min: 1,
    err: "Dis-moi ton nom.",
  },
  {
    key: "email",
    label: "email",
    btn: "↵ Entrée",
    kind: "email",
    placeholder: "jean@mail.fr",
    autoComplete: "email",
    maxLength: 254,
    min: 1,
    err: "Cette adresse e-mail semble incorrecte.",
  },
  {
    key: "tel",
    label: "téléphone",
    btn: "↵ Entrée",
    kind: "tel",
    optional: true,
    placeholder: "+33 6 12 34 56",
    autoComplete: "tel",
    maxLength: 30,
    min: 6,
    err: "Ce numéro semble incomplet.",
  },
  {
    key: "projet",
    label: "sujet",
    btn: "↵ Entrée",
    kind: "text",
    placeholder: "Vitrine, SaaS…",
    autoComplete: "off",
    maxLength: 120,
    min: 2,
    err: "Dis-moi en un mot de quoi il s'agit.",
  },
  {
    key: "budget",
    label: "budget (facultatif)",
    btn: "↵ Entrée",
    kind: "select",
    optional: true,
    options: BUDGETS,
    maxLength: 0,
    min: 0,
    err: "",
  },
  {
    key: "delai",
    label: "délai (facultatif)",
    btn: "↵ Entrée",
    kind: "select",
    optional: true,
    options: DELAIS,
    maxLength: 0,
    min: 0,
    err: "",
  },
  {
    key: "message",
    label: "message",
    btn: "↵ Envoyer",
    kind: "textarea",
    placeholder: "Ta question, ton idée ou ton projet — dis-nous en quelques mots.",
    autoComplete: "off",
    maxLength: 2000,
    min: 10,
    err: "Ton message est un peu court (10 caractères minimum).",
  },
];

const N = FIELDS.length;
const SENDING = N;
const DONE = N + 1;
const EMPTY: Vals = { name: "", email: "", tel: "", projet: "", budget: "", delai: "", message: "" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const FAIL: Record<string, string> = {
  rate_limited: "Trop de messages envoyés. Réessaie dans une heure.",
  mail_not_configured: "Le formulaire n'est pas encore configuré côté serveur.",
  mail_failed: "L'envoi a échoué. Réessaie dans un instant.",
};

/** Validation mi-chemin client/serveur : le serveur revalide toujours. */
function check(f: FieldDef, raw: string) {
  const v = raw.trim();
  if (f.optional && v === "") return "";
  if (f.kind === "select") return "";
  if (f.kind === "email") return EMAIL.test(v) && v.length <= f.maxLength ? "" : f.err;
  if (v.length < f.min || v.length > f.maxLength) return f.err;
  return "";
}

/* Lectures d'environnement isolées hors du composant : ce sont des appels
   impurs (matchMedia), incompatibles avec les règles React Compiler si elles
   sont écrites dans le corps du composant. */
const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
/** Horodatage du journal, isolé du corps du composant (impur par nature). */
const now = () => performance.now();

/** Ligne « ~/contact $ » + champ + bouton. Composant au niveau module (et non
 *  imbriqué) pour que React conserve le même type d'un rendu à l'autre : le
 *  champ garde son focus pendant la frappe. */
function Row({
  visible,
  isActive,
  rowRef,
  fieldId,
  label,
  btn,
  disabled,
  onAdvance,
  children,
}: {
  visible: boolean;
  isActive: boolean;
  rowRef: React.RefObject<HTMLDivElement | null>;
  fieldId: string;
  label: string;
  btn: string;
  disabled: boolean;
  onAdvance: () => void;
  children: React.ReactNode;
}) {
  if (!visible) return null;
  return (
    <div className={"row" + (isActive ? " active" : "")} ref={rowRef}>
      <label htmlFor={fieldId}>
        <span className="ps" aria-hidden>
          ~/contact $
        </span>
        <b>{label}</b>
      </label>
      {children}
      <button className="go" type="button" onClick={onAdvance} disabled={disabled}>
        {btn}
      </button>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      className="ct-caret pointer-events-none"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ContactTerminal({ onRestart }: { onRestart?: () => void }) {
  const reduced = useRef(false);
  const timers = useRef<gsap.core.Tween[]>([]);
  const alive = useRef(true);
  const root = useRef<HTMLElement>(null);

  // Refs nommées et stables : le rendu ne lit jamais `.current`, seuls les
  // handlers et les effects y accèdent (règles React 19 / react-hooks/refs).
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const telRef = useRef<HTMLInputElement | null>(null);
  const projetRef = useRef<HTMLInputElement | null>(null);
  const budgetRef = useRef<HTMLSelectElement | null>(null);
  const delaiRef = useRef<HTMLSelectElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const fieldRefs = [nameRef, emailRef, telRef, projetRef, budgetRef, delaiRef, messageRef];

  const row0Ref = useRef<HTMLDivElement | null>(null);
  const row1Ref = useRef<HTMLDivElement | null>(null);
  const row2Ref = useRef<HTMLDivElement | null>(null);
  const row3Ref = useRef<HTMLDivElement | null>(null);
  const row4Ref = useRef<HTMLDivElement | null>(null);
  const row5Ref = useRef<HTMLDivElement | null>(null);
  const row6Ref = useRef<HTMLDivElement | null>(null);
  const rowRefs = [row0Ref, row1Ref, row2Ref, row3Ref, row4Ref, row5Ref, row6Ref];

  const [boot, setBoot] = useState(["", ""]);
  // step : -1 = intro, 0..N-1 = champ actif, SENDING = envoi, DONE = fini.
  const [step, setStep] = useState(-1);
  const [vals, setVals] = useState<Vals>(EMPTY);
  const [err, setErr] = useState("");
  const [log, setLog] = useState<{ t: string; ok: boolean }[]>([]);
  const [fail, setFail] = useState("");
  const [sending, setSending] = useState(false);
  const [hp, setHp] = useState("");

  const wait = (ms: number) =>
    new Promise<void>((res) => {
      if (reduced.current) return res();
      timers.current.push(gsap.delayedCall(ms / 1000, res));
    });

  const type = (text: string, set: (s: string) => void, speed = 0.02) =>
    new Promise<void>((res) => {
      if (reduced.current) {
        set(text);
        return res();
      }
      const o = { n: 0 };
      timers.current.push(
        gsap.to(o, {
          n: text.length,
          duration: Math.max(0.15, text.length * speed),
          ease: "none",
          onUpdate: () => set(text.slice(0, Math.round(o.n))),
          onComplete: res,
        })
      );
    });

  useEffect(() => {
    reduced.current = prefersReduced();
    alive.current = true;
    // Séquence d'ouverture : deux lignes tapées, puis le premier champ.
    void (async () => {
      await type("nousdev os 1.0 · session ouverte", (s) => setBoot((b) => [s, b[1]]), 0.018);
      await type(
        `${N} questions. Tape ta réponse, puis Entrée.`,
        (s) => setBoot((b) => [b[0], s]),
        0.014
      );
      if (alive.current) setStep(0);
    })();
    return () => {
      alive.current = false;
      // Copie locale puis vidage : on tue les tweens sans lire `timers` plus tard.
      const pending = timers.current;
      timers.current = [];
      pending.forEach((t) => t.kill());
    };
    // `type` ne dépend que des setters (stables) : pas de re-démarrage parasite.
  }, []);

  // Focus + entrée du champ actif. Sur mobile (pointeur tactile) on n'auto-focalise
  // pas : le clavier virtuel surgirait dès l'arrivée sur la section.
  useEffect(() => {
    if (step < 0 || step >= N) return;
    const row = rowRefs[step].current;
    if (row && !reduced.current) gsap.from(row, { opacity: 0, y: 10, duration: 0.5, ease: "expo.out" });
    if (isFinePointer()) fieldRefs[step].current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  /* Révélation de la colonne titre à l'entrée de la section (une seule fois),
     sans pin : le formulaire reste dans le flux naturel de la page. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 65%", once: true },
          defaults: { ease: "expo.out" },
        });

        intro
          .from("[data-kicker]", { opacity: 0, x: -16, duration: 0.7 }, 0)
          .from(".ch", { yPercent: 120, rotate: 6, stagger: 0.03, duration: 1 }, 0.05)
          .from("[data-line]", { scaleX: 0, duration: 1.1, ease: "expo.inOut" }, 0.35)
          .from(".tagline", { opacity: 0, y: 18, duration: 0.8 }, 0.45)
          .from(".term", { opacity: 0, y: 44, duration: 1 }, 0.15);

        // Bandeau « Disponible… » en parallaxe horizontale (lié au scroll).
        gsap.to(".marquee", {
          xPercent: -30,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });

        return () => {
          intro.scrollTrigger?.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  const shake = useCallback((i: number) => {
    const el = rowRefs[i].current;
    if (el && !reduced.current) gsap.fromTo(el, { x: -8 }, { x: 0, duration: 0.6, ease: "elastic.out(1,.3)" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusAt = useCallback((i: number) => {
    fieldRefs[i].current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function send(data: Vals) {
    setSending(true);
    setStep(SENDING);
    const t0 = now();
    const push = async (t: string, ok = false) => {
      setLog((l) => [...l, { t: "", ok }]);
      await type(
        t,
        (s) => setLog((l) => l.map((x, i) => (i === l.length - 1 ? { ...x, t: s } : x))),
        0.012
      );
      await wait(120);
    };

    try {
      await push("→ validation des champs ........ OK", true);
      await push("→ POST /api/contact");
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: hp }),
      });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string; ticket?: string };
      if (!r.ok || !j.ok) throw new Error(j.error || "mail_failed");
      await push("← " + r.status + " OK · " + Math.round(now() - t0) + " ms", true);
      await push("→ ticket " + (j.ticket ?? "NSD-????"));
      if (alive.current) setStep(DONE);
    } catch (e) {
      if (!alive.current) return;
      setFail(FAIL[(e as Error).message] ?? "L'envoi a échoué. Réessaie dans un instant.");
      // On reste sur le message pour laisser corriger / réessayer.
      setStep(N - 1);
    } finally {
      if (alive.current) setSending(false);
    }
  }

  const advance = useCallback(
    (i: number) => {
      if (sending) return;
      const f = FIELDS[i];
      const e = check(f, vals[f.key]);
      if (e) {
        setErr("✗ " + e);
        shake(i);
        focusAt(i);
        return;
      }
      setErr("");
      setFail("");
      // Tous les champs sont affichés : on passe au suivant, on envoie au dernier.
      if (i < N - 1) {
        setStep(i + 1);
        // Focus utile même sur mobile (l'utilisateur vient de taper ici).
        window.setTimeout(() => fieldRefs[i + 1].current?.focus(), 0);
      } else {
        void send({ ...vals, [f.key]: vals[f.key].trim() });
      }
    },
    // `send` est déclarée plus bas dans le composant : on la remonte avant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sending, vals, shake, focusAt]
  );

  /** Le champ d'index i est celui dont on attend la saisie (surligné). */
  const isActive = (i: number) => step === i;

  /** Écoute commune aux champs texte. */
  const bind = (i: number) => {
    const f = FIELDS[i];
    return {
      id: "ct-" + f.key,
      name: f.key,
      value: vals[f.key],
      spellCheck: false,
      placeholder: f.placeholder,
      autoComplete: f.autoComplete,
      maxLength: f.maxLength || undefined,
      "aria-invalid": vals[f.key] !== "" && !!check(f, vals[f.key]),
      onChange: (ev: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => {
        setVals((v) => ({ ...v, [f.key]: ev.target.value }));
        setErr("");
        if (f.kind === "textarea") {
          ev.target.style.height = "auto";
          ev.target.style.height = ev.target.scrollHeight + "px";
        }
      },
      onKeyDown: (ev: React.KeyboardEvent) => {
        // Shift+Entrée dans le message : retour à la ligne, jamais d'envoi.
        if (ev.key === "Enter" && !(f.kind === "textarea" && ev.shiftKey)) {
          ev.preventDefault();
          advance(i);
        }
      },
    };
  };

  /** Rendu du champ selon son type (sélect = liste native, style terminal). */
  const renderField = (i: number) => {
    const f = FIELDS[i];
    const ref = fieldRefs[i];

    if (f.kind === "select") {
      return (
        <span className="ct-select-wrap">
          <select
            id={"ct-" + f.key}
            name={f.key}
            className="ct-select"
            value={vals[f.key]}
            aria-label={f.label}
            onChange={(ev) => {
              setVals((v) => ({ ...v, [f.key]: ev.target.value }));
              setErr("");
            }}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                ev.preventDefault();
                advance(i);
              }
            }}
            ref={ref as React.RefObject<HTMLSelectElement | null>}
          >
            <option value="">À préciser</option>
            {f.options!.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <Chevron />
        </span>
      );
    }

    if (f.kind === "textarea") {
      return <textarea {...bind(i)} ref={ref as React.RefObject<HTMLTextAreaElement | null>} rows={1} />;
    }

    return <input {...bind(i)} ref={ref as React.RefObject<HTMLInputElement | null>} type={f.kind} />;
  };

  return (
    <section
      ref={root}
      id="contact"
      className="relative min-h-[100svh] overflow-x-clip bg-[#0A090F] text-[#ECEAF4]"
      aria-label="Contact"
    >
      {/* Lueurs de marque : identiques à l'ancienne section contact. */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(50% 45% at 88% 12%, rgba(255,106,0,0.16), transparent 70%), radial-gradient(45% 45% at 8% 92%, rgba(139,92,246,0.14), transparent 70%)",
        }}
      />

      {/* Bandeau décoratif en arrière-plan */}
      <div
        className="marquee pointer-events-none absolute bottom-[3vh] left-0 hidden w-max whitespace-nowrap font-[family-name:var(--font-archivo)] text-[13vw] uppercase leading-none text-transparent opacity-30 md:block"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}
        aria-hidden
      >
        Disponible pour de nouveaux projets — Disponible pour de nouveaux projets —
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1120px] items-center gap-10 px-5 py-16 md:min-h-[100svh] md:gap-14 md:px-10 md:py-24 grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* ───────── Colonne titre ───────── */}
        {/* min-w-0 : sans ça, l'item de grille garde sa taille max-content et
            le titre dépasse la gouttière sur les très petits écrans. */}
        <div className="title-wrap min-w-0">
          <span data-kicker className="mb-5 block text-[11px] font-bold uppercase tracking-[0.3em] text-[#FFD000]">
            Contact · Disponible
          </span>

          <h1
            aria-label="Collaborer avec nousdev"
            className="font-[family-name:var(--font-archivo)] text-[clamp(38px,10.5vw,88px)] uppercase leading-[0.86] tracking-[-0.03em] text-[#E9E4D8]"
          >
            {WORDS.map((w, i) => (
              <span key={w} aria-hidden className="block overflow-hidden pb-[0.06em]">
                <span className={`title-line block ${i === 2 ? "text-[#FF6A00]" : ""}`}>
                  {[...w].map((c, j) => (
                    <span key={j} className="ch inline-block">
                      {c}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>

          <div
            data-line
            className="mt-6 h-px w-full max-w-sm origin-left bg-gradient-to-r from-[#FF6A00] via-[#FFD000] to-transparent"
          />

          <p className="tagline mt-6 max-w-sm text-base leading-relaxed text-white/60 md:text-lg">
            Une question, une idée, une envie de projet&nbsp;? Écris-nous, on te répond vite.
          </p>
        </div>

        {/* ───────── Terminal ───────── */}
        <div className="ct-wrap relative z-10">
          <div className="term">
            <div className="tbar" aria-hidden>
              <i />
              <i />
              <i />
              <span>nousdev@portfolio: ~/contact</span>
            </div>
            <form className="tbody" noValidate onSubmit={(e) => e.preventDefault()}>
              <p className="dim">{boot[0]}</p>
              <p className="dim">{boot[1]}</p>

              {FIELDS.map((f, i) => (
                <Row
                  key={f.key}
                  visible={step >= 0}
                  isActive={isActive(i)}
                  rowRef={rowRefs[i]}
                  fieldId={"ct-" + f.key}
                  label={f.label}
                  btn={f.btn}
                  disabled={sending}
                  onAdvance={() => advance(i)}
                >
                  {renderField(i)}
                </Row>
              ))}

              <input
                className="ct-hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                name="website"
              />

              <p className="err" role="alert">
                {err || fail}
              </p>

              <div className="log" aria-live="polite">
                {log.map((l, i) => (
                  <p key={i} className={"ll" + (l.ok ? " ok" : "")}>
                    {l.t}
                  </p>
                ))}
              </div>

              {step === DONE && (
                <>
                  <p className="fin">Message délivré. Nousdev te répond vite.</p>
                  <button className="again" type="button" onClick={onRestart}>
                    ↺ nouveau message
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Grain argentique + vignette, comme l'ancienne section. */}
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.10] mix-blend-overlay md:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.35) 100%)" }}
        aria-hidden
      />
    </section>
  );
}
