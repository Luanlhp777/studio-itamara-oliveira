const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll(".reveal");
const testimonialsTrack = document.querySelector(".testimonials-track");
const testimonialCards = testimonialsTrack ? Array.from(testimonialsTrack.children) : [];
const prevButton = document.querySelector(".carousel-btn-prev");
const nextButton = document.querySelector(".carousel-btn-next");
const carouselDotsContainer = document.querySelector(".carousel-dots");

if (menuToggle && siteNav) {
  const closeMenu = () => {
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.classList.toggle("is-active", !isExpanded);
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      closeMenu();
    }
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (testimonialsTrack && testimonialCards.length > 0) {
  let currentIndex = 0;
  let autoplayId = null;
  let carouselDots = [];

  const getVisibleItems = () => (window.innerWidth >= 768 ? 3 : 1);

  const getMaxIndex = () => {
    const visibleItems = getVisibleItems();
    return Math.max(0, testimonialCards.length - visibleItems);
  };

  const buildDots = () => {
    if (!carouselDotsContainer) {
      return;
    }

    const dotCount = getMaxIndex() + 1;
    carouselDotsContainer.innerHTML = "";

    for (let index = 0; index < dotCount; index += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Ir para grupo ${index + 1}`);

      dot.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
        startAutoplay();
      });

      carouselDotsContainer.appendChild(dot);
    }

    carouselDots = Array.from(carouselDotsContainer.querySelectorAll(".carousel-dot"));
  };

  const updateDots = () => {
    carouselDots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  };

  const updateCarousel = () => {
    const visibleItems = getVisibleItems();
    const maxIndex = getMaxIndex();
    const safeIndex = Math.min(currentIndex, maxIndex);
    const gap = visibleItems === 3 ? 16 : 16;
    const offset = safeIndex * ((testimonialsTrack.parentElement.clientWidth - gap * (visibleItems - 1)) / visibleItems + gap);

    currentIndex = safeIndex;
    testimonialsTrack.style.transform = `translateX(-${offset}px)`;
    updateDots();
  };

  const nextSlide = () => {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateCarousel();
  };

  const previousSlide = () => {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateCarousel();
  };

  const stopAutoplay = () => {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayId = window.setInterval(nextSlide, 4000);
  };

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      previousSlide();
      startAutoplay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      nextSlide();
      startAutoplay();
    });
  }

  carouselDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = Math.min(index, getMaxIndex());
      updateCarousel();
      startAutoplay();
    });
  });

  testimonialsTrack.addEventListener("mouseenter", stopAutoplay);
  testimonialsTrack.addEventListener("mouseleave", startAutoplay);
  testimonialsTrack.addEventListener("focusin", stopAutoplay);
  testimonialsTrack.addEventListener("focusout", startAutoplay);

  window.addEventListener("resize", () => {
    buildDots();
    updateCarousel();
  });

  buildDots();
  updateCarousel();
  startAutoplay();
}