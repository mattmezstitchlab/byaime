// ===== BYAIME — AIME ÉCOSYSTÈME : Modèle de Contribution & Réciprocité (v1.0) =====
// Autonomous Simulation & Interactive Demonstration of the Mutual Contribution Network

(function () {
  'use strict';

  var ECOSYSTEM_STORAGE_KEY = 'byaime_ecosystem_state_v1';

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
        icon: '🧠',
        initiator: { name: 'Matt Mez', action: 'Anime un atelier de design d\'interfaces poétiques et sound design' },
        steps: [
          { who: 'Collectif de jeunes artistes', action: 'Apprend à concevoir une scénographie numérique' },
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
        icon: '🛠️',
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
        icon: '❤️',
        initiator: { name: 'Camille R.', action: 'Anime un cercle d\'écoute et de recueil de mémoires de quartier' },
        steps: [
          { who: 'Henri (82 ans)', action: 'Raconte ses anecdotes d\'artisanat et sort de 3 mois d\'isolement' },
          { who: 'Léa (22 ans, étudiante)', action: 'Numérise et enregistre son témoignage audio pour les archives' },
          { who: 'Classes du quartier', action: 'Écoutent l\'archive vivante lors d\'un projet pédagogique' }
        ],
        impactSummary: '1 heure d\'écoute humaine ➔ du lien vivant retissé entre trois générations.'
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

  // Helper Simulator Calculation
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

  // UI Controller for /ecosysteme
  function initEcosystemUI() {
    var simContainer = document.getElementById('ecosystem-simulator-box');
    var rippleCardsContainer = document.getElementById('ripple-cases-container');
    var rippleDetailModal = document.getElementById('modal-ripple-detail');
    var ledgerContainer = document.getElementById('ecosystem-ledger-timeline');

    // 1. Interactive Ripple Effect Cards (Réseau Invisible)
    if (rippleCardsContainer) {
      rippleCardsContainer.innerHTML = '';

      defaultEcosystemModel.rippleCases.forEach(function (rc, idx) {
        var card = document.createElement('div');
        card.className = 'p-6 md:p-8 rounded-3xl bg-black border border-white/10 glow-card hover:border-white/30 transition-all flex flex-col justify-between space-y-6 cursor-pointer group';
        
        card.innerHTML = '<div>' +
          '<div class="flex justify-between items-center mb-3">' +
          '<span class="text-xs font-mono font-bold text-emerald-400">Cas 0' + (idx + 1) + '</span>' +
          '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white uppercase">' + rc.categoryLabel + '</span>' +
          '</div>' +
          '<div class="flex items-center gap-3">' +
          '<span class="text-3xl p-2 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">' + rc.icon + '</span>' +
          '<h3 class="text-base font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">' + rc.title + '</h3>' +
          '</div>' +
          '<div class="mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">' +
          '<span class="text-[10px] uppercase font-mono text-muted-foreground">Action Initiale :</span>' +
          '<p class="text-xs text-gray-200"><strong class="text-white">' + rc.initiator.name + ' :</strong> ' + rc.initiator.action + '</p>' +
          '</div>' +
          '<div class="mt-3 space-y-1.5">' +
          '<span class="text-[10px] uppercase font-mono text-emerald-400">Effet Cascade (' + rc.steps.length + ' paliers) :</span>' +
          '<p class="text-xs text-muted-foreground italic leading-relaxed">' + rc.impactSummary + '</p>' +
          '</div>' +
          '</div>' +
          '<div class="pt-4 border-t border-white/10 flex items-center justify-between text-xs">' +
          '<span class="text-muted-foreground">Explorer la chaîne d\'impact</span>' +
          '<span class="text-white font-bold group-hover:translate-x-1 transition-transform">Détails →</span>' +
          '</div>';

        card.addEventListener('click', function () {
          openRippleDetailModal(rc);
        });

        rippleCardsContainer.appendChild(card);
      });
    }

    // Modal Ripple Cascade Details
    function openRippleDetailModal(rc) {
      if (!rippleDetailModal) return;

      var titleEl = document.getElementById('rip-det-title');
      var catEl = document.getElementById('rip-det-cat');
      var initEl = document.getElementById('rip-det-initiator');
      var stepsEl = document.getElementById('rip-det-steps');
      var summaryEl = document.getElementById('rip-det-summary');

      if (titleEl) titleEl.textContent = rc.icon + ' ' + rc.title;
      if (catEl) catEl.textContent = rc.categoryLabel.toUpperCase();
      if (initEl) initEl.innerHTML = '<strong class="text-white">' + rc.initiator.name + ' :</strong> ' + rc.initiator.action;
      if (summaryEl) summaryEl.textContent = rc.impactSummary;

      if (stepsEl) {
        stepsEl.innerHTML = '';
        rc.steps.forEach(function (st, sIdx) {
          var stepRow = document.createElement('div');
          stepRow.className = 'flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs';
          stepRow.innerHTML = '<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] flex-shrink-0 mt-0.5">Palier ' + (sIdx + 1) + '</span>' +
            '<div><p class="font-bold text-white">' + st.who + '</p><p class="text-muted-foreground mt-0.5">' + st.action + '</p></div>';
          stepsEl.appendChild(stepRow);
        });
      }

      rippleDetailModal.showModal();
      if (window.trackBYAIME) {
        window.trackBYAIME('aime_ecosystem_ripple_viewed', { id: rc.id });
      }
    }

    // 2. Interactive Simulator (Simulateur d'Écosystème & Réciprocité)
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

    // Initial calculation
    updateSimulation();

    // 3. Render Transparency Ledger (Registre de Preuve Horodaté)
    if (ledgerContainer) {
      ledgerContainer.innerHTML = '';

      defaultEcosystemModel.ledgerFeed.forEach(function (item, idx) {
        var row = document.createElement('div');
        row.className = 'p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs';
        
        row.innerHTML = '<div class="flex items-start gap-3">' +
          '<span class="font-mono text-emerald-400 text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">' + item.time + '</span>' +
          '<div>' +
          '<div class="flex items-center gap-2">' +
          '<span class="text-white font-bold">' + item.actor + '</span>' +
          '<span class="text-[10px] text-muted-foreground font-mono">(' + item.stage + ' • ' + item.level + ')</span>' +
          '</div>' +
          '<p class="text-muted-foreground mt-0.5">' + item.action + '</p>' +
          '</div>' +
          '</div>' +
          '<div class="flex items-center gap-1.5 flex-shrink-0">' +
          '<span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>' +
          '<span class="text-emerald-300 font-mono text-[11px]">' + item.status + '</span>' +
          '</div>';

        ledgerContainer.appendChild(row);
      });
    }

    if (window.trackBYAIME) {
      window.trackBYAIME('aime_ecosystem_page_viewed', {});
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('ecosystem-simulator-box') || document.getElementById('ripple-cases-container')) {
      initEcosystemUI();
    }
  });

  // Global Export
  window.AIME_Ecosystem = {
    model: defaultEcosystemModel,
    calculateBalance: calculateEcosystemBalance
  };

})();
