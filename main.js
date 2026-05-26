(function () {
  'use strict';

  // Anti-clickjacking
  if (window.self !== window.top) {
    document.documentElement.style.display = 'none';
    window.top.location = window.self.location;
    return;
  }

  // Strip reflected XSS from URL params
  try {
    var url = new URL(window.location.href);
    var dirty = false;
    url.searchParams.forEach(function (value, key) {
      var clean = value.replace(/<[^>]*>|javascript\s*:/gi, '');
      if (clean !== value) { url.searchParams.set(key, clean); dirty = true; }
    });
    if (dirty) history.replaceState(null, '', url.toString());
  } catch (_) {}

  // Nav scroll
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 12);
    }, { passive: true });
  }

  // Service panels sticky scroll
  (function () {
    var area = document.querySelector('.svc-scroll-area');
    if (!area) return;
    var panels   = Array.from(area.querySelectorAll('.svc-panel'));
    var navItems = Array.from(document.querySelectorAll('.svc-nav-item'));
    var n = panels.length, lastI = 0;
    function update() {
      var rect  = area.getBoundingClientRect();
      var total = area.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      var p    = Math.max(0, Math.min(0.9999, -rect.top / total));
      var newI = Math.min(Math.floor(p * n), n - 1);
      if (newI === lastI) return;
      panels.forEach(function (panel, i) {
        panel.classList.toggle('active', i === newI);
        panel.classList.toggle('past',   i < newI);
      });
      navItems.forEach(function (item, i) { item.classList.toggle('active', i === newI); });
      lastI = newI;
    }
    window.addEventListener('scroll', update, { passive: true });
  })();

  // Scroll Storytelling panels
  (function () {
    var area = document.querySelector('.story-scroll');
    if (!area) return;
    var panels = Array.from(area.querySelectorAll('.story-panel'));
    var n = panels.length, lastI = 0;
    function update() {
      var rect  = area.getBoundingClientRect();
      var total = area.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      var p    = Math.max(0, Math.min(0.9999, -rect.top / total));
      var newI = Math.min(Math.floor(p * n), n - 1);
      if (newI === lastI) return;
      panels.forEach(function (panel, i) {
        panel.classList.toggle('active', i === newI);
        panel.classList.toggle('past',   i < newI);
      });
      lastI = newI;
    }
    window.addEventListener('scroll', update, { passive: true });
  })();

  // Why cards reveal
  (function () {
    var grid = document.querySelector('.why-new');
    if (!grid) return;
    var cards = grid.querySelectorAll('.why-card');
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        cards.forEach(function (c, i) {
          setTimeout(function () { c.classList.add('visible'); }, i * 110);
        });
        obs.disconnect();
      }
    }, { threshold: 0.08 });
    obs.observe(grid);
  })();

  // Word reveal in final CTA
  var finalSection = document.getElementById('contact');
  if (finalSection) {
    finalSection.querySelectorAll('.wr-inner').forEach(function (el) {
      el.style.animationPlayState = 'paused';
    });
    var finalIo = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        finalSection.querySelectorAll('.wr-inner').forEach(function (el) {
          el.style.animationPlayState = 'running';
        });
        finalIo.disconnect();
      }
    }, { threshold: 0.2 });
    finalIo.observe(finalSection);
  }

  // FAQ Accordion
  (function () {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var trigger = item.querySelector('.faq-trigger');
      var body    = item.querySelector('.faq-body');
      if (!trigger || !body) return;
      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        items.forEach(function (i) {
          i.classList.remove('open');
          var b = i.querySelector('.faq-body');
          var t = i.querySelector('.faq-trigger');
          if (b) b.style.maxHeight = '0';
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  })();

  // Floating CTA — show after hero leaves viewport
  (function () {
    var floatCta = document.getElementById('floatCta');
    var hero     = document.getElementById('top');
    if (!floatCta || !hero) return;
    var io = new IntersectionObserver(function (entries) {
      floatCta.classList.toggle('visible', !entries[0].isIntersecting);
    }, { threshold: 0 });
    io.observe(hero);
  })();

})();
