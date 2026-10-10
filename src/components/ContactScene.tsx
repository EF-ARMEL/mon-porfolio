"use client";

import { useActionState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { sendContact, type ContactState } from "@/app/actions/contact";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WORDS = ["Collab-", "orer", "avec", "nousdev"];
const FIELDS = [
  { id: "nom", label: "Nom", type: "text" },
  { id: "email", label: "Email", type: "email" },
  { id: "tel", label: "Téléphone", type: "tel" },
  { id: "projet", label: "Type de projet", type: "text" },
] as const;

const inputBase =
  "mt-1 block w-full rounded-2xl bg-[#ECE8DD] px-3.5 text-base outline-none transition-shadow focus:ring-2 focus:ring-[#FF6A3D]";
const inputCls = `${inputBase} h-10 md:h-[clamp(36px,5vh,48px)]`;
const textareaCls = `${inputBase} h-16 md:h-[clamp(52px,8vh,84px)] resize-none py-3`;
const labelCls = "block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-600";
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function Err({ m }: { m?: string }) {
  return m ? (
    <span role="alert" className="mt-1 block text-xs font-bold normal-case tracking-normal text-[#C2370E]">{m}</span>
  ) : null;
}

export default function ContactScene() {
  const root = useRef<HTMLElement>(null);
  const [state, formAction, pending] = useActionState<ContactState, FormData>(sendContact, { ok: false });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const st = { trigger: root.current, start: "top top", scrub: 1, pin: true, anticipatePin: 1 };

      /* ───────── DESKTOP : séquence cinéma ───────── */
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(".phone", { xPercent: 0 });
        gsap.set(".tilt", {});
        gsap.set(".panel", { scaleX: 2, transformOrigin: "left center" });

        // 1. Ouverture au chargement : le titre se compose lettre par lettre
        gsap.from(".ch", { yPercent: 120, rotate: 6, stagger: 0.035, duration: 1.1, ease: "expo.out", delay: 0.2 });
        gsap.from(".tagline", { opacity: 0, y: 20, duration: 1, delay: 1.1 });

        // 2. Scroll : le rideau noir se retire, le téléphone entre en 3D depuis la gauche
        //    et se pose COLLÉ À DROITE, puis la caméra pousse (grand + large).
        const tl = gsap.timeline({ scrollTrigger: { ...st, end: "+=4200" } });
        tl.to(".panel", { scaleX: 1, duration: 1.4, ease: "power4.inOut" }, 0)
          .fromTo(".phone", { yPercent: 95, scale: 0.7, xPercent: -18, rotationX: 0 }, { yPercent: 0, scale: 1, xPercent: 0, rotationX: 0, duration: 2.4, ease: "power3.out" }, 0.4)
          .fromTo(".shadow", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 2.4 }, 0.4)
          .fromTo(".glare", { xPercent: -140 }, { xPercent: 140, duration: 2.4, ease: "power2.inOut" }, 0.4)
          .to(".title-wrap", { xPercent: -15, scale: 0.92, transformOrigin: "left top", duration: 3, ease: "none" }, 0)
          // le formulaire se révèle pendant la montée du téléphone (jamais de long écran vide)
          .from(".screen-title", { opacity: 0, y: 24, duration: 0.5, ease: "power3.out" }, 1.3)
          .from(".field", { opacity: 0, y: 26, stagger: 0.07, duration: 0.45, ease: "power3.out" }, 1.5)
          .from(".submit", { opacity: 0, y: 18, scale: 0.94, duration: 0.5, ease: "power3.out" }, 2.0)
          // une fois posé : caméra qui pousse → le téléphone occupe toute la partie droite
          .to(".phone", { scale: 1.07, duration: 1.2, ease: "power1.inOut" }, 2.8)
          // balayage de « focus » champ par champ, comme un curseur qui remplit le formulaire
          .to(".field input, .field textarea", { boxShadow: "inset 0 0 0 2px #FF6A3D", backgroundColor: "#fff", stagger: 0.16, duration: 0.25, yoyo: true, repeat: 1 }, 3.0)
          .to(".submit", { backgroundColor: "#FF6A3D", scale: 1.04, duration: 0.45, yoyo: true, repeat: 1 }, ">");

        // 3. Texte-fantôme qui défile derrière le téléphone, lié au scroll
        gsap.to(".marquee", { xPercent: -40, ease: "none", scrollTrigger: { ...st, pin: false, end: "+=4200", scrub: true } });
      });

      /* ───────── MOBILE : formulaire seul, plein écran ───────── */
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { ...st, end: "+=1800" } })
          .from(".title-line", { yPercent: 110, stagger: 0.12, duration: 1, ease: "power4.out" })
          .to(".title-wrap", { opacity: 0.15, scale: 0.92, duration: 1 }, ">+0.3")
          .fromTo(".phone", { yPercent: 88 }, { yPercent: 0, duration: 1.4, ease: "power3.out" }, "<");
        // Aucun masquage du formulaire sur mobile : titre, champs et bouton
        // sont visibles dès que le téléphone entre — pas de scroll pour les voir.
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  useGSAP(
    () => {
      if (state.ok) gsap.from(".success > *", { opacity: 0, y: 40, stagger: 0.15, duration: 0.8, ease: "power3.out" });
    },
    { scope: root, dependencies: [state.ok] }
  );

  return (
    <section ref={root} id="contact" className="relative h-[100svh] overflow-hidden bg-[#E9E4D8] text-[#141414]">
      <div className="panel absolute inset-y-0 left-0 w-full bg-[#141414] md:w-1/2" aria-hidden />

      <div className="marquee pointer-events-none absolute bottom-[4vh] left-0 hidden whitespace-nowrap font-[family-name:var(--font-archivo)] text-[14vw] uppercase leading-none text-transparent mix-blend-difference md:block" style={{ WebkitTextStroke: "1px #fff" }} aria-hidden>
        Disponible pour de nouveaux projets — Disponible pour de nouveaux projets —
      </div>

      <div className="title-wrap absolute inset-0">
        <h1 aria-label="Collaborer avec nousdev" className="pointer-events-none absolute left-6 top-16 font-[family-name:var(--font-archivo)] text-[clamp(64px,19vw,200px)] uppercase leading-[0.84] tracking-[-0.04em] text-[#E9E4D8] md:left-14 md:text-[clamp(72px,15.6vw,210px)]">
          {WORDS.map((w, i) => (
            <span key={w} aria-hidden className="block overflow-hidden pb-[0.06em]">
              <span className={`title-line block ${i === 2 ? "text-[#FF6A3D]" : ""}`}>
                {[...w].map((c, j) => (
                  <span key={j} className="ch inline-block">{c}</span>
                ))}
              </span>
            </span>
          ))}
        </h1>
        <p className="tagline absolute bottom-12 left-6 max-w-xs text-lg text-[#E9E4D8] md:left-16">
          Décrivez votre projet. Un développeur vous répond.
        </p>
      </div>

      {/* Mobile : formulaire plein écran. Desktop (md:) : iPhone 3D flottant */}
      <div className="phone absolute inset-0 h-full w-full overflow-hidden rounded-t-[36px] bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.5)] md:inset-auto md:overflow-visible md:rounded-none md:shadow-none md:left-auto md:right-[2vw] md:top-[5vh] md:h-[90vh] md:min-h-0 md:w-[49vh] md:bg-transparent">
        <div className="shadow absolute inset-x-6 -bottom-10 hidden h-24 rounded-[50%] bg-black/40 blur-3xl md:block" aria-hidden />
        <div className="tilt relative h-full w-full bg-white md:rounded-[6vh] md:bg-[#0b0b0c] md:p-[13px] md:ring-[3px] md:ring-[#3a3a3d]">
          <form
            action={formAction}
            noValidate
            data-lenis-prevent
            className="relative h-full overflow-y-auto bg-white px-6 pb-5 pt-[max(env(safe-area-inset-top),1.5rem)] md:overflow-y-auto md:rounded-[calc(6vh-13px)] md:px-6 md:pb-6 md:pt-[clamp(44px,6.5vh,64px)]"
          >
            <span className="absolute left-1/2 top-[15px] hidden h-[clamp(24px,3.6vh,36px)] w-[31%] -translate-x-1/2 rounded-full bg-[#0b0b0c] md:block" aria-hidden style={{ top: 'clamp(10px,1.6vh,15px)' }} />
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

            {state.ok ? (
              <div className="success flex h-full flex-col justify-center pb-10" role="status">
                <p className="font-[family-name:var(--font-archivo)] text-5xl uppercase leading-[0.9]">
                  Message<br />envoyé
                </p>
                <p className="mt-4 text-neutral-600">Merci. Un développeur vous répond très vite.</p>
              </div>
            ) : (
              <>
                <h2 className="screen-title mb-3 font-[family-name:var(--font-archivo)] text-2xl text-[#141414]! md:text-[clamp(22px,3.8vh,36px)] uppercase leading-none md:mb-[clamp(10px,2vh,20px)]">
                  Nouveau<br />projet
                </h2>
                <div className="space-y-2 md:space-y-[clamp(4px,1vh,10px)]">
                  {FIELDS.map((f) => (
                    <label key={f.id} className={`field ${labelCls}`}>
                      {f.label}
                      <input name={f.id} type={f.type} defaultValue={state.values?.[f.id]} aria-invalid={!!state.errors?.[f.id]} className={inputCls} />
                      <Err m={state.errors?.[f.id]} />
                    </label>
                  ))}
                  <div className="field flex gap-3.5">
                    <label className={`flex-1 ${labelCls}`}>
                      Budget
                      <input name="budget" defaultValue={state.values?.budget} aria-invalid={!!state.errors?.budget} className={inputCls} />
                      <Err m={state.errors?.budget} />
                    </label>
                    <label className={`flex-1 ${labelCls}`}>
                      Délai
                      <input name="delai" defaultValue={state.values?.delai} aria-invalid={!!state.errors?.delai} className={inputCls} />
                      <Err m={state.errors?.delai} />
                    </label>
                  </div>
                  <label className={`field ${labelCls}`}>
                    Message
                    <textarea name="message" defaultValue={state.values?.message} aria-invalid={!!state.errors?.message} className={`${textareaCls} resize-none py-3`} />
                    <Err m={state.errors?.message} />
                  </label>
                </div>
                {state.message && (
                  <p role="alert" className="mt-3 text-sm font-bold text-[#C2370E]">{state.message}</p>
                )}
                <button type="submit" disabled={pending} className="submit mt-4 h-12 w-full rounded-full bg-[#141414] font-[family-name:var(--font-archivo)] text-base uppercase text-white disabled:opacity-60 md:mt-[clamp(10px,2vh,20px)] md:h-[clamp(40px,5.6vh,56px)]">
                  {pending ? "Envoi…" : "Envoyer"}
                </button>
              </>
            )}
          </form>
          <div className="glare pointer-events-none absolute inset-0 hidden overflow-hidden rounded-[6vh] md:block" aria-hidden>
            <div className="h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </div>
        </div>
      </div>

      {/* Grain argentique + vignette, par-dessus toute la scène */}
      <div className="pointer-events-none absolute inset-0 hidden opacity-[0.10] mix-blend-multiply md:block" style={{ backgroundImage: GRAIN }} aria-hidden />
      <div className="pointer-events-none absolute inset-0 hidden md:block" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.35) 100%)" }} aria-hidden />
    </section>
  );
}
