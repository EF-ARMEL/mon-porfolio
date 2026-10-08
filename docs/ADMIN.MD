# Admin Dashboard — Système d'administration

## 1. Rôle du dashboard

Le dashboard administrateur permet de gérer le contenu et certaines configurations du portfolio sans modifier directement le code source.

Il doit permettre à l'administrateur de :

* gérer les contenus ;
* gérer les projets ;
* gérer les compétences ;
* gérer les connaissances ;
* gérer les questions développeur ;
* gérer le contenu AI ;
* gérer les rêves et objectifs ;
* gérer les messages ;
* gérer les médias ;
* gérer le CV ;
* gérer certaines informations générales du portfolio.

Le dashboard ne doit pas permettre de modifier directement l'architecture ou le code de l'application.

---

# 2. Principe général

Le dashboard est une interface d'administration fonctionnelle.

Il ne doit pas reproduire l'expérience artistique du portfolio public.

Le public doit voir :

```text
Immersion
Animation
3D
Storytelling
Expérience visuelle
```

L'administrateur doit voir :

```text
Clarté
Organisation
Actions rapides
Formulaires
Tableaux
Filtres
Statuts
Validation
```

Principe :

> Le portfolio est une expérience. Le dashboard est un outil.

---

# 3. Accès

Le dashboard doit être protégé par authentification.

Une personne non authentifiée ne doit pas pouvoir accéder aux routes d'administration.

Exemple conceptuel :

```text
/login
    ↓
Authentification
    ↓
Vérification du rôle
    ↓
/admin
```

Une tentative d'accès direct à une page protégée doit être refusée ou redirigée vers l'authentification.

---

# 4. Authentification

L'authentification doit être sécurisée.

Elle doit gérer au minimum :

* email ou identifiant ;
* mot de passe ;
* session ;
* déconnexion ;
* protection des routes ;
* expiration de session selon la stratégie choisie.

Le système d'authentification devra être choisi avant l'implémentation finale.

Ne pas créer un système d'authentification maison si une solution fiable adaptée au stack existe.

---

# 5. Autorisation

L'authentification permet de savoir qui est connecté.

L'autorisation permet de déterminer ce que cette personne peut faire.

Le dashboard doit utiliser une logique de permissions claire.

À ce stade, le portfolio peut fonctionner avec un rôle administrateur unique.

Une architecture permettant l'ajout futur d'autres rôles peut être envisagée sans créer une complexité inutile.

---

# 6. Dashboard principal

La page d'accueil du dashboard doit fournir une vue synthétique.

Elle peut afficher :

* nombre de projets publiés ;
* nombre de projets en brouillon ;
* nombre de messages non lus ;
* nombre de compétences ;
* nombre de questions ;
* état du CV ;
* activité récente.

Exemple :

```text
Dashboard
│
├── Projets publiés
├── Messages nouveaux
├── Questions publiées
├── Compétences
├── CV
└── Activité récente
```

Les statistiques doivent rester utiles.

Éviter de créer des graphiques simplement pour remplir l'écran.

---

# 7. Navigation admin

La navigation doit regrouper les fonctionnalités par logique.

Structure indicative :

```text
Administration
│
├── Dashboard
├── Contenu
│   ├── Hero
│   ├── About
│   ├── Journey
│   ├── AI
│   ├── Knowledge
│   ├── Skills
│   └── Dreams
│
├── Projets
├── Questions
├── Messages
├── Médias
├── CV
└── Paramètres
```

Cette structure peut évoluer avec l'application.

---

# 8. Gestion du Hero

L'administrateur doit pouvoir modifier :

* titre ;
* sous-titre ;
* description ;
* CTA ;
* statut de disponibilité ;
* média principal ;
* autres informations prévues par le modèle.

Les champs doivent être présentés dans un formulaire clair.

---

# 9. Gestion de About

L'administrateur peut modifier :

* présentation ;
* description ;
* valeurs ;
* éléments importants ;
* image ;
* contenu complémentaire.

Le formulaire doit permettre de prévisualiser le résultat lorsque cela est pertinent.

---

# 10. Gestion du parcours

L'administrateur peut :

* ajouter une étape ;
* modifier une étape ;
* supprimer une étape ;
* publier / masquer une étape ;
* modifier son ordre.

Chaque étape doit avoir une structure claire.

Exemple :

```text
Titre
Période
Catégorie
Description
Technologies
Lien éventuel
Ordre
Statut
```

---

# 11. Gestion des projets

