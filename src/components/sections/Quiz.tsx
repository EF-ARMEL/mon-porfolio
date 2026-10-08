"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { QUESTIONS, type Track } from "@/data/quiz";
import { buildDeck, type Opt } from "@/lib/quiz/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LETTERS = "ABCD";
const VIOLET = "radial-gradient(120% 140% at 0% 0%,#8B5CF6,#4C1D95)";

async function api<T>(url: string, body: unknown): Promise<{ status: number; data: T | null }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => null)) as T | null;
    return { status: res.status, data };
  } catch {
    return { status: 0, data: null };
  }
}

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const FRAME =
  "flex shrink-0 grow-0 basis-[min(780px,80vw)] items-center rounded-2xl border border-white/[0.13] bg-[#0b0b0b] p-[clamp(20px,3vw,40px)]";
const OP =
  "flex w-full cursor-pointer items-center gap-[14px] rounded-[14px] border border-white/[0.13] px-[18px] py-[14px] text-left font-body text-[15px] font-semibold transition-[background,border-color,transform] duration-300 hover:translate-x-[6px] hover:border-[#8B5CF6] hover:bg-[#7C3AED33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFD000] max-md:px-[14px] max-md:py-[12px] max-md:text-sm";
const GOOD = "!border-transparent bg-gradient-to-r from-[#FF6A00] to-[#FFD000] !text-black";
const BAD = "!border-[#ff4d4d] !bg-[#ff4d4d33]";
const LABEL = "font-body text-xs font-semibold text-[#FFD000]";
const TITLE = "font-heading text-[clamp(1.5rem,3.2vw,2.8rem)] uppercase leading-[1.05]";
const MUTED = "font-body text-sm text-zinc-400";
const CTA = "cursor-pointer rounded-full bg-[#FFD000] px-[22px] py-3 font-body text-sm font-semibold text-black";
const FIELD =
  "min-w-0 flex-1 rounded-[10px] border border-white/[0.27] bg-black/40 px-[14px] font-body text-[15px] font-semibold text-white outline-none";

