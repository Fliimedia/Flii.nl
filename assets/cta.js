/* CTA card — single source for every page carrying <div id="cta-mount">. */
(function () {
  var HTML = "<section class=\"cta-section\" id=\"contact\">\n  <div class=\"cta-card-wrap\">\n    <video class=\"cta-bg-video\" autoplay muted loop playsinline preload=\"auto\"\n      src=\"https://fliimedia.github.io/Flii.nl/assets/eklipse-montage.mp4\"></video>\n    <div class=\"cta-video-overlay\"></div>\n    <div class=\"cta-inner\">\n      <h2>Let's ignite<br>ambitions</h2>\n      <a href=\"https://calendly.com/flii-media\" target=\"_blank\" class=\"cta-btn\">\n        Plan een gesprek\n        <span class=\"cta-btn-arrow\">\n          <svg viewBox=\"0 0 8 8\" width=\"14\" height=\"14\"><path d=\"M1 4h6M4 1l3 3-3 3\" stroke=\"#0F0E0C\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg>\n        </span>\n      </a>\n    </div>\n  </div>\n</section>";
  function mount() {
    var slot = document.getElementById('cta-mount');
    if (!slot || slot.dataset.filled === '1') return;
    slot.outerHTML = HTML;
    var vid = document.querySelector('.cta-bg-video');
    if (vid && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { var p = vid.play(); if (p && p.catch) p.catch(function(){}); }
          else vid.pause();
        });
      }, { threshold: 0.2 }).observe(vid);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else { mount(); }
})();
