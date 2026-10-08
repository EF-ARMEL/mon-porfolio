# Development — Standards de développement

## 1. Rôle du document

Ce document définit les règles générales de développement du portfolio.

Il complète :

* `CLAUDE.md` pour les règles globales de l'agent ;
* `docs/architecture.md` pour l'architecture ;
* `docs/design-system.md` pour l'interface ;
* `docs/animations.md` pour les animations ;
* `docs/security.md` pour la sécurité ;
* `docs/database.md` pour les données.

L'objectif est de conserver un code :

* compréhensible ;
* maintenable ;
* modulaire ;
* testable ;
* performant ;
* sécurisé ;
* évolutif.

---

# 2. Principe général

Le code doit être suffisamment simple pour être compris par un autre développeur.

Il faut éviter la complexité uniquement parce qu'une solution paraît plus avancée.

Principe :

> La meilleure solution est celle qui répond correctement au problème avec une complexité justifiée.

---

# 3. Stack principale

La stack principale prévue est :

* Next.js ;
* React ;
* TypeScript ;
* Tailwind CSS.

Technologies complémentaires selon les besoins :

* GSAP ;
* ScrollTrigger ;
* Lenis ;
* Three.js ;
* React Three Fiber ;
* Lucide React ;
* PostgreSQL ;
* ORM ;
* système d'authentification ;
* stockage média.

Une technologie complémentaire doit avoir une fonction claire.

---

# 4. TypeScript

TypeScript doit être utilisé comme outil de fiabilité.

Éviter autant que possible :

```ts
any
```

lorsqu'un type précis peut être défini.

Les types doivent être suffisamment explicites pour comprendre :

* données ;
* propriétés ;
* retours de fonctions ;
* paramètres ;
* états importants.

Il faut éviter les types inutilement complexes.

---

# 5. React

Les composants React doivent avoir une responsabilité claire.

Éviter les composants gigantesques contenant :

* affichage ;
* logique métier ;
* accès aux données ;
* animations ;
* gestion de formulaires ;
* logique d'administration ;

dans un seul fichier.

Lorsque cela devient nécessaire, séparer les responsabilités.

---

# 6. Server Components

Avec Next.js App Router, les Server Components doivent être privilégiés lorsque l'interactivité côté navigateur n'est pas nécessaire.

Un Client Component doit être utilisé lorsqu'il faut notamment :

* état React ;
* événement utilisateur ;
* API navigateur ;
* animation interactive ;
* interaction 3D ;
* hook nécessitant le client.

Ne pas ajouter `"use client"` automatiquement.

---

# 7. Client Components

Les Client Components doivent rester aussi ciblés que possible.

Exemple :

```text id="x6f8p2"
Page
 ├── contenu serveur
 ├── données serveur
 └── composant interactif client
```

Cela permet de limiter le JavaScript envoyé au navigateur.

---

# 8. Composants

L'organisation logique prévue est :

```text id="j3w8ks"
components/
├── ui/
├── layout/
├── sections/
├── animations/
└── 3d/
```

Cette organisation peut évoluer si le projet réel nécessite une structure différente.

Les composants doivent être regroupés selon leur responsabilité.

---

# 9. Composants UI

Les composants UI réutilisables doivent éviter de contenir une logique métier spécifique à une seule section.

Exemples :

* Button ;
* Input ;
* Modal ;
* Badge ;
* Card ;
* Tooltip ;
* Dialog.

Ils doivent rester suffisamment génériques.

---

# 10. Sections

Les sections représentent les grandes parties du portfolio.

Exemples :

```text
Hero
About
Journey
Projects
AIWorkflow
DeveloperChallenge
Skills
Knowledge
Dreams
Collaboration
Contact
```

Une section peut composer plusieurs composants plus petits.

---

# 11. Logique métier

La logique métier ne doit pas être dispersée dans les composants visuels.

