# Portfolio — Architecture Technique

## 1. Objectif

Ce document définit l'architecture technique du portfolio.

Il décrit :

* l'organisation générale de l'application ;
* les responsabilités des différentes couches ;
* le frontend ;
* le backend ;
* l'administration ;
* la gestion des données ;
* l'authentification ;
* les API ;
* les composants ;
* les services ;
* la communication entre les différentes parties du système.

L'architecture doit rester suffisamment simple pour être comprise et maintenue par un développeur junior, tout en permettant au projet d'évoluer.

---

# 2. Stack principale

La stack principale prévue est :

* Next.js
* React
* TypeScript
* Tailwind CSS

Technologies complémentaires prévues selon les besoins :

* GSAP + ScrollTrigger pour les animations complexes ;
* Lenis pour le smooth scrolling si nécessaire ;
* React Three Fiber / Three.js pour les expériences immersives ;
* Lucide React pour les icônes ;
* PostgreSQL pour la base de données ;
* ORM à déterminer entre Prisma et Drizzle ;
* solution d'authentification adaptée à Next.js ;
* solution de stockage d'images adaptée aux besoins du projet.

Les versions réellement installées dans le projet font foi.

Avant d'ajouter une technologie, vérifier si elle est réellement nécessaire.

---

# 3. Architecture générale

L'application doit être pensée comme une application web complète :

```text
Visiteur
   │
   ▼
Frontend public
   │
   ├── Contenu du portfolio
   ├── Projets
   ├── Compétences
   ├── IA
   ├── Défi développeur
   └── Contact
          │
          ▼
       Backend
          │
          ├── Validation
          ├── Logique métier
          ├── Authentification
          └── Accès aux données
                 │
                 ▼
              Base de données

Administrateur
   │
   ▼
Dashboard Admin
   │
   ▼
Backend
   │
   ▼
Base de données
```

Le frontend public et l'administration utilisent la même application mais possèdent des responsabilités différentes.

---

# 4. Next.js

Next.js constitue le framework principal de l'application.

L'App Router doit être utilisé.

L'application doit exploiter lorsque cela est pertinent :

* Server Components ;
* Client Components uniquement lorsque nécessaires ;
* Server Actions lorsque pertinentes ;
* Route Handlers pour les endpoints nécessitant une API ;
* métadonnées ;
* optimisation des images ;
* chargement serveur des données ;
* capacités natives de Next.js.

Ne pas transformer toute l'application en Client Components.

---

# 5. Organisation logique

L'application doit être organisée autour de responsabilités claires.

Structure cible indicative :

```text
app/
components/
lib/
actions/
hooks/
types/
config/
public/
prisma/ ou database/
docs/
tests/
```

Cette structure pourra évoluer selon les besoins réels.

Ne pas créer automatiquement tous les dossiers avant qu'ils soient nécessaires.

---

# 6. Frontend public

Le frontend public contient l'expérience accessible aux visiteurs.

Il comprend notamment :

* Hero ;
* About ;
* Journey ;
* Projects ;
* AI × Development ;
* Developer Challenge ;
* Skills ;
* Knowledge ;
* Dreams / Future ;
* Collaboration ;
* Contact.

Les sections doivent être composées de composants réutilisables lorsque cela apporte une réelle valeur.

Les composants spécifiques à une section peuvent rester proches de leur domaine.

---

# 7. Composants

Les composants doivent être organisés selon leur responsabilité.

Exemple :

```text
components/
├── ui/
├── layout/
├── sections/
├── animations/
└── 3d/
```

### `ui/`

Contient les composants génériques réutilisables :

* Button ;
* Input ;
* Modal ;
* Badge ;
* Dialog ;
* etc.

### `layout/`

Contient les éléments structurels :

* Header ;
* Navigation ;
* Footer ;
* containers ;
* wrappers.

### `sections/`

Contient les composants propres aux grandes sections du portfolio.

### `animations/`

Contient uniquement les abstractions d'animation réellement réutilisées.

### `3d/`

Contient les composants et systèmes spécifiques à la 3D.

Ne pas créer une abstraction simplement pour déplacer quelques lignes de code.

---

# 8. Server Components et Client Components

Par défaut, privilégier les Server Components.

Utiliser `"use client"` uniquement lorsqu'une fonctionnalité nécessite :

* état React côté client ;
* événements navigateur ;
* API navigateur ;
* animation interactive ;
* WebGL / Canvas ;
* interaction utilisateur complexe.

Ne pas ajouter `"use client"` par habitude.

---

# 9. Backend

Le backend doit être intégré à l'application Next.js lorsque cela est pertinent.

