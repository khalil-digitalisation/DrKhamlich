# PRD — Nouveau Site Web Dr. Khamlich
### Cahier des charges complet · Destiné à Claude Code

---

## 0. Contexte & Objectif

Le Dr. Khamlich est une **dentiste pluridisciplinaire** basée à la **Clinique Dentaire Arribat, Rabat Agdal (Maroc)**. Un site existant sert de référence visuelle et de source d'assets (dossier `Old_site/`), mais **ce projet est une reconstruction complète from scratch**, et non une refonte de l'existant. Le site ancien ne doit pas contraindre les décisions d'architecture ou de design — il sert uniquement à récupérer les images, textes et éléments graphiques utiles.

**Objectif principal :** construire un site multi-pages neuf, entièrement axé sur la **conversion Google Ads**, avec prise de RDV en ligne intégrée, tracking complet, et expérience utilisateur premium — mobile first. Suit impérativement la logique marketing AIDA, tout en maximisant le rapport : (perceived_dream_outcome*perceived_likelihood_of_achievement)/(time*risk*sacrifice)

---

## 1. Stack technique

**Maintenir HTML/CSS/JS vanilla.** La complexité du projet (multi-pages statiques, iframes, API Places, tracking) est parfaitement gérable sans framework. GitHub Pages supporte nativement cette stack.

> **Aucune migration vers React.** Cela alourdirait inutilement le build pipeline sur GitHub Pages et complexifierait la maintenance pour un usage médical simple.

**Structure de fichiers cible :**

```
/
├── index.html                    ← Landing page (nouvelle)
├── orthodontie.html
├── implantologie.html
├── facettes-hollywood-smile.html
├── blanchiment-dentaire.html
├── protheses-couronnes-bridges.html
├── cabinet-dentaire-rabat.html
├── soins-courants.html
├── assets/
│   ├── css/
│   │   ├── style.css             ← CSS commun (header, footer, variables)
│   │   └── pages.css             ← Styles spécifiques aux landing pages
│   ├── js/
│   │   ├── script.js             ← JS commun (navbar, back-to-top)
│   │   └── reviews.js            ← Avis patients statiques (JSON en dur)
│   └── images/                   ← Toutes les images existantes conservées
├── favicon.svg
└── sitemap.xml                   ← À générer
```

---

## 2. Charte graphique — Légère modernisation

Conserver l'identité visuelle existante (reconnaissance de marque) tout en la raffinant.

### Couleurs
```css
:root {
  /* Palette existante conservée, légèrement affinée */
  --clr-primary: #0ea5c9;          /* Bleu turquoise principal (légèrement plus vif) */
  --clr-primary-dark: #0284a8;     /* Hover / accents foncés */
  --clr-accent: #f0f9ff;           /* Fond section clair */
  --clr-text: #1e293b;             /* Texte principal (remplace le noir pur) */
  --clr-text-light: #64748b;       /* Texte secondaire */
  --clr-white: #ffffff;
  --clr-surface: #f8fafc;          /* Fond cartes */
  --clr-border: #e2e8f0;           /* Bordures légères */
  --clr-gold: #f59e0b;             /* Étoiles avis (gold) */

  /* Typographie */
  --ff-heading: 'Poppins', sans-serif;
  --ff-body: 'Roboto', sans-serif;

  /* Espacement */
  --section-padding: 80px 0;
  --border-radius: 12px;
  --shadow: 0 4px 24px rgba(14, 165, 201, 0.10);
}
```

### Typographie
- Headings : **Poppins 600/700/800** (inchangé)
- Body : **Roboto 400/500** (inchangé)
- Ajouter `font-display: swap` sur les imports Google Fonts

### Modernisation appliquée
- Coins arrondis plus généreux (`border-radius: 12px` sur les cartes)
- Ombres subtiles sur les cartes (remplace les bordures plates)
- Boutons CTA avec léger dégradé et `box-shadow` sur hover
- Transitions CSS fluides (0.3s ease) sur tous les éléments interactifs
- Section hero : overlay gradient léger sur l'image de fond

### ⚠️ Approche responsive — Mobile First (directive critique)

> **Le site est mobile-first. C'est une contrainte non négociable.** La majorité du trafic Google Ads provient de smartphones. Toute décision de CSS, de layout et de UX doit partir du mobile comme référence, et s'adapter ensuite au desktop — jamais l'inverse.

**Règle CSS absolue :**
- Écrire tous les styles de base pour mobile (viewport ~390px)
- Utiliser **exclusivement des `min-width`** pour les media queries desktop
- Ne jamais utiliser `max-width` pour corriger un bug mobile a posteriori

**Breakpoints à utiliser :**
```css
/* Mobile : styles par défaut (pas de media query) */
/* Tablette */
@media (min-width: 768px) { ... }
/* Desktop */
@media (min-width: 1024px) { ... }
/* Large desktop */
@media (min-width: 1280px) { ... }
```

