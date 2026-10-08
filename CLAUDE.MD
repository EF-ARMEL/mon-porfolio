@AGENTS.md
# Portfolio — Instructions Claude

## 1. Rôle de ce fichier

Ce fichier définit les règles générales que Claude Code doit respecter lorsqu'il travaille sur ce projet.

Il constitue le point d'entrée de la documentation du projet.

Les informations détaillées doivent être consultées dans les fichiers `docs/` appropriés.

---

## 2. Documentation du projet

Avant toute modification importante, consulter les documents pertinents dans `docs/`.

Documentation prévue :

* `docs/product.md` — vision, objectifs et fonctionnalités du portfolio
* `docs/design-system.md` — identité visuelle, couleurs, typographie et règles UI
* `docs/architecture.md` — architecture technique et organisation du code
* `docs/animations.md` — système d'animations, scroll et interactions
* `docs/3d.md` — stratégie et règles concernant la 3D
* `docs/content-structure.md` — structure et contenu des sections publiques
* `docs/admin.md` — fonctionnement du dashboard d'administration
* `docs/database.md` — modèle de données et persistance
* `docs/ai-workflow.md` — utilisation de l'IA dans le processus de développement
* `docs/decisions.md` — décisions techniques et design importantes

Ces fichiers constituent la documentation opérationnelle du portfolio.

---

## 3. Second Brain

Le Second Brain Obsidian constitue la mémoire générale du projet et de son propriétaire.

Lorsqu'une tâche concerne une connaissance susceptible d'exister dans le Second Brain, consulter les notes pertinentes avant de prendre une décision.

Domaines particulièrement importants :

* identité et profil ;
* design et UI/UX ;
* développement ;
* architecture ;
* bonnes pratiques ;
* animation ;
* projets précédents ;
* erreurs et solutions ;
* méthodes de travail ;
* utilisation de l'IA.

Ne pas supposer qu'une information est inconnue simplement parce qu'elle n'est pas présente dans le code du projet.

Lorsque le Second Brain contient une connaissance pertinente et vérifiée, l'utiliser comme contexte.

La documentation spécifique au portfolio dans `docs/` reste prioritaire pour les décisions propres à ce projet.

---

## 4. Principe de travail

Avant toute modification importante :

1. comprendre la demande ;
2. inspecter l'état réel du projet ;
3. consulter la documentation pertinente ;
4. consulter le Second Brain lorsque nécessaire ;
5. identifier les fichiers concernés ;
6. vérifier les dépendances et contraintes ;
7. poser une question uniquement si une information réellement bloquante manque ;
8. effectuer la modification ;
9. vérifier le résultat.

Ne pas modifier des fichiers sans avoir compris leur rôle.

Ne pas inventer l'état du projet.

Toujours vérifier l'état réel du code avant de prendre une décision technique.

---

## 5. Modifications du code

Privilégier les modifications ciblées.

Ne pas effectuer de refactorisation non demandée.

Ne pas modifier plusieurs parties du projet simplement pour "nettoyer" le code.

Ne pas remplacer une technologie existante sans raison documentée.

Ne pas créer de fichiers, composants, abstractions ou utilitaires qui ne sont pas nécessaires.

Éviter la duplication de logique.

Lorsqu'un composant, hook, utilitaire ou service existe déjà et répond au besoin, le réutiliser plutôt que créer un doublon.

---

## 6. Architecture

L'architecture doit rester :

* claire ;
* modulaire ;
* maintenable ;
* évolutive ;
* compréhensible par un développeur junior ;
* adaptée à la taille réelle du projet.

Ne pas introduire prématurément des patterns complexes.

Toute décision architecturale importante doit être cohérente avec `docs/architecture.md`.

Lorsqu'une décision modifie significativement l'architecture du projet, mettre à jour la documentation correspondante.

---

## 7. Développement

Le projet utilise principalement :

* Next.js ;
* React ;
* TypeScript ;
* Tailwind CSS.

Les versions réellement installées dans le projet font foi.

Ne jamais supposer une API ou un comportement de bibliothèque.

Pour les fonctionnalités sensibles aux versions, consulter la documentation officielle correspondante.

Privilégier :

* TypeScript strict ;
* composants réutilisables lorsque cela apporte une réelle valeur ;
* typage explicite des données importantes ;
* séparation claire entre présentation, logique et accès aux données ;
* gestion explicite des états de chargement, erreur et absence de données ;
* validation des données côté serveur lorsque nécessaire ;
* sécurité par défaut.

---

## 8. Design et UI/UX

Le portfolio est un projet fortement orienté expérience visuelle.

Le design ne doit pas ressembler à un template générique ou à une interface générée automatiquement.

Les décisions visuelles détaillées sont définies dans :

`docs/design-system.md`

Les règles concernant les animations sont définies dans :

`docs/animations.md`

Les règles concernant la 3D sont définies dans :

`docs/3d.md`

Toute nouvelle interface doit respecter l'identité visuelle existante.

Ne pas introduire arbitrairement :

* nouvelles couleurs principales ;
* nouvelles typographies ;
* nouveaux styles de boutons ;
* nouveaux systèmes de cartes ;
* nouvelles conventions d'espacement ;

sans vérifier leur cohérence avec le Design System.

---

## 9. Animation

Les animations doivent servir :

