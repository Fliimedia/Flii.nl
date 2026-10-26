/* Taalkeuze in de menulade: Nederlands (standaard) of Engels.
   Engelse pagina's staan onder /en/. Heeft een Nederlandse pagina nog geen
   Engelse versie, dan gaat 'English' naar de Engelse homepage. */
(function () {
  var PAREN = [
    ['/', '/en/'],
    ['/diensten', '/en/services'],
    ['/contact', '/en/contact']
  ];

  function schoon(p) {
    p = p.replace(/\.html$/, '').replace(/\/index$/, '/');
    if (p.length > 1 && p.charAt(p.length - 1) === '/') p = p.slice(0, -1);
    return p || '/';
  }

  var pad = schoon(location.pathname);
  var isEN = pad === '/en' || pad.indexOf('/en/') === 0;
  var naarNL = '/', naarEN = '/en/', heeftPaar = false;
  PAREN.forEach(function (paar) {
    if (schoon(paar[0]) === pad) { naarEN = paar[1]; naarNL = paar[0]; heeftPaar = true; }
    if (schoon(paar[1]) === pad) { naarNL = paar[0]; naarEN = paar[1]; heeftPaar = true; }
  });
  if (!isEN) naarNL = location.pathname;

  /* De gekozen taal blijft bewaard. Wie Engels koos en op een Nederlandse
     pagina met een Engelse versie komt, gaat direct naar die versie. */
  var SLEUTEL = 'flii-taal';
  function lees() { try { return localStorage.getItem(SLEUTEL); } catch (e) { return null; } }
  function bewaar(t) { try { localStorage.setItem(SLEUTEL, t); } catch (e) {} }
  var keuze = lees();
  if (!isEN && keuze === 'en' && heeftPaar) {
    location.replace(naarEN + location.search + location.hash);
    return;
  }

  function css() {
    if (document.getElementById('lang-css')) return;
    var s = document.createElement('style');
    s.id = 'lang-css';
    s.textContent =
      '.nav-menu-footer .lang-wissel{white-space:nowrap}' +
      '.nav-menu-footer .lang-wissel a[aria-current]{color:#0F0E0C;font-weight:700}';
    document.head.appendChild(s);
  }

  /* Onderaan in de menulade, naast e-mail en telefoon: NL · EN. */
  function bouw() {
    var voet = document.querySelector('.nav-menu-footer');
    if (!voet || voet.querySelector('.lang-wissel')) return;
    var huidig = isEN || keuze === 'en' ? 'en' : 'nl';
    var w = document.createElement('span');
    w.className = 'lang-wissel';
    w.setAttribute('aria-label', huidig === 'en' ? 'Language' : 'Taal');
    w.innerHTML =
      '<a href="' + naarNL + '" hreflang="nl" lang="nl" data-taal="nl"' + (huidig === 'nl' ? ' aria-current="true"' : '') + '>NL</a>' +
      ' · ' +
      '<a href="' + naarEN + '" hreflang="en" lang="en" data-taal="en"' + (huidig === 'en' ? ' aria-current="true"' : '') + '>EN</a>';
    voet.appendChild(document.createTextNode(' · '));
    voet.appendChild(w);
    [].forEach.call(w.querySelectorAll('[data-taal]'), function (el) {
      el.addEventListener('click', function () { bewaar(el.getAttribute('data-taal')); });
    });
  }

  css();
  /* nav.js bouwt de lade bij DOMContentLoaded; daarna pas toevoegen. */
  function straks() { setTimeout(bouw, 0); }
  if (document.readyState === 'loading' || document.readyState === 'interactive') {
    document.addEventListener('DOMContentLoaded', straks);
  }
  if (document.readyState !== 'loading') straks();
})();
