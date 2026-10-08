# Decisions — Journal des décisions techniques et produit

## 1. Rôle du document

Ce document conserve les décisions importantes prises pendant la conception et le développement du portfolio.

Il permet de comprendre :

* quelle décision a été prise ;
* pourquoi elle a été prise ;
* quelles alternatives ont été considérées ;
* quelles conséquences elle entraîne ;
* si la décision peut évoluer plus tard.

Ce document ne doit pas contenir toutes les petites décisions de développement.

Il doit uniquement conserver les décisions qui peuvent avoir un impact important sur :

* architecture ;
* technologies ;
* design ;
* données ;
* sécurité ;
* expérience utilisateur ;
* performance ;
* organisation du projet.

---

# 2. Pourquoi conserver les décisions

Une décision technique peut sembler évidente plusieurs mois après avoir été prise.

Cependant, le contexte qui a conduit à cette décision peut être oublié.

Ce document permet donc de conserver le raisonnement.

Exemple :

```text
Pourquoi avons-nous choisi cette technologie ?

Pourquoi cette architecture ?

Pourquoi cette bibliothèque plutôt qu'une autre ?

Pourquoi cette fonctionnalité fonctionne-t-elle de cette manière ?
```

L'objectif n'est pas seulement de conserver le résultat.

Il faut conserver le raisonnement.

---

# 3. Format d'une décision

Chaque décision importante doit suivre une structure similaire :

```text
## ADR-XXX — Titre de la décision

### Date
YYYY-MM-DD

### Statut
Proposée / Acceptée / Remplacée / Abandonnée

### Contexte

Pourquoi cette décision est nécessaire.

### Décision

Ce qui a été choisi.

### Alternatives considérées

Les principales autres possibilités.

### Raisons

Pourquoi cette solution a été retenue.

### Conséquences

Ce que cette décision implique.

### Réévaluation

Dans quelles circonstances la décision pourrait être revue.
```

---

# 4. Statuts

Les décisions peuvent avoir plusieurs statuts :

### Proposée

La décision est encore en discussion.

### Acceptée

La décision a été validée et doit être appliquée.

### Remplacée

Une nouvelle décision a remplacé cette décision.

### Abandonnée

La décision n'est plus retenue.

---

# 5. Niveau de décision

Toutes les décisions ne nécessitent pas un enregistrement.

Une décision mérite généralement d'être enregistrée lorsqu'elle :

* influence plusieurs parties du projet ;
* est difficile à modifier plus tard ;
* concerne une technologie importante ;
* concerne l'architecture ;
* concerne la sécurité ;
* concerne la base de données ;
* influence fortement l'expérience utilisateur ;
* entraîne une dépendance importante ;
* possède plusieurs alternatives crédibles.

---

# 6. Décisions établies

Les décisions suivantes constituent la base actuelle du projet.

---

## ADR-001 — Next.js

### Date
2026-10-02

### Statut
Acceptée

### Contexte
Le portfolio doit être une application complète avec frontend public, backend, administration, contenu dynamique, gestion des messages, performances importantes, SEO et animations avancées.

### Décision
Utiliser **Next.js 16** avec l'**App Router**.

### Raisons
Permet de réunir dans une même application : React, rendu serveur (RSC), Server Actions, gestion optimisée des métadonnées et backend applicatif.

### Conséquences
L'architecture est basée sur l'App Router. La séparation entre Server Components et Client Components doit être rigoureusement maîtrisée.

---

## ADR-002 — React

### Date
2026-10-02

### Statut
Acceptée

### Contexte
Nécessité d'une interface fortement interactive et immersive.

### Décision
Utiliser **React 19**.

### Raisons
Compatibilité native avec Next.js 16. Utilisation du **React Compiler** pour réduire le besoin de mémoïsation manuelle (`useMemo`, `useCallback`).

### Conséquences
Organisation autour de composants React réutilisables et optimisés.

---

## ADR-003 — TypeScript

### Date
2026-10-02

### Statut
Acceptée

### Contexte
Projet multi-domaines (frontend, backend, DB, admin) nécessitant une fiabilité accrue.

### Décision
Utiliser **TypeScript en mode strict**.

### Raisons
Contrôle rigoureux des structures de données et des contrats entre les différentes couches de l'application.

### Conséquences
Typage explicite obligatoire pour toutes les données importantes. Interdiction de l'usage abusif de `any`.

---

## ADR-004 — Tailwind CSS

### Date
2026-10-02

### Statut
Acceptée

### Contexte
Besoin d'une identité visuelle personnalisée, performante et responsive.

