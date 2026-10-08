# Portfolio — Design System

## 1. Rôle du Design System

Ce document définit l'identité visuelle et les principes d'interface du portfolio.

Toute nouvelle interface, section, animation ou composant visuel doit respecter ce document.

Le Design System doit garantir une identité cohérente entre :

* le site public ;
* les différentes sections ;
* les interactions ;
* les composants ;
* le mode sombre ;
* le mode clair ;
* les expériences 3D.

Le design doit être reconnaissable comme appartenant à ce portfolio.

---

# 2. Direction artistique

## 2.1 Identité

L'identité visuelle repose principalement sur :

* noir ;
* orange ;
* jaune ;
* typographie forte ;
* grands espaces ;
* compositions audacieuses ;
* profondeur ;
* mouvement ;
* interactions ;
* contraste important.

L'objectif est de créer une identité :

* moderne ;
* expressive ;
* technique ;
* personnelle ;
* immersive ;
* mémorable.

Le portfolio ne doit pas ressembler à un template SaaS générique.

---

## 2.2 Référence esthétique

Le portfolio peut s'inspirer de sites expérimentaux et de portfolios créatifs présentant :

* storytelling ;
* scroll immersif ;
* animations avancées ;
* typographie expressive ;
* transitions de sections ;
* 3D ;
* interactions.

Le site suivant constitue une référence d'inspiration :

https://www.thakursameershetty.com/

Cette référence sert uniquement à étudier des principes d'expérience et d'interaction.

Ne pas reproduire directement :

* son design ;
* ses textes ;
* ses compositions ;
* ses animations ;
* son identité visuelle ;
* son code.

Le portfolio doit développer sa propre direction artistique.

---

# 3. Palette principale

## 3.1 Noir

Couleur principale du portfolio :

```text
#000000
```

Utilisation :

* arrière-plan principal ;
* grandes zones visuelles ;
* sections immersives ;
* contexte sombre.

---

## 3.2 Orange principal

```text
#FF6A00
```

Utilisation :

* CTA ;
* éléments interactifs importants ;
* accents ;
* liens importants ;
* éléments graphiques ;
* certaines animations.

---

## 3.3 Orange secondaire

```text
#FF8A00
```

Utilisation :

* variations d'accent ;
* gradients ;
* états intermédiaires ;
* éléments décoratifs contrôlés.

---

## 3.4 Jaune principal

```text
#FFD000
```

Utilisation :

* highlights ;
* hover ;
* informations importantes ;
* éléments interactifs secondaires ;
* accents lumineux.

---

## 3.5 Jaune clair

```text
#FFE66D
```

Utilisation :

* effets lumineux ;
* arrière-plans légers ;
* contrastes secondaires ;
* détails graphiques.

---

## 3.6 Couleurs de texte

Les textes ne doivent pas être systématiquement blancs purs.

Préférer selon le contexte :

```text
#FFFFFF
#F5F5F5
#D4D4D4
#A3A3A3
```

Hiérarchie indicative :

* titre principal : `#FFFFFF`
* titre secondaire : `#FFFFFF`
* texte principal : `#F5F5F5`
* texte secondaire : `#D4D4D4`
* texte discret : `#A3A3A3`

---

# 4. Utilisation des couleurs

Le orange et le jaune sont des couleurs d'accent.

Ils ne doivent pas être utilisés partout.

Éviter :

* boutons orange dans chaque section ;
* textes entièrement orange ;
* arrière-plans entièrement jaunes ;
* gradients orange/jaune omniprésents ;
* surcharge visuelle.

Le noir doit rester dominant.

Le orange doit attirer l'attention.

Le jaune doit mettre en évidence.

La couleur doit créer une hiérarchie visuelle.

---

# 5. Gradients

Les gradients orange → jaune peuvent être utilisés lorsque cela renforce l'expérience.

Exemple de direction :

```text
#FF6A00 → #FFD000
```

Les gradients doivent rester contrôlés.

Ne pas transformer chaque élément en gradient.

Ils peuvent être utilisés notamment pour :

* textes importants ;
* effets lumineux ;
* éléments immersifs ;
* transitions ;
* backgrounds expérimentaux.

---

# 6. Typographie

## 6.1 Titres

La typographie principale des grands titres est :

**Archivo Black**

Configuration de référence :

```css
font-family: "Archivo Black", sans-serif;
font-weight: 400;
font-style: normal;
```

Archivo Black doit principalement être utilisée pour :

