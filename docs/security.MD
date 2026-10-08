# Security — Sécurité de l'application

## 1. Rôle du document

Ce document définit les principes de sécurité du portfolio.

Le portfolio étant une application complète avec :

* un frontend public ;
* un backend ;
* une base de données ;
* un espace d'administration ;
* un système de messages ;
* des contenus dynamiques ;
* éventuellement des fichiers uploadés ;

la sécurité doit être considérée dès la conception.

La sécurité ne doit pas être ajoutée uniquement après le développement.

---

# 2. Principes fondamentaux

L'application doit suivre les principes suivants :

* ne jamais faire confiance aux données provenant du navigateur ;
* valider les données côté serveur ;
* protéger les accès administrateur ;
* protéger les secrets ;
* limiter les permissions ;
* éviter d'exposer des données privées ;
* sécuriser les uploads ;
* protéger les endpoints ;
* journaliser les événements importants ;
* maintenir les dépendances à jour ;
* vérifier les changements importants.

---

# 3. Authentification

L'espace d'administration doit être protégé par authentification.

Un utilisateur non authentifié ne doit pas pouvoir accéder aux fonctionnalités d'administration.

Le système doit notamment gérer :

* connexion ;
* déconnexion ;
* session ;
* expiration de session ;
* récupération de compte si nécessaire ;
* protection contre les tentatives abusives.

Les mécanismes d'authentification doivent utiliser les solutions adaptées à Next.js et à la stack réellement retenue.

Le mécanisme exact d'authentification sera choisi après validation de la stack.

---

# 4. Autorisation

L'authentification répond à :

> Qui es-tu ?

L'autorisation répond à :

> Qu'as-tu le droit de faire ?

L'accès aux fonctions d'administration doit donc être contrôlé côté serveur.

Il ne faut jamais considérer le simple fait de cacher un bouton dans l'interface comme une protection suffisante.

Exemple :

```text
Utilisateur
     ↓
Authentifié ?
     ↓
Oui
     ↓
Administrateur ?
     ↓
Oui
     ↓
Action autorisée
```

Le serveur doit effectuer les vérifications nécessaires.

---

# 5. Route protection

Les routes d'administration doivent être protégées.

Exemple conceptuel :

```text
/public
   ↓
accessible publiquement

/admin
   ↓
authentification
   ↓
autorisation
   ↓
dashboard
```

Une tentative d'accès non autorisée doit être refusée proprement.

---

# 6. Données sensibles

Les informations sensibles ne doivent jamais être stockées directement dans le code source.

Cela concerne notamment :

* mots de passe ;
* clés API ;
* tokens ;
* secrets ;
* identifiants de services ;
* credentials de base de données.

Les variables d'environnement doivent être utilisées lorsque nécessaire.

---

# 7. Variables d'environnement

Les secrets doivent être conservés dans des variables d'environnement.

Exemple conceptuel :

```text
DATABASE_URL
AUTH_SECRET
API_KEY
STORAGE_SECRET
```

Les valeurs réelles ne doivent pas être commitées dans Git.

Un fichier d'exemple peut être fourni :

```text
.env.example
```

avec uniquement les noms de variables nécessaires.

---

# 8. Git

Les fichiers contenant des secrets doivent être exclus du versionnement.

Le `.gitignore` doit notamment protéger les fichiers d'environnement appropriés.

Avant un commit, vérifier qu'aucun secret n'est accidentellement ajouté.

---

# 9. Base de données

L'accès à PostgreSQL doit être protégé.

L'application doit :

* utiliser des credentials sécurisés ;
* limiter les permissions ;
* ne pas exposer directement la base de données au navigateur ;
* utiliser des requêtes correctement paramétrées ;
* protéger les migrations ;
* contrôler les accès.

Le navigateur ne doit jamais communiquer directement avec PostgreSQL.

Flux attendu :

```text
Navigateur
    ↓
Next.js / Backend
    ↓
ORM / Data Access
    ↓
PostgreSQL
```

---

# 10. Validation des données

Toutes les données provenant de l'utilisateur doivent être considérées comme non fiables.

Cela concerne notamment :

* formulaires ;
* paramètres URL ;
* query parameters ;
* données JSON ;
* uploads ;
* messages ;
* contenus administratifs.

La validation doit être effectuée côté serveur.

Une validation frontend peut améliorer l'expérience utilisateur mais ne constitue pas une protection suffisante.

---

# 11. Validation des formulaires

Les formulaires doivent vérifier :

* types ;
* formats ;
* longueur ;
* champs obligatoires ;
* valeurs autorisées ;
* contraintes métier.

Exemple :

```text
Formulaire
    ↓
Validation client
    ↓
Requête serveur
    ↓
Validation serveur
    ↓
Traitement
```

