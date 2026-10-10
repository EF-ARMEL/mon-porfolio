"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectRecord } from "@/lib/admin/projects";
import type { Message } from "@/lib/admin/messages";
import type { QuizResult } from "@/lib/admin/quiz";
import { ProjectForm } from "./ProjectForm";
import { QuizTab, SettingsTab } from "./Tabs";

type Props = {
  initialProjects: ProjectRecord[];
  initialMessages: Message[];
  initialUnread: number;
  initialResults: QuizResult[];
  initialMaintenance: boolean;
};

type Tab = "messages" | "projects" | "quiz" | "settings";

const TABS: { key: Tab; label: string }[] = [
  { key: "messages", label: "Messages" },
  { key: "projects", label: "Projets" },
  { key: "quiz", label: "Quiz" },
  { key: "settings", label: "Réglages" },
];

export default function Dashboard(props: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("messages");
  const [unread, setUnread] = useState(props.initialUnread);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/nousdev/login");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#0a090f] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a090f]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-baseline gap-3">
            <span className="font-[family-name:var(--font-archivo)] text-xl uppercase leading-none">
              Admin
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-white/40">Nousdev</span>
          </div>
          <button
            onClick={logout}
            className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wider transition hover:border-[#FF6A00] hover:text-[#FF6A00]"
          >
            Déconnexion
          </button>
        </div>

        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5 pb-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition ${
                tab === t.key
                  ? "bg-[#FF6A00] text-black"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {t.label}
              {t.key === "messages" && unread > 0 && (
                <span
                  className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    tab === t.key ? "bg-black text-[#FF6A00]" : "bg-[#FF6A00] text-black"
                  }`}
                >
                  {unread}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        {tab === "messages" && <MessagesTab onUnreadChange={setUnread} initial={props.initialMessages} />}
        {tab === "projects" && <ProjectsTab initial={props.initialProjects} />}
        {tab === "quiz" && <QuizTab initial={props.initialResults} />}
        {tab === "settings" && <SettingsTab initial={props.initialMaintenance} />}
      </div>
    </main>
  );
}

/* ───────────────────────── Messages ───────────────────────── */

function MessagesTab({
  initial,
  onUnreadChange,
}: {
  initial: Message[];
  onUnreadChange: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [messages, setMessages] = useState(initial);
  const [open, setOpen] = useState<number | null>(null);

  const toggleRead = async (m: Message) => {
    const next = !m.isRead;
    setMessages((ms) => ms.map((x) => (x.id === m.id ? { ...x, isRead: next } : x)));
    onUnreadChange((n) => Math.max(0, n + (next ? 1 : -1)));
    await fetch(`/api/admin/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: next }),
    });
  };

  const remove = async (m: Message) => {
    if (!confirm(`Supprimer le message de ${m.nom} ?`)) return;
    setMessages((ms) => ms.filter((x) => x.id !== m.id));
    if (!m.isRead) onUnreadChange((n) => Math.max(0, n - 1));
    await fetch(`/api/admin/messages/${m.id}`, { method: "DELETE" });
  };

  if (messages.length === 0) {
    return <Empty label="Aucun message pour l'instant." />;
  }

  return (
    <ul className="flex flex-col gap-3">
      {messages.map((m) => (
        <li
          key={m.id}
          className={`rounded-2xl border transition ${
            m.isRead ? "border-white/10 bg-white/[0.02]" : "border-[#FF6A00]/50 bg-[#FF6A00]/[0.06]"
          }`}
        >
          <button
            onClick={() => setOpen(open === m.id ? null : m.id)}
            className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                {!m.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-[#FF6A00]" />}
                <b className="truncate">{m.nom}</b>
                <span className="shrink-0 text-xs text-white/40">· {m.projet}</span>
              </span>
              <span className="mt-1 block truncate text-sm text-white/50">{m.message}</span>
            </span>
            <span className="shrink-0 text-xs text-white/30">{m.createdAt}</span>
          </button>

          {open === m.id && (
            <div className="border-t border-white/10 px-5 pb-5 pt-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-4">
                <Field k="Email" v={m.email} link={`mailto:${m.email}`} />
                <Field k="Téléphone" v={m.tel} link={`tel:${m.tel}`} />
                <Field k="Budget" v={m.budget} />
                <Field k="Délai" v={m.delai} />
              </dl>
              <p className="mt-4 whitespace-pre-wrap rounded-xl bg-white/[0.03] p-4 leading-relaxed text-white/80">
                {m.message}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => toggleRead(m)}
                  className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wider transition hover:border-[#FF6A00] hover:text-[#FF6A00]"
                >
                  {m.isRead ? "Marquer non lu" : "Marquer lu"}
                </button>
                <button
                  onClick={() => remove(m)}
                  className="cursor-pointer rounded-full border border-[#ff4d4d]/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#ff6b6b] transition hover:bg-[#ff4d4d]/10"
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function Field({ k, v, link }: { k: string; v: string; link?: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{k}</dt>
      <dd className="mt-0.5 truncate">
        {link ? (
          <a href={link} className="text-[#FF6A00] hover:underline">
            {v}
          </a>
        ) : (
          v
        )}
      </dd>
    </div>
  );
}

/* ───────────────────────── Projets ───────────────────────── */

function ProjectsTab({ initial }: { initial: ProjectRecord[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initial);
  const [editing, setEditing] = useState<ProjectRecord | "new" | null>(null);

  const move = async (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= projects.length) return;
    const next = [...projects];
    [next[index], next[j]] = [next[j], next[index]];
    setProjects(next);
    await fetch(`/api/admin/projects/${next[j].id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((p) => p.id) }),
    });
    router.refresh();
  };

  const remove = async (p: ProjectRecord) => {
    if (!confirm(`Supprimer le projet « ${p.title} » ?`)) return;
    setProjects((ps) => ps.filter((x) => x.id !== p.id));
    await fetch(`/api/admin/projects/${p.id}`, { method: "DELETE" });
    router.refresh();
  };

  const saved = () => {
    setEditing(null);
    router.refresh();
    // Recharger la liste depuis le serveur après un rafraîchissement de route.
    fetch("/api/admin/projects", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => d?.projects && setProjects(d.projects))
      .catch(() => {});
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-white/50">{projects.length} projet(s)</p>
        <button
          onClick={() => setEditing("new")}
          className="cursor-pointer rounded-full bg-[#FF6A00] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black"
        >
          + Ajouter
        </button>
      </div>

      {projects.length === 0 ? (
        <Empty label="Aucun projet. Ajoute le premier." />
      ) : (
        <ul className="flex flex-col gap-3">
          {projects.map((p, i) => (
            <li
              key={p.id}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3"
            >
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-[family-name:var(--font-archivo)] text-sm"
                style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})`, color: "#000" }}
              >
                {p.id}
              </span>
              <span className="min-w-0 flex-1">
                <b className="block truncate">{p.title}</b>
                <span className="block truncate text-xs text-white/40">
                  {p.year} · {p.kicker}
                </span>
              </span>
              <span className="flex shrink-0 gap-1">
                <IconBtn label="Monter" disabled={i === 0} onClick={() => move(i, -1)}>
                  ↑
                </IconBtn>
                <IconBtn label="Descendre" disabled={i === projects.length - 1} onClick={() => move(i, 1)}>
                  ↓
                </IconBtn>
                <IconBtn label="Modifier" onClick={() => setEditing(p)}>
                  ✎
                </IconBtn>
                <IconBtn label="Supprimer" danger onClick={() => remove(p)}>
                  ✕
                </IconBtn>
              </span>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <ProjectForm
          project={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={saved}
        />
      )}
    </>
  );
}

/* (QuizTab et SettingsTab vivent dans ./Tabs.tsx) */

function IconBtn({
  children,
  onClick,
  disabled,
  danger,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-9 w-9 cursor-pointer place-items-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-30 ${
        danger
          ? "border-[#ff4d4d]/40 text-[#ff6b6b] hover:bg-[#ff4d4d]/10"
          : "border-white/15 hover:border-[#FF6A00] hover:text-[#FF6A00]"
      }`}
    >
      {children}
    </button>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center text-white/40">
      {label}
    </div>
  );
}
