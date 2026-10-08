# Content Structure — Structure des contenus du portfolio

## 1. Rôle du document

Ce document définit la structure fonctionnelle et éditoriale des contenus du portfolio.

Il permet de déterminer :

* quelles informations existent ;
* quelles informations sont affichées publiquement ;
* quelles informations sont modifiables depuis l'administration ;
* quelles informations peuvent être ajoutées ou supprimées ;
* quelles données sont statiques ;
* quelles données doivent être dynamiques ;
* quelles relations existent entre les différents contenus.

Ce document sert de référence avant la création du schéma de base de données.

---

# 2. Principe général

Le portfolio est une application dynamique.

Le contenu principal ne doit pas être codé directement dans les composants lorsqu'il doit pouvoir être modifié depuis l'administration.

Principe :

```text
Admin
  ↓
Modification du contenu
  ↓
Backend
  ↓
Base de données
  ↓
Frontend public
  ↓
Visiteur
```

L'interface publique consomme les données.

L'administration permet de gérer ces données.

---

# 3. Contenu statique vs contenu dynamique

## Contenu statique

Certains éléments peuvent rester directement dans le code lorsqu'ils ne nécessitent pas de modification fréquente.

Exemples :

* structure technique de l'application ;
* composants UI ;
* animations ;
* logique métier ;
* layouts ;
* système de navigation technique ;
* effets 3D ;
* configuration interne.

## Contenu dynamique

Les éléments éditoriaux importants doivent pouvoir être modifiés depuis l'administration.

Exemples :

* présentation ;
* projets ;
* compétences ;
* connaissances ;
* contenu AI ;
* questions développeur ;
* rêves ;
* informations de contact ;
* messages reçus.

---

# 4. Hero

Le Hero est la première impression du portfolio.

Il doit présenter immédiatement :

* identité ;
* métier / positionnement ;
* proposition de valeur ;
* direction du portfolio.

## Données possibles

```text
title
subtitle
description
primary_cta
secondary_cta
background_visual
availability_status
```

Exemples conceptuels :

* nom ;
* « Développeur web » ;
* courte présentation ;
* bouton « Voir mes projets » ;
* bouton « Me contacter » ;
* statut de disponibilité.

Le contenu exact sera défini séparément.

---

# 5. About / Identité

Cette section présente la personne derrière le portfolio.

Elle peut contenir :

* présentation ;
* parcours ;
* personnalité professionnelle ;
* manière de travailler ;
* valeurs ;
* vision du développement.

## Données possibles

```text
title
introduction
description
portrait
highlights
values
```

La présentation doit rester honnête et cohérente avec un profil junior.

Aucune compétence ne doit être présentée comme maîtrisée si elle est seulement en apprentissage.

---

# 6. Journey / Parcours

Cette section raconte l'évolution du développeur.

Elle peut présenter :

* formations ;
* expériences ;
* projets importants ;
* étapes d'apprentissage ;
* technologies découvertes ;
* évolution vers l'utilisation de l'IA.

## Structure possible

Chaque étape peut contenir :

```text
title
period
description
category
technologies
link
order
```

Exemples de catégories :

* Formation
* Projet
* Expérience
* Apprentissage
* Évolution

La chronologie doit raconter une progression et non simplement afficher une liste de dates.

---

# 7. Projects

Les projets constituent une partie centrale du portfolio.

Chaque projet doit pouvoir être créé, modifié, publié ou masqué depuis l'administration.

## Données principales

```text
title
slug
short_description
full_description
cover_image
gallery
technologies
category
project_url
repository_url
status
featured
order
published_at
```

## Informations possibles

Un projet peut également contenir :

* problème rencontré ;
* solution développée ;
* fonctionnalités principales ;
* technologies utilisées ;
* difficultés ;
* apprentissages ;
* résultats ;
* captures d'écran ;
* vidéo ;
* lien vers le projet ;
* lien GitHub.

## Statut

Un projet peut avoir différents états :

```text
draft
published
archived
```

Un projet en brouillon ne doit pas être affiché publiquement.

---

# 8. AI × Development

Cette section présente la manière dont l'intelligence artificielle est utilisée dans le développement.

L'objectif n'est pas de donner l'impression que l'IA écrit simplement le code à la place du développeur.

Le contenu doit montrer :

* raisonnement ;
* organisation ;
* validation ;
* documentation ;
* utilisation d'outils ;
* contrôle humain ;
* amélioration continue.

## Workflow possible

```text
Moi
 ↓
Claude Code
 ↓
MCP
 ↓
Skills
 ↓
Knowledge / Second Brain
 ↓
Projet
 ↓
Validation
 ↓
Amélioration
```

## Données possibles

Chaque étape peut contenir :

```text
title
description
icon
tool
order
```

La section peut également présenter :

