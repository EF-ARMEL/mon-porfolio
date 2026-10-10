"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizResult } from "@/lib/admin/quiz";

/* ───────────────────────── Quiz ───────────────────────── */

export function QuizTab({ initial }: { initial: QuizResult[] }) {
  const [results] = useState(initial);

  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center text-white/40">
        Aucune réussite au quiz pour l&apos;instant.
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-white/50">
        {results.length} personne(s) ont réussi la question secrète.
      </p>
      <ul className="flex flex-col gap-2">
        {results.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4"
          >
            <span className="min-w-0">
              {r.email ? (
                <a href={`mailto:${r.email}`} className="block truncate font-bold text-[#FF6A00] hover:underline">
                  {r.email}
                </a>
              ) : (
                <b className="block text-white/50">Anonyme</b>
              )}
              {r.answer && (
                <span className="mt-1 block truncate text-xs text-white/40">
                  Réponse : « {r.answer} »
                </span>
              )}
            </span>
            <span className="shrink-0 text-xs text-white/30">{r.createdAt}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ───────────────────────── Réglages ───────────────────────── */

export function SettingsTab({ initial }: { initial: boolean }) {
  const router = useRouter();
  const [maintenance, setMaintenance] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = async () => {
    const next = !maintenance;
    setMaintenance(next);
    setBusy(true);
    setSaved(false);
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintenance: next }),
      });
      setSaved(true);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="font-[family-name:var(--font-archivo)] text-xl uppercase">Réglages du site</h2>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <b className="block">Mode maintenance</b>
            <p className="mt-1 text-sm text-white/50">
              Active-le pour afficher une page « site en maintenance » aux visiteurs. Toi, connecté, garde
              l&apos;accès normal au site et à l&apos;admin.
            </p>
          </div>

          <button
            role="switch"
            aria-checked={maintenance}
            aria-label="Mode maintenance"
            onClick={toggle}
            disabled={busy}
            className={`relative h-8 w-14 shrink-0 cursor-pointer rounded-full transition-colors disabled:opacity-50 ${
              maintenance ? "bg-[#FF6A00]" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${
                maintenance ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <p
          className={`mt-4 text-xs font-bold uppercase tracking-wider ${
            maintenance ? "text-[#FF6A00]" : "text-emerald-400"
          }`}
        >
          {maintenance ? "⚠ Site en maintenance" : "✓ Site en ligne"}
        </p>
        {saved && <p className="mt-2 text-xs text-white/40">Réglage enregistré.</p>}
      </div>
    </div>
  );
}
