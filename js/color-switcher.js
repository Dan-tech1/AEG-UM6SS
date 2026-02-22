(function () {
  "use strict";

  /* ── Palette de thèmes prédéfinis ── */
  const PRESETS = [
    {
      name: "AEG Gabon",
      primary: "#006B3C",
      secondary: "#FCD116",
      icon: "🇬🇦",
    },
    {
      name: "Maroc Royal",
      primary: "#003d7c",
      secondary: "#c1272d",
      icon: "🇲🇦",
    },
    {
      name: "Violet Pro",
      primary: "#5b21b6",
      secondary: "#f59e0b",
      icon: "💜",
    },
    {
      name: "Ocean",
      primary: "#0e7490",
      secondary: "#fbbf24",
      icon: "🌊",
    },
    {
      name: "Terre",
      primary: "#7c2d12",
      secondary: "#facc15",
      icon: "🌍",
    },
    {
      name: "Ardoise",
      primary: "#1e3a5f",
      secondary: "#38bdf8",
      icon: "🔷",
    },
  ];

  const DEFAULT_PRIMARY = "#006B3C";
  const DEFAULT_SECONDARY = "#FCD116";
  const LS_KEY = "aeg-color-scheme";

  /* ── Calcul couleurs dérivées ── */
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  /* Luminosité perçue (0 = noir, 1 = blanc) */
  function getLuminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  function lighten(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    const clamp = (v) => Math.min(255, Math.round(v + (255 - v) * amount));
    return (
      "#" +
      [clamp(r), clamp(g), clamp(b)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function darken(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    const clamp = (v) => Math.max(0, Math.round(v * (1 - amount)));
    return (
      "#" +
      [clamp(r), clamp(g), clamp(b)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function rgbAlpha(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /* ── Appliquer les couleurs sur :root ── */
  function applyColors(primary, secondary) {
    const root = document.documentElement;

    root.style.setProperty("--primary-color", primary);
    root.style.setProperty("--secondary-color", secondary);
    root.style.setProperty("--accent-color", lighten(primary, 0.25));

    /* Overlay calendrier : toujours suffisamment sombre pour garantir
       le contraste du texte blanc, quelle que soit la couleur choisie */
    const lum = getLuminance(primary);
    const overlayColor =
      lum > 0.45
        ? darken(primary, 0.65) // couleur claire → très foncée
        : lum > 0.25
          ? darken(primary, 0.3) // couleur moyenne → légèrement foncée
          : primary; // couleur déjà sombre → inchangée
    root.style.setProperty("--primary-overlay", overlayColor);

    /* Couleurs de fond subtiles dérivées */
    root.style.setProperty("--bg-light", lighten(primary, 0.94));
    root.style.setProperty("--bg-subtle", lighten(primary, 0.9));

    /* Ombres teintées */
    root.style.setProperty(
      "--shadow-sm",
      `0 2px 8px  ${rgbAlpha(primary, 0.08)}`,
    );
    root.style.setProperty("--shadow", `0 6px 20px ${rgbAlpha(primary, 0.1)}`);
    root.style.setProperty(
      "--shadow-md",
      `0 8px 24px ${rgbAlpha(primary, 0.12)}`,
    );
    root.style.setProperty(
      "--shadow-lg",
      `0 16px 40px ${rgbAlpha(primary, 0.15)}`,
    );
    root.style.setProperty(
      "--shadow-hover",
      `0 12px 30px ${rgbAlpha(primary, 0.14)}`,
    );

    /* Mise à jour theme-color du navigateur */
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", primary);

    /* Persistance */
    localStorage.setItem(LS_KEY, JSON.stringify({ primary, secondary }));

    const btn = document.getElementById("cs-toggle-btn");
    if (btn) btn.style.background = primary;

    const darkBtn = document.getElementById("theme-toggle");
    if (darkBtn) darkBtn.style.background = primary;
  }

  /* ── Créer le HTML du panneau ── */
  function buildPanel() {
    const panel = document.createElement("div");
    panel.id = "cs-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Personnalisation des couleurs");

    /* Préréglages */
    const swatchesHTML = PRESETS.map(
      (p, i) =>
        `<button class="cs-swatch" data-preset="${i}"
          title="${p.name}"
          style="background:${p.primary}; border: 3px solid transparent;"
          aria-label="${p.name}">
        <span class="cs-swatch-dot" style="background:${p.secondary}"></span>
       </button>`,
    ).join("");

    panel.innerHTML = `
      <div class="cs-header">
        <span class="cs-title"><i class="fas fa-palette"></i> Couleurs du site</span>
        <button class="cs-close" id="cs-close-btn" aria-label="Fermer">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="cs-section">
        <p class="cs-label">Thèmes prédéfinis</p>
        <div class="cs-swatches">${swatchesHTML}</div>
      </div>

      <div class="cs-section">
        <p class="cs-label">Couleurs personnalisées</p>
        <div class="cs-pickers">
          <label class="cs-picker-wrap">
            <span>Principale</span>
            <div class="cs-picker-row">
              <input type="color" id="cs-primary" value="${DEFAULT_PRIMARY}" aria-label="Couleur principale">
              <span class="cs-hex-val" id="cs-primary-val">${DEFAULT_PRIMARY}</span>
            </div>
          </label>
          <label class="cs-picker-wrap">
            <span>Accentuation</span>
            <div class="cs-picker-row">
              <input type="color" id="cs-secondary" value="${DEFAULT_SECONDARY}" aria-label="Couleur d'accentuation">
              <span class="cs-hex-val" id="cs-secondary-val">${DEFAULT_SECONDARY}</span>
            </div>
          </label>
        </div>
        <button class="cs-apply-btn" id="cs-apply">Appliquer</button>
      </div>

      <div class="cs-section cs-footer-section">
        <button class="cs-reset-btn" id="cs-reset">
          <i class="fas fa-undo"></i> Réinitialiser
        </button>
      </div>
    `;
    return panel;
  }

  /* ── Créer le bouton déclencheur ── */
  function buildToggleButton(primary) {
    const btn = document.createElement("button");
    btn.id = "cs-toggle-btn";
    btn.setAttribute("aria-label", "Modifier les couleurs du site");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "cs-panel");
    btn.innerHTML = '<i class="fas fa-palette"></i>';
    btn.style.background = primary;
    return btn;
  }

  /* ── Init principale ── */
  function init() {
    /* Restaurer les couleurs sauvegardées */
    let savedPrimary = DEFAULT_PRIMARY;
    let savedSecondary = DEFAULT_SECONDARY;

    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY));
      if (saved && saved.primary && saved.secondary) {
        savedPrimary = saved.primary;
        savedSecondary = saved.secondary;
      }
    } catch (e) {
      /* silencieux */
    }

    /* Appliquer dès le chargement */
    applyColors(savedPrimary, savedSecondary);

    const toggleBtn = buildToggleButton(savedPrimary);
    const panel = buildPanel();

    const wrapper = document.createElement("div");
    wrapper.id = "cs-root";
    wrapper.appendChild(panel);
    wrapper.appendChild(toggleBtn);
    document.body.appendChild(wrapper);

    /* Synchro des inputs avec les couleurs courantes */
    const primaryInput = panel.querySelector("#cs-primary");
    const secondaryInput = panel.querySelector("#cs-secondary");
    const primaryVal = panel.querySelector("#cs-primary-val");
    const secondaryVal = panel.querySelector("#cs-secondary-val");

    primaryInput.value = savedPrimary;
    secondaryInput.value = savedSecondary;
    primaryVal.textContent = savedPrimary;
    secondaryVal.textContent = savedSecondary;

    /* ── Ouverture / fermeture du panneau ── */
    function openPanel() {
      panel.classList.add("cs-panel--open");
      toggleBtn.classList.add("cs-toggle--active");
      toggleBtn.setAttribute("aria-expanded", "true");
    }
    function closePanel() {
      panel.classList.remove("cs-panel--open");
      toggleBtn.classList.remove("cs-toggle--active");
      toggleBtn.setAttribute("aria-expanded", "false");
    }

    toggleBtn.addEventListener("click", function () {
      panel.classList.contains("cs-panel--open") ? closePanel() : openPanel();
    });

    panel.querySelector("#cs-close-btn").addEventListener("click", closePanel);

    /* Fermer avec Escape */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePanel();
    });

    /* ── Préréglages ── */
    panel.querySelectorAll(".cs-swatch").forEach(function (swatch) {
      swatch.addEventListener("click", function () {
        const preset = PRESETS[parseInt(this.dataset.preset, 10)];

        /* Sync inputs */
        primaryInput.value = preset.primary;
        secondaryInput.value = preset.secondary;
        primaryVal.textContent = preset.primary;
        secondaryVal.textContent = preset.secondary;

        /* Activer swatch */
        panel
          .querySelectorAll(".cs-swatch")
          .forEach((s) => (s.style.borderColor = "transparent"));
        this.style.borderColor = "#fff";

        applyColors(preset.primary, preset.secondary);
      });
    });

    /* ── Live preview sur les inputs ── */
    primaryInput.addEventListener("input", function () {
      primaryVal.textContent = this.value;
    });
    secondaryInput.addEventListener("input", function () {
      secondaryVal.textContent = this.value;
    });

    /* ── Bouton Appliquer ── */
    panel.querySelector("#cs-apply").addEventListener("click", function () {
      const p = primaryInput.value;
      const s = secondaryInput.value;
      /* Désactiver tous les swatches (couleur custom) */
      panel
        .querySelectorAll(".cs-swatch")
        .forEach((sw) => (sw.style.borderColor = "transparent"));
      applyColors(p, s);
    });

    /* ── Réinitialiser ── */
    panel.querySelector("#cs-reset").addEventListener("click", function () {
      primaryInput.value = DEFAULT_PRIMARY;
      secondaryInput.value = DEFAULT_SECONDARY;
      primaryVal.textContent = DEFAULT_PRIMARY;
      secondaryVal.textContent = DEFAULT_SECONDARY;
      localStorage.removeItem(LS_KEY);
      applyColors(DEFAULT_PRIMARY, DEFAULT_SECONDARY);

      /* Réactiver le swatch AEG Gabon */
      const swatches = panel.querySelectorAll(".cs-swatch");
      swatches.forEach((s) => (s.style.borderColor = "transparent"));
      swatches[0].style.borderColor = "#fff";
    });

    /* Marquer le preset actif au chargement */
    const swatches = panel.querySelectorAll(".cs-swatch");
    PRESETS.forEach(function (p, i) {
      if (p.primary === savedPrimary && p.secondary === savedSecondary) {
        swatches[i].style.borderColor = "#fff";
      }
    });
  }

  /* Attendre le DOM */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
