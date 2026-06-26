/**
 * Form Module
 * Handles: field validation, Formspree submission, success/error states
 */
(function () {
  'use strict';

  const form = document.getElementById('booking-form');
  const submitBtn = document.getElementById('form-submit');
  const submitText = document.getElementById('submit-text');
  const submitLoading = document.getElementById('submit-loading');
  const successMessage = document.getElementById('form-success');
  const errorMessage = document.getElementById('form-error-message');
  const retryBtn = document.getElementById('form-retry');
  const charCounter = document.getElementById('char-counter');

  // Formspree endpoint — replace with real endpoint after creating account
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  // ── Validation Rules ──────────────────────────────
  const validators = {
    'form-name': (value) => {
      return value.trim().length >= 2;
    },
    'form-phone': (value) => {
      // Ukrainian phone: +380XXXXXXXXX or 0XXXXXXXXX
      const phoneRegex = /^(\+?380|0)\d{9}$/;
      return phoneRegex.test(value.replace(/[\s\-()]/g, ''));
    },
    'form-email': (value) => {
      if (!value.trim()) return true; // Optional field
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    'form-event': (value) => {
      return value !== '';
    },
    'form-date': (value) => {
      if (!value) return false;
      const selected = new Date(value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return selected >= tomorrow;
    },
    'form-kids': (value) => {
      if (!value) return true; // Optional
      const num = parseInt(value, 10);
      return !isNaN(num) && num >= 1 && num <= 100;
    },
    'form-comment': (value) => {
      return value.length <= 500;
    },
  };

  // ── Field Validation ──────────────────────────────
  function validateField(field) {
    const validator = validators[field.id];
    if (!validator) return true;

    const isValid = validator(field.value);
    const errorEl = document.getElementById(field.id + '-error');

    if (errorEl) {
      if (isValid) {
        errorEl.classList.remove('visible');
        field.classList.remove('border-red-400', 'ring-red-200');
        field.classList.add('border-primary-100');
      } else {
        errorEl.classList.add('visible');
        field.classList.add('border-red-400', 'ring-red-200');
        field.classList.remove('border-primary-100');
      }
    }

    return isValid;
  }

  function validateAll() {
    let isValid = true;

    Object.keys(validators).forEach((id) => {
      const field = document.getElementById(id);
      if (field) {
        if (!validateField(field)) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  // ── Set min date for date picker ──────────────────
  function setMinDate() {
    const dateField = document.getElementById('form-date');
    if (dateField) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateField.min = tomorrow.toISOString().split('T')[0];
    }
  }

  // ── Character Counter ─────────────────────────────
  function updateCharCounter() {
    const comment = document.getElementById('form-comment');
    if (comment && charCounter) {
      charCounter.textContent = `${comment.value.length} / 500`;
    }
  }

  // ── Form Submission ───────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateAll()) {
      // Scroll to first error
      const firstError = form.querySelector('.form-error.visible');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Show loading state
    submitText.classList.add('hidden');
    submitLoading.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        showSuccess();
      } else {
        showError();
      }
    } catch (err) {
      // If Formspree not configured, show success as demo
      if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
        console.log('Demo mode: Formspree not configured. Form data:', Object.fromEntries(new FormData(form)));
        showSuccess();
      } else {
        showError();
      }
    }
  }

  function showSuccess() {
    form.classList.add('hidden');
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');

    // Reset loading state
    submitText.classList.remove('hidden');
    submitLoading.classList.add('hidden');
    submitBtn.disabled = false;
  }

  function showError() {
    form.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');

    submitText.classList.remove('hidden');
    submitLoading.classList.add('hidden');
    submitBtn.disabled = false;
  }

  function showForm() {
    form.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    successMessage.classList.add('hidden');
    form.reset();
    updateCharCounter();

    // Clear all errors
    form.querySelectorAll('.form-error').forEach((el) => el.classList.remove('visible'));
    form.querySelectorAll('.form-input').forEach((el) => {
      el.classList.remove('border-red-400', 'ring-red-200');
    });
  }

  // ── Event Listeners ───────────────────────────────
  function init() {
    if (!form) return;

    // Set min date
    setMinDate();

    // Blur validation
    form.querySelectorAll('.form-input').forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
    });

    // Character counter
    const comment = document.getElementById('form-comment');
    if (comment) {
      comment.addEventListener('input', updateCharCounter);
    }

    // Form submit
    form.addEventListener('submit', handleSubmit);

    // Retry button
    if (retryBtn) {
      retryBtn.addEventListener('click', showForm);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