**Exigences UX mobiles critiques :**
- **Barre CTA fixe en bas d'écran** sur toutes les pages (mobile uniquement, cachée sur desktop) :
  ```html
  <div class="mobile-cta-bar">
    <a href="tel:+212611381111">📞 Appeler</a>
    <a href="#rdv">📅 Prendre RDV</a>
  </div>
  ```
- **Taille minimale des zones tactiles** : 48px de hauteur sur tous les boutons et liens
- **Texte lisible sans zoom** : `font-size` minimum 16px sur les inputs, 15px sur le body
- **Iframe Reservio** : sur mobile, hauteur adaptée (`min-height: 600px`) avec `scrolling="auto"`
- **Iframe Google Maps** : hauteur réduite sur mobile (`height: 280px`) pour ne pas monopoliser l'écran
- **Tableau des tarifs** : se transformer en cartes empilées sur mobile (pas de scroll horizontal)
- **Images avant-après** : slider 1 colonne sur mobile, jamais de grille multi-colonnes sous 768px
- **Carousel des avis** : 1 carte visible sur mobile, navigation par swipe touch activée

**Le site doit rester esthétique sur desktop** : les layouts multi-colonnes, les grandes typographies et les effets visuels sont les bienvenus à partir de 1024px — mais ils ne doivent jamais dégrader l'expérience mobile.

---

## 3. Composants communs (header & footer)

Ces composants sont **identiques sur toutes les pages**. Les factoriser dans le CSS et copier-coller le HTML sur chaque page (pas de server-side includes sur GitHub Pages).

### Header
- **Barre supérieure** : email + téléphone cliquable + icônes WhatsApp et Instagram
- **Navbar** : Logo "Dr Khamlich." | Liens de navigation | Bouton CTA "Prendre RDV"
- Le bouton "Prendre RDV" dans la navbar doit être une **ancre vers la section `#rdv`** de la page courante (scroll interne), et non plus un lien externe Reservio
- Navigation mobile : hamburger menu existant conservé
- Liens navbar sur les pages dédiées :
  - Accueil → `index.html`
  - Services → `index.html#service`
  - Nos Avant-Après → `index.html#transformation`
  - Contact → `index.html#footer` (ou ancre footer page courante)
  - **Prendre RDV** → ancre `#rdv` (page courante)

### Footer
- Identique à l'existant, avec ajout d'un lien vers chaque page dédiée dans la colonne "Services"
- Le lien Reservio du footer devient également une ancre vers `#rdv`

---

## 4. Landing Page (`index.html`) — Refonte

### 4.1 Sections à conserver (remaniées)
1. **Hero** — Conserver le visuel et le texte, moderniser les boutons CTA
2. **Services** — Conserver, ajouter des liens vers chaque page dédiée sur chaque carte de service
3. **Avant-Après** — Conserver
4. **À propos / Informations** — Conserver

### 4.2 Nouvelles sections à ajouter

#### A. Section Avis Google (dynamique via API Places)
Voir §8 pour le détail technique.

Disposition : **slider/carousel horizontal** de cartes d'avis, avec :
- Avatar initial du prénom (cercle coloré si pas de photo)
- Nom du patient
- Note (étoiles ⭐ dorées)
- Texte de l'avis (tronqué à 150 chars + "Lire plus")
- Date relative ("il y a 2 semaines")
- Badge "Google" en bas de carte

En-tête de section :
```
Note globale : ★ 4.9 / 5  |  Basé sur X avis Google
[Laisser un avis] → lien vers GMB
```

#### B. Section Carte Google Maps
```html
<section id="localisation" class="section map-section">
  <div class="container">
    <p class="section-subtitle text-center">Nous trouver</p>
    <h2 class="h2 section-title text-center">Clinique Dentaire Arribat — Rabat Agdal</h2>
    <p class="map-address">2 Rue Oued Souss, Agdal, Rabat — 
       <a href="https://maps.app.goo.gl/4cmf9kTKiSnMNAq38" target="_blank">Ouvrir dans Google Maps →</a>
    </p>
    <div class="map-wrapper">
      <!-- iframe Google Maps fourni par le client -->
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6774035.228757162!2d-16.07315272499997!3d34.001923600000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76c6fde422299%3A0xf00017b3815cfe!2sDr%20KHAMLICH%20-%20Dentiste%20Pluridisciplinaire%20-%20Clinique%20dentaire%20Arribat%20-%20Rabat%20Agdal!5e0!3m2!1sfr!2sfr!4v1778933553512!5m2!1sfr!2sfr"
        width="100%" height="420" style="border:0; border-radius: 12px;" 
        allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>
  </div>
</section>
```

