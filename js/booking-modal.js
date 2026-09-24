import { initBookingModal } from './booking-modal.js';

const modal = document.getElementById('booking-modal');
const openBtns = document.querySelectorAll('[data-open-modal]');
const closeBtns = document.querySelectorAll('[data-close-modal]');
const form = document.getElementById('booking-form');
const overlay = document.getElementById('modal-overlay');
const successMsg = document.getElementById('booking-success');
const errorMsg = document.getElementById('booking-error');

let lastFocused = null;

function openModal() {
  lastFocused = document.activeElement;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const firstInput = modal.querySelector('input, select, textarea, button');
  if (firstInput) firstInput.focus();
  document.addEventListener('keydown', handleEscape);
}

function closeModal() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleEscape);
  if (lastFocused) lastFocused.focus();
  form.reset();
  successMsg.classList.add('hidden');
  errorMsg.classList.add('hidden');
  clearErrors();
}

function handleEscape(e) {
  if (e.key === 'Escape') closeModal();
}

function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const focusable = modal.querySelectorAll(
    'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href]'
  );
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

function clearErrors() {
  const fields = form.querySelectorAll('[data-error]');
  fields.forEach(el => {
    el.classList.remove('border-red-500');
    const err = el.parentElement.querySelector('.field-error');
    if (err) { err.textContent = ''; err.classList.add('hidden'); }
  });
}

function validateField(field) {
  const name = field.name;
  const value = field.value.trim();
  let error = '';

  switch (name) {
    case 'ownerName':
      if (!value) error = 'Owner name is required.';
      else if (value.length < 2) error = 'Name must be at least 2 characters.';
      break;
    case 'email':
      if (!value) error = 'Email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email.';
      break;
    case 'phone':
      if (!value) error = 'Phone number is required.';
      else if (!/^\+?[\d\s\-()]{7,15}$/.test(value)) error = 'Please enter a valid phone number.';
      break;
    case 'dogName':
      if (!value) error = 'Dog name is required.';
      break;
    case 'dogBreed':
      if (!value) error = 'Dog breed is required.';
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
        if (selected < today) error = 'Date cannot be in the past.';
      }
      break;
    case 'time':
      if (!value) error = 'Please select a time.';
      break;
    case 'notes':
      if (value.length > 500) error = 'Notes must be under 500 characters.';
      break;
  }

  const errEl = field.parentElement.querySelector('.field-error');
  if (error) {
    field.classList.add('border-red-500');
    if (errEl) { errEl.textContent = error; errEl.classList.remove('hidden'); }
    return false;
  } else {
    field.classList.remove('border-red-500');
    if (errEl) { errEl.textContent = ''; errEl.classList.add('hidden'); }
    return true;
  }
}

function validateForm() {
  const requiredFields = form.querySelectorAll('[required]');
  let valid = true;
  requiredFields.forEach(field => {
    if (!validateField(field)) valid = false;
  });
  return valid;
}

async function handleSubmit(e) {
  e.preventDefault();
  clearErrors();
  successMsg.classList.add('hidden');
  errorMsg.classList.add('hidden');

  if (!validateForm()) {
    errorMsg.textContent = 'Please fix the errors above and try again.';
    errorMsg.classList.remove('hidden');
    const firstError = form.querySelector('.border-red-500');
    if (firstError) firstError.focus();
    return;
  }

  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Booking...';

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Server error');

    form.reset();
    successMsg.classList.remove('hidden');
    setTimeout(() => closeModal(), 3000);
  } catch (err) {
    errorMsg.textContent = 'Something went wrong. Please try again or call us directly.';
    errorMsg.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

function initBookingModal() {
  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
  overlay.addEventListener('click', closeModal);
  modal.addEventListener('keydown', trapFocus);
  form.addEventListener('submit', handleSubmit);

  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('border-red-500')) validateField(field);
    });
  });
}

initBookingModal();

export { initBookingModal };
