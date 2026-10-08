# Portfolio — Système d'animations et de Motion Design

## 1. Rôle du document

Ce document définit les principes et règles concernant :

* animations ;
* transitions ;
* scroll ;
* interactions ;
* micro-interactions ;
* storytelling animé ;
* mouvement des éléments ;
* performances liées aux animations.

L'objectif est de créer une expérience immersive et cohérente sans transformer le portfolio en démonstration d'effets gratuits.

---

# 2. Philosophie du mouvement

Le mouvement doit avoir une fonction.

Une animation peut servir à :

* attirer l'attention ;
* guider le regard ;
* expliquer une relation ;
* révéler une information ;
* créer une transition ;
* renforcer une identité ;
* donner une sensation de profondeur ;
* raconter une histoire.

Une animation qui n'apporte aucune valeur doit être supprimée ou simplifiée.

---

# 3. Bibliothèque principale

GSAP est la bibliothèque principale prévue pour les animations complexes.

Plugins particulièrement pertinents :

* ScrollTrigger ;
* éventuellement d'autres plugins GSAP si leur utilisation est réellement nécessaire.

Ne pas utiliser plusieurs bibliothèques d'animation pour résoudre le même problème.

Pour les animations simples, privilégier :

* CSS ;
* transitions CSS ;
* animations CSS ;
* API natives du navigateur ;

lorsque cela suffit.

---

# 4. Scroll

Le scroll constitue un élément important de l'expérience du portfolio.

Il peut être utilisé pour créer :

* storytelling ;
* parallaxe ;
* pinning ;
* transformations ;
* révélations ;
* transitions ;
* changement de profondeur ;
* séquences horizontales ;
* scènes immersives.

Cependant, le scroll doit rester prévisible pour l'utilisateur.

---

# 5. Scroll storytelling

Certaines sections peuvent être conçues comme des scènes.

Principe général :

```text
Entrée dans la section
        ↓
Préparation visuelle
        ↓
Animation principale
        ↓
Transformation / interaction
        ↓
Conclusion visuelle
        ↓
Sortie de la section
```

Une section ne doit pas nécessairement utiliser tous ces états.

La durée et la complexité doivent dépendre du contenu.

---

# 6. Horizontal scrolling

La section des projets peut utiliser une expérience de scrolling horizontal.

Concept prévu :

```text
Scroll vertical
      ↓
Entrée dans la section
      ↓
Verrouillage temporaire de la progression verticale
      ↓
Déplacement des projets de droite vers la gauche
      ↓
Les cartes peuvent se chevaucher
      ↓
Fin de la séquence
      ↓
Retour au scroll vertical normal
```

Cette interaction doit être étudiée et implémentée avec soin.

Elle ne doit pas empêcher l'utilisateur :

* de comprendre sa position ;
* de naviguer ;
* de revenir en arrière ;
* d'utiliser le site sur mobile.

---

# 7. Pinning

GSAP ScrollTrigger peut être utilisé pour maintenir temporairement un élément ou une section dans le viewport.

Le pinning doit être utilisé lorsque le contenu nécessite une séquence contrôlée.

Éviter de multiplier les sections épinglées.

Trop de pinning peut donner une sensation de blocage ou de lenteur.

---

# 8. Parallaxe

La parallaxe peut être utilisée pour créer une sensation de profondeur.

Elle peut être appliquée à :

* images ;
* arrière-plans ;
* formes ;
* typographie.

Les différences de vitesse doivent rester maîtrisées.

Éviter les déplacements excessifs qui rendent l'interface instable.

---

# 9. Révélation des éléments

Les éléments peuvent apparaître progressivement grâce à :

* opacity ;
* translate ;
* scale ;
* clip-path ;
* mask ;
* transformation typographique.

La révélation doit respecter la hiérarchie du contenu.

Exemple :

```text
Titre
  ↓
Sous-titre
  ↓
Contenu
  ↓
Action
```

Les animations ne doivent pas ralentir inutilement l'accès à l'information.

---

# 10. Typographie animée

La typographie peut être animée de manière expressive.

Techniques possibles :

* révélation caractère par caractère ;
* révélation par mot ;
* déplacement ;
* découpage en lignes ;
* changement de taille ;
* morphing ;
* clip-path ;
* variation de position.

Ces techniques doivent rester lisibles et accessibles.