#### C. Section Prise de RDV (iframe Reservio) — ancre `#rdv`
```html
<section id="rdv" class="section rdv-section">
  <div class="container">
    <p class="section-subtitle text-center">Réservation en ligne</p>
    <h2 class="h2 section-title text-center">Prendre rendez-vous</h2>
    <p class="text-center">Choisissez votre créneau directement ci-dessous, sans quitter le site.</p>
    <div class="reservio-wrapper">
      <iframe 
        src="https://dr-k-khamlich-clinique-dentaire-arribat-rabat-agdal.reservio.com/services/c964c49f-e350-497c-9fbe-ee142bce42fd"
        width="100%" height="700" frameborder="0" scrolling="auto"
        title="Prise de rendez-vous en ligne — Dr Khamlich"
        loading="lazy">
      </iframe>
    </div>
  </div>
</section>
```

**Style `.reservio-wrapper`** : `border-radius: 12px; overflow: hidden; box-shadow: var(--shadow);`

### 4.3 Ordre des sections sur `index.html`
1. Hero
2. Services (avec liens vers pages dédiées)
3. Avant-Après
4. **Avis Google** ← nouveau
5. **Prise de RDV (Reservio iframe)** ← nouveau, ancre `#rdv`
6. **Carte Google Maps** ← nouveau
7. À propos / Informations
8. Footer

---

## 5. Pages dédiées Google Ads — Structure type

> **Principe directeur :** Un visiteur venant de Google Ads atterrit directement sur cette page — il ne verra jamais la landing page principale. Chaque page dédiée doit donc être **autonome et aussi complète et convaincante que possible**, en embarquant tous les éléments de réassurance présents sur `index.html` : avant-après, avis clients, carte, RDV intégré, indicatifs de tarifs. L'objectif est de convertir le visiteur sans qu'il ait besoin de naviguer ailleurs.

Chaque page dédiée suit un **template identique** avec un contenu spécifique. Voici la structure HTML type complète :

```
[Header commun]
│
├── 1. Section Hero spécialisée
│     ├── Breadcrumb : Accueil > [Spécialité]
│     ├── H1 optimisé SEO (ex: "Orthodontie à Rabat — Dr Khamlich")
│     ├── Accroche courte (2-3 phrases percutantes, bénéfice patient)
│     ├── Badges de réassurance inline :
│     │     [✔ 20 ans d'expérience] [✔ Devis gratuit en consultation] [✔ RDV en ligne]
│     ├── CTA primaire : [📞 Appeler maintenant] → tel:+212611381111
│     └── CTA secondaire : [📅 Prendre RDV] → ancre #rdv
│         (image de fond : photo de la clinique ou visuel dentaire spécifique au service)
│
├── 2. Section Description approfondie (SEO)
│     ├── H2 : "Qu'est-ce que [spécialité] ?"
│     ├── Paragraphes descriptifs (300-400 mots, mots-clés naturels intégrés)
│     ├── Liste bénéfices clés / déroulement de la procédure
│     └── Encadré "Pourquoi choisir le Dr. Khamlich ?" :
│           · 20 ans d'expérience pluridisciplinaire
│           · Matériaux de haute qualité
│           · Équipement moderne
│           · Suivi personnalisé
│
├── 3. Section Tarifs
│     ├── H2 : "Tarifs [spécialité] à Rabat"
│     ├── Cartes de prix avec fourchettes (voir §6 pour les valeurs)
│     ├── Mention légale : "Tarifs indicatifs — devis personnalisé offert lors de la consultation (200 Dhs)"
│     └── CTA : [Obtenir mon devis] → ancre #rdv
│
├── 4. Section Avant-Après (transformations patients)
│     ├── H2 : "Résultats avant / après"
│     ├── Galerie des photos avant-après issues du dossier Old_site/assets/images/
│     │     → Sélectionner les images pertinentes pour la spécialité de la page (pour savoir quelle image correspond à quelle spécialité, il faut regarder l'ancien index.html)
│     │     → Si aucune image spécifique n'existe, utiliser les 8 premières images listées dans l'ancien index.html
│     ├── Slider ou grille 2-3 colonnes (desktop) / 1 colonne (mobile)
│     └── Légende discrète sous chaque image
│
├── 5. Section Avis Google (réassurance sociale)
│     ├── H2 : "Ce que disent nos patients"
│     ├── Composant identique à celui de index.html (§8 du PRD)
│     │     → Même code reviews.js, même carousel
│     │     → Note globale ★ + lien "Laisser un avis"
│     └── (fallback statique identique si API indisponible)
│
├── 6. Section Prise de RDV (iframe Reservio) — ancre #rdv
│     ├── H2 : "Prendre rendez-vous pour [spécialité]"
│     ├── Texte : "Réservez directement en ligne, sans quitter le site."
│     └── Iframe Reservio identique à index.html
│
├── 7. Section Carte Google Maps + Infos pratiques
│     ├── Colonne gauche : iframe Google Maps (identique à index.html)
│     └── Colonne droite : Bloc infos pratiques
│           · Adresse complète
│           · Téléphone cliquable
│           · Horaires d'ouverture
│           · Lien "Itinéraire" → Google Maps
│           · Lien WhatsApp
│
└── [Footer commun]
```

### Notes d'implémentation pour Claude Code

