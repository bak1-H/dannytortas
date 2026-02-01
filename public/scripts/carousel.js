export function setupCarousel(carouselSelector, interval = 4000) {
  const carousel = document.querySelector(carouselSelector);
  if (!carousel) return;
  const cards = carousel.querySelectorAll('.carousel-card');
  let current = 0;
  function showCard(idx) {
    cards.forEach((card, i) => {
      card.classList.toggle('opacity-100', i === idx);
      card.classList.toggle('opacity-0', i !== idx);
      card.classList.toggle('pointer-events-none', i !== idx);
    });
  }
  showCard(current);
  setInterval(() => {
    current = (current + 1) % cards.length;
    showCard(current);
  }, interval);
}

document.addEventListener('DOMContentLoaded', () => {
  setupCarousel('#specialties-carousel');
});