Ne pas utiliser une animation de texte complexe lorsque le texte est une information essentielle que l'utilisateur doit lire rapidement.

---

# 11. Transitions entre sections

Les transitions peuvent permettre de transformer une section en une autre.

Exemples :

* changement progressif de background ;
* déplacement d'éléments ;
* transformation de formes ;
* transition typographique ;
* passage d'une composition à une autre.

Les transitions doivent créer une continuité narrative.

Éviter les transitions qui ralentissent artificiellement chaque changement de section.

---

# 12. Hero

Le Hero doit être l'une des premières expériences visuelles fortes.

Il peut utiliser :

* typographie animée ;
* mouvement ;
* profondeur ;
* élément immersif ;
* lumière ;
* interaction avec le curseur ;
* scroll progressif.

Le Hero ne doit cependant pas empêcher le visiteur d'identifier rapidement :

* qui est Franck ;
* ce qu'il fait ;
* ce qu'il peut explorer.

---

# 13. Projets

La section projets peut être l'une des expériences les plus immersives.

Elle peut utiliser :

* horizontal scrolling ;
* cartes qui se déplacent ;
* superposition ;
* changement d'échelle ;
* profondeur ;
* image qui devient plein écran ;
* transition vers le détail d'un projet.

L'animation doit mettre les projets en valeur.

Elle ne doit pas masquer les informations essentielles.

---

# 14. Section IA

La section consacrée à l'IA peut utiliser une représentation visuelle du workflow :

```text
Idée
 ↓
Recherche
 ↓
Claude Code
 ↓
MCP
 ↓
Skills
 ↓
Second Brain
 ↓
Code
 ↓
Validation
 ↓
Produit
```

Cette séquence peut être animée afin de montrer le processus.

L'objectif est de rendre visible la méthode de travail, pas simplement d'afficher une liste d'outils.

---

# 15. Developer Challenge

Les interactions du défi développeur peuvent utiliser :

* états de réponse ;
* transitions ;
* feedback visuel ;
* progression ;
* micro-interactions ;
* animations de réussite ou d'erreur.

Le feedback doit être compréhensible.

Les animations ne doivent pas cacher la réponse ou empêcher la navigation.

---

# 16. Micro-interactions

Les micro-interactions peuvent être utilisées pour :

* boutons ;
* liens ;
* curseur ;
* navigation ;
* formulaires ;
* cartes ;
* éléments interactifs.

Exemples :

* changement de couleur ;
* légère translation ;
* scale ;
* underline animé ;
* icône animée ;
* feedback de formulaire.

Les micro-interactions doivent rester rapides.

---

# 17. Curseur

Un curseur personnalisé peut être envisagé sur desktop.

Il peut réagir à :

* liens ;
* boutons ;
* éléments immersifs ;
* projets ;
* zones interactives.

Cependant :

* il ne doit jamais remplacer le curseur natif sur mobile ;
* il ne doit pas empêcher l'utilisation normale ;
* il ne doit pas introduire de latence ;
* il doit être désactivable lorsque nécessaire.

---

# 18. Smooth scrolling

Une solution comme Lenis peut être utilisée si elle améliore réellement l'expérience.

Elle ne doit pas être installée uniquement parce qu'elle est populaire.

Si le smooth scrolling est utilisé :

* vérifier la compatibilité avec GSAP ScrollTrigger ;
* vérifier le responsive ;
* vérifier l'accessibilité ;
* vérifier les performances ;
* vérifier la navigation clavier.

---

# 19. Easing

Les animations doivent utiliser des courbes d'accélération cohérentes.

Éviter de choisir un easing différent pour chaque animation sans raison.

Le système doit privilégier :

* mouvements naturels ;
* accélérations maîtrisées ;
* décélérations lisibles ;
* transitions fluides.

Les animations importantes peuvent avoir leur propre easing lorsque cela sert la narration.

---

# 20. Durées

Les durées doivent dépendre de la fonction de l'animation.

### Micro-interaction

Courte.

### Apparition d'un élément

Courte à moyenne.

### Transition de section

Moyenne.

### Séquence de storytelling

Peut être plus longue lorsque le scroll contrôle la progression.

Les animations ne doivent jamais être longues uniquement pour donner une impression de sophistication.

---

# 21. Performance