- **Images avant-après** : inspecter `Old_site/assets/images/` (ou le sous-dossier correspondant) et sélectionner les visuels les plus adaptés à chaque spécialité. Ne pas modifier les fichiers du dossier `Old_site/`.
- **Composant avis** : le même fichier `assets/js/reviews.js` est appelé sur toutes les pages. Pas de duplication de logique.
- **Iframe Reservio** : strictement identique sur toutes les pages, même URL, même hauteur.
- **Iframe Maps** : strictement identique sur toutes les pages.
- **CTA flottant mobile** : sur mobile, afficher une barre fixe en bas d'écran avec [📞 Appeler] et [📅 RDV] pour maximiser les conversions sur smartphone.
- **Longueur des pages** : ne pas hésiter à produire des pages longues et riches. La densité de contenu est un signal SEO positif et un facteur de conversion.

---

## 6. Pages dédiées — Contenu spécifique

### Page 1 — `orthodontie.html`
**Campagne A · Groupe G1**

- **Title SEO** : `Orthodontie à Rabat | Bagues & Invisalign — Dr Khamlich Agdal`
- **Meta description** : `Redressez vos dents avec le Dr Khamlich à Rabat Agdal. Bagues orthodontiques et gouttières Invisalign. 20 ans d'expérience. Prenez RDV en ligne.`
- **H1** : `Orthodontie à Rabat — Bagues & Gouttières Invisalign`
- **Services couverts** : Brackets métalliques, brackets céramiques, gouttières invisibles Invisalign
- **Tarifs** : 12500 Dhs par machoire pour les brackets métaliques standard, donc 25000 Dhs pour haut + bas. On propose aussi des brackets métaliques autoligaturants, des brackets en céramique, et des brackets en céramiques autoligaturants pour un prix allant jusqu'à 45000 Dhs pour ces derniers haut + bas. le tarif peut être amené à évoluer vers en plus ou en moins selon la compléxité du cas. la consultation coute 200 Dhs et le devis y est donné.
- **FAQ suggérée** (à alimenter davantage) :
  - À partir de quel âge peut-on faire un traitement orthodontique ?
  - Proposez-vous des bagues transparentes ? (dire que ce sont celles en céramique)
  - Combien de temps dure un traitement avec des bagues ?
  - Les gouttières Invisalign sont-elles aussi efficaces que les bagues ?
  - Est-ce douloureux ?
  - Est-ce possible de payer en plusieurs fois ? (Oui nous proposons des facilités de paiement)

---

### Page 2 — `implantologie.html`
**Campagne A · Groupe G2**

- **Title SEO** : `Implants Dentaires à Rabat | Implantologie — Dr Khamlich Agdal`
- **Meta description** : `Remplacez vos dents manquantes par des implants dentaires de qualité à Rabat. Dr Khamlich, spécialiste en implantologie. Consultation et devis gratuits.`
- **H1** : `Implants Dentaires à Rabat — Retrouvez un Sourire Complet`
- **Services couverts** : Implant unitaire, implants multiples, All-on-4, gestion osseuse
- **Tarifs** : 10000 Dhs par implant + prothèse, mais selon le nombre d'implants placés, le prix peut varier, la consultation coute 200 Dhs et le devis y est donné.
- **FAQ suggérée** (à alimenter davantage):
  - Suis-je éligible aux implants dentaires ?
  - Combien de temps dure la pose d'un implant ?
  - L'opération est-elle douloureuse ?
  - Quelle est la durée de vie d'un implant ?
  - Y a-t-il une période de guérison ?

---

### Page 3 — `facettes-hollywood-smile.html`
**Campagne A · Groupe G3**

- **Title SEO** : `Facettes Dentaires & Hollywood Smile à Rabat — Dr Khamlich`
- **Meta description** : `Transformez votre sourire avec des facettes en céramique ou un Hollywood Smile à Rabat Agdal. Dr Khamlich, esthétique dentaire haut de gamme.`
- **H1** : `Facettes Dentaires & Hollywood Smile à Rabat`
- **Services couverts** : Facettes céramique, facettes composite, Hollywood Smile complet
- **Tarifs** : 4000 Dhs la facette en céramique. 30000 Dhs les 8 facettes si on fait que le haut uniquement par exemple, et 55000 Dhs si on fait 16 facettes donc 8 en haut et 8 en bas. Là aussi le prix peut varier selon compléxité. 200 Dhs la consultation et le devis y est donné.
- **FAQ suggérée** (à alimenter davantage) :
  - Quelle est la différence entre facettes céramique et composite ?
  - Faut-il limer les dents pour poser des facettes ?
  - Combien de séances faut-il ?
  - Combien de temps durent les facettes ?
  - Est-ce adapté à toutes les dents ?

---

### Page 4 — `blanchiment-dentaire.html`
**Campagne B · Groupe G1**

