// Animations & UX helpers (no framework)

const header = document.querySelector('header[data-animate="sticky"]');
let lastScrollY = window.scrollY || 0;

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

  window.scrollTo({ top: y, behavior: 'smooth' });
});

// 2) Scroll reveal using IntersectionObserver
const revealEls = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
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

[...document.querySelectorAll('button[data-animate="ripple"]')].forEach(attachRipple);

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