Lorsque nécessaire, elle doit être déplacée vers des modules dédiés.

Exemples :

```text id="v9x2la"
lib/
actions/
hooks/
services/
```

Le choix exact dépendra de l'architecture finale.

---

# 12. Accès aux données

Les composants visuels ne doivent pas communiquer directement avec la base de données.

Flux attendu :

```text id="k8z1dn"
UI
 ↓
Action / Route / Server Function
 ↓
Data Access
 ↓
ORM
 ↓
PostgreSQL
```

Cela permet de séparer présentation et accès aux données.

---

# 13. Server Actions

Les Server Actions peuvent être utilisées pour les opérations adaptées.

Exemples :

* création de contenu ;
* modification ;
* suppression ;
* formulaire de contact ;
* actions administratives.

Chaque action doit :

* valider les données ;
* vérifier l'autorisation ;
* effectuer l'opération ;
* gérer les erreurs.

---

# 14. Route Handlers

Les Route Handlers peuvent être utilisés lorsqu'une API HTTP explicite est nécessaire.

Ils sont particulièrement utiles lorsque :

* une API externe est nécessaire ;
* un endpoint spécifique doit être exposé ;
* un webhook est nécessaire ;
* un client externe doit communiquer avec l'application.

Il ne faut pas créer des API routes uniquement par habitude.

---

# 15. Validation

Toute donnée externe doit être validée côté serveur.

La validation peut utiliser une bibliothèque dédiée si cela apporte une réelle valeur.

La validation doit être proche de la frontière où les données entrent dans le système.

---

# 16. Gestion des erreurs

Les erreurs doivent être traitées explicitement.

Une erreur ne doit pas être ignorée silencieusement.

Le système doit distinguer :

* erreur utilisateur ;
* erreur métier ;
* erreur réseau ;
* erreur serveur ;
* erreur inattendue.

L'utilisateur doit recevoir un message compréhensible.

Les informations techniques détaillées doivent rester côté serveur lorsque nécessaire.

---

# 17. Asynchronisme

Les opérations asynchrones doivent être gérées explicitement.

Exemples :

* requêtes base de données ;
* appels API ;
* uploads ;
* génération de contenu ;
* opérations externes.

Il faut prévoir les états :

```text
Loading
Success
Error
Empty
```

lorsqu'ils sont pertinents.

---

# 18. États UI

Les interfaces interactives doivent gérer les différents états nécessaires.

Exemple :

```text id="n2q7lc"
Initial
   ↓
Loading
   ↓
Success
   │
   └── Error
```

Un bouton d'action importante doit notamment éviter les doubles soumissions.

---

# 19. Formulaires

Les formulaires doivent être conçus pour :

* être compréhensibles ;
* fournir un feedback ;
* valider les données ;
* gérer les erreurs ;
* empêcher les soumissions accidentelles ;
* fonctionner au clavier ;
* rester accessibles.

Les formulaires publics et les formulaires administratifs doivent suivre les mêmes principes de fiabilité.

---

# 20. Tailwind CSS

Tailwind CSS doit être utilisé conformément au design system du projet.

Les valeurs doivent être cohérentes avec :

* palette ;
* typographie ;
* spacing ;
* radius ;
* responsive ;
* états interactifs.

Éviter les valeurs arbitraires répétées partout.

Lorsque plusieurs composants utilisent la même règle visuelle, elle doit être centralisée lorsque cela apporte une réelle valeur.

---

# 21. Responsive

Le responsive doit être pensé dès la conception.

Les interfaces doivent fonctionner au minimum sur :

* mobile ;
* tablette ;
* desktop.

Une expérience mobile ne doit pas être simplement une version réduite du desktop.

Les animations et la 3D peuvent être simplifiées sur mobile.

---

# 22. Accessibilité

L'accessibilité doit être prise en compte dès le développement.

Prévoir notamment :