- **Title SEO** : `Blanchiment Dentaire à Rabat en 1h — Dr Khamlich Agdal`
- **Meta description** : `Blanchissez vos dents en 1 heure au cabinet Dr Khamlich à Rabat Agdal. Résultats immédiats et durables. Prenez rendez-vous en ligne.`
- **H1** : `Blanchiment Dentaire à Rabat — Résultat en 1 Heure`
- **Services couverts** : Blanchiment au fauteuil (1h), blanchiment gencives
- **Tarifs** : 3500 Dhs pour un blanchiment d'1h, le patient choisit la teinte. une promo de 5900 Dhs est appliquée si un couple de personnes fait le blanchiment en parallèle.
- **FAQ suggérée** (à alimenter davantage) :
  - Le blanchiment est-il sans danger pour l'émail ?
  - Combien de temps durent les résultats ?
  - Y a-t-il des contre-indications ?
  - Quelle différence avec les kits vendus en pharmacie ?
  - Puis-je manger normalement après ?

---

### Page 5 — `protheses-couronnes-bridges.html`
**Campagne B · Groupe G2**

- **Title SEO** : `Prothèses Dentaires à Rabat | Couronnes, Bridges, Zircone — Dr Khamlich`
- **Meta description** : `Couronnes, bridges et prothèses en zircone à Rabat Agdal. Résultats naturels et durables avec le Dr Khamlich. Devis gratuit en consultation.`
- **H1** : `Prothèses Dentaires à Rabat — Couronnes, Bridges & Zircone`
- **Services couverts** : Couronnes céramique/zircone, bridges, prothèses amovibles
- **Tarifs** : 4000 DHs la prothèse mais varie selon le cas et sa compléxité, consultation 200 DHs et devis y est donné.
- **FAQ suggérée** (à alimenter davantage):
  - Quelle est la différence entre couronne et bridge ?
  - La zircone est-elle meilleure que la céramique ?
  - Combien de temps dure la fabrication d'une prothèse ?
  - Une couronne est-elle douloureuse à poser ?
  - Quelle durée de vie pour un bridge ?

---

### Page 6 — `cabinet-dentaire-rabat.html`
**Campagne C · Groupe G1**

- **Title SEO** : `Cabinet Dentaire à Rabat Agdal | Dr Khamlich — Clinique Arribat`
- **Meta description** : `Clinique dentaire pluridisciplinaire à Rabat Agdal. Dr Khamlich, 20 ans d'expérience. Orthodontie, implants, esthétique, soins courants. Prenez RDV.`
- **H1** : `Votre Dentiste à Rabat Agdal — Clinique Dentaire Arribat`
- **Contenu** : Page vitrine (présentation complète, équipe, équipements, localisation, horaires)
- **Tarifs** : 200 Dhs la 1ère consultation. Le tarif dépend evidemment ensuite de la prestation réalisée durant celle-ci si un soin est fait par exemple.
- **FAQ suggérée** (à alimenter davantage) :
  - La clinique est-il conventionnée ?
  - Quels sont vos horaires ?
  - Acceptez-vous les urgences ?
  - Proposez-vous la sédation consciente ?
  - Où vous trouver exactement ?

---

### Page 7 — `soins-courants.html`
**Campagne C · Groupe G2**

- **Title SEO** : `Soins Dentaires à Rabat | Détartrage, Caries, Urgences — Dr Khamlich`
- **Meta description** : `Détartrage, traitement des caries, soins de canal et urgences dentaires à Rabat Agdal. Dr Khamlich, consultation rapide disponible.`
- **H1** : `Soins Dentaires Courants à Rabat — Caries, Détartrage, Urgences`
- **Services couverts** : Détartrage, soins de caries, dévitalisations, abcès, radiographies, urgences
- **Tarifs** : 200 Dhs la 1ère consultation. Le tarif dépend evidemment ensuite de la prestation réalisée durant celle-ci si un soin est fait par exemple.
- **FAQ suggérée** (à alimenter davantage):
  - Comment se déroule un détartrage ?
  - Le soin d'une carie est-il douloureux ?
  - Acceptez-vous les urgences le jour même ?
  - À quelle fréquence consulter pour un bilan ?
  - Faites-vous des radios sur place ?

---

## 7. SEO Technique

