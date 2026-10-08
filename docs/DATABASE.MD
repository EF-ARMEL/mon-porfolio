# Database — Structure de la base de données

## 1. Rôle du document

Ce document définit la structure logique des données du portfolio.

Il sert à :

* identifier les entités nécessaires ;
* définir leurs responsabilités ;
* définir leurs relations ;
* éviter les duplications inutiles ;
* préparer le schéma de base de données ;
* guider le choix et l'implémentation de l'ORM ;
* maintenir une séparation claire entre contenu, utilisateurs, messages et configuration.

Ce document décrit la structure logique.

Il ne constitue pas encore le schéma ORM définitif.

---

# 2. Base de données principale

La base de données relationnelle prévue est :

**PostgreSQL**

Elle doit permettre de gérer :

* contenus ;
* projets ;
* compétences ;
* connaissances ;
* questions ;
* messages ;
* médias ;
* utilisateurs administrateurs ;
* paramètres.

---

# 3. ORM

L'ORM sera choisi avant l'implémentation finale entre :

* Prisma ;
* Drizzle ORM.

Le choix devra prendre en compte :

* compatibilité avec Next.js ;
* TypeScript ;
* migrations ;
* simplicité ;
* performances ;
* maintenabilité ;
* documentation ;
* ergonomie développeur.

Ne pas utiliser simultanément deux ORM pour la même base.

---

# 4. Principes de modélisation

La base doit respecter les principes suivants :

* une donnée importante ne doit pas être dupliquée inutilement ;
* les relations doivent être explicites ;
* les identifiants doivent être stables ;
* les statuts doivent être contrôlés ;
* les données administrables doivent être persistées ;
* les fichiers ne doivent pas être stockés directement en base lorsque ce n'est pas nécessaire ;
* les données sensibles doivent être protégées ;
* les timestamps importants doivent être conservés.

---

# 5. Identifiants

Chaque entité persistée doit posséder un identifiant unique.

Le type exact sera défini lors du choix de l'ORM.

Deux approches sont possibles :

* UUID ;
* identifiant numérique.

Le choix doit rester cohérent sur l'ensemble du projet.

Ne pas mélanger plusieurs stratégies sans raison.

---

# 6. Timestamps

Les entités importantes doivent généralement conserver :

```text id="1g5zty"
created_at
updated_at
```

Certaines entités peuvent également avoir :

```text id="8y2tqb"
published_at
deleted_at
```

selon leurs besoins.

---

# 7. User / Admin

Une table utilisateur doit permettre de gérer l'accès à l'administration.

Structure logique indicative :

```text id
email
password_hash
name
role
created_at
updated_at
```

Le mot de passe ne doit jamais être stocké en clair.

Le système d'authentification définit la stratégie exacte de stockage et de session.

---

# 8. Roles

Le projet peut commencer avec un rôle :

```text id="sqxj3m"
ADMIN
```

Une architecture permettant d'ajouter ultérieurement d'autres rôles peut être conservée.

Cependant, ne pas créer plusieurs rôles si le produit n'en a pas besoin.

---

# 9. Hero

Le Hero peut être stocké comme une configuration de contenu unique.

Structure logique :

```text id
title
subtitle
description
primary_cta_label
primary_cta_url
secondary_cta_label
secondary_cta_url
availability_status
media_id
updated_at
```

Il n'est pas nécessaire de créer plusieurs lignes Hero si une seule configuration active est prévue.

---

# 10. About

La section About peut être représentée comme un contenu éditorial unique.

Structure indicative :

```text id
title
introduction
description
portrait_media_id
updated_at
```

Les valeurs ou éléments supplémentaires peuvent être modélisés séparément uniquement si leur gestion dynamique le justifie.

---

# 11. Journey

Les étapes du parcours sont répétables.

Table logique :

```text id
title
period
category
description
link
order
status
created_at
updated_at
```

Une étape peut être publiée ou masquée.

---

# 12. Projects

Les projets sont une entité centrale.

Structure logique :

```text id
title
slug
short_description
full_description
cover_media_id
project_url
repository_url
status
featured
order
published_at
created_at
updated_at
deleted_at
```

