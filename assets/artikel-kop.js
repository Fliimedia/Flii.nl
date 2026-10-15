/* Google-voorkeursbron: eigen knop die de officiële Google-flow opent.
   Zonder het Google-script werkt de knop als gewone link naar dezelfde pagina. */
(function () {
  (self.PREFERRED_SOURCE = self.PREFERRED_SOURCE || []).push(function (preferredSource) {
    preferredSource.init({ theme: 'light' });
    var knoppen = document.querySelectorAll('[data-voorkeursbron]');
    for (var i = 0; i < knoppen.length; i++) {
      knoppen[i].addEventListener('click', function (e) {
        e.preventDefault();
        preferredSource.addPreferredSource();
      });
    }
  });
})();