* HTML sémantique ;
* navigation clavier ;
* focus visible ;
* labels ;
* contraste ;
* textes alternatifs ;
* boutons correctement identifiés ;
* support des préférences de mouvement réduit.

Les animations ne doivent pas rendre le contenu inutilisable.

---

# 23. Images

Les images doivent être optimisées.

Utiliser les mécanismes adaptés de Next.js lorsque pertinent.

Prévoir :

* dimensions ;
* formats modernes ;
* lazy loading ;
* qualité adaptée ;
* alt text ;
* responsive images.

---

# 24. Performance

La performance doit être considérée dès la conception.

Points importants :

* JavaScript envoyé au client ;
* taille des images ;
* 3D ;
* animations ;
* fonts ;
* requêtes réseau ;
* base de données ;
* cache ;
* chargement initial.

Une animation spectaculaire ne doit pas dégrader inutilement l'expérience.

---

# 25. Animations

Les animations complexes doivent respecter `docs/animations.md`.

Principe :

> Une animation doit avoir une intention.

Avant d'ajouter une animation, déterminer :

* ce qu'elle communique ;
* pourquoi elle existe ;
* quand elle se déclenche ;
* ce qui se passe sur mobile ;
* ce qui se passe avec `prefers-reduced-motion`.

---

# 26. 3D

La 3D doit respecter `docs/3d.md`.

Elle doit être utilisée lorsqu'elle renforce :

* le récit ;
* l'identité ;
* l'interaction ;
* la compréhension.

Elle ne doit pas être utilisée uniquement pour montrer qu'un projet utilise Three.js.

---

# 27. Dépendances

Avant d'ajouter une dépendance :

1. vérifier si la fonctionnalité existe déjà dans la stack ;
2. vérifier la documentation officielle ;
3. vérifier la compatibilité avec les versions utilisées ;
4. vérifier la maintenance ;
5. vérifier le coût en performance ;
6. vérifier la nécessité réelle.

Éviter les dépendances redondantes.

---

# 28. Documentation officielle

Pour les API sensibles aux versions, consulter les documentations officielles.

La version réellement installée dans le projet doit être prise en compte.

Il faut éviter d'implémenter une solution basée uniquement sur un tutoriel ancien.

---

# 29. MCP

Les MCP doivent être utilisés de manière ciblée.

Exemples :

* documentation ;
* recherche ;
* navigateur ;
* vérification visuelle ;
* icônes ;
* animation ;
* design ;
* base de données.

Ne pas multiplier les appels d'outils sans bénéfice concret.

---

# 30. Tests

Les fonctionnalités importantes doivent être testées.

Les tests peuvent couvrir :

* logique métier ;
* validation ;
* actions serveur ;
* accès aux données ;
* authentification ;
* autorisation ;
* formulaires ;
* parcours utilisateur.

Le niveau de test doit être proportionné au risque de la fonctionnalité.

---

# 31. Vérification visuelle

Pour les changements UI importants :

```text id="r5v8ja"
Modifier
   ↓
Lancer
   ↓
Observer
   ↓
Comparer au design
   ↓
Corriger
   ↓
Vérifier à nouveau
```

Une interface ne doit pas être considérée comme terminée uniquement parce que le code compile.

---

# 32. Playwright

Playwright peut être utilisé pour :

* navigation ;
* interactions ;
* formulaires ;
* captures ;
* responsive ;
* vérification visuelle ;
* parcours critiques.

Il doit être utilisé lorsqu'il apporte une valeur réelle.

---

# 33. Git

Les commits doivent être cohérents avec les changements effectués.

Éviter les commits contenant des modifications sans rapport.

Exemples :

```text
feat: add project management
fix: correct contact form validation
refactor: simplify project data access
docs: update architecture
```

Les conventions exactes pourront évoluer.

---

# 34. Refactoring

Le refactoring doit être ciblé.

Il est justifié lorsqu'il améliore réellement :

* lisibilité ;
* maintenabilité ;
* performance ;
* sécurité ;
* architecture.

