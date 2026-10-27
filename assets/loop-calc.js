/* Flii Loop prijscalculator: één bestand voor flii.nl/loop en flii.nl/en/loop.
   Alle bedragen volgen uit uren x uurtarief. Pas tarieven en uren alleen hier aan.

   Opbouw per Loop-fase:
   - Start (eenmalig): basis per type + onderzoek per kanaal/functie.
   - Build (eenmalig): basis per type + opzet per kanaal (kanaal + platforms, met
     schaalvoordeel) + eenmalige diensten (productie, ontwerp, integraties).
   - Run (per maand, minimaal 3 maanden): basis per type + beheer per kanaal (met
     schaalvoordeel) + terugkerende diensten.
   Kies je twee types, dan telt het tweede basisbedrag voor de helft (gedeelde
   strategie en coördinatie). Productie krijgt geen schaalvoordeel. */
(function () {
  'use strict';

  var TARIEF = 75;            // euro per uur, excl. btw
  var MIN_RUN = 3;            // maanden
  var TWEEDE_BASIS = 0.5;     // factor voor het tweede type
  var ONDERZOEK = 2;          // uur onderzoek per kanaal of AI-functie in Start
  // Schaalvoordeel op kanaalopzet en -beheer: 1e kanaal vol, 2e-3e -10%, vanaf 4e -20%.
  var STAFFEL = [1, 0.9, 0.9, 0.8];

  // Uren per type: [start, build, run per maand]
  var BASIS = { campagne: [16, 12, 4], ai: [24, 32, 4] };

  // Kanalen: coördinatie [build, run] + platforms [build, run] + diensten.
  var KANALEN = [
    { k: 'search', h: [4, 2], subs: { searchEngines: [4, 4], aiSearch: [4, 3], socialSearch: [3, 2], appStore: [4, 2] },
      dels: ['seoContent', 'seoTech', 'sea', 'linkbuilding'] },
    { k: 'social', h: [4, 2], subs: { meta: [4, 4], tiktok: [4, 4], linkedin: [4, 3], pinterest: [3, 2], otherSocial: [3, 2] },
      dels: ['socialContent', 'community', 'paidSocial'] },
    { k: 'display', h: [3, 2], subs: { programmatic: [5, 4], gdn: [3, 3], native: [4, 3], retargeting: [3, 2] },
      dels: ['bannerCreatie', 'programmaticBuy', 'retargetingSetup'] },
    { k: 'videotv', h: [4, 2], subs: { onlineVideo: [4, 3], ctv: [6, 4], linearTv: [12, 6] },
      dels: ['videoProductie', 'tvCommercial', 'videoMontage', 'videoBuy'] },
    { k: 'audio', h: [3, 2], subs: { radio: [8, 4], streamingAudio: [4, 3], podcasts: [4, 3] },
      dels: ['spotProductie', 'audioSpot', 'podcastProductie', 'audioBuy'] },
    { k: 'email', h: [3, 2], subs: { newsletters: [4, 4], automation: [6, 2], loyalty: [4, 2] },
      dels: ['templateDesign', 'emailFlows', 'crmSetup'] },
    { k: 'messaging', h: [3, 1], subs: { whatsapp: [5, 3], sms: [3, 2], push: [3, 2] },
      dels: ['flowSetup', 'msgCopy', 'msgIntegratie'] },
    { k: 'ooh', h: [3, 1], subs: { billboards: [5, 2], dooh: [5, 2], transit: [4, 2], retail: [4, 2] },
      dels: ['oohOntwerp', 'oohBuy', 'oohProductie'] },
    { k: 'print', h: [2, 1], subs: { stationery: [2, 0], flyers: [2, 1], directMail: [4, 2], merch: [3, 1] },
      dels: ['printOntwerp', 'drukwerk', 'printDistributie'] },
    { k: 'pr', h: [4, 3], subs: { earned: [6, 6], affiliate: [4, 3], sponsoring: [6, 3] },
      dels: ['persstrategie', 'influencerMgmt', 'affiliateSetup'] }
  ];

  // Diensten: [build-uren, run-uren per maand]
  var DIENST = {
    seoContent: [0, 8], seoTech: [16, 3], sea: [6, 6], linkbuilding: [0, 5],
    socialContent: [0, 12], community: [0, 6], paidSocial: [6, 6],
    bannerCreatie: [10, 0], programmaticBuy: [4, 6], retargetingSetup: [6, 2],
    videoProductie: [32, 0], tvCommercial: [120, 0], videoMontage: [12, 0], videoBuy: [4, 6],
    spotProductie: [32, 0], audioSpot: [12, 0], podcastProductie: [20, 0], audioBuy: [4, 4],
    templateDesign: [12, 0], emailFlows: [20, 2], crmSetup: [24, 2],
    flowSetup: [12, 1], msgCopy: [0, 4], msgIntegratie: [16, 0],
    oohOntwerp: [12, 0], oohBuy: [6, 3], oohProductie: [8, 0],
    printOntwerp: [10, 0], drukwerk: [4, 0], printDistributie: [4, 0],
    persstrategie: [12, 8], influencerMgmt: [8, 10], affiliateSetup: [16, 4]
  };
  var AI = { chatbot: [48, 4], contentgen: [32, 3], automatisering: [40, 2], dataAnalyse: [36, 4], aiIntegratie: [30, 2], customModel: [120, 10] };

  var LBL = {"nl": {"cats": {"search": "Search", "social": "Social", "display": "Display", "videotv": "Video & TV", "audio": "Audio", "email": "E-mail & CRM", "messaging": "Messaging", "ooh": "Out-of-home", "print": "Print", "pr": "PR & partnerships"}, "catDesc": {"search": "Gevonden worden bij een zoekintentie, in zoekmachines en AI.", "social": "Organisch en betaald op de platforms waar je doelgroep is.", "display": "Banners en native advertenties op het hele web.", "videotv": "Video-advertenties op YouTube, streaming en tv.", "audio": "Radio, Spotify en podcasts.", "email": "E-mail, automation en CRM.", "messaging": "WhatsApp, sms en push-notificaties.", "ooh": "Buitenreclame, digitaal en klassiek.", "print": "Print, flyers en direct mail.", "pr": "PR, influencers en affiliates."}, "subs": {"searchEngines": "Zoekmachines (Google, Bing)", "aiSearch": "AI-search / LLM's", "socialSearch": "Social search", "appStore": "App store (ASO)", "meta": "Meta (Facebook, Instagram)", "tiktok": "TikTok", "linkedin": "LinkedIn", "pinterest": "Pinterest", "otherSocial": "X, Snapchat, Reddit", "programmatic": "Programmatic display", "gdn": "Google Display Network", "native": "Native advertising", "retargeting": "Retargeting", "onlineVideo": "Online video (YouTube Ads)", "ctv": "Connected TV / streaming", "linearTv": "Lineaire TV", "radio": "Radio", "streamingAudio": "Streaming audio (Spotify)", "podcasts": "Podcasts", "newsletters": "Nieuwsbrieven", "automation": "Marketing automation", "loyalty": "Loyaliteitsmail", "whatsapp": "WhatsApp Business", "sms": "SMS", "push": "Push-notificaties", "billboards": "Billboards", "dooh": "Digitale OOH (DOOH)", "transit": "Transit / abri", "retail": "Retail / winkels", "stationery": "Briefpapier & huisstijl", "flyers": "Flyers & brochures", "directMail": "Direct mail", "merch": "Merchandise", "earned": "Earned media / PR", "affiliate": "Affiliate", "sponsoring": "Sponsoring"}, "dels": {"seoContent": "SEO (content)", "seoTech": "SEO (technisch)", "sea": "SEA / Google Ads", "linkbuilding": "Linkbuilding", "socialContent": "Contentcreatie", "community": "Community management", "paidSocial": "Paid social", "bannerCreatie": "Bannercreatie", "programmaticBuy": "Programmatic inkoop", "retargetingSetup": "Retargeting-setup", "videoProductie": "Online video", "videoMontage": "Montage", "videoBuy": "Media-inkoop", "spotProductie": "Radiocommercial", "podcastProductie": "Podcastproductie", "audioBuy": "Media-inkoop", "templateDesign": "Template-design", "emailFlows": "Flows / automation", "crmSetup": "CRM-inrichting", "flowSetup": "Flow-opzet", "msgCopy": "Copy", "msgIntegratie": "Integratie", "oohOntwerp": "Ontwerp", "oohBuy": "Inkoop & planning", "oohProductie": "Productie", "printOntwerp": "Ontwerp", "drukwerk": "Drukwerk", "printDistributie": "Distributie", "persstrategie": "PR-strategie", "influencerMgmt": "Influencer management", "affiliateSetup": "Affiliate-setup", "tvCommercial": "Tv-commercial", "audioSpot": "Audiospot (online)"}, "typeOpts": {"chatbot": "Chatbot / assistent", "contentgen": "Contentgeneratie", "automatisering": "Automatisering", "dataAnalyse": "Data-analyse", "aiIntegratie": "AI-integratie", "customModel": "Custom model"}, "DEL_DESC": {"seoContent": "Artikelen en pagina's die scoren op relevante zoektermen.", "seoTech": "Snelheid, structuur en crawlbaarheid van je website optimaliseren.", "sea": "Betaalde advertenties in Google zoekresultaten.", "linkbuilding": "Kwalitatieve externe links bouwen voor meer autoriteit.", "socialContent": "Posts, reels en stories die engagement genereren.", "community": "Reacties beheren en je community actief houden.", "paidSocial": "Betaalde campagnes op sociale platformen.", "bannerCreatie": "Display-banners ontwerpen in alle formaten.", "programmaticBuy": "Geautomatiseerde media-inkoop via DSP-platforms.", "retargetingSetup": "Bezoekers terugwinnen met gerichte advertenties.", "videoProductie": "Video voor online en social: concept, opname en montage.", "videoMontage": "Ruw beeldmateriaal monteren tot een sterk eindproduct.", "videoBuy": "Media-inkoop voor video-advertenties op YouTube e.a.", "spotProductie": "Radiocommercial: script, stemcasting, studio en mix.", "podcastProductie": "Podcast opnemen, monteren en publiceren.", "audioBuy": "Media-inkoop voor audio-advertenties op Spotify e.a.", "templateDesign": "E-mail templates ontwerpen die passen bij je merk.", "emailFlows": "Geautomatiseerde e-mailreeksen op basis van gedrag.", "crmSetup": "CRM-systeem inrichten en koppelen aan je kanalen.", "flowSetup": "Berichtflow opzetten in WhatsApp, sms of push.", "msgCopy": "Berichten schrijven die conversie stimuleren.", "msgIntegratie": "Berichtenplatform koppelen aan je website of CRM.", "oohOntwerp": "Visueel ontwerp voor billboards en abri's.", "oohBuy": "Locaties selecteren, inkopen en plannen.", "oohProductie": "Drukwerk en montage voor buitenreclame.", "printOntwerp": "Ontwerp voor flyers, brochures en drukwerk.", "drukwerk": "Printen en afwerken van je gedrukte materialen.", "printDistributie": "Versturen of verspreiden van je drukwerk.", "persstrategie": "PR-plan en persrelaties opbouwen en beheren.", "influencerMgmt": "Influencers scouten, briefen en campagne begeleiden.", "affiliateSetup": "Affiliate-netwerk opzetten en partners werven.", "tvCommercial": "Concept, draaidagen en afwerking van een commercial voor tv en CTV.", "audioSpot": "Korte audiospot voor Spotify en podcasts."}, "SUB_DESC": {"searchEngines": "Adverteren op Google en Bing zoekresultaten.", "aiSearch": "Zichtbaar zijn in AI-gestuurde zoekresultaten (ChatGPT, Perplexity).", "socialSearch": "Gevonden worden via zoeken op TikTok, Instagram en Pinterest.", "appStore": "App store optimalisatie voor meer organische downloads.", "meta": "Facebook en Instagram advertenties en organisch bereik.", "tiktok": "Short-form video content en advertenties op TikTok.", "linkedin": "B2B-campagnes en thought leadership op LinkedIn.", "pinterest": "Visuele content voor inspiratie en productontdekking.", "otherSocial": "Aanwezigheid op X, Snapchat en Reddit.", "programmatic": "Real-time bieden op display advertentieruimte.", "gdn": "Banners op het Google Display netwerk.", "native": "Advertenties die opgaan in redactionele content.", "retargeting": "Eerdere bezoekers opnieuw bereiken met gerichte ads.", "onlineVideo": "Pre-roll en skippable video ads op YouTube.", "ctv": "Advertenties op streaming-tv zoals Netflix en Videoland.", "linearTv": "Spots op traditionele televisiezenders.", "radio": "Spots op landelijke en regionale radiozenders.", "streamingAudio": "Audiospots op Spotify en andere streamingdiensten.", "podcasts": "Host-read en dynamisch ingevoegde podcast-advertenties.", "newsletters": "Gerichte e-mailcampagnes naar je eigen lijst.", "automation": "Automatische e-mailreeksen op basis van gedrag.", "loyalty": "Loyaliteitsmails om klanten actief en betrokken te houden.", "whatsapp": "Berichten en campagnes via WhatsApp Business.", "sms": "Korte, directe berichten voor hoge open rates.", "push": "Browser- en app pushberichten voor direct bereik.", "billboards": "Grote formaten langs drukke wegen en pleinen.", "dooh": "Digitale schermen in steden en winkelcentra.", "transit": "Abri's, bus- en metroreclame.", "retail": "In-store displays en reclame op winkelpunten.", "stationery": "Visitekaartjes, briefpapier en huisstijl-drukwerk.", "flyers": "Flyers en brochures voor offline distributie.", "directMail": "Gepersonaliseerde post naar geselecteerde adressen.", "merch": "Gebrandde merchandise en relatiegeschenken.", "earned": "PR en redactionele aandacht via journalisten en media.", "affiliate": "Commissiemodel waarbij partners klanten aanbrengen.", "sponsoring": "Merkzichtbaarheid via evenementen en content sponsoring."}, "scopes": {"campagne": "Campagne", "ai": "AI"}, "scopeDesc": {"campagne": "Een advertentiecampagne, opgezet en gestuurd op resultaat.", "ai": "Een AI-oplossing of automatisering, van integratie tot een eigen model."}, "phases": {"plan": "Loop Start", "build": "Loop Build", "run": "Loop Run"}, "phaseDesc": {"plan": "Onderzoek en plan van aanpak.", "build": "Opzet en productie. Altijd nodig.", "run": "Beheer en verbetering per maand, minimaal 3 maanden."}, "steps": {"type": "Type", "details": "Details", "fases": "Fases", "result": "Resultaat"}, "stepTitle": {"type": "Wat wil je doen?", "details": "Stel je scope samen.", "fases": "Kies je Loop-fases.", "result": "Jouw indicatie."}, "stepHelp": {"type": "Kies één type of combineer ze.", "details": "Kies kanalen, platforms en diensten.", "fases": "Build hoort er altijd bij. Start en Run kies je zelf.", "result": "Je indicatieve investering, excl. btw."}, "from": "v.a.", "mo": "/mnd", "onceShort": "eenmalig", "back": "← Terug", "next": "Volgende →", "startOver": "Opnieuw", "cta": "Plan een gesprek", "empty": "Kies minimaal één type.", "pickTypeFirst": "Kies eerst wat je wilt doen.", "backToType": "← Terug naar stap 1", "basis": "Strategie & coördinatie", "tweedeBasis": "gedeeld −50%", "onderzoek": "Onderzoek", "opzet": "Opzet", "beheer": "Beheer", "staffel": "schaalvoordeel −{p}%", "welkeKanalen": "Welke mediakanalen wil je inzetten?", "welkeAI": "Welke AI-functionaliteit?", "kanalen": "Platforms", "diensten": "Diensten", "minRun": "per maand, min. 3 mnd", "buiten": "Niet meegerekend (vraagt Loop Run)", "totaalEenmalig": "Totaal eenmalig", "perMaand": "Per maand", "eersteDrie": "Eerste 3 maanden totaal", "excl": "Excl. btw, mediabudget en externe kosten (druk, studio, talent, licenties, hosting)."}, "en": {"cats": {"search": "Search", "social": "Social", "display": "Display", "videotv": "Video & TV", "audio": "Audio", "email": "Email & CRM", "messaging": "Messaging", "ooh": "Out-of-home", "print": "Print", "pr": "PR & partnerships"}, "catDesc": {"search": "Being found at the moment of search intent, in search engines and AI.", "social": "Organic and paid, on the platforms where your audience is.", "display": "Banners and native ads across the web.", "videotv": "Video ads on YouTube, streaming and TV.", "audio": "Radio, Spotify and podcasts.", "email": "Email, automation and CRM.", "messaging": "WhatsApp, SMS and push notifications.", "ooh": "Outdoor advertising, digital and classic.", "print": "Print, flyers and direct mail.", "pr": "PR, influencers and affiliates."}, "subs": {"searchEngines": "Search engines (Google, Bing)", "aiSearch": "AI search / LLMs", "socialSearch": "Social search", "appStore": "App store (ASO)", "meta": "Meta (Facebook, Instagram)", "tiktok": "TikTok", "linkedin": "LinkedIn", "pinterest": "Pinterest", "otherSocial": "X, Snapchat, Reddit", "programmatic": "Programmatic display", "gdn": "Google Display Network", "native": "Native advertising", "retargeting": "Retargeting", "onlineVideo": "Online video (YouTube Ads)", "ctv": "Connected TV / streaming", "linearTv": "Linear TV", "radio": "Radio", "streamingAudio": "Streaming audio (Spotify)", "podcasts": "Podcasts", "newsletters": "Newsletters", "automation": "Marketing automation", "loyalty": "Loyalty emails", "whatsapp": "WhatsApp Business", "sms": "SMS", "push": "Push notifications", "billboards": "Billboards", "dooh": "Digital OOH (DOOH)", "transit": "Transit / bus shelters", "retail": "Retail / shops", "stationery": "Stationery & house style", "flyers": "Flyers & brochures", "directMail": "Direct mail", "merch": "Merchandise", "earned": "Earned media / PR", "affiliate": "Affiliate", "sponsoring": "Sponsoring"}, "dels": {"seoContent": "SEO (content)", "seoTech": "SEO (technical)", "sea": "SEA / Google Ads", "linkbuilding": "Link building", "socialContent": "Content creation", "community": "Community management", "paidSocial": "Paid social", "bannerCreatie": "Banner design", "programmaticBuy": "Programmatic buying", "retargetingSetup": "Retargeting set-up", "videoProductie": "Online video", "videoMontage": "Editing", "videoBuy": "Media buying", "spotProductie": "Radio commercial", "podcastProductie": "Podcast production", "audioBuy": "Media buying", "templateDesign": "Template design", "emailFlows": "Flows / automation", "crmSetup": "CRM set-up", "flowSetup": "Flow set-up", "msgCopy": "Copy", "msgIntegratie": "Integration", "oohOntwerp": "Design", "oohBuy": "Buying & planning", "oohProductie": "Production", "printOntwerp": "Design", "drukwerk": "Printing", "printDistributie": "Distribution", "persstrategie": "PR strategy", "influencerMgmt": "Influencer management", "affiliateSetup": "Affiliate set-up", "tvCommercial": "TV commercial", "audioSpot": "Audio spot (online)"}, "typeOpts": {"chatbot": "Chatbot / assistant", "contentgen": "Content generation", "automatisering": "Automation", "dataAnalyse": "Data analysis", "aiIntegratie": "AI integration", "customModel": "Custom model"}, "DEL_DESC": {"seoContent": "Articles and pages that rank for relevant search terms.", "seoTech": "Optimising your website’s speed, structure and crawlability.", "sea": "Paid ads in Google search results.", "linkbuilding": "Building quality external links for more authority.", "socialContent": "Posts, reels and stories that drive engagement.", "community": "Managing comments and keeping your community active.", "paidSocial": "Paid campaigns on social platforms.", "bannerCreatie": "Designing display banners in every format.", "programmaticBuy": "Automated media buying via DSP platforms.", "retargetingSetup": "Winning back visitors with targeted ads.", "videoProductie": "Video for online and social: concept, shoot and edit.", "videoMontage": "Editing raw footage into a strong final product.", "videoBuy": "Media buying for video ads on YouTube and elsewhere.", "spotProductie": "Radio commercial: script, voice casting, studio and mix.", "podcastProductie": "Recording, editing and publishing a podcast.", "audioBuy": "Media buying for audio ads on Spotify and elsewhere.", "templateDesign": "Designing email templates that fit your brand.", "emailFlows": "Automated email sequences based on behaviour.", "crmSetup": "Setting up a CRM system and connecting it to your channels.", "flowSetup": "Setting up a message flow in WhatsApp, SMS or push.", "msgCopy": "Writing messages that drive conversion.", "msgIntegratie": "Connecting a messaging platform to your website or CRM.", "oohOntwerp": "Visual design for billboards and bus shelters.", "oohBuy": "Selecting, buying and planning locations.", "oohProductie": "Printing and installation for outdoor advertising.", "printOntwerp": "Design for flyers, brochures and print.", "drukwerk": "Printing and finishing your printed materials.", "printDistributie": "Sending or distributing your printed materials.", "persstrategie": "A PR plan, and building and managing press relations.", "influencerMgmt": "Scouting and briefing influencers and guiding the campaign.", "affiliateSetup": "Setting up an affiliate network and recruiting partners.", "tvCommercial": "Concept, shoot days and finishing of a commercial for TV and CTV.", "audioSpot": "Short audio spot for Spotify and podcasts."}, "SUB_DESC": {"searchEngines": "Advertising in Google and Bing search results.", "aiSearch": "Being visible in AI-driven search results (ChatGPT, Perplexity).", "socialSearch": "Being found through search on TikTok, Instagram and Pinterest.", "appStore": "App store optimisation for more organic downloads.", "meta": "Facebook and Instagram ads and organic reach.", "tiktok": "Short-form video content and ads on TikTok.", "linkedin": "B2B campaigns and thought leadership on LinkedIn.", "pinterest": "Visual content for inspiration and product discovery.", "otherSocial": "A presence on X, Snapchat and Reddit.", "programmatic": "Real-time bidding on display ad space.", "gdn": "Banners on the Google Display Network.", "native": "Ads that blend in with editorial content.", "retargeting": "Reaching previous visitors again with targeted ads.", "onlineVideo": "Pre-roll and skippable video ads on YouTube.", "ctv": "Ads on streaming TV such as Netflix and Videoland.", "linearTv": "Spots on traditional TV channels.", "radio": "Spots on national and regional radio stations.", "streamingAudio": "Audio spots on Spotify and other streaming services.", "podcasts": "Host-read and dynamically inserted podcast ads.", "newsletters": "Targeted email campaigns to your own list.", "automation": "Automated email sequences based on behaviour.", "loyalty": "Loyalty emails that keep customers active and engaged.", "whatsapp": "Messages and campaigns via WhatsApp Business.", "sms": "Short, direct messages for high open rates.", "push": "Browser and app push notifications for direct reach.", "billboards": "Large formats along busy roads and squares.", "dooh": "Digital screens in cities and shopping centres.", "transit": "Bus shelter, bus and metro advertising.", "retail": "In-store displays and point-of-sale advertising.", "stationery": "Business cards, stationery and house-style print.", "flyers": "Flyers and brochures for offline distribution.", "directMail": "Personalised mail to selected addresses.", "merch": "Branded merchandise and corporate gifts.", "earned": "PR and editorial coverage through journalists and media.", "affiliate": "A commission model in which partners bring in customers.", "sponsoring": "Brand visibility through events and content sponsorship."}, "scopes": {"campagne": "Campaign", "ai": "AI"}, "scopeDesc": {"campagne": "An advertising campaign, set up and managed for results.", "ai": "An AI solution or automation, from integration to a custom model."}, "phases": {"plan": "Loop Start", "build": "Loop Build", "run": "Loop Run"}, "phaseDesc": {"plan": "Research and a plan of approach.", "build": "Set-up and production. Always included.", "run": "Monthly management and improvement, minimum 3 months."}, "steps": {"type": "Type", "details": "Details", "fases": "Phases", "result": "Result"}, "stepTitle": {"type": "What do you want to do?", "details": "Put together your scope.", "fases": "Choose your Loop phases.", "result": "Your estimate."}, "stepHelp": {"type": "Choose one type or combine them.", "details": "Choose channels, platforms and services.", "fases": "Build is always included. Start and Run are up to you.", "result": "Your indicative investment, excl. VAT."}, "from": "from", "mo": "/mo", "onceShort": "one-off", "back": "← Back", "next": "Next →", "startOver": "Start over", "cta": "Book a call", "empty": "Choose at least one type.", "pickTypeFirst": "First choose what you want to do.", "backToType": "← Back to step 1", "basis": "Strategy & coordination", "tweedeBasis": "shared −50%", "onderzoek": "Research", "opzet": "Set-up", "beheer": "Management", "staffel": "volume discount −{p}%", "welkeKanalen": "Which media channels do you want to use?", "welkeAI": "Which AI functionality?", "kanalen": "Platforms", "diensten": "Services", "minRun": "per month, min. 3 months", "buiten": "Not included (requires Loop Run)", "totaalEenmalig": "Total one-off", "perMaand": "Per month", "eersteDrie": "First 3 months in total", "excl": "Excl. VAT, media budget and external costs (printing, studio, talent, licences, hosting)."}};
  var EN = document.documentElement.lang === 'en';
  var T = EN ? LBL.en : LBL.nl;

  function eur(uur) {
    var n = Math.round(uur * TARIEF / 5) * 5;
    return '€ ' + n.toLocaleString(EN ? 'en-GB' : 'nl-NL');
  }
  function bedrag(n) { return '€ ' + Math.round(n).toLocaleString(EN ? 'en-GB' : 'nl-NL'); }
  function euro(uur) { return Math.round(uur * TARIEF / 5) * 5; }

  // ── STAAT ───────────────────────────────────────────────────
  var S = { stap: 0, types: { campagne: true, ai: false }, start: true, run: true,
            kanalen: {}, subs: {}, dels: {}, ai: {}, open: {} };
  var STAPPEN = ['type', 'details', 'fases', 'result'];

  function gekozenTypes() { return ['campagne', 'ai'].filter(function (k) { return S.types[k]; }); }
  function gekozenKanalen() {
    if (!S.types.campagne) return [];
    return KANALEN.filter(function (c) { return S.kanalen[c.k]; });
  }
  function kanaalUren(c) {            // [build, run] van coördinatie + gekozen platforms
    var b = c.h[0], r = c.h[1];
    Object.keys(c.subs).forEach(function (s) { if (S.subs[s]) { b += c.subs[s][0]; r += c.subs[s][1]; } });
    return [b, r];
  }

  // ── REKENEN ─────────────────────────────────────────────────
  function bereken() {
    var types = gekozenTypes();
    var res = { start: [], build: [], run: [], buiten: [], leeg: !types.length };
    if (res.leeg) return af(res);

    // Basis: duurste type volledig, tweede met korting.
    var basis = types.map(function (k) {
      var h = BASIS[k];
      return { k: k, h: h, waarde: h[0] + h[1] + MIN_RUN * h[2] };
    }).sort(function (a, b) { return b.waarde - a.waarde; });
    basis.forEach(function (x, i) {
      var f = i === 0 ? 1 : TWEEDE_BASIS;
      var noot = f < 1 ? T.tweedeBasis : '';
      var naam = T.basis + ' (' + T.scopes[x.k] + ')';
      if (S.start) res.start.push({ l: naam, u: x.h[0] * f, n: noot });
      res.build.push({ l: naam, u: x.h[1] * f, n: noot });
      if (S.run) res.run.push({ l: naam, u: x.h[2] * f, n: noot });
    });

    // Kanalen, gerangschikt op waarde (opzet + 3 maanden beheer).
    var kan = gekozenKanalen().map(function (c) {
      var u = kanaalUren(c);
      return { c: c, u: u, waarde: u[0] + MIN_RUN * u[1] };
    }).sort(function (a, b) { return b.waarde - a.waarde; });

    kan.forEach(function (x, i) {
      var f = STAFFEL[Math.min(i, STAFFEL.length - 1)];
      var c = x.c, naam = T.cats[c.k];
      var korting = f < 1 ? T.staffel.replace('{p}', Math.round((1 - f) * 100)) : '';
      var platforms = Object.keys(c.subs).filter(function (s) { return S.subs[s]; })
        .map(function (s) { return T.subs[s]; }).join(', ');
      if (S.start) res.start.push({ l: T.onderzoek + ': ' + naam, u: ONDERZOEK });
      var bSub = [{ l: T.opzet + (platforms ? ' (' + platforms + ')' : ''), u: x.u[0] * f, n: korting }];
      var rSub = [{ l: T.beheer + (platforms ? ' (' + platforms + ')' : ''), u: x.u[1] * f, n: korting }];
      c.dels.forEach(function (d) {
        if (!S.dels[d]) return;
        var h = DIENST[d];
        if (h[0]) bSub.push({ l: T.dels[d], u: h[0] });
        if (h[1]) {
          if (S.run) rSub.push({ l: T.dels[d], u: h[1] });
          else if (!h[0]) res.buiten.push(T.dels[d]);
        }
      });
      res.build.push({ l: naam, sub: bSub });
      if (S.run) res.run.push({ l: naam, sub: rSub });
    });

    // AI-functies.
    if (S.types.ai) {
      Object.keys(AI).forEach(function (k) {
        if (!S.ai[k]) return;
        var h = AI[k];
        if (S.start) res.start.push({ l: T.onderzoek + ': ' + T.typeOpts[k], u: ONDERZOEK });
        res.build.push({ l: T.typeOpts[k], u: h[0] });
        if (S.run) res.run.push({ l: T.typeOpts[k], u: h[1] });
      });
    }
    return af(res);
  }
  function som(regels) {
    return regels.reduce(function (t, r) {
      return t + (r.sub ? r.sub.reduce(function (a, s) { return a + euro(s.u); }, 0) : euro(r.u));
    }, 0);
  }
  function af(res) {
    res.tStart = som(res.start); res.tBuild = som(res.build); res.tRun = som(res.run);
    res.eenmalig = res.tStart + res.tBuild;
    res.drie = res.eenmalig + MIN_RUN * res.tRun;
    return res;
  }

  // ── TEKENEN ─────────────────────────────────────────────────
  function knoppen(terug, verder) {
    var h = '<div class="calc-nav">';
    if (terug) h += '<button class="btn btn-secondary" onclick="LoopCalc.ga(' + (S.stap - 1) + ')">' + T.back + '</button>';
    if (verder) {
      var klaar = S.types.campagne || S.types.ai;
      h += '<button class="btn btn-primary' + (klaar ? '' : ' is-disabled') + '"' +
        (klaar ? ' onclick="LoopCalc.ga(' + (S.stap + 1) + ')"' : ' disabled aria-disabled="true"') + '>' + T.next + '</button>';
    }
    if (!verder && S.stap > 0) h += '<button class="btn btn-ghost" onclick="LoopCalc.ga(0)">' + T.startOver + '</button>';
    return h + '</div>';
  }
  function prijsLabel(h) {
    var p = [];
    if (h[0]) p.push(eur(h[0]));
    if (h[1]) p.push(eur(h[1]) + T.mo);
    return p.join(' + ');
  }
  function toggleRij(on, titel, desc, prijs, actie, vast) {
    return '<button class="toggle' + (on ? ' on' : '') + '"' + (vast ? ' disabled aria-disabled="true"' : ' onclick="' + actie + '"') + '>' +
      '<span class="toggle-main"><span class="toggle-t">' + titel + '</span><span class="toggle-d">' + desc + '</span></span>' +
      '<span class="toggle-p mono">' + prijs + '</span><span class="tgt"><span class="tgt-dot"></span></span></button>';
  }
  function rij(r, sleutel, perMaand) {
    var heeftSub = r.sub && r.sub.length > 1;
    var tot = r.sub ? r.sub.reduce(function (a, s) { return a + euro(s.u); }, 0) : euro(r.u);
    var open = !!S.open[sleutel];
    var h = '<div class="rcp-line"><div class="rcp-row' + (heeftSub ? ' rcp-row-btn' : '') + '"' +
      (heeftSub ? ' role="button" onclick="LoopCalc.rij(\'' + sleutel + '\')"' : '') + '><span class="rcp-l">';
    if (heeftSub) h += '<span class="rcp-caret' + (open ? ' on' : '') + '">&#x203A;</span>';
    h += r.l + (r.n ? ' <em class="rcp-free">' + r.n + '</em>' : '') +
      (!heeftSub && r.sub && r.sub[0].n ? ' <em class="rcp-free">' + r.sub[0].n + '</em>' : '') +
      '</span><span class="rcp-v mono">' + bedrag(tot) + (perMaand ? T.mo : '') + '</span></div>';
    if (heeftSub && open) {
      r.sub.forEach(function (s) {
        h += '<div class="rcp-row rcp-srow"><span class="rcp-l">' + s.l + (s.n ? ' <em class="rcp-free">' + s.n + '</em>' : '') +
          '</span><span class="rcp-v mono">' + eur(s.u) + (perMaand ? T.mo : '') + '</span></div>';
      });
    }
    return h + '</div>';
  }
  function groep(titel, regels, totaal, perMaand, sleutel) {
    if (!regels.length) return '';
    var h = '<div class="rcp-row rcp-tot"><span class="rcp-l">' + titel + '</span><span class="rcp-v mono">' +
      bedrag(totaal) + (perMaand ? T.mo : '') + '</span></div>';
    regels.forEach(function (r, i) { h += rij(r, sleutel + i, perMaand); });
    return h;
  }

  function teken() {
    var nav = document.getElementById('calc-nav'), body = document.getElementById('calc-body');
    if (!nav || !body) return;
    var cur = STAPPEN[S.stap], r = bereken();

    nav.innerHTML = STAPPEN.map(function (s, i) {
      return '<button class="calc-dot' + (i === S.stap ? ' on' : '') + (i < S.stap ? ' done' : '') + '" onclick="LoopCalc.ga(' + i + ')">' +
        '<span class="calc-dot-n">' + (i + 1) + '</span><span class="calc-dot-l">' + T.steps[s] + '</span></button>';
    }).join('');

    var h = '<div class="calc-slide-head"><div class="calc-slide-title">' + T.stepTitle[cur] + '</div><div class="calc-slide-help">' + T.stepHelp[cur] + '</div></div>';

    if (cur === 'type') {
      h += '<div class="type-cards">';
      ['campagne', 'ai'].forEach(function (k) {
        var on = S.types[k];
        h += '<button class="scope-card' + (on ? ' on' : '') + '" onclick="LoopCalc.type(\'' + k + '\')"><span class="scope-check">' + (on ? '&#10003;' : '') + '</span>' +
          '<span class="scope-card-t">' + T.scopes[k] + '</span><div class="scope-card-d">' + T.scopeDesc[k] + '</div></button>';
      });
      h += '</div>' + knoppen(false, true);
    } else if (cur === 'details') {
      if (!gekozenTypes().length) {
        h += '<div class="calc-empty-step"><p>' + T.pickTypeFirst + '</p><button class="btn btn-secondary" onclick="LoopCalc.ga(0)">' + T.backToType + '</button></div>';
      }
      if (S.types.campagne) {
        h += '<div class="detail-block"><div class="detail-block-q">' + T.welkeKanalen + '</div><div class="svc-list">';
        KANALEN.forEach(function (c) {
          var on = !!S.kanalen[c.k];
          var vanaf = Math.min.apply(null, Object.keys(c.subs).map(function (s) { return c.subs[s][0]; })) + c.h[0];
          h += '<div class="svc-item"><button class="svc-row' + (on ? ' on' : '') + '" onclick="LoopCalc.kanaal(\'' + c.k + '\')">' +
            '<span class="svc-row-x">' + (on ? '&minus;' : '+') + '</span><span class="svc-row-n">' + T.cats[c.k] + '</span>' +
            '<span class="svc-row-p mono">' + T.from + ' ' + eur(vanaf) + '</span></button>';
          if (on) {
            h += '<div class="cat-refine"><p class="cat-explain">' + (T.catDesc[c.k] || '') + '</p>' +
              '<div class="refine-group"><span class="refine-h">' + T.kanalen + '</span><div class="chip-grid">';
            Object.keys(c.subs).forEach(function (s) {
              h += '<button class="chip-opt' + (S.subs[s] ? ' on' : '') + '" onclick="LoopCalc.sub(\'' + c.k + '\',\'' + s + '\')" title="' +
                (T.SUB_DESC[s] || '').replace(/"/g, '&quot;') + '">' + T.subs[s] + '</button>';
            });
            h += '</div></div><div class="refine-group"><span class="refine-h">' + T.diensten + '</span><div class="del-list">';
            c.dels.forEach(function (d) {
              var don = !!S.dels[d];
              h += '<button class="del-row' + (don ? ' on' : '') + '" onclick="LoopCalc.dienst(\'' + d + '\')"><span class="del-check">' + (don ? '&#10003;' : '') + '</span>' +
                '<span class="del-main"><span class="del-t">' + T.dels[d] + '</span>' + (T.DEL_DESC[d] ? '<span class="del-d">' + T.DEL_DESC[d] + '</span>' : '') + '</span>' +
                '<span class="del-p mono">' + prijsLabel(DIENST[d]) + '</span></button>';
            });
            h += '</div></div></div>';
          }
          h += '</div>';
        });
        h += '</div></div>';
      }
      if (S.types.ai) {
        h += '<div class="detail-block"><div class="detail-block-q">' + T.welkeAI + '</div><div class="del-list">';
        Object.keys(AI).forEach(function (k) {
          var on = !!S.ai[k];
          h += '<button class="del-row' + (on ? ' on' : '') + '" onclick="LoopCalc.ai(\'' + k + '\')"><span class="del-check">' + (on ? '&#10003;' : '') + '</span>' +
            '<span class="del-main"><span class="del-t">' + T.typeOpts[k] + '</span></span><span class="del-p mono">' + prijsLabel(AI[k]) + '</span></button>';
        });
        h += '</div></div>';
      }
      h += knoppen(true, true);
    } else if (cur === 'fases') {
      h += '<div class="cfg-toggles">';
      h += toggleRij(S.start, T.phases.plan, T.phaseDesc.plan, S.start ? bedrag(r.tStart) : '', 'LoopCalc.fase(\'start\')');
      h += toggleRij(true, T.phases.build, T.phaseDesc.build, bedrag(r.tBuild), '', true);
      h += toggleRij(S.run, T.phases.run, T.phaseDesc.run, S.run ? bedrag(r.tRun) + T.mo : '', 'LoopCalc.fase(\'run\')');
      h += '</div>' + knoppen(true, true);
    } else {
      h += '<div class="cfg-out-card">';
      if (r.leeg) {
        h += '<p class="cfg-empty">' + T.empty + '</p>';
      } else {
        h += '<div class="rcp">';
        h += groep(T.phases.plan + ' · ' + T.onceShort, r.start, r.tStart, false, 's');
        h += groep(T.phases.build + ' · ' + T.onceShort, r.build, r.tBuild, false, 'b');
        h += groep(T.phases.run + ' · ' + T.minRun, r.run, r.tRun, true, 'r');
        if (r.buiten.length) {
          h += '<div class="rcp-row rcp-srow rcp-nrow"><span class="rcp-l">' + T.buiten + ': ' + r.buiten.join(', ') + '</span><span class="rcp-v"></span></div>';
        }
        h += '<div class="rcp-row rcp-tot"><span class="rcp-l">' + T.totaalEenmalig + '</span><span class="rcp-v mono">' + bedrag(r.eenmalig) + '</span></div>';
        if (r.tRun) {
          h += '<div class="rcp-row rcp-tot"><span class="rcp-l">' + T.perMaand + '</span><span class="rcp-v mono">' + bedrag(r.tRun) + T.mo + '</span></div>';
          h += '<div class="rcp-row rcp-tot"><span class="rcp-l">' + T.eersteDrie + '</span><span class="rcp-v mono">' + bedrag(r.drie) + '</span></div>';
        }
        h += '<div class="rcp-row rcp-srow rcp-nrow"><span class="rcp-l">' + T.excl + '</span><span class="rcp-v"></span></div>';
        h += '</div>';
        h += '<button class="btn-cta" onclick="window.open(\'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1Dfb1ZunCYFgPNrvuYKMIgVBy9Qgv9xlcxkSOnEbvnaWWSUeKQ_fTzv4gSHQfmkJm3LmL93Tk7\',\'_blank\')">' + T.cta + ' →</button>';
      }
      h += knoppen(true, false) + '</div>';
    }

    var loopt = '';
    if (!r.leeg) {
      loopt = T.from + ' ' + bedrag(r.eenmalig) + ' ' + T.onceShort + (r.tRun ? ' · ' + bedrag(r.tRun) + T.mo : '');
    }
    h += '<div class="calc-running-bar"><div class="calc-running mono">' + loopt + '</div></div>';
    body.innerHTML = h;
  }

  // ── ACTIES ──────────────────────────────────────────────────
  window.LoopCalc = {
    ga: function (i) {
      S.stap = Math.max(0, Math.min(STAPPEN.length - 1, i)); teken();
      var c = document.getElementById('calculator'); if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    type: function (k) { S.types[k] = !S.types[k]; teken(); },
    kanaal: function (k) {
      S.kanalen[k] = !S.kanalen[k];
      var c = KANALEN.filter(function (x) { return x.k === k; })[0];
      // Een kanaal heeft minstens één platform: het eerste staat standaard aan.
      if (S.kanalen[k] && !Object.keys(c.subs).some(function (s) { return S.subs[s]; })) S.subs[Object.keys(c.subs)[0]] = true;
      teken();
    },
    sub: function (k, s) {
      var c = KANALEN.filter(function (x) { return x.k === k; })[0];
      var aan = Object.keys(c.subs).filter(function (x) { return S.subs[x]; });
      if (S.subs[s] && aan.length === 1) return;   // laatste platform blijft aan
      S.subs[s] = !S.subs[s]; teken();
    },
    dienst: function (d) { S.dels[d] = !S.dels[d]; teken(); },
    ai: function (k) { S.ai[k] = !S.ai[k]; teken(); },
    fase: function (f) { S[f] = !S[f]; teken(); },
    rij: function (k) { S.open[k] = !S.open[k]; teken(); },
    _bereken: bereken, _S: S
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', teken); else teken();
})();
