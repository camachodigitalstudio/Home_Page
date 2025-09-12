document.addEventListener("DOMContentLoaded", () => {
  // Animaciones de aparición
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.07 }
  );

  document
    .querySelectorAll("[data-reveal]")
    .forEach((el) => observer.observe(el));
  document.querySelectorAll(".toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const extras = btn.previousElementSibling.querySelectorAll(".extra");
      extras.forEach((el) => el.classList.toggle("hidden"));

      btn.textContent = btn.textContent === "Ver más" ? "Ver menos" : "Ver más";
    });
  });
});
