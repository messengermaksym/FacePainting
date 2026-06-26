/**
 * i18n Module — Internationalization
 * Handles: language switching (UA/EN), text substitution via data-i18n attributes
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'aquaart-lang';
  const DEFAULT_LANG = 'uk';
  const SUPPORTED_LANGS = ['uk', 'en'];

  let translations = {};
  let currentLang = DEFAULT_LANG;

  // ── Get Nested Value ──────────────────────────────
  function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  }

  // ── Load Translation File ─────────────────────────
  async function loadTranslation(lang) {
    try {
      const response = await fetch(`src/i18n/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
      return await response.json();
    } catch (err) {
      console.error(`i18n: Error loading ${lang} translations:`, err);
      return null;
    }
  }

  // ── Apply Translations to DOM ─────────────────────
  function applyTranslations() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = getNestedValue(translations, key);
      if (value !== null) {
        // Check if value contains HTML (like <span>)
        if (value.includes('<')) {
          el.innerHTML = value;
        } else {
          el.textContent = value;
        }
      }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const value = getNestedValue(translations, key);
      if (value !== null) {
        el.placeholder = value;
      }
    });

    // Alt texts
    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      const key = el.getAttribute('data-i18n-alt');
      const value = getNestedValue(translations, key);
      if (value !== null) {
        el.alt = value;
      }
    });

    // Update html lang attribute
    document.documentElement.lang = currentLang;
  }

  // ── Update Language Toggle UI ─────────────────────
  function updateToggleUI() {
    const buttons = document.querySelectorAll('#lang-toggle .lang-btn');
    buttons.forEach((btn) => {
      if (btn.dataset.lang === currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // ── Switch Language ───────────────────────────────
  async function switchLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) return;

    const newTranslations = await loadTranslation(lang);
    if (newTranslations) {
      currentLang = lang;
      translations = newTranslations;
      applyTranslations();
      updateToggleUI();
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }

  // ── Initialize ────────────────────────────────────
  async function init() {
    // Get saved language or detect from browser
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && SUPPORTED_LANGS.includes(savedLang)) {
      currentLang = savedLang;
    }

    // Load initial translations
    const data = await loadTranslation(currentLang);
    if (data) {
      translations = data;
      applyTranslations();
      updateToggleUI();
    }

    // Language toggle click handler
    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-btn');
        if (btn && btn.dataset.lang) {
          switchLanguage(btn.dataset.lang);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
