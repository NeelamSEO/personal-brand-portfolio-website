(function () {
  'use strict';

  var STORAGE_KEY = 'cookieConsent';
  var banner = document.getElementById('cookie-banner');

  // ─── GA4 loader ───────────────────────────────────────────────────────────
  // Fires only when the visitor has accepted cookies.
  // TODO Neelam: replace G-XXXXXXXXXX with your real GA4 measurement ID
  // once you set up Google Analytics, then uncomment the lines below.
  function loadGA4() {
    // var script = document.createElement('script');
    // script.async = true;
    // script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    // document.head.appendChild(script);
    //
    // window.dataLayer = window.dataLayer || [];
    // function gtag() { dataLayer.push(arguments); }
    // gtag('js', new Date());
    // gtag('config', 'G-XXXXXXXXXX');
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function hideBanner() {
    if (banner) {
      banner.setAttribute('aria-hidden', 'true');
      banner.style.display = 'none';
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
    hideBanner();
    if (value === 'accepted') {
      loadGA4();
    }
  }

  // ─── Check existing consent ───────────────────────────────────────────────
  var existing;
  try {
    existing = localStorage.getItem(STORAGE_KEY);
  } catch (e) {}

  if (existing) {
    hideBanner();
    if (existing === 'accepted') {
      loadGA4();
    }
    return;
  }

  // ─── No prior consent — show banner and wire buttons ──────────────────────
  if (!banner) { return; }

  banner.style.display = 'flex';
  banner.removeAttribute('aria-hidden');

  var acceptBtn = document.getElementById('cookie-accept');
  var declineBtn = document.getElementById('cookie-decline');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () { saveConsent('accepted'); });
  }
  if (declineBtn) {
    declineBtn.addEventListener('click', function () { saveConsent('declined'); });
  }
}());
