document.addEventListener("DOMContentLoaded", function () {
  const API_URL = "data/data.json";

  function hidePreloader() {
    const preloader = document.getElementById("preloder");
    if (preloader) {
      setTimeout(() => {
        preloader.style.opacity = "0";
        setTimeout(() => {
          preloader.style.display = "none";
        }, 500);
      }, 1000);
    }
  }

  function initMobileMenu() {
    const navSwitch = document.querySelector(".nav-switch");
    const mainMenu = document.querySelector(".main-menu");

    if (!navSwitch || !mainMenu) return;

    // Accessibilité
    navSwitch.setAttribute("role", "button");
    navSwitch.setAttribute("aria-expanded", "false");
    navSwitch.setAttribute("aria-label", "Menu de navigation");
    navSwitch.setAttribute("tabindex", "0");

    // Overlay backdrop
    const overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    document.body.appendChild(overlay);

    const icon = navSwitch.querySelector("i");

    function openMenu() {
      mainMenu.classList.add("active");
      navSwitch.classList.add("active");
      navSwitch.setAttribute("aria-expanded", "true");
      navSwitch.setAttribute("aria-label", "Fermer le menu");
      overlay.classList.add("active");
      document.body.classList.add("menu-open");
      if (icon) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      }
    }

    function closeMenu() {
      mainMenu.classList.remove("active");
      navSwitch.classList.remove("active");
      navSwitch.setAttribute("aria-expanded", "false");
      navSwitch.setAttribute("aria-label", "Menu de navigation");
      overlay.classList.remove("active");
      document.body.classList.remove("menu-open");
      if (icon) {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    }

    navSwitch.addEventListener("click", function () {
      mainMenu.classList.contains("active") ? closeMenu() : openMenu();
    });

    // Fermer au clic sur l'overlay
    overlay.addEventListener("click", closeMenu);

    // Fermer quand on clique sur un lien
    mainMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth < 992) closeMenu();
      });
    });

    // Fermer au passage en mode desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 992) closeMenu();
    });

    // Accessibilité clavier
    navSwitch.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        mainMenu.classList.contains("active") ? closeMenu() : openMenu();
      }
    });
  }

  async function fetchData() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données");
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur:", error);
      return null;
    }
  }

  function formatDate(dateString) {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  }

  function initEventCounter() {
    const eventDate = new Date("2023-11-15T19:00:00").getTime();
    const countdownElement = document.querySelector(".counter");

    if (!countdownElement) return;

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        countdownElement.innerHTML =
          '<div class="counter-item"><h4>événement terminé</h4></div>';
        countdownElement.style.fontSize = "16px";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.querySelector(".counter-item:nth-child(1) h4").textContent =
        days;
      document.querySelector(".counter-item:nth-child(2) h4").textContent =
        hours;
      document.querySelector(".counter-item:nth-child(3) h4").textContent =
        minutes;
      document.querySelector(".counter-item:nth-child(4) h4").textContent =
        seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ── Navbar : effet au scroll (ombre + classe .scrolled) ──────────────
  function initNavbarScroll() {
    const navSection = document.querySelector(".nav-section");
    if (!navSection) return;

    // Seuil en pixels avant activation
    const THRESHOLD = 60;

    // Utilise requestAnimationFrame pour performances optimales
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > THRESHOLD) {
            navSection.classList.add("scrolled");
          } else {
            navSection.classList.remove("scrolled");
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ── Animations au scroll : IntersectionObserver + stagger ──────────────
  function initRevealAnimations() {
    // Respecter prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      // Rendre tout visible immédiatement sans animation
      document
        .querySelectorAll(".reveal, .reveal-left, .reveal-right")
        .forEach((el) => el.classList.add("visible"));
      return;
    }

    // Sélecteurs candidats à l'animation
    const SELECTORS = [
      ".service-item",
      ".course-item",
      ".blog-item",
      ".event-item",
      ".team-member",
      ".fact",
      ".activity-item",
      ".testimonial-card",
    ];

    SELECTORS.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.classList.add("reveal");

        // Stagger : cherche la position dans le groupe parent
        const siblings = Array.from(
          el.parentElement ? el.parentElement.querySelectorAll(selector) : [],
        );
        const idx = siblings.indexOf(el);
        if (idx > 0 && idx <= 5) {
          // Les classes delay-1..delay-5 sont définies dans le CSS
          el.classList.add("delay-" + idx);
        }
      });
    });

    document
      .querySelectorAll(
        ".about-text, .about-img, .mission-item, .ci-item, .section-title",
      )
      .forEach(function (el) {
        if (!el.classList.contains("reveal")) {
          el.classList.add("reveal");
        }
      });

    // IntersectionObserver : déclenche .visible au seuil 12%
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Unobserve après animation : libère les ressources
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    document
      .querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach(function (el) {
        observer.observe(el);
      });
  }

  function initGallery() {
    const galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        const imgSrc = this.querySelector("a").getAttribute("href");
        openImagePopup(imgSrc);
      });
    });
  }

  function openImagePopup(src) {
    const popup = document.createElement("div");
    popup.className = "image-popup";
    popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: pointer;
        `;

    const img = document.createElement("img");
    img.src = src;
    img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        `;

    popup.appendChild(img);
    document.body.appendChild(popup);

    popup.addEventListener("click", function () {
      document.body.removeChild(popup);
    });
  }

  function initNewsletterForm() {
    const newsletterForm = document.querySelector(".newsletter");

    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = this.querySelector('input[type="text"]').value;

        if (validateEmail(email)) {
          // Simulation d'envoi
          this.querySelector('input[type="text"]').value = "";
          showNotification(
            "Merci pour votre inscription à notre newsletter!",
            "success",
          );
        } else {
          showNotification(
            "Veuillez entrer une adresse email valide.",
            "error",
          );
        }
      });
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === "success" ? "#006B3C" : "#d9534f"};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  function initThemeToggle() {
    const themeToggle = document.createElement("button");
    themeToggle.id = "theme-toggle";
    themeToggle.innerHTML = '<i class="fa fa-moon"></i>';
    themeToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        `;

    document.body.appendChild(themeToggle);

    function applyThemeToggleStyle(isDark) {
      if (isDark) {
        themeToggle.innerHTML =
          '<i class="fas fa-sun" style="color:#FCD116"></i>';
        themeToggle.style.background = "#1e2330";
        themeToggle.style.border = "1px solid #2e3443";
      } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.background = "var(--primary-color)";
        themeToggle.style.border = "none";
      }
    }

    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
    }
    applyThemeToggleStyle(document.body.classList.contains("dark-theme"));

    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-theme");
      const isDark = document.body.classList.contains("dark-theme");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      applyThemeToggleStyle(isDark);
    });
    themeToggle.setAttribute("title", "Basculer le mode sombre");
  }

  // ===== INITIALISATION =====
  function init() {
    hidePreloader();
    initMobileMenu();
    initEventCounter();
    initNavbarScroll();
    initRevealAnimations();
    initGallery();
    initNewsletterForm();
    initThemeToggle();
  }

  // ===== ENREGISTREMENT DU SERVICE WORKER =====
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "✅ Service Worker enregistré avec succès:",
            registration.scope,
          );
        })
        .catch((error) => {
          console.error(
            "❌ Échec de l’enregistrement du Service Worker:",
            error,
          );
        });
    });
  }

  init();
});
