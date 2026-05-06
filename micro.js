(function () {
  'use strict';

  /* ─────────────────────────────────────────
     0. MOBILE NAV TOGGLE (all devices)
  ───────────────────────────────────────── */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav   = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close on any nav link click
    mainNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mainNav.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Skip touch devices and reduced motion for all visual effects below
  if ('ontouchstart' in window) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ─────────────────────────────────────────
     1. CURSOR GLOW
     Smooth radial glow that follows the cursor
  ───────────────────────────────────────── */
  var glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);

  var tx = -400, ty = -400; // start off-screen
  var cx = tx, cy = ty;

  document.addEventListener('mousemove', function (e) {
    tx = e.clientX;
    ty = e.clientY;
    if (!glow.classList.contains('active')) {
      glow.classList.add('active');
    }
  });

  document.addEventListener('mouseleave', function () {
    glow.classList.remove('active');
  });

  (function animateGlow() {
    cx += (tx - cx) * 0.09;
    cy += (ty - cy) * 0.09;
    glow.style.transform = 'translate(' + (cx - 200) + 'px,' + (cy - 200) + 'px)';
    requestAnimationFrame(animateGlow);
  }());

  // Pulse glow when hovering buttons
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('mouseenter', function () { glow.classList.add('glow-btn'); });
    btn.addEventListener('mouseleave', function () { glow.classList.remove('glow-btn'); });
  });

  /* ─────────────────────────────────────────
     2. CARD TILT
     Subtle 3-D rotation tracking the cursor
  ───────────────────────────────────────── */
  var TILT_MAX = 5; // degrees
  var LIFT = -5;    // px

  var tiltEls = document.querySelectorAll(
    '.card, .proof-card, .portfolio-card, .blog-card, ' +
    '.svc-deliverable-card, .svc-why-card, .audit-feature-card'
  );

  tiltEls.forEach(function (el) {
    var raf = null;

    el.addEventListener('mouseenter', function () {
      // Override CSS hover lift so JS controls everything
      el.style.transition = 'box-shadow 0.2s ease';
    });

    el.addEventListener('mousemove', function (e) {
      if (raf) return; // throttle to one RAF per frame
      raf = requestAnimationFrame(function () {
        var r = el.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width  - 0.5) * TILT_MAX;
        var y = ((e.clientY - r.top)  / r.height - 0.5) * TILT_MAX;
        el.style.transform =
          'translateY(' + LIFT + 'px) perspective(700px) ' +
          'rotateX(' + (-y) + 'deg) rotateY(' + x + 'deg)';
        raf = null;
      });
    });

    el.addEventListener('mouseleave', function () {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      el.style.transition = 'transform 0.45s ease, box-shadow 0.3s ease';
      el.style.transform = '';
      // Clean up inline transition after it settles
      var t = setTimeout(function () { el.style.transition = ''; }, 460);
      el._cleanupTimer = t;
    });

    el.addEventListener('mouseenter', function () {
      if (el._cleanupTimer) { clearTimeout(el._cleanupTimer); }
    });
  });

  /* ─────────────────────────────────────────
     3. BUTTON CLICK FEEDBACK
     Brief scale-down on mousedown for tactile feel
  ───────────────────────────────────────── */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('mousedown', function () {
      btn.style.transform = 'scale(0.96)';
    });
    btn.addEventListener('mouseup', function () {
      btn.style.transform = '';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });

}());