### Balises à intégrer sur chaque page

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO primaire -->
  <title>[TITRE UNIQUE PAR PAGE]</title>
  <meta name="description" content="[DESCRIPTION UNIQUE PAR PAGE]">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://[DOMAINE]/[page].html">
  
  <!-- Open Graph (partages réseaux sociaux) -->
  <meta property="og:title" content="[TITRE PAGE]">
  <meta property="og:description" content="[DESCRIPTION PAGE]">
  <meta property="og:image" content="https://[DOMAINE]/assets/images/og-image.jpg">
  <meta property="og:url" content="https://[DOMAINE]/[page].html">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_MA">
  
  <!-- Schema.org Dentist (JSON-LD) — sur index.html uniquement -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": "Dr KHAMLICH - Clinique Dentaire Arribat",
    "image": "https://[DOMAINE]/assets/images/hero-banner.png",
    "url": "https://[DOMAINE]/",
    "telephone": "+212611381111",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2 Rue Oued Souss",
      "addressLocality": "Rabat",
      "addressRegion": "Agdal",
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.9960,
      "longitude": -6.8498
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "13:00"
      }
    ],
    "priceRange": "$$",
    "sameAs": [
      "https://www.instagram.com/dr_khamlich/",
      "https://maps.app.goo.gl/4cmf9kTKiSnMNAq38"
    ]
  }
  </script>
  
  <!-- Schema.org MedicalWebPage — sur chaque page dédiée -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "[NOM DU SERVICE]",
    "description": "[DESCRIPTION]",
    "url": "https://[DOMAINE]/[page].html",
    "provider": {
      "@type": "Dentist",
      "name": "Dr KHAMLICH - Clinique Dentaire Arribat"
    }
  }
  </script>
  
  <!-- Schema.org FAQPage — sur chaque page dédiée avec FAQ -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "[QUESTION 1]",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "[RÉPONSE 1]"
        }
      }
      // ... autres questions
    ]
  }
  </script>
</head>
```

### `sitemap.xml`
À générer à la racine du repo :
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://[DOMAINE]/</loc><priority>1.0</priority></url>
  <url><loc>https://[DOMAINE]/orthodontie.html</loc><priority>0.9</priority></url>
  <url><loc>https://[DOMAINE]/implantologie.html</loc><priority>0.9</priority></url>
  <url><loc>https://[DOMAINE]/facettes-hollywood-smile.html</loc><priority>0.9</priority></url>
  <url><loc>https://[DOMAINE]/blanchiment-dentaire.html</loc><priority>0.8</priority></url>
  <url><loc>https://[DOMAINE]/protheses-couronnes-bridges.html</loc><priority>0.8</priority></url>
  <url><loc>https://[DOMAINE]/cabinet-dentaire-rabat.html</loc><priority>0.8</priority></url>
  <url><loc>https://[DOMAINE]/soins-courants.html</loc><priority>0.7</priority></url>
</urlset>
```

---

## 8. Avis Google — Intégration statique (JSON en dur)

### Approche technique

Les avis sont **saisis manuellement en dur dans un tableau JSON** directement dans `reviews.js`. Aucune API Google Places n'est utilisée. Le client se chargera de mettre à jour les avis lui-même ultérieurement en modifiant ce fichier.

> ✏️ **Facilité de maintenance :** structurer le tableau de façon lisible, avec un commentaire en tête de fichier expliquant comment ajouter ou modifier un avis.

```javascript
// reviews.js
// ─────────────────────────────────────────────────────────────
// Pour ajouter ou modifier un avis : éditer le tableau REVIEWS ci-dessous.
// Chaque objet représente une carte d'avis affichée sur le site.
// ─────────────────────────────────────────────────────────────

const REVIEWS = [
  {
    name: "Salma E.",
    rating: 5,
    date: "il y a 2 semaines",
    text: "Cabinet très professionnel, Dr. Khamlich est à l'écoute et prend le temps d'expliquer chaque étape. Je recommande vivement !"
  },
  {
    name: "Youssef M.",
    rating: 5,
    date: "il y a 1 mois",
    text: "Excellent suivi pour mon traitement orthodontique. L'équipe est souriante et rassurante. Très satisfait du résultat."
  },
  {
    name: "Nadia B.",
    rating: 5,
    date: "il y a 3 semaines",
    text: "J'ai fait mes facettes ici et le résultat est bluffant. Naturel, précis, et le Dr. Khamlich a su respecter exactement ce que je voulais."
  },
  {
    name: "Karim T.",
    rating: 5,
    date: "il y a 2 mois",
    text: "Pose d'implant réalisée dans les meilleures conditions. Aucune douleur, suivi impeccable. Je n'irais nulle part ailleurs."
  },
  {
    name: "Zineb A.",
    rating: 5,
    date: "il y a 1 semaine",
    text: "Blanchiment dentaire en une heure, résultat immédiat et vraiment impressionnant. Cabinet moderne et accueil chaleureux."
  },
  {
    name: "Omar R.",
    rating: 5,
    date: "il y a 5 semaines",
    text: "Très bonne expérience pour un détartrage et un bilan complet. Ponctuel, propre, et le Dr. Khamlich prend vraiment soin de ses patients."
  }
];

const GLOBAL_RATING = 4.9;
const TOTAL_REVIEWS = 127; // Nombre affiché dans l'en-tête de section

function renderReviews() {
  // Générer le carousel HTML à partir du tableau REVIEWS
  // ...
}

document.addEventListener('DOMContentLoaded', renderReviews);
```