Les animations doivent privilégier les propriétés qui peuvent être animées efficacement.

Préférer notamment :

* transform ;
* opacity.

Éviter autant que possible les animations répétées provoquant des recalculs de layout inutiles.

Surveiller :

* CPU ;
* GPU ;
* mémoire ;
* nombre d'éléments animés ;
* fréquence des événements scroll ;
* complexité des timelines.

---

# 22. Mobile

Le mobile ne doit pas recevoir automatiquement toutes les animations desktop.

Certaines expériences peuvent être :

* simplifiées ;
* raccourcies ;
* remplacées ;
* désactivées.

Une animation complexe sur desktop peut devenir une interaction plus simple sur mobile.

La lisibilité et l'utilisation doivent toujours passer avant l'effet.

---

# 23. Réduction des mouvements

Le site doit respecter :

```css
@media (prefers-reduced-motion: reduce)
```

Lorsque l'utilisateur demande une réduction des mouvements :

* réduire les animations ;
* supprimer les mouvements non essentiels ;
* éviter les séquences longues ;
* conserver l'accès au contenu.

Les informations importantes doivent rester accessibles sans animation.

---

# 24. États d'animation

Les composants interactifs doivent définir leurs états lorsqu'ils sont pertinents :

```text
Initial
 ↓
Hover
 ↓
Active
 ↓
Focus
 ↓
Loading
 ↓
Success / Error
```

Tous les composants n'ont pas besoin de tous ces états.

---

# 25. Synchronisation

Les animations liées au scroll doivent être synchronisées avec le contexte visuel.

Éviter :

* animations qui se terminent avant que l'utilisateur ait compris leur contenu ;
* animations qui continuent après la section ;
* éléments qui apparaissent trop tôt ;
* éléments qui apparaissent trop tard.

Le rythme doit suivre le contenu.

---

# 26. Gestion du cycle de vie

Les animations doivent être correctement initialisées et nettoyées.

Avec React et GSAP :

* utiliser les mécanismes adaptés au cycle de vie React ;
* éviter les timelines persistantes inutiles ;
* nettoyer les animations lorsque le composant est démonté ;
* éviter les listeners non supprimés ;
* éviter les instances multiples.

Une animation ne doit pas provoquer de fuite mémoire ou de comportement cumulatif lors des navigations.

---

# 27. Architecture des animations

Les animations peuvent être organisées selon leur niveau.

```text
animations/
├── primitives/
├── transitions/
├── scroll/
├── typography/
└── sections/
```

Cette structure n'est qu'une convention indicative.

Ne pas créer tous ces dossiers avant qu'ils soient réellement nécessaires.

---

# 28. Une animation = une intention

Avant d'implémenter une animation importante, identifier :

1. ce qu'elle doit faire ;
2. pourquoi elle existe ;
3. quel élément elle met en valeur ;
4. comment elle se termine ;
5. comment elle fonctionne sur mobile ;
6. ce qu'il se passe avec `prefers-reduced-motion`.

Si ces questions ne peuvent pas être répondues, l'animation doit être reconsidérée.

---

# 29. Signature par section

Les grandes sections peuvent posséder une signature visuelle.

Exemples :

### Hero

Typographie + profondeur.

### Parcours

Progression / timeline animée.

### Projets

Horizontal scrolling / transformation.

### IA

Workflow animé.

### Developer Challenge

Interaction et feedback.

### Dreams

Progression vers le futur.

Ces signatures sont des directions, pas des contraintes définitives.

Elles doivent être validées pendant la conception réelle.

---

# 30. Vérification

Une animation importante doit être testée :

* desktop ;
* tablette ;
* mobile ;
* clavier ;
* `prefers-reduced-motion` ;
* différentes vitesses de scroll ;
* entrée et sortie de section ;
* navigation répétée ;
* retour en arrière.

Pour les animations complexes, utiliser Playwright et les outils de vérification visuelle lorsque cela est pertinent.

---

# 31. Principe final

Le portfolio doit donner une impression de mouvement maîtrisé.

L'objectif n'est pas :

> "mettre beaucoup d'animations."

L'objectif est :

> "faire du mouvement un langage visuel du portfolio."

Le mouvement doit renforcer :

**contenu → narration → interaction → identité.**

Lorsque l'animation nuit à l'un de ces éléments, elle doit être simplifiée.
