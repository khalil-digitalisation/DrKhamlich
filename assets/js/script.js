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
