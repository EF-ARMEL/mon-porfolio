export type Track = "dev" | "non";

/** answers[0] est TOUJOURS la bonne réponse : l'ordre est mélangé à l'affichage. */
export type Question = { q: string; answers: [string, string, string, string] };

export const QUESTIONS: Record<Track, Question[]> = {
  dev: [
    {
      q: "Que fait useEffect(fn, []) dans React ?",
      answers: [
        "Il exécute l'effet une seule fois, après le premier rendu",
        "Il exécute l'effet à chaque rendu",
        "Il bloque le rendu tant que l'effet n'est pas fini",
        "Il crée un nouvel état local",
      ],
    },
    {
      q: "Si une promesse échoue dans Promise.all([...]), que se passe-t-il ?",
      answers: [
        "Le tout est rejeté immédiatement avec la première erreur",
        "Les autres promesses sont annulées sans erreur",
        "Un tableau d'erreurs est renvoyé à la fin",
        "L'échec est ignoré et le reste continue",
      ],
    },
    {
      q: "Dans Laravel, quelle technique règle le problème des requêtes N+1 ?",
      answers: ["L'eager loading avec with()", "Le middleware auth", "Les files d'attente (queues)", "Les migrations"],
    },
    {
      q: "Que désigne le « vibe coding » ?",
      answers: [
        "Décrire son intention à une IA et itérer sur le code généré",
        "Coder avec de la musique pour rester concentré",
        "Coder sans jamais écrire de tests",
        "Un framework CSS à la mode",
      ],
    },
    {
      q: "Quelle commande Git annule un commit déjà poussé sans réécrire l'historique ?",
      answers: ["git revert", "git reset --hard", "git rebase -i", "git commit --amend"],
    },
  ],
  non: [
    {
      q: "Un site « responsive », c'est un site qui…",
      answers: [
        "s'adapte à la taille de l'écran",
        "se charge très vite",
        "est protégé contre les pirates",
        "fonctionne sans internet",
      ],
    },
    {
      q: "Que signifie le cadenas HTTPS dans la barre d'adresse ?",
      answers: [
        "La connexion avec le site est chiffrée",
        "Le site est officiel à 100 %",
        "Le site est gratuit",
        "Le site n'a pas de publicité",
      ],
    },
    {
      q: "Une IA comme Claude ou ChatGPT, c'est avant tout…",
      answers: [
        "Un modèle qui génère du texte à partir de ce qu'on lui demande",
        "Une personne qui répond en direct",
        "Un moteur de recherche classique",
        "Une base de réponses toutes faites",
      ],
    },
    {
      q: "Que désigne le « vibe coding » ?",
      answers: [
        "Créer un logiciel en expliquant ce qu'on veut à une IA",
        "Programmer en écoutant de la musique",
        "Un type d'ordinateur ultra rapide",
        "Un langage réservé aux experts",
      ],
    },
    {
      q: "À quoi sert une base de données ?",
      answers: [
        "Stocker et retrouver des informations de façon organisée",
        "Accélérer la connexion internet",
        "Dessiner les pages d'un site",
        "Protéger l'ordinateur des virus",
      ],
    },
  ],
};
