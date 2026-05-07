(function () {
  'use strict';

  var CONSENT_KEY = 'cookieConsent';
  var banner     = document.getElementById('cookie-consent');
  var acceptBtn  = document.getElementById('cookie-accept');
  var declineBtn = document.getElementById('cookie-decline');

  if (!banner) { return; }

  function show() {
    banner.removeAttribute('hidden');
    void banner.offsetWidth; // force reflow so CSS transition fires
    banner.classList.add('is-visible');
    document.body.classList.add('cookie-consent-open');
  }

  function hide() {
    banner.classList.remove('is-visible');
    document.body.classList.remove('cookie-consent-open');
    setTimeout(function () {
      banner.setAttribute('hidden', '');
    }, 320);
  }

  function saveConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
    hide();
  }

  // Check for an existing choice
  var existing;
  try { existing = localStorage.getItem(CONSENT_KEY); } catch (e) {}

  if (existing) {
    return; // choice already recorded — banner stays hidden
  }

  // No prior consent — show the banner
  show();

  acceptBtn.addEventListener('click', function () { saveConsent('accepted'); });
  declineBtn.addEventListener('click', function () { saveConsent('declined'); });

}());

// ─────────────────────────────────────────────────────────────────────────────
// TODO Neelam: replace G-XXXXXXXXXX with your real GA4 Measurement ID once
// you create the GA4 property at analytics.google.com.
// Once filled in, uncomment the block below.
//
// if (localStorage.getItem("cookieConsent") === "accepted") {
//   var s = document.createElement("script");
//   s.async = true;
//   s.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX";
//   document.head.appendChild(s);
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){ dataLayer.push(arguments); }
//   gtag("js", new Date());
//   gtag("config", "G-XXXXXXXXXX");
// }
