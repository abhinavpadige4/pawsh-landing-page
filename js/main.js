/* Pawsh Dog Grooming Salon - Main JavaScript
   Handles: initialization, mobile menu toggle, lazy-load observer,
   smooth scrolling, and global behaviors.
*/

(function () {
  'use strict';

  // ── DOM Ready ──────────────────────────────────────────────────────────────
  function init() {
    setupMobileMenu();
    setupLazyLoad();
    setupSmoothScroll();
    setupScrollReveal();
    setupStickyHeader();
  }

  // ── Mobile Menu Toggle ─────────────────────────────────────────────────────
  function setupMobileMenu() {
    const toggleBtn = document.querySelector('[data-menu-toggle]');
    const navMenu = document.querySelector('[data-nav-menu]');
    const navLinks = document.querySelectorAll('[data-nav-link]');

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const isOpen = navMenu.classList.toggle('is-open');
      toggleBtn.classList.toggle('is-active');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      toggleBtn.setAttribute(
        'aria-label',
        isOpen ? 'Close navigation menu' : 'Open navigation menu'
      );

      // Lock body scroll when menu is open
      document.body.classList.toggle('overflow-hidden', isOpen);
    });

    // Close menu when a nav link is clicked
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        toggleBtn.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-label', 'Open navigation menu');
        document.body.classList.remove('overflow-hidden');
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        toggleBtn.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-label', 'Open navigation menu');
        document.body.classList.remove('overflow-hidden');
        toggleBtn.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (
        navMenu.classList.contains('is-open') &&
        !navMenu.contains(e.target) &&
        !toggleBtn.contains(e.target)
      ) {
        navMenu.classList.remove('is-open');
        toggleBtn.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('overflow-hidden');
      }
    });
  }

  // ── Lazy-Load Observer ─────────────────────────────────────────────────────
  function setupLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (!lazyImages.length) return;

    // Set initial state
    lazyImages.forEach(function (img) {
      img.setAttribute('loading', 'lazy');
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.4s ease';
    });

    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images immediately
      lazyImages.forEach(function (img) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        img.style.opacity = '1';
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
              img.style.opacity = '1';
            });

            // Handle cached images that fire load immediately
            if (img.complete && img.naturalWidth > 0) {
              img.style.opacity = '1';
            }

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

  // ── Smooth Scroll ──────────────────────────────────────────────────────────
  function setupSmoothScroll() {
    const smoothLinks = document.querySelectorAll('a[href^="#"]');

    smoothLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      });
    });
  }

  // ── Scroll Reveal Animations ───────────────────────────────────────────────
  function setupScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-reveal-delay') || '0';
            entry.target.style.transitionDelay = delay + 'ms';
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ── Sticky Header ──────────────────────────────────────────────────────────
  function setupStickyHeader() {
    const header = document.querySelector('[data-header]');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;

    function updateHeader() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }

      // Hide/show header on scroll direction
      if (currentScroll > lastScroll && currentScroll > 200) {
        header.classList.add('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }

      lastScroll = currentScroll;
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
