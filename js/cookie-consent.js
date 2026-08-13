/*
 * Privacy-first consent controller for Mr. Dork 3.
 *
 * Google Analytics is never requested before an explicit Statistics opt-in.
 * Necessary storage is limited to consent, language and music preferences.
 */
(function (window, document) {
  "use strict";

  var STORAGE_KEY = "mrdork_consent";
  var VERSION = 2;
  var MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  var ANALYTICS_COOKIE_MAX_AGE = 90 * 24 * 60 * 60;
  var gaLoaded = false;
  var bannerEl = null;
  var modalEl = null;
  var previousFocus = null;

  var FALLBACK = {
    "cookie.title": "Your privacy, your choice",
    "cookie.body": 'We store your necessary settings locally. Only with your consent, Google Analytics 4 measures visits. Nothing is sent to Google beforehand. See our <a href="policy.html">Privacy Policy</a>.',
    "cookie.acceptAll": "Allow statistics",
    "cookie.rejectAll": "Necessary only",
    "cookie.settings": "Customize",
    "cookie.save": "Save selection",
    "cookie.close": "Close cookie settings",
    "cookie.prefsTitle": "Privacy settings",
    "cookie.prefsIntro": "Choose whether we may measure visits. You can change or withdraw your choice at any time.",
    "cookie.necessary": "Necessary",
    "cookie.necessaryDesc": "Stores your privacy choice, language and music preference locally in this browser. Always active.",
    "cookie.statistics": "Statistics",
    "cookie.statisticsDesc": "Google Analytics 4 (Google Ireland Ltd.) measures visits and page views. It loads only after you opt in; advertising features remain disabled.",
    "cookie.alwaysOn": "Always active"
  };

  function t(key) {
    if (window.I18N && typeof window.I18N.t === "function") {
      var translated = window.I18N.t(key);
      if (translated != null) return translated;
    }
    return FALLBACK[key] != null ? FALLBACK[key] : key;
  }

  function read() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var value = JSON.parse(raw);
      if (!value || value.v !== VERSION || typeof value.statistics !== "boolean") return null;
      if (!value.ts || Date.now() - value.ts > MAX_AGE) {
        window.localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return value;
    } catch (e) {
      return null;
    }
  }

  function write(statistics) {
    var value = {
      v: VERSION,
      necessary: true,
      statistics: !!statistics,
      ts: Date.now()
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      /* Consent still applies for this page view when storage is unavailable. */
    }
    return value;
  }

  function gtagSafe() {
    if (typeof window.gtag === "function") {
      window.gtag.apply(null, arguments);
    }
  }

  function consentSignals(statistics) {
    return {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: statistics ? "granted" : "denied"
    };
  }

  function clearAnalyticsCookies() {
    document.cookie.split(";").forEach(function (entry) {
      var name = entry.split("=")[0].trim();
      if (!/^_ga(?:_|$)|^_gid$|^_gat/.test(name)) return;
      document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax; Secure";
      document.cookie = name + "=; Max-Age=0; path=/; domain=" + window.location.hostname + "; SameSite=Lax; Secure";
    });
  }

  function loadAnalytics() {
    if (gaLoaded || !window.MRDORK_GA_ID) return;
    gaLoaded = true;

    var script = document.createElement("script");
    script.async = true;
    script.dataset.mrdorkAnalytics = "true";
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(window.MRDORK_GA_ID);
    script.referrerPolicy = "strict-origin-when-cross-origin";
    script.onerror = function () { gaLoaded = false; };
    document.head.appendChild(script);

    gtagSafe("js", new Date());
    gtagSafe("config", window.MRDORK_GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: ANALYTICS_COOKIE_MAX_AGE,
      cookie_update: false,
      cookie_flags: "SameSite=Lax;Secure",
      send_page_view: true
    });
  }

  function applyConsent(statistics) {
    gtagSafe("consent", "update", consentSignals(!!statistics));
    if (statistics) {
      loadAnalytics();
    } else {
      clearAnalyticsCookies();
    }
  }

  function bannerHTML() {
    return (
      '<div class="cc-banner__inner">' +
        '<div class="cc-banner__text">' +
          '<div class="cc-banner__title" id="cc-banner-title">' + t("cookie.title") + "</div>" +
          '<p id="cc-banner-description">' + t("cookie.body") + "</p>" +
        "</div>" +
        '<div class="cc-actions">' +
          '<button type="button" class="cc-btn cc-btn--secondary" data-cc-action="settings">' + t("cookie.settings") + "</button>" +
          '<button type="button" class="cc-btn cc-btn--primary" data-cc-action="reject">' + t("cookie.rejectAll") + "</button>" +
          '<button type="button" class="cc-btn cc-btn--primary" data-cc-action="accept">' + t("cookie.acceptAll") + "</button>" +
        "</div>" +
      "</div>"
    );
  }

  function modalHTML(statsChecked) {
    return (
      '<div class="cc-modal__box" role="dialog" aria-modal="true" aria-labelledby="cc-modal-title" aria-describedby="cc-modal-intro">' +
        '<button type="button" class="cc-modal__close" data-cc-action="close" aria-label="' + t("cookie.close") + '">&times;</button>' +
        '<div class="cc-modal__title" id="cc-modal-title">' + t("cookie.prefsTitle") + "</div>" +
        '<p class="cc-modal__intro" id="cc-modal-intro">' + t("cookie.prefsIntro") + "</p>" +
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
          '<label class="cc-switch" aria-label="' + t("cookie.statistics") + '">' +
            '<input type="checkbox" data-cc-cat="statistics"' + (statsChecked ? " checked" : "") + ">" +
            '<span class="cc-slider"></span>' +
          "</label>" +
        "</div>" +
        '<div class="cc-modal__actions">' +
          '<button type="button" class="cc-btn cc-btn--primary" data-cc-action="reject">' + t("cookie.rejectAll") + "</button>" +
          '<button type="button" class="cc-btn cc-btn--primary" data-cc-action="save">' + t("cookie.save") + "</button>" +
        "</div>" +
      "</div>"
    );
  }

  function currentStatsChecked() {
    var input = modalEl ? modalEl.querySelector('[data-cc-cat="statistics"]') : null;
    if (input) return input.checked;
    var consent = read();
    return consent ? !!consent.statistics : false;
  }

  function renderBanner() {
    if (bannerEl) bannerEl.innerHTML = bannerHTML();
  }

  function renderModal() {
    if (!modalEl) return;
    var checked = currentStatsChecked();
    modalEl.innerHTML = modalHTML(checked);
  }

  function showBanner() {
    if (bannerEl) bannerEl.hidden = false;
  }

  function hideBanner() {
    if (bannerEl) bannerEl.hidden = true;
  }

  function openModal() {
    if (!modalEl) return;
    previousFocus = document.activeElement;
    renderModal();
    modalEl.hidden = false;
    document.body.classList.add("cc-modal-open");
    var close = modalEl.querySelector(".cc-modal__close");
    if (close) close.focus();
  }

  function closeModal() {
    if (!modalEl || modalEl.hidden) return;
    modalEl.hidden = true;
    document.body.classList.remove("cc-modal-open");
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  }

  function finish(statistics) {
    var previous = read();
    write(statistics);
    applyConsent(statistics);
    hideBanner();
    closeModal();

    if (previous && previous.statistics && !statistics) {
      window.setTimeout(function () { window.location.reload(); }, 0);
    }
  }

  function onAction(event) {
    var button = event.target.closest ? event.target.closest("[data-cc-action]") : null;
    if (!button) {
      if (modalEl && event.target === modalEl) closeModal();
      return;
    }

    var action = button.getAttribute("data-cc-action");
    if (action === "settings") openModal();
    if (action === "close") closeModal();
    if (action === "accept") finish(true);
    if (action === "reject") finish(false);
    if (action === "save") finish(currentStatsChecked());
  }

  function trapModalFocus(event) {
    if (!modalEl || modalEl.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== "Tab") return;

    var controls = modalEl.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href]');
    if (!controls.length) return;
    var first = controls[0];
    var last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function build() {
    bannerEl = document.createElement("div");
    bannerEl.className = "cc-banner";
    bannerEl.setAttribute("role", "dialog");
    bannerEl.setAttribute("aria-labelledby", "cc-banner-title");
    bannerEl.setAttribute("aria-describedby", "cc-banner-description");
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

    document.addEventListener("keydown", trapModalFocus);
    document.addEventListener("click", function (event) {
      var trigger = event.target.closest ? event.target.closest("[data-cookie-settings]") : null;
      if (!trigger) return;
      event.preventDefault();
      openModal();
    });

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
      applyConsent(false);
      showBanner();
    }
  }

  window.CookieConsent = {
    open: openModal,
    get: read,
    reset: function () {
      var previous = read();
      try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      applyConsent(false);
      showBanner();
      if (previous && previous.statistics) {
        window.setTimeout(function () { window.location.reload(); }, 0);
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window, document);
