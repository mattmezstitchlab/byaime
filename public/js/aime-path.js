// ===== BYAIME — AIME PATH : Moteur de Choix Adaptatifs en Révélation Progressive (v3.0) =====
// Intelligent cascading dropdowns & editorial selectors for adaptive project structuring.

(function () {
  'use strict';

  function getDynamicStepConfig(selections, context) {
    var stepIdx = selections.length;

    // Niveau 0 : QU'AVEZ-VOUS ENVIE DE CRÉER ?
    if (stepIdx === 0) {
      return {
        stepNumber: 1,
        question: 'Qu\'avez-vous envie de créer ?',
        label: 'Type d\'événement ou de moment singulier :',
        placeholder: '-- Choisir la nature de votre projet... --',
        options: [
          { id: 'mariage', title: 'Mariage Singulier (Union, célébration intime ou grande fête)', type: 'mariage' },
          { id: 'ceremonie', title: 'Cérémonie & Hommage (Mémorial apaisé, recueillement, mémoire)', type: 'ceremonie' },
          { id: 'anniversaire', title: 'Anniversaire d\'Exception (Cap de vie, célébration surprise)', type: 'anniversaire' },
          { id: 'evenement', title: 'Événement Culturel (Rencontres, festival, salon indépendant)', type: 'evenement' },
          { id: 'festival', title: 'Festival & Rassemblement (Plein air, concerts, public nombreux)', type: 'festival' },
          { id: 'artistique', title: 'Projet Artistique & Exposition (Scénographie d\'œuvres, performance)', type: 'artistique' },
          { id: 'association', title: 'Cause & Association (Mobilisation citoyenne, plaidoyer)', type: 'association' },
          { id: 'professionnel', title: 'Projet Professionnel (Lancement, vitrine statutaire)', type: 'professionnel' },
          { id: 'autre', title: 'Autre Création Libre (Intuition originale sur mesure)', type: 'autre' },
          { id: 'indecis', title: 'Je ne sais pas encore (Surprenez-moi, page blanche)', type: 'indecis' }
        ]
      };
    }

    // Niveau 1 : Pour qui ?
    if (stepIdx === 1) {
      var eventType = context.type || 'mariage';
      var audOpts = [];

      if (eventType === 'mariage') {
        audOpts = [
          { id: 'aud_proches', title: 'Pour nos proches & amis (Cercle intime, 20 à 120 pers.)', val: 'Mes proches' },
          { id: 'aud_famille', title: 'Pour notre famille (Célébration intergénérationnelle)', val: 'Ma famille' },
          { id: 'aud_grande_fete', title: 'Pour une grande fête (Nombreux convives, 120+ pers.)', val: 'Une communauté' }
        ];
      } else if (eventType === 'ceremonie') {
        audOpts = [
          { id: 'aud_famille_hommage', title: 'Pour la famille & les proches intimes', val: 'Ma famille' },
          { id: 'aud_proches_distance', title: 'Pour les proches éloignés (Connexion à distance)', val: 'Mes proches' }
        ];
      } else if (eventType === 'anniversaire') {
        audOpts = [
          { id: 'aud_amis_proches', title: 'Pour le groupe d\'amis complices', val: 'Mes proches' },
          { id: 'aud_famille_amis', title: 'Famille et amis réunis', val: 'Ma famille' }
        ];
      } else if (eventType === 'festival' || eventType === 'evenement') {
        audOpts = [
          { id: 'aud_public_fest', title: 'Pour le grand public et festivaliers', val: 'Un public' },
          { id: 'aud_communaute_art', title: 'Pour une communauté d\'artistes et partenaires', val: 'Une communauté' }
        ];
      } else {
        audOpts = [
          { id: 'aud_general_proches', title: 'Pour mes proches et personnes de confiance', val: 'Mes proches' },
          { id: 'aud_general_communaute', title: 'Pour une communauté ou adhérents', val: 'Une communauté' }
        ];
      }

      audOpts.push({ id: 'aud_surprenez_all', title: 'Surprenez-moi (AIME calibrera l\'audience)', val: 'Mes proches' });

      return {
        stepNumber: 2,
        question: 'Pour qui imaginez-vous cette expérience ?',
        label: 'Audience et personnes concernées :',
        placeholder: '-- Choisir l\'audience... --',
        options: audOpts
      };
    }

    // Niveau 2 : Intention directrice
    if (stepIdx === 2) {
      var eType = context.type || 'mariage';
      var intOpts = [];

      if (eType === 'mariage') {
        intOpts = [
          { id: 'int_organiser', title: 'Organiser & Coordonner (Programme, déroulé, plan de table)', val: 'Organiser' },
          { id: 'int_partager', title: 'Partager & Émouvoir (Musique, récit à deux, livre d\'or vocal)', val: 'Partager' },
          { id: 'int_histoire', title: 'Raconter notre histoire (Storytelling immersif, archives)', val: 'Raconter une histoire' },
          { id: 'int_souvenirs', title: 'Créer des souvenirs éternels (Galerie photo HD participative)', val: 'Créer des souvenirs' }
        ];
      } else if (eType === 'ceremonie') {
        intOpts = [
          { id: 'int_recueillement', title: 'Recueillement & Hommage (Bougies virtuelles, pensées)', val: 'Émouvoir' },
          { id: 'int_souvenirs_mem', title: 'Raconter & Transmettre les souvenirs (Anecdotes, livret)', val: 'Créer des souvenirs' },
          { id: 'int_audio_homm', title: 'Relier les proches par l\'audio (Retransmission sonore)', val: 'Partager' }
        ];
      } else if (eType === 'anniversaire') {
        intOpts = [
          { id: 'int_celebrer', title: 'Célébrer & Fêter (Dynamique festive, playlist collective)', val: 'Créer une expérience' },
          { id: 'int_surprise', title: 'Garder la surprise absolue (Énigmes de lieu, vidéos secrètes)', val: 'Faire participer' },
          { id: 'int_retrospect', title: 'Rétrospective des années (Frise chronologique)', val: 'Créer des souvenirs' }
        ];
      } else if (eType === 'festival' || eType === 'evenement') {
        intOpts = [
          { id: 'int_guider_live', title: 'Guider en direct (Programme dynamique, carte sans réseau)', val: 'Informer' },
          { id: 'int_artistes_expo', title: 'Mettre en valeur les artistes (Fiches et écoute audio)', val: 'Créer une expérience' },
          { id: 'int_billetterie_acces', title: 'Accès & Billetterie fluide (Réservation immédiate)', val: 'Organiser' }
        ];
      } else if (eType === 'association') {
        intOpts = [
          { id: 'int_recits_impact', title: 'Récits de terrain & Preuves (Témoignages et impact direct)', val: 'Raconter une histoire' },
          { id: 'int_mobiliser', title: 'Mobiliser & Fédérer (Adhésion, manifeste, mur des soutiens)', val: 'Rassembler' }
        ];
      } else {
        intOpts = [
          { id: 'int_creer_inédit', title: 'Façonner une expérience inédite (Scénographie sur mesure)', val: 'Créer une expérience' },
          { id: 'int_raconter_libre', title: 'Raconter une histoire singulière (Storytelling immersif)', val: 'Raconter une histoire' }
        ];
      }

      intOpts.push({ id: 'int_surprenez_opt', title: 'Surprenez-moi (Laissez AIME définir l\'intention)', val: 'Partager' });

      return {
        stepNumber: 3,
        question: 'Que voulez-vous faire vivre en priorité ?',
        label: 'Intention directrice :',
        placeholder: '-- Choisir l\'intention clé... --',
        options: intOpts
      };
    }

    // Niveau 3 : Point d'ancrage / Focus spécifique
    if (stepIdx === 3) {
      var lastSel = selections[2] ? selections[2].optionId : '';
      var evType = context.type || 'mariage';
      var focusOpts = [];

      if (evType === 'mariage') {
        if (lastSel === 'int_organiser') {
          focusOpts = [
            { id: 'foc_jour_j', title: 'Le Jour J & Le Déroulé (Interface vivante synchronisée)', signal: 'Jour J' },
            { id: 'foc_invites_tables', title: 'Invités & Plan de Table (Recherche par prénom)', signal: 'Plan de table' },
            { id: 'foc_programme_guide', title: 'Programme & Guide complet (Hébergements, itinéraires)', signal: 'Guide pratique' }
          ];
        } else if (lastSel === 'int_partager') {
          focusOpts = [
            { id: 'foc_musique_sons', title: 'Musique & Ambiance Sonore (Lecteur immersif)', signal: 'Musique' },
            { id: 'foc_vocal_messages', title: 'Livre d\'or Vocal (Enregistrements audio des proches)', signal: 'Livre vocal' },
            { id: 'foc_recit_deux', title: 'Récit à deux interactif (L\'histoire racontée avec poésie)', signal: 'Récit poétique' }
          ];
        } else {
          focusOpts = [
            { id: 'foc_galerie_live', title: 'Galerie & Dépôt Photos HD (Upload participatif sans perte)', signal: 'Galerie HD' },
            { id: 'foc_souvenirs_capsule', title: 'Capsule & Archives (Mémoire conservée pour les décennies)', signal: 'Archives de vie' },
            { id: 'foc_jour_j_tout', title: 'Timeline & Musique réunies (Symbiose déroulé et sound design)', signal: 'Timeline et Musique' }
          ];
        }
      } else if (evType === 'ceremonie') {
        focusOpts = [
          { id: 'foc_temoignages_condoleances', title: 'Témoignages & Condoléances (Recueil sécurisé)', signal: 'Témoignages' },
          { id: 'foc_bougies_lumieres', title: 'Bougies Virtuelles & Pensées (Hommage international)', signal: 'Bougies virtuelles' },
          { id: 'foc_retransmission_audio', title: 'Retransmission Audio HD (Diffusion pour les absents)', signal: 'Retransmission audio' }
        ];
      } else if (evType === 'anniversaire') {
        focusOpts = [
          { id: 'foc_videos_surprises', title: 'Coffre de Vidéos Surprises (Débloquées le jour J)', signal: 'Vidéos surprises' },
          { id: 'foc_enigmes_lieu', title: 'Énigmes pour le Lieu Secret (Indices progressifs)', signal: 'Énigmes lieu' },
          { id: 'foc_playlist_fete', title: 'Boîte à Sons des Amis (Sélection collaborative)', signal: 'Playlist collaborative' }
        ];
      } else {
        focusOpts = [
          { id: 'foc_carte_lieux', title: 'Cartographie & Lieux (Repères interactifs)', signal: 'Carte interactive' },
          { id: 'foc_programme_live', title: 'Programme en direct (Horaires et alertes)', signal: 'Programme dynamique' }
        ];
      }

      focusOpts.push({ id: 'foc_surprenez_foc', title: 'Je ne sais pas encore (AIME choisira le point d\'ancrage)', signal: 'Exploration' });

      return {
        stepNumber: 4,
        question: 'Quel dispositif clé souhaitez-vous mettre en scène ?',
        label: 'Interaction majeure :',
        placeholder: '-- Choisir le dispositif clé... --',
        options: focusOpts
      };
    }

    // Niveau 4 : Ambiance & Matière
    if (stepIdx === 4) {
      return {
        stepNumber: 5,
        question: 'Quelle ambiance sensorielle imaginez-vous ?',
        label: 'Matière visuelle & lumière :',
        placeholder: '-- Choisir l\'atmosphère... --',
        options: [
          { id: 'atmo_poetique', title: 'Poétique & Céleste (Tons chauds, contrastes doux, respiration)', val: 'poetique' },
          { id: 'atmo_minimaliste', title: 'Minimaliste & Épurée (Fond noir profond, typographie statutaire)', val: 'minimaliste' },
          { id: 'atmo_cinematique', title: 'Cinématique & Immersive (Interactions sensorielles, sound design)', val: 'cinematique' },
          { id: 'atmo_vibrante', title: 'Vibrante & Festive (Rythme affirmé, énergie partagée)', val: 'vibrante' },
          { id: 'atmo_elegante', title: 'Élégante & Statutaire (Typographie d\'auteur, précision)', val: 'elegante' },
          { id: 'atmo_libre', title: 'Libre & Sur Mesure (Façonnée librement)', val: 'libre' }
        ]
      };
    }

    return null;
  }

  var aimePathState = {
    source: 'guided',
    selections: [],
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

  function initHeroAimePath() {
    var heroPathContainer = document.getElementById('hero-aime-path-container');
    if (!heroPathContainer) return;

    var stepsContainer = document.getElementById('path-steps-container');
    var breadcrumbsContainer = document.getElementById('path-breadcrumbs');
    var synthesisBox = document.getElementById('path-synthesis-box');
    var synthesisText = document.getElementById('path-synthesis-text');
    var suggestionsContainer = document.getElementById('path-suggestions-tags');
    var launchBtn = document.getElementById('path-launch-btn');

    function renderCascadingSelectors() {
      if (!stepsContainer) return;
      stepsContainer.innerHTML = '';

      var totalSteps = 5;
      var currentStepIdx = aimePathState.selections.length;

      var stackContainer = document.createElement('div');
      stackContainer.className = 'space-y-4';

      // Render each already chosen step as an active editorial selector
      for (var i = 0; i <= currentStepIdx && i < totalSteps; i++) {
        var dummySelections = aimePathState.selections.slice(0, i);
        var stepConfig = getDynamicStepConfig(dummySelections, aimePathState.context);
        if (!stepConfig) break;

        var isAnswered = i < currentStepIdx;
        var selectedVal = isAnswered ? aimePathState.selections[i].optionId : 'none';

        var fieldWrap = document.createElement('div');
        fieldWrap.className = 'p-4 md:p-5 rounded-2xl bg-zinc-950/90 border border-white/15 space-y-2 animate-fadeIn';
        
        var fieldId = 'path-selector-step-' + i;
        var headerHtml = '<div class="flex items-center justify-between">' +
          '<label for="' + fieldId + '" class="block text-xs font-semibold text-white uppercase tracking-wider font-mono">' +
          '<span class="text-emerald-400 mr-2">0' + (i + 1) + '.</span>' + stepConfig.question +
          '</label>' +
          (isAnswered ? '<span class="text-[10px] text-emerald-400 font-mono">✓ Choisi</span>' : '<span class="text-[10px] text-gray-400 font-mono">En attente</span>') +
          '</div>';

        var selectHtml = '<div class="relative">' +
          '<select id="' + fieldId + '" class="w-full appearance-none rounded-xl bg-black border border-white/20 p-3 text-xs md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer font-medium pr-10">' +
          '<option value="none">' + stepConfig.placeholder + '</option>';

        stepConfig.options.forEach(function (opt) {
          var isSel = (opt.id === selectedVal) ? ' selected' : '';
          selectHtml += '<option value="' + opt.id + '"' + isSel + '>' + opt.title + '</option>';
        });

        selectHtml += '</select>' +
          '<div class="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-emerald-400">' +
          '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 9l-7 7-7-7"/></svg>' +
          '</div></div>';

        fieldWrap.innerHTML = headerHtml + selectHtml;

        (function (stepIndex, config) {
          var selectEl = fieldWrap.querySelector('#' + fieldId);
          if (selectEl) {
            selectEl.addEventListener('change', function () {
              var val = this.value;
              if (val === 'none') {
                aimePathState.selections = aimePathState.selections.slice(0, stepIndex);
              } else {
                var matchedOpt = config.options.find(function (o) { return o.id === val; });
                if (matchedOpt) {
                  aimePathState.selections = aimePathState.selections.slice(0, stepIndex);
                  aimePathState.selections.push({
                    step: stepIndex,
                    optionId: matchedOpt.id,
                    data: matchedOpt
                  });
                }
              }
              recalculateContext();
              renderBreadcrumbs();
              updateSynthesis();
              renderCascadingSelectors();
            });
          }
        })(i, stepConfig);

        stackContainer.appendChild(fieldWrap);

        // If this step isn't answered yet, do not render subsequent steps
        if (!isAnswered) break;
      }

      stepsContainer.appendChild(stackContainer);
    }

    function renderBreadcrumbs() {
      if (!breadcrumbsContainer) return;
      breadcrumbsContainer.innerHTML = '';

      if (aimePathState.selections.length === 0) {
        breadcrumbsContainer.innerHTML = '<span class="text-xs text-muted-foreground italic">Sélectionnez votre première intention pour déployer l\'arborescence adaptative...</span>';
        return;
      }

      aimePathState.selections.forEach(function (sel, idx) {
        var chip = document.createElement('span');
        chip.className = 'tag-removable cursor-pointer';
        chip.innerHTML = '<span>' + sel.data.title.split('(')[0].trim() + '</span><button type="button" class="tag-remove-btn" title="Modifier ce choix" aria-label="Supprimer">×</button>';

        var removeBtn = chip.querySelector('button');
        removeBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          aimePathState.selections = aimePathState.selections.slice(0, idx);
          recalculateContext();
          renderBreadcrumbs();
          updateSynthesis();
          renderCascadingSelectors();
          if (window.trackBYAIME) {
            window.trackBYAIME('aime_path_branch_changed', { prunedFromStep: idx });
          }
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

      if (suggestionsContainer && window.AIME_Engine) {
        suggestionsContainer.innerHTML = '';
        var dummyProj = window.AIME_Engine.createProjectModel({ type: ctx.type, intentions: ctx.intentions });
        var rec = window.AIME_Engine.recommendModules(dummyProj);
        var topMods = Object.keys(rec.scores).filter(function (k) { return rec.scores[k] >= 75; }).slice(0, 4);

        topMods.forEach(function (mId) {
          var mod = window.AIME_Engine.moduleRegistry[mId] || { name: mId };
          var tag = document.createElement('span');
          tag.className = 'text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium';
          tag.textContent = mod.name;
          suggestionsContainer.appendChild(tag);
        });
      }
    }

    function launchAimeFromPath() {
      var structuredIntent = convertStateToStructuredIntent();
      try {
        localStorage.setItem('byaime_direct_intent', JSON.stringify(structuredIntent));
      } catch (e) {}

      if (window.trackBYAIME) {
        window.trackBYAIME('aime_path_to_intent', { eventType: structuredIntent.eventType.value });
      }
      window.location.href = '/projet?from=aime_path';
    }

    if (launchBtn) {
      launchBtn.addEventListener('click', function () {
        launchAimeFromPath();
      });
    }

    renderBreadcrumbs();
    renderCascadingSelectors();
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