* Hero ;
* grands titres ;
* titres de sections importantes ;
* mots-clés ;
* éléments typographiques de forte identité.

Ne pas utiliser Archivo Black pour tous les textes.

---

## 6.2 Texte courant

Les textes doivent utiliser une police sans-serif lisible.

Une police comme :

* Inter ;
* Manrope ;
* DM Sans ;

peut être utilisée selon la configuration finale du projet.

Le choix définitif doit rester cohérent et ne pas multiplier inutilement les polices.

---

## 6.3 Hiérarchie

La typographie doit créer une hiérarchie claire entre :

* titre principal ;
* titre de section ;
* sous-titre ;
* texte courant ;
* métadonnées ;
* labels ;
* boutons.

Les grands titres peuvent être volontairement très imposants sur desktop.

Sur mobile, leur taille doit être adaptée afin d'éviter :

* débordements ;
* lignes illisibles ;
* compositions cassées.

---

# 7. Typographie expressive

La typographie peut devenir un élément graphique.

Exemples :

* très grands mots ;
* titres qui dépassent légèrement une grille ;
* mots animés ;
* changement de taille ;
* apparition progressive ;
* texte masqué puis révélé ;
* contraste entre texte massif et texte léger.

Ces techniques doivent être utilisées pour raconter quelque chose.

Elles ne doivent pas être ajoutées uniquement pour faire "wow".

---

# 8. Formes

Le design peut utiliser des formes :

* organiques ;
* arrondies ;
* massives ;
* géométriques ;
* fluides.

Les cartes et composants peuvent avoir des bordures arrondies lorsque cela sert la composition.

Éviter cependant de mettre systématiquement un `border-radius` important sur chaque élément.

La forme doit dépendre du rôle du composant.

---

# 9. Boutons

Les boutons doivent avoir une hiérarchie claire.

### Primary

Utilisation :

* action principale ;
* contact ;
* découverte d'un projet ;
* action importante.

Le orange peut être utilisé comme couleur principale.

### Secondary

Utilisation :

* action secondaire ;
* navigation complémentaire.

Peut utiliser :

* fond transparent ;
* bordure ;
* texte clair ;
* accent orange ou jaune.

### Interaction

Les boutons doivent avoir des états :

* normal ;
* hover ;
* focus ;
* active ;
* disabled lorsque nécessaire.

Les interactions doivent être perceptibles sans être excessives.

---

# 10. Navigation

La navigation doit rester simple malgré l'aspect expérimental du portfolio.

Elle doit permettre de comprendre :

* où se trouve le visiteur ;
* où aller ;
* comment revenir ;
* comment accéder au contact.

Les animations de navigation ne doivent jamais rendre l'interface confuse.

---

# 11. Cartes

Les cartes ne doivent pas devenir le composant universel du portfolio.

Une carte doit être utilisée lorsqu'elle apporte une vraie structure au contenu.

Les projets peuvent utiliser des compositions plus libres :

* grandes images ;
* typographie ;
* superposition ;
* scrolling horizontal ;
* profondeur ;
* interactions.

Éviter la répétition mécanique :

```text
[image]
[titre]
[description]
[bouton]
```

pour tous les projets.

---

# 12. Espacement

Le design doit utiliser beaucoup d'espace lorsque cela améliore :

* respiration ;
* hiérarchie ;
* narration ;
* impact visuel.

Les sections importantes peuvent avoir des espaces verticaux généreux.

Éviter cependant les espaces excessifs qui ralentissent inutilement la navigation.

Les espacements doivent être cohérents avec le système Tailwind utilisé dans le projet.

---

# 13. Grille

Une grille cohérente doit être utilisée pour organiser les compositions.

Elle peut être :

* classique ;
* asymétrique ;
* expérimentale ;
* plein écran.

La grille ne doit pas empêcher les compositions créatives.

Les éléments importants peuvent volontairement sortir de la grille lorsque cela est justifié visuellement.

---

# 14. Images

Les images doivent être utilisées comme éléments narratifs.

Éviter les images génériques simplement destinées à remplir un espace.

Pour les projets :

* privilégier les captures réelles ;
* montrer les interfaces ;
* montrer les détails importants ;
* utiliser des mockups lorsque cela améliore la présentation.

Les images doivent être optimisées.

---

# 15. Icônes

Utiliser une seule bibliothèque d'icônes principale dans le projet.

La bibliothèque privilégiée est :

**Lucide React**

Ne pas mélanger plusieurs bibliothèques d'icônes sans raison.

