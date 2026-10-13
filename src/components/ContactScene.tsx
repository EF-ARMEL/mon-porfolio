"use client";

import { useActionState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { sendContact, type ContactState } from "@/app/actions/contact";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WORDS = ["Collab-", "orer", "avec", "nousdev"];

type FieldDef = { id: "nom" | "email" | "tel" | "projet"; label: string; type: string; placeholder?: string };

const FIELDS: FieldDef[] = [
  { id: "nom", label: "Nom", type: "text", placeholder: "Jean Dupont" },
  { id: "email", label: "Email", type: "email", placeholder: "jean@mail.fr" },
  { id: "tel", label: "Téléphone", type: "tel", placeholder: "+33 6 12 34 56" },
  { id: "projet", label: "Sujet", type: "text", placeholder: "Vitrine, SaaS…" },
];

const BUDGETS = ["< 2 000 €", "2 000 – 5 000 €", "5 000 – 10 000 €", "> 10 000 €", "À définir"];
const DELAIS = ["Urgent (< 1 mois)", "Dans 1 mois", "2 – 3 mois", "Flexible"];

const boxCls =
  "block w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] text-[#ECEAF4] outline-none transition-all duration-300 placeholder:text-white/25 focus:border-[#FF6A00] focus:bg-white/[0.06]";
const inputCls = `mt-2 ${boxCls}`;
const labelCls =
  "block text-[10px] font-bold uppercase tracking-[0.28em] text-white/45 transition-colors duration-300 group-focus-within:text-[#FF6A00]";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function Err({ m }: { m?: string }) {
  return m ? (
    <span role="alert" className="mt-1.5 block text-xs font-bold text-[#FF8A6A]">
      {m}
    </span>
  ) : null;
}

function Chevron() {
  return (
    <svg
      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ContactScene() {
  const root = useRef<HTMLElement>(null);
  const [state, formAction, pending] = useActionState<ContactState, FormData>(sendContact, { ok: false });

  /* Révélation à l'entrée de la section (une seule fois), sans pin :
     le formulaire reste dans le flux naturel de la page. */
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
          .from(".panel", { opacity: 0, y: 44, duration: 1 }, 0.15)
          .from(".screen-title", { opacity: 0, y: 20, duration: 0.6 }, 0.5)
          .from(".field", { opacity: 0, y: 24, stagger: 0.07, duration: 0.55, ease: "power3.out" }, 0.6)
          .from(".submit", { opacity: 0, y: 16, duration: 0.5, ease: "power3.out" }, ">-0.15");

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

  useGSAP(
    () => {
      if (state.ok) gsap.from(".success > *", { opacity: 0, y: 30, stagger: 0.15, duration: 0.8, ease: "power3.out" });
    },
    { scope: root, dependencies: [state.ok] }
  );

  return (
    <section ref={root} id="contact" className="relative min-h-[100svh] overflow-x-clip bg-[#0A090F] text-[#ECEAF4]">
      {/* Lueurs de marque */}
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

      <div className="relative z-10 mx-auto grid w-full max-w-[1120px] items-center gap-10 px-5 py-16 md:min-h-[100svh] md:grid-cols-[1.05fr_1fr] md:gap-14 md:px-10 md:py-24">
        {/* ───────── Colonne titre ───────── */}
        <div className="title-wrap">
          <span data-kicker className="mb-5 block text-[11px] font-bold uppercase tracking-[0.3em] text-[#FFD000]">
            Contact · Disponible
          </span>

          <h1
            aria-label="Collaborer avec nousdev"
            className="font-[family-name:var(--font-archivo)] text-[clamp(46px,7vw,88px)] uppercase leading-[0.86] tracking-[-0.03em] text-[#E9E4D8]"
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

        {/* ───────── Panneau formulaire ───────── */}
        <form
          action={formAction}
          noValidate
          className="panel relative z-10 rounded-[14px] border border-white/10 bg-[#12111A]/90 p-6 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl md:p-8"
        >
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

          {state.ok ? (
            <div className="success flex min-h-[360px] flex-col justify-center" role="status">
              <p className="font-[family-name:var(--font-archivo)] text-[clamp(34px,5vw,52px)] uppercase leading-[0.95] text-[#FF6A00]">
                Message
                <br />
                envoyé
              </p>
              <p className="mt-4 max-w-sm text-white/60">
                Merci ! On a bien reçu ton message — on te répond très vite.
              </p>
            </div>
          ) : (
            <>
              <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF6A00]">
                Prise de contact
              </span>
              <h2 className="screen-title mt-3 font-[family-name:var(--font-archivo)] text-[clamp(24px,3vw,34px)] uppercase leading-none text-[#ECEAF4]">
                Parlons de
                <br />
                votre projet
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <label key={f.id} className={`field group ${labelCls}`}>
                    {f.label}
                    <input
                      name={f.id}
                      type={f.type}
                      placeholder={f.placeholder}
                      defaultValue={state.values?.[f.id]}
                      aria-invalid={!!state.errors?.[f.id]}
                      className={inputCls}
                    />
                    <Err m={state.errors?.[f.id]} />
                  </label>
                ))}

                <label className={`field group sm:col-span-2 ${labelCls}`}>
                  Budget (facultatif)
                  <span className="relative mt-2 block">
                    <select
                      name="budget"
                      defaultValue={state.values?.budget ?? ""}
                      aria-invalid={!!state.errors?.budget}
                      className={`${boxCls} cursor-pointer appearance-none pr-10`}
                    >
                      <option value="" className="bg-[#12111A]">
                        À préciser
                      </option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b} className="bg-[#12111A]">
                          {b}
                        </option>
                      ))}
                    </select>
                    <Chevron />
                  </span>
                  <Err m={state.errors?.budget} />
                </label>

                <label className={`field group sm:col-span-2 ${labelCls}`}>
                  Délai (facultatif)
                  <span className="relative mt-2 block">
                    <select
                      name="delai"
                      defaultValue={state.values?.delai ?? ""}
                      aria-invalid={!!state.errors?.delai}
                      className={`${boxCls} cursor-pointer appearance-none pr-10`}
                    >
                      <option value="" className="bg-[#12111A]">
                        Sans préférence
                      </option>
                      {DELAIS.map((d) => (
                        <option key={d} value={d} className="bg-[#12111A]">
                          {d}
                        </option>
                      ))}
                    </select>
                    <Chevron />
                  </span>
                  <Err m={state.errors?.delai} />
                </label>

                <label className={`field group sm:col-span-2 ${labelCls}`}>
                  Message
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Ta question, ton idée ou ton projet — dis-nous en quelques mots."
                    defaultValue={state.values?.message}
                    aria-invalid={!!state.errors?.message}
                    className={`${inputCls} min-h-[120px] resize-none`}
                  />
                  <Err m={state.errors?.message} />
                </label>
              </div>

              {state.message && (
                <p role="alert" className="mt-4 text-sm font-bold text-[#FF8A6A]">
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="submit mt-6 flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#FF6A00] font-[family-name:var(--font-archivo)] text-base uppercase tracking-wide text-black transition-colors duration-300 hover:bg-[#FFD000] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Envoi en cours…" : "Lancer le projet"}
              </button>
            </>
          )}
        </form>
      </div>

      {/* Grain argentique + vignette */}
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.10] mix-blend-overlay md:block"
        style={{ backgroundImage: GRAIN }}
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
