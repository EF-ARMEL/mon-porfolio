import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiPhp,
  SiLaravel,
  SiJavascript,
  SiThreedotjs,
  SiMysql,
  SiClaude,
} from "react-icons/si";

export type Tool = {
  id: string;
  name: string;
  /** Couleur officielle de la marque : utilisée dans la lentille, jamais sur le fond orange. */
  color: string;
  role: string;
  desc: string;
  Icon?: IconType;
  /** Logos sans icône react-icons : dessinés en SVG inline (voir StackLogo). */
  custom?: "gpt" | "anti";
};

/**
 * Pupitres de l'orchestre : la métaphore « chef d'orchestre » du site,
 * appliquée à la stack. Chaque pupitre regroupe une famille d'outils.
 */
export type Section = {
  id: string;
  label: string;
  family: string;
  tools: Tool[];
};

export const SECTIONS: Section[] = [
  {
    id: "front",
    label: "Les cordes",
    family: "Front",
    tools: [
      { id: "react", name: "React", color: "#61DAFB", Icon: SiReact, role: "Interfaces", desc: "Je découpe chaque écran en composants réutilisables : états, hooks, logique d'affichage propre." },
      { id: "next", name: "Next.js", color: "#FFFFFF", Icon: SiNextdotjs, role: "Framework web", desc: "App Router, rendu serveur et SEO : le cadre qui porte mes portfolios et mes sites." },
      { id: "js", name: "JavaScript", color: "#F7DF1E", Icon: SiJavascript, role: "Langage du web", desc: "Interactions, animations et logique côté navigateur : tout ce qui rend l'écran vivant." },
      { id: "three", name: "Three.js", color: "#FFFFFF", Icon: SiThreedotjs, role: "3D", desc: "Scènes, caméras et shaders pour des expériences immersives dans le navigateur." },
    ],
  },
  {
    id: "back",
    label: "Les cuivres",
    family: "Back",
    tools: [
      { id: "php", name: "PHP", color: "#8892BF", Icon: SiPhp, role: "Langage serveur", desc: "La logique métier qui tourne en coulisses : règles, calculs, traitements de données." },
      { id: "laravel", name: "Laravel", color: "#FF2D20", Icon: SiLaravel, role: "Backend", desc: "API, authentification, migrations et panneaux Filament : le moteur de mes applications." },
    ],
  },
  {
    id: "data",
    label: "Les percussions",
    family: "Data",
    tools: [
      { id: "mysql", name: "MySQL", color: "#00A3E0", Icon: SiMysql, role: "Base de données", desc: "Modélisation des tables, relations et requêtes : la mémoire durable des plateformes." },
    ],
  },
  {
    id: "ai",
    label: "Le chœur",
    family: "IA",
    tools: [
      { id: "claude", name: "Claude", color: "#D97757", Icon: SiClaude, role: "IA · code", desc: "Pair-programming au quotidien : architecture, refactor, revue et génération de composants." },
      { id: "gpt", name: "ChatGPT", color: "#74AA9C", custom: "gpt", role: "IA · idées", desc: "Brainstorming, rédaction et recherche rapide pour débloquer une idée ou un texte." },
      { id: "anti", name: "Antigravity", color: "#4285F4", custom: "anti", role: "IA · agent IDE", desc: "Un agent qui exécute des tâches de développement de bout en bout dans l'éditeur." },
    ],
  },
];

export const TOOL_COUNT = SECTIONS.reduce((n, s) => n + s.tools.length, 0);
