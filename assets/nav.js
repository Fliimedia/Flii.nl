/* Menulade voor alle pagina's buiten de homepage. De homepage heeft een eigen,
   uitgebreidere lade met dezelfde klassenamen; die laten we met rust. */
(function () {
  var LINKS = [
    ['/#over-ons', 'Over ons'],
    ['/#diensten', 'Diensten'],
    ['/#cases', 'Cases'],
    ['/kennisbank', 'Kennisbank'],
    ['/#faq', 'FAQ'],
    ['/contact', 'Contact']
  ];

  function loopKaart() {
    return '<a href="/loop" class="nav-loop-card">' +
      '<span class="loopmark" aria-hidden="true">' +
        '<svg class="loopmark-svg" viewBox="0 0 100 100">' +
          '<defs><linearGradient id="navLmGrad" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#B14BFF"/><stop offset="28%" stop-color="#E7255A"/>' +
            '<stop offset="50%" stop-color="#FF5E9A"/><stop offset="64%" stop-color="#FFD2E4"/>' +
            '<stop offset="80%" stop-color="#FF3D8E"/><stop offset="100%" stop-color="#C04BFF"/>' +
          '</linearGradient></defs>' +
          '<g class="lm-rot"><circle cx="50" cy="50" r="35" fill="none" stroke="url(#navLmGrad)" stroke-width="5"/></g>' +
          '<g class="lm-rot2"><circle cx="50" cy="50" r="32" fill="none" stroke="url(#navLmGrad)" stroke-width="3" opacity="0.85"/></g>' +
        '</svg>' +
      '</span>' +
      '<span class="nav-loop-text"><span class="nav-loop-name">Flii Loop</span>' +
      '<span class="nav-loop-desc">Eén loop die blijft leren →</span></span></a>';
  }

  function maakLade() {
    var d = document.createElement('div');
    d.className = 'nav-menu';
    d.id = 'nav-menu';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.innerHTML =
      '<span class="menu-fm" aria-hidden="true">' +
        '<img loading="lazy" decoding="async" src="/assets/img/d913cc3c069f.webp" alt=""></span>' +
      '<button class="nav-menu-close" id="nav-menu-close" aria-label="Sluiten">×</button>' +
      '<a href="/projecten/crm/" class="nav-slot" aria-label="Flii CRM, met pincode">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="4" y="10.5" width="16" height="10" rx="2"/>' +
        '<path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg></a>' +
      '<div class="nav-menu-inner">' +
        '<nav class="nav-menu-links" aria-label="Hoofdmenu">' +
          LINKS.map(function (l) {
            return '<a href="' + l[0] + '" class="nav-menu-link">' + l[1] + '</a>';
          }).join('') +
        '</nav>' + loopKaart() +
        '<p class="nav-menu-footer"><a href="mailto:info@flii.nl">info@flii.nl</a> · ' +
        '<a href="tel:+31640881169">+31 6 40 88 11 69</a></p>' +
      '</div>';
    document.body.appendChild(d);
    return d;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var knop = document.querySelector('.nav-burger');
    if (!knop) return;
    // Heeft de pagina al een lade (de homepage), dan niets toevoegen.
    var lade = document.getElementById('nav-menu') || maakLade();
    if (typeof window.openMenu === 'function') return;

    function open() { lade.classList.add('open'); document.body.classList.add('nav-open'); }
    function dicht() { lade.classList.remove('open'); document.body.classList.remove('nav-open'); }

    knop.addEventListener('click', open);
    lade.querySelector('#nav-menu-close').addEventListener('click', dicht);
    lade.addEventListener('click', function (e) { if (e.target === lade) dicht(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lade.classList.contains('open')) dicht();
    });
    window.openMenu = open;
    window.closeMenu = dicht;
  });
})();
