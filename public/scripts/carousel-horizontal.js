export function setupHorizontalCarousel(carouselSelector, interval = 6000) {
  const carousel = document.querySelector(carouselSelector);
  if (!carousel) return;
  const cards = carousel.querySelectorAll('.carousel-card');
  let current = 0;
  let timer;

  function showCard(idx) {
    cards.forEach((card, i) => {
      card.classList.toggle('opacity-100', i === idx);
      card.classList.toggle('opacity-0', i !== idx);
      card.classList.toggle('pointer-events-none', i !== idx);
      card.style.transform = `translateX(${(i - idx) * 110}%)`;
      card.style.zIndex = i === idx ? 10 : 1;
    });
  }

  function next() {
    current = (current + 1) % cards.length;
    showCard(current);
    resetTimer();
  }
  function prev() {
    current = (current - 1 + cards.length) % cards.length;
    showCard(current);
    resetTimer();
  }
  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, interval);
  }

  carousel.querySelector('.carousel-next').onclick = next;
  carousel.querySelector('.carousel-prev').onclick = prev;

  showCard(current);
  resetTimer();
}

document.addEventListener('DOMContentLoaded', () => {
  setupHorizontalCarousel('#specialties-carousel');
});
