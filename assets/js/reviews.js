'use strict';

/* ─────────────────────────────────────────────────────────────
   reviews.js — Avis patients (Dr Khamlich)

   ➤ POUR AJOUTER OU MODIFIER UN AVIS :
     Éditez simplement le tableau REVIEWS ci-dessous, puis enregistrez.
     Aucune autre modification n'est nécessaire : le carrousel se met à
     jour automatiquement sur TOUTES les pages du site.

   ➤ Format d'un avis :
     {
       name:   "Prénom N."          → nom affiché (l'initiale sert d'avatar)
       rating: 5                    → note de 1 à 5 (nombre d'étoiles dorées)
       date:   "il y a 2 semaines"  → texte libre affiché sous le nom
       text:   "..."                → le contenu de l'avis
     }

   ➤ Pour supprimer un avis : effacez le bloc { ... } correspondant,
     sans oublier la virgule qui le suit.

   ➤ Pensez à mettre à jour GLOBAL_RATING et TOTAL_REVIEWS plus bas
     pour refléter les chiffres réels de la fiche Google.
   ───────────────────────────────────────────────────────────── */

const REVIEWS = [
  
  {
    name: "Salwa Abouje",
    rating: 5,
    date: "il y a 3 mois",
    text: "Je recommande vivement ma dentiste Khadija Khamlich ! Très professionnelle, douce et à l'écoute, elle prend le temps d'expliquer chaque étape et met vraiment en confiance. Les soins sont faits avec beaucoup de précision."
  },
  {
    name: "Marwane Nasri",
    rating: 5,
    date: "il y a 3 mois",
    text: "Une clinique exemplaire ! Tout est parfaitement propre, désinfecté et bien rangé. Cela met immédiatement à l'aise, surtout pour ceux qui appréhendent les soins dentaires."
  },
  {
    name: "Habiby Kebir",
    rating: 5,
    date: "il y a 5 mois",
    text: "Merci pour votre excellent travail, votre gentillesse et votre professionnalisme."
  },
  {
    name: "Samia Rherrad",
    rating: 5,
    date: "il y a 1 an",
    text: "Un immense merci à ma dentiste pour son travail exceptionnel ! J'ai bénéficié d'un traitement complet comprenant l'orthodontie et l'implantologie, et le résultat dépasse toutes mes attentes."
  },
  {
    name: "Ayoub Lemfadli",
    rating: 5,
    date: "il y a 11 mois",
    text: "Ça m'a fait tellement plaisir de retrouver une personne souriante dès l'entrée. Établissement très propre, équipe à l'écoute, traitement fait sans douleur."
  },
  {
    name: "Maya Lux",
    rating: 5,
    date: "il y a 1 an",
    text: "Un accueil efficace et chaleureux à la clinique, et surtout Dr Khamlich travaille avec douceur, précision et professionnalisme. Je recommande vivement !"
  },
  {
    name: "Zineb Mrabet",
    rating: 5,
    date: "il y a 9 mois",
    text: "Très satisfaite de ma visite chez le Dr Khamlich à la Clinique Dentaire Arribat. Un service impeccable et une équipe aux petits soins."
  },
  {
    name: "Yazid Mandil",
    rating: 5,
    date: "il y a 1 an",
    text: "Merci au Dr Khamlich pour sa bienveillance et son professionnalisme. J'ai eu une excellente expérience, elle est très professionnelle, douce et à l'écoute."
  },
  {
    name: "Chaimae Lazzarou",
    rating: 5,
    date: "il y a 1 an",
    text: "J'ai consulté récemment pour des soins qui trainaient depuis longtemps. On a effectué un détartrage (l'un des meilleurs que j'ai fait) et soigné les premières caries, le tout sans aucune douleur."
  },
  {
    name: "Kadiri Mhamed",
    rating: 5,
    date: "il y a 1 an",
    text: "J'ai toujours eu la phobie du dentiste mais depuis que je me fais soigner par le Docteur Khamlich, ma peur a entièrement disparu. Elle m'a posé 3 implants dans de très bonnes conditions."
  },
  {
    name: "Aya Baghdadi",
    rating: 5,
    date: "il y a 1 an",
    text: "Merci au Dr Khamlich pour son professionnalisme, j'ai retrouvé mon sourire grâce à sa compétence. Je recommande vivement !"
  },
  {
    name: "Karim Boudrika",
    rating: 5,
    date: "il y a 9 mois",
    text: "Merci pour votre excellent travail, très très satisfait. Je vous remercie pour la qualité des soins et pour le personnel très professionnel et d'une très grande gentillesse."
  },
  {
    name: "Adil B.",
    rating: 5,
    date: "il y a 1 an",
    text: "Un immense merci à toute l'équipe Dr Khamlich ; service bien soigné, médecin professionnel et serviable. Je recommande sans hésiter !"
  },
  {
    name: "Hamza Guermatha",
    rating: 5,
    date: "il y a 2 ans",
    text: "Merci à Dr Khamlich pour sa patience et son expertise qui sont rassurantes. Je recommande vivement pour des soins dentaires de qualité et une expérience agréable."
  },
  {
    name: "Amina Bouhmouch",
    rating: 5,
    date: "il y a 2 ans",
    text: "Mme Khamlich est une dentiste très douce, rassurante et très professionnelle, je la recommande haut et fort. Excellent travail, merci !"
  },
  {
    name: "Youssef Harras",
    rating: 5,
    date: "il y a 2 ans",
    text: "Dentiste très compétente. Elle prend la peine de tout expliquer en détail, ce qui me rassure moi qui ai une phobie des médecins. Je recommande !"
  },
  {
    name: "Meryem Jed",
    rating: 5,
    date: "il y a 2 ans",
    text: "Dr Khamlich est excellente, très douce et très compétente ! Je recommande vivement."
  },
  {
    name: "Nour El Amrani El Idrissi",
    rating: 5,
    date: "il y a 2 ans",
    text: "Dr Khamlich est d'un professionnalisme exemplaire et aux petits soins. Équipe au top, je recommande !"
  }
];