### Décision
Utiliser **Tailwind CSS v4**.

### Raisons
Approche "CSS-first" simplifiée. Configuration via `@theme` directement dans le CSS, supprimant la lourdeur du fichier de configuration JS traditionnel.

### Conséquences
Styles gérés via `@import "tailwindcss"` et variables CSS natives.

---

## ADR-005 — GSAP + ScrollTrigger

### Date
2026-10-02

### Statut
Acceptée

### Contexte
Besoin d'animations de haute précision pour le storytelling au scroll et des séquences complexes.

### Décision
Utiliser **GSAP** avec le plugin **ScrollTrigger**.

### Raisons
Standard industriel pour les animations web haute performance. Contrôle total sur le timing, le pinning et les timelines.

### Conséquences
Utilisation du hook `@gsap/react` (`useGSAP`) pour garantir un nettoyage automatique des animations dans React 19.

---

## ADR-006 — Three.js / React Three Fiber

### Date
2026-10-02

### Statut
Acceptée

### Contexte
Volonté d'intégrer des expériences immersives en 3D.

### Décision
Utiliser **Three.js** via **React Three Fiber (R3F)**.

### Raisons
R3F permet d'intégrer la 3D de manière déclarative dans l'écosystème React, facilitant la maintenance et l'intégration avec le reste de l'UI.

### Conséquences
La 3D sera utilisée uniquement lorsque sa valeur ajoutée est justifiée. Isolation des composants 3D pour ne pas bloquer le rendu principal.

---

## ADR-007 — PostgreSQL

### Date
2026-10-02

### Statut
Acceptée

### Contexte
Besoin d'une base de données relationnelle robuste pour gérer les projets, compétences et messages.

### Décision
Utiliser **PostgreSQL**.

### Raisons
Fiabilité, support étendu des types de données et parfaite compatibilité avec les ORM modernes.

---

## ADR-008 — ORM

### Date
2026-10-02

### Statut
Acceptée

### Contexte
Choix d'une couche d'abstraction pour l'accès aux données PostgreSQL.

### Décision
Utiliser **Drizzle ORM** (retenu à la place de Prisma).

### Raisons
Drizzle offre une intégration TypeScript plus naturelle (types dérivés du schéma), un contrôle SQL plus fin et une absence de moteur runtime lourd (contrairement au binaire Rust de Prisma), ce qui le rend optimal pour les environnements serverless.

### Conséquences
Accès aux données via une API SQL-like typesafe. Moins de latence lors des cold starts.

---

## ADR-009 — Séparation Public / Admin

### Date
2026-10-02

### Statut
Acceptée

### Contexte
Nécessité de distinguer l'expérience visiteur de la gestion du contenu.

### Décision
Maintenir une séparation stricte entre le frontend public et le dashboard d'administration.

### Raisons
Sécurité accrue et optimisation des bundles (le code admin n'est pas chargé pour le visiteur).

---

## ADR-010 — Contenu administrable sans modification du code

### Date
2026-10-02

### Statut
Acceptée

### Contexte
Le propriétaire doit pouvoir mettre à jour son portfolio sans repasser par un cycle de déploiement.

### Décision
Toute donnée dynamique (projets, compétences, textes de sections) sera stockée en base de données et modifiable via l'admin.

### Raisons
Autonomie totale et rapidité de mise à jour.

---

## ADR-011 — IA sous contrôle humain

### Date
2026-10-02

### Statut
Acceptée

### Contexte
L'IA est utilisée pour accélérer le développement et enrichir le contenu.

### Décision
L'IA propose, l'humain valide. Aucune modification de code ou de contenu n'est poussée sans revue humaine.

### Raisons
Garantir la qualité technique, la cohérence du design et l'authenticité du portfolio.

---

## ADR-012 — Lenis

### Date
2026-10-02

### Statut
Acceptée (sous réserve de tests)

### Contexte
Amélioration de l'expérience de navigation via le smooth scrolling.

### Décision
Retenir **Lenis** comme option technique pour le smooth scrolling.

### Raisons
Légèreté et excellente intégration avec GSAP ScrollTrigger.

### Conséquences
L'utilisation effective sera validée par des tests de performance et d'intégration. Lenis ne sera pas considéré comme obligatoire si les tests montrent un impact négatif sur l'UX ou la performance.

---

# 7. Décisions encore ouvertes

## Authentification Admin
L'authentification pour l'espace administration reste à choisir.
- **Option étudiée** : Auth.js (v5).
- **Statut** : En cours d'évaluation.
