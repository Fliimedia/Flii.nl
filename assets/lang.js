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
      '.nav-menu-footer .lang-wissel a[aria-current]{color:#0F0E0C;font-weight:700}' +
      '.float-icon.lang-float .lang-vlag{width:20px;height:20px;border-radius:50%;overflow:hidden;display:block;' +
        'box-shadow:inset 0 0 0 1px rgba(0,0,0,.1);pointer-events:none}' +
      '.float-icon.lang-float .lang-vlag svg{width:100%;height:100%}';
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

  /* In de zwevende contactbalk rechts: de vlag van de huidige taal.
     Eén tik wisselt naar de andere taal. */
  var VLAG_NL = '<svg viewBox="0 0 30 30" aria-hidden="true"><rect width="30" height="10" fill="#AE1C28"/>' +
    '<rect y="10" width="30" height="10" fill="#fff"/><rect y="20" width="30" height="10" fill="#21468B"/></svg>';
  var VLAG_EN = '<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
    '<clipPath id="lang-uk-clip"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath>' +
    '<rect width="60" height="30" fill="#012169"/>' +
    '<path d="M0,0L60,30M60,0L0,30" stroke="#fff" stroke-width="6"/>' +
    '<path d="M0,0L60,30M60,0L0,30" clip-path="url(#lang-uk-clip)" stroke="#C8102E" stroke-width="4"/>' +
    '<path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/>' +
    '<path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg>';

  function bouwBalk() {
    var balk = document.getElementById('float-sidebar');
    if (!balk || balk.querySelector('.lang-float')) return;
    var huidig = isEN || keuze === 'en' ? 'en' : 'nl';
    var naar = huidig === 'en' ? 'nl' : 'en';
    var a = document.createElement('a');
    a.className = 'float-icon lang-float';
    a.href = naar === 'en' ? naarEN : naarNL;
    a.hreflang = naar;
    a.title = naar === 'en' ? 'English' : 'Nederlands';
    a.setAttribute('aria-label', naar === 'en' ? 'Switch to English' : 'Wissel naar Nederlands');
    a.innerHTML = '<span class="lang-vlag">' + (huidig === 'en' ? VLAG_EN : VLAG_NL) + '</span>';
    a.addEventListener('click', function () { bewaar(naar); });
    balk.appendChild(a);
  }

  css();
  /* nav.js bouwt de lade bij DOMContentLoaded; daarna pas toevoegen. */
  function straks() { setTimeout(function () { bouw(); bouwBalk(); }, 0); }
  if (document.readyState === 'loading' || document.readyState === 'interactive') {
    document.addEventListener('DOMContentLoaded', straks);
  }
  if (document.readyState !== 'loading') straks();
})();