---

# 12. Protection contre les injections

Les entrées utilisateur ne doivent jamais être concaténées dangereusement dans des requêtes.

L'ORM ou les mécanismes de requêtes paramétrées doivent être privilégiés.

Les données utilisateur doivent également être correctement traitées avant affichage.

---

# 13. XSS

Les contenus provenant des utilisateurs ou de l'administration doivent être traités avec prudence.

Le système doit éviter qu'un contenu puisse exécuter du JavaScript arbitraire dans le navigateur.

Une attention particulière doit être portée aux :

* contenus HTML ;
* contenus riches ;
* descriptions de projets ;
* messages ;
* champs administrables.

Le rendu HTML brut ne doit être autorisé que lorsqu'il est réellement nécessaire et correctement contrôlé.

---

# 14. CSRF

Les actions modifiant des données doivent être protégées contre les requêtes non autorisées.

Les mécanismes de protection dépendront du système d'authentification et des mécanismes utilisés par Next.js.

Une action sensible ne doit jamais être considérée comme sûre simplement parce qu'elle est cachée dans l'interface.

---

# 15. Rate limiting

Les endpoints exposés publiquement doivent pouvoir être protégés contre les abus.

Une attention particulière doit être portée à :

* formulaire de contact ;
* authentification ;
* récupération de compte ;
* endpoints publics ;
* actions coûteuses.

Le rate limiting exact sera choisi selon l'infrastructure finale.

---

# 16. Formulaire de contact

Le formulaire de contact est une surface importante d'attaque.

Il doit notamment prévoir :

* validation ;
* longueur maximale ;
* protection anti-spam ;
* rate limiting ;
* nettoyage des données ;
* protection contre les injections ;
* limitation des contenus abusifs.

Le message reçu doit être considéré comme une donnée externe non fiable.

---

# 17. Messages

Les messages reçus par le portfolio peuvent contenir des informations personnelles.

Ils doivent donc être traités comme des données privées.

Ils ne doivent pas être affichés publiquement.

L'administration doit être le seul endroit prévu pour consulter ces messages.

---

# 18. Données personnelles

L'application doit limiter la collecte de données personnelles au strict nécessaire.

Exemples :

* nom ;
* email ;
* téléphone si nécessaire ;
* message ;
* informations de collaboration.

Il ne faut pas collecter des données simplement parce qu'elles sont techniquement possibles à collecter.

---

# 19. Confidentialité

Les données privées doivent être séparées des données publiques.

Exemple :

```text
PUBLIC
├── projets
├── compétences
├── parcours
└── connaissances publiées

PRIVÉ
├── comptes administrateurs
├── messages
├── informations internes
└── paramètres sensibles
```

---

# 20. Uploads

Si l'application permet d'envoyer des fichiers, ceux-ci doivent être contrôlés.

Les contrôles peuvent inclure :

* type MIME ;
* extension ;
* taille maximale ;
* nom de fichier ;
* contenu ;
* emplacement de stockage.

Les fichiers ne doivent pas être exécutables comme du code serveur.

Les fichiers uploadés doivent être stockés dans un emplacement approprié.

---

# 21. Images

Les images doivent être contrôlées avant stockage.

Il faut notamment prévoir :

* taille maximale ;
* formats acceptés ;
* optimisation ;
* génération éventuelle de variantes ;
* stockage approprié.

L'application ne doit pas accepter arbitrairement n'importe quel fichier sous prétexte qu'il possède une extension d'image.

---

# 22. Suppression

Les actions destructives doivent être protégées.

Exemples :

* suppression d'un projet ;
* suppression d'un média ;
* suppression d'un message ;
* suppression d'une question.

Une confirmation doit être demandée lorsque le risque de suppression accidentelle est important.

Lorsque pertinent, une suppression logique peut être utilisée.

---

# 23. Permissions minimales

Chaque partie du système doit disposer uniquement des permissions nécessaires.

Exemple :

```text
Public
→ lecture des données publiques

Admin
→ lecture + création + modification + suppression selon permissions

Base de données
→ accessible uniquement par le backend
```

Le principe du moindre privilège doit être appliqué.

---

# 24. Sécurité du dashboard

Le dashboard d'administration doit être considéré comme une zone sensible.

Il doit notamment protéger :

* authentification ;
* sessions ;
* actions CRUD ;
* fichiers ;
* paramètres ;
* messages ;
* utilisateurs ;
* données privées.

Les contrôles doivent exister côté serveur et non uniquement dans l'interface.

---

# 25. Erreurs

Les messages d'erreur affichés aux utilisateurs ne doivent pas révéler inutilement :

* chemins internes ;
* secrets ;
* credentials ;