### Structure d'une carte d'avis
```html
<article class="review-card">
  <header class="review-header">
    <div class="reviewer-avatar">[Initiale]</div>
    <div>
      <p class="reviewer-name">Prénom N.</p>
      <p class="review-date">il y a 3 semaines</p>
    </div>
    <span class="google-badge">G</span>
  </header>
  <div class="review-stars">★★★★★</div>
  <p class="review-text">Texte de l'avis tronqué...</p>
  <button class="review-read-more">Lire plus</button>
</article>
```

### Disposition du carousel
- Desktop : 3 cartes visibles simultanément
- Tablette : 2 cartes
- Mobile : 1 carte
- Navigation : flèches gauche/droite + pagination (dots)
- Auto-play optionnel (pause au survol)

---

## 9. Tracking & Analytics

### Google Tag Manager (GTM) — Approche recommandée
Plutôt que d'intégrer GA4 et Google Ads directement, utiliser **Google Tag Manager** comme conteneur unique. Avantages : ajout/modification de tags sans toucher au code.

Voici le code fourni par google :
"
Collez ce code le plus haut possible dans la section <head> de la page 
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TWJMMJFN');</script>
<!-- End Google Tag Manager -->

Collez ce code juste après la balise d'ouverture <body> :
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TWJMMJFN"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
"

```html
<!-- Dans <head> de CHAQUE page — remplacer GTM-XXXXXXX par l'ID réel -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

<!-- Dans <body> immédiatement après <body> -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

Voici le code fourni dans google ads :
```
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18170112607"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-18170112607');
</script>
```

### Tags à configurer dans GTM (instructions pour le client)

**1. Google Analytics 4**
- Créer un compte GA4 sur analytics.google.com
- Récupérer l'ID de mesure (`G-XXXXXXXXXX`)
- Dans GTM : Nouveau tag → Google Analytics : Configuration GA4 → ID de mesure

**2. Google Ads — Suivi des conversions**
- Dans Google Ads : Outils → Suivi des conversions → Nouvelle conversion
- Type : Site web | Catégorie : Contact (pour appels) et Rendez-vous (pour Reservio)
- Récupérer l'ID de conversion (`AW-XXXXXXXXX`) et le libellé
- Dans GTM : Tag Google Ads → Suivi des conversions

**3. Événements de conversion à tracker**

| Événement | Déclencheur GTM | Valeur |
|-----------|----------------|--------|
| Clic "Appeler" (`tel:`) | Clic sur lien contenant `tel:` | Conversion principale |
| Clic "Prendre RDV" (scroll vers #rdv) | Clic CTA RDV | Micro-conversion |
| Vue section Reservio | Visibilité élément `#rdv` | Micro-conversion |
| Scroll > 75% page | Profondeur de défilement | Engagement |
| Clic WhatsApp | Clic lien `logo-whatsapp` | Conversion principale |

**4. Placeholders dans le code HTML**
Laisser des commentaires clairs :
```html
<!-- GTM : Remplacer GTM-XXXXXXX par votre ID Google Tag Manager -->
<!-- GA4 : ID de mesure G-XXXXXXXXXX à configurer dans GTM -->
<!-- Google Ads : ID AW-XXXXXXXXX à configurer dans GTM -->
```

---

## 10. Performance & Accessibilité

> 📱 **Rappel :** Le §2 définit l'approche mobile-first — s'y référer pour tous les choix responsive. Les optimisations ci-dessous s'appliquent en priorité au contexte mobile.

### Optimisations à appliquer

- **Images** : Ajouter `loading="lazy"` sur toutes les images hors hero ; utiliser `width` et `height` pour éviter le CLS
- **Fonts** : `font-display: swap` sur l'import Google Fonts ; précharger la police heading
  ```html
  <link rel="preload" as="style" href="https://fonts.googleapis.com/...">
  ```
- **CSS critique** : Inline le CSS above-the-fold dans `<style>` pour le hero
- **iframe Reservio** : `loading="lazy"` + wrapper avec hauteur fixe pour éviter le layout shift
- **Compression** : Minifier CSS et JS avant push 

### Accessibilité
- Tous les boutons CTA ont un `aria-label` descriptif
- Images décoratives : `alt=""`
- Images informatives : `alt` descriptif
- Contraste : vérifier ratio minimum 4.5:1 sur tous les textes
- Navigation clavier : focus visible sur tous les éléments interactifs

---

## 11. Correspondance Pages ↔ Campagnes Google Ads

| Page | URL | Campagne | Groupe | Budget |
|------|-----|----------|--------|--------|
| `index.html` | `/` | — | Landing générale | — |
| `orthodontie.html` | `/orthodontie.html` | A | G1 | 60% |
| `implantologie.html` | `/implantologie.html` | A | G2 | 60% |
| `facettes-hollywood-smile.html` | `/facettes-hollywood-smile.html` | A | G3 | 60% |
| `blanchiment-dentaire.html` | `/blanchiment-dentaire.html` | B | G1 | 20% |
| `protheses-couronnes-bridges.html` | `/protheses-couronnes-bridges.html` | B | G2 | 20% |
| `cabinet-dentaire-rabat.html` | `/cabinet-dentaire-rabat.html` | C | G1 | 20% |
| `soins-courants.html` | `/soins-courants.html` | C | G2 | 20% |



