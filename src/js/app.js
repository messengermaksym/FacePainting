/**
 * App Module — Main entry point
 * Handles: FAQ accordion, global initialization
 */
(function () {
  'use strict';

  // ── FAQ Accordion ─────────────────────────────────
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all FAQ items
        faqItems.forEach((otherItem) => {
          otherItem.classList.remove('open');
        });

        // Toggle clicked item
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  // ── Smooth entrance for hero elements ─────────────
  function initHeroAnimations() {
    // Make hero elements visible immediately with animation
    const heroAnimElements = document.querySelectorAll('#hero .animate-on-scroll');
    heroAnimElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('is-visible');
      }, 200 + index * 150);
    });
  }

  // ── Initialize Everything ─────────────────────────
  function init() {
    initFaqAccordion();
    initHeroAnimations();
    console.log('🎨 AquaArt website initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
