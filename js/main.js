/* =====================================================
   MICROBOOK – main.js
===================================================== */

'use strict';

/* --- Navbar: shrink on scroll ------------------- */
(function () {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();

/* --- Active nav-link on scroll ------------------ */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#mainNav .nav-link');

  const onScroll = () => {
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* --- Counter animation (Intersection Observer) -- */
(function () {
  const counters = document.querySelectorAll('.metric-number[data-target]');
  if (!counters.length) return;

  const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      el.textContent = Math.floor(easeOutQuad(progress) * target);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
})();

/* --- Fade-in on scroll (lightweight AOS clone) -- */
(function () {
  const targets = document.querySelectorAll('[data-aos]');
  if (!targets.length) return;

  targets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'none';
          }, 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
})();

/* --- Contact Form validation & submit ----------- */
(function () {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    /* Simula envio (substitua por fetch real se necessário) */
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando…';

    setTimeout(() => {
      form.reset();
      form.classList.remove('was-validated');
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Enviar Mensagem';

      if (successMsg) {
        successMsg.classList.remove('d-none');
        setTimeout(() => successMsg.classList.add('d-none'), 5000);
      }
    }, 1400);
  });
})();

/* --- Phone mask --------------------------------- */
(function () {
  const tel = document.getElementById('telefone');
  if (!tel) return;

  tel.addEventListener('input', () => {
    let v = tel.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (v.length > 5) {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d*)/, '($1) $2');
    }
    tel.value = v;
  });
})();

/* --- Smooth scroll for anchor links ------------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    /* Close mobile navbar if open */
    const navCollapse = document.getElementById('navbarNav');
    if (navCollapse && navCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
      if (bsCollapse) bsCollapse.hide();
    }

    const offset = document.getElementById('mainNav').offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
