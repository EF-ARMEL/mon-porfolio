# AI Workflow — Utilisation de l'IA dans le développement

## 1. Rôle du document

Ce document définit la manière dont l'intelligence artificielle est intégrée dans le travail de développement présenté par le portfolio.

L'objectif n'est pas de présenter l'IA comme un remplacement du développeur.

L'objectif est de montrer une méthode de développement dans laquelle :

* le développeur définit le problème ;
* l'IA assiste le raisonnement et l'exécution ;
* les outils spécialisés fournissent du contexte ;
* les connaissances sont conservées ;
* le résultat est vérifié ;
* le développeur reste responsable de la décision finale.

---

# 2. Positionnement

Le portfolio doit montrer une utilisation structurée de l'IA.

Il faut éviter de communiquer l'image :

> « Je demande du code à une IA et je le copie. »

Le message doit plutôt être :

> « J'utilise l'IA comme un environnement de développement augmenté, avec du contexte, des outils, des connaissances et une validation humaine. »

L'IA fait partie de la méthode de travail.

Elle ne remplace pas les fondamentaux du développement.

---

# 3. Architecture du workflow

Le workflow principal peut être représenté ainsi :

```text id="2q2g8a"
                    ┌──────────────┐
                    │ Développeur  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Claude    │
                    │     Code     │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
          MCPs          Skills       Knowledge
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                    ┌──────────────┐
                    │    Projet    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Validation  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Amélioration │
                    └──────────────┘
```

Cette représentation est conceptuelle.

L'interface finale peut utiliser une représentation beaucoup plus immersive.

---

# 4. Développeur

Le développeur reste le point de départ et le point de contrôle du workflow.

Il doit notamment :

* définir le besoin ;
* comprendre le problème ;
* fournir le contexte ;
* choisir les priorités ;
* prendre les décisions techniques ;
* vérifier le résultat ;
* accepter ou refuser les modifications ;
* maintenir la qualité du projet.

Le développeur reste responsable du résultat final.

---

# 5. Claude Code

Claude Code représente l'agent de développement utilisé pour travailler directement avec le projet.

Il peut assister sur :

* compréhension du code ;
* analyse ;
* implémentation ;
* correction ;
* refactoring ciblé ;
* documentation ;
* tests ;
* recherche ;
* vérification.

Cependant, l'agent doit travailler à partir du contexte réel du projet.

Il ne doit pas inventer l'état du code.

---

# 6. Contexte projet

Avant une modification importante, l'agent doit comprendre :

* architecture ;
* conventions ;
* design system ;
* objectifs produit ;
* contraintes ;
* décisions précédentes ;
* documentation pertinente.

Les fichiers `CLAUDE.md` et `docs/` servent de contexte persistant au projet.

Le contexte doit être consulté avant les changements importants.

---

# 7. MCP

Les MCP permettent à Claude d'accéder à des capacités ou informations spécialisées.

Ils peuvent notamment fournir :

* documentation ;
* outils de développement ;
* icônes ;
* animations ;
* navigateur ;
* design ;
* base de données ;
* outils spécialisés.

Un MCP doit être utilisé lorsqu'il apporte une réelle valeur.

Il ne faut pas utiliser un MCP simplement parce qu'il est disponible.

Principe :

> Un outil doit résoudre un problème concret.

---

# 8. Skills

Les Skills définissent des méthodes ou comportements spécialisés.

Ils permettent notamment de fournir à l'agent :

* procédures ;
* standards ;
* règles de conception ;
* méthodes de vérification ;
* bonnes pratiques ;
* workflows spécialisés.

Les Skills ne remplacent pas la compréhension du projet.

Ils complètent le contexte du projet.

---

# 9. Second Brain

Obsidian Second Brain représente la mémoire de connaissances du développeur.

Il peut conserver :

* connaissances techniques ;
* bonnes pratiques ;
* décisions ;
* erreurs et solutions ;
* préférences de conception ;
* projets précédents ;
* méthodes de travail ;
* ressources importantes.

Le Second Brain doit permettre de réutiliser les connaissances pertinentes dans les futurs projets.

---

# 10. Mémoire et projet

Il faut distinguer :

### Documentation du projet

Elle explique :

> Comment fonctionne ce projet ?

### Second Brain

Il conserve :

> Qu'est-ce que j'ai appris et que je peux réutiliser ?

Exemple :

