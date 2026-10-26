/* Zwevende contactbalk, chat en afsprakenplanner — gedeeld door de hele site.
   De homepage heeft de balk al in de HTML staan; chat en planner werken daar
   via dit bestand ook. */
(function () {
  /* Engelse pagina's staan onder /en/. */
  var EN = /^\/en(\/|$)/.test(location.pathname);
  function T(nl, en) { return EN ? en : nl; }

  /* ---------- Afsprakenplanner ----------
     Google Agenda-afsprakenplanning van info@flii.nl (wo, do, vr 09:00–12:00).
     Google kijkt live naar de vrije tijden in die agenda en zet de afspraak er
     direct in. Elke knop 'Plan een gesprek' op de site opent dit venster;
     zonder JavaScript opent de link de Google-pagina zelf. */
  var BOEK_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1Dfb1ZunCYFgPNrvuYKMIgVBy9Qgv9xlcxkSOnEbvnaWWSUeKQ_fTzv4gSHQfmkJm3LmL93Tk7?gv=true';

  /* ---------- Chat (Chatbase) ----------
     De wachtrij staat meteen klaar, zodat elke knop window.chatbase('open')
     kan aanroepen. Het script laadt zodra de browser even rustig is, of
     direct bij de eerste klik op een chatknop. */
  var CHAT_ID = 'xDWiHhLymvD2NuZKQ-bO_';
  window.chatbaseConfig = window.chatbaseConfig || { chatbotId: CHAT_ID, hideBubble: true };
  if (!window.chatbase || window.chatbase('getState') !== 'initialized') {
    window.chatbase = function () {
      if (!window.chatbase.q) window.chatbase.q = [];
      window.chatbase.q.push(arguments);
    };
    window.chatbase = new Proxy(window.chatbase, {
      get: function (target, prop) {
        if (prop === 'q') return target.q;
        return function () { return target.apply(null, [prop].concat([].slice.call(arguments))); };
      }
    });
  }
  var chatGeladen = false;
  function laadChat() {
    if (chatGeladen || document.getElementById(CHAT_ID)) return;
    chatGeladen = true;
    var s = document.createElement('script');
    s.src = 'https://www.chatbase.co/embed.min.js';
    s.id = CHAT_ID;
    s.domain = 'www.chatbase.co';
    document.body.appendChild(s);
  }
  // Klik op een chatknop: eerst laden (vangfase), daarna voert de knop zelf
  // window.chatbase('open') uit; die opdracht wacht in de rij tot het script er is.
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[onclick*="chatbase"],[data-chat]') : null;
    if (!t) return;
    laadChat();
    if (t.hasAttribute('data-chat')) window.chatbase('open');
  }, true);
  function laadLater() {
    (window.requestIdleCallback || function (cb) { return setTimeout(cb, 1500); })(laadChat, { timeout: 4000 });
  }
  if (document.readyState === 'complete') laadLater(); else window.addEventListener('load', laadLater);

  /* ---------- Plannervenster ---------- */
  var venster = null, vorigeFocus = null;
  function maakVenster() {
    var d = document.createElement('div');
    d.className = 'afspraak';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-labelledby', 'afspraak-titel');
    d.innerHTML =
      '<div class="afspraak-paneel">' +
        '<div class="afspraak-kop">' +
          '<span class="afspraak-titel" id="afspraak-titel">' + T('Plan een gesprek', 'Book a call') + '</span>' +
          '<button type="button" class="afspraak-dicht" aria-label="' + T('Sluiten', 'Close') + '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          '</button>' +
        '</div>' +
        '<iframe class="afspraak-frame" title="' + T('Plan een gesprek met Flii Media', 'Book a call with Flii Media') + '" loading="lazy"></iframe>' +
      '</div>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) { if (e.target === d) sluit(); });
    d.querySelector('.afspraak-dicht').addEventListener('click', sluit);
    return d;
  }
  function open() {
    if (!venster) venster = maakVenster();
    var frame = venster.querySelector('.afspraak-frame');
    if (!frame.getAttribute('src')) frame.setAttribute('src', BOEK_URL);
    vorigeFocus = document.activeElement;
    venster.classList.add('open');
    document.documentElement.classList.add('afspraak-open');
    venster.querySelector('.afspraak-dicht').focus();
  }
  function sluit() {
    if (!venster) return;
    venster.classList.remove('open');
    document.documentElement.classList.remove('afspraak-open');
    if (vorigeFocus && vorigeFocus.focus) vorigeFocus.focus();
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && venster && venster.classList.contains('open')) sluit();
  });
  document.addEventListener('click', function (e) {
    if (!BOEK_URL) return;
    var t = e.target && e.target.closest ? e.target.closest('[data-afspraak],a[href*="calendar/appointments/schedules/"],a[href*="calendly.com"]') : null;
    if (!t) return;
    e.preventDefault();
    open();
  });
  window.openAfspraak = function () { if (BOEK_URL) open(); };

  /* ---------- Balk ---------- */
  if (document.getElementById('float-sidebar')) return;   // pagina heeft hem al
  function bouw() {
    if (document.getElementById('float-sidebar')) return;
    var el = document.createElement('div');
    el.className = 'float-sidebar';
    el.id = 'float-sidebar';
    el.innerHTML =
      '<a href="mailto:info@flii.nl" class="float-icon" title="E-mail" aria-label="E-mail info@flii.nl">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/></svg>' +
      '</a>' +
      '<a href="tel:+31640881169" class="float-icon" title="' + T('Bel ons', 'Call us') + '" aria-label="' + T('Bel', 'Call') + ' +31 6 40 88 11 69">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.72 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.62 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.59a16 16 0 006.29 6.29l.96-.96a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>' +
      '</a>' +
      '<a href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1Dfb1ZunCYFgPNrvuYKMIgVBy9Qgv9xlcxkSOnEbvnaWWSUeKQ_fTzv4gSHQfmkJm3LmL93Tk7" target="_blank" rel="noopener" class="float-icon" data-afspraak title="' + T('Plan een gesprek', 'Book a call') + '" aria-label="' + T('Plan een gesprek', 'Book a call') + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
      '</a>' +
      '<button type="button" class="float-icon" data-chat title="Chat" aria-label="' + T('Open de chat', 'Open the chat') + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>' +
      '</button>';
    document.body.appendChild(el);
    function check() {
      el.classList.toggle('visible', window.scrollY > window.innerHeight * 0.3);
    }
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.highlightSidebar = function () {
      el.classList.add('visible');
      el.classList.remove('highlight');
      void el.offsetWidth;
      el.classList.add('highlight');
      setTimeout(function () { el.classList.remove('highlight'); }, 700);
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bouw);
  else bouw();
})();
