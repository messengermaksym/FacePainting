/**
 * Navigation Module
 * Handles: sticky header, smooth scroll, mobile menu, active nav highlighting
 */
(function () {
  'use strict';

  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('main section[id]');

  let isMenuOpen = false;
  let lastScrollY = 0;

  // ── Sticky Header ─────────────────────────────────
  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add('bg-cream/95', 'backdrop-blur-lg', 'shadow-sm');
    } else {
      header.classList.remove('bg-cream/95', 'backdrop-blur-lg', 'shadow-sm');
    }

    lastScrollY = scrollY;
  }

  // ── Active Nav Highlight ──────────────────────────
  function highlightActiveSection() {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('text-primary', 'font-semibold');
          link.classList.add('text-dark/70');

          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('text-primary', 'font-semibold');
            link.classList.remove('text-dark/70');
          }
        });
      }
    });
  }

  // ── Mobile Menu Toggle ────────────────────────────
  function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
      mobileMenu.classList.remove('translate-x-full');
      mobileMenu.classList.add('translate-x-0');
      hamburger.classList.add('open');
      document.body.classList.add('scroll-locked');
    } else {
      closeMobileMenu();
    }
  }

  function closeMobileMenu() {
    isMenuOpen = false;
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.classList.remove('translate-x-0');
    hamburger.classList.remove('open');
    document.body.classList.remove('scroll-locked');
  }

  // ── Smooth Scroll ─────────────────────────────────
  function handleNavClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        closeMobileMenu();
      }
    }
  }

  // ── Event Listeners ───────────────────────────────
  function init() {
    // Scroll events (throttled via rAF)
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          highlightActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Hamburger
    if (hamburger) {
      hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Nav links — smooth scroll
    navLinks.forEach((link) => link.addEventListener('click', handleNavClick));
    mobileNavLinks.forEach((link) => link.addEventListener('click', handleNavClick));

    // All anchor links with # (CTA buttons etc.)
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', handleNavClick);
    });

    // Initial state
    handleScroll();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
