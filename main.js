document.addEventListener("DOMContentLoaded", () => {
  // Año dinámico
  document.getElementById("year").textContent = new Date().getFullYear();

  // Menú hamburguesa
  const menuBtn = document.getElementById("menuBtn");
  const mobilePanel = document.getElementById("mobilePanel");
  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", !expanded);
    mobilePanel.classList.toggle("active");
  });

  // Animaciones de aparición (scroll reveal)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document
    .querySelectorAll("[data-reveal]")
    .forEach((el) => observer.observe(el));

  // Carousel
  const track = document.getElementById("carouselTrack");
  const slides = Array.from(track.children);
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const dotsNav = document.getElementById("carouselDots");

  let currentIndex = 0;

  // Crear dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsNav.appendChild(dot);
  });

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dotsNav
      .querySelectorAll("button")
      .forEach((btn, i) => btn.classList.toggle("active", i === currentIndex));
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  // Autoplay
  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }, 5000);

  // Swipe para móviles
  let startX = 0;
  track.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
  track.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) nextBtn.click();
    if (endX - startX > 50) prevBtn.click();
  });

  // Formulario (validación simple)
  const form = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formMsg.textContent = "¡Gracias! Tu mensaje ha sido enviado.";
    form.reset();
  });
});
