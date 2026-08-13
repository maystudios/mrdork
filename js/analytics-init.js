/*
 * Privacy-first Google Analytics 4 bootstrap.
 *
 * This file deliberately does not load anything from Google. It only defines
 * the local gtag queue and a denied-by-default Consent Mode v2 state. The
 * Google tag itself is injected by cookie-consent.js after an explicit opt-in.
 */
(function (window) {
  "use strict";

  window.MRDORK_GA_ID = "G-D0MBQ4MRH8";
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });

  // The site uses Analytics only for audience measurement, never advertising.
  window.gtag("set", "ads_data_redaction", true);
  window.gtag("set", "url_passthrough", false);
  window.gtag("set", "allow_google_signals", false);
  window.gtag("set", "allow_ad_personalization_signals", false);
})(window);
