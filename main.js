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

  // ==================== Carousel ====================
  const track = document.getElementById("carouselTrack");
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsNav = document.getElementById("carouselDots");
  const carouselContainer = document.getElementById("carousel");

  let currentIndex = 0;
  let autoplayInterval;

  // Crear los dots
  slides.forEach((_, index) => {
    const button = document.createElement("button");
    if (index === 0) button.classList.add("active");
    dotsNav.appendChild(button);
  });

  const dots = Array.from(dotsNav.children);

  // Actualizar carrusel
  function updateCarousel() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    }, 4000);
  }

  function restartAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  // Botones
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
    restartAutoplay();
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
    restartAutoplay();
  });

  // Dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
      restartAutoplay();
    });
  });
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
  // Swipe para móviles (compatible con iOS y Android)
  let startX = 0;
  let startY = 0;
  let moveX = 0;

  carouselContainer.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      moveX = startX;
    },
    { passive: true }
  );

  carouselContainer.addEventListener(
    "touchmove",
    (e) => {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      // Solo bloquear el scroll si el gesto es horizontal
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
        moveX = e.touches[0].clientX;
      }
    },
    { passive: false }
  );

  carouselContainer.addEventListener("touchend", () => {
    const swipeDistance = moveX - startX;

    if (swipeDistance > 50) {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
      restartAutoplay();
    } else if (swipeDistance < -50) {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
      restartAutoplay();
    }
  });

  // Iniciar autoplay
  startAutoplay();

  // Ajustar cuando cambie el tamaño de la ventana
  window.addEventListener("resize", updateCarousel);
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
  const quotes = document.querySelectorAll(".quote");
  let currentQuote = 0;

  if (quotes.length > 0) {
    function showNextQuote() {
      quotes[currentQuote].classList.remove("active");
      currentQuote = (currentQuote + 1) % quotes.length;
      quotes[currentQuote].classList.add("active");
    }

    setInterval(showNextQuote, 5000);
  }

  // ==================== BOTÓN FLOTANTE DE CONTACTO ====================
  const fabMainBtn = document.getElementById("fabMainBtn");
  const fabOptions = document.querySelector(".fab-options");

  if (fabMainBtn && fabOptions) {
    fabMainBtn.addEventListener("click", () => {
      fabMainBtn.classList.toggle("active");
      fabOptions.classList.toggle("show");
    });
  }
  //manu celular
  document.querySelectorAll(".submenu-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const submenu = btn.closest(".submenu");
      submenu.classList.toggle("open");
    });
  });

  // ==================== HERO BACKGROUND ROTATIVO ====================
  // ==================== HERO BACKGROUND ROTATIVO ====================
  const heroEl = document.querySelector(".hero");

  if (heroEl) {
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

      const fadeLayer = document.createElement("div");
      fadeLayer.classList.add("hero-bg");
      fadeLayer.style.backgroundImage = `url(${nextImg})`;
      fadeLayer.style.opacity = "0";
      heroEl.appendChild(fadeLayer);

      requestAnimationFrame(() => {
        fadeLayer.style.opacity = "1";
      });

      fadeLayer.addEventListener("transitionend", () => {
        const allLayers = heroEl.querySelectorAll(".hero-bg");
        allLayers.forEach((layer, i) => {
          if (i < allLayers.length - 1) heroEl.removeChild(layer);
        });
      });
    }, 3000);
  }
});
