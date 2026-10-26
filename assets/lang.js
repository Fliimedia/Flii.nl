/* Taalkeuze in de menubalk: Nederlands (standaard) of Engels.
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

  var VLAG = {
    nl: '<svg viewBox="0 0 30 30" aria-hidden="true"><rect width="30" height="10" fill="#AE1C28"/><rect y="10" width="30" height="10" fill="#fff"/><rect y="20" width="30" height="10" fill="#21468B"/></svg>',
    en: function (id) {
      return '<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
        '<clipPath id="' + id + '"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath>' +
        '<rect width="60" height="30" fill="#012169"/>' +
        '<path d="M0,0L60,30M60,0L0,30" stroke="#fff" stroke-width="6"/>' +
        '<path d="M0,0L60,30M60,0L0,30" clip-path="url(#' + id + ')" stroke="#C8102E" stroke-width="4"/>' +
        '<path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/>' +
        '<path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg>';
    }
  };
  var n = 0;
  function vlag(t) { return t === 'nl' ? VLAG.nl : VLAG.en('lang-uk-' + (++n)); }

  function css() {
    if (document.getElementById('lang-css')) return;
    var s = document.createElement('style');
    s.id = 'lang-css';
    s.textContent =
      '.lang{position:relative;margin-left:auto;margin-right:14px;display:flex;align-items:center;z-index:5}' +
      '.lang-btn{display:flex;align-items:center;gap:6px;height:34px;padding:0 9px 0 5px;border:1px solid #E2DFD9;' +
        'border-radius:100px;background:#fff;cursor:pointer;font:inherit;color:#0F0E0C;transition:border-color .15s}' +
      '.lang-btn:hover,.lang.open .lang-btn{border-color:#0F0E0C}' +
      '.lang-flag{width:22px;height:22px;border-radius:50%;overflow:hidden;display:block;flex-shrink:0;' +
        'box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}' +
      '.lang-flag svg{width:100%;height:100%;display:block}' +
      '.lang-code{font-size:11px;font-weight:700;letter-spacing:.06em}' +
      '.lang-chev{width:10px;height:10px;transition:transform .2s}' +
      '.lang.open .lang-chev{transform:rotate(180deg)}' +
      '.lang-menu{position:absolute;top:calc(100% + 8px);right:0;min-width:170px;background:#fff;border:1px solid #E2DFD9;' +
        'border-radius:12px;padding:6px;box-shadow:0 12px 32px rgba(15,14,12,.12);opacity:0;visibility:hidden;' +
        'transform:translateY(-4px);transition:opacity .15s,transform .15s,visibility .15s}' +
      '.lang.open .lang-menu{opacity:1;visibility:visible;transform:none}' +
      '.lang-opt{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;font-size:14px;' +
        'font-weight:500;color:#0F0E0C;text-decoration:none}' +
      '.lang-opt:hover{background:#F3F1EB}' +
      '.lang-opt[aria-current]{font-weight:700}' +
      '.lang-opt[aria-current]::after{content:"";margin-left:auto;width:6px;height:6px;border-radius:50%;background:#E8294A}';
    document.head.appendChild(s);
  }

  function bouw() {
    var nav = document.querySelector('nav.nav');
    if (!nav || nav.querySelector('.lang')) return;
    var huidig = isEN || keuze === 'en' ? 'en' : 'nl';
    var w = document.createElement('div');
    w.className = 'lang';
    w.innerHTML =
      '<button type="button" class="lang-btn" aria-haspopup="true" aria-expanded="false" aria-label="' +
        (huidig === 'en' ? 'Language: English' : 'Taal: Nederlands') + '">' +
        '<span class="lang-flag">' + vlag(huidig) + '</span>' +
        '<span class="lang-code">' + huidig.toUpperCase() + '</span>' +
        '<svg class="lang-chev" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3.5l3 3 3-3"/></svg>' +
      '</button>' +
      '<div class="lang-menu">' +
        '<a class="lang-opt" href="' + naarNL + '" hreflang="nl" lang="nl" data-taal="nl"' + (huidig === 'en' ? '' : ' aria-current="true"') + '>' +
          '<span class="lang-flag">' + vlag('nl') + '</span>Nederlands</a>' +
        '<a class="lang-opt" href="' + naarEN + '" hreflang="en" lang="en" data-taal="en"' + (huidig === 'en' ? ' aria-current="true"' : '') + '>' +
          '<span class="lang-flag">' + vlag('en') + '</span>English</a>' +
      '</div>';
    var burger = nav.querySelector('.nav-burger');
    if (burger && burger.parentNode === nav) nav.insertBefore(w, burger); else nav.appendChild(w);

    var knop = w.querySelector('.lang-btn');
    function zet(open) {
      w.classList.toggle('open', open);
      knop.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    knop.addEventListener('click', function (e) { e.stopPropagation(); zet(!w.classList.contains('open')); });
    document.addEventListener('click', function (e) { if (!w.contains(e.target)) zet(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') zet(false); });
    [].forEach.call(w.querySelectorAll('[data-taal]'), function (a) {
      a.addEventListener('click', function () { bewaar(a.getAttribute('data-taal')); });
    });
  }

  css();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bouw); else bouw();
})();
