/* CTA-kaart — één bron voor elke pagina met <div id="cta-mount">. */
(function () {
  var BRON = "https://fliimedia.github.io/Flii.nl/assets/eklipse-montage.mp4";
  var HTML =
    '<section class="cta-section" id="contact">' +
    '  <div class="cta-card-wrap">' +
    '    <video class="cta-bg-video" muted loop playsinline preload="none" aria-hidden="true"></video>' +
    '    <div class="cta-video-overlay"></div>' +
    '    <div class="cta-inner">' +
    '      <button type="button" class="cta-h" aria-pressed="false">' +
    "Let's ignite<br>ambitions</button>" +
    '      <a href="https://calendly.com/flii-media" target="_blank" rel="noopener" class="cta-btn">' +
    '        Plan een gesprek' +
    '        <span class="cta-btn-arrow">' +
    '<svg viewBox="0 0 8 8" width="14" height="14" aria-hidden="true">' +
    '<path d="M1 4h6M4 1l3 3-3 3" stroke-width="1.5" stroke-linecap="round" ' +
    'stroke-linejoin="round" fill="none"/></svg>' +
    '        </span>' +
    '      </a>' +
    '    </div>' +
    '  </div>' +
    '</section>';

  function mount() {
    var slot = document.getElementById('cta-mount');
    if (!slot || slot.dataset.filled === '1') return;
    slot.outerHTML = HTML;

    var wrap = document.querySelector('.cta-card-wrap');
    var vid = wrap && wrap.querySelector('.cta-bg-video');
    var kop = wrap && wrap.querySelector('.cta-h');
    if (!wrap || !vid || !kop) return;

    var aan = false;
    kop.addEventListener('click', function () {
      aan = !aan;
      kop.setAttribute('aria-pressed', aan ? 'true' : 'false');
      if (aan) {
        /* Bron pas ophalen bij de eerste klik; scheelt enkele MB per bezoek. */
        if (!vid.getAttribute('src')) { vid.setAttribute('src', BRON); vid.load(); }
        wrap.classList.add('speelt');
        var p = vid.play(); if (p && p.catch) p.catch(function () {});
      } else {
        wrap.classList.remove('speelt');
        vid.pause();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else { mount(); }
})();