```text id="a9x4fd"
docs/architecture.md
        ↓
Architecture de ce portfolio

Second Brain
        ↓
Principes d'architecture réutilisables
```

Les deux systèmes sont complémentaires.

---

# 11. Recherche de connaissances

Lorsqu'un problème nécessite des connaissances déjà acquises, l'agent doit pouvoir rechercher dans le Second Brain.

Exemples :

* une erreur déjà rencontrée ;
* une préférence de design ;
* une méthode de développement ;
* une décision passée ;
* une bonne pratique ;
* une technologie déjà étudiée.

Le système doit privilégier les connaissances pertinentes plutôt que de rechercher inutilement tout le contenu disponible.

---

# 12. Documentation officielle

Pour les technologies versionnées ou sensibles aux changements, les sources officielles doivent être privilégiées.

Exemples :

* Next.js ;
* React ;
* TypeScript ;
* Tailwind CSS ;
* GSAP ;
* React Three Fiber ;
* Three.js ;
* PostgreSQL ;
* ORM utilisé.

Une réponse provenant d'une ancienne version ne doit pas être considérée comme fiable simplement parce qu'elle semble correcte.

---

# 13. Workflow de développement

Le workflow général est :

```text id="d71l6u"
1. Comprendre
       ↓
2. Inspecter
       ↓
3. Consulter le contexte
       ↓
4. Planifier
       ↓
5. Implémenter
       ↓
6. Vérifier
       ↓
7. Tester
       ↓
8. Corriger
       ↓
9. Documenter si nécessaire
```

Il ne faut pas commencer à modifier le code avant d'avoir compris le problème.

---

# 14. Questions bloquantes

Avant une implémentation, l'agent doit identifier les informations réellement nécessaires.

S'il manque une information qui empêcherait une implémentation correcte, il doit poser la question.

Il ne doit pas multiplier les questions inutiles.

Principe :

> Poser uniquement les questions qui bloquent réellement la suite.

---

# 15. Modification ciblée

L'IA doit modifier uniquement ce qui est nécessaire.

Éviter :

* refactoring global non demandé ;
* changement de stack sans raison ;
* remplacement inutile de composants ;
* réorganisation massive ;
* ajout de dépendances sans justification.

Une tâche doit produire le changement attendu avec le minimum de perturbation.

---

# 16. Validation du code

Une implémentation générée ou assistée par IA doit être vérifiée.

La validation peut comprendre :

* TypeScript ;
* lint ;
* tests ;
* build ;
* tests fonctionnels ;
* tests navigateur ;
* inspection visuelle.

La compilation seule ne prouve pas que l'interface fonctionne correctement.

---

# 17. Validation visuelle

Pour les changements UI, l'agent doit vérifier le rendu réel.

Il doit notamment contrôler :

* responsive ;
* spacing ;
* typographie ;
* couleurs ;
* animations ;
* interactions ;
* erreurs visuelles ;
* cohérence avec le design system.

Lorsque pertinent, Playwright peut être utilisé.

---

# 18. Validation fonctionnelle

Les fonctionnalités importantes doivent être vérifiées dans leur contexte réel.

Exemple :

```text id="u1g73k"
Formulaire contact
       ↓
Validation
       ↓
Envoi
       ↓
Backend
       ↓
Base de données
       ↓
Message dans l'administration
```

Il ne suffit pas de vérifier uniquement l'interface du formulaire.

---

# 19. Gestion des erreurs

Lorsqu'une erreur apparaît, le workflow doit être :

```text id="o2h6pf"
Erreur
  ↓
Reproduction
  ↓
Identification de la cause
  ↓
Correction ciblée
  ↓
Vérification
  ↓
Documentation si réutilisable
```

Il faut éviter de masquer une erreur sans comprendre sa cause.

---

# 20. Capture des connaissances

Lorsqu'une information possède une valeur réutilisable, elle peut être enregistrée dans le Second Brain.

Exemples :

* solution à une erreur non triviale ;
* nouvelle bonne pratique ;
* découverte importante ;
* décision architecturale réutilisable ;
* méthode efficace ;
* connaissance importante sur une technologie.

Les actions temporaires ou triviales ne doivent pas être enregistrées inutilement.

---

# 21. Relation avec le portfolio

Le portfolio peut représenter ce workflow visuellement.

Exemple :

