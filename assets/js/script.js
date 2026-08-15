'use strict';

/**
 * script.js — Dr Khamlich
 * Comportements communs à toutes les pages :
 * navigation mobile, header sticky, back-to-top, accordéon FAQ.
 */


/**
 * Attache un écouteur sur un élément ou une NodeList.
 */
const addEventOnElem = function (elem, type, callback) {
  if (!elem) return;
  if (elem.length !== undefined) {
    for (let i = 0; i < elem.length; i++) elem[i].addEventListener(type, callback);
  } else {
    elem.addEventListener(type, callback);
  }
};


/**
 * Navigation mobile (menu déroulant)
 */
const navbar = document.querySelector('[data-navbar]');
const navbarLinks = document.querySelectorAll('[data-nav-link]');
const navToggler = document.querySelector('[data-nav-toggler]');

const closeNav = function () {
  navbar?.classList.remove('active');
  navToggler?.classList.remove('active');
  navToggler?.setAttribute('aria-expanded', 'false');
};

const toggleNav = function () {
  const isOpen = navbar?.classList.toggle('active');
  navToggler?.classList.toggle('active');
  navToggler?.setAttribute('aria-expanded', String(!!isOpen));
};

addEventOnElem(navToggler, 'click', toggleNav);
addEventOnElem(navbarLinks, 'click', closeNav);

// Échap ferme le menu
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeNav();
});


/**
 * Header sticky + bouton retour en haut
 */
const header = document.querySelector('[data-header]');
const backTopBtn = document.querySelector('[data-back-top-btn]');

window.addEventListener('scroll', function () {
  const scrolled = window.scrollY >= 100;
  header?.classList.toggle('active', scrolled);
  backTopBtn?.classList.toggle('active', scrolled);
});


/**
 * Barre de progression de lecture
 * Se remplit au fur et à mesure que le visiteur descend dans la page.
 */
const progressBar = document.querySelector('[data-scroll-progress]');

if (progressBar) {
  let progressTicking = false;

  const updateProgress = function () {
    progressTicking = false;
    // Hauteur réellement défilable ; 0 si la page tient dans l'écran.
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    let ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    if (ratio < 0) ratio = 0;
    if (ratio > 1) ratio = 1;
    progressBar.style.width = (ratio * 100).toFixed(2) + '%';
  };

  const requestProgressUpdate = function () {
    if (progressTicking) return;
    progressTicking = true;
    window.requestAnimationFrame(updateProgress);
  };

  window.addEventListener('scroll', requestProgressUpdate, { passive: true });
  window.addEventListener('resize', requestProgressUpdate);
  window.addEventListener('load', requestProgressUpdate);
  updateProgress();
}


/**
 * Accordéon FAQ (pages dédiées)
 * Le contenu reste dans le DOM pour rester indexable par Google.
 */
const faqQuestions = document.querySelectorAll('[data-faq-question]');

faqQuestions.forEach(function (question) {
  question.addEventListener('click', function () {
    const isOpen = question.getAttribute('aria-expanded') === 'true';
    const answer = document.getElementById(question.getAttribute('aria-controls'));

    question.setAttribute('aria-expanded', String(!isOpen));
    answer?.classList.toggle('open', !isOpen);
  });
});


/**
 * Comparatif orthodontie : carte d'entrée du carrousel
 *
 * Les 6 solutions défilent horizontalement. On ouvre sur la 3ᵉ carte
 * (céramique, l'offre phare) plutôt que sur la 1ʳᵉ : elle reste à sa place
 * dans l'ordre de lecture, mais devient ce que le visiteur voit en premier,
 * avec un bout des cartes voisines de part et d'autre — ce qui rend le
 * défilement évident sans avoir à le lire.
 *
 * S'applique à toutes les largeurs : sur desktop les cartes sont en
 * 3 colonnes mais la liste déborde toujours (6 cartes), la céramique doit
 * donc y être mise en avant de la même façon.
 *
 * Les pages qui pilotent leur comparatif autrement (page prothèses : un
 * carrousel par situation, chacun devant s'ouvrir sur sa 1ʳᵉ carte) se
 * retirent de ce comportement via [data-no-autocenter] sur la liste.
 */
const compareList = document.querySelector('.compare-list:not([data-no-autocenter])');

// Dernière position posée par le script : sert à distinguer nos propres
// écritures de scrollLeft d'un vrai défilement du visiteur.
let lastAppliedScrollLeft = -1;

const centerFeaturedCompareCard = function () {
  if (!compareList) return;

  // Rien à positionner s'il n'y a pas de débordement.
  if (compareList.scrollWidth <= compareList.clientWidth) return;

  const featured = compareList.children[2]; // 3ᵉ carte : céramique
  if (!featured) return;

  // Centre la carte dans la zone visible, sans animation ni scroll de page :
  // on écrit scrollLeft directement au lieu d'utiliser scrollIntoView, qui
  // ferait aussi remonter/descendre la page vers la section.
  //
  // getBoundingClientRect() plutôt que offsetLeft : offsetLeft se mesure
  // depuis le premier ancêtre positionné, pas depuis le conteneur défilant.
  const listRect = compareList.getBoundingClientRect();
  const cardRect = featured.getBoundingClientRect();

  // Position de la carte dans le contenu défilé, puis on retire la moitié
  // de l'espace restant pour la centrer.
  const cardStart = (cardRect.left - listRect.left) + compareList.scrollLeft;
  const offset = cardStart - (compareList.clientWidth - cardRect.width) / 2;

  compareList.scrollLeft = Math.max(0, offset);
  lastAppliedScrollLeft = compareList.scrollLeft;
};

if (compareList) {
  centerFeaturedCompareCard();

  // Le calcul dépend de la largeur réelle des cartes : on le rejoue une fois
  // les images chargées. Mais si le visiteur a déjà fait défiler entre-temps,
  // on ne touche plus à rien — sa position prime sur la nôtre.
  let userHasScrolled = false;
  compareList.addEventListener('scroll', function () {
    if (compareList.scrollLeft !== lastAppliedScrollLeft) userHasScrolled = true;
  }, { passive: true });

  window.addEventListener('load', function () {
    if (!userHasScrolled) centerFeaturedCompareCard();
  });

  // Redimensionnement / rotation : la largeur des cartes change, donc la
  // position de la carte phare aussi. On recentre tant que le visiteur n'a
  // rien fait défiler lui-même.
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!userHasScrolled) centerFeaturedCompareCard();
    }, 150);
  });
}
