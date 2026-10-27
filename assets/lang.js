/* Taalkeuze: Nederlands (standaard) of Engels.
   Staat op twee plekken: onderaan in de menulade (NL · EN) en onderaan in de
   zwevende contactbalk rechts (vlag met uitklapper naar links).
   Engelse pagina's staan onder /en/. Wisselen houdt je op dezelfde pagina en
   op dezelfde plek; heeft een pagina (nog) geen versie in de andere taal, dan
   blijf je staan en wordt alleen de keuze bewaard. */
(function () {
  var PAREN = [
    ['/', '/en/'],
    ['/diensten', '/en/services'],
    ['/contact', '/en/contact'],
    ['/cases', '/en/cases'],
    ['/insight', '/en/insight'],
    ['/kennisbank', '/en/knowledge-base'],
    ['/platformen', '/en/platforms'],
    ['/cookies', '/en/cookies'],
    ['/privacy', '/en/privacy'],
    ['/voorwaarden', '/en/terms'],
    ['/voorkeuren', '/en/cookie-preferences'],
    ['/404', '/en/404'],
    ['/loop', '/en/loop'],
    ['/platform-app-development', '/en/platform-app-development'],
    ['/google-ads-bureau', '/en/google-ads-agency'],
    ['/online-marketing-bureau-amstelveen', '/en/digital-marketing-agency-amsterdam'],
    ['/seo-bureau-amstelveen', '/en/seo-agency-amsterdam'],
    ['/social-media-uitbesteden', '/en/social-media-management'],
    ['/videoproductie', '/en/video-production'],
    ['/website-laten-maken', '/en/website-development'],
    ['/cases/ae-trading', '/en/cases/ae-trading'],
    ['/cases/bikefair', '/en/cases/bikefair'],
    ['/cases/de-buurt/week-tegen-eenzaamheid', '/en/cases/de-buurt/week-against-loneliness'],
    ['/cases/de-nieuwe-yogaschool', '/en/cases/de-nieuwe-yogaschool'],
    ['/cases/digitaal-ondernemersplein', '/en/cases/digitaal-ondernemersplein'],
    ['/cases/digitale-strategie-voor-zzpers', '/en/cases/digital-strategy-for-freelancers'],
    ['/cases/padel2025', '/en/cases/padel2025'],
    ['/cases/plant-e', '/en/cases/plant-e'],
    ['/cases/relax', '/en/cases/relax'],
    ['/cases/ronreizen', '/en/cases/ronreizen'],
    ['/cases/royal-haskoning', '/en/cases/royal-haskoning'],
    ['/cases/soest-machinery', '/en/cases/soest-machinery'],
    ['/cases/stichting-de-buurt', '/en/cases/stichting-de-buurt'],
    ['/cases/theaterthuis', '/en/cases/theaterthuis'],
    ['/cases/zelfstandigen-bouw', '/en/cases/zelfstandigen-bouw'],
    ['/diensten/ai-launchplan', '/en/services/product-launch-plan'],
    ['/diensten/campagnes-media', '/en/services/campaigns-media'],
    ['/diensten/content-social', '/en/services/content-social'],
    ['/diensten/data-analyse-research', '/en/services/data-research'],
    ['/diensten/web-apps-ai', '/en/services/web-apps-ai'],
    ['/diensten/analyse-optimalisatie', '/en/services/analysis-optimisation'],
    ['/diensten/analyse-optimalisatie/a-b-testing', '/en/services/analysis-optimisation/a-b-testing'],
    ['/diensten/analyse-optimalisatie/cro', '/en/services/analysis-optimisation/cro'],
    ['/diensten/analyse-optimalisatie/data-analyse', '/en/services/analysis-optimisation/data-analysis'],
    ['/diensten/attributie', '/en/services/attribution'],
    ['/diensten/attributie/modellering', '/en/services/attribution/modelling'],
    ['/diensten/attributie/tracking-setup', '/en/services/attribution/tracking-setup'],
    ['/diensten/attributie/utm-structuur', '/en/services/attribution/utm-structure'],
    ['/diensten/campagne', '/en/services/campaigns'],
    ['/diensten/campagne/creatie', '/en/services/campaigns/creative'],
    ['/diensten/campagne/media', '/en/services/campaigns/media'],
    ['/diensten/campagne/optimalisatie', '/en/services/campaigns/optimisation'],
    ['/diensten/campagne/strategie', '/en/services/campaigns/strategy'],
    ['/diensten/custom-code', '/en/services/custom-code'],
    ['/diensten/custom-code/api', '/en/services/custom-code/api'],
    ['/diensten/custom-code/backend', '/en/services/custom-code/backend'],
    ['/diensten/custom-code/frontend', '/en/services/custom-code/frontend'],
    ['/diensten/custom-code/integraties', '/en/services/custom-code/integrations'],
    ['/diensten/dashboards', '/en/services/dashboards'],
    ['/diensten/dashboards/custom-dashboards', '/en/services/dashboards/custom-dashboards'],
    ['/diensten/dashboards/ga4', '/en/services/dashboards/ga4'],
    ['/diensten/dashboards/looker-studio', '/en/services/dashboards/looker-studio'],
    ['/diensten/design', '/en/services/design'],
    ['/diensten/design/designsysteem', '/en/services/design/design-system'],
    ['/diensten/design/prototyping', '/en/services/design/prototyping'],
    ['/diensten/design/ui-design', '/en/services/design/ui-design'],
    ['/diensten/design/ux-design', '/en/services/design/ux-design'],
    ['/diensten/influencers', '/en/services/influencers'],
    ['/diensten/influencers/briefing', '/en/services/influencers/briefing'],
    ['/diensten/influencers/campagne', '/en/services/influencers/campaigns'],
    ['/diensten/influencers/rapportage', '/en/services/influencers/reporting'],
    ['/diensten/influencers/scouting', '/en/services/influencers/scouting'],
    ['/diensten/no-code', '/en/services/no-code'],
    ['/diensten/no-code/framer', '/en/services/no-code/framer'],
    ['/diensten/no-code/shopify', '/en/services/no-code/shopify'],
    ['/diensten/no-code/webflow', '/en/services/no-code/webflow'],
    ['/diensten/no-code/wordpress', '/en/services/no-code/wordpress'],
    ['/diensten/programmatic', '/en/services/programmatic'],
    ['/diensten/programmatic/display', '/en/services/programmatic/display'],
    ['/diensten/programmatic/dsp-inkoop', '/en/services/programmatic/dsp-buying'],
    ['/diensten/programmatic/native', '/en/services/programmatic/native'],
    ['/diensten/programmatic/retargeting', '/en/services/programmatic/retargeting'],
    ['/diensten/research', '/en/services/research'],
    ['/diensten/research/concurrentie', '/en/services/research/competitor-research'],
    ['/diensten/research/doelgroepanalyse', '/en/services/research/audience-analysis'],
    ['/diensten/research/marktonderzoek', '/en/services/research/market-research'],
    ['/diensten/research/trends', '/en/services/research/trends'],
    ['/diensten/social-content', '/en/services/social-content'],
    ['/diensten/social-content/carrousels', '/en/services/social-content/carousels'],
    ['/diensten/social-content/reels', '/en/services/social-content/reels'],
    ['/diensten/social-content/stories', '/en/services/social-content/stories'],
    ['/diensten/social-content/ugc', '/en/services/social-content/ugc'],
    ['/diensten/social-media', '/en/services/social-media'],
    ['/diensten/social-media/linkedin', '/en/services/social-media/linkedin'],
    ['/diensten/social-media/meta', '/en/services/social-media/meta'],
    ['/diensten/social-media/pinterest', '/en/services/social-media/pinterest'],
    ['/diensten/social-media/tiktok', '/en/services/social-media/tiktok'],
    ['/diensten/tracking', '/en/services/tracking'],
    ['/diensten/tracking/ga4', '/en/services/tracking/ga4'],
    ['/diensten/tracking/gtm', '/en/services/tracking/gtm'],
    ['/diensten/tracking/pixel-setup', '/en/services/tracking/pixel-setup'],
    ['/diensten/tracking/server-side', '/en/services/tracking/server-side'],
    ['/diensten/video', '/en/services/video'],
    ['/diensten/video/concept', '/en/services/video/concept'],
    ['/diensten/video/montage', '/en/services/video/editing'],
    ['/diensten/video/productie', '/en/services/video/production'],
    ['/diensten/video/social-video', '/en/services/video/social-video'],
    ['/diensten/zoekmachines', '/en/services/search'],
    ['/diensten/zoekmachines/ai-search', '/en/services/search/ai-search'],
    ['/diensten/zoekmachines/linkbuilding', '/en/services/search/link-building'],
    ['/diensten/zoekmachines/sea', '/en/services/search/sea'],
    ['/diensten/zoekmachines/seo', '/en/services/search/seo'],
    ['/insight/ai-architectuur-voor-ieder-bedrijf-nodig', '/en/insight/ai-architecture-for-every-business'],
    ['/insight/ai-nieuwscrawlers-en-je-merk', '/en/insight/ai-news-crawlers-and-your-brand'],
    ['/insight/ai-video-in-drie-fasen-personage-beeld-beweging', '/en/insight/ai-video-in-three-stages'],
    ['/insight/black-friday-checklist-campagnes', '/en/insight/black-friday-campaign-checklist'],
    ['/insight/branding-versus-performance-marketing', '/en/insight/branding-vs-performance-marketing'],
    ['/insight/connected-tv-toekomst-televisie-reclame', '/en/insight/connected-tv-future-of-tv-advertising'],
    ['/insight/founder-as-a-brand', '/en/insight/founder-as-a-brand'],
    ['/insight/generative-engine-optimization-geo-vs-seo', '/en/insight/generative-engine-optimisation-geo-vs-seo'],
    ['/insight/google-io-2026-wat-marketeers-moeten-weten', '/en/insight/google-io-2026-what-marketers-need-to-know'],
    ['/insight/linkedin-of-meta-b2b', '/en/insight/linkedin-or-meta-for-b2b'],
    ['/insight/mediabudget-optimaal-verdelen', '/en/insight/allocating-your-media-budget'],
    ['/insight/moderne-mediacampagnes-best-practices-2026', '/en/insight/modern-media-campaigns-best-practices-2026'],
    ['/insight/ontwikkeling-van-klantloyaliteit', '/en/insight/customer-loyalty'],
    ['/insight/server-side-tracking', '/en/insight/server-side-tracking'],
    ['/insight/social-media-onderzoek-2026-newcom', '/en/insight/social-media-research-2026-newcom'],
    ['/insight/virtuele-merkambassadeurs-ai-influencers', '/en/insight/virtual-brand-ambassadors-ai-influencers'],
    ['/kennisbank/accessibility', '/en/knowledge-base/accessibility'],
    ['/kennisbank/affiliate-marketing', '/en/knowledge-base/affiliate-marketing'],
    ['/kennisbank/attributie', '/en/knowledge-base/attribution'],
    ['/kennisbank/avg-gdpr', '/en/knowledge-base/avg-gdpr'],
    ['/kennisbank/b2c-marketing', '/en/knowledge-base/b2c-marketing'],
    ['/kennisbank/benchmark', '/en/knowledge-base/benchmark'],
    ['/kennisbank/brand-experience', '/en/knowledge-base/brand-experience'],
    ['/kennisbank/budgettering', '/en/knowledge-base/budgeting'],
    ['/kennisbank/contentstrategie', '/en/knowledge-base/content-strategy'],
    ['/kennisbank/conversie', '/en/knowledge-base/conversion'],
    ['/kennisbank/copyright', '/en/knowledge-base/copyright'],
    ['/kennisbank/cpc', '/en/knowledge-base/cpc'],
    ['/kennisbank/cpl', '/en/knowledge-base/cpl'],
    ['/kennisbank/crm', '/en/knowledge-base/crm'],
    ['/kennisbank/ctr', '/en/knowledge-base/ctr'],
    ['/kennisbank/digitale-media', '/en/knowledge-base/digital-media'],
    ['/kennisbank/display-advertising', '/en/knowledge-base/display-advertising'],
    ['/kennisbank/doelgroep', '/en/knowledge-base/target-audience'],
    ['/kennisbank/e-commerce', '/en/knowledge-base/e-commerce'],
    ['/kennisbank/email-marketing', '/en/knowledge-base/email-marketing'],
    ['/kennisbank/employer-branding', '/en/knowledge-base/employer-branding'],
    ['/kennisbank/first-party-data', '/en/knowledge-base/first-party-data'],
    ['/kennisbank/funnel', '/en/knowledge-base/funnel'],
    ['/kennisbank/gdpr', '/en/knowledge-base/gdpr'],
    ['/kennisbank/governance', '/en/knowledge-base/governance'],
    ['/kennisbank/kpi', '/en/knowledge-base/kpi'],
    ['/kennisbank/lookalike', '/en/knowledge-base/lookalike-audiences'],
    ['/kennisbank/merkidentiteit', '/en/knowledge-base/brand-identity'],
    ['/kennisbank/mobile-marketing', '/en/knowledge-base/mobile-marketing'],
    ['/kennisbank/positionering', '/en/knowledge-base/positioning'],
    ['/kennisbank/privacy-consent', '/en/knowledge-base/privacy-consent'],
    ['/kennisbank/projectmanagement', '/en/knowledge-base/project-management'],
    ['/kennisbank/retail-media', '/en/knowledge-base/retail-media'],
    ['/kennisbank/retargeting', '/en/knowledge-base/retargeting'],
    ['/kennisbank/roas', '/en/knowledge-base/roas'],
    ['/kennisbank/roi', '/en/knowledge-base/roi'],
    ['/kennisbank/segmentatie', '/en/knowledge-base/segmentation'],
    ['/kennisbank/seo', '/en/knowledge-base/seo'],
    ['/kennisbank/swot', '/en/knowledge-base/swot-analysis'],
    ['/kennisbank/tone-of-voice', '/en/knowledge-base/tone-of-voice'],
    ['/kennisbank/ugc', '/en/knowledge-base/ugc'],
    ['/platformen/facebook', '/en/platforms/facebook'],
    ['/platformen/figma', '/en/platforms/figma'],
    ['/platformen/google-ads', '/en/platforms/google-ads'],
    ['/platformen/google-analytics', '/en/platforms/google-analytics'],
    ['/platformen/google-search', '/en/platforms/google-search'],
    ['/platformen/google-tag-manager', '/en/platforms/google-tag-manager'],
    ['/platformen/hubspot', '/en/platforms/hubspot'],
    ['/platformen/instagram', '/en/platforms/instagram'],
    ['/platformen/linkedin', '/en/platforms/linkedin'],
    ['/platformen/meta', '/en/platforms/meta'],
    ['/platformen/pinterest', '/en/platforms/pinterest'],
    ['/platformen/search-console', '/en/platforms/search-console'],
    ['/platformen/shopify', '/en/platforms/shopify'],
    ['/platformen/spotify', '/en/platforms/spotify'],
    ['/platformen/tiktok', '/en/platforms/tiktok'],
    ['/platformen/vimeo', '/en/platforms/vimeo'],
    ['/platformen/webflow', '/en/platforms/webflow'],
    ['/platformen/wordpress', '/en/platforms/wordpress'],
    ['/platformen/youtube', '/en/platforms/youtube'],
    ['/partners/digital-movements', '/en/partners/digital-movements'],
    ['/partners/fc-klap', '/en/partners/fc-klap'],
    ['/partners/tiny-wolf', '/en/partners/tiny-wolf'],
    ['/partners/webiz', '/en/partners/webiz']
  ];

  function schoon(p) {
    p = p.replace(/\.html$/, '').replace(/\/index$/, '/');
    if (p.length > 1 && p.charAt(p.length - 1) === '/') p = p.slice(0, -1);
    return p || '/';
  }

  var pad = schoon(location.pathname);
  var isEN = pad === '/en' || pad.indexOf('/en/') === 0;
  var paginaTaal = isEN ? 'en' : 'nl';
  var tegenhanger = null;            // pad van dezelfde pagina in de andere taal
  PAREN.forEach(function (paar) {
    if (schoon(paar[0]) === pad) tegenhanger = paar[1];
    if (schoon(paar[1]) === pad) tegenhanger = paar[0];
  });

  var SLEUTEL = 'flii-taal', PLEK = 'flii-taal-plek';
  function lees() { try { return localStorage.getItem(SLEUTEL); } catch (e) { return null; } }
  function bewaar(t) { try { localStorage.setItem(SLEUTEL, t); } catch (e) {} }
  var keuze = lees();

  /* Wie Engels koos en op een Nederlandse pagina met Engelse versie komt,
     gaat direct naar die versie. */
  if (!isEN && keuze === 'en' && tegenhanger) {
    location.replace(tegenhanger + location.search + location.hash);
    return;
  }
  var huidig = isEN || keuze === 'en' ? 'en' : 'nl';

  /* ---------- Plek op de pagina onthouden en terugzetten ---------- */
  function overslaan(el) {
    return el.closest('#nav-menu,#float-sidebar,#contact-popup,.nav,nav,script,style');
  }
  function plekNu() {
    var beste = null, top = -Infinity;
    [].forEach.call(document.querySelectorAll('body [id]'), function (el) {
      if (overslaan(el) || !el.offsetHeight) return;
      var r = el.getBoundingClientRect();
      if (r.top <= 1 && r.bottom > 0 && r.top > top) { top = r.top; beste = el; }
    });
    var max = document.documentElement.scrollHeight - innerHeight;
    return {
      id: beste ? beste.id : null,
      in: beste ? -beste.getBoundingClientRect().top : 0,
      deel: max > 0 ? scrollY / max : 0
    };
  }
  function zetPlek(p) {
    var el = p.id && document.getElementById(p.id);
    if (el) {
      scrollTo(0, el.getBoundingClientRect().top + scrollY + p.in);
    } else {
      scrollTo(0, p.deel * (document.documentElement.scrollHeight - innerHeight));
    }
  }
  (function herstel() {
    var p;
    try { p = JSON.parse(sessionStorage.getItem(PLEK) || 'null'); } catch (e) { p = null; }
    if (!p || p.pad !== pad) return;
    try { sessionStorage.removeItem(PLEK); } catch (e) {}
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    function doe() { zetPlek(p); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', doe); else doe();
    addEventListener('load', function () { doe(); setTimeout(doe, 300); });
  })();

  function wissel(t) {
    bewaar(t);
    if (t === paginaTaal || !tegenhanger) {
      // Geen andere versie (of al in die taal): op de pagina blijven.
      huidig = t;
      ververs();
      return;
    }
    var p = plekNu();
    p.pad = schoon(tegenhanger);
    try { sessionStorage.setItem(PLEK, JSON.stringify(p)); } catch (e) {}
    location.href = tegenhanger + location.search;
  }
  function hrefVoor(t) {
    return t === paginaTaal || !tegenhanger ? location.pathname : tegenhanger;
  }

  /* ---------- Vlaggen ---------- */
  var n = 0;
  function vlag(t) {
    if (t === 'nl') {
      return '<svg viewBox="0 0 30 30" aria-hidden="true"><rect width="30" height="10" fill="#AE1C28"/>' +
        '<rect y="10" width="30" height="10" fill="#fff"/><rect y="20" width="30" height="10" fill="#21468B"/></svg>';
    }
    var id = 'lang-uk-' + (++n);
    return '<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<clipPath id="' + id + '"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath>' +
      '<rect width="60" height="30" fill="#012169"/>' +
      '<path d="M0,0L60,30M60,0L0,30" stroke="#fff" stroke-width="6"/>' +
      '<path d="M0,0L60,30M60,0L0,30" clip-path="url(#' + id + ')" stroke="#C8102E" stroke-width="4"/>' +
      '<path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/>' +
      '<path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg>';
  }

  function css() {
    if (document.getElementById('lang-css')) return;
    var s = document.createElement('style');
    s.id = 'lang-css';
    s.textContent =
      '.nav-menu-footer .lang-wissel{white-space:nowrap}' +
      '.nav-menu-footer .lang-wissel a[aria-current]{color:#0F0E0C;font-weight:700}' +
      /* De balk mag de uitklapper niet afsnijden; de hoeken blijven rond. */
      '.float-sidebar{overflow:visible}' +
      '.float-sidebar>.float-icon:first-child{border-radius:11px 11px 0 0}' +
      '.float-sidebar>.float-icon:last-child{border-radius:0 0 11px 11px}' +
      '.lang-float{position:relative}' +
      '.lang-vlag{width:20px;height:20px;border-radius:50%;overflow:hidden;display:block;flex-shrink:0;' +
        'box-shadow:inset 0 0 0 1px rgba(0,0,0,.1);pointer-events:none}' +
      '.lang-vlag svg{width:100%;height:100%;display:block}' +
      '.lang-fold{position:absolute;right:100%;top:50%;padding-right:8px;' +
        'transform:translate(6px,-50%);opacity:0;visibility:hidden;' +
        'transition:opacity .15s,transform .15s,visibility .15s}' +
      '.lang-float.open .lang-fold{opacity:1;visibility:visible;transform:translate(0,-50%)}' +
      '@media (hover:hover){.lang-float:hover .lang-fold,.lang-float:focus-within .lang-fold{' +
        'opacity:1;visibility:visible;transform:translate(0,-50%)}}' +
      '.lang-fold-in{display:flex;gap:4px;padding:5px;background:#fff;border:1px solid #E2DFD9;border-radius:100px;' +
        'box-shadow:0 4px 18px rgba(15,14,12,.1)}' +
      '.lang-fold a{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;' +
        'transition:background .15s}' +
      '.lang-fold a:hover,.lang-fold a:focus-visible{background:#F5F4F1}' +
      '.lang-fold a .lang-vlag{width:22px;height:22px}' +
      '.lang-fold a[aria-current]{box-shadow:inset 0 0 0 1.5px #0F0E0C}';
    document.head.appendChild(s);
  }

  var opties = [];   // alle taallinks, zodat ze samen bijgewerkt worden
  function koppel(a) {
    opties.push(a);
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var t = a.getAttribute('data-taal');
      var f = a.closest('.lang-float');
      if (f) f.classList.remove('open');
      wissel(t);
    });
  }
  function ververs() {
    opties.forEach(function (a) {
      var t = a.getAttribute('data-taal');
      if (t === huidig) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      a.setAttribute('href', hrefVoor(t));
    });
    var v = document.querySelector('.lang-float > .lang-vlag');
    if (v) v.innerHTML = vlag(huidig);
  }

  /* Onderaan in de menulade, naast e-mail en telefoon: NL · EN. */
  function bouwLade() {
    var voet = document.querySelector('.nav-menu-footer');
    if (!voet || voet.querySelector('.lang-wissel')) return;
    var w = document.createElement('span');
    w.className = 'lang-wissel';
    w.innerHTML =
      '<a hreflang="nl" lang="nl" data-taal="nl">NL</a> · <a hreflang="en" lang="en" data-taal="en">EN</a>';
    voet.appendChild(document.createTextNode(' · '));
    voet.appendChild(w);
    [].forEach.call(w.querySelectorAll('[data-taal]'), koppel);
  }

  /* Onderaan in de zwevende contactbalk: vlag van de huidige taal, met een
     uitklapper naar links (hover, of tik op een telefoon). */
  function bouwBalk() {
    var balk = document.getElementById('float-sidebar');
    if (!balk || balk.querySelector('.lang-float')) return;
    var f = document.createElement('div');
    f.className = 'float-icon lang-float';
    f.setAttribute('role', 'button');
    f.setAttribute('tabindex', '0');
    f.setAttribute('aria-haspopup', 'true');
    f.setAttribute('aria-expanded', 'false');
    f.setAttribute('aria-label', 'Taal / Language');
    f.innerHTML =
      '<span class="lang-vlag"></span>' +
      '<div class="lang-fold"><div class="lang-fold-in">' +
        '<a data-taal="nl" hreflang="nl" lang="nl" title="Nederlands" aria-label="Nederlands">' +
          '<span class="lang-vlag">' + vlag('nl') + '</span></a>' +
        '<a data-taal="en" hreflang="en" lang="en" title="English" aria-label="English">' +
          '<span class="lang-vlag">' + vlag('en') + '</span></a>' +
      '</div></div>';
    balk.appendChild(f);
    [].forEach.call(f.querySelectorAll('[data-taal]'), koppel);
    function zet(open) {
      f.classList.toggle('open', open);
      f.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    f.addEventListener('click', function (e) {
      if (e.target.closest('.lang-fold')) return;
      zet(!f.classList.contains('open'));
    });
    f.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === f) { e.preventDefault(); zet(!f.classList.contains('open')); }
      if (e.key === 'Escape') zet(false);
    });
    document.addEventListener('click', function (e) { if (!f.contains(e.target)) zet(false); });
  }

  css();
  /* nav.js bouwt de lade en contact-bar.js de balk bij DOMContentLoaded;
     daarna pas toevoegen. */
  function straks() { setTimeout(function () { bouwLade(); bouwBalk(); ververs(); }, 0); }
  if (document.readyState === 'loading' || document.readyState === 'interactive') {
    document.addEventListener('DOMContentLoaded', straks);
  }
  if (document.readyState !== 'loading') straks();
})();
