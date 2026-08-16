/* Gedeelde footer: contactknop opent de popup, overal op de site. */
(function () {
  function popup() { return document.getElementById('contact-popup'); }
  window.toggleContactPopup = function () {
    var p = popup();
    if (!p) return;
    var open = p.classList.toggle('open');
    var b = document.getElementById('footer-contact-btn');
    if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
    // Op pagina's met de zwevende contactbalk lichten we die ook op.
    var sb = document.getElementById('float-sidebar');
    if (open && sb) {
      sb.classList.add('visible');
      sb.classList.remove('highlight');
      void sb.offsetWidth;
      sb.classList.add('highlight');
      setTimeout(function () { sb.classList.remove('highlight'); }, 950);
    }
  };
  document.addEventListener('click', function (e) {
    var p = popup(), b = document.getElementById('footer-contact-btn');
    if (p && b && !p.contains(e.target) && !b.contains(e.target)) p.classList.remove('open');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { var p = popup(); if (p) p.classList.remove('open'); }
  });
})();