Il sera responsable notamment de :

* validation des données ;
* logique métier ;
* accès à la base de données ;
* authentification ;
* autorisation ;
* gestion des messages ;
* gestion du contenu administrable ;
* gestion des projets ;
* opérations CRUD.

Le frontend ne doit pas accéder directement à la base de données.

---

# 10. Couche d'accès aux données

Les composants React ne doivent pas contenir directement la logique complexe d'accès aux données.

La logique d'accès aux données doit être centralisée dans une couche appropriée.

Exemple :

```text
UI
 ↓
Server Action / Route Handler
 ↓
Service / Data Access
 ↓
ORM
 ↓
Database
```

La structure exacte sera adaptée au choix final de l'ORM.

---

# 11. Server Actions

Les Server Actions peuvent être utilisées pour les opérations internes de l'application lorsque cela simplifie l'architecture.

Exemples :

* créer un message ;
* modifier un projet ;
* publier un projet ;
* modifier une compétence ;
* modifier un contenu administrable.

Elles ne doivent pas être utilisées lorsque la création d'une API publique ou d'un endpoint dédié est plus appropriée.

---

# 12. API

Les Route Handlers de Next.js peuvent être utilisés lorsque l'application nécessite des endpoints HTTP.

Exemples possibles :

```text
/api/contact
/api/projects
/api/admin/...
```

Les endpoints doivent :

* valider les entrées ;
* gérer les erreurs ;
* vérifier les permissions lorsque nécessaire ;
* retourner des réponses cohérentes ;
* ne jamais exposer des données sensibles.

---

# 13. Validation

Toutes les données provenant de l'utilisateur doivent être considérées comme non fiables.

La validation doit être effectuée côté serveur.

Cela concerne notamment :

* formulaire de contact ;
* authentification ;
* données administratives ;
* upload de fichiers ;
* paramètres d'API.

Une validation côté client peut améliorer l'expérience utilisateur, mais ne remplace jamais la validation serveur.

---

# 14. Base de données

La base de données doit être relationnelle.

PostgreSQL est prévu comme choix principal.

Elle pourra stocker notamment :

```text
Admin / User
Projects
Project Technologies
Skills
Knowledge
Portfolio Sections
Developer Questions
Contact Messages
Site Settings
```

Le modèle exact sera défini dans :

`docs/database.md`

Ne pas créer les tables avant d'avoir défini clairement les besoins fonctionnels.

---

# 15. ORM

Un ORM sera utilisé pour communiquer avec PostgreSQL.

Deux options initiales :

* Prisma ;
* Drizzle.

Le choix définitif doit être fait après comparaison des besoins du projet.

Une seule solution doit être retenue.

Ne pas installer Prisma et Drizzle simultanément sans raison.

---

# 16. Administration

Le dashboard admin est une interface privée.

Il doit permettre de gérer le contenu sans modifier directement le code source.

Fonctionnalités prévues :

* authentification ;
* dashboard ;
* projets ;
* compétences ;
* sections ;
* contenu IA ;
* questions ;
* rêves ;
* messages ;
* paramètres.

Le dashboard doit privilégier :

* clarté ;
* efficacité ;
* lisibilité ;
* formulaires simples ;
* tableaux lorsque pertinents ;
* confirmations pour les actions destructives.

Le dashboard n'a pas besoin de reproduire l'expérience visuelle expérimentale du frontend public.

---

# 17. Authentification

L'accès à l'administration doit être protégé.

Les visiteurs publics ne doivent jamais pouvoir accéder aux fonctionnalités administratives.

Le système doit distinguer au minimum :

```text
Visiteur
Administrateur
```

L'autorisation doit être vérifiée côté serveur.

Ne jamais considérer une simple protection visuelle côté frontend comme une mesure de sécurité.

---

# 18. Autorisation

Toute opération administrative doit être protégée côté serveur.

Exemples :

* créer un projet ;
* supprimer un projet ;
* modifier une compétence ;
* lire les messages ;
* modifier les paramètres.

Le serveur doit vérifier l'identité et les permissions avant d'exécuter l'opération.

---

# 19. Contact

Le formulaire public suit le flux :

```text
Visiteur
   ↓
Formulaire
   ↓
Validation client
   ↓
Validation serveur
   ↓
Backend
   ↓
Base de données
   ↓
Message visible dans l'administration
```

Les données sensibles ne doivent pas être exposées publiquement.

Une protection contre les abus devra être prévue selon les besoins :

* rate limiting ;
* anti-spam ;
* validation ;
* éventuellement CAPTCHA ou solution équivalente.