const Lock = ({ dim }: { dim?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width="34"
    height="34"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={dim ? "text-zinc-400" : "text-[#FFD000]"}
    aria-hidden
  >
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 018 0v3" />
  </svg>
);

const Perf = () => (
  <div
    aria-hidden
    className="h-[14px] flex-none rounded-[3px]"
    style={{ background: "repeating-linear-gradient(90deg,#ffffff18 0 18px,transparent 18px 34px)" }}
  />
);

/* ───────────────────────── Écran de départ ───────────────────────── */
function Start({ onPick }: { onPick: (t: Track) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const halves = useRef<(HTMLButtonElement | null)[]>([]);

  const grow = (k: number) =>
    halves.current.forEach(
      (h, j) => h && gsap.to(h, { flexGrow: k < 0 ? 1 : j === k ? 2.2 : 1, duration: 0.9, ease: "expo.out" })
    );

  useGSAP(
    () => {
      gsap.from(halves.current.filter(Boolean), { y: 70, opacity: 0, duration: 1.1, stagger: 0.12, ease: "expo.out" });
    },
    { scope: box }
  );

  const items: { track: Track; k: string; h: string; p: string; bg: React.CSSProperties }[] = [
    {
      track: "dev",
      k: "Parcours 01",
      h: "Je suis développeur",
      p: "5 questions techniques.",
      bg: {
        background:
          "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px) 0 0/48px 48px,linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px) 0 0/48px 48px,#0b0b0b",
      },
    },
    {
      track: "non",
      k: "Parcours 02",
      h: "Je ne suis pas dev",
      p: "5 questions pour curieux.",
      bg: { background: "radial-gradient(120% 140% at 100% 0%,#8B5CF6,#4C1D95 45%,#12062b)" },
    },
  ];

  return (
    <div ref={box} className="flex h-full gap-2 max-md:flex-col" onPointerLeave={() => grow(-1)}>
      {items.map((it, i) => (
        <button
          key={it.track}
          ref={(el) => {
            halves.current[i] = el;
          }}
          type="button"
          style={it.bg}
          onPointerEnter={(e) => e.pointerType === "mouse" && grow(i)}
          onFocus={() => grow(i)}
          onClick={() => onPick(it.track)}
          className="flex min-w-0 shrink grow basis-0 cursor-pointer flex-col justify-end overflow-hidden rounded-[20px] border border-white/10 p-[clamp(20px,3vw,40px)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFD000]"
        >
          <span className="mb-3 font-body text-xs font-semibold text-[#FFD000]">{it.k}</span>
          <h3 className="mb-2.5 font-heading text-[clamp(1.8rem,4vw,3.6rem)] uppercase leading-none tracking-[-0.02em]">
            {it.h}
          </h3>
          <p className="font-body text-white/80">{it.p}</p>
        </button>
      ))}
    </div>
  );
}

/* ───────────────────────── Une question ───────────────────────── */
function Question({
  i,
  q,
  opts,
  chosen,
  onPick,
}: {
  i: number;
  q: string;
  opts: Opt[];
  chosen: number | null;
  onPick: (k: number) => void;
}) {
  const answered = chosen !== null;
  return (
    <div className="w-full">
      <small className="mb-[14px] block font-body text-xs font-semibold text-brand-orange">
        Question 0{i + 1} / 05
      </small>
      <h3 className="mb-6 font-heading text-[clamp(1.2rem,2.5vw,2.3rem)] uppercase leading-[1.1]">{q}</h3>
      <div className={`grid grid-cols-1 gap-[10px] md:grid-cols-2 ${answered ? "pointer-events-none" : ""}`}>
        {opts.map((o, k) => {
          const state = answered && o.ok ? GOOD : chosen === k ? BAD : "";
          return (
            <button
              key={k}
              type="button"
              aria-disabled={answered}
              onClick={(e) => {
                if (answered) return;
                if (!o.ok) gsap.fromTo(e.currentTarget, { x: -8 }, { x: 0, duration: 0.6, ease: "elastic.out(1,.3)" });
                onPick(k);
              }}
              className={`${OP} ${state}`}
            >
              <i className={`w-[2ch] font-heading text-[13px] not-italic ${state === GOOD ? "text-black" : "text-[#FFD000]"}`}>
                {LETTERS[k]}
              </i>
              <span>{o.t}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── 6e image : la question secrète ───────────────────────── */
type Step = "idol" | "email" | "sent";

function Secret({ score, onAgain }: { score: number; onAgain: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const vault = useRef<HTMLDivElement>(null);
  const rev = useRef<HTMLDivElement>(null);
  const inp = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const hp = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("idol");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);
  const locked = score < 5;

  useGSAP(
    () => {
      if (box.current) gsap.from(box.current.children, { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: "expo.out" });
    },
    { dependencies: [step, locked], scope: box }
  );

  const open = (o: boolean) =>
    rev.current &&
    gsap.to(rev.current, {
      clipPath: o ? "inset(0 0% 0 0 round 14px)" : "inset(0 100% 0 0 round 14px)",
      duration: 0.7,
      ease: "expo.out",
    });

  const submitIdol = async () => {
    const answer = inp.current?.value.trim() ?? "";
    if (!answer || busy) return;
    setBusy(true);
    setMsg(null);
    const r = await api<{ ok: boolean; token?: string }>("/api/quiz/idol", { answer });
    setBusy(false);
    if (r.status === 429) return setMsg({ text: "Trop d'essais. Réessaie dans quelques minutes.", bad: true });
    if (r.data?.ok && r.data.token) {
      setToken(r.data.token);
      return setStep("email");
    }
    if (r.status === 0 || r.status >= 500) return setMsg({ text: "Une erreur est survenue. Réessaie.", bad: true });
    setMsg({ text: "Ce n'est pas lui… réessaie.", bad: true });
    gsap.fromTo(vault.current, { x: -10 }, { x: 0, duration: 0.6, ease: "elastic.out(1,.3)" });
  };

  const submitEmail = async () => {
    const email = emailRef.current?.value.trim() ?? "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setMsg({ text: "Entre une adresse e-mail valide.", bad: true });
      gsap.fromTo(emailRef.current, { x: -8 }, { duration: 0.5, ease: "elastic.out(1,.3)" });
      return;
    }
    if (busy) return;
    setBusy(true);
    setMsg(null);
    const r = await api<{ ok: boolean; error?: string }>("/api/quiz/reward", {
      email,
      token,
      website: hp.current?.value ?? "",
    });
    setBusy(false);
    if (r.data?.ok) return setStep("sent");
    if (r.data?.error === "invalid_token") {
      setToken("");
      setStep("idol");
      return setMsg({ text: "Session expirée : retente la question secrète.", bad: true });
    }
    const map: Record<string, string> = {
      already_used: "Cette récompense a déjà été envoyée.",
      rate_limited: "Trop de demandes. Réessaie plus tard.",
      mail_failed: "L'envoi a échoué. Réessaie dans un instant.",
    };
    setMsg({ text: map[r.data?.error ?? ""] ?? "Une erreur est survenue. Réessaie.", bad: true });
  };

  const note = (
    <p className={`min-h-[1em] ${MUTED} ${msg?.bad ? "!text-[#ff6b6b]" : ""}`}>{msg?.text}</p>
  );

  if (locked) {
    return (
      <div ref={box} className="flex w-full flex-col items-start gap-3">
        <Lock dim />
        <small className={LABEL}>Question secrète verrouillée</small>
        <h3 className={TITLE}>Score : {score}/5</h3>
        <p className={MUTED}>Elle se débloque avec un sans-faute. Retente ta chance.</p>
        <button type="button" onClick={onAgain} className={CTA}>
          Rejouer
        </button>
      </div>
    );
  }

  if (step === "sent") {
    return (
      <div ref={box} className="flex w-full flex-col items-start gap-3">
        <Lock />
        <small className={LABEL}>C&apos;est parti</small>
        <h3 className={TITLE}>Récompense envoyée.</h3>
        <p className={MUTED}>Vérifie ta boîte mail (et les spams) : le guide arrive en pièce jointe.</p>
      </div>
    );
  }

  if (step === "email") {
    return (
      <div ref={box} className="flex w-full flex-col items-start gap-3">
      <Lock />
      <small className={LABEL}>Bonne réponse</small>
      <h3 className={TITLE}>Tu connais bien Nousdev.</h3>
      <p className={MUTED}>
        Laisse ton e-mail : le guide « Bonnes pratiques du vibe coding en 2026 » t&apos;est envoyé.
      </p>
      <div
        className="flex w-[min(540px,100%)] items-center gap-2 rounded-[14px] p-2 max-md:flex-col max-md:items-stretch"
        style={{ background: VIOLET }}
      >
        <input
          ref={emailRef}
          type="email"
          placeholder="ton@email.com"
          autoComplete="email"
          onKeyDown={(e) => e.key === "Enter" && submitEmail()}
          className={`h-11 ${FIELD}`}
        />
        <input ref={hp} name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
        <button
        type="button"
        onClick={submitEmail}
        className="grid h-11 cursor-pointer place-items-center whitespace-nowrap rounded-full bg-[#FFD000] px-[18px] font-body text-sm font-semibold text-black"
        >
          {busy ? "Envoi…" : "Récupérer ma récompense"}
        </button>
      </div>
      {note}
    </div>
    );
  }

  return (
    <div ref={box} className="flex w-full flex-col items-start gap-3">
      <Lock />
      <small className={LABEL}>Sans-faute · question secrète débloquée</small>
      <h3 className={TITLE}>Qui est l&apos;idole de Nousdev ?</h3>
      <div
        ref={vault}
        onPointerEnter={() => open(true)}
        onClick={() => {
          open(true);
          inp.current?.focus();
        }}
        onPointerLeave={() => {
          if (document.activeElement !== inp.current && !inp.current?.value) open(false);
        }}
        className="relative h-14 w-[min(440px,100%)] cursor-pointer"
      >
        <div className="absolute inset-0 grid place-items-center rounded-[14px] border border-dashed border-[#FFD000] font-body text-[13px] font-semibold text-[#FFD000]">
          Survole pour répondre
        </div>
        <div
          ref={rev}
          style={{ clipPath: "inset(0 100% 0 0 round 14px)", background: VIOLET }}
          className="absolute inset-0 flex items-center gap-2 rounded-[14px] p-2"
        >
          <input
            ref={inp}
            placeholder="Son nom…"
            autoComplete="off"
            onFocus={() => open(true)}
            onBlur={() => {
              if (!inp.current?.value) open(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && submitIdol()}
            className={`h-full ${FIELD}`}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              submitIdol();
            }}
            className="grid h-full cursor-pointer place-items-center rounded-full bg-[#FFD000] px-[18px] font-body text-sm font-semibold text-black"
          >
            {busy ? "…" : "Valider"}
          </button>
        </div>
      </div>
      {msg ? note : <p className={MUTED}>Bonne réponse = le guide « Bonnes pratiques du vibe coding en 2026 ».</p>}
    </div>
  );
}

/* ───────────────────────── La pellicule ───────────────────────── */
function Film({ track, onAgain }: { track: Track; onAgain: () => void }) {
  const [deck] = useState(() => buildDeck(track, QUESTIONS[track]));
  const [choice, setChoice] = useState<(number | null)[]>(() => Array(5).fill(null));
  const [idx, setIdx] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const frames = useRef<(HTMLDivElement | null)[]>([]);
  const flash = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);
  const first = useRef(true);
  const timers = useRef<number[]>([]);

  const score = deck.reduce((n, opts, i) => n + (choice[i] !== null && opts[choice[i] as number].ok ? 1 : 0), 0);

  const xFor = (i: number) => {
    const f = frames.current[i];
    const st = stage.current;
    return f && st ? st.clientWidth / 2 - (f.offsetLeft + f.offsetWidth / 2) : 0;
  };

  useGSAP(
    () => {
      idxRef.current = idx;
      const t = first.current || reduced() ? 0 : 1.2;
      const move = (el: gsap.TweenTarget, vars: gsap.TweenVars, ease: string) =>
        t ? gsap.to(el, { ...vars, duration: t, ease }) : gsap.set(el, vars);

      move(strip.current, { x: xFor(idx) }, "expo.inOut");
      frames.current.forEach(
        (f, k) => f && move(f, { opacity: k === idx ? 1 : 0.25, scale: k === idx ? 1 : 0.88 }, "expo.out")
      );
    },
    { dependencies: [idx], scope: stage }
  );

  useGSAP(
    () => {
      if (!reduced()) gsap.from(stage.current, { opacity: 0, scale: 0.96, duration: 1.1, ease: "expo.out" });
    },
    { scope: stage }
  );

  useEffect(() => {
    const st = stage.current;
    if (!st) return;
    const ro = new ResizeObserver(() =>
      gsap.set(strip.current, { x: xFor(idxRef.current), overwrite: "auto" })
    );
    ro.observe(st);
    const pending = timers.current;
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const pick = (i: number, k: number) => {
    if (choice[i] !== null) return;
    setChoice((c) => c.map((v, j) => (j === i ? k : v)));
    timers.current.push(
      window.setTimeout(() => {
        if (!reduced()) gsap.fromTo(flash.current, { opacity: 0.55 }, { opacity: 0, duration: 0.6 });
        setIdx(i + 1);
      }, 1000)
    );
  };

  return (
    <div ref={stage} className="relative flex h-full flex-col justify-center gap-[18px] overflow-hidden">
      <Perf />
      <div ref={strip} className="relative flex w-max gap-6">
        {deck.map((opts, i) => (
          <div
          key={i}
          ref={(el) => {
            frames.current[i] = el;
          }}
          className={FRAME}
          >
            <Question i={i} q={QUESTIONS[track][i].q} opts={opts} chosen={choice[i]} onPick={(k) => pick(i, k)} />
          </div>
        ))}
        <div
          ref={(el) => {
            frames.current[5] = el;
          }}
          className={FRAME}
        >
          {idx === 5 && <Secret score={score} onAgain={onAgain} />}
        </div>
      </div>
      <Perf />
      <div ref={flash} aria-hidden className="pointer-events-none absolute inset-0 z-[5] bg-white opacity-0" />
    </div>
  );
}

/* ───────────────────────── Section ───────────────────────── */
export default function Quiz() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [run, setRun] = useState(0);

  useGSAP(
    () => {
      if (!root.current || reduced()) return;
      const lines = gsap.utils.toArray<HTMLElement>(".qz-line", root.current);
      gsap.set(lines, { yPercent: 110 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "clamp(top 70%)", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="quiz" className="relative w-full overflow-x-clip bg-black px-[5vw] py-[12vh] text-white">
      <header className="mb-[4vh]">
        <span className="mb-4 block font-body text-xs font-semibold text-brand-orange">{t("quiz.eyebrow", "Quiz")}</span>
        <h2 className="font-heading text-[clamp(2.4rem,7vw,6.2rem)] uppercase leading-[0.95] tracking-tighter">
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="qz-line block">{t("quiz.title_1", "Dev ou pas,")}</span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="qz-line block bg-gradient-to-r from-[#FF6A00] to-[#FFD000] bg-clip-text text-transparent">
              {t("quiz.title_2", "teste-toi.")}
            </span>
          </span>
        </h2>
      </header>

      <div className="relative h-[min(74vh,720px)] min-h-[520px] max-md:h-[82vh]">
        {track ? (
          <Film key={`${track}-${run}`} track={track} onAgain={() => setRun((r) => r + 1)} />
        ) : (
          <Start onPick={setTrack} />
        )}
      </div>
    </section>
  );
}