## 12. Livrable attendu de Claude Code

### Dossier source — `Old_site/`

Le dossier **`Old_site/`** à la racine du repo contient l'intégralité du site actuel : code HTML, CSS, JS, et tous les assets (images, icônes, favicon, fonts locales). C'est la **seule référence** pour récupérer les visuels et comprendre la structure existante.

> ⚠️ **Ne jamais modifier le dossier `Old_site/`.** Il sert uniquement de source de lecture. Copier les fichiers nécessaires vers la nouvelle structure (`assets/images/`, etc.) sans toucher à l'original.

Actions attendues sur ce dossier :
- Lire `Old_site/index.html` pour comprendre la structure HTML et les classes CSS existantes
- Copier toutes les images utiles depuis `Old_site/assets/images/` (ou chemin équivalent) vers `assets/images/`
- Récupérer le CSS existant comme base de `assets/css/style.css` avant d'appliquer les modifications
- Identifier les images avant-après pour les distribuer sur les pages dédiées selon la spécialité concernée

---

### Ordre d'exécution recommandé

1. **Créer `assets/css/style.css`** : refonte avec nouvelles variables CSS, modernisation légère
2. **Créer `assets/css/pages.css`** : styles spécifiques aux pages dédiées (hero landing, tarifs, FAQ, breadcrumb)
3. **Refondre `index.html`** : conserver le contenu existant, ajouter les 3 nouvelles sections (avis, Reservio, Maps), mettre à jour les CTAs
4. **Créer `assets/js/reviews.js`** : chargement avis Google Places API + fallback statique
5. **Créer les 7 pages dédiées** : orthodontie, implantologie, facettes, blanchiment, prothèses, cabinet, soins — en utilisant le template §5 avec le contenu §6
6. **Créer `sitemap.xml`**
7. **Vérifier** : tous les liens internes, ancres `#rdv`, liens tel:, cohérence header/footer

### ⚠️ Directive impérative — Poser des questions avant de coder

**Avant d'écrire la moindre ligne de code, Claude Code doit poser toutes les questions nécessaires pour lever chaque ambiguïté.** Il ne doit pas faire d'hypothèses silencieuses sur des points qui pourraient nécessiter une reprise du travail.

Voici une liste non exhaustive des points à clarifier en amont :

**Structure & repo**
- Quel est le nom exact du repo GitHub et l'URL GitHub Pages finale (ex: `username.github.io/repo-name`) ? Cela impacte tous les chemins `canonical`, `sitemap`, `og:url` et les `href` des assets.


**Contenu & images**
- Y a-t-il une photo spécifique du Dr. Khamlich à utiliser dans la section "À propos" des pages dédiées ? --> hero-banner.PNG


Si d'autres points semblent ambigus à la lecture du PRD ou après inspection de `Old_site/`, **les soulever sans exception** avant de commencer.

### Variables à substituer dans tout le code

| Placeholder | Valeur à fournir |
|-------------|-----------------|
| `GTM-XXXXXXX` | ID Google Tag Manager |
| `AW-XXXXXXXXX` | ID compte Google Ads |
| `PLACE_ID_GMB` | Place ID de la fiche Google My Business (pour le lien "Laisser un avis") |
| `[DOMAINE]` | URL GitHub Pages ( `khalil-digitalisation.github.io`) |


## 13. Récapitulatif des fonctionnalités

| Fonctionnalité | Statut | Technologie |
|---------------|--------|-------------|
| Multi-pages (8 pages) | 🆕 À créer | HTML statique |
| SEO on-page optimisé | 🔄 Refonte | Balises meta, Schema.org JSON-LD |
| Sitemap.xml | 🆕 À créer | XML |
| Reservio iframe intégré | 🔄 Remplacement lien externe | `<iframe>` embarqué |
| Avis Google statiques (JSON éditable) | 🆕 À créer | Tableau JSON en dur dans `reviews.js` |
| Carte Google Maps embarquée | 🆕 À créer | `<iframe>` Google Maps |
| Google Tag Manager | 🆕 À créer | GTM snippet |
| Tracking appels & RDV | 🆕 À créer | GTM → Google Ads Conversion |
| CTAs appel direct | 🔄 Amélioration | `tel:+212611381111` |
| Charte graphique modernisée | 🔄 Évolution | CSS variables raffinées |
| Responsive mobile | ✅ Conserver | CSS existant + ajustements |
| Performance (lazy load) | 🔄 Amélioration | Attributs HTML natifs |
| Schema FAQ (pages dédiées) | 🆕 À créer | JSON-LD |
| Breadcrumb navigation | 🆕 À créer | HTML + CSS |
| Section tarifs | 🆕 À créer | HTML + CSS (cartes prix) |
| Section FAQ accordéon | 🆕 À créer | HTML/CSS/JS |
