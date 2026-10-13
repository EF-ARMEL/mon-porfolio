"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const ERRORS: Record<string, string> = {
  invalid_credentials: "Mot de passe incorrect.",
  rate_limited: "Trop de tentatives. Réessaie dans quelques minutes.",
  email_failed: "L'envoi de l'e-mail a échoué. Réessaie dans un instant.",
  invalid_code: "Code incorrect. Vérifie l'e-mail et réessaie.",
  code_expired: "Ce code a expiré ou a déjà été utilisé — renvoie-en un nouveau.",
  code_locked: "Trop de tentatives avec ce code. Demande-en un nouveau.",
};

type LoginResponse = {
  ok?: boolean;
  error?: string;
  twoFactor?: boolean;
  challengeId?: string;
  email?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"password" | "code">("password");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const goToDashboard = () => {
    router.push("/nousdev");
    router.refresh();
  };

  /* Étape 1 : mot de passe (→ envoie un code si la2FA est active). */
  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => null)) as LoginResponse | null;
      if (res.ok && data?.ok) {
        if (data.twoFactor && data.challengeId) {
          setChallengeId(data.challengeId);
          setMaskedEmail(data.email ?? "");
          setStep("code");
          setCode("");
          return;
        }
        goToDashboard();
        return;
      }
      setError(ERRORS[data?.error ?? ""] ?? "Une erreur est survenue.");
    } catch {
      setError("Impossible de joindre le serveur.");
    } finally {
      setBusy(false);
    }
  };

  /* Étape 2 : vérification du code à6 chiffres reçu par e-mail. */
  const submitCode = async (value?: string) => {
    const c = (value ?? code).trim();
    if (busy || c.length !== 6 || !challengeId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId, code: c }),
      });
      const data = (await res.json().catch(() => null)) as LoginResponse | null;
      if (res.ok && data?.ok) {
        goToDashboard();
        return;
      }
      setError(ERRORS[data?.error ?? ""] ?? "Une erreur est survenue.");
      setCode("");
    } catch {
      setError("Impossible de joindre le serveur.");
    } finally {
      setBusy(false);
    }
  };

  const backToPassword = () => {
    setStep("password");
    setChallengeId(null);
    setCode("");
    setError(null);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a090f] px-5 text-white">
      <form
        onSubmit={step === "password" ? submitPassword : (e) => { e.preventDefault(); void submitCode(); }}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#12111a] p-8"
      >
        <span className="block text-xs font-bold uppercase tracking-[0.3em] text-[#FF6A00]">
          Espace privé
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-archivo)] text-3xl uppercase leading-none">
          {step === "password" ? "Connexion" : "Vérification"}
        </h1>

        {step === "password" ? (
          <>
            <label className="mt-8 block text-[11px] font-bold uppercase tracking-[0.15em] text-white/60">
              Mot de passe
              <span className="relative mt-2 block">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  autoFocus
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-2xl bg-[#ECE8DD] px-4 pr-12 text-base text-black outline-none focus:ring-2 focus:ring-[#FF6A00]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center text-black/50 transition hover:text-black"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            {error && (
              <p role="alert" className="mt-3 text-sm font-bold text-[#ff6b6b]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || password.length === 0}
              className="mt-6 h-12 w-full cursor-pointer rounded-full bg-[#FF6A00] font-[family-name:var(--font-archivo)] uppercase text-black transition disabled:opacity-50"
            >
              {busy ? "Vérification…" : "Entrer"}
            </button>
          </>
        ) : (
          <>
            <p className="mt-6 text-sm leading-relaxed text-white/60">
              Un code à6 chiffres vient d&apos;être envoyé à{" "}
              <b className="text-white">{maskedEmail || "ton adresse e-mail"}</b>. Il est valable
              10 minutes.
            </p>

            <label className="mt-6 block text-[11px] font-bold uppercase tracking-[0.15em] text-white/60">
              Code de vérification
              <input
                value={code}
                autoFocus
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="••••••"
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                  setCode(v);
                  if (v.length === 6) void submitCode(v);
                }}
                className="mt-2 h-14 w-full rounded-2xl bg-[#ECE8DD] text-center text-2xl font-bold tracking-[0.5em] text-black outline-none focus:ring-2 focus:ring-[#FF6A00]"
              />
            </label>

            {error && (
              <p role="alert" className="mt-3 text-sm font-bold text-[#ff6b6b]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || code.length !== 6}
              className="mt-6 h-12 w-full cursor-pointer rounded-full bg-[#FF6A00] font-[family-name:var(--font-archivo)] uppercase text-black transition disabled:opacity-50"
            >
              {busy ? "Vérification…" : "Vérifier"}
            </button>

            <button
              type="button"
              onClick={backToPassword}
              disabled={busy}
              className="mt-4 w-full cursor-pointer text-center text-xs font-bold uppercase tracking-wider text-white/40 transition hover:text-white disabled:opacity-50"
            >
              ← Retour — renvoyer un code
            </button>
          </>
        )}
      </form>
    </main>
  );
}
