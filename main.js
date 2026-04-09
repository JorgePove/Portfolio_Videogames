/* ============================================================
   JORGE GOMEZ PORTFOLIO — main.js
   ============================================================ */

/* ── 1. NAV BORDER ON SCROLL ─────────────────────────────── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    nav.style.borderBottomColor = '#C8C4BE';
  } else {
    nav.style.borderBottomColor = '#1e2730';
  }
});


/* ── 2. SCROLL PROGRESS BAR ──────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}, { passive: true });


/* ── 3. INTERSECTION OBSERVER — animate on scroll ────────── */
const observerOptions = {
  threshold: 0.08,
  rootMargin: '0px 0px -20px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate').forEach(el => observer.observe(el));

// Fallback: si por algún motivo el observer no dispara en 800ms, mostrar todo
setTimeout(() => {
  document.querySelectorAll('.animate:not(.is-visible)').forEach(el => {
    el.classList.add('is-visible');
  });
}, 800);


/* ── 4. GLITCH EFFECT ON HERO TITLE ─────────────────────── */
const heroTitle = document.querySelector('.hero__title');

if (heroTitle) {
  const originalText = heroTitle.textContent;
  const glitchChars = '!<>-_\\/[]{}=+*^?#@$%&|~';

  function runGlitch(duration = 420) {
    let frame = 0;
    const totalFrames = Math.floor(duration / 16);
    heroTitle.classList.add('glitching');

    const interval = setInterval(() => {
      const resolved = Math.floor((frame / totalFrames) * originalText.length);
      heroTitle.textContent = originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < resolved) return char;
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        })
        .join('');

      frame++;
      if (frame >= totalFrames) {
        clearInterval(interval);
        heroTitle.textContent = originalText;
        heroTitle.classList.remove('glitching');
      }
    }, 16);
  }

  setTimeout(() => runGlitch(600), 400);

  function scheduleRandomGlitch() {
    const delay = 5000 + Math.random() * 5000;
    setTimeout(() => {
      runGlitch(400);
      scheduleRandomGlitch();
    }, delay);
  }
  scheduleRandomGlitch();
}


/* ── 5. TYPEWRITER — hero subtitle ──────────────────────── */
const heroSubtitle = document.querySelector('.hero__subtitle');

if (heroSubtitle) {
  const fullText = heroSubtitle.textContent.trim();
  heroSubtitle.textContent = '';
  heroSubtitle.style.opacity = '1';
  heroSubtitle.style.animation = 'none';

  let charIndex = 0;

  const startTypewriter = () => {
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '_';
    heroSubtitle.appendChild(cursor);

    const typeInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        cursor.before(fullText[charIndex]);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => cursor.remove(), 2200);
      }
    }, 42);
  };

  setTimeout(startTypewriter, 1000);

  // Fallback: si por algún motivo no arrancó, mostrar el texto completo
  setTimeout(() => {
    if (charIndex === 0) {
      heroSubtitle.textContent = fullText;
    }
  }, 1500);
}


/* ── 6. LIGHTBOX ─────────────────────────────────────────── */
(function buildLightbox() {
  const images = document.querySelectorAll('.project-media__item img, .project-card__img img');
  if (!images.length) return;

  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.innerHTML = `
    <button class="lightbox__close" aria-label="Close">&#x2715;</button>
    <button class="lightbox__prev" aria-label="Previous">&#x2039;</button>
    <button class="lightbox__next" aria-label="Next">&#x203a;</button>
    <div class="lightbox__img-wrap">
      <img class="lightbox__img" src="" alt="" />
    </div>
    <p class="lightbox__counter"></p>
  `;
  document.body.appendChild(overlay);

  const lbImg     = overlay.querySelector('.lightbox__img');
  const lbCounter = overlay.querySelector('.lightbox__counter');
  const lbClose   = overlay.querySelector('.lightbox__close');
  const lbPrev    = overlay.querySelector('.lightbox__prev');
  const lbNext    = overlay.querySelector('.lightbox__next');

  let currentIndex = 0;
  let gallery = [];

  function openLightbox(index) {
    currentIndex = index;
    lbImg.src = gallery[index].src;
    lbImg.alt = gallery[index].alt;
    lbCounter.textContent = (index + 1) + ' / ' + gallery.length;
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + gallery.length) % gallery.length;
    lbImg.classList.add('lb-fade');
    setTimeout(() => {
      lbImg.src = gallery[currentIndex].src;
      lbImg.alt = gallery[currentIndex].alt;
      lbCounter.textContent = (currentIndex + 1) + ' / ' + gallery.length;
      lbImg.classList.remove('lb-fade');
    }, 150);
  }

  images.forEach((img, i) => {
    gallery.push({ src: img.src, alt: img.alt || '' });
    img.parentElement.style.cursor = 'zoom-in';
    img.parentElement.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => navigate(-1));
  lbNext.addEventListener('click', () => navigate(1));
  overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });
})();


/* ── 7. PAGE TRANSITIONS (fade) ─────────────────────────── */
(function pageTransitions() {
  const curtain = document.createElement('div');
  curtain.id = 'page-curtain';
  document.body.appendChild(curtain);

  // Fix: cuando el navegador restaura la página desde bfcache (botón Atrás/Adelante),
  // el curtain puede quedarse opaco. Lo reseteamos inmediatamente.
  window.addEventListener('pageshow', e => {
    if (e.persisted) {
      curtain.classList.remove('fade-in');
      curtain.style.opacity = '0';
      curtain.style.pointerEvents = 'none';
    }
  });

  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;
    const isInternal = href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('//');
    if (!isInternal) return;

    e.preventDefault();
    curtain.classList.add('fade-in');

    setTimeout(() => {
      window.location.href = href;
    }, 320);
  });
})();


/* ── 8. SIDEBAR NAV (index.html only) ───────────────────── */
(function buildSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const links = sidebar.querySelectorAll('.sidebar__link');
  const sections = [];

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) sections.push({ el: target, link });
    }
  });

  function updateActive() {
    const scrollY = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0];
    sections.forEach(s => {
      if (s.el.getBoundingClientRect().top + window.scrollY <= scrollY) {
        current = s;
      }
    });
    links.forEach(l => l.classList.remove('sidebar__link--active'));
    if (current) current.link.classList.add('sidebar__link--active');
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();