Éviter les refactorings massifs pendant une tâche qui ne le nécessite pas.

---

# 35. Code mort

Le code inutilisé doit être supprimé lorsqu'il est identifié avec suffisamment de certitude.

Éviter de conserver :

* composants inutilisés ;
* fonctions mortes ;
* imports inutiles ;
* dépendances abandonnées ;
* anciennes implémentations non utilisées.

---

# 36. Nommage

Les noms doivent être explicites.

Privilégier :

```text
ProjectCard
ContactForm
getPublishedProjects
updateProject
```

plutôt que des noms vagues :

```text
Box
Data
Thing
handleStuff
```

Le nom doit aider à comprendre le rôle du code.

---

# 37. Commentaires

Les commentaires doivent expliquer pourquoi une décision existe lorsqu'elle n'est pas évidente.

Éviter les commentaires qui répètent simplement le code.

Mauvais principe :

```ts
// Incrémente i
i++;
```

Meilleur principe :

```ts
// Cette limite évite de charger trop de projets simultanément.
```

---

# 38. Configuration

Les configurations importantes doivent être centralisées lorsque cela améliore la cohérence.

Exemples :

* navigation ;
* metadata ;
* couleurs ;
* constantes ;
* limites ;
* configuration de services.

Éviter les valeurs critiques dispersées dans de nombreux fichiers.

---

# 39. SEO

Les pages publiques importantes doivent prévoir :

* title ;
* description ;
* metadata ;
* Open Graph lorsque pertinent ;
* structure sémantique ;
* URLs propres.

Le contenu public doit être correctement indexable lorsque cela correspond à l'objectif du portfolio.

---

# 40. Architecture évolutive

Le projet doit pouvoir évoluer sans être sur-architecturé dès le départ.

Il faut commencer avec une architecture adaptée aux besoins réels.

Lorsque le projet grandit :

```text
Besoin
 ↓
Observation
 ↓
Problème identifié
 ↓
Évolution de l'architecture
```

L'architecture doit évoluer en fonction des contraintes réelles.

---

# 41. Avant une implémentation

Avant de coder une fonctionnalité importante :

```text
1. Lire le besoin
2. Vérifier l'état réel du projet
3. Lire la documentation pertinente
4. Vérifier les décisions existantes
5. Identifier les fichiers concernés
6. Planifier la modification
7. Implémenter
8. Vérifier
```

Ne pas modifier des fichiers uniquement sur hypothèse.

---

# 42. Après une implémentation

Après une modification importante :

```text
Code
 ↓
Typecheck / lint
 ↓
Tests
 ↓
Build si nécessaire
 ↓
Vérification navigateur
 ↓
Correction
 ↓
Documentation si nécessaire
```

Le niveau de vérification doit être proportionnel à l'importance du changement.

---

# 43. Priorité de décision

Lorsqu'il existe plusieurs solutions, utiliser cette priorité :

```text
1. Correction
2. Sécurité
3. Compréhension
4. Maintenabilité
5. Performance
6. Évolutivité
7. Complexité minimale
```

Une solution techniquement impressionnante n'est pas automatiquement une meilleure solution.

---

# 44. Philosophie générale

Le portfolio doit être techniquement sérieux sans devenir inutilement complexe.

Le code doit permettre à un autre développeur de comprendre :

* où se trouve une fonctionnalité ;
* pourquoi elle fonctionne ainsi ;
* comment la modifier ;
* comment la tester ;
* quelles contraintes elle possède.

---

# 45. Principe final

Le développement du portfolio doit suivre cette logique :

```text
Comprendre
   ↓
Concevoir
   ↓
Implémenter
   ↓
Vérifier
   ↓
Améliorer
   ↓
Documenter
```

Le code est au service du produit.

La technologie est au service de l'expérience.

Et l'expérience est au service du contenu et de l'identité du portfolio.
