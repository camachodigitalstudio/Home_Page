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

  // Autoplay (guardamos el intervalo en una variable)
  let autoplay = setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }, 5000);
  function restartAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    }, 5000);
  }
  // Bloquear clic derecho en toda la página
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
  // Evitar arrastrar imágenes
  document.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG") {
      e.preventDefault();
    }
  });

  // Swipe para móviles
  let startX = 0;
  let deltaX = 0;
  let isSwiping = false;

  track.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      isSwiping = true;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchmove",
    (e) => {
      if (!isSwiping) return;
      deltaX = e.touches[0].clientX - startX;

      // 👇 evita que Safari intente hacer scroll en vertical
      if (Math.abs(deltaX) > 10) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  track.addEventListener("touchend", () => {
    if (!isSwiping) return;

    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        currentIndex = (currentIndex + 1) % slides.length;
      } else {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      }
      updateCarousel();
      restartAutoplay(); // 👈 Pausa y reinicia autoplay después del swipe
    }

    // reset
    startX = 0;
    deltaX = 0;
    isSwiping = false;
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
  // ==================== TESTIMONIOS ROTATIVOS ====================
  const quotes = document.querySelectorAll(".testimonials .quote");
  let currentQuote = 0;

  function showNextQuote() {
    quotes[currentQuote].classList.remove("active");
    currentQuote = (currentQuote + 1) % quotes.length;
    quotes[currentQuote].classList.add("active");
  }

  // Cambiar cada 5 segundos
  setInterval(showNextQuote, 6000);

  // ==================== BOTÓN FLOTANTE DE CONTACTO ====================
  const fabMainBtn = document.getElementById("fabMainBtn");
  const fabOptions = document.querySelector(".fab-options");

  fabMainBtn.addEventListener("click", () => {
    fabMainBtn.classList.toggle("active");
    fabOptions.classList.toggle("show");
  });

  // ==================== HERO BACKGROUND ROTATIVO ====================
  // ==================== HERO BACKGROUND ROTATIVO ====================
  const heroEl = document.querySelector(".hero");
  const images = [
    "./assets/hero/hero.webp",
    "./assets/hero/hero2.webp",
    "./assets/hero/hero3.webp",
  ];
  let current = 0;

  // Precargar imágenes
  const preloadImages = (srcArray) => {
    srcArray.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  };
  preloadImages(images);

  // Capa inicial
  const bg = document.createElement("div");
  bg.classList.add("hero-bg");
  bg.style.backgroundImage = `url(${images[current]})`;
  bg.style.opacity = "1";
  heroEl.appendChild(bg);

  setInterval(() => {
    current = (current + 1) % images.length;
    const nextImg = images[current];

    // Crear nueva capa para el fade
    const fadeLayer = document.createElement("div");
    fadeLayer.classList.add("hero-bg");
    fadeLayer.style.backgroundImage = `url(${nextImg})`;
    fadeLayer.style.opacity = "0";
    heroEl.appendChild(fadeLayer);

    // Forzar reflow y aplicar fade-in
    requestAnimationFrame(() => {
      fadeLayer.style.opacity = "1";
    });

    // Cuando termine la transición, quitamos la capa anterior
    fadeLayer.addEventListener("transitionend", () => {
      const allLayers = heroEl.querySelectorAll(".hero-bg");
      allLayers.forEach((layer, i) => {
        if (i < allLayers.length - 1) heroEl.removeChild(layer);
      });
    });
  }, 3000);
});
