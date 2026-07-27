/* Floating contact bar — injected on every page that loads this file. */
(function () {
  if (document.getElementById('float-sidebar')) return;   // page has its own
  function build() {
    if (document.getElementById('float-sidebar')) return;
    var el = document.createElement('div');
    el.className = 'float-sidebar';
    el.id = 'float-sidebar';
    el.innerHTML = "<a href=\"mailto:info@flii.nl\" class=\"float-icon\" title=\"E-mail\">\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\">\n      <rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/>\n      <path d=\"M2 8l10 6 10-6\"/>\n    </svg>\n  </a>\n  <a href=\"tel:+31640881169\" class=\"float-icon\" title=\"Bel ons\">\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n      <path d=\"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.72 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.62 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.59a16 16 0 006.29 6.29l.96-.96a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z\"/>\n    </svg>\n  </a>\n  <a href=\"https://calendly.com/flii-media\" target=\"_blank\" class=\"float-icon\" title=\"Plan een gesprek\">\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\"/><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"/><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"/><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"/></svg>\n  </a>\n  <div class=\"float-icon\" title=\"Chat\" onclick=\"window.chatbase && window.chatbase('open')\">\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\">\n      <path d=\"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z\"/>\n    </svg>";
    document.body.appendChild(el);
    function check() {
      el.classList.toggle('visible', window.scrollY > window.innerHeight * 0.3);
    }
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.highlightSidebar = function () {
      el.classList.add('visible');
      el.classList.remove('highlight');
      void el.offsetWidth;
      el.classList.add('highlight');
      setTimeout(function () { el.classList.remove('highlight'); }, 700);
    };
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else { build(); }
})();
