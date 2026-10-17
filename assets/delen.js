/* Delen: de link naar het klembord. Instagram kent geen deel-adres, dus
   daar kopiëren we de link en openen we Instagram in een nieuw tabblad.

   Knoppen met data-instagram sturen de pagina als bericht: op een telefoon
   via het deelmenu van het toestel (daar staat Instagram Direct tussen),
   op een computer door de link te kopiëren en Instagram-berichten te openen. */
(function () {
  function kopieer(tekst) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(tekst).catch(function () { /* stil */ });
    }
    var hulp = document.createElement('textarea');
    hulp.value = tekst;
    hulp.setAttribute('readonly', '');
    hulp.style.position = 'fixed';
    hulp.style.left = '-9999px';
    document.body.appendChild(hulp);
    hulp.select();
    try { document.execCommand('copy'); } catch (e) { /* stil */ }
    document.body.removeChild(hulp);
    return Promise.resolve();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var knoppen = document.querySelectorAll('[data-kopieer]');
    for (var i = 0; i < knoppen.length; i++) {
      knoppen[i].addEventListener('click', function () {
        var knop = this;
        kopieer(knop.getAttribute('data-kopieer'));
        if (knop.tagName !== 'BUTTON') return;
        knop.classList.add('gekopieerd');
        setTimeout(function () { knop.classList.remove('gekopieerd'); }, 1800);
      });
    }

    var telefoon = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    var instagram = document.querySelectorAll('[data-instagram]');
    for (var j = 0; j < instagram.length; j++) {
      instagram[j].addEventListener('click', function (e) {
        var url = this.getAttribute('data-instagram');
        var titel = this.getAttribute('data-titel') || document.title;
        if (telefoon && navigator.share) {
          e.preventDefault();
          navigator.share({ title: titel, url: url }).catch(function () { /* geannuleerd */ });
          return;
        }
        kopieer(url);
      });
    }
  });
})();
