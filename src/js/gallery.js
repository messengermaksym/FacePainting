/**
 * Gallery Module
 * Handles: portfolio filtering, lightbox with keyboard/touch navigation
 */
(function () {
  'use strict';

  const filterContainer = document.getElementById('portfolio-filters');
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');

  let currentIndex = 0;
  let visibleItems = [];
  let touchStartX = 0;
  let touchEndX = 0;

  // ── Filtering ─────────────────────────────────────
  function filterGallery(category) {
    const items = galleryGrid.querySelectorAll('.gallery-item');

    items.forEach((item) => {
      const itemCategory = item.dataset.category;
      const shouldShow = category === 'all' || itemCategory === category;

      if (shouldShow) {
        item.style.display = '';
        // Trigger re-animation
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        requestAnimationFrame(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        });
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });

    // Update filter buttons
    filterContainer.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.classList.remove('active');
      if (btn.dataset.filter === category) {
        btn.classList.add('active');
      }
    });
  }

  // ── Lightbox ──────────────────────────────────────
  function getVisibleItems() {
    return Array.from(galleryGrid.querySelectorAll('.gallery-item'))
      .filter((item) => item.style.display !== 'none');
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.classList.add('scroll-locked');
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.classList.remove('scroll-locked');
  }

  function updateLightboxImage() {
    if (visibleItems[currentIndex]) {
      const img = visibleItems[currentIndex].querySelector('img');
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    }
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightboxImage();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxImage();
  }

  // ── Touch Support ─────────────────────────────────
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  }

  // ── Event Listeners ───────────────────────────────
  function init() {
    if (!filterContainer || !galleryGrid || !lightbox) return;

    // Filter buttons
    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (btn) {
        filterGallery(btn.dataset.filter);
      }
    });

    // Gallery item click → open lightbox
    galleryGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (item) {
        const items = getVisibleItems();
        const index = items.indexOf(item);
        if (index !== -1) {
          openLightbox(index);
        }
      }
    });

    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    // Click on backdrop to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('hidden')) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    });

    // Touch swipe support
    lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
    lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
