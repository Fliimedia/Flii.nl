/* Kaart op landingspagina's. De kaart van Google wordt pas ingeladen nadat de
   bezoeker erop klikt, zodat er niets van derden wordt opgehaald zonder dat
   daar om gevraagd is. */
(function () {
  function laadKaart(vlak) {
    var adres = vlak.getAttribute('data-adres');
    if (!adres) return;
    var frame = document.createElement('iframe');
    frame.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(adres) + '&z=15&output=embed';
    frame.title = (/^\/en(\/|$)/.test(location.pathname) ? 'Map showing the location of Flii Media, ' : 'Kaart met de locatie van Flii Media, ') + adres;
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.setAttribute('allowfullscreen', '');
    vlak.replaceWith(frame);
  }

  /* Korte berichtformulier: laadmoment vastleggen en de melding na
     terugkeer van de server tonen. */
  var EN = /^\/en(\/|$)/.test(location.pathname);
  var MELDINGEN = EN ? {
    ok: ['Thank you, your message has been sent. We usually reply within one working day.', 'ok'],
    onvolledig: ['Please enter a phone number or e-mail address, and a message.', 'fout'],
    teveel: ['You have just sent a message. Please try again in an hour.', 'fout'],
    verlopen: ['The form was open for too long. Please fill it in again.', 'fout'],
    mislukt: ['Sending failed. E-mail us directly at info@flii.nl.', 'fout'],
    fout: ['Something went wrong. E-mail us directly at info@flii.nl.', 'fout']
  } : {
    ok: ['Bedankt, je bericht is verstuurd. We reageren doorgaans binnen een werkdag.', 'ok'],
    onvolledig: ['Vul een telefoonnummer of e-mailadres in, en een bericht.', 'fout'],
    teveel: ['Je hebt net al een bericht gestuurd. Probeer het over een uur opnieuw.', 'fout'],
    verlopen: ['Het formulier stond te lang open. Vul het opnieuw in.', 'fout'],
    mislukt: ['Verzenden lukte niet. Mail ons rechtstreeks op info@flii.nl.', 'fout'],
    fout: ['Er ging iets mis. Mail ons rechtstreeks op info@flii.nl.', 'fout']
  };

  function formulier() {
    var nu = Math.floor(Date.now() / 1000);
    var stempels = document.querySelectorAll('[data-lt-stempel]');
    for (var i = 0; i < stempels.length; i++) stempels[i].value = nu;

    var vak = document.querySelector('[data-lt-status]');
    if (!vak) return;
    var m = location.search.match(/[?&]status=([a-z]+)/);
    if (!m) return;
    var t = MELDINGEN[m[1]];
    if (!t) return;
    vak.textContent = t[0];
    vak.classList.add(t[1]);
    var f = vak.closest ? vak.closest('form') : null;
    if (m[1] === 'ok' && f) {
      f.reset();
      var s = f.querySelector('[data-lt-stempel]');
      if (s) s.value = nu;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var vlakken = document.querySelectorAll('.lt-kaart-vlak');
    for (var i = 0; i < vlakken.length; i++) {
      vlakken[i].addEventListener('click', function () {
        laadKaart(this);
      });
    }
    formulier();
  });
})();