* bonnes pratiques ;
* exemples d'utilisation ;
* méthodes de validation ;
* documentation ;
* contexte d'utilisation.

---

# 9. Developer Challenge

Cette section permet d'introduire une expérience interactive destinée principalement aux développeurs.

## Entrée

Le visiteur peut être invité à répondre :

> Êtes-vous développeur ?

Deux chemins sont possibles.

### Développeur

Le visiteur accède aux questions ou défis techniques.

### Non-développeur

Le visiteur peut continuer directement vers :

* projets ;
* présentation ;
* collaboration ;
* contact.

Le parcours non-développeur doit rester simple et sans frustration.

---

# 10. Questions développeur

Les questions doivent pouvoir être gérées depuis l'administration.

Chaque question peut contenir :

```text
question
slug
category
difficulty
choices
correct_answer
explanation
related_technology
order
published
```

## Catégories possibles

Exemples :

* JavaScript ;
* React ;
* Laravel ;
* PHP ;
* SQL ;
* architecture ;
* Git ;
* web ;
* bonnes pratiques ;
* AI-assisted development.

## Difficulté

Une difficulté peut être définie comme :

```text
beginner
intermediate
advanced
```

La difficulté ne doit pas être utilisée pour prétendre à un niveau professionnel.

Elle sert uniquement à organiser l'expérience.

---

# 11. Knowledge / Connaissances

Cette section présente les connaissances acquises et les sujets étudiés.

Elle peut être différente de la section Skills.

## Skills

Répond à :

> Qu'est-ce que je sais utiliser ?

## Knowledge

Répond à :

> Qu'est-ce que j'ai appris et compris ?

La section Knowledge peut contenir :

* concepts ;
* architectures ;
* bonnes pratiques ;
* méthodes ;
* expériences ;
* apprentissages ;
* erreurs corrigées ;
* ressources importantes.

## Structure possible

```text
title
category
summary
description
technologies
resources
order
published
```

---

# 12. Skills / Toolkit

Cette section présente les technologies utilisées ou étudiées.

Les compétences doivent être représentées honnêtement.

Une compétence peut avoir :

```text
name
category
description
icon
level
status
order
```

## Statuts possibles

```text
used
learning
exploring
```

Le système ne doit pas automatiquement transformer une technologie en compétence « maîtrisée ».

---

# 13. Dreams / Future

Cette section présente la direction future.

Elle ne doit pas être présentée comme une liste vague de rêves.

Elle doit montrer une trajectoire.

Elle peut contenir :

* technologies à apprendre ;
* projets à construire ;
* domaines à explorer ;
* objectifs professionnels ;
* idées de produits ;
* ambitions autour de l'IA ;
* objectifs personnels liés au développement.

## Structure possible

```text
title
description
category
status
target_date
order
```

## Statuts possibles

```text
idea
planned
in_progress
completed
```

Cette section peut utiliser une timeline ou une expérience narrative.

---

# 14. Collaboration

Cette section explique ce que le visiteur peut faire avec le développeur.

Exemples :

* créer un site ;
* développer une application ;
* améliorer une interface ;
* développer une fonctionnalité ;
* collaborer sur un projet ;
* discuter d'une idée.

La section doit rester cohérente avec le niveau réel du développeur.

---

# 15. Contact

La section Contact permet au visiteur d'envoyer un message.

## Informations du formulaire

```text
name
email
subject
message
```

D'autres champs peuvent être ajoutés si leur utilité est démontrée.

Le formulaire doit rester simple.

---

# 16. Messages

Les messages envoyés depuis le formulaire sont stockés côté backend.

Chaque message peut contenir :

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

## Statuts

```text
new
read
replied
archived
```

L'administration doit permettre de :

* consulter ;
* marquer comme lu ;
* marquer comme répondu ;
* archiver ;
* supprimer si nécessaire.

---

# 17. Informations de contact

Certaines informations peuvent être administrables :

```text
email
phone
location
linkedin
github
other_links
```

Les liens externes doivent être validés avant publication.

---

# 18. CV

Le portfolio peut gérer un CV.

Le système doit pouvoir définir :

```text
cv_file
cv_visible
cv_downloadable
```

Lorsque le CV est désactivé :

* il ne doit pas être accessible publiquement ;
* le bouton de téléchargement doit disparaître ;
* aucune URL publique directe ne doit permettre de contourner cette règle si le fichier est privé.

La gestion du CV appartient à l'administration.

---

# 19. Navigation

La navigation publique peut être construite à partir des sections définies par l'application.

Cependant, la navigation technique ne doit pas devenir entièrement dynamique sans nécessité.

Le système doit conserver une structure claire.

Une section peut avoir :

```text
label
slug
order
visible
```

---

# 20. Footer

Le footer peut contenir :