Les projets sont une fonctionnalité centrale du dashboard.

L'administrateur doit pouvoir :

* créer un projet ;
* modifier un projet ;
* supprimer ou archiver un projet ;
* publier un projet ;
* mettre un projet en brouillon ;
* définir un projet comme mis en avant ;
* modifier l'ordre ;
* gérer les images ;
* gérer les technologies ;
* ajouter les liens ;
* modifier la description ;
* gérer les informations techniques.

---

# 12. Liste des projets

La liste doit permettre de visualiser rapidement :

* titre ;
* statut ;
* catégorie ;
* technologies ;
* date ;
* projet mis en avant ou non.

Elle doit permettre des actions rapides :

* modifier ;
* publier ;
* masquer ;
* archiver ;
* supprimer.

---

# 13. Formulaire projet

Le formulaire projet doit être organisé en sections.

Exemple :

```text
Informations générales
├── Titre
├── Slug
├── Description courte
└── Description complète

Présentation
├── Image principale
├── Galerie
└── Vidéo éventuelle

Technique
├── Technologies
├── Fonctionnalités
└── Architecture éventuelle

Liens
├── Site
└── GitHub

Publication
├── Statut
├── Mis en avant
└── Ordre
```

Le formulaire ne doit pas devenir inutilement complexe.

---

# 14. Gestion des compétences

L'administrateur doit pouvoir :

* ajouter une compétence ;
* modifier une compétence ;
* supprimer une compétence ;
* changer son statut ;
* modifier son ordre ;
* gérer son icône.

Exemples de statuts :

```text
Utilisé
En apprentissage
Exploration
```

Le dashboard ne doit pas imposer automatiquement un niveau de maîtrise.

---

# 15. Gestion des connaissances

L'administrateur peut créer des contenus représentant :

* concepts ;
* méthodes ;
* architectures ;
* bonnes pratiques ;
* apprentissages ;
* erreurs corrigées.

Chaque élément peut être :

* publié ;
* masqué ;
* modifié ;
* réordonné.

---

# 16. Gestion du contenu AI

L'administrateur peut gérer les éléments du workflow AI.

Exemple :

```text
Moi
Claude Code
MCP
Skills
Second Brain
Projet
Validation
```

Chaque étape peut être modifiée depuis le dashboard.

Les relations et animations entre les étapes restent une responsabilité du code frontend.

L'administrateur modifie le contenu, pas la logique d'animation.

---

# 17. Gestion des questions développeur

Le dashboard doit permettre de gérer les questions du challenge.

Actions :

* créer ;
* modifier ;
* supprimer ;
* publier ;
* masquer ;
* définir la catégorie ;
* définir la difficulté ;
* définir la réponse correcte ;
* définir l'explication ;
* associer une technologie ;
* réordonner.

Une question non publiée ne doit pas être proposée aux visiteurs.

---

# 18. Gestion des rêves / objectifs

L'administrateur peut :

* créer un objectif ;
* modifier un objectif ;
* supprimer ou archiver ;
* changer son statut ;
* définir sa position ;
* modifier sa description.

Les statuts peuvent être :

```text
Idée
Planifié
En cours
Terminé
```

---

# 19. Gestion des messages

La messagerie est une fonctionnalité importante.

Le dashboard doit permettre de consulter les messages reçus depuis le formulaire public.

Chaque message peut afficher :

```text
Nom
Email
Sujet
Message
Date
Statut
```

---

# 20. États des messages

Les messages peuvent utiliser :

```text
Nouveau
Lu
Répondu
Archivé
```

L'administrateur doit pouvoir modifier le statut.

Exemple :

```text
Nouveau
   ↓
Lu
   ↓
Répondu
   ↓
Archivé
```

Un message peut être archivé sans avoir été marqué comme répondu si nécessaire.

Le système ne doit pas imposer un workflow artificiel.

---

# 21. Liste des messages

La liste doit permettre :

* filtrage par statut ;
* recherche ;
* tri par date ;
* ouverture d'un message ;
* changement de statut ;
* archivage.

Les nouveaux messages doivent être facilement identifiables.

---

# 22. Détail d'un message

La page ou vue détaillée doit afficher :

* identité de l'expéditeur ;
* email ;
* sujet ;
* message ;
* date ;
* statut.

Une action permettant de répondre à l'expéditeur peut être envisagée selon le système de messagerie retenu.

Le dashboard ne doit pas stocker inutilement des informations personnelles supplémentaires.

---

