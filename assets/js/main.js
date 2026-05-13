/**
 * main.js — Navbar, hamburger menu, scroll animations
 * murrplastikvn.com
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── Hamburger / Mobile menu ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = document.getElementById('navbar').offsetHeight + 8;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  /* ── Scroll reveal animations ── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── ScrollSpy: Highlight active nav link ── */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = Array.from(navLinks).map(link => {
    const selector = link.getAttribute('href');
    if (selector.startsWith('#') && selector.length > 1) {
      return document.querySelector(selector);
    }
    return null;
  }).filter(Boolean);

  const scrollSpy = () => {
    let current = '';
    const offset = navbar.offsetHeight + 100;
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - offset) {
        current = '#' + section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === current);
    });
  };
  window.addEventListener('scroll', scrollSpy, { passive: true });
  scrollSpy(); // Initial check

  /* ── Handle hash on load (from sub-pages) ── */
  if (window.location.hash) {
    const targetId = window.location.hash;
    const performScroll = () => {
      const target = document.querySelector(targetId);
      if (target) {
        const offset = navbar.offsetHeight + 30;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    };

    // Attempt 1: DOMContentLoaded
    performScroll();

    // Attempt 2: window.load (all resources ready)
    window.addEventListener('load', () => {
      setTimeout(performScroll, 100);
      setTimeout(performScroll, 500); // Attempt 3: Just in case of delayed rendering
    });
  }

  /* ── Stats counter animation ── */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let count = 0;
        const step = Math.ceil(target / 50);
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          el.innerHTML = count + '<em>' + suffix + '</em>';
          if (count >= target) clearInterval(timer);
        }, 28);
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }

  /* ── Hide Preloader ── */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.remove(), 600);
      }, 500);
    });
  }
});
