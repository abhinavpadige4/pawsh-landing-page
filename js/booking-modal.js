/* Pawsh Booking Modal - Vanilla JS, no dependencies */
(function () {
  'use strict';

  // --- DOM References ---
  const modal = document.getElementById('booking-modal');
  const openBtns = document.querySelectorAll('[data-open-modal]');
  const closeBtns = document.querySelectorAll('[data-close-modal]');
  const form = document.getElementById('booking-form');
  const overlay = document.getElementById('modal-overlay');
  const successMsg = document.getElementById('booking-success');
  const errorMsg = document.getElementById('booking-error');

  // --- State ---
  let lastFocused = null;
  let isOpen = false;

  // --- Focus Trap ---
  function getFocusableElements() {
    return modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusable = getFocusableElements();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // --- Open Modal ---
  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    isOpen = true;
    // Focus first input after transition
    setTimeout(function () {
      const firstInput = modal.querySelector('input, select, textarea');
      if (firstInput) firstInput.focus();
    }, 100);
    document.addEventListener('keydown', handleKeydown);
  }

  // --- Close Modal ---
  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    isOpen = false;
    document.removeEventListener('keydown', handleKeydown);
    if (lastFocused) lastFocused.focus();
    // Reset form
    if (form) form.reset();
    clearErrors();
    if (successMsg) successMsg.classList.add('hidden');
  }

  // --- Keyboard Handler ---
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
    if (isOpen) {
      trapFocus(e);
    }
  }

  // --- Validation ---
  function validateField(field) {
    const name = field.name;
    const value = field.value.trim();
    let error = '';

    switch (name) {
      case 'ownerName':
        if (!value) error = 'Please enter your name.';
        else if (value.length < 2) error = 'Name must be at least 2 characters.';
        break;
      case 'email':
        if (!value) error = 'Please enter your email.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email.';
        break;
      case 'phone':
        if (!value) error = 'Please enter your phone number.';
        else if (!/^\+?[\d\s\-()]{7,15}$/.test(value)) error = 'Please enter a valid phone number.';
        break;
      case 'dogName':
        if (!value) error = 'Please enter your dog\'s name.';
        break;
      case 'service':
        if (!value) error = 'Please select a service.';
        break;
      case 'date':
        if (!value) error = 'Please select a date.';
        else {
          const selected = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selected < today) error = 'Date must be in the future.';
        }
        break;
      case 'notes':
        if (value.length > 500) error = 'Notes must be under 500 characters.';
        break;
    }

    const errorEl = document.getElementById('error-' + name);
    if (errorEl) {
      if (error) {
        errorEl.textContent = error;
        errorEl.classList.remove('hidden');
        field.setAttribute('aria-invalid', 'true');
        field.classList.add('border-red-500');
      } else {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
        field.setAttribute('aria-invalid', 'false');
        field.classList.remove('border-red-500');
      }
    }
    return !error;
  }

  function validateForm() {
    const fields = form.querySelectorAll('[name]');
    let valid = true;
    fields.forEach(function (field) {
      if (!validateField(field)) valid = false;
    });
    return valid;
  }

  function clearErrors() {
    const errorEls = modal.querySelectorAll('[id^="error-"]');
    errorEls.forEach(function (el) {
      el.textContent = '';
      el.classList.add('hidden');
    });
    const fields = form.querySelectorAll('[name]');
    fields.forEach(function (field) {
      field.setAttribute('aria-invalid', 'false');
      field.classList.remove('border-red-500');
    });
  }

  // --- Submit Handler ---
  function handleSubmit(e) {
    e.preventDefault();
    clearErrors();

    if (!validateForm()) {
      if (errorMsg) {
        errorMsg.textContent = 'Please fix the errors above.';
        errorMsg.classList.remove('hidden');
      }
      return;
    }

    // Gather form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach(function (value, key) {
      data[key] = value;
    });

    // Simulate API call (replace with real endpoint)
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Booking...';

    // Simulate network delay
    setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Show success
      if (successMsg) {
        successMsg.classList.remove('hidden');
        successMsg.innerHTML = '<p class="text-lg font-semibold text-green-700">\u2705 Booking Confirmed!</p>' +
          '<p class="text-gray-600 mt-2">Thank you, ' + escapeHtml(data.ownerName) + '! We\'ve received your booking for ' +
          escapeHtml(data.dogName) + ' on ' + escapeHtml(data.date) + '. A confirmation email will arrive shortly.</p>';
      }
      form.classList.add('hidden');

      // Auto-close after 5 seconds
      setTimeout(function () {
        closeModal();
        form.classList.remove('hidden');
        if (successMsg) successMsg.classList.add('hidden');
      }, 5000);
    }, 1200);
  }

  // --- Utility ---
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // --- Event Listeners ---
  openBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  closeBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      closeModal();
    });
  });

  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
  }

  if (form) {
    form.addEventListener('submit', handleSubmit);

    // Real-time validation on blur
    const fields = form.querySelectorAll('[name]');
    fields.forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(field);
      });
      field.addEventListener('input', function () {
        const errorEl = document.getElementById('error-' + field.name);
        if (errorEl && !errorEl.classList.contains('hidden')) {
          validateField(field);
        }
      });
    });
  }

  // --- Set min date on date input ---
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // --- Expose for debugging ---
  window.PawshBookingModal = { open: openModal, close: closeModal };
})();
