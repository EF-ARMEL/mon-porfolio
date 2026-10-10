import { initDb, db } from "@/lib/db";
import type { DetailProject } from "@/components/projects/ProjectDetail";

/**
 * Accès aux projets du portfolio.
 * Chaque projet est stocké en JSON (champ `data`) pour coller au type
 * DetailProject utilisé par ProjectCabinet / ProjectDetail.
 */

export type ProjectRecord = DetailProject & { sortOrder: number };

/** Projets par défaut, seedés à la première initialisation de la DB. */
const SEED: DetailProject[] = [
  {
    id: "01",
    title: "WeGroup Immobilier",
    year: "2026",
    kicker: "Plateforme immobilière · WeGroup",
    tags: ["Laravel", "Tailwind", "Filament", "JavaScript"],
    href: "https://immobilier.we-group.online",
    image: "/projects/immobilier.png",
    desc: "Deux espaces : l'admin WeGroup crée les biens, suit les loyers et tient la compta ; le propriétaire suit ses biens, en soumet et y dépose ses documents officiels.",
    detail: {
      objective:
        "Permettre aux propriétaires de biens de prendre contact avec l'entreprise WeGroup pour la gestion de leur bien — de la mise en relation jusqu'au suivi comptable, tout en ligne.",
      blocks: [
        {
          title: "Espace Admin · WeGroup",
          desc: "L'agence crée et publie les biens, suit mois par mois si les locataires sont réglés, et tient la comptabilité de l'ensemble du parc géré.",
        },
        {
          title: "Espace Propriétaire",
          desc: "Le propriétaire suit l'état de ses biens, soumet de nouveaux biens à la gestion et envoie ses documents officiels directement à l'agence.",
        },
        {
          title: "Mise en relation",
          desc: "Un formulaire dédié capte la demande du propriétaire et la qualifie avant que l'agence ne prenne le relais.",
        },
      ],
      facts: ["Rôle — Conception & développement", "Statut — En ligne", "Année — 2026"],
    },
    from: "#0b2545",
    to: "#FF6A00",
  },
  {
    id: "02",
    title: "Propection",
    year: "2026",
    kicker: "CRM commercial · Laravel Breeze",
    tags: ["Laravel", "Breeze", "Tailwind", "GSAP", "JS"],
    image: "/projects/propection.png",
    desc: "Espace commercial : enregistrer ses prospects et les commenter en direct. Espace admin : les KPI de chaque agent, un par un.",
    status: "En construction",
    detail: {
      objective:
        "Faciliter les activités des commerciaux : un CRM clair où chaque agent structure sa prospection, et où l'entreprise pilote la performance agent par agent.",
      blocks: [
        {
          title: "Espace Agent commercial",
          desc: "Enregistrer ses prospects, consulter la totalité de son portefeuille en un coup d'œil et poser des commentaires dynamiques qui vivent avec chaque prospect.",
        },
        {
          title: "Espace Admin",
          desc: "Voir les KPI de chaque agent, un après les autres : activité, conversions et pipeline, pour piloter l'équipe sans tableur.",
        },
        {
          title: "Sécurité & authentification",
          desc: "Comptes isolés via Laravel Breeze : chaque agent ne voit que ses prospects, l'admin voit les tableaux de bord globaux.",
        },
      ],
      facts: ["Rôle — Conception & développement", "Statut — En construction", "Année — 2026"],
    },
    from: "#0f766e",
    to: "#FFD000",
  },
  {
    id: "03",
    title: "Vibe Coding",
    year: "2026",
    kicker: "Blog · Vibe coding & IA",
    tags: ["Blog", "Vibe coding", "IA"],
    desc: "Un blog sur les bonnes pratiques du vibe coding et l'usage de l'IA — écrit pour n'importe qui, développeur ou non.",
    detail: {
      objective:
        "Démocratiser le vibe coding : un blog sur les bonnes pratiques du développement assisté par IA, écrit pour n'importe qui — débutant curieux ou développeur confirmé.",
      blocks: [
        {
          title: "Les bonnes pratiques",
          desc: "Méthodes, réflexes et garde-fous pour coder avec l'IA sans perdre le contrôle de son projet ni de la qualité du code produit.",
        },
        {
          title: "L'usage de l'IA",
          desc: "Comment dialoguer efficacement avec les modèles, structurer ses prompts et intégrer l'IA à sa façon de travailler sans dépendance aveugle.",
        },
        {
          title: "Accessible à tous",
          desc: "Aucun prérequis : les articles s'adressent à quiconque veut construire avec l'IA, développeur ou pas.",
        },
      ],
      facts: ["Rôle — Conception éditoriale & développement", "Statut — En préparation", "Année — 2026"],
    },
    from: "#7c3aed",
    to: "#FF6A00",
  },
];

/** Insère les projets par défaut si la table est vide. */
export async function seedProjectsIfEmpty(): Promise<void> {
  await initDb();
  const rs = await db().execute("SELECT COUNT(*) AS n FROM projects");
  if (Number(rs.rows[0]?.n ?? 0) > 0) return;
  for (let i = 0; i < SEED.length; i++) {
    const p = SEED[i];
    await db().execute({
      sql: "INSERT INTO projects (id, sort_order, data) VALUES (?, ?, ?)",
      args: [p.id, i, JSON.stringify(p)],
    });
  }
}

/** Liste ordonnée de tous les projets (pour la page publique et l'admin). */
export async function listProjects(): Promise<ProjectRecord[]> {
  await initDb();
  const rs = await db().execute("SELECT data, sort_order FROM projects ORDER BY sort_order ASC");
  return rs.rows.map((row) => {
    const data = JSON.parse(String(row.data)) as DetailProject;
    return { ...data, sortOrder: Number(row.sort_order) };
  });
}

/** Récupère un projet par son id. */
export async function getProject(id: string): Promise<ProjectRecord | null> {
  await initDb();
  const rs = await db().execute({ sql: "SELECT data, sort_order FROM projects WHERE id = ?", args: [id] });
  const row = rs.rows[0];
  if (!row) return null;
  const data = JSON.parse(String(row.data)) as DetailProject;
  return { ...data, sortOrder: Number(row.sort_order) };
}

/** Crée un projet. L'id doit être unique. */
export async function createProject(data: DetailProject, sortOrder: number): Promise<void> {
  await initDb();
  await db().execute({
    sql: "INSERT INTO projects (id, sort_order, data) VALUES (?, ?, ?)",
    args: [data.id, sortOrder, JSON.stringify(data)],
  });
}

/** Met à jour le contenu ET l'ordre d'un projet. */
export async function updateProject(id: string, data: DetailProject, sortOrder: number): Promise<void> {
  await initDb();
  await db().execute({
    sql: "UPDATE projects SET data = ?, sort_order = ?, updated_at = datetime('now') WHERE id = ?",
    args: [JSON.stringify(data), sortOrder, id],
  });
}

/** Supprime un projet. */
export async function deleteProject(id: string): Promise<void> {
  await initDb();
  await db().execute({ sql: "DELETE FROM projects WHERE id = ?", args: [id] });
}