# 23. Gestion des médias

Le dashboard peut permettre :

* upload ;
* suppression ;
* remplacement ;
* consultation ;
* sélection d'un média existant.

Les fichiers doivent être contrôlés.

Le système doit vérifier notamment :

* type ;
* taille ;
* extension ;
* MIME type ;
* dimensions lorsque pertinent.

Les fichiers doivent être optimisés avant utilisation publique lorsque cela est possible.

---

# 24. Gestion du CV

Le dashboard doit permettre :

* importer un CV ;
* remplacer le CV ;
* supprimer le CV ;
* activer / désactiver son affichage ;
* activer / désactiver le téléchargement.

États possibles :

```text
CV visible
CV non visible

Téléchargement activé
Téléchargement désactivé
```

Les règles de confidentialité doivent être respectées côté serveur.

Masquer simplement un bouton côté frontend n'est pas suffisant pour protéger un fichier privé.

---

# 25. Paramètres généraux

Une section Settings peut gérer certaines informations globales.

Exemples :

* nom affiché ;
* email ;
* téléphone ;
* localisation ;
* liens sociaux ;
* statut de disponibilité ;
* configuration générale du portfolio.

Les paramètres techniques sensibles ne doivent jamais être exposés dans le dashboard comme de simples champs de texte.

---

# 26. Prévisualisation

Lorsque cela apporte une vraie valeur, le dashboard peut proposer une prévisualisation.

Exemples :

* aperçu d'un projet ;
* aperçu d'une image ;
* aperçu du Hero ;
* aperçu d'une section.

La prévisualisation doit utiliser autant que possible les mêmes composants que le frontend public.

Cela réduit les divergences entre :

```text
Ce que l'admin édite
```

et :

```text
Ce que le visiteur voit
```

---

# 27. Brouillon et publication

Le dashboard doit distinguer clairement :

```text
Brouillon
Publié
Archivé
```

L'administrateur doit savoir immédiatement si un contenu est visible publiquement.

Une action de publication doit être explicite.

Éviter les publications accidentelles.

---

# 28. Confirmation des actions destructives

Les actions potentiellement destructives doivent demander une confirmation.

Exemples :

* suppression d'un projet ;
* suppression d'un média ;
* suppression d'une question ;
* suppression d'un message ;
* suppression du CV.

Lorsque le soft delete est utilisé, le système peut proposer une récupération plutôt qu'une suppression définitive.

---

# 29. Notifications

Le dashboard peut afficher des notifications après les actions importantes.

Exemples :

* « Projet enregistré »
* « Projet publié »
* « Message marqué comme lu »
* « Question supprimée »
* « CV mis à jour »

Les notifications doivent être courtes et compréhensibles.

---

# 30. Validation des formulaires

Toutes les données saisies doivent être validées.

La validation doit exister :

* côté interface pour améliorer l'expérience ;
* côté serveur pour garantir la sécurité et l'intégrité.

Les erreurs doivent être affichées près du champ concerné lorsque possible.

Exemple :

```text
Email
[ valeur ]

⚠ Adresse email invalide
```

---

# 31. Gestion des erreurs

Une erreur ne doit jamais produire simplement une interface silencieuse.

L'administrateur doit comprendre :

* ce qui a échoué ;
* si les données ont été enregistrées ;
* ce qu'il peut faire ensuite.

Les messages techniques détaillés ne doivent pas être affichés directement à l'utilisateur final.

Les détails techniques doivent être disponibles dans les logs appropriés.

---

# 32. Recherche et filtrage

Les listes importantes doivent prévoir des outils adaptés.

Exemples :

### Projets

```text
Recherche
Filtre statut
Filtre catégorie
```

### Messages

```text
Recherche
Filtre statut
Tri date
```

### Questions

```text
Recherche
Filtre technologie
Filtre difficulté
Filtre publication
```

Les filtres doivent rester simples.

---

# 33. Ordre des contenus

Les contenus répétables doivent pouvoir être réordonnés lorsque leur ordre influence le frontend.

Exemples :

* projets ;
* compétences ;
* étapes du parcours ;
* questions ;
* connaissances ;
* rêves ;
* étapes AI.

L'ordre doit être stocké explicitement.

---

# 34. Responsive du dashboard

Le dashboard doit fonctionner sur :

* ordinateur ;
* tablette ;
* mobile.

Cependant, l'administration est principalement pensée pour une utilisation desktop.

Sur mobile :