---

# 20. Gestion des médias

Les images et autres médias doivent être séparés de la logique métier.

Les fichiers peuvent être :

* stockés localement pendant le développement ;
* stockés sur une solution externe adaptée en production.

La stratégie définitive doit prendre en compte :

* taille ;
* performance ;
* sauvegarde ;
* coût ;
* facilité d'administration.

---

# 21. 3D

La 3D sera principalement gérée côté client lorsque nécessaire.

Technologies possibles :

* Three.js ;
* React Three Fiber.

Les composants visuels doivent être isolés des composants classiques lorsque cela améliore la maintenabilité.

La dimension visuelle ne doit pas bloquer le rendu principal du site.

Les détails sont définis dans :

`docs/3d.md`

---

# 22. Animations

Les animations complexes doivent être isolées de la logique métier.

GSAP et ScrollTrigger peuvent être utilisés pour :

* scroll storytelling ;
* pinning ;
* timelines ;
* transitions complexes ;
* animations séquencées.

Les détails sont définis dans :

`docs/animations.md`

---

# 23. État global

Ne pas introduire de gestionnaire d'état global tant qu'il n'existe pas de besoin réel.

Privilégier :

* état local React ;
* URL ;
* Server Components ;
* Server Actions ;
* données serveur ;

lorsque cela suffit.

Une solution de state management globale ne doit être ajoutée que si la complexité du projet le justifie.

---

# 24. Sécurité

Les principes suivants sont obligatoires :

* validation serveur ;
* authentification sécurisée ;
* autorisation serveur ;
* protection des routes admin ;
* secrets uniquement côté serveur ;
* variables sensibles dans `.env` ;
* aucune clé secrète dans le frontend ;
* validation des uploads ;
* protection contre les injections ;
* protection contre les abus du formulaire de contact.

Ne jamais exposer :

* mots de passe ;
* tokens privés ;
* clés API secrètes ;
* variables serveur sensibles.

---

# 25. Environnement

Les variables d'environnement doivent être séparées selon leur nature.

Exemple :

```text
.env.local
```

Les secrets ne doivent jamais être commités dans Git.

Un fichier d'exemple peut être fourni :

```text
.env.example
```

sans valeurs secrètes.

---

# 26. Git

Le projet doit être versionné avec Git.

Le dépôt doit notamment ignorer :

```text
node_modules/
.next/
.env*
```

à l'exception éventuelle de :

```text
.env.example
```

Les commits doivent correspondre à des changements compréhensibles.

Ne pas mélanger plusieurs fonctionnalités sans rapport dans un même changement lorsque cela nuit à la lisibilité de l'historique.

---

# 27. Tests

Les fonctionnalités importantes doivent pouvoir être vérifiées.

Selon la nature du code :

* tests unitaires ;
* tests d'intégration ;
* tests de validation ;
* tests end-to-end ;
* tests visuels.

Les flux critiques doivent notamment être vérifiés :

* contact ;
* authentification admin ;
* CRUD projets ;
* permissions ;
* navigation principale.

---

# 28. Vérification navigateur

Playwright doit être utilisé lorsque cela est pertinent pour vérifier :

* navigation ;
* formulaires ;
* responsive ;
* interactions ;
* animations ;
* erreurs console ;
* parcours utilisateur.

Le code ne doit pas être considéré comme terminé simplement parce que le build passe.

---

# 29. Performance

L'architecture doit favoriser :

* Server Components ;
* rendu serveur lorsque pertinent ;
* chargement différé des éléments lourds ;
* optimisation des images ;
* code splitting ;
* lazy loading ;
* réduction du JavaScript client ;
* chargement conditionnel d'éléments visuels lourds.

Les éléments lourds doivent être chargés uniquement lorsque nécessaires.

---

# 30. Évolution de l'architecture

Cette architecture constitue une base.

Elle peut évoluer lorsque le projet grandit.

Toute modification architecturale importante doit être documentée dans :

`docs/decisions.md`

Une nouvelle technologie ne doit pas être ajoutée uniquement parce qu'elle pourrait être utile dans le futur.

L'architecture doit répondre aux besoins réels du projet actuel tout en laissant une possibilité d'évolution raisonnable.

---

# 31. Règle fondamentale

L'architecture doit rester au service du produit.

Priorité :

```text
Clarté
↓
Maintenabilité
↓
Sécurité
↓
Performance
↓
Évolutivité
↓
Complexité
```

La complexité ne doit être introduite que lorsqu'elle apporte une valeur réelle.

Une architecture sophistiquée mais inutile est considérée comme un problème, pas comme une amélioration.
