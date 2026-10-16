"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProjectRecord } from "@/lib/admin/projects";

type Block = { title: string; desc: string };

/** Formulaire d'édition / création d'un projet. */
export function ProjectForm({
  project,
  onCancel,
  onSaved,
}: {
  project: ProjectRecord | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const isNew = project === null;
  const [f, setF] = useState(() => ({
    id: project?.id ?? "",
    title: project?.title ?? "",
    year: project?.year ?? String(new Date().getFullYear()),
    kicker: project?.kicker ?? "",
    tags: (project?.tags ?? []).join(", "),
    href: project?.href ?? "",
    image: project?.image ?? "",
    desc: project?.desc ?? "",
    status: project?.status ?? "",
    from: project?.from ?? "#7c3aed",
    to: project?.to ?? "#FF6A00",
    objective: project?.detail.objective ?? "",
    facts: (project?.detail.facts ?? []).join("\n"),
    blocks: project?.detail.blocks ?? [],
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);

  const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  const IMAGE_MAX = 5 * 1024 * 1024;

  /** Sélection locale → validation → envoi réel vers /api/admin/upload. */
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImgError(null);
    if (!IMAGE_TYPES.includes(file.type)) {
      setImgError("Format non supporté (JPG, PNG, WebP ou AVIF).");
      return;
    }
    if (file.size > IMAGE_MAX) {
      setImgError("Image trop lourde (5 Mo maximum).");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; path?: string; error?: string }
        | null;
      if (res.ok && data?.ok && data.path) {
        setF((s) => ({ ...s, image: data.path as string }));
        setImgError(null);
      } else {
        setImgError(
          data?.error === "too_large"
            ? "Image trop lourde (5 Mo maximum)."
            : data?.error === "unsupported_type"
              ? "Format non supporté (JPG, PNG, WebP ou AVIF)."
              : data?.error === "invalid_file"
                ? "Aucun fichier sélectionné."
                : data?.error === "write_failed"
                  ? "Impossible d'enregistrer le fichier. Vérifie les permissions du disque."
                  : "Échec de l'envoi de l'image. Réessaie."
        );
      }
    } catch {
      setImgError("Erreur réseau pendant l'envoi.");
    } finally {
      setUploading(false);
    }
  };

  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));
  const setBlock = (i: number, k: keyof Block, v: string) =>
    setF((s) => ({ ...s, blocks: s.blocks.map((b, j) => (j === i ? { ...b, [k]: v } : b)) }));

  const payload = () => ({
    id: f.id.trim(),
    title: f.title.trim(),
    year: f.year.trim(),
    kicker: f.kicker.trim(),
    tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
    href: f.href.trim() || undefined,
    image: f.image.trim() || undefined,
    desc: f.desc.trim() || undefined,
    status: f.status.trim() || undefined,
    from: f.from,
    to: f.to,
    detail: {
      objective: f.objective.trim(),
      blocks: f.blocks.filter((b) => b.title.trim() || b.desc.trim()),
      facts: f.facts.split("\n").map((t) => t.trim()).filter(Boolean),
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(isNew ? "/api/admin/projects" : `/api/admin/projects/${project.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) return onSaved();
      setError(
        data?.error === "duplicate_id"
          ? "Cet id existe déjà."
          : "Vérifie les champs (id, titre, année obligatoires)."
      );
    } catch {
      setError("Erreur réseau.");
    } finally {
      setBusy(false);
    }
  };

  const input =
    "mt-1 block w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF6A00]";
  const label = "block text-[11px] font-bold uppercase tracking-[0.15em] text-white/50";

  return (
    <div className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur">
      <form
        onSubmit={submit}
        className="mt-8 w-full max-w-2xl rounded-3xl border border-white/10 bg-[#12111a] p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-archivo)] text-xl uppercase">
            {isNew ? "Nouveau projet" : `Modifier · ${project.title}`}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Fermer"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-white/15"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className={label}>
            Id (01, 02…)
            <input
              value={f.id}
              onChange={(e) => set("id", e.target.value)}
              disabled={!isNew}
              className={`${input} disabled:opacity-50`}
            />
          </label>
          <label className={label}>
            Année
            <input value={f.year} onChange={(e) => set("year", e.target.value)} className={input} />
          </label>
          <label className={`${label} col-span-2`}>
            Titre
            <input value={f.title} onChange={(e) => set("title", e.target.value)} className={input} />
          </label>
          <label className={`${label} col-span-2`}>
            Kicker (sous-titre)
            <input value={f.kicker} onChange={(e) => set("kicker", e.target.value)} className={input} />
          </label>
          <label className={`${label} col-span-2`}>
            Tags (séparés par des virgules)
            <input value={f.tags} onChange={(e) => set("tags", e.target.value)} className={input} />
          </label>
          <label className={`${label} col-span-2`}>
            Lien (href) — vide = carte non cliquable
            <input value={f.href} onChange={(e) => set("href", e.target.value)} className={input} />
          </label>
          <div className={`${label} col-span-2`}>
            Image du projet
            <div className="mt-2 flex items-center gap-3">
              <span className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                {f.image ? (
                  <Image src={f.image} alt="" fill sizes="96px" className="object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-[10px] text-white/30">
                    Aucune
                  </span>
                )}
              </span>
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex gap-2">
                  <label className="inline-flex cursor-pointer items-center rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold hover:border-[#FF6A00] hover:text-[#FF6A00]">
                    {uploading ? "Envoi…" : f.image ? "Remplacer" : "Choisir une image"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                      onChange={onFile}
                      disabled={uploading}
                    />
                  </label>
                  {f.image && (
                    <button
                      type="button"
                      onClick={() => set("image", "")}
                      disabled={uploading}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-[#ff6b6b] hover:bg-[#ff4d4d]/10 disabled:opacity-50"
                    >
                      Retirer
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-white/40">JPG, PNG, WebP ou AVIF · 5 Mo max.</span>
                {imgError && (
                  <span role="alert" className="text-xs font-bold text-[#ff6b6b]">
                    {imgError}
                  </span>
                )}
              </div>
            </div>
          </div>
          <label className={`${label} col-span-2`}>
            Résumé (desc)
            <textarea
              value={f.desc}
              onChange={(e) => set("desc", e.target.value)}
              rows={2}
              className={`${input} resize-none`}
            />
          </label>
          <label className={label}>
            Badge (status) — vide = « En ligne »
            <input value={f.status} onChange={(e) => set("status", e.target.value)} className={input} />
          </label>
          <label className={label}>
            Objectif
            <input value={f.objective} onChange={(e) => set("objective", e.target.value)} className={input} />
          </label>
          <label className={label}>
            Couleur début
            <input value={f.from} onChange={(e) => set("from", e.target.value)} className={input} />
          </label>
          <label className={label}>
            Couleur fin
            <input value={f.to} onChange={(e) => set("to", e.target.value)} className={input} />
          </label>
          <label className={`${label} col-span-2`}>
            Fiche « Ce qu&apos;il faut savoir » (une par ligne)
            <textarea
              value={f.facts}
              onChange={(e) => set("facts", e.target.value)}
              rows={3}
              className={`${input} resize-none`}
            />
          </label>
        </div>

        {/* Blocs éditoriaux (title + desc) */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className={label}>Blocs</span>
            <button
              type="button"
              onClick={() => setF((s) => ({ ...s, blocks: [...s.blocks, { title: "", desc: "" }] }))}
              className="cursor-pointer rounded-full border border-white/15 px-3 py-1 text-xs font-bold hover:border-[#FF6A00] hover:text-[#FF6A00]"
            >
              + Bloc
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {f.blocks.map((b, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">#{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => setF((s) => ({ ...s, blocks: s.blocks.filter((_, j) => j !== i) }))}
                    className="cursor-pointer text-xs text-[#ff6b6b]"
                  >
                    Retirer
                  </button>
                </div>
                <input
                  value={b.title}
                  onChange={(e) => setBlock(i, "title", e.target.value)}
                  placeholder="Titre du bloc"
                  className={input}
                />
                <textarea
                  value={b.desc}
                  onChange={(e) => setBlock(i, "desc", e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className={`${input} mt-2 resize-none`}
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm font-bold text-[#ff6b6b]">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="h-11 flex-1 cursor-pointer rounded-full bg-[#FF6A00] font-bold uppercase tracking-wider text-black disabled:opacity-50"
          >
            {busy ? "Enregistrement…" : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="h-11 cursor-pointer rounded-full border border-white/20 px-6 font-bold uppercase tracking-wider"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