Le `slug` doit être unique parmi les projets publiables.

---

# 13. Project Media

Un projet peut avoir plusieurs médias.

Il ne faut donc pas stocker plusieurs URLs directement dans la table `projects`.

Une relation peut être utilisée :

```text
Project
   ↓
ProjectMedia
   ↓
Media
```

Structure indicative de `project_media` :

```text
id
project_id
media_id
order
created_at
```

Cela permet de gérer une galerie.

---

# 14. Technologies

Les technologies doivent être réutilisables entre plusieurs contenus.

Une table `technologies` peut contenir :

```text
id
name
slug
description
icon
created_at
updated_at
```

Exemples :

```text
React
Next.js
Laravel
PHP
TypeScript
JavaScript
Tailwind CSS
PostgreSQL
```

---

# 15. Project Technologies

Un projet peut utiliser plusieurs technologies.

Une technologie peut être utilisée dans plusieurs projets.

Il s'agit donc d'une relation plusieurs-à-plusieurs.

Structure :

```text
Project
   ↕
ProjectTechnology
   ↕
Technology
```

Structure indicative :

```text
project_id
technology_id
```

Une clé primaire composite ou une contrainte d'unicité doit empêcher les doublons.

---

# 16. Skills

Les compétences peuvent utiliser les technologies existantes lorsqu'elles représentent la même notion.

Structure indicative :

```text
id
technology_id
description
status
order
created_at
updated_at
```

Exemple :

```text
technology_id → React
status → learning
```

Il faut éviter de créer :

```text
Skill = React
Technology = React
```

si les deux représentent exactement la même donnée.

---

# 17. Knowledge

Les connaissances sont différentes des technologies.

Structure indicative :

```text
id
title
slug
category
summary
description
status
order
created_at
updated_at
published_at
deleted_at
```

Une connaissance peut être associée à plusieurs technologies.

---

# 18. Knowledge Technologies

Relation plusieurs-à-plusieurs :

```text
Knowledge
   ↕
KnowledgeTechnology
   ↕
Technology
```

Structure :

```text
knowledge_id
technology_id
```

Cela permet par exemple d'associer :

```text
Knowledge :
"Architecture frontend"

Technologies :
React
Next.js
TypeScript
```

---

# 19. AI Workflow

Le workflow AI peut être représenté par une collection d'étapes.

Structure indicative :

```text
id
title
description
tool
icon
order
status
created_at
updated_at
```

Exemples :

```text
Moi
Claude Code
MCP
Skills
Second Brain
Projet
Validation
```

L'ordre est important.

---

# 20. Developer Questions

Les questions du challenge doivent être persistées.

Structure indicative :

```text
id
question
slug
category
difficulty
correct_answer
explanation
technology_id
order
published
created_at
updated_at
deleted_at
```

Les choix de réponse peuvent nécessiter une table séparée.

---

# 21. Question Choices

Si une question possède plusieurs réponses possibles, les choix peuvent être stockés séparément.

Structure :

```text
id
question_id
label
value
order
```

Relation :

```text
Question
   ↓
QuestionChoice
```

La réponse correcte peut référencer le choix correspondant plutôt que de dupliquer son texte.

---

# 22. Dreams / Future

Les objectifs futurs peuvent être persistés.

Structure indicative :

```text
id
title
description
category
status
target_date
order
created_at
updated_at
deleted_at
```

Exemples de statuts :

```text
idea
planned
in_progress
completed
```

---

# 23. Contact Messages

Les messages reçus depuis le formulaire de contact doivent être persistés.

Structure :

```text
id
name
email
subject
message
status
created_at
updated_at
```

Statuts possibles :

```text
new
read
replied
archived
```

---

# 24. Message Privacy

Les messages peuvent contenir des informations personnelles.

Ils doivent donc être accessibles uniquement aux utilisateurs autorisés.

Ils ne doivent jamais être exposés dans les routes publiques.

Les données inutiles ne doivent pas être collectées.

Principe :

> Collecter uniquement les données nécessaires au fonctionnement du contact.

---

# 25. Media

Les fichiers doivent être séparés des contenus qui les utilisent.

