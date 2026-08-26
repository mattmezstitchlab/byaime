// ===== BYAIME — AIME ÉCOSYSTÈME : Modèle de Réciprocité & Révélation Progressive (v3.0) =====
// Autonomous Simulation & Interactive Demonstration of the Non-Monetary Contribution Network

(function () {
  'use strict';

  var defaultEcosystemModel = {
    id: 'aime_ecosystem_demo_v1',
    label: 'Écosystème de Réciprocité AIME',
    metrics: {
      totalHumanContributions: 284,
      reciprocityInteractions: 73,
      transmissionContributions: 42,
      localTerritorialActions: 46,
      sharedResources: 28,
      socialConnections: 64,
      activeMembers: 100
    },
    rippleCases: [
      {
        id: 'ripple_01',
        category: 'transmission',
        categoryLabel: 'Transmission de Savoir',
        title: 'Transmission d\'un Savoir & Effet Cascade',
        iconName: 'transmission',
        initiator: { name: 'Matt Mez', action: 'Anime un atelier de design d\'interfaces poétiques et sound design' },
        steps: [
          { who: 'Collectif de jeunes artistes', action: 'Apprend à concevoir une scénographie numérique vivante' },
          { who: 'Claire & Thomas (membres)', action: 'Créent bénévolement le mini-site d\'un festival de quartier' },
          { who: '120 festivaliers', action: 'Découvrent les œuvres et s\'orientent sans réseau mobile' },
          { who: 'Bénévoles du festival', action: 'Organisent à leur tour un atelier pour les enfants des écoles' }
        ],
        impactSummary: '1 transmission initiale ➔ 4 paliers d\'impact ➔ 120+ personnes touchées positivement.'
      },
      {
        id: 'ripple_02',
        category: 'matiere',
        categoryLabel: 'Matière & Écologie',
        title: 'Partage d\'Outil & Économie Circulaire',
        iconName: 'matiere',
        initiator: { name: 'Sophie D.', action: 'Met à disposition une ponceuse et du matériel de menuiserie inutilisé' },
        steps: [
          { who: 'Antoine M. (voisin)', action: 'Répare 3 chaises et une table d\'un lieu associatif au lieu de les jeter' },
          { who: 'L\'association locale', action: 'Évite l\'achat d\'outils neufs et préserve son budget de projet' },
          { who: 'Familles du quartier', action: 'Bénéficient d\'un espace d\'accueil chaleureux et rénové' }
        ],
        impactSummary: '1 outil mutualisé ➔ 3 meubles restaurés ➔ réduction concrète du gaspillage matériel.'
      },
      {
        id: 'ripple_03',
        category: 'lienSocial',
        categoryLabel: 'Lien Social & Écoute',
        title: 'Écoute & Transmission Intergénérationnelle',
        iconName: 'lienSocial',
        initiator: { name: 'Camille R.', action: 'Anime un cercle d\'écoute et de recueil de mémoires de quartier' },
        steps: [
          { who: 'Henri (82 ans)', action: 'Raconte ses anecdotes d\'artisanat et sort de 3 mois d\'isolement' },
          { who: 'Léa (22 ans, étudiante)', action: 'Numérise et enregistre son témoignage audio pour les archives' },
          { who: 'Classes du quartier', action: 'Écoutent l\'archive vivante lors d\'un projet pédagogique' }
        ],
        impactSummary: '1 heure d\'écoute humaine ➔ du lien vivant retissé entre trois générations.'
      }
    ],
    territoryResources: [
      {
        id: 't_01',
        category: 'skills',
        categoryLabel: 'Compétence',
        title: 'Atelier Scénographie Numérique & UX',
        provider: 'Matt Mez',
        distance: 'À proximité immédiate • Paris',
        description: 'Session d\'initiation au design poétique et typographie sensible pour événements associatifs.',
        reciprocalNeed: 'Besoins réciproques : Matériel d\'enregistrement acoustique'
      },
      {
        id: 't_02',
        category: 'tools',
        categoryLabel: 'Matière / Outil',
        title: 'Kit Menuiserie & Ponceuse Pro',
        provider: 'Sophie D.',
        distance: '800 m • Quartier Est',
        description: 'Mise à disposition gratuite pour petits travaux de réparation ou scénographie en bois.',
        reciprocalNeed: 'Besoins réciproques : Coup de main jardinage'
      },
      {
        id: 't_03',
        category: 'spaces',
        categoryLabel: 'Espace',
        title: 'Atelier / Salle de répétition calme',
        provider: 'Collectif La Forge',
        distance: '1.4 km • Centre',
        description: 'Accès libre le mardi et jeudi soir pour répétitions acoustiques ou réunions associatives.',
        reciprocalNeed: 'Besoins réciproques : Aide à la communication'
      },
      {
        id: 't_04',
        category: 'initiatives',
        categoryLabel: 'Entraide & Lien',
        title: 'Cercle de Mémoire Citoyenne',
        provider: 'Camille R.',
        distance: '600 m • Bibliothèque locale',
        description: 'Recueil de témoignages oraux d\'anciens artisans pour archives de quartier vivantes.',
        reciprocalNeed: 'Besoins réciproques : Prêt de micros de captation'
      }
    ],
    simulationDefaults: {
      mutualisationPct: 55,
      skillsPct: 65,
      spacePct: 40
    },
    ledgerFeed: [
      { time: '08:42', stage: 'Déclaration', actor: 'Lucas M.', action: 'Mise à disposition d\'un vélo cargo pour un déménagement associatif', status: 'Déclarée', level: '1/5' },
      { time: '09:15', stage: 'Confirmation', actor: 'Médiation LE MONDE AIME', action: 'Vérification de la disponibilité et accord de prêt', status: 'Confirmée', level: '2/5' },
      { time: '10:02', stage: 'Validation', actor: 'Écosystème AIME', action: 'Contribution certifiée dans le registre de confiance', status: 'Reconnue', level: '3/5' },
      { time: '14:35', stage: 'Utilisation', actor: 'Collectif Solidaire', action: 'Prise en main du vélo cargo et transport de matériel', status: 'En cours', level: '4/5' },
      { time: '18:40', stage: 'Clôture', actor: 'Lucas M. & Collectif', action: 'Restitution du matériel et validation de l\'impact partagé', status: 'Clôturée avec succès', level: '5/5' }
    ]
  };

  function calculateEcosystemBalance(mutPct, sklPct, spcPct) {
    var sharedObjects = Math.round(100 * (mutPct / 100) * 2.4);
    var hoursShared = Math.round(100 * (sklPct / 100) * 3.8);
    var spacesUtilized = Math.round(100 * (spcPct / 100) * 1.6);
    var reciprocityScore = Math.round((mutPct * 0.35) + (sklPct * 0.45) + (spcPct * 0.20));
    var energyPreservedIndex = Math.round((sharedObjects * 40) + (hoursShared * 25) + (spacesUtilized * 50));

    return {
      reciprocityScore: Math.min(100, Math.max(0, reciprocityScore)),
      sharedObjects: sharedObjects,
      hoursShared: hoursShared,
      spacesUtilized: spacesUtilized,
      energyPreservedIndex: energyPreservedIndex
    };
  }

  function getIconSvg(name) {
    if (window.AIME_Icons && window.AIME_Icons[name]) {
      return window.AIME_Icons[name];
    }
    return '';
  }

  function initEcosystemUI() {
    // =========================================================================
    // 1. HERO PROGRESSIVE DISCLOSURE ENGINE
    // =========================================================================
    var rootSelect = document.getElementById('eco-root-intent');
    var branchContrib = document.getElementById('eco-branch-contribuer');
    var branchBesoin = document.getElementById('eco-branch-besoin');
    var branchTerritoire = document.getElementById('eco-branch-territoire');
    var branchSimuler = document.getElementById('eco-branch-simuler');

    var contribModeSelect = document.getElementById('eco-contrib-mode');
    var contribScopeBox = document.getElementById('eco-contrib-scope-box');
    var contribScopeSelect = document.getElementById('eco-contrib-scope');
    var contribResult = document.getElementById('eco-contrib-result');
    var contribResultText = document.getElementById('eco-contrib-result-text');

    var besoinTypeSelect = document.getElementById('eco-besoin-type');
    var besoinResult = document.getElementById('eco-besoin-result');
    var besoinResultText = document.getElementById('eco-besoin-result-text');

    if (rootSelect) {
      rootSelect.addEventListener('change', function () {
        var val = this.value;
        if (branchContrib) branchContrib.classList.toggle('hidden', val !== 'contribuer');
        if (branchBesoin) branchBesoin.classList.toggle('hidden', val !== 'besoin');
        if (branchTerritoire) branchTerritoire.classList.toggle('hidden', val !== 'territoire');
        if (branchSimuler) branchSimuler.classList.toggle('hidden', val !== 'simuler');
      });
    }

    if (contribModeSelect) {
      contribModeSelect.addEventListener('change', function () {
        var val = this.value;
        if (val === 'none') {
          if (contribScopeBox) contribScopeBox.classList.add('hidden');
          if (contribResult) contribResult.classList.add('hidden');
          return;
        }
        if (contribScopeBox) contribScopeBox.classList.remove('hidden');
        renderContribConsequence();
      });
    }

    if (contribScopeSelect) {
      contribScopeSelect.addEventListener('change', renderContribConsequence);
    }

    function renderContribConsequence() {
      if (!contribResult || !contribResultText) return;
      var mode = contribModeSelect ? contribModeSelect.value : '';
      var scope = contribScopeSelect ? contribScopeSelect.value : 'local';

      var responses = {
        transmettre: 'AIME identifie 2 demandes de transmission : "Le collectif d\'artistes de quartier recherche une initiation au design" et "Une association mémorielle recherche un atelier sonore". Effet cascade estimé : 40+ personnes touchées.',
        aider: 'AIME identifie 3 opportunités d\'entraide : "Montage d\'une scénographie solidaire ce week-end", "Aide au tri de matériel associatif", "Médiation numérique pour seniors".',
        preter: 'AIME identifie 2 besoins de matériel mutualisé : "Besoin ponctuel d\'une ponceuse pour restaurer 3 tables associatives" et "Besoin d\'un enregistreur audio pour un recueil de mémoire".',
        reparer: 'AIME identifie 4 objets en attente de rénovation dans votre périmètre : petit mobilier bois, câblage audio et vélos d\'entraide.',
        ecouter: 'AIME identifie 1 cercle de parole intergénérationnel en recherche d\'animateurs bénévoles pour recueillir les mémoires locales.',
        territoire: 'AIME cartographie 3 projets citoyens locaux à la recherche de co-créateurs engagés.'
      };

      contribResultText.textContent = responses[mode] || 'AIME identifie des opportunités concrètes et des demandes compatibles avec votre proposition.';
      contribResult.classList.remove('hidden');
    }

    if (besoinTypeSelect) {
      besoinTypeSelect.addEventListener('change', function () {
        var val = this.value;
        if (!besoinResult || !besoinResultText) return;

        if (val === 'none') {
          besoinResult.classList.add('hidden');
          return;
        }

        var responses = {
          outil: 'Sophie D. (800 m) met à disposition une ponceuse et une caisse à outils bois. Le collectif La Forge propose également un kit de captation sonore en prêt gratuit.',
          competence: 'Matt Mez propose des ateliers de design sensible et sound design. Claire & Thomas proposent de l\'aide à la conception de mini-sites associatifs.',
          espace: 'Le tiers-lieu La Forge (1.4 km) propose un accès libre à son espace calme pour répétitions ou ateliers associatifs sur réservation bénévole.',
          aide: 'Lucas M. et deux bénévoles locaux sont disponibles pour renfort logistique et portage de matériel.',
          transport: 'Un vélo cargo solidaire est disponible en partage à 600 m pour déplacements sans emprunte carbone.'
        };

        besoinResultText.textContent = responses[val] || 'Des ressources citoyennes sont répertoriées dans l\'écosystème pour répondre à ce besoin.';
        besoinResult.classList.remove('hidden');
      });
    }

    // =========================================================================
    // 2. RIPPLE CASCADE DISPLAY CONTROLLER (DROPDOWN-DRIVEN)
    // =========================================================================
    var rippleSelect = document.getElementById('ripple-case-selector');
    var rippleDisplayBox = document.getElementById('ripple-active-display');
    var rippleDetailModal = document.getElementById('modal-ripple-detail');

    function renderActiveRippleCase(index) {
      if (!rippleDisplayBox) return;
      var rc = defaultEcosystemModel.rippleCases[index] || defaultEcosystemModel.rippleCases[0];

      var stepsHtml = rc.steps.map(function (st, idx) {
        return '<div class="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs">' +
          '<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] flex-shrink-0 mt-0.5">Palier 0' + (idx + 1) + '</span>' +
          '<div><p class="font-bold text-white">' + st.who + '</p><p class="text-gray-300 mt-0.5 leading-relaxed">' + st.action + '</p></div>' +
          '</div>';
      }).join('');

      var iconSvg = getIconSvg(rc.iconName || rc.category);

      rippleDisplayBox.innerHTML = '<div class="flex items-center justify-between border-b border-white/10 pb-4">' +
        '<div class="flex items-center gap-3">' +
        '<div class="p-2.5 rounded-2xl bg-white/5 border border-white/10">' + iconSvg + '</div>' +
        '<div><h3 class="text-base font-bold text-white tracking-tight">' + rc.title + '</h3>' +
        '<p class="text-xs text-emerald-400 font-mono">' + rc.categoryLabel + '</p></div>' +
        '</div>' +
        '<button id="btn-open-modal-ripple" type="button" class="px-3.5 py-1.5 rounded-full border border-white/20 text-xs text-white hover:bg-white/10 transition-colors">Détails de la chaîne</button>' +
        '</div>' +
        '<div class="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">' +
        '<span class="text-[10px] uppercase font-mono text-gray-400">Action Déclenchée :</span>' +
        '<p class="text-white"><strong class="text-white">' + rc.initiator.name + ' :</strong> ' + rc.initiator.action + '</p>' +
        '</div>' +
        '<div class="space-y-2.5">' +
        '<span class="text-[10px] uppercase font-mono text-emerald-400">Propagation de l\'effet cascade (' + rc.steps.length + ' paliers) :</span>' +
        '<div class="space-y-2">' + stepsHtml + '</div>' +
        '</div>' +
        '<div class="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 font-medium">' +
        '<strong>Impact global :</strong> ' + rc.impactSummary +
        '</div>';

      var modalBtn = document.getElementById('btn-open-modal-ripple');
      if (modalBtn) {
        modalBtn.addEventListener('click', function () {
          openRippleDetailModal(rc);
        });
      }
    }

    if (rippleSelect) {
      rippleSelect.addEventListener('change', function () {
        renderActiveRippleCase(parseInt(this.value, 10) || 0);
      });
      renderActiveRippleCase(0);
    }

    function openRippleDetailModal(rc) {
      if (!rippleDetailModal) return;

      var titleEl = document.getElementById('rip-det-title');
      var catEl = document.getElementById('rip-det-cat');
      var initEl = document.getElementById('rip-det-initiator');
      var stepsEl = document.getElementById('rip-det-steps');
      var summaryEl = document.getElementById('rip-det-summary');

      var iconSvg = getIconSvg(rc.iconName || rc.category);

      if (titleEl) titleEl.innerHTML = '<div class="flex items-center gap-2"><span>' + iconSvg + '</span><span>' + rc.title + '</span></div>';
      if (catEl) catEl.textContent = rc.categoryLabel.toUpperCase();
      if (initEl) initEl.innerHTML = '<strong class="text-white">' + rc.initiator.name + ' :</strong> ' + rc.initiator.action;
      if (summaryEl) summaryEl.textContent = rc.impactSummary;

      if (stepsEl) {
        stepsEl.innerHTML = '';
        rc.steps.forEach(function (st, sIdx) {
          var stepRow = document.createElement('div');
          stepRow.className = 'flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs';
          stepRow.innerHTML = '<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] flex-shrink-0 mt-0.5">Palier 0' + (sIdx + 1) + '</span>' +
            '<div><p class="font-bold text-white">' + st.who + '</p><p class="text-gray-300 mt-0.5 leading-relaxed">' + st.action + '</p></div>';
          stepsEl.appendChild(stepRow);
        });
      }

      rippleDetailModal.showModal();
      if (window.trackBYAIME) {
        window.trackBYAIME('aime_ecosystem_ripple_viewed', { id: rc.id });
      }
    }

    // =========================================================================
    // 3. TERRITORY RESOURCE FILTERING CONTROLLER
    // =========================================================================
    var territorySelect = document.getElementById('territory-category-selector');
    var territoryContainer = document.getElementById('territory-results-container');

    function renderTerritoryResources(filter) {
      if (!territoryContainer) return;
      territoryContainer.innerHTML = '';

      var items = defaultEcosystemModel.territoryResources.filter(function (item) {
        return filter === 'all' || !filter || item.category === filter;
      });

      if (items.length === 0) {
        territoryContainer.innerHTML = '<div class="col-span-2 p-6 rounded-2xl bg-white/5 text-center text-xs text-muted-foreground">Aucune ressource répertoriée dans cette catégorie.</div>';
        return;
      }

      items.forEach(function (res) {
        var card = document.createElement('div');
        card.className = 'p-5 md:p-6 rounded-3xl bg-black/85 backdrop-blur-xl border border-white/15 space-y-3 hover:border-emerald-400/40 transition-all text-xs';
        
        card.innerHTML = '<div class="flex justify-between items-start">' +
          '<span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 uppercase font-semibold">' + res.categoryLabel + '</span>' +
          '<span class="text-[11px] text-gray-400 font-mono">' + res.distance + '</span>' +
          '</div>' +
          '<div>' +
          '<h4 class="text-sm font-bold text-white tracking-tight">' + res.title + '</h4>' +
          '<p class="text-[11px] text-gray-300 font-mono mt-0.5">Par : ' + res.provider + '</p>' +
          '</div>' +
          '<p class="text-gray-300 leading-relaxed">' + res.description + '</p>' +
          '<div class="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">' +
          '<span class="text-emerald-400 font-mono italic">' + res.reciprocalNeed + '</span>' +
          '<span class="text-white font-bold">Disponible</span>' +
          '</div>';

        territoryContainer.appendChild(card);
      });
    }

    if (territorySelect) {
      territorySelect.addEventListener('change', function () {
        renderTerritoryResources(this.value);
      });
      renderTerritoryResources('all');
    }

    // =========================================================================
    // 4. INTERACTIVE 100-PERSON SIMULATOR
    // =========================================================================
    var sliderMut = document.getElementById('sim-slider-mutualisation');
    var sliderSkl = document.getElementById('sim-slider-skills');
    var sliderSpc = document.getElementById('sim-slider-space');

    var valMut = document.getElementById('sim-val-mutualisation');
    var valSkl = document.getElementById('sim-val-skills');
    var valSpc = document.getElementById('sim-val-space');

    var outScore = document.getElementById('sim-out-score');
    var outObjects = document.getElementById('sim-out-objects');
    var outHours = document.getElementById('sim-out-hours');
    var outSpaces = document.getElementById('sim-out-spaces');
    var outGainIndex = document.getElementById('sim-out-gain-index');

    function updateSimulation() {
      var m = sliderMut ? parseInt(sliderMut.value, 10) : defaultEcosystemModel.simulationDefaults.mutualisationPct;
      var s = sliderSkl ? parseInt(sliderSkl.value, 10) : defaultEcosystemModel.simulationDefaults.skillsPct;
      var sp = sliderSpc ? parseInt(sliderSpc.value, 10) : defaultEcosystemModel.simulationDefaults.spacePct;

      if (valMut) valMut.textContent = m + ' %';
      if (valSkl) valSkl.textContent = s + ' %';
      if (valSpc) valSpc.textContent = sp + ' %';

      var res = calculateEcosystemBalance(m, s, sp);

      if (outScore) outScore.textContent = res.reciprocityScore + ' / 100';
      if (outObjects) outObjects.textContent = res.sharedObjects;
      if (outHours) outHours.textContent = res.hoursShared + ' h';
      if (outSpaces) outSpaces.textContent = res.spacesUtilized;
      if (outGainIndex) outGainIndex.textContent = res.energyPreservedIndex + ' pts';
    }

    if (sliderMut) sliderMut.addEventListener('input', updateSimulation);
    if (sliderSkl) sliderSkl.addEventListener('input', updateSimulation);
    if (sliderSpc) sliderSpc.addEventListener('input', updateSimulation);

    updateSimulation();

    // =========================================================================
    // 5. TRANSPARENCY PROOF LEDGER TIMELINE
    // =========================================================================
    var ledgerContainer = document.getElementById('ecosystem-ledger-timeline');

    if (ledgerContainer) {
      ledgerContainer.innerHTML = '';
      var checkIconSvg = getIconSvg('verified') || getIconSvg('check');

      defaultEcosystemModel.ledgerFeed.forEach(function (item) {
        var row = document.createElement('div');
        row.className = 'p-4 rounded-2xl bg-zinc-950/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-white/25 transition-all';
        
        row.innerHTML = '<div class="flex items-start gap-3.5">' +
          '<span class="font-mono text-emerald-400 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">' + item.time + '</span>' +
          '<div>' +
          '<div class="flex items-center gap-2">' +
          '<span class="text-white font-bold">' + item.actor + '</span>' +
          '<span class="text-[10px] text-gray-400 font-mono">(' + item.stage + ' • ' + item.level + ')</span>' +
          '</div>' +
          '<p class="text-gray-300 mt-0.5 leading-relaxed">' + item.action + '</p>' +
          '</div>' +
          '</div>' +
          '<div class="flex items-center gap-1.5 flex-shrink-0">' +
          checkIconSvg +
          '<span class="text-emerald-300 font-mono text-[11px] font-semibold">' + item.status + '</span>' +
          '</div>';

        ledgerContainer.appendChild(row);
      });
    }

    if (window.trackBYAIME) {
      window.trackBYAIME('aime_ecosystem_page_viewed', {});
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('ecosystem-simulator-box') || document.getElementById('eco-root-intent')) {
      initEcosystemUI();
    }
  });

  window.AIME_Ecosystem = {
    model: defaultEcosystemModel,
    calculateBalance: calculateEcosystemBalance
  };

})();
