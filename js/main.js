/* Pawsh Dog Grooming Salon — main.js
   Initialization, mobile menu toggle, lazy-load observer */

(function () {
  'use strict';

  // ── DOM Ready ──────────────────────────────────────────────
  function init() {
    initMobileMenu();
    initLazyLoad();
    initSmoothScroll();
    initScrollReveal();
    initBookingModal();
    initStickyCTA();
  }

  // ── Mobile Menu Toggle ─────────────────────────────────────
  function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    const overlay = document.getElementById('nav-overlay');
    const body = document.body;

    if (!toggle || !nav) return;

    function openMenu() {
      nav.classList.add('is-open');
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
      if (overlay) overlay.classList.add('is-visible');
      body.classList.add('no-scroll');
    }

    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      if (overlay) overlay.classList.remove('is-visible');
      body.classList.remove('no-scroll');
    }

    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    // Close on overlay click
    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close when a nav link is clicked (mobile)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Reset menu state on resize to desktop
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth >= 768) {
          closeMenu();
        }
      }, 150);
    });
  }

  // ── Lazy-Load Observer ─────────────────────────────────────
  function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (!lazyImages.length) return;

    // Fallback: if IntersectionObserver is not supported, load all
    if (!('IntersectionObserver' in window)) {
      lazyImages.forEach(function (img) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
      return;
    }

    const imageObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            const srcset = img.getAttribute('data-srcset');
            const sizes = img.getAttribute('data-sizes');

            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
            }
            if (srcset) {
              img.srcset = srcset;
              img.removeAttribute('data-srcset');
            }
            if (sizes) {
              img.sizes = sizes;
              img.removeAttribute('data-sizes');
            }

            img.addEventListener('load', function () {
              img.classList.add('is-loaded');
            });

            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.01
      }
    );

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

  // ── Smooth Scroll ──────────────────────────────────────────
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const headerHeight = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // ── Scroll Reveal Animations ───────────────────────────────
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-reveal-delay') || '0';
            entry.target.style.transitionDelay = delay + 'ms';
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ── Booking Modal ──────────────────────────────────────────
  function initBookingModal() {
    const openBtns = document.querySelectorAll('[data-open-modal]');
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.getElementById('modal-close');
    const overlay = document.getElementById('modal-overlay');
    const body = document.body;

    if (!modal) return;

    function openModal() {
      modal.classList.add('is-open');
      body.classList.add('no-scroll');
      // Focus first focusable element
      setTimeout(function () {
        const firstInput = modal.querySelector('input, select, textarea, button');
        if (firstInput) firstInput.focus();
      }, 100);
    }

    function closeModal() {
      modal.classList.remove('is-open');
      body.classList.remove('no-scroll');
    }

    openBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    if (overlay) {
      overlay.addEventListener('click', closeModal);
    }

    // Trap focus inside modal
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = modal.querySelectorAll(
        'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Form submission
    const form = document.getElementById('booking-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = form.querySelector('#booking-name');
        const email = form.querySelector('#booking-email');
        const phone = form.querySelector('#booking-phone');
        const service = form.querySelector('#booking-service');
        const date = form.querySelector('#booking-date');
        const notes = form.querySelector('#booking-notes');
        const errorContainer = document.getElementById('form-errors');
        const successContainer = document.getElementById('form-success');

        // Clear previous errors
        if (errorContainer) errorContainer.innerHTML = '';
        if (successContainer) successContainer.classList.remove('is-visible');

        let errors = [];

        if (name && !name.value.trim()) {
          errors.push('Please enter your name.');
          name.classList.add('has-error');
        } else if (name) {
          name.classList.remove('has-error');
        }

        if (email && !email.value.trim()) {
          errors.push('Please enter your email.');
          email.classList.add('has-error');
        } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          errors.push('Please enter a valid email address.');
          email.classList.add('has-error');
        } else if (email) {
          email.classList.remove('has-error');
        }

        if (phone && !phone.value.trim()) {
          errors.push('Please enter your phone number.');
          phone.classList.add('has-error');
        } else if (phone) {
          phone.classList.remove('has-error');
        }

        if (service && !service.value) {
          errors.push('Please select a service.');
          service.classList.add('has-error');
        } else if (service) {
          service.classList.remove('has-error');
        }

        if (date && !date.value) {
          errors.push('Please select a preferred date.');
          date.classList.add('has-error');
        } else if (date) {
          date.classList.remove('has-error');
        }

        if (errors.length > 0) {
          if (errorContainer) {
            errors.forEach(function (err) {
              const li = document.createElement('li');
              li.textContent = err;
              errorContainer.appendChild(li);
            });
          }
          return;
        }

        // Simulate successful submission
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }

        setTimeout(function () {
          if (successContainer) {
            successContainer.classList.add('is-visible');
            successContainer.innerHTML =
              '<p>Thank you, ' + (name ? name.value.trim() : 'friend') + '! Your booking request has been received. We\'ll confirm your appointment within 24 hours.</p>';
          }
          form.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Book Appointment';
          }
        }, 1200);
      });
    }
  }

  // ── Sticky CTA ─────────────────────────────────────────────
  function initStickyCTA() {
    const cta = document.getElementById('sticky-cta');
    if (!cta) return;

    let ticking = false;

    function updateCTA() {
      const scrollY = window.pageYOffset;
      const heroHeight = document.getElementById('hero')
        ? document.getElementById('hero').offsetHeight
        : 600;

      if (scrollY > heroHeight) {
        cta.classList.add('is-visible');
      } else {
        cta.classList.remove('is-visible');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateCTA);
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Boot ───────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