Structure indicative :

```text
id
filename
storage_key
url
type
mime_type
size
width
height
alt
created_at
updated_at
```

Le stockage physique peut être :

* local pendant le développement ;
* stockage externe ou objet en production selon les besoins.

La base stocke principalement les métadonnées et la référence vers le fichier.

---

# 26. Media et sécurité

Les médias uploadés depuis le dashboard doivent être contrôlés.

Vérifications possibles :

* taille maximale ;
* MIME type ;
* extension ;
* dimensions ;
* nom de fichier ;
* emplacement de stockage.

Un fichier ne doit pas pouvoir exécuter du code simplement parce qu'il a été uploadé.

---

# 27. CV

Le CV peut utiliser l'entité `Media`.

Une configuration séparée peut contenir :

```text
id
media_id
visible
downloadable
updated_at
```

Cela permet de contrôler le CV sans dupliquer les informations du fichier.

---

# 28. Settings

Les paramètres globaux peuvent être regroupés dans une table de configuration.

Exemple :

```text
id
key
value
updated_at
```

Cependant, cette approche doit être utilisée avec prudence.

Les données fortement structurées ne doivent pas être transformées artificiellement en simple couple `key/value`.

---

# 29. Relations principales

Vue conceptuelle :

```text
User
 │
 └── Admin access


Project
 ├── ProjectMedia ── Media
 └── ProjectTechnology ── Technology


Skill
 └── Technology


Knowledge
 └── KnowledgeTechnology ── Technology


Question
 ├── QuestionChoice
 └── Technology


CV
 └── Media
```

---

# 30. Cardinalités

Les relations principales sont :

```text
Project → ProjectMedia
1 → N

Media → ProjectMedia
1 → N

Project → Technology
N ↔ N

Knowledge → Technology
N ↔ N

Question → QuestionChoice
1 → N

Question → Technology
N → 1

Skill → Technology
N → 1
```

Les cardinalités exactes seront vérifiées lors de la création du schéma ORM.

---

# 31. Suppression logique

Pour les contenus importants, le soft delete peut être utilisé.

Exemples :

* projets ;
* connaissances ;
* questions ;
* rêves.

Champ :

```text
deleted_at
```

Une donnée supprimée logiquement ne doit plus apparaître publiquement.

Elle peut rester récupérable depuis l'administration si cette fonctionnalité est implémentée.

---

# 32. Contraintes d'intégrité

La base doit empêcher les incohérences évidentes.

Exemples :

* email valide au niveau applicatif ;
* slug unique ;
* technologie unique ;
* relation projet-technologie sans doublon ;
* relation knowledge-technologie sans doublon ;
* choix appartenant à une question existante ;
* média référencé existant.

Les contraintes doivent être appliquées autant que possible au niveau de la base.

---

# 33. Transactions

Les opérations qui modifient plusieurs tables de manière dépendante doivent utiliser une transaction lorsque nécessaire.

Exemple :

```text
Création d'un projet
    ↓
Création des relations technologies
    ↓
Création des médias associés
```

Si une étape critique échoue, la modification doit pouvoir être annulée proprement.

---

# 34. Index

Les champs fréquemment recherchés ou utilisés pour les relations peuvent nécessiter des index.

Exemples :

```text
slug
status
published_at
created_at
technology_id
project_id
question_id
```

Les index doivent être ajoutés en fonction des requêtes réelles.

Ne pas indexer chaque colonne sans raison.

---

# 35. Pagination

Les collections importantes doivent être paginées.

Exemples :

* messages ;
* projets ;
* questions ;
* médias.

Le frontend public peut utiliser une stratégie différente selon l'expérience.

Le dashboard doit éviter de charger inutilement des centaines d'enregistrements.

---

# 36. Recherche

Les recherches du dashboard doivent être réalisées côté serveur lorsque le volume de données le justifie.

Exemples :

```text
Recherche projet
Recherche message
Recherche question
Recherche connaissance
Recherche média
```

La stratégie exacte dépendra du volume réel.

---

# 37. Publication

Les contenus publiables doivent avoir un état explicite.

Exemple :

```text
draft
published
archived
```

