// ===== BYAIME — AIME PATH : Moteur de Choix Adaptatifs & Navigation Guidée (v2.0) =====
// Progressive disclosure decision engine that builds a StructuredIntent through contextual choices.

(function () {
  'use strict';

  // Module Registry reference
  var REGISTRY = (window.AIME_Engine && window.AIME_Engine.moduleRegistry) ? window.AIME_Engine.moduleRegistry : {};

  // State
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
    availableNextSteps: [],
    confidence: 1.0
  };

  // Adaptive Decision Tree Nodes
  function getDynamicStepConfig(selections, context) {
    var stepIdx = selections.length;

    // Niveau 0 : QU'AVEZ-VOUS ENVIE DE CRÉER ?
    if (stepIdx === 0) {
      return {
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
      };
    }

    // Niveau 1 : Pour qui ?
    if (stepIdx === 1) {
      var eventType = context.type || 'mariage';
      var audOpts = [];

      if (eventType === 'mariage') {
        audOpts = [
          { id: 'aud_proches', title: 'Pour nos proches & amis', desc: 'Cercle intime et invités de cœur (20 à 120 pers.)', icon: '👥', val: 'Mes proches' },
          { id: 'aud_famille', title: 'Pour notre famille', desc: 'Célébration chaleureuse et intergénérationnelle', icon: '🏡', val: 'Ma famille' },
          { id: 'aud_grande_fete', title: 'Pour une grande fête', desc: 'Nombreux convives venant de différentes régions (120+ pers.)', icon: '🥂', val: 'Une communauté' }
        ];
      } else if (eventType === 'ceremonie') {
        audOpts = [
          { id: 'aud_famille_hommage', title: 'Pour la famille & proches', desc: 'Recueillement intime et bienveillant', icon: '🕊️', val: 'Ma famille' },
          { id: 'aud_proches_distance', title: 'Pour les proches éloignés', desc: 'Permettre à ceux qui sont loin de s\'unir à la mémoire', icon: '🌐', val: 'Mes proches' }
        ];
      } else if (eventType === 'anniversaire') {
        audOpts = [
          { id: 'aud_amis_proches', title: 'Pour le groupe d\'amis', desc: 'Complices, amis d\'enfance et proches', icon: '🎉', val: 'Mes proches' },
          { id: 'aud_famille_amis', title: 'Famille et amis réunis', desc: 'Grande célébration intergénérationnelle', icon: '✨', val: 'Ma famille' }
        ];
      } else if (eventType === 'festival' || eventType === 'evenement') {
        audOpts = [
          { id: 'aud_public_fest', title: 'Pour le grand public', desc: 'Festivaliers, curieux et passionnés', icon: '🎟️', val: 'Un public' },
          { id: 'aud_communaute_art', title: 'Pour une communauté d\'artistes', desc: 'Réseau créatif et partenaires', icon: '🎨', val: 'Une communauté' }
        ];
      } else {
        audOpts = [
          { id: 'aud_general_proches', title: 'Pour mes proches', desc: 'Cercle intime et personnes de confiance', icon: '👥', val: 'Mes proches' },
          { id: 'aud_general_communaute', title: 'Pour une communauté', desc: 'Public ciblé ou membres adhérents', icon: '🌐', val: 'Une communauté' }
        ];
      }

      audOpts.push({ id: 'aud_surprenez_all', title: 'Surprenez-moi', desc: 'AIME calibrera l\'audience selon le projet', icon: '🧭', val: 'Mes proches' });

      return {
        title: 'Pour qui imaginez-vous cette expérience ?',
        subtitle: 'Précisez l\'audience et les personnes concernées :',
        options: audOpts
      };
    }

    // Niveau 2 : Intention directrice
    if (stepIdx === 2) {
      var eType = context.type || 'mariage';
      var intOpts = [];

      if (eType === 'mariage') {
        intOpts = [
          { id: 'int_organiser', title: 'Organiser & Coordonner', desc: 'Programme, déroulé, plan de table et fluidité logistique', icon: '⏱️', val: 'Organiser' },
          { id: 'int_partager', title: 'Partager & Émouvoir', desc: 'Musique d\'ambiance, récit à deux et livre d\'or vocal', icon: '🎵', val: 'Partager' },
          { id: 'int_histoire', title: 'Raconter notre histoire', desc: 'Storytelling immersif, photos d\'archives et anecdotes', icon: '📖', val: 'Raconter une histoire' },
          { id: 'int_souvenirs', title: 'Créer des souvenirs éternels', desc: 'Galerie photo HD participative et livre de vœux', icon: '📸', val: 'Créer des souvenirs' },
          { id: 'int_reunir', title: 'Tout réunir en un seul lieu', desc: 'L\'expérience complète combinant déroulé, musique et partage', icon: '🌌', val: 'Créer une expérience' }
        ];
      } else if (eType === 'ceremonie') {
        intOpts = [
          { id: 'int_recueillement', title: 'Recueillement & Hommage', desc: 'Bougies virtuelles, biographie intime et pensées', icon: '🕯️', val: 'Émouvoir' },
          { id: 'int_souvenirs_mem', title: 'Raconter & Transmettre les souvenirs', desc: 'Anecdotes familiales, photos d\'époque et livret souvenir', icon: '📖', val: 'Créer des souvenirs' },
          { id: 'int_audio_homm', title: 'Relier les proches par l\'audio', desc: 'Retransmission sonore apaisée et registre de condoléances', icon: '🎧', val: 'Partager' }
        ];
      } else if (eType === 'anniversaire') {
        intOpts = [
          { id: 'int_celebrer', title: 'Célébrer & Fêter', desc: 'Dynamique festive, playlist collective et cagnotte', icon: '🎉', val: 'Créer une expérience' },
          { id: 'int_surprise', title: 'Garder la surprise absolue', desc: 'Énigmes pour révéler le lieu et coffre de vidéos secrètes', icon: '🎁', val: 'Faire participer' },
          { id: 'int_retrospect', title: 'Rétrospective des années', desc: 'Frise chronologique des étapes marquantes de la vie', icon: '🕰️', val: 'Créer des souvenirs' }
        ];
      } else if (eType === 'festival' || eType === 'evenement') {
        intOpts = [
          { id: 'int_guider_live', title: 'Guider en direct (Live & Offline)', desc: 'Programme dynamique, carte des scènes sans réseau', icon: '🗺️', val: 'Informer' },
          { id: 'int_artistes_expo', title: 'Mettre en valeur les artistes', desc: 'Fiches immersives et extraits musicaux en écoute', icon: '🎨', val: 'Créer une expérience' },
          { id: 'int_billetterie_acces', title: 'Accès & Billetterie fluide', desc: 'Réservation immédiate et gestion des accès', icon: '🎟️', val: 'Organiser' }
        ];
      } else if (eType === 'association') {
        intOpts = [
          { id: 'int_recits_impact', title: 'Récits de terrain & Preuves', desc: 'Témoignages vivants et visualiseur d\'impact direct', icon: '📊', val: 'Raconter une histoire' },
          { id: 'int_mobiliser', title: 'Mobiliser & Fédérer', desc: 'Module d\'adhésion, manifeste et mur des soutiens', icon: '🤝', val: 'Rassembler' }
        ];
      } else {
        intOpts = [
          { id: 'int_creer_inédit', title: 'Façonner une expérience inédite', desc: 'Scénographie interactive sur mesure et design d\'émotion', icon: '✦', val: 'Créer une expérience' },
          { id: 'int_raconter_libre', title: 'Raconter une histoire singulière', desc: 'Storytelling immersif articulé autour de votre vision', icon: '📖', val: 'Raconter une histoire' }
        ];
      }

      intOpts.push({ id: 'int_surprenez_opt', title: 'Surprenez-moi', desc: 'Laissez AIME définir la meilleure intention', icon: '🧭', val: 'Partager' });

      return {
        title: 'Que voulez-vous faire vivre en priorité ?',
        subtitle: 'Définissez le cœur battant de l\'univers :',
        options: intOpts
      };
    }

    // Niveau 3 : Point d'ancrage / Focus spécifique (Jour J, Souvenirs, Vidéos, Témoignages...)
    if (stepIdx === 3) {
      var lastSel = selections[2] ? selections[2].optionId : '';
      var evType = context.type || 'mariage';
      var focusOpts = [];

      if (evType === 'mariage') {
        if (lastSel === 'int_organiser') {
          focusOpts = [
            { id: 'foc_jour_j', title: 'Le Jour J & Le Déroulé', desc: 'La journée entière comme interface vivante synchronisée', icon: '⏱️', signal: 'Jour J' },
            { id: 'foc_invites_tables', title: 'Invités & Plan de Table', desc: 'Recherche de table par prénom et plan spatialisé', icon: '🍽️', signal: 'Plan de table' },
            { id: 'foc_programme_guide', title: 'Programme & Guide complet', desc: 'Hébergements, itinéraires et détails pratiques', icon: '📋', signal: 'Guide pratique' }
          ];
        } else if (lastSel === 'int_partager') {
          focusOpts = [
            { id: 'foc_musique_sons', title: 'Musique & Ambiance Sonore', desc: 'Lecteur audio immersif et boîte à sons partagée', icon: '🎵', signal: 'Musique' },
            { id: 'foc_vocal_messages', title: 'Livre d\'or Vocal', desc: 'Messages vocaux enregistrés par les proches', icon: '🎙️', signal: 'Livre vocal' },
            { id: 'foc_recit_deux', title: 'Récit à deux interactif', desc: 'L\'histoire du couple racontée avec poésie', icon: '✨', signal: 'Récit poétique' }
          ];
        } else {
          focusOpts = [
            { id: 'foc_galerie_live', title: 'Galerie & Dépôt Photos HD', desc: 'Upload direct sans compression pour les invités', icon: '📸', signal: 'Galerie HD' },
            { id: 'foc_souvenirs_capsule', title: 'Capsule & Archives', desc: 'Mémoire conservée pour les décennies à venir', icon: '🕰️', signal: 'Archives de vie' },
            { id: 'foc_jour_j_tout', title: 'Timeline & Musique réunies', desc: 'La symbiose du déroulé et du sound design', icon: '🌌', signal: 'Timeline et Musique' }
          ];
        }
      } else if (evType === 'ceremonie') {
        focusOpts = [
          { id: 'foc_temoignages_condoleances', title: 'Témoignages & Condoléances', desc: 'Recueil sécurisé où chacun dépose un souvenir', icon: '🕊️', signal: 'Témoignages' },
          { id: 'foc_bougies_lumieres', title: 'Bougies Virtuelles & Pensées', desc: 'Geste d\'hommage allumé par les proches du monde entier', icon: '🕯️', signal: 'Bougies virtuelles' },
          { id: 'foc_retransmission_audio', title: 'Retransmission Audio HD', desc: 'Diffusion sonore haute fidélité pour les absents', icon: '🎧', signal: 'Retransmission audio' }
        ];
      } else if (evType === 'anniversaire') {
        focusOpts = [
          { id: 'foc_videos_surprises', title: 'Coffre de Vidéos Surprises', desc: 'Capsules vidéo secrètes débloquées le jour J', icon: '🎬', signal: 'Vidéos surprises' },
          { id: 'foc_enigmes_lieu', title: 'Énigmes pour le Lieu Secret', desc: 'Indices progressifs pour faire monter le suspense', icon: '🔐', signal: 'Énigmes lieu' },
          { id: 'foc_playlist_fete', title: 'Boîte à Sons des Amis', desc: 'Sélection musicale collaborative pour la soirée', icon: '🎵', signal: 'Playlist collaborative' }
        ];
      } else {
        focusOpts = [
          { id: 'foc_carte_lieux', title: 'Cartographie & Lieux', desc: 'Repères interactifs et guidage fluide', icon: '🗺️', signal: 'Carte interactive' },
          { id: 'foc_programme_live', title: 'Programme en direct', desc: 'Horaires, artistes et alertes en direct', icon: '📋', signal: 'Programme dynamique' }
        ];
      }

      focusOpts.push({ id: 'foc_surprenez_foc', title: 'Je ne sais pas encore', desc: 'AIME choisira le point d\'ancrage idéal', icon: '🧭', signal: 'Exploration' });

      return {
        title: 'Quel dispositif clé souhaitez-vous mettre en scène ?',
        subtitle: 'L\'interaction majeure de votre mini-site :',
        options: focusOpts
      };
    }

    // Niveau 4 : Dispositif interactif signature ou Ambiance
    if (stepIdx === 4) {
      return {
        title: 'Quelle ambiance sensorielle imaginez-vous ?',
        subtitle: 'Choisissez la matière visuelle et la lumière :',
        options: [
          { id: 'atmo_poetique', title: 'Poétique & Céleste', desc: 'Tons chauds, contrastes doux, respiration feutrée', icon: '🌙', val: 'poetique' },
          { id: 'atmo_minimaliste', title: 'Minimaliste & Épurée', desc: 'Fond noir profond, typographie statutaire, silence', icon: '🖤', val: 'minimaliste' },
          { id: 'atmo_cinematique', title: 'Cinématique & Immersive', desc: 'Micro-interactions sensorielles, sound design réactif', icon: '🎬', val: 'cinematique' },
          { id: 'atmo_vibrante', title: 'Vibrante & Festive', desc: 'Rythme affirmé, contrastes éclatants et énergie', icon: '⚡', val: 'vibrante' },
          { id: 'atmo_elegante', title: 'Élégante & Statutaire', desc: 'Typographie d\'auteur, précision chirurgicale', icon: '🏛️', val: 'elegante' },
          { id: 'atmo_libre', title: 'Libre & Sur Mesure', desc: 'Façonnée librement sans contrainte préétablie', icon: '🌿', val: 'libre' }
        ]
      };
    }

    return null;
  }

  // Convert Accumulated State to StructuredIntent
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

      if (currentStepIdx >= 5) {
        renderCompletedState();
        return;
      }

      var stepConfig = getDynamicStepConfig(aimePathState.selections, aimePathState.context);
      if (!stepConfig) return;

      var stepWrap = document.createElement('div');
      stepWrap.className = 'space-y-4 animate-fadeIn';
      stepWrap.innerHTML = '<div>' +
        '<div class="flex items-center gap-2">' +
        '<span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">Étape 0' + (currentStepIdx + 1) + ' / 05</span>' +
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
      var statement = 'AIME comprend : Vous concevez une expérience ' + ctx.type.toUpperCase() + ' pour ' + ctx.audience.toLowerCase() + ', axée sur ' + ctx.intentions.join(' et ') + (ctx.signals.length > 0 ? ' (' + ctx.signals.join(', ') + ')' : '') + ' dans une ambiance ' + ctx.atmosphere + '.';
      synthesisText.textContent = statement;

      // Render contextual module suggestions from moduleRegistry
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
      completedWrap.className = 'p-6 rounded-3xl bg-zinc-950 border border-emerald-500/30 text-center space-y-4 glow-card animate-fadeIn';
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
      try {
        localStorage.setItem('byaime_direct_intent', JSON.stringify(structuredIntent));
      } catch (e) {}

      window.trackBYAIME('aime_path_to_intent', { eventType: structuredIntent.eventType.value });
      window.location.href = '/projet?from=aime_path';
    }

    if (launchBtn) {
      launchBtn.addEventListener('click', function () {
        launchAimeFromPath();
      });
    }

    renderBreadcrumbs();
    renderCurrentStep();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeroAimePath();
  });

  window.AIME_Path = {
    state: aimePathState,
    getDynamicStepConfig: getDynamicStepConfig,
    convertStateToStructuredIntent: convertStateToStructuredIntent,
    recalculateContext: recalculateContext
  };

})();