* nom ;
* courte phrase ;
* liens sociaux ;
* email ;
* navigation ;
* copyright.

Les informations importantes peuvent être administrables.

---

# 21. SEO

Les contenus nécessaires au référencement peuvent être gérés séparément.

Exemples :

```text
meta_title
meta_description
og_image
```

Les métadonnées doivent être générées côté serveur lorsque cela est pertinent.

Les données SEO ne doivent pas remplacer la qualité réelle du contenu.

---

# 22. Médias

Les médias utilisés dans le portfolio peuvent comprendre :

* images ;
* captures de projets ;
* portraits ;
* vidéos ;
* modèles 3D ;
* documents.

Chaque média peut avoir :

```text
filename
url
type
alt
size
created_at
```

Les médias doivent être optimisés avant leur utilisation publique.

---

# 23. Ordre des contenus

Les contenus répétables doivent pouvoir être réordonnés.

Exemples :

* projets ;
* compétences ;
* étapes du parcours ;
* questions ;
* connaissances ;
* rêves ;
* éléments du workflow AI.

Le système doit éviter de dépendre uniquement de l'ordre de création en base de données.

Un champ `order` ou équivalent peut être utilisé.

---

# 24. Publication

Les contenus dynamiques doivent pouvoir avoir un état de publication.

États génériques :

```text
draft
published
archived
```

Règle :

```text
draft
→ visible dans l'administration
→ invisible publiquement

published
→ visible publiquement

archived
→ conservé
→ invisible publiquement
```

---

# 25. Suppression

La suppression définitive ne doit pas être utilisée automatiquement.

Lorsque les données sont importantes, privilégier si nécessaire :

```text
soft delete
```

Cela permet de conserver une possibilité de récupération.

Les règles de suppression seront précisées dans la documentation de la base de données.

---

# 26. Relations entre contenus

Certains contenus peuvent être liés.

Exemples :

```text
Projet
 ├── Technologies
 ├── Médias
 └── Catégories

Question
 └── Technologie

Knowledge
 └── Technologies

Journey
 └── Technologies
```

Les relations exactes seront définies dans `docs/database.md`.

---

# 27. Contenu et expérience

Les contenus ne doivent pas être conçus indépendamment de l'expérience.

Pour chaque section importante :

```text
Contenu
 ↓
Structure
 ↓
Interaction
 ↓
Animation
 ↓
3D éventuelle
```

La technologie doit venir après la définition du contenu.

---

# 28. Contenu administrable vs expérience codée

L'administration doit permettre de modifier le contenu sans modifier le code.

Cependant, l'administration ne doit pas essayer de permettre de modifier arbitrairement :

* les animations complexes ;
* le layout technique ;
* la logique React ;
* la logique 3D ;
* le système de routing ;
* l'architecture.

L'objectif est :

> administrer le contenu, pas administrer le code.

---

# 29. Validation des contenus

Les données provenant de l'administration doivent être validées avant leur enregistrement.

Les validations peuvent concerner :

* champs obligatoires ;
* longueur ;
* formats ;
* URLs ;
* emails ;
* fichiers ;
* tailles ;
* types MIME ;
* valeurs autorisées.

Les validations frontend ne remplacent jamais les validations backend.

---

# 30. Principe éditorial

Le portfolio doit rester personnel.

Le contenu doit éviter :

* les phrases génériques ;
* les affirmations exagérées ;
* les buzzwords inutiles ;
* les compétences inventées ;
* les descriptions artificielles ;
* les textes conçus uniquement pour impressionner.

Le design peut être spectaculaire.

Le contenu doit rester crédible.

---

# 31. Évolution

Cette structure n'est pas figée.

De nouveaux types de contenus pourront être ajoutés si une nécessité réelle apparaît.

Avant d'ajouter une nouvelle entité de contenu, vérifier :

1. Est-elle réellement nécessaire ?
2. Peut-elle être représentée par une entité existante ?
3. Doit-elle être administrable ?
4. Doit-elle être persistée en base ?
5. Quelle relation possède-t-elle avec les autres contenus ?
6. Quel est son impact sur le frontend ?
7. Quel est son impact sur l'administration ?

Principe :

> Ne pas créer une nouvelle structure de données simplement parce qu'elle semble intéressante.

---

# 32. Principe final

Le contenu du portfolio doit permettre de raconter une histoire cohérente :

```text
Qui je suis
      ↓
Mon parcours
      ↓
Ce que j'ai appris
      ↓
Ce que je sais construire
      ↓
Comment je travaille
      ↓
Comment j'utilise l'IA
      ↓
Ce que je veux construire
      ↓
Comment collaborer avec moi
```

La structure des données doit servir cette narration.

Elle ne doit jamais devenir plus complexe que le produit qu'elle sert.
