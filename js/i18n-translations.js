/*
 * Mr. Dork 3 — translation dictionary (core / shared chrome).
 *
 * Page-specific strings are merged into this same global by additional
 * translation files (js/i18n/<page>.js), so keep keys namespaced by area
 * (nav.*, footer.*, cookie.*, home.*, faq.*, legal.*, …) to avoid collisions.
 *
 * Keys are flat strings. German (de) is the second language; English (en)
 * mirrors the source copy and acts as the fallback.
 */
window.MRDORK_I18N = window.MRDORK_I18N || { en: {}, de: {} };

(function (D) {
  "use strict";

  Object.assign(D.en, {
    "skip.toContent": "Skip to Content",

    "nav.home": "Home",
    "nav.about": "About",
    "nav.earlyAccess": "Early Access",
    "nav.timeline": "Timeline",
    "nav.faq": "FAQ",
    "nav.community": "Community",
    "nav.steamAlt": "Wishlist Mr. Dork 3 on Steam",
    "nav.epicAlt": "Wishlist Mr. Dork 3 on Epic Games Store",
    "nav.logoAlt": "Mr. Dork 3",

    "lang.english": "English",
    "lang.german": "German",
    "lang.french": "French",

    "music.play": "Play Music",
    "music.pause": "Pause Music",

    "footer.faq": "FAQ",
    "footer.legal": "Legal Notice",
    "footer.tos": "Terms of Sale",
    "footer.privacy": "Privacy Policy",
    "footer.copyright": "&copy; MayStudios",

    "cookie.title": "We value your privacy",
    "cookie.body": "We use necessary cookies to make the site work and — only with your consent — Google Analytics 4 to understand how the site is used. See our <a href=\"policy.html\">Privacy Policy</a>.",
    "cookie.acceptAll": "Accept all",
    "cookie.rejectAll": "Reject all",
    "cookie.settings": "Settings",
    "cookie.save": "Save selection",
    "cookie.prefsTitle": "Cookie settings",
    "cookie.prefsIntro": "Choose which cookies you allow. You can change this at any time.",
    "cookie.necessary": "Necessary",
    "cookie.necessaryDesc": "Required for the site to function (e.g. storing your consent and language preference). Always active.",
    "cookie.statistics": "Statistics",
    "cookie.statisticsDesc": "Google Analytics 4 (Google Ireland Ltd.) — helps us understand how the site is used. Loaded only after you accept.",
    "cookie.alwaysOn": "Always active",
    "cookie.reopen": "Cookie settings"
  });

  Object.assign(D.de, {
    "skip.toContent": "Zum Inhalt springen",

    "nav.home": "Start",
    "nav.about": "Über uns",
    "nav.earlyAccess": "Early Access",
    "nav.timeline": "Zeitleiste",
    "nav.faq": "FAQ",
    "nav.community": "Community",
    "nav.steamAlt": "Mr. Dork 3 auf Steam auf die Wunschliste setzen",
    "nav.epicAlt": "Mr. Dork 3 im Epic Games Store auf die Wunschliste setzen",
    "nav.logoAlt": "Mr. Dork 3",

    "lang.english": "Englisch",
    "lang.german": "Deutsch",
    "lang.french": "Französisch",

    "music.play": "Musik abspielen",
    "music.pause": "Musik pausieren",

    "footer.faq": "FAQ",
    "footer.legal": "Impressum",
    "footer.tos": "Verkaufsbedingungen",
    "footer.privacy": "Datenschutz",
    "footer.copyright": "&copy; MayStudios",

    "cookie.title": "Wir respektieren deine Privatsphäre",
    "cookie.body": "Wir verwenden notwendige Cookies, damit die Website funktioniert, und – nur mit deiner Einwilligung – Google Analytics 4, um zu verstehen, wie die Website genutzt wird. Mehr dazu in unserer <a href=\"policy.html\">Datenschutzerklärung</a>.",
    "cookie.acceptAll": "Alle akzeptieren",
    "cookie.rejectAll": "Alle ablehnen",
    "cookie.settings": "Einstellungen",
    "cookie.save": "Auswahl speichern",
    "cookie.prefsTitle": "Cookie-Einstellungen",
    "cookie.prefsIntro": "Wähle aus, welche Cookies du zulässt. Du kannst dies jederzeit ändern.",
    "cookie.necessary": "Notwendig",
    "cookie.necessaryDesc": "Erforderlich, damit die Website funktioniert (z. B. Speichern deiner Einwilligung und Sprachauswahl). Immer aktiv.",
    "cookie.statistics": "Statistik",
    "cookie.statisticsDesc": "Google Analytics 4 (Google Ireland Ltd.) – hilft uns zu verstehen, wie die Website genutzt wird. Wird erst nach deiner Zustimmung geladen.",
    "cookie.alwaysOn": "Immer aktiv",
    "cookie.reopen": "Cookie-Einstellungen"
  });
})(window.MRDORK_I18N);
