/*
 * Mr. Dork 3 — DSGVO / TDDDG cookie consent
 * -----------------------------------------
 * - Two categories: "necessary" (always on) and "statistics" (Google Analytics 4).
 * - Nothing non-essential runs before consent: GA is loaded ONLY after the user
 *   opts in to statistics (Google Consent Mode v2 starts denied — see the inline
 *   stub in each page's <head>).
 * - Banner + preferences modal are fully bilingual via the i18n layer and re-render
 *   on language change. Re-open the preferences anytime via a [data-cookie-settings]
 *   element or window.CookieConsent.open().
 */
(function (window, document) {
  "use strict";

  var STORAGE_KEY = "mrdork_consent";
  var VERSION = 1;

  /* ---- i18n helper (falls back to English if the i18n layer isn't present) ---- */
  var FALLBACK = {
    "cookie.title": "We value your privacy",
    "cookie.body":
      'We use necessary cookies to make the site work and — only with your consent — Google Analytics to understand how the site is used. See our <a href="policy.html">Privacy Policy</a>.',
    "cookie.acceptAll": "Accept all",
    "cookie.rejectAll": "Reject all",
    "cookie.settings": "Settings",
    "cookie.save": "Save selection",
    "cookie.prefsTitle": "Cookie settings",
    "cookie.prefsIntro": "Choose which cookies you allow. You can change this at any time.",
    "cookie.necessary": "Necessary",
    "cookie.necessaryDesc": "Required for the site to function (e.g. storing your consent and language). Always active.",
    "cookie.statistics": "Statistics",
    "cookie.statisticsDesc": "Google Analytics 4 — helps us understand site usage. Loaded only after you accept.",
    "cookie.alwaysOn": "Always active"
  };

  function t(key) {
    if (window.I18N && typeof window.I18N.t === "function") {
      var v = window.I18N.t(key);
      if (v != null) return v;
    }
    return FALLBACK[key] != null ? FALLBACK[key] : key;
  }

  /* ---- consent storage ---- */
  function read() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var p = JSON.parse(raw);
      if (!p || p.v !== VERSION) return null;
      return p;
    } catch (e) {
      return null;
    }
  }

  function write(statistics) {
    var data = { v: VERSION, necessary: true, statistics: !!statistics, ts: Date.now() };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      /* ignore */
    }
    return data;
  }

  /* ---- Google Analytics gating (Consent Mode v2) ---- */
  var gaLoaded = false;
  function gtagSafe() {
    if (typeof window.gtag === "function") {
      window.gtag.apply(null, arguments);
    }
  }
  function applyConsent(statistics) {
    if (statistics) {
      gtagSafe("consent", "update", { analytics_storage: "granted" });
      if (!gaLoaded && window.MRDORK_GA_ID) {
        gaLoaded = true;
        var s = document.createElement("script");
        s.async = true;
        s.src = "https://www.googletagmanager.com/gtag/js?id=" + window.MRDORK_GA_ID;
        document.head.appendChild(s);
        gtagSafe("js", new Date());
        gtagSafe("config", window.MRDORK_GA_ID);
      }
    } else {
      gtagSafe("consent", "update", { analytics_storage: "denied" });
    }
  }

  /* ---- DOM ---- */
  var bannerEl = null;
  var modalEl = null;

  function bannerHTML() {
    return (
      '<div class="cc-banner__inner">' +
      '<div class="cc-banner__text">' +
      '<div class="cc-banner__title">' + t("cookie.title") + "</div>" +
      "<p>" + t("cookie.body") + "</p>" +
      "</div>" +
      '<div class="cc-actions">' +
      '<button type="button" class="cc-btn cc-btn--ghost" data-cc-action="settings">' + t("cookie.settings") + "</button>" +
      '<button type="button" class="cc-btn cc-btn--ghost" data-cc-action="reject">' + t("cookie.rejectAll") + "</button>" +
      '<button type="button" class="cc-btn cc-btn--primary" data-cc-action="accept">' + t("cookie.acceptAll") + "</button>" +
      "</div>" +
      "</div>"
    );
  }

  function modalHTML(statsChecked) {
    return (
      '<div class="cc-modal__box" role="dialog" aria-modal="true" aria-label="' + t("cookie.prefsTitle") + '">' +
      '<div class="cc-modal__title">' + t("cookie.prefsTitle") + "</div>" +
      '<p class="cc-modal__intro">' + t("cookie.prefsIntro") + "</p>" +
      '<div class="cc-cat">' +
      '<div class="cc-cat__main">' +
      '<div class="cc-cat__name">' + t("cookie.necessary") + "</div>" +
      '<p class="cc-cat__desc">' + t("cookie.necessaryDesc") + "</p>" +
      "</div>" +
      '<span class="cc-cat__always">' + t("cookie.alwaysOn") + "</span>" +
      "</div>" +
      '<div class="cc-cat">' +
      '<div class="cc-cat__main">' +
      '<div class="cc-cat__name">' + t("cookie.statistics") + "</div>" +
      '<p class="cc-cat__desc">' + t("cookie.statisticsDesc") + "</p>" +
      "</div>" +
      '<label class="cc-switch"><input type="checkbox" data-cc-cat="statistics"' +
      (statsChecked ? " checked" : "") +
      '><span class="cc-slider"></span></label>' +
      "</div>" +
      '<div class="cc-modal__actions">' +
      '<button type="button" class="cc-btn cc-btn--ghost" data-cc-action="reject">' + t("cookie.rejectAll") + "</button>" +
      '<button type="button" class="cc-btn cc-btn--primary" data-cc-action="save">' + t("cookie.save") + "</button>" +
      "</div>" +
      "</div>"
    );
  }

  function currentStatsChecked() {
    var input = modalEl ? modalEl.querySelector('[data-cc-cat="statistics"]') : null;
    if (input) return input.checked;
    var c = read();
    return c ? !!c.statistics : false;
  }

  function renderBanner() {
    if (bannerEl) bannerEl.innerHTML = bannerHTML();
  }
  function renderModal() {
    if (modalEl) {
      var checked = currentStatsChecked();
      modalEl.innerHTML = modalHTML(checked);
    }
  }

  function showBanner() { if (bannerEl) bannerEl.hidden = false; }
  function hideBanner() { if (bannerEl) bannerEl.hidden = true; }
  function openModal() {
    if (!modalEl) return;
    renderModal();
    modalEl.hidden = false;
  }
  function closeModal() { if (modalEl) modalEl.hidden = true; }

  function onAction(e) {
    var btn = e.target.closest ? e.target.closest("[data-cc-action]") : null;
    if (!btn) {
      // click on modal backdrop closes it
      if (modalEl && e.target === modalEl) closeModal();
      return;
    }
    var action = btn.getAttribute("data-cc-action");
    if (action === "settings") {
      openModal();
    } else if (action === "accept") {
      write(true); applyConsent(true); hideBanner(); closeModal();
    } else if (action === "reject") {
      write(false); applyConsent(false); hideBanner(); closeModal();
    } else if (action === "save") {
      var checked = currentStatsChecked();
      write(checked); applyConsent(checked); hideBanner(); closeModal();
    }
  }

  function build() {
    bannerEl = document.createElement("div");
    bannerEl.className = "cc-banner";
    bannerEl.setAttribute("role", "dialog");
    bannerEl.setAttribute("aria-live", "polite");
    bannerEl.hidden = true;
    renderBanner();
    bannerEl.addEventListener("click", onAction);
    document.body.appendChild(bannerEl);

    modalEl = document.createElement("div");
    modalEl.className = "cc-modal";
    modalEl.hidden = true;
    renderModal();
    modalEl.addEventListener("click", onAction);
    document.body.appendChild(modalEl);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modalEl && !modalEl.hidden) closeModal();
    });

    // re-open trigger anywhere on the page (footer link etc.)
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest ? e.target.closest("[data-cookie-settings]") : null;
      if (trigger) { e.preventDefault(); openModal(); }
    });

    // keep texts in sync with the chosen language
    window.addEventListener("i18n:changed", function () {
      renderBanner();
      if (modalEl && !modalEl.hidden) renderModal();
    });
  }

  function init() {
    build();
    var consent = read();
    if (consent) {
      applyConsent(consent.statistics);
      hideBanner();
    } else {
      // no decision yet → GA stays denied (head default), show the banner
      showBanner();
    }
  }

  window.CookieConsent = {
    open: openModal,
    get: read,
    reset: function () {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      showBanner();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window, document);
