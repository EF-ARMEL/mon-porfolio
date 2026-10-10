"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const ERRORS: Record<string, string> = {
  invalid_credentials: "Mot de passe incorrect.",
  rate_limited: "Trop de tentatives. Réessaie dans quelques minutes.",
};

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
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
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) {
        router.push("/nousdev");
        router.refresh();
        return;
      }
      setError(ERRORS[data?.error ?? ""] ?? "Une erreur est survenue.");
    } catch {
      setError("Impossible de joindre le serveur.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a090f] px-5 text-white">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#12111a] p-8"
      >
        <span className="block text-xs font-bold uppercase tracking-[0.3em] text-[#FF6A00]">
          Espace privé
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-archivo)] text-3xl uppercase leading-none">
          Connexion
        </h1>

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
      </form>
    </main>
  );
}