Les icônes doivent rester cohérentes avec le style général.

---

# 16. Motion Design

Le mouvement est une partie importante de l'identité.

Les animations peuvent être utilisées pour :

* entrée des éléments ;
* navigation ;
* scroll ;
* transitions ;
* changement de thème ;
* interactions ;
* storytelling ;
* projets ;
* 3D.

Les animations complexes doivent être définies plus précisément dans :

`docs/animations.md`

---

# 17. Scroll

Le scroll peut être utilisé comme mécanisme narratif.

Exemples possibles :

* parallaxe ;
* pinning ;
* horizontal scrolling ;
* transformation d'échelle ;
* rotation ;
* changement de profondeur ;
* révélation progressive ;
* transitions entre sections.

Le scroll ne doit pas devenir une contrainte permanente.

L'utilisateur doit toujours pouvoir comprendre son déplacement dans la page.

---

# 18. 3D

La 3D peut être utilisée pour renforcer :

* identité ;
* profondeur ;
* storytelling ;
* immersion.

Elle ne doit pas être utilisée simplement parce qu'une technologie 3D est disponible.

Chaque élément 3D doit avoir une fonction visuelle ou narrative.

Les détails techniques seront définis dans :

`docs/3d.md`

---

# 19. Mode sombre

Le mode sombre est naturellement compatible avec la direction artistique principale.

Il doit privilégier :

* noir ;
* orange ;
* jaune ;
* texte clair.

Le noir doit rester profond sans créer une interface illisible.

---

# 20. Mode clair

Le mode clair doit conserver l'identité orange/jaune tout en utilisant une base claire.

Le résultat doit être une véritable variante du système visuel et non simplement :

```text
black → white
white → black
```

Les contrastes doivent rester accessibles.

Les éléments orange et jaune doivent être ajustés si nécessaire pour conserver leur lisibilité sur fond clair.

---

# 21. Responsive

Le design doit être pensé selon les capacités de chaque écran.

Desktop :

* grandes compositions ;
* grands titres ;
* interactions complexes ;
* 3D plus riche ;
* expériences de scroll.

Mobile :

* composition simplifiée ;
* typographie adaptée ;
* interactions tactiles ;
* réduction des animations coûteuses ;
* 3D éventuellement simplifiée ou remplacée.

Ne jamais simplement réduire la version desktop.

Le mobile doit être considéré comme une composition à part entière.

---

# 22. Accessibilité visuelle

Toujours vérifier :

* contraste ;
* taille du texte ;
* lisibilité ;
* focus ;
* navigation clavier ;
* réduction des animations.

Une expérience visuelle spectaculaire ne doit pas empêcher l'utilisation normale du site.

---

# 23. Cohérence des composants

Avant de créer un nouveau composant visuel, vérifier si un composant existant peut être réutilisé.

Si un nouveau composant est nécessaire :

1. déterminer son rôle ;
2. vérifier sa cohérence avec le Design System ;
3. définir ses états ;
4. penser au responsive ;
5. penser à l'accessibilité ;
6. éviter de créer une variante inutile d'un composant existant.

---

# 24. Principe anti-template

Le portfolio ne doit pas donner l'impression d'avoir été construit à partir d'un template générique.

Éviter les patterns répétitifs tels que :

* Hero standard avec avatar + bouton ;
* grille de cartes identiques ;
* section "Skills" avec logos alignés ;
* statistiques artificielles ;
* badges technologiques partout ;
* animations aléatoires ;
* gradients utilisés partout ;
* glassmorphism systématique.

Les patterns connus peuvent être utilisés lorsqu'ils sont pertinents, mais ils doivent être adaptés à l'identité du portfolio.

---

# 25. Signature visuelle

Chaque grande section doit chercher à posséder un élément distinctif.

Exemples :

* une composition typographique ;
* une transition ;
* une interaction ;
* un mouvement ;
* une utilisation particulière de la profondeur ;
* une séquence de scroll ;
* un élément immersif.

Cependant, toutes les sections ne doivent pas chercher à surpasser la précédente.

Le portfolio doit conserver des moments de respiration.

---

# 26. Règle fondamentale

Le design doit répondre à cette hiérarchie :

**Contenu → expérience → identité → effet visuel**

et non :

**effet visuel → contenu.**

Un effet impressionnant qui nuit à la compréhension doit être simplifié ou supprimé.

L'objectif est de construire une expérience visuelle forte, mais également claire, accessible, performante et cohérente.
