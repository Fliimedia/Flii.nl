/* Menulade voor alle pagina's buiten de homepage, gelijk aan de lade op de
   homepage: matrix, spotlight die de muis volgt, meebewegende inhoud en een
   merkteken dat de matrix onthult. De homepage heeft een eigen lade met
   dezelfde klassenamen; die laten we met rust. */
(function () {
  /* Engelse pagina's staan onder /en/. */
  var EN = /^\/en(\/|$)/.test(location.pathname);
  var LINKS = EN ? [
    ['/en/#diensten', 'Services'],
    ['/en/#cases', 'Cases'],
    ['/en/knowledge-base', 'Knowledge base'],
    ['/en/insight', 'Insight'],
    ['/en/contact', 'Contact']
  ] : [
    ['/#diensten', 'Diensten'],
    ['/#cases', 'Cases'],
    ['/kennisbank', 'Kennisbank'],
    ['/insight', 'Insight'],
    ['/contact', 'Contact']
  ];
  var LOGO = '/assets/img/d913cc3c069f.webp';

  function loopKaart() {
    return '<a href="' + (EN ? '/en/loop' : '/loop') + '" class="nav-loop-card">' +
      '<span class="loopmark" aria-hidden="true">' +
        '<svg class="loopmark-svg" viewBox="0 0 100 100">' +
          '<defs><linearGradient id="navLmGrad" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#B14BFF"/><stop offset="28%" stop-color="#E7255A"/>' +
            '<stop offset="50%" stop-color="#FF5E9A"/><stop offset="64%" stop-color="#FFD2E4"/>' +
            '<stop offset="80%" stop-color="#FF3D8E"/><stop offset="100%" stop-color="#C04BFF"/>' +
          '</linearGradient>' +
          '<filter id="navLmFire" x="-60%" y="-60%" width="220%" height="220%">' +
            '<feTurbulence type="fractalNoise" baseFrequency="0.022 0.04" numOctaves="2" seed="4" result="n">' +
              '<animate attributeName="baseFrequency" dur="6s" values="0.022 0.04;0.03 0.052;0.02 0.034;0.022 0.04" repeatCount="indefinite"/>' +
            '</feTurbulence>' +
            '<feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G">' +
              '<animate attributeName="scale" dur="5s" values="8;12.5;9;8" repeatCount="indefinite"/>' +
            '</feDisplacementMap>' +
            '<feGaussianBlur stdDeviation="0.5"/>' +
          '</filter>' +
          '<filter id="navLmGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>' +
          '</defs>' +
          '<g class="lm-rot">' +
            '<circle cx="50" cy="50" r="35" fill="none" stroke="url(#navLmGrad)" stroke-width="7" filter="url(#navLmGlow)" opacity="0.5"/>' +
            '<circle cx="50" cy="50" r="35" fill="none" stroke="url(#navLmGrad)" stroke-width="5" filter="url(#navLmFire)"/>' +
          '</g>' +
          '<g class="lm-rot2"><circle cx="50" cy="50" r="32" fill="none" stroke="url(#navLmGrad)" stroke-width="3" filter="url(#navLmFire)" opacity="0.85"/></g>' +
        '</svg>' +
      '</span>' +
      '<span class="nav-loop-text"><span class="nav-loop-name">Flii Loop</span>' +
      '<span class="nav-loop-desc">' + (EN ? 'One loop that keeps learning →' : 'Eén loop die blijft leren →') + '</span></span></a>';
  }

  function maakLade() {
    var d = document.createElement('div');
    d.className = 'nav-menu';
    d.id = 'nav-menu';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.innerHTML =
      '<canvas id="matrix-canvas"></canvas>' +
      '<div class="nav-spotlight" id="nav-spotlight"></div>' +
      '<button class="menu-fm" id="menu-fm" type="button" aria-pressed="false" aria-label="' + (EN ? 'Reveal the matrix' : 'Onthul de matrix') + '">' +
        '<span class="fm-l fm-a"><img src="' + LOGO + '" alt="" aria-hidden="true"></span>' +
        '<span class="fm-l fm-b"><img src="' + LOGO + '" alt="" aria-hidden="true"></span>' +
        '<img src="' + LOGO + '" alt="Flii Media">' +
      '</button>' +
      '<button class="nav-menu-close" id="nav-menu-close" aria-label="' + (EN ? 'Close' : 'Sluiten') + '">×</button>' +
      '<a href="/projecten/crm/" class="nav-slot" aria-label="' + (EN ? 'Flii CRM, with PIN' : 'Flii CRM, met pincode') + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="4" y="10.5" width="16" height="10" rx="2"/>' +
        '<path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg></a>' +
      '<div class="nav-menu-inner" id="nav-menu-inner">' +
        '<nav class="nav-menu-links" aria-label="' + (EN ? 'Main menu' : 'Hoofdmenu') + '">' +
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

  /* Matrixregen, spotlight en meebewegende inhoud: overgenomen van de homepage. */
  function matrix(menuEl) {
    var canvas = menuEl.querySelector('#matrix-canvas');
    var spotlight = menuEl.querySelector('#nav-spotlight');
    var innerEl = menuEl.querySelector('#nav-menu-inner');
    var ctx = canvas ? canvas.getContext('2d') : null;
    var cols = 0, drops = [], animId = 0, running = false;
    var mx = -999, my = -999, swayX = 0, swayY = 0, swayVX = 0, swayVY = 0;
    var spotActive = false, moveTimeout = null;
    var lastX = -9999, lastY = -9999;
    var CHARS = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ0123456789ABCDEF<>{}[]/?@#$%^&*';
    var rustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function draw() {
      if (!ctx || !running) return;
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < cols; i++) {
        var ch = CHARS[(Math.random() * CHARS.length) | 0];
        var x = i * 14, y = drops[i] * 14;
        ctx.font = (9 + (Math.random() * 4 | 0)) + 'px monospace';
        ctx.fillStyle = 'rgba(15,14,12,' + (0.35 + Math.random() * 0.65).toFixed(2) + ')';
        ctx.fillText(ch, x, y);
        if (Math.random() > 0.97) { ctx.fillStyle = 'rgba(15,14,12,0.95)'; ctx.fillText(ch, x, y); }
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    }

    function spot(x, y, r) {
      if (!spotlight) return;
      spotlight.style.background =
        'radial-gradient(circle ' + (r === undefined ? 140 : r) + 'px at ' + x + 'px ' + y + 'px, ' +
        'rgba(255,255,255,0) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.72) 65%, rgba(255,255,255,0.95) 100%)';
    }

    function spotUit() {
      if (!spotlight) return;
      var x = lastX, y = lastY, t0 = null, duur = 3200;
      function stap(ts) {
        if (!t0) t0 = ts;
        var verstreken = ts - t0, p = Math.min(verstreken / duur, 1);
        var puls = Math.sin(verstreken * 0.001 * 1.8 * Math.PI * 2) * 18 * (1 - p);
        spot(x, y, Math.max(0, Math.round(140 * (1 - p * p) + puls)));
        if (p < 1) requestAnimationFrame(stap); else spot(-9999, -9999, 0);
      }
      requestAnimationFrame(stap);
    }

    function sway() {
      swayVX *= 0.76; swayVY *= 0.76;
      swayX += swayVX; swayY += swayVY;
      swayX *= 0.87; swayY *= 0.87;
      swayX = Math.max(-4, Math.min(4, swayX));
      swayY = Math.max(-3, Math.min(3, swayY));
      if (innerEl) innerEl.style.transform = 'translate(' + swayX.toFixed(1) + 'px,' + swayY.toFixed(1) + 'px)';
      if (running) requestAnimationFrame(sway);
    }

    function start() {
      if (!canvas || !ctx) return;
      canvas.width = menuEl.offsetWidth;
      canvas.height = menuEl.offsetHeight;
      cols = Math.floor(canvas.width / 14);
      drops = Array(cols).fill(0).map(function () { return (Math.random() * -40) | 0; });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.opacity = '0.12';
      if (rustig) return;
      var wasRunning = running;
      running = true;
      cancelAnimationFrame(animId);
      draw();
      if (!wasRunning) sway();
    }

    function stop() {
      running = false;
      cancelAnimationFrame(animId);
      if (canvas) canvas.style.opacity = '0';
      spotUit();
      mx = my = -999; swayX = swayY = swayVX = swayVY = 0;
      if (innerEl) innerEl.style.transform = '';
      clearTimeout(moveTimeout); spotActive = false;
    }

    function beweeg(e) {
      var rect = menuEl.getBoundingClientRect();
      var punt = e.touches ? e.touches[0] : e;
      if (!punt) return;
      var cx = punt.clientX - rect.left, cy = punt.clientY - rect.top;
      var dx = cx - mx, dy = cy - my, snelheid = Math.sqrt(dx * dx + dy * dy);
      mx = cx; my = cy; lastX = cx; lastY = cy;
      if (!spotActive) {
        spotActive = true;
        if (spotlight) spotlight.style.opacity = '1';
        if (canvas) canvas.style.opacity = '0.9';
      }
      spot(cx, cy);
      if (snelheid > 28 && !rustig) { swayVX += dx * 0.03; swayVY += dy * 0.03; }
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(function () {
        spotUit();
        if (canvas) canvas.style.opacity = '0.12';
        spotActive = false;
      }, 5000);
    }

    menuEl.addEventListener('mousemove', beweeg);
    menuEl.addEventListener('touchmove', beweeg, { passive: true });
    menuEl.addEventListener('touchstart', beweeg, { passive: true });
    window.addEventListener('resize', function () { if (running) start(); });
    return { start: start, stop: stop };
  }

  /* Merkteken: elke 3 seconden een korte storing zolang het menu open is;
     een klik onthult de matrix. */
  function merkteken(menuEl) {
    var knop = menuEl.querySelector('#menu-fm');
    var timer = null;
    if (!knop) return { open: function () {}, dicht: function () {} };
    knop.addEventListener('click', function () {
      var aan = menuEl.classList.toggle('matrix-on');
      knop.classList.toggle('on', aan);
      knop.setAttribute('aria-pressed', aan ? 'true' : 'false');
      knop.setAttribute('aria-label', aan ? 'Verberg de matrix' : 'Onthul de matrix');
    });
    return {
      open: function () {
        clearInterval(timer);
        timer = setInterval(function () {
          knop.classList.add('glitch');
          setTimeout(function () { knop.classList.remove('glitch'); }, 430);
        }, 3000);
      },
      dicht: function () {
        clearInterval(timer); timer = null;
        menuEl.classList.remove('matrix-on');
        knop.classList.remove('on', 'glitch');
        knop.setAttribute('aria-pressed', 'false');
        knop.setAttribute('aria-label', 'Onthul de matrix');
      }
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    var knop = document.querySelector('.nav-burger');
    if (!knop) return;
    // Heeft de pagina al een lade (de homepage), dan niets toevoegen.
    if (document.getElementById('nav-menu') || typeof window.openMenu === 'function') return;
    var lade = maakLade();
    var mtx = matrix(lade);
    var fm = merkteken(lade);

    function open() {
      lade.classList.add('open');
      document.body.classList.add('nav-open');
      mtx.start(); fm.open();
    }
    function dicht() {
      lade.classList.remove('open');
      document.body.classList.remove('nav-open');
      mtx.stop(); fm.dicht();
    }

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