* les tableaux peuvent devenir des cartes ;
* les colonnes peuvent être réduites ;
* les actions doivent rester accessibles ;
* les formulaires doivent rester utilisables.

---

# 35. Accessibilité du dashboard

Le dashboard doit respecter les bonnes pratiques d'accessibilité.

Notamment :

* labels explicites ;
* navigation clavier ;
* focus visible ;
* contraste suffisant ;
* boutons compréhensibles ;
* messages d'erreur accessibles ;
* alternatives textuelles pour les images lorsque nécessaire.

---

# 36. Sécurité

Le dashboard doit être considéré comme une zone sensible.

Les protections doivent inclure selon l'architecture retenue :

* authentification ;
* autorisation ;
* validation serveur ;
* protection CSRF lorsque nécessaire ;
* contrôle des uploads ;
* protection contre les injections ;
* protection des fichiers privés ;
* gestion sécurisée des sessions ;
* secrets uniquement dans les variables d'environnement.

Aucune donnée sensible ne doit être considérée comme protégée simplement parce qu'elle n'est pas visible dans l'interface.

---

# 37. Journalisation

Les actions administratives importantes peuvent être journalisées.

Exemples :

```text
Projet créé
Projet publié
Projet supprimé
CV remplacé
Message archivé
Question modifiée
```

La journalisation devra être proportionnée aux besoins du projet.

Il ne faut pas créer un système d'audit complexe sans nécessité.

---

# 38. Performance

Le dashboard doit rester rapide.

Éviter :

* chargement de toutes les données inutilement ;
* requêtes répétitives ;
* images originales très lourdes ;
* composants complexes sans nécessité ;
* JavaScript client inutile.

Les listes doivent être paginées lorsqu'elles deviennent importantes.

---

# 39. Architecture frontend admin

Le dashboard peut utiliser une interface de composants cohérente.

Les composants peuvent inclure :

```text
AdminLayout
Sidebar
Header
StatCard
DataTable
Form
Modal
Drawer
ConfirmDialog
Toast
EmptyState
LoadingState
ErrorState
```

Les composants doivent être réutilisables.

---

# 40. Architecture backend admin

Les actions d'administration doivent passer par une couche serveur contrôlée.

Flux général :

```text
Admin UI
   ↓
Action serveur / Route Handler
   ↓
Validation
   ↓
Authorization
   ↓
Data Access
   ↓
Database
```

Le frontend ne doit jamais être considéré comme une autorité de sécurité.

---

# 41. Cache et contenu

Si le frontend utilise du cache ou du rendu statique, une modification depuis l'administration doit pouvoir provoquer la mise à jour du contenu public.

La stratégie de revalidation devra être définie avec l'architecture Next.js retenue.

Exemple conceptuel :

```text
Admin modifie projet
        ↓
Base de données mise à jour
        ↓
Revalidation
        ↓
Frontend public actualisé
```

---

# 42. Versioning du contenu

Un système de versioning complet n'est pas obligatoire au début.

Il pourra être ajouté plus tard si le besoin apparaît.

Ne pas créer une infrastructure de versioning complexe sans cas d'utilisation concret.

---

# 43. Principe de séparation

Le dashboard ne doit jamais devenir un constructeur de site complet.

Il doit permettre de gérer :

```text
Contenu
Médias
Publication
Ordre
Statuts
Messages
Paramètres
```

Il ne doit pas permettre de modifier arbitrairement :

```text
Code
Architecture
Animations
Composants
3D
Routing
Système de design
```

---

# 44. Évolution

Le dashboard doit être conçu pour accueillir de nouvelles fonctionnalités.

Cependant, toute nouvelle fonctionnalité doit répondre à un besoin réel.

Avant de l'ajouter :

1. définir le problème ;
2. définir l'utilisateur concerné ;
3. définir les données nécessaires ;
4. définir les actions nécessaires ;
5. vérifier si une fonctionnalité existante peut suffire ;
6. évaluer le coût technique.

---

# 45. Principe final

Le dashboard doit permettre une chose essentielle :

> Faire évoluer le portfolio sans devoir modifier le code pour chaque changement de contenu.

Mais cette liberté doit rester contrôlée.

L'administrateur gère le contenu.

Le code gère :

* l'expérience ;
* la logique ;
* l'architecture ;
* les animations ;
* la 3D ;
* la sécurité ;
* les performances.

Le système doit donc trouver l'équilibre entre :

```text
Liberté éditoriale
        +
Contrôle technique
        +
Sécurité
        +
Simplicité
```
