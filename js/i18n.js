/*
 * Mr. Dork 3 lightweight runtime i18n
 * --------------------------------------
 * - Translatable text:        <h2 data-i18n="nav.home">Home</h2>
 * - Translatable attributes:  <img data-i18n-attr="alt:work.alt1">
 *                             <input data-i18n-attr="placeholder:news.email;aria-label:news.email">
 * - Language switch trigger:  <a data-set-lang="de">German</a>
 * - Current-language label:   <span data-i18n-current>EN</span>
 *
 * Dictionaries live on window.MRDORK_I18N = { en: { "key": "..." }, de: { "key": "..." } }
 * Keys are FLAT strings (dots are literal), so multiple translation files can be merged
 * with a simple Object.assign without deep-merge conflicts.
 *
 * The chosen language is persisted in localStorage and falls back to the browser
 * language, then to English.
 */
(function (window, document) {
  "use strict";

  var STORAGE_KEY = "mrdork_lang";
  var SUPPORTED = ["en", "de"]; // add "fr" here once French strings exist
  var DEFAULT = "en";
  var originalText = typeof WeakMap === "function" ? new WeakMap() : null;

  function dicts() {
    var d = window.MRDORK_I18N || {};
    return d;
  }

  function detectLang() {
    var stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* localStorage may be unavailable (private mode) */
    }
    if (stored && SUPPORTED.indexOf(stored) !== -1) {
      return stored;
    }
    var requested = window.navigator.languages || [window.navigator.language || window.navigator.userLanguage || ""];
    for (var n = 0; n < requested.length; n++) {
      var nav = String(requested[n]).toLowerCase().split("-")[0];
      for (var i = 0; i < SUPPORTED.length; i++) {
        if (nav === SUPPORTED[i]) {
          return SUPPORTED[i];
        }
      }
    }
    return DEFAULT;
  }

  function resolve(lang, key) {
    var table = dicts()[lang];
    if (table && table[key] != null) {
      return table[key];
    }
    // graceful fallback to the default language so a missing translation never
    // wipes out existing copy.
    var base = dicts()[DEFAULT];
    if (base && base[key] != null) {
      return base[key];
    }
    return null;
  }

  function applyToElement(el, lang) {
    var key = el.getAttribute("data-i18n");
    if (key) {
      var val = resolve(lang, key);
      if (val != null) {
        el.innerHTML = val;
      }
    }
    var attrSpec = el.getAttribute("data-i18n-attr");
    if (attrSpec) {
      attrSpec.split(";").forEach(function (pair) {
        pair = pair.trim();
        if (!pair) return;
        var idx = pair.indexOf(":");
        if (idx === -1) return;
        var attr = pair.slice(0, idx).trim();
        var attrKey = pair.slice(idx + 1).trim();
        var aval = resolve(lang, attrKey);
        if (aval != null) {
          el.setAttribute(attr, aval);
        }
      });
    }
  }

  function normalizeText(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function translatedText(source, lang) {
    if (lang === DEFAULT) return source;
    var tables = window.MRDORK_TEXT_I18N || {};
    var table = tables[lang] || {};
    var translated = table[normalizeText(source)];
    if (translated == null) return source;

    var leading = (source.match(/^\s*/) || [""])[0];
    var trailing = (source.match(/\s*$/) || [""])[0];
    return leading + translated + trailing;
  }

  function applyTextNodes(lang) {
    if (!document.body || !document.createTreeWalker) return;
    var filter = window.NodeFilter || { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 };
    var walker = document.createTreeWalker(document.documentElement, filter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || !normalizeText(node.nodeValue || "")) return filter.FILTER_REJECT;
        if (/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|CODE|PRE)$/i.test(parent.tagName)) return filter.FILTER_REJECT;
        if (parent.closest && parent.closest("[data-i18n]")) return filter.FILTER_REJECT;
        return filter.FILTER_ACCEPT;
      }
    });

    var node;
    while ((node = walker.nextNode())) {
      var source = originalText && originalText.has(node) ? originalText.get(node) : node.nodeValue;
      if (originalText && !originalText.has(node)) originalText.set(node, source);
      node.nodeValue = translatedText(source, lang);
    }
  }

  function apply(lang) {
    if (SUPPORTED.indexOf(lang) === -1) {
      lang = DEFAULT;
    }
    document.documentElement.setAttribute("lang", lang);

    var nodes = document.querySelectorAll("[data-i18n], [data-i18n-attr]");
    for (var i = 0; i < nodes.length; i++) {
      applyToElement(nodes[i], lang);
    }

    applyTextNodes(lang);

    var labels = document.querySelectorAll("[data-i18n-current]");
    for (var j = 0; j < labels.length; j++) {
      labels[j].textContent = lang.toUpperCase();
    }

    var switchers = document.querySelectorAll("[data-set-lang]");
    for (var k = 0; k < switchers.length; k++) {
      var isCurrent = switchers[k].getAttribute("data-set-lang") === lang;
      switchers[k].setAttribute("aria-current", isCurrent ? "true" : "false");
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore */
    }

    // Let other features such as cookie consent and music react to a change.
    try {
      window.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang: lang } }));
    } catch (e) {
      var ev = document.createEvent("CustomEvent");
      ev.initCustomEvent("i18n:changed", false, false, { lang: lang });
      window.dispatchEvent(ev);
    }
  }

  function t(key) {
    return resolve(current(), key);
  }

  function current() {
    return document.documentElement.getAttribute("lang") || DEFAULT;
  }

  function bindSwitchers() {
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest ? e.target.closest("[data-set-lang]") : null;
      if (!trigger) return;
      e.preventDefault();
      apply(trigger.getAttribute("data-set-lang"));
    });
  }

  var initialLanguage = detectLang();
  document.documentElement.setAttribute("lang", initialLanguage);

  function init() {
    apply(initialLanguage);
    bindSwitchers();
  }

  window.I18N = {
    apply: apply,
    t: t,
    current: current,
    SUPPORTED: SUPPORTED,
    DEFAULT: DEFAULT
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window, document);