Le frontend public doit uniquement récupérer les contenus autorisés à être visibles.

La protection doit être appliquée côté serveur.

---

# 38. Données publiques vs données privées

Les données publiques comprennent notamment :

* projets publiés ;
* compétences publiées ;
* connaissances publiées ;
* contenu AI publié ;
* parcours publié ;
* rêves publiés ;
* informations publiques de contact.

Les données privées comprennent notamment :

* comptes administrateurs ;
* mots de passe hashés ;
* messages reçus ;
* fichiers privés ;
* paramètres sensibles.

Une route publique ne doit jamais retourner des données privées par erreur.

---

# 39. Validation

Toutes les données entrantes doivent être validées avant leur persistance.

La validation doit vérifier :

* types ;
* formats ;
* longueurs ;
* valeurs autorisées ;
* relations ;
* fichiers ;
* permissions.

Une validation frontend seule n'est jamais suffisante.

---

# 40. Sécurité de la base

La base de données ne doit jamais être directement exposée au navigateur.

Architecture :

```text
Navigateur
    ↓
Next.js
    ↓
Backend / Server Action / Route Handler
    ↓
Data Access Layer
    ↓
PostgreSQL
```

Les identifiants de connexion doivent rester dans les variables d'environnement.

---

# 41. Variables d'environnement

Les informations sensibles doivent être stockées dans les variables d'environnement.

Exemples conceptuels :

```text
DATABASE_URL
AUTH_SECRET
STORAGE_SECRET
```

Les valeurs réelles ne doivent jamais être commitées dans Git.

Un fichier `.env.example` peut documenter les variables nécessaires sans contenir leurs valeurs secrètes.

---

# 42. Migrations

Toute modification importante du schéma doit passer par une migration.

Ne pas modifier directement la base de production sans migration contrôlée.

Processus général :

```text
Modification du modèle
        ↓
Migration
        ↓
Test local
        ↓
Vérification
        ↓
Production
```

Les migrations doivent être versionnées avec le projet.

---

# 43. Seed

Un système de seed peut être utilisé pour le développement.

Il peut créer :

* compte admin de développement ;
* technologies ;
* exemples de projets ;
* questions ;
* données de démonstration.

Les données de démonstration ne doivent pas être confondues avec les données réelles.

Aucun secret réel ne doit être inclus dans un seed.

---

# 44. Tests de base de données

Les opérations critiques doivent être testées.

Exemples :

* création d'un projet ;
* modification d'un projet ;
* publication ;
* suppression logique ;
* relation avec une technologie ;
* création d'un message ;
* changement de statut d'un message ;
* permissions admin.

Les tests doivent vérifier également les cas d'erreur.

---

# 45. Évolution du schéma

Le schéma doit évoluer progressivement.

Avant de créer une nouvelle table :

1. identifier le besoin ;
2. vérifier si une table existante peut répondre au besoin ;
3. définir les relations ;
4. définir les données nécessaires ;
5. vérifier les contraintes ;
6. évaluer l'impact sur le frontend ;
7. évaluer l'impact sur le dashboard.

Éviter la sur-modélisation.

---

# 46. Règle importante

La base de données ne doit pas dicter inutilement l'expérience utilisateur.

Elle doit fournir les données nécessaires au produit.

La complexité doit rester proportionnée au portfolio.

Principe :

```text
Besoin réel
    ↓
Modèle de données
    ↓
Relation nécessaire
    ↓
Contrainte nécessaire
    ↓
Implémentation
```

Pas :

```text
Technologie disponible
    ↓
Nouvelle table
    ↓
Nouvelle abstraction
    ↓
Complexité inutile
```

---

# 47. Principe final

La base de données doit être :

* claire ;
* relationnelle ;
* sécurisée ;
* cohérente ;
* maintenable ;
* évolutive ;
* suffisamment normalisée ;
* mais pas inutilement complexe.

Elle doit soutenir le portfolio sans devenir le centre du produit.

Le principe directeur est :

> Modéliser exactement ce dont le produit a besoin, avec suffisamment de structure pour rester fiable et suffisamment de simplicité pour rester maintenable.