/* Chiffres affichés dans l'en-tête de la section avis */
const GLOBAL_RATING = 4.9;

/* Lien vers la fiche Google My Business (bouton "Laisser un avis") */
const GMB_LINK = "https://g.page/r/Cf5cgbMXAPAAEAE/review";

/* Longueur avant troncature du texte d'un avis */
const TRUNCATE_AT = 150;


/* ─────────────────────────────────────────────────────────────
   Rendu — aucune modification nécessaire en dessous de cette ligne
   ───────────────────────────────────────────────────────────── */

/** Échappe le HTML pour éviter toute injection depuis le texte des avis. */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function starsFor(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
}

function reviewCardHtml(review, index) {
  const initial = escapeHtml(review.name.trim().charAt(0).toUpperCase());
  const name = escapeHtml(review.name);
  const date = escapeHtml(review.date);
  const full = escapeHtml(review.text);
  const isLong = review.text.length > TRUNCATE_AT;
  const shown = isLong ? escapeHtml(review.text.slice(0, TRUNCATE_AT).trim()) + '…' : full;

  return `
    <li>
      <article class="review-card">
        <header class="review-header">
          <div class="reviewer-avatar" aria-hidden="true">${initial}</div>
          <div>
            <p class="reviewer-name">${name}</p>
            <p class="review-date">${date}</p>
          </div>
          <span class="google-badge" aria-hidden="true">G</span>
        </header>
        <div class="review-stars" role="img" aria-label="Note : ${review.rating} sur 5">${starsFor(review.rating)}</div>
        <p class="review-text" id="review-text-${index}" data-full="${full}" data-short="${shown}">${shown}</p>
        ${isLong ? `<button class="review-read-more" type="button" data-read-more="${index}" aria-expanded="false" aria-controls="review-text-${index}">Lire plus</button>` : ''}
      </article>
    </li>`;
}

function renderReviews() {
  const containers = document.querySelectorAll('[data-reviews]');
  if (!containers.length) return;

  containers.forEach(function (container) {
    // En-tête : note globale + nombre d'avis
    const scoreEl = container.querySelector('[data-rating-score]');
    const starsEl = container.querySelector('[data-rating-stars]');
    const countEl = container.querySelector('[data-rating-count]');
    const gmbEl = container.querySelector('[data-gmb-link]');

    if (scoreEl) scoreEl.textContent = String(GLOBAL_RATING).replace('.', ',') + ' / 5';
    if (starsEl) {
      starsEl.textContent = starsFor(GLOBAL_RATING);
      starsEl.setAttribute('aria-label', 'Note globale : ' + GLOBAL_RATING + ' sur 5');
    }
    if (gmbEl) gmbEl.setAttribute('href', GMB_LINK);

    // Cartes
    const track = container.querySelector('[data-reviews-track]');
    if (!track) return;
    track.innerHTML = REVIEWS.map(reviewCardHtml).join('');

    // "Lire plus" / "Lire moins"
    track.querySelectorAll('[data-read-more]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const textEl = document.getElementById(btn.getAttribute('aria-controls'));
        if (!textEl) return;
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        textEl.textContent = expanded ? textEl.dataset.short : textEl.dataset.full;
        btn.textContent = expanded ? 'Lire plus' : 'Lire moins';
        btn.setAttribute('aria-expanded', String(!expanded));
      });
    });

    setupCarousel(container, track);
  });
}

/** Flèches + pagination. Le scroll natif gère le swipe tactile sur mobile. */
function setupCarousel(container, track) {
  const prevBtn = container.querySelector('[data-carousel-prev]');
  const nextBtn = container.querySelector('[data-carousel-next]');
  const dotsWrap = container.querySelector('[data-carousel-dots]');
  const slides = Array.from(track.children);
  if (!slides.length) return;

  const scrollToSlide = function (i) {
    const target = slides[Math.max(0, Math.min(i, slides.length - 1))];
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };

  // Index de la carte la plus proche du bord gauche de la piste
  const currentIndex = function () {
    let best = 0;
    let min = Infinity;
    slides.forEach(function (slide, i) {
      const dist = Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (dist < min) { min = dist; best = i; }
    });
    return best;
  };

  if (dotsWrap) {
    dotsWrap.innerHTML = slides.map(function (_, i) {
      return `<button class="carousel-dot${i === 0 ? ' active' : ''}" type="button" data-dot="${i}" aria-label="Aller à l'avis ${i + 1}"></button>`;
    }).join('');

    dotsWrap.querySelectorAll('[data-dot]').forEach(function (dot) {
      dot.addEventListener('click', function () {
        scrollToSlide(Number(dot.dataset.dot));
      });
    });
  }

  prevBtn?.addEventListener('click', function () { scrollToSlide(currentIndex() - 1); });
  nextBtn?.addEventListener('click', function () { scrollToSlide(currentIndex() + 1); });

  // Synchronise les dots avec le scroll (y compris swipe tactile)
  let ticking = false;
  track.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      const active = currentIndex();
      dotsWrap?.querySelectorAll('[data-dot]').forEach(function (dot, i) {
        dot.classList.toggle('active', i === active);
      });
      ticking = false;
    });
  });
}

document.addEventListener('DOMContentLoaded', renderReviews);