* la narration ;
* la hiérarchie visuelle ;
* la navigation ;
* la compréhension du contenu ;
* l'identité du portfolio.

Éviter les animations décoratives sans fonction.

Les animations complexes doivent être documentées dans `docs/animations.md`.

Toujours prendre en compte :

* performances ;
* responsive ;
* accessibilité ;
* préférence `prefers-reduced-motion`.

---

## 10. 3D

La 3D est utilisée comme élément d'expérience et non comme décoration systématique.

Toute implémentation 3D doit prendre en compte :

* performances ;
* poids des assets ;
* appareils moins puissants ;
* responsive ;
* accessibilité ;
* fallback lorsque la 3D ne peut pas être correctement rendue.

Les décisions concernant la 3D sont documentées dans `docs/3d.md`.

---

## 11. Responsive et accessibilité

Toute fonctionnalité ou interface doit être pensée pour :

* desktop ;
* tablette ;
* mobile.

Ne pas considérer le responsive comme une étape finale.

Respecter autant que possible :

* navigation clavier ;
* contraste ;
* structure sémantique ;
* labels accessibles ;
* alternatives aux contenus visuels importants ;
* `prefers-reduced-motion`.

---

## 12. Performance

Le portfolio doit rester performant malgré son orientation visuelle.

Éviter :

* JavaScript inutile côté client ;
* bibliothèques ajoutées sans nécessité ;
* images non optimisées ;
* assets 3D excessivement lourds ;
* animations provoquant des recalculs inutiles ;
* composants client lorsque le Server Component suffit.

Privilégier les capacités natives de Next.js lorsque cela est pertinent.

---

## 13. Dépendances

Ne jamais installer une bibliothèque uniquement parce qu'elle est populaire ou intéressante.

Avant d'ajouter une dépendance :

1. vérifier si Next.js, React ou une dépendance existante peut résoudre le problème ;
2. vérifier la documentation officielle ;
3. vérifier la compatibilité avec les versions actuelles du projet ;
4. vérifier l'impact sur les performances ;
5. vérifier si la bibliothèque apporte une vraie valeur.

Une dépendance importante doit avoir une raison claire.

---

## 14. MCP et outils

Utiliser les MCP disponibles lorsqu'ils apportent une valeur réelle à la tâche.

Priorité :

1. documentation officielle ;
2. outils spécialisés déjà disponibles ;
3. outils de vérification ;
4. solutions manuelles simples lorsque cela suffit.

Ne pas appeler inutilement plusieurs outils pour obtenir la même information.

Pour l'UI, utiliser les outils de design et de vérification disponibles lorsqu'ils sont pertinents.

Pour les tests visuels, utiliser Playwright lorsque cela est nécessaire.

---

## 15. Vérification

Après une modification significative, vérifier réellement le résultat.

Selon la nature de la modification, effectuer les vérifications pertinentes :

* TypeScript ;
* ESLint ;
* build ;
* tests ;
* navigateur ;
* responsive ;
* interaction ;
* animation ;
* console ;
* erreurs réseau.

Une modification ne doit pas être considérée comme terminée uniquement parce que le code semble correct.

---

## 16. Vérification visuelle

Pour les changements UI importants, vérifier le rendu réel dans le navigateur.

Ne pas se limiter à l'analyse du code.

Vérifier notamment :

* alignements ;
* espacements ;
* typographie ;
* contraste ;
* responsive ;
* animations ;
* débordements ;
* performances visuelles ;
* cohérence avec le Design System.

---

## 17. Gestion des erreurs

Lorsqu'une erreur apparaît :

1. identifier précisément l'erreur ;
2. déterminer sa cause ;
3. corriger la cause plutôt que masquer le symptôme ;
4. vérifier qu'aucune régression n'a été introduite ;
5. documenter la solution si elle est réutilisable ou importante.

Ne pas appliquer de corrections arbitraires sans comprendre la cause.

---

## 18. Documentation

Lorsqu'une décision importante est prise concernant :

* architecture ;
* design ;
* animation ;
* 3D ;
* technologie ;
* structure des données ;
* workflow ;

mettre à jour le fichier de documentation approprié.

Les décisions importantes doivent également être ajoutées à :

`docs/decisions.md`

lorsqu'elles peuvent avoir un impact futur sur le projet.

---

## 19. Code et commentaires

Écrire du code clair avant d'ajouter des commentaires.

Les commentaires doivent expliquer pourquoi une décision non évidente existe, et non simplement répéter ce que fait le code.

Éviter les commentaires inutiles.

---

## 20. Philosophie générale

Construire moins, mais mieux.

Chaque élément du portfolio doit avoir une raison d'exister.

Le projet doit combiner :

* identité personnelle ;
* qualité technique ;
* expérience utilisateur ;
* design distinctif ;
* animations maîtrisées ;
* utilisation pertinente de la 3D ;
* démonstration des compétences ;
* démonstration de la capacité à travailler avec l'IA.

Le résultat doit rester personnel, cohérent, maintenable et techniquement sérieux.

Ne jamais sacrifier la qualité du code uniquement pour obtenir un effet visuel.

Ne jamais sacrifier l'expérience utilisateur uniquement pour impressionner visuellement.

L'objectif est de construire une expérience cohérente où design, technologie, contenu et narration fonctionnent ensemble.