```text id="m58hdu"
                    DÉVELOPPEUR
                         │
                         ▼
                    PROBLÈME
                         │
                         ▼
                    CLAUDE CODE
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
           MCP         SKILLS     KNOWLEDGE
            │            │            │
            └────────────┼────────────┘
                         ▼
                      CODE
                         │
                         ▼
                     TESTS
                         │
                         ▼
                    VALIDATION
                         │
                         ▼
                      PRODUIT
```

La représentation finale peut être interactive.

---

# 22. Interaction avec le visiteur

La section AI × Development peut permettre au visiteur d'explorer chaque étape.

Par exemple :

```text id="l8g7la"
[ Développeur ]

Clique
   ↓

[ Claude Code ]

Clique
   ↓

[ MCP ]

Clique
   ↓

[ Skills ]

Clique
   ↓

[ Knowledge ]

...
```

Chaque étape peut révéler :

* rôle ;
* exemple ;
* bénéfice ;
* outil utilisé ;
* relation avec les autres étapes.

---

# 23. 3D et workflow AI

La 3D peut représenter le workflow lorsqu'elle apporte une réelle valeur.

Exemples :

* nœuds ;
* connexions ;
* flux ;
* environnement abstrait ;
* éléments représentant les différentes couches.

Cependant, la 3D ne doit pas être obligatoire.

Une version 2D doit rester possible.

---

# 24. Animation du workflow

Les animations doivent représenter des relations réelles.

Exemple :

```text id="t6b7uk"
Développeur
     ↓
Question
     ↓
Claude Code
     ↓
Contexte
     ↓
Outils
     ↓
Implémentation
     ↓
Validation
```

L'animation doit montrer le flux.

Elle ne doit pas être une succession de mouvements décoratifs.

---

# 25. Transparence

La section doit rester honnête.

Elle ne doit pas prétendre que l'IA :

* comprend parfaitement tous les problèmes ;
* produit toujours du code correct ;
* remplace les connaissances techniques ;
* remplace les tests ;
* remplace la responsabilité du développeur.

Le portfolio doit montrer une relation de collaboration entre humain et IA.

---

# 26. Limites de l'IA

Les limites peuvent être présentées comme une partie du workflow.

Exemples :

* hallucinations ;
* erreurs de raisonnement ;
* contexte incomplet ;
* API obsolète ;
* code incorrect ;
* mauvaise interprétation du besoin ;
* dépendance excessive à l'automatisation.

La validation humaine permet de réduire ces risques.

---

# 27. Qualité

L'utilisation de l'IA ne doit pas réduire les exigences de qualité.

Le workflow doit conserver :

```text id="2m6bwr"
Compréhension
+
Architecture
+
Code
+
Tests
+
Validation
+
Documentation
```

L'IA accélère certaines étapes.

Elle ne supprime pas les responsabilités techniques.

---

# 28. Sécurité et IA

Les informations sensibles ne doivent pas être envoyées à des outils d'IA sans nécessité et sans vérifier les règles applicables.

Cela concerne notamment :

* secrets ;
* mots de passe ;
* tokens ;
* clés API ;
* données personnelles ;
* données de production ;
* informations confidentielles.

Les fichiers `.env` et secrets doivent être protégés.

---

# 29. Dépendance aux outils

Le workflow doit rester compréhensible même si un outil change.

Si Claude Code, un MCP ou un Skill devient indisponible, le développeur doit conserver suffisamment de connaissances pour continuer le développement.

Le système doit augmenter les capacités du développeur, pas supprimer sa compréhension du projet.

---

# 30. Évolution du workflow

Le workflow AI peut évoluer.

De nouveaux outils peuvent être ajoutés lorsque leur valeur est démontrée.

Avant d'ajouter un outil :

1. identifier le problème ;
2. vérifier si un outil existant peut déjà le résoudre ;
3. évaluer le coût ;
4. évaluer la fiabilité ;
5. vérifier la sécurité ;
6. vérifier l'intégration avec le workflow existant.

---

# 31. Principe final

Le système AI du portfolio doit communiquer une idée simple :

```text id="z5bqkv"
Humain
   +
Connaissance
   +
IA
   +
Outils
   +
Validation
   =
Développement augmenté
```

L'objectif n'est pas de montrer combien d'outils sont utilisés.

L'objectif est de montrer **comment ces outils sont organisés pour produire un meilleur travail**.

Le portfolio doit présenter l'IA comme une partie d'une méthode de développement structurée, contrôlée et évolutive.
