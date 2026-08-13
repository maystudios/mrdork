/*
 * Mr. Dork 3 translation dictionary (core and shared chrome).
 *
 * Page-specific strings are merged into this same global by additional
 * translation files (js/i18n/<page>.js), so keep keys namespaced by area
 * (nav.*, footer.*, cookie.*, home.*, faq.*, legal.*, etc.) to avoid collisions.
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

    "cookie.title": "Your privacy, your choice",
    "cookie.body": "We store your necessary settings locally. Only with your consent, Google Analytics 4 measures visits. Nothing is sent to Google beforehand. See our <a href=\"policy.html\">Privacy Policy</a>.",
    "cookie.acceptAll": "Allow statistics",
    "cookie.rejectAll": "Necessary only",
    "cookie.settings": "Customize",
    "cookie.save": "Save selection",
    "cookie.close": "Close privacy settings",
    "cookie.prefsTitle": "Privacy settings",
    "cookie.prefsIntro": "Choose whether we may measure visits. You can change or withdraw your choice at any time.",
    "cookie.necessary": "Necessary",
    "cookie.necessaryDesc": "Stores your privacy choice, language and music preference locally in this browser. Always active.",
    "cookie.statistics": "Statistics",
    "cookie.statisticsDesc": "Google Analytics 4 (Google Ireland Ltd.) measures visits and page views. It loads only after you opt in; advertising features remain disabled.",
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

    "cookie.title": "Deine Privatsphäre, deine Wahl",
    "cookie.body": "Wir speichern deine notwendigen Einstellungen lokal. Nur mit deiner Einwilligung misst Google Analytics 4 Besuche. Vorher wird nichts an Google gesendet. Mehr dazu in unserer <a href=\"policy.html\">Datenschutzerklärung</a>.",
    "cookie.acceptAll": "Statistik erlauben",
    "cookie.rejectAll": "Nur notwendige",
    "cookie.settings": "Anpassen",
    "cookie.save": "Auswahl speichern",
    "cookie.close": "Datenschutz-Einstellungen schließen",
    "cookie.prefsTitle": "Datenschutz-Einstellungen",
    "cookie.prefsIntro": "Entscheide, ob wir Besuche messen dürfen. Du kannst deine Auswahl jederzeit ändern oder widerrufen.",
    "cookie.necessary": "Notwendig",
    "cookie.necessaryDesc": "Speichert deine Datenschutz-Auswahl, Sprache und Musikauswahl lokal in diesem Browser. Immer aktiv.",
    "cookie.statistics": "Statistik",
    "cookie.statisticsDesc": "Google Analytics 4 (Google Ireland Ltd.) misst Besuche und Seitenaufrufe. Es lädt erst nach deiner Zustimmung; Werbefunktionen bleiben deaktiviert.",
    "cookie.alwaysOn": "Immer aktiv",
    "cookie.reopen": "Cookie-Einstellungen"
  });
})(window.MRDORK_I18N);
