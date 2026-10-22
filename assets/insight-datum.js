/* Insight-artikelen met een publicatiedatum in de toekomst blijven verborgen.
   Kaartjes dragen data-pub="JJJJ-MM-DD"; een artikelpagina draagt dezelfde
   waarde op <html>. Zodra de dag aanbreekt verschijnt het artikel vanzelf. */
(function () {
  var d = new Date();
  var vandaag = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  var root = document.documentElement;
  var eigen = root.getAttribute('data-pub');
  if (eigen && eigen > vandaag) { location.replace('/insight'); return; }

  var st = document.createElement('style');
  st.textContent = '[data-pub][hidden]{display:none !important}';
  document.head.appendChild(st);

  function verberg() {
    var kaarten = document.querySelectorAll('[data-pub]');
    var zichtbaar = 0, totaal = 0;
    for (var i = 0; i < kaarten.length; i++) {
      var k = kaarten[i];
      if (k === root) continue;
      totaal++;
      if (k.getAttribute('data-pub') > vandaag) k.hidden = true; else zichtbaar++;
    }
    var woorden = ['nul','een','twee','drie','vier','vijf','zes','zeven','acht','negen','tien','elf','twaalf','dertien','veertien','vijftien','zestien','zeventien','achttien','negentien','twintig'];
    var tel = document.querySelector('[data-aantal]');
    if (tel && totaal) tel.textContent = zichtbaar < woorden.length ? woorden[zichtbaar].charAt(0).toUpperCase() + woorden[zichtbaar].slice(1) : String(zichtbaar);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', verberg); else verberg();
})();
