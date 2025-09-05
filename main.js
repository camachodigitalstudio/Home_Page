document.addEventListener("DOMContentLoaded", () => {
  // Año dinámico
  document.getElementById("year").textContent = new Date().getFullYear();

  // Menú hamburguesa
  const menuBtn = document.getElementById("menuBtn");
  const mobilePanel = document.getElementById("mobilePanel");
  menuBtn.addEventListener("click", () => {
    mobilePanel.classList.toggle("active");
    menuBtn.classList.toggle("active"); // 👈 activa la animación de la hamburguesa
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

  // ==================== FORMULARIO DE CONTACTO ====================
  const form = document.getElementById("contactForm");
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const messageField = document.getElementById("message");
  const formMsg = document.getElementById("formMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    // Reset errores
    document
      .querySelectorAll(".error-msg")
      .forEach((el) => (el.textContent = ""));

    // Validar nombre
    const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!namePattern.test(nameField.value.trim())) {
      showError(nameField, "El nombre solo debe contener letras.");
      valid = false;
    }

    // Validar email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailField.value.trim())) {
      showError(emailField, "Ingresa un correo electrónico válido.");
      valid = false;
    }

    // Validar mensaje
    if (messageField.value.trim().length < 5) {
      showError(messageField, "El mensaje es demasiado corto.");
      valid = false;
    }

    if (!valid) return; // ❌ No enviamos si hay errores

    // ✅ Si todo está bien, enviamos con fetch a Formspree
    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          formMsg.textContent = "¡Gracias! Tu mensaje ha sido enviado ✅";
          formMsg.style.color = "#ffffffff";
          form.reset();
        } else {
          formMsg.textContent =
            "❌ Hubo un error al enviar el mensaje. Intenta de nuevo.";
          formMsg.style.color = "#ff4d4d";
        }
      })
      .catch(() => {
        formMsg.textContent =
          "❌ Error de red. Revisa tu conexión e intenta nuevamente.";
        formMsg.style.color = "#ff4d4d";
      });
  });

  function showError(input, message) {
    const errorMsg = input.parentElement.querySelector(".error-msg");
    if (errorMsg) {
      errorMsg.textContent = message;
      errorMsg.style.color = "#ff4d4d";
      errorMsg.style.fontSize = "0.85rem";
    }
  }
});
