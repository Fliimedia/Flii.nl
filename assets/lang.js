/* Taalkeuze: Nederlands (standaard) of Engels.
   Staat op twee plekken: onderaan in de menulade (NL · EN) en onderaan in de
   zwevende contactbalk rechts (vlag met uitklapper naar links).
   Engelse pagina's staan onder /en/. Wisselen houdt je op dezelfde pagina en
   op dezelfde plek; heeft een pagina (nog) geen versie in de andere taal, dan
   blijf je staan en wordt alleen de keuze bewaard. */
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
  var paginaTaal = isEN ? 'en' : 'nl';
  var tegenhanger = null;            // pad van dezelfde pagina in de andere taal
  PAREN.forEach(function (paar) {
    if (schoon(paar[0]) === pad) tegenhanger = paar[1];
    if (schoon(paar[1]) === pad) tegenhanger = paar[0];
  });

  var SLEUTEL = 'flii-taal', PLEK = 'flii-taal-plek';
  function lees() { try { return localStorage.getItem(SLEUTEL); } catch (e) { return null; } }
  function bewaar(t) { try { localStorage.setItem(SLEUTEL, t); } catch (e) {} }
  var keuze = lees();

  /* Wie Engels koos en op een Nederlandse pagina met Engelse versie komt,
     gaat direct naar die versie. */
  if (!isEN && keuze === 'en' && tegenhanger) {
    location.replace(tegenhanger + location.search + location.hash);
    return;
  }
  var huidig = isEN || keuze === 'en' ? 'en' : 'nl';

  /* ---------- Plek op de pagina onthouden en terugzetten ---------- */
  function overslaan(el) {
    return el.closest('#nav-menu,#float-sidebar,#contact-popup,.nav,nav,script,style');
  }
  function plekNu() {
    var beste = null, top = -Infinity;
    [].forEach.call(document.querySelectorAll('body [id]'), function (el) {
      if (overslaan(el) || !el.offsetHeight) return;
      var r = el.getBoundingClientRect();
      if (r.top <= 1 && r.bottom > 0 && r.top > top) { top = r.top; beste = el; }
    });
    var max = document.documentElement.scrollHeight - innerHeight;
    return {
      id: beste ? beste.id : null,
      in: beste ? -beste.getBoundingClientRect().top : 0,
      deel: max > 0 ? scrollY / max : 0
    };
  }
  function zetPlek(p) {
    var el = p.id && document.getElementById(p.id);
    if (el) {
      scrollTo(0, el.getBoundingClientRect().top + scrollY + p.in);
    } else {
      scrollTo(0, p.deel * (document.documentElement.scrollHeight - innerHeight));
    }
  }
  (function herstel() {
    var p;
    try { p = JSON.parse(sessionStorage.getItem(PLEK) || 'null'); } catch (e) { p = null; }
    if (!p || p.pad !== pad) return;
    try { sessionStorage.removeItem(PLEK); } catch (e) {}
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    function doe() { zetPlek(p); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', doe); else doe();
    addEventListener('load', function () { doe(); setTimeout(doe, 300); });
  })();

  function wissel(t) {
    bewaar(t);
    if (t === paginaTaal || !tegenhanger) {
      // Geen andere versie (of al in die taal): op de pagina blijven.
      huidig = t;
      ververs();
      return;
    }
    var p = plekNu();
    p.pad = schoon(tegenhanger);
    try { sessionStorage.setItem(PLEK, JSON.stringify(p)); } catch (e) {}
    location.href = tegenhanger + location.search;
  }
  function hrefVoor(t) {
    return t === paginaTaal || !tegenhanger ? location.pathname : tegenhanger;
  }

  /* ---------- Vlaggen ---------- */
  var n = 0;
  function vlag(t) {
    if (t === 'nl') {
      return '<svg viewBox="0 0 30 30" aria-hidden="true"><rect width="30" height="10" fill="#AE1C28"/>' +
        '<rect y="10" width="30" height="10" fill="#fff"/><rect y="20" width="30" height="10" fill="#21468B"/></svg>';
    }
    var id = 'lang-uk-' + (++n);
    return '<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<clipPath id="' + id + '"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath>' +
      '<rect width="60" height="30" fill="#012169"/>' +
      '<path d="M0,0L60,30M60,0L0,30" stroke="#fff" stroke-width="6"/>' +
      '<path d="M0,0L60,30M60,0L0,30" clip-path="url(#' + id + ')" stroke="#C8102E" stroke-width="4"/>' +
      '<path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/>' +
      '<path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg>';
  }

  function css() {
    if (document.getElementById('lang-css')) return;
    var s = document.createElement('style');
    s.id = 'lang-css';
    s.textContent =
      '.nav-menu-footer .lang-wissel{white-space:nowrap}' +
      '.nav-menu-footer .lang-wissel a[aria-current]{color:#0F0E0C;font-weight:700}' +
      /* De balk mag de uitklapper niet afsnijden; de hoeken blijven rond. */
      '.float-sidebar{overflow:visible}' +
      '.float-sidebar>.float-icon:first-child{border-radius:11px 11px 0 0}' +
      '.float-sidebar>.float-icon:last-child{border-radius:0 0 11px 11px}' +
      '.lang-float{position:relative}' +
      '.lang-vlag{width:20px;height:20px;border-radius:50%;overflow:hidden;display:block;flex-shrink:0;' +
        'box-shadow:inset 0 0 0 1px rgba(0,0,0,.1);pointer-events:none}' +
      '.lang-vlag svg{width:100%;height:100%;display:block}' +
      '.lang-fold{position:absolute;right:100%;top:50%;padding-right:8px;' +
        'transform:translate(6px,-50%);opacity:0;visibility:hidden;' +
        'transition:opacity .15s,transform .15s,visibility .15s}' +
      '.lang-float.open .lang-fold{opacity:1;visibility:visible;transform:translate(0,-50%)}' +
      '@media (hover:hover){.lang-float:hover .lang-fold,.lang-float:focus-within .lang-fold{' +
        'opacity:1;visibility:visible;transform:translate(0,-50%)}}' +
      '.lang-fold-in{display:flex;gap:4px;padding:5px;background:#fff;border:1px solid #E2DFD9;border-radius:100px;' +
        'box-shadow:0 4px 18px rgba(15,14,12,.1)}' +
      '.lang-fold a{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;' +
        'transition:background .15s}' +
      '.lang-fold a:hover,.lang-fold a:focus-visible{background:#F5F4F1}' +
      '.lang-fold a .lang-vlag{width:22px;height:22px}' +
      '.lang-fold a[aria-current]{box-shadow:inset 0 0 0 1.5px #0F0E0C}';
    document.head.appendChild(s);
  }

  var opties = [];   // alle taallinks, zodat ze samen bijgewerkt worden
  function koppel(a) {
    opties.push(a);
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var t = a.getAttribute('data-taal');
      var f = a.closest('.lang-float');
      if (f) f.classList.remove('open');
      wissel(t);
    });
  }
  function ververs() {
    opties.forEach(function (a) {
      var t = a.getAttribute('data-taal');
      if (t === huidig) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      a.setAttribute('href', hrefVoor(t));
    });
    var v = document.querySelector('.lang-float > .lang-vlag');
    if (v) v.innerHTML = vlag(huidig);
  }

  /* Onderaan in de menulade, naast e-mail en telefoon: NL · EN. */
  function bouwLade() {
    var voet = document.querySelector('.nav-menu-footer');
    if (!voet || voet.querySelector('.lang-wissel')) return;
    var w = document.createElement('span');
    w.className = 'lang-wissel';
    w.innerHTML =
      '<a hreflang="nl" lang="nl" data-taal="nl">NL</a> · <a hreflang="en" lang="en" data-taal="en">EN</a>';
    voet.appendChild(document.createTextNode(' · '));
    voet.appendChild(w);
    [].forEach.call(w.querySelectorAll('[data-taal]'), koppel);
  }

  /* Onderaan in de zwevende contactbalk: vlag van de huidige taal, met een
     uitklapper naar links (hover, of tik op een telefoon). */
  function bouwBalk() {
    var balk = document.getElementById('float-sidebar');
    if (!balk || balk.querySelector('.lang-float')) return;
    var f = document.createElement('div');
    f.className = 'float-icon lang-float';
    f.setAttribute('role', 'button');
    f.setAttribute('tabindex', '0');
    f.setAttribute('aria-haspopup', 'true');
    f.setAttribute('aria-expanded', 'false');
    f.setAttribute('aria-label', 'Taal / Language');
    f.innerHTML =
      '<span class="lang-vlag"></span>' +
      '<div class="lang-fold"><div class="lang-fold-in">' +
        '<a data-taal="nl" hreflang="nl" lang="nl" title="Nederlands" aria-label="Nederlands">' +
          '<span class="lang-vlag">' + vlag('nl') + '</span></a>' +
        '<a data-taal="en" hreflang="en" lang="en" title="English" aria-label="English">' +
          '<span class="lang-vlag">' + vlag('en') + '</span></a>' +
      '</div></div>';
    balk.appendChild(f);
    [].forEach.call(f.querySelectorAll('[data-taal]'), koppel);
    function zet(open) {
      f.classList.toggle('open', open);
      f.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    f.addEventListener('click', function (e) {
      if (e.target.closest('.lang-fold')) return;
      zet(!f.classList.contains('open'));
    });
    f.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === f) { e.preventDefault(); zet(!f.classList.contains('open')); }
      if (e.key === 'Escape') zet(false);
    });
    document.addEventListener('click', function (e) { if (!f.contains(e.target)) zet(false); });
  }

  css();
  /* nav.js bouwt de lade en contact-bar.js de balk bij DOMContentLoaded;
     daarna pas toevoegen. */
  function straks() { setTimeout(function () { bouwLade(); bouwBalk(); ververs(); }, 0); }
  if (document.readyState === 'loading' || document.readyState === 'interactive') {
    document.addEventListener('DOMContentLoaded', straks);
  }
  if (document.readyState !== 'loading') straks();
})();
