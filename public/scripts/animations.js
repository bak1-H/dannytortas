// Animations & UX helpers (no framework)

const header = document.querySelector('header[data-animate="sticky"]');
let lastScrollY = window.scrollY || 0;

// Respect users who prefer reduced motion (set once, queried below)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1) Smooth scroll for internal anchors (adjusted for sticky header height)
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || href === '#') return;

  const target = document.querySelector(href);
  if (!target) return;

  e.preventDefault();

  const headerOffset = header?.offsetHeight ?? 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  const y = Math.max(0, targetTop - headerOffset - 8);

  window.scrollTo({ top: y, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

// 2) Scroll reveal using IntersectionObserver (with staggered groups)
const revealEls = [...document.querySelectorAll('.reveal')];

// Assign incremental delays to items inside a [data-stagger] container
if (!prefersReducedMotion) {
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    [...group.querySelectorAll('.reveal')].forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${i * 90}ms`);
    });
  });
}

if (!prefersReducedMotion && 'IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('is-visible');
          io.unobserve(el);
          // Clear the stagger delay once revealed so hover stays snappy
          el.addEventListener(
            'transitionend',
            () => el.style.setProperty('--reveal-delay', '0ms'),
            { once: true }
          );
        }
      }
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// 3) Ripple-ish press feedback for buttons
function attachRipple(el) {
  el.classList.add('ripple');

  const setPoint = (evt) => {
    const r = el.getBoundingClientRect();
    const x = (evt.clientX - r.left) / r.width;
    const y = (evt.clientY - r.top) / r.height;
    el.style.setProperty('--x', `${Math.round(x * 100)}%`);
    el.style.setProperty('--y', `${Math.round(y * 100)}%`);
  };

  el.addEventListener('pointerdown', (evt) => {
    setPoint(evt);
    el.classList.add('is-pressed');
  });
  const clear = () => el.classList.remove('is-pressed');
  el.addEventListener('pointerup', clear);
  el.addEventListener('pointercancel', clear);
  el.addEventListener('pointerleave', clear);
}

[...document.querySelectorAll('[data-animate="ripple"]')].forEach(attachRipple);

// 4) Sticky header shadow + slight shrink on scroll
if (header) {
  const onScroll = () => {
    const y = window.scrollY || 0;
    header.classList.toggle('shadow-lg', y > 8);

    const goingDown = y > lastScrollY && y > 24;
    const shouldShow = y < lastScrollY || y < 8;

    if (goingDown) {
      header.classList.add('-translate-y-full');
    } else if (shouldShow) {
      header.classList.remove('-translate-y-full');
    }

    lastScrollY = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// 5) Active nav link highlight based on section in view
const sections = [...document.querySelectorAll('section[data-section]')];
const navLinks = [...document.querySelectorAll('a[data-nav]')];
if ('IntersectionObserver' in window && sections.length && navLinks.length) {
  const byId = new Map(navLinks.map((a) => [a.getAttribute('href'), a]));

  const io = new IntersectionObserver(
    (entries) => {
      // pick the entry most in view
      const visible = entries
        .filter((x) => x.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

      if (!visible) return;
      const id = `#${visible.target.id}`;

      for (const a of navLinks) a.classList.remove('text-primary');
      const active = byId.get(id);
      if (active) active.classList.add('text-primary');
    },
    { rootMargin: '-20% 0px -65% 0px', threshold: [0.1, 0.2, 0.35, 0.5] }
  );

  sections.forEach((s) => io.observe(s));
}

// 6) 3D tilt on cards — rotates the inner card toward the cursor + moves a glossy highlight
const tiltWraps = [...document.querySelectorAll('[data-tilt]')];
if (!prefersReducedMotion && tiltWraps.length && window.matchMedia('(pointer: fine)').matches) {
  const MAX = 8; // max tilt in degrees

  for (const wrap of tiltWraps) {
    const card = wrap.querySelector('article');
    const glare = wrap.querySelector('.tilt-glare');
    if (!card) continue;

    wrap.addEventListener('pointermove', (e) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height; // 0..1
      const ry = (px - 0.5) * (MAX * 2);
      const rx = (0.5 - py) * (MAX * 2);
      card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.02)`;
      if (glare) {
        glare.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        glare.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      }
    });

    wrap.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  }
}

// 7) Tilt on scroll for touch devices (no cursor) — cards lean by their distance
//    to the viewport center and straighten as they pass through the middle.
const isTouch =
  window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches;

if (!prefersReducedMotion && tiltWraps.length && isTouch) {
  const MAX = 6; // max tilt in degrees
  let ticking = false;

  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    const mid = vh / 2;

    for (const wrap of tiltWraps) {
      const card = wrap.querySelector('article');
      if (!card) continue;

      const r = wrap.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue; // skip offscreen cards

      const center = r.top + r.height / 2;
      let d = (mid - center) / mid; // ~ -1 (below) .. 1 (above)
      d = Math.max(-1, Math.min(1, d));
      card.style.transform = `rotateX(${(d * MAX).toFixed(2)}deg)`;
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}
