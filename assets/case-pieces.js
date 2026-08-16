/* Flii — cases als geanimeerde beeldfragmenten.
   Effect naar het idee van Codrops' Animated Image Pieces (MIT), aangepast voor onze cases. */
(function () {
  'use strict';

  var RIJEN = 12, KOLOMMEN = 10;

  function Stukken(el, opties) {
    this.el = el;
    this.rijen = opties.rijen;
    this.kolommen = opties.kolommen;
    this.vertraging = opties.vertraging || [0, 40];
    this.stukken = [];
    this.bron = opties.bron;
    this.bouw();
    var self = this;
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { self.herbereken(); }, 120);
    });
  }

  Stukken.prototype.maat = function () {
    var b = this.el.getBoundingClientRect();
    return {
      w: Math.ceil(b.width / this.kolommen),
      h: Math.ceil(b.height / this.rijen),
      breedte: b.width,
      hoogte: b.height
    };
  };

  Stukken.prototype.bouw = function () {
    var m = this.maat();
    for (var r = 0; r < this.rijen; r++) {
      for (var c = 0; c < this.kolommen; c++) {
        var p = document.createElement('div');
        p.className = 'cp-stuk';
        p.style.width = m.w + 'px';
        p.style.height = m.h + 'px';
        p.style.left = (c * m.w) + 'px';
        p.style.top = (r * m.h) + 'px';
        p.style.backgroundImage = 'url(' + this.bron + ')';
        p.style.backgroundSize = m.breedte + 'px ' + m.hoogte + 'px';
        p.style.backgroundPosition = (-c * m.w) + 'px ' + (-r * m.h) + 'px';
        p.dataset.rij = r;
        p.dataset.kolom = c;
        p.dataset.vertraging = Math.round(
          this.vertraging[0] + Math.random() * (this.vertraging[1] - this.vertraging[0]));
        // afgeronde hoeken zonder de fragmenten af te snijden
        if (r === 0 && c === 0) p.style.borderTopLeftRadius = '18px';
        if (r === 0 && c === this.kolommen - 1) p.style.borderTopRightRadius = '18px';
        if (r === this.rijen - 1 && c === 0) p.style.borderBottomLeftRadius = '18px';
        if (r === this.rijen - 1 && c === this.kolommen - 1) p.style.borderBottomRightRadius = '18px';
        this.el.appendChild(p);
        this.stukken.push(p);
      }
    }
  };

  Stukken.prototype.herbereken = function () {
    var m = this.maat();
    for (var i = 0; i < this.stukken.length; i++) {
      var p = this.stukken[i];
      var r = +p.dataset.rij, c = +p.dataset.kolom;
      p.style.width = m.w + 'px';
      p.style.height = m.h + 'px';
      p.style.left = (c * m.w) + 'px';
      p.style.top = (r * m.h) + 'px';
      p.style.backgroundSize = m.breedte + 'px ' + m.hoogte + 'px';
      p.style.backgroundPosition = (-c * m.w) + 'px ' + (-r * m.h) + 'px';
    }
  };

  Stukken.prototype.zetBeeld = function (bron) {
    this.bron = bron;
    for (var i = 0; i < this.stukken.length; i++) {
      this.stukken[i].style.backgroundImage = 'url(' + bron + ')';
    }
  };

  Stukken.prototype.animeer = function (opts) {
    var o = { targets: this.stukken };
    for (var k in opts) o[k] = opts[k];
    window.anime.remove(this.stukken);
    window.anime(o);
  };

  function start(wortel) {
    var paneel = wortel.querySelector('.cp-pieces');
    var items = Array.prototype.slice.call(wortel.querySelectorAll('.cp-item'));
    var link = wortel.querySelector('.cp-link');
    if (!paneel || !items.length || !window.anime) return;

    var rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var eerste = items[0];

    wortel.dataset.rijk = 'ja';
    paneel.style.backgroundImage = 'none';
    var obj = new Stukken(paneel, {
      rijen: RIJEN, kolommen: KOLOMMEN, vertraging: [0, 40],
      bron: eerste.dataset.beeld
    });

    var bezig = false, huidig = 0;
    function toon(pos) {
      if (bezig || huidig === pos) return;
      var item = items[pos];
      bezig = true;
      items[huidig].classList.remove('is-actief');
      huidig = pos;
      item.classList.add('is-actief');
      link.setAttribute('href', item.dataset.url);
      link.setAttribute('aria-label', 'Bekijk de case ' + item.dataset.titel);
      wortel.style.setProperty('--cp-kleur', item.dataset.kleur || '#E8294A');

      if (rustig) { obj.zetBeeld(item.dataset.beeld); bezig = false; return; }

      obj.animeer({
        duration: 220,
        easing: 'easeOutQuad',
        delay: function (t) { return +t.dataset.rij * +t.dataset.vertraging; },
        translateX: function () { return window.anime.random(-40, 40) + 'px'; },
        translateY: function () { return window.anime.random(-600, -180) + 'px'; },
        rotateZ: function () { return window.anime.random(-40, 40) + 'deg'; },
        opacity: 0,
        complete: function () {
          obj.zetBeeld(item.dataset.beeld);
          // Een frame wachten: binnen de complete-callback zou anime.remove()
          // de nieuwe animatie meteen weer opruimen.
          requestAnimationFrame(function () {
          // Startpositie eerst zetten. In anime.js v3 werkt een van-naar-array
          // vanuit een functie niet meer, vandaar anime.set() als aparte stap.
          window.anime.set(obj.stukken, {
            translateX: 0,
            rotateZ: 0,
            opacity: 0,
            translateY: function () { return window.anime.random(180, 640); }
          });
          obj.animeer({
            duration: 520,
            easing: [0.3, 1, 0.3, 1],
            delay: function (t) { return +t.dataset.rij * +t.dataset.vertraging; },
            translateX: 0,
            translateY: 0,
            rotateZ: 0,
            opacity: { value: 1, duration: 480, easing: 'linear' },
            complete: function () { bezig = false; }
          });
          });
        }
      });
    }

    items.forEach(function (item, pos) {
      item.addEventListener('click', function (e) { e.preventDefault(); toon(pos); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toon(pos); }
      });
    });

    eerste.classList.add('is-actief');
    link.setAttribute('href', eerste.dataset.url);
    link.setAttribute('aria-label', 'Bekijk de case ' + eerste.dataset.titel);
    wortel.style.setProperty('--cp-kleur', eerste.dataset.kleur || '#E8294A');
  }

  function init() {
    var wortel = document.querySelector('.cp');
    if (!wortel) return;
    // Toon het eerste beeld meteen, zodat er iets staat voordat anime.js geladen is.
    var paneel = wortel.querySelector('.cp-pieces');
    var eersteItem = wortel.querySelector('.cp-item');
    if (paneel && eersteItem) {
      paneel.style.backgroundImage = 'url(' + eersteItem.dataset.beeld + ')';
      paneel.style.backgroundSize = 'cover';
      paneel.style.backgroundPosition = 'center';
    }
    // Werkt ook zonder animatie: klikken wisselt dan gewoon het beeld.
    eenvoudigeWissel(wortel);
    // anime.js pas laden wanneer de sectie in beeld komt
    function laad() {
      if (window.anime) { start(wortel); return; }
      var s = document.createElement('script');
      s.src = wortel.dataset.anime;
      s.onload = function () { start(wortel); };
      document.head.appendChild(s);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { io.disconnect(); laad(); }
      }, { rootMargin: '200px' });
      io.observe(wortel);
    } else { laad(); }
  }

  function eenvoudigeWissel(wortel) {
    var items = Array.prototype.slice.call(wortel.querySelectorAll('.cp-item'));
    var link = wortel.querySelector('.cp-link');
    var paneel = wortel.querySelector('.cp-pieces');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        if (wortel.dataset.rijk === 'ja') return;   // volwaardige versie draait al
        items.forEach(function (i) { i.classList.remove('is-actief'); });
        item.classList.add('is-actief');
        paneel.style.backgroundImage = 'url(' + item.dataset.beeld + ')';
        link.setAttribute('href', item.dataset.url);
        wortel.style.setProperty('--cp-kleur', item.dataset.kleur || '#E8294A');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
