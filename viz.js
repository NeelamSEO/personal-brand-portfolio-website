(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ─────────────────────────────────────────
     1. COUNTER ANIMATION
     Ease-out cubic, fires once on scroll entry
  ───────────────────────────────────────── */
  function animateCounter(el) {
    var from   = parseInt(el.getAttribute('data-from')   || '0', 10);
    var to     = parseInt(el.getAttribute('data-to')     || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.round(from + (to - from) * eased);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + to + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  /* ─────────────────────────────────────────
     2. PROGRESS BAR ANIMATION
     CSS transition triggered on scroll entry
  ───────────────────────────────────────── */
  function animateBar(fill) {
    var target = parseFloat(fill.getAttribute('data-width') || '0');
    requestAnimationFrame(function () {
      fill.style.transition = 'width 1.3s cubic-bezier(0.22, 1, 0.36, 1)';
      fill.style.width = target + '%';
    });
  }

  /* ─────────────────────────────────────────
     3. SVG LINE CHART ANIMATION
     stroke-dashoffset draw-on technique
  ───────────────────────────────────────── */
  function animateLine(path) {
    var len = path.getTotalLength ? path.getTotalLength() : 400;
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    // Force reflow before transitioning
    path.getBoundingClientRect();
    path.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
    path.style.strokeDashoffset = 0;
  }

  function animateArea(path) {
    path.style.opacity = '0';
    path.style.transition = 'opacity 1s ease 0.4s';
    path.getBoundingClientRect();
    path.style.opacity = '1';
  }

  /* ─────────────────────────────────────────
     INTERSECTION OBSERVER — wires everything
  ───────────────────────────────────────── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;

      if (el.classList.contains('counter'))    { animateCounter(el); }
      if (el.classList.contains('rs-bar-fill')){ animateBar(el); }
      if (el.classList.contains('rs-line'))    { animateLine(el); }
      if (el.classList.contains('rs-area'))    { animateArea(el); }

      io.unobserve(el);
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.counter, .rs-bar-fill, .rs-line, .rs-area')
    .forEach(function (el) { io.observe(el); });

}());
