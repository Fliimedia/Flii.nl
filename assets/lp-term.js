/* Kaart op landingspagina's. De kaart van Google wordt pas ingeladen nadat de
   bezoeker erop klikt, zodat er niets van derden wordt opgehaald zonder dat
   daar om gevraagd is. */
(function () {
  function laadKaart(vlak) {
    var adres = vlak.getAttribute('data-adres');
    if (!adres) return;
    var frame = document.createElement('iframe');
    frame.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(adres) + '&z=15&output=embed';
    frame.title = 'Kaart met de locatie van Flii Media, ' + adres;
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.setAttribute('allowfullscreen', '');
    vlak.replaceWith(frame);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var vlakken = document.querySelectorAll('.lt-kaart-vlak');
    for (var i = 0; i < vlakken.length; i++) {
      vlakken[i].addEventListener('click', function () {
        laadKaart(this);
      });
    }
  });
})();
