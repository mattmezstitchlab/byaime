// ===== BYAIME — AIME PATH : Moteur de Choix Adaptatifs & Navigation Guidée =====
// Implements the adaptive decision tree in the Hero of index.html, transforming progressive choices into a StructuredIntent.

(function () {
  'use strict';

  var DECISION_TREE = {
    // Niveau 0 : Nature fondamentale
    level0: {
      title: 'Qu\'avez-vous envie de créer ?',
      subtitle: 'Sélectionnez la nature de votre moment singulier :',
      options: [
        { id: 'mariage', title: 'Mariage Singulier', desc: 'Union, célébration à deux, fête intimiste ou grandiose', icon: '💍', type: 'mariage' },
        { id: 'ceremonie', title: 'Cérémonie & Hommage', desc: 'Mémorial apaisé, recueillement, transmission de mémoires', icon: '🕊️', type: 'ceremonie' },
        { id: 'anniversaire', title: 'Anniversaire d\'Exception', desc: 'Cap de vie, célébration surprise, retrouvailles', icon: '✨', type: 'anniversaire' },
        { id: 'evenement', title: 'Événement Culturel', desc: 'Rencontres, festival artistique, salon indépendant', icon: '🎪', type: 'evenement' },
        { id: 'festival', title: 'Festival & Rassemblement', desc: 'Plein air, programmation musicale, public nombreux', icon: '🎵', type: 'festival' },
        { id: 'artistique', title: 'Projet Artistique', desc: 'Scénographie d\'œuvres, exposition, performance', icon: '🎨', type: 'artistique' },
        { id: 'association', title: 'Cause & Association', desc: 'Mobilisation citoyenne, plaidoyer, récits d\'impact', icon: '🤝', type: 'association' },
        { id: 'professionnel', title: 'Projet Professionnel', desc: 'Lancement d\'initiative, keynotes, vitrine statutaire', icon: '💼', type: 'professionnel' },
        { id: 'autre', title: 'Autre Création Libre', desc: 'Une intuition originale qui ne rentre dans aucune case', icon: '🌌', type: 'autre' },
        { id: 'indecis', title: 'Je ne sais pas encore', desc: 'Surprenez-moi : partons d\'une page blanche ensemble', icon: '🧭', type: 'indecis' }
      ]
    },

    // Niveau 1 : Pour qui ?
    level1: function (ctx) {
      return {
        title: 'Pour qui imaginez-vous cette expérience ?',
        subtitle: 'Précisez le cercle de personnes concernées :',
        options: [
          { id: 'aud_proches', title: 'Pour mes proches', desc: 'Cercle intime, famille et amis choisis (10 à 100 pers.)', icon: '👥', val: 'Mes proches' },
          { id: 'aud_famille', title: 'Pour ma famille', desc: 'Transmission intergénérationnelle et recueillement', icon: '🏡', val: 'Ma famille' },
          { id: 'aud_communaute', title: 'Pour une communauté', desc: 'Membres engagés, sympathisants ou réseau (100 à 500 pers.)', icon: '🌐', val: 'Une communauté' },
          { id: 'aud_public', title: 'Pour le grand public', desc: 'Visiteurs, festivaliers ou spectateurs ouverts (500+ pers.)', icon: '🎟️', val: 'Un public' },
          { id: 'aud_surprenez', title: 'À définir ensemble', desc: 'Nous affinerons l\'audience au fil de la création', icon: '🧭', val: 'Mes proches' }
        ]
      };
    },

    // Niveau 2 : Intention directrice
    level2: function (ctx) {
      var t = ctx.type || 'mariage';
      var opts = [];

      if (t === 'mariage') {
        opts = [
          { id: 'int_organiser', title: 'Organiser & Coordonner le Jour J', desc: 'Timeline vivante, plan de table et fluidité logistique', icon: '⏱️', val: 'Organiser' },
          { id: 'int_partager', title: 'Partager & Émouvoir', desc: 'Musique d\'ambiance, récit à deux et livre d\'or vocal', icon: '🎵', val: 'Partager' },
          { id: 'int_souvenirs', title: 'Créer des Souvenirs Éternels', desc: 'Galerie photo HD participative et archives de vie', icon: '📸', val: 'Créer des souvenirs' },
          { id: 'int_tout', title: 'Expérience Immersive Totale', desc: 'Réunir toute l\'histoire sous un ciel étoilé interactif', icon: '🌌', val: 'Créer une expérience' }
        ];
      } else if (t === 'ceremonie') {
        opts = [
          { id: 'int_recueillement', title: 'Recueillement & Hommage', desc: 'Bougies virtuelles, biographie et mots choisis', icon: '🕯️', val: 'Émouvoir' },
          { id: 'int_memoires', title: 'Raconter l\'Histoire & Transmettre', desc: 'Recueil d\'anecdotes familiales et photos d\'époque', icon: '📖', val: 'Créer des souvenirs' },
          { id: 'int_audio_partage', title: 'Relier les Proches Éloignés', desc: 'Retransmission audio discrète et livre de condoléances', icon: '🎧', val: 'Partager' }
        ];
      } else if (t === 'anniversaire') {
        opts = [
          { id: 'int_surprise', title: 'Garder la Surprise Totale', desc: 'Énigmes pour révéler le lieu secret et vidéos cachées', icon: '🎁', val: 'Faire participer' },
          { id: 'int_fete', title: 'Créer une Dynamique Festive', desc: 'Boîte à sons collective et cagnotte élégante', icon: '🎉', val: 'Créer une expérience' },
          { id: 'int_retrospective', title: 'Rétrospective des Années', desc: 'Frise chronologique animée des étapes marquantes', icon: '🕰️', val: 'Créer des souvenirs' }
        ];
      } else if (t === 'festival' || t === 'evenement') {
        opts = [
          { id: 'int_guide_live', title: 'Guider en Direct (Live & Offline)', desc: 'Programme dynamique, carte des scènes sans réseau', icon: '🗺️', val: 'Informer' },
          { id: 'int_artistes_sons', title: 'Mettre en Lumière les Artistes', desc: 'Fiches immersives et extraits musicaux en écoute', icon: '🎨', val: 'Créer une expérience' },
          { id: 'int_billets_acces', title: 'Accès & Billetterie Fluide', desc: 'Réservation immédiate et gestion des flux', icon: '🎟️', val: 'Organiser' }
        ];
      } else if (t === 'association') {
        opts = [
          { id: 'int_recits_impact', title: 'Récits de Terrain & Impact', desc: 'Témoignages vivants et visualiseur d\'impact en direct', icon: '📊', val: 'Raconter une histoire' },
          { id: 'int_mobiliser', title: 'Mobiliser & Fédérer', desc: 'Module d\'adhésion, manifeste et mur des soutiens', icon: '🤝', val: 'Rassembler' }
        ];
      } else {
        opts = [
          { id: 'int_creer_libre', title: 'Façonner une Expérience Inédite', desc: 'Micro-interactions sensorielles et liberté totale', icon: '✦', val: 'Créer une expérience' },
          { id: 'int_raconter', title: 'Raconter une Histoire Singulière', desc: 'Storytelling immersif articulé autour de votre vision', icon: '📖', val: 'Raconter une histoire' }
        ];
      }

      opts.push({ id: 'int_libre_indecis', title: 'Surprenez-moi', desc: 'Laissez AIME explorer la meilleure intention', icon: '🧭', val: 'Partager' });

      return {
        title: 'Que voulez-vous faire vivre en priorité ?',
        subtitle: 'Définissez le cœur battant de l\'expérience :',
        options: opts
      };
    },

    // Niveau 3 : Dispositif signature clé
    level3: function (ctx) {
      var t = ctx.type || 'mariage';
      var opts = [];

      if (t === 'mariage') {
        opts = [
          { id: 'disp_timeline_live', title: 'Timeline Vivante & Synchronisée', desc: 'Horaires, alertes et repères spatiaux le jour J', icon: '⏱️', module: 'timeline', signal: 'Timeline vivante' },
          { id: 'disp_vinyle_vocal', title: 'Livre d\'Or Vocal & Vinyle Virtuel', desc: 'Les messages des proches enregistrés pour toujours', icon: '🎙️', module: 'guestbook', signal: 'Livre vocal' },
          { id: 'disp_ciel_etoile', title: 'Ciel Étoilé & Plan de Table Céleste', desc: 'Chaque invité découvre sa place dans une constellation', icon: '🌌', module: 'tables', signal: 'Plan astral' },
          { id: 'disp_boite_sons', title: 'Boîte à Musique & Ambiance Sonore', desc: 'Sound design spatialisé et playlist des mariés', icon: '🎵', module: 'music', signal: 'Musique ambiante' }
        ];
      } else if (t === 'ceremonie') {
        opts = [
          { id: 'disp_bougies', title: 'Bougies Virtuelles & Pensées', desc: 'Un geste doux posé par les proches du monde entier', icon: '🕯️', module: 'tributes', signal: 'Bougies virtuelles' },
          { id: 'disp_retransmission', title: 'Retransmission Audio HD & Podcasts', desc: 'Écoute apaisée pour les proches ne pouvant être présents', icon: '🎧', module: 'audio', signal: 'Retransmission audio' },
          { id: 'disp_livret_pdf', title: 'Livret Mémoriel Imprimable Relié', desc: 'Génération automatique d\'un document d\'art en souvenir', icon: '📜', module: 'memories', signal: 'Livret souvenir' }
        ];
      } else if (t === 'anniversaire') {
        opts = [
          { id: 'disp_enigmes', title: 'Coffre-Fort & Énigmes Secrètes', desc: 'Révélation progressive du lieu au fil des semaines', icon: '🔐', module: 'video', signal: 'Énigmes lieu secret' },
          { id: 'disp_playlist_live', title: 'Boîte à Sons & Vœux Vidéos', desc: 'Suggestions musicales et messages secrets des amis', icon: '🎬', module: 'music', signal: 'Vidéos surprises' }
        ];
      } else {
        opts = [
          { id: 'disp_pwa_offline', title: 'Application Web Ultra-Rapide (PWA)', desc: 'Fonctionne 100% hors-ligne même sans réseau', icon: '⚡', module: 'program', signal: 'Mode offline PWA' },
          { id: 'disp_interactive_map', title: 'Cartographie & Scénographie Digitale', desc: 'Repères géolocalisés et parcours immersif', icon: '🗺️', module: 'map', signal: 'Carte interactive' }
        ];
      }

      opts.push({ id: 'disp_surprenez_all', title: 'Dispositif Sur Mesure', desc: 'AIME concevra une interaction signature exclusive', icon: '✦', module: 'timeline', signal: 'Dispositif signature' });

      return {
        title: 'Quel dispositif interactif vous inspire ?',
        subtitle: 'L\'interaction clé qui rendra votre univers inoubliable :',
        options: opts
      };
    },

    // Niveau 4 : Ambiance & Lumière
    level4: function (ctx) {
      return {
        title: 'Quelle ambiance sensorielle imaginez-vous ?',
        subtitle: 'Choisissez la matière visuelle et la lumière :',
        options: [
          { id: 'atmo_poetique', title: 'Poétique & Céleste', desc: 'Tons chauds, contrastes doux, respiration feutrée', icon: '🌙', val: 'poetique' },
          { id: 'atmo_minimaliste', title: 'Minimaliste & Épurée', desc: 'Fond noir profond, typographie statutaire, silence', icon: '🖤', val: 'minimaliste' },
          { id: 'atmo_cinematique', title: 'Cinématique & Immersive', desc: 'Micro-interactions sensorielles, sound design réactif', icon: '🎬', val: 'cinematique' },
          { id: 'atmo_vibrante', title: 'Vibrante & Festive', desc: 'Rythme affirmé, contrastes éclatants et énergie', icon: '⚡', val: 'vibrante' },
          { id: 'atmo_elegante', title: 'Élégante & Statutaire', desc: 'Typographie d\'auteur, précision chirurgicale', icon: '🏛️', val: 'elegante' },
          { id: 'atmo_libre', title: 'Libre & Organique', desc: 'Façonnée sur mesure sans contrainte préétablie', icon: '🌿', val: 'libre' }
        ]
      };
    }
  };

  // State Manager for AIME PATH
  var aimePathState = {
    source: 'guided',
    selections: [], // [{ step: 0, optionId: 'mariage', data: {...} }, ...]
    context: {
      type: 'mariage',
      audience: 'Mes proches',
      intentions: ['Organiser'],
      atmosphere: 'poetique',
      level: 'interactif',
      signals: [],
      modules: []
    },
    confidence: 1.0
  };

  // Build StructuredIntent from Accumulated AIME PATH State
  function convertStateToStructuredIntent() {
    var ctx = aimePathState.context;
    var rawTextParts = aimePathState.selections.map(function (s) {
      return s.data.title || s.optionId;
    });

    var summary = 'Projet ' + (ctx.type || 'sur mesure') + ' pour ' + ctx.audience.toLowerCase() + ', orienté vers ' + ctx.intentions.join(', ') + ' dans une ambiance ' + ctx.atmosphere + '.';

    return {
      summary: summary,
      eventType: {
        value: ctx.type || 'mariage',
        confidence: 0.98
      },
      audience: {
        value: ctx.audience || 'Mes proches',
        confidence: 0.95
      },
      intentions: (ctx.intentions || ['Organiser']).map(function (i) {
        return { value: i, confidence: 0.95 };
      }),
      experience: {
        atmosphere: ctx.atmosphere || 'poetique',
        level: ctx.level || 'interactif'
      },
      signals: ctx.signals.slice(0, 5),
      constraints: [],
      missingInformation: [],
      rawIntent: 'AIME PATH : ' + rawTextParts.join(' ➔ ')
    };
  }

  // Recalculate Context from Selections
  function recalculateContext() {
    var ctx = {
      type: 'mariage',
      audience: 'Mes proches',
      intentions: [],
      atmosphere: 'poetique',
      level: 'interactif',
      signals: [],
      modules: []
    };

    aimePathState.selections.forEach(function (sel) {
      var d = sel.data || {};
      if (sel.step === 0 && d.type) ctx.type = d.type;
      if (sel.step === 1 && d.val) ctx.audience = d.val;
      if (sel.step === 2 && d.val) {
        if (ctx.intentions.indexOf(d.val) === -1) ctx.intentions.push(d.val);
      }
      if (sel.step === 3) {
        if (d.module && ctx.modules.indexOf(d.module) === -1) ctx.modules.push(d.module);
        if (d.signal && ctx.signals.indexOf(d.signal) === -1) ctx.signals.push(d.signal);
      }
      if (sel.step === 4 && d.val) ctx.atmosphere = d.val;
    });

    if (ctx.intentions.length === 0) ctx.intentions = ['Organiser', 'Partager'];
    aimePathState.context = ctx;
  }

  // UI Controller for Hero AIME PATH
  function initHeroAimePath() {
    var heroPathContainer = document.getElementById('hero-aime-path-container');
    if (!heroPathContainer) return;

    var stepsContainer = document.getElementById('path-steps-container');
    var breadcrumbsContainer = document.getElementById('path-breadcrumbs');
    var synthesisBox = document.getElementById('path-synthesis-box');
    var synthesisText = document.getElementById('path-synthesis-text');
    var suggestionsContainer = document.getElementById('path-suggestions-tags');
    var launchBtn = document.getElementById('path-launch-btn');

    function renderCurrentStep() {
      var currentStepIdx = aimePathState.selections.length;
      if (!stepsContainer) return;

      stepsContainer.innerHTML = '';

      // Check if all 5 steps completed
      if (currentStepIdx >= 5) {
        renderCompletedState();
        return;
      }

      var stepConfig;
      if (currentStepIdx === 0) stepConfig = DECISION_TREE.level0;
      else if (currentStepIdx === 1) stepConfig = DECISION_TREE.level1(aimePathState.context);
      else if (currentStepIdx === 2) stepConfig = DECISION_TREE.level2(aimePathState.context);
      else if (currentStepIdx === 3) stepConfig = DECISION_TREE.level3(aimePathState.context);
      else if (currentStepIdx === 4) stepConfig = DECISION_TREE.level4(aimePathState.context);

      if (!stepConfig) return;

      var stepWrap = document.createElement('div');
      stepWrap.className = 'space-y-4 animate-fadeIn';
      stepWrap.innerHTML = '<div>' +
        '<div class="flex items-center gap-2">' +
        '<span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">Étape 0' + (currentStepIdx + 1) + ' / 05</span>' +
        '<span class="text-xs text-muted-foreground font-mono">Choix adaptatif</span>' +
        '</div>' +
        '<h3 class="text-lg md:text-xl font-bold text-white tracking-tight mt-1">' + stepConfig.title + '</h3>' +
        '<p class="text-xs text-muted-foreground mt-0.5">' + stepConfig.subtitle + '</p>' +
        '</div>';

      var grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2';

      stepConfig.options.forEach(function (opt) {
        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/40 hover:bg-white/[0.06] text-left transition-all group flex items-start gap-3';
        card.innerHTML = '<span class="text-xl p-1.5 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform flex-shrink-0">' + (opt.icon || '✦') + '</span>' +
          '<div class="flex-1">' +
          '<p class="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">' + opt.title + '</p>' +
          '<p class="text-[11px] text-muted-foreground mt-0.5 leading-snug">' + opt.desc + '</p>' +
          '</div>';

        card.addEventListener('click', function () {
          // Record selection
          aimePathState.selections.push({
            step: currentStepIdx,
            optionId: opt.id,
            data: opt
          });
          recalculateContext();
          renderBreadcrumbs();
          updateSynthesis();
          renderCurrentStep();
          window.trackBYAIME('aime_path_step_selected', { step: currentStepIdx, option: opt.id });
        });

        grid.appendChild(card);
      });

      stepWrap.appendChild(grid);
      stepsContainer.appendChild(stepWrap);
    }

    function renderBreadcrumbs() {
      if (!breadcrumbsContainer) return;
      breadcrumbsContainer.innerHTML = '';

      if (aimePathState.selections.length === 0) {
        breadcrumbsContainer.innerHTML = '<span class="text-xs text-muted-foreground italic">Cliquez sur une direction pour commencer...</span>';
        return;
      }

      aimePathState.selections.forEach(function (sel, idx) {
        var chip = document.createElement('span');
        chip.className = 'tag-removable cursor-pointer';
        chip.innerHTML = '<span>' + (sel.data.icon || '') + ' ' + sel.data.title + '</span><button type="button" class="tag-remove-btn" title="Modifier ce choix" aria-label="Supprimer">×</button>';

        var removeBtn = chip.querySelector('button');
        removeBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          // Prune all selections from this index onwards
          aimePathState.selections = aimePathState.selections.slice(0, idx);
          recalculateContext();
          renderBreadcrumbs();
          updateSynthesis();
          renderCurrentStep();
          window.trackBYAIME('aime_path_branch_changed', { prunedFromStep: idx });
        });

        breadcrumbsContainer.appendChild(chip);
      });
    }

    function updateSynthesis() {
      if (!synthesisBox || !synthesisText) return;

      if (aimePathState.selections.length === 0) {
        synthesisBox.classList.add('hidden');
        return;
      }

      synthesisBox.classList.remove('hidden');
      var ctx = aimePathState.context;
      var statement = 'AIME comprend : Vous concevez une expérience ' + ctx.type.toUpperCase() + ' pour ' + ctx.audience.toLowerCase() + ', axée sur ' + ctx.intentions.join(' et ') + ' dans une ambiance ' + ctx.atmosphere + '.';
      synthesisText.textContent = statement;

      // Render module suggestions
      if (suggestionsContainer && window.AIME_Engine) {
        suggestionsContainer.innerHTML = '';
        var dummyProj = window.AIME_Engine.createProjectModel({ type: ctx.type, intentions: ctx.intentions });
        var rec = window.AIME_Engine.recommendModules(dummyProj);
        var topMods = Object.keys(rec.scores).filter(function (k) { return rec.scores[k] >= 75; }).slice(0, 4);

        topMods.forEach(function (mId) {
          var mod = window.AIME_Engine.moduleRegistry[mId] || { name: mId, icon: '✨' };
          var tag = document.createElement('span');
          tag.className = 'text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300';
          tag.textContent = (mod.icon || '✨') + ' ' + mod.name;
          suggestionsContainer.appendChild(tag);
        });
      }
    }

    function renderCompletedState() {
      if (!stepsContainer) return;
      stepsContainer.innerHTML = '';

      var completedWrap = document.createElement('div');
      completedWrap.className = 'p-6 rounded-3xl bg-zinc-950 border border-emerald-500/30 text-center space-y-4 glow-card';
      completedWrap.innerHTML = '<div class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto">' +
        '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>' +
        '</div>' +
        '<h4 class="text-lg font-bold text-white tracking-tight">Votre intention est parfaitement structurée.</h4>' +
        '<p class="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">AIME PATH a généré l\'intention idéale. Cliquez ci-dessous pour lancer AIME CONCEPT et explorer les 3 directions créatives adaptées.</p>' +
        '<div class="pt-2">' +
        '<button id="btn-path-finalize-cta" type="button" class="px-8 py-3.5 rounded-full bg-white text-xs font-bold text-black hover:bg-white/90 transition-all glow-subtle">' +
        '✦ Construire cette idée avec AIME →' +
        '</button>' +
        '</div>';

      var finalizeBtn = completedWrap.querySelector('#btn-path-finalize-cta');
      if (finalizeBtn) {
        finalizeBtn.addEventListener('click', function () {
          launchAimeFromPath();
        });
      }

      stepsContainer.appendChild(completedWrap);
    }

    function launchAimeFromPath() {
      var structuredIntent = convertStateToStructuredIntent();
      // Store in localStorage for /projet consumption
      try {
        localStorage.setItem('byaime_direct_intent', JSON.stringify(structuredIntent));
      } catch (e) {}

      window.trackBYAIME('aime_path_to_intent', { eventType: structuredIntent.eventType.value });
      // Redirect to /projet
      window.location.href = '/projet?from=aime_path';
    }

    if (launchBtn) {
      launchBtn.addEventListener('click', function () {
        launchAimeFromPath();
      });
    }

    // Initialize Hero AIME PATH UI
    renderBreadcrumbs();
    renderCurrentStep();
  }

  // Auto-initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    initHeroAimePath();
  });

  // Export AIME_Path globally
  window.AIME_Path = {
    state: aimePathState,
    tree: DECISION_TREE,
    convertStateToStructuredIntent: convertStateToStructuredIntent,
    recalculateContext: recalculateContext
  };

})();
