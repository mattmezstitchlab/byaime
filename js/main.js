/* ===== BYAIME — Studio & Laboratoire Expérimental — main.js ===== */
/* Handles: navigation, scroll animations, modals, configurateur intelligent, galerie filters */

(function () {
  'use strict';

  // Mark JS as available (enables animation hiding via CSS)
  document.documentElement.classList.add('js');

  // ===== Hero Ring Overlap Glow =====
  (function () {
    var glow = document.getElementById('overlap-glow');
    if (!glow) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var speed1 = 2 * Math.PI / 20;
    var speed2 = -2 * Math.PI / 28;
    var overlapCenter = 185;
    var range = 30;

    function tick(ts) {
      var t = ts / 1000;
      var knob1x = 110 + 95 * Math.sin(speed1 * t);
      var knob2x = 260 + 95 * Math.sin(speed2 * t);

      var s1 = Math.max(0, 1 - Math.abs(knob1x - overlapCenter) / range);
      var s2 = Math.max(0, 1 - Math.abs(knob2x - overlapCenter) / range);

      var brightness = s1 * s2;
      glow.setAttribute('opacity', brightness * 0.12);

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  })();

  // ===== Gradient Scroll Animation =====
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var containers = [
      document.getElementById('hero-gradient-wrap'),
      document.getElementById('team-gradient-wrap'),
      document.getElementById('pricing-gradient-wrap'),
      document.getElementById('lab-gradient-wrap'),
      document.getElementById('association-gradient-wrap')
    ].filter(Boolean);

    if (!containers.length) return;

    var targetMaxWidth = 1152;

    function update() {
      var scrollY = window.scrollY || window.pageYOffset;
      var vw = window.innerWidth;

      containers.forEach(function (wrap) {
        var box = wrap.querySelector('div');
        if (!box) return;
        var elTop = wrap.offsetTop;
        var startScroll = Math.max(0, elTop - window.innerHeight);
        var endScroll = elTop;
        var range = endScroll - startScroll;

        if (range <= 0) return;

        var progress = Math.min(1, Math.max(0, (scrollY - startScroll) / range));
        var currentWidth = targetMaxWidth + (vw - targetMaxWidth) * progress;
        wrap.style.maxWidth = currentWidth + 'px';

        var radius = (1 - progress) * 16;
        box.style.borderRadius = radius + 'px';
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  // ===== Background Image Fade on Scroll =====
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var boxes = document.querySelectorAll('[data-fade-bg]');
    if (!boxes.length) return;

    function update() {
      var vh = window.innerHeight;

      boxes.forEach(function (box) {
        var rect = box.getBoundingClientRect();
        var bg = box.querySelector('[style*="opacity"]');
        if (!bg) return;

        var start = rect.top;
        var end = rect.bottom;
        var progress = Math.min(1, Math.max(0, (vh - start) / (end - start)));

        bg.style.opacity = 0.05 + progress * 0.95;
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  // ===== Navbar Shrink on Scroll =====
  (function () {
    var nav = document.getElementById('main-nav');
    var header = document.getElementById('main-header');
    if (!nav || !header) return;

    var scrolled = false;

    function check() {
      var isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        scrolled = isScrolled;
        if (scrolled) {
          nav.classList.remove('pt-12', 'pb-0');
          nav.classList.add('py-4');
          header.style.borderBottomColor = 'var(--color-border)';
        } else {
          nav.classList.remove('py-4');
          nav.classList.add('pt-12', 'pb-0');
          header.style.borderBottomColor = 'transparent';
        }
      }
    }

    window.addEventListener('scroll', check, { passive: true });
    check();
  })();

  // ===== Mobile Navigation =====
  document.addEventListener('DOMContentLoaded', function () {
    var menuButton = document.getElementById('mobile-menu-button');
    var mobileMenu = document.getElementById('mobile-menu');

    if (!menuButton || !mobileMenu) return;

    menuButton.addEventListener('click', function () {
      var isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.classList.toggle('hidden', isOpen);
      mobileMenu.setAttribute('aria-hidden', String(isOpen));

      if (!isOpen) {
        var firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuButton.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.add('hidden');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        menuButton.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.add('hidden');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuButton.focus();
      }
    });
  });

  // ===== Scroll Animations =====
  document.addEventListener('DOMContentLoaded', function () {
    var animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length || !('IntersectionObserver' in window)) {
      animatedElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    try {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });

      animatedElements.forEach(function (el) {
        observer.observe(el);
      });
    } catch (e) {
      animatedElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  });

  // ===== Dialog Open / Close / Scroll Lock =====
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-open-dialog]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-open-dialog');
        var dialog = document.getElementById(id);
        if (dialog) {
          dialog.showModal();
          document.body.style.overflow = 'hidden';
        }
      });
    });

    document.querySelectorAll('[data-close-dialog]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dialog = btn.closest('dialog');
        if (dialog) dialog.close();
      });
    });

    document.querySelectorAll('dialog').forEach(function (dialog) {
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog) dialog.close();
      });
      dialog.addEventListener('close', function () {
        document.body.style.overflow = '';
      });
    });
  });

  // ===== Filter Galerie Projets =====
  document.addEventListener('DOMContentLoaded', function () {
    var filterButtons = document.querySelectorAll('[data-filter-btn]');
    var projectCards = document.querySelectorAll('[data-project-category]');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetCat = btn.getAttribute('data-filter-btn');

        filterButtons.forEach(function (b) {
          b.classList.remove('bg-white', 'text-black');
          b.classList.add('bg-white/5', 'text-muted-foreground');
        });
        btn.classList.remove('bg-white/5', 'text-muted-foreground');
        btn.classList.add('bg-white', 'text-black');

        projectCards.forEach(function (card) {
          var cardCats = (card.getAttribute('data-project-category') || '').split(' ');
          if (targetCat === 'all' || cardCats.indexOf(targetCat) !== -1) {
            card.style.display = '';
            card.classList.add('is-visible');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  });

  // ===== Configurateur Intelligent BYAIME (/projet) =====
  document.addEventListener('DOMContentLoaded', function () {
    var configContainer = document.getElementById('byaime-configurator');
    if (!configContainer) return;

    // State
    var state = {
      step: 1,
      totalSteps: 5,
      type: 'mariage',
      audience: 'proches',
      atmosphere: 'poetique',
      objectives: ['emouvoir', 'souvenirs'],
      features: ['timeline', 'musique', 'galerie', 'rsvp'],
      contentStatus: 'partiel',
      timeline: '3mois',
      budget: 'standard',
      customNotes: ''
    };

    // Dictionary of presets by event type
    var presets = {
      mariage: {
        label: 'Mariage singulier',
        badge: 'Univers Amour & Célébration',
        suggestedTitle: 'Sanctuaire Émotionnel & Récit à Deux',
        artDirection: 'Tons chauds, typographie raffinée, constellation céleste interactive, ambiance sonore douce.',
        architecture: [
          'Page d\'accueil cinématique avec compte à rebours poétique',
          'Timeline vivante du Jour J avec indications spatiales',
          'RSVP intelligent sans mot de passe avec régimes & musique',
          'Galerie participative haute définition & livre d\'or audio',
          'Guide des lieux & hébergements avec carte interactive'
        ],
        signatureFeature: 'Livre d\'or vocal immersif avec lecteur vinyle virtuel & dépôt de souvenirs en direct.',
        defaultFeatures: ['timeline', 'musique', 'galerie', 'rsvp', 'plan-table', 'souvenirs']
      },
      ceremonie: {
        label: 'Cérémonie d\'adieu & Hommage',
        badge: 'Mémorial Poétique & Apaisant',
        suggestedTitle: 'L\'Espace du Souvenir & des Mémoires',
        artDirection: 'Clair-obscur apaisant, contrastes doux, respiration visuelle généreuse, sobriété mémorielle.',
        architecture: [
          'Page de recueillement avec portrait lumineux et biographie intime',
          'Programme de la cérémonie et diffusion audio/vidéo sécurisée',
          'Mur de témoignages, anecdotes et photographies d\'archives',
          'Espace de condoléances privé pour la famille proche',
          'Livret souvenir téléchargeable et imprimable en haute qualité'
        ],
        signatureFeature: 'Bougie virtuelle du souvenir avec message d\'hommage pérenne et archive mémorielle.',
        defaultFeatures: ['hommage', 'musique-sobre', 'souvenirs', 'temoignages', 'programme', 'galerie-privee']
      },
      anniversaire: {
        label: 'Anniversaire d\'exception & Célébration',
        badge: 'Capsule Temporelle Interactive',
        suggestedTitle: 'Rétrospective Vivante & Révélation Festive',
        artDirection: 'Contraste saisissant, micro-animations festives et élégantes, typographie expressive.',
        architecture: [
          'Écran de bienvenue avec décompte interactif et teasing progressif',
          'Frise chronologique des étapes marquantes de la vie célébrée',
          'Énigme ou carte interactive pour révéler le lieu secret',
          'Playlist collaborative connectée aux invités',
          'Espace cagnotte raffiné et messages vidéo surprises'
        ],
        signatureFeature: 'Capsule temporelle interactive avec messages programmés à s\'ouvrir dans le futur.',
        defaultFeatures: ['timeline', 'enigme-lieu', 'musique', 'cagnotte', 'galerie', 'video-surprise']
      },
      evenement: {
        label: 'Événement culturel & Festival',
        badge: 'Scénographie Numérique Immersion',
        suggestedTitle: 'Pavillon Digital & Guide Interactif',
        artDirection: 'Esthétique avant-gardiste, ultra-performant, responsive fluide, contrastes dynamiques.',
        architecture: [
          'Landing page événementielle avec billetterie intégrée sans friction',
          'Programme dynamique heure par heure avec filtres thématiques',
          'Fiches immersives des intervenants et artistes',
          'Plan interactif des scènes et espaces en temps réel',
          'Mode hors-ligne optimisé pour réseaux mobiles saturés'
        ],
        signatureFeature: 'Plan interactif en temps réel avec notifications des temps forts et agenda personnalisé.',
        defaultFeatures: ['programme', 'participants', 'intervenants', 'lieux-carte', 'agenda', 'contenus']
      },
      artistique: {
        label: 'Projet artistique & Performance',
        badge: 'Galerie Sensorielle & Laboratoire',
        suggestedTitle: 'Immersion Visuelle & Expérience Sonore',
        artDirection: 'Minimalisme radical, fond noir profond, sound design réactif, typographie expérimentale.',
        architecture: [
          'Expérience plein écran générative réagissant au scroll',
          'Exploration haute fidélité des œuvres et textures',
          'Podcasts immersifs et notes d\'intention de l\'artiste',
          'Espace mécénat et acquisition d\'œuvres en direct',
          'Documentation du processus de création'
        ],
        signatureFeature: 'Scénographie sonore générative synchronisée avec l\'exploration visuelle des œuvres.',
        defaultFeatures: ['canvas-interactif', 'audio-reactif', 'oeuvres', 'podcasts', 'mecenat']
      },
      association: {
        label: 'Cause, Collectif & Association',
        badge: 'Récit d\'Impact & Mobilisation',
        suggestedTitle: 'Plateforme d\'Engagement & Témoignages',
        artDirection: 'Chaleur humaine, clarté éditoriale, typographie affirmée, infographies d\'impact vivantes.',
        architecture: [
          'Storytelling immersif articulé autour des récits de bénéficiaires',
          'Tableau de bord transparent de l\'impact des actions',
          'Module d\'adhésion et de soutien associatif sans intermédiaire',
          'Espace de ressources et manifeste téléchargeable',
          'Mur des soutiens et communauté engagée'
        ],
        signatureFeature: 'Visualiseur d\'impact en direct reliant chaque don ou engagement à une action concrète.',
        defaultFeatures: ['recits', 'impact-visuel', 'soutien-associatif', 'manifeste', 'communaute']
      },
      autre: {
        label: 'Projet Unique & Hors Standard',
        badge: 'Création Expérimentale Libre',
        suggestedTitle: 'Univers Numérique Sur Mesure',
        artDirection: 'Sur mesure selon la vision singulière du projet.',
        architecture: [
          'Direction artistique unique conçue de zéro',
          'Architecture narrative interactive personnalisée',
          'Micro-interactions et dispositifs technologiques adaptés',
          'Fluidité maximale et souveraineté totale des données'
        ],
        signatureFeature: 'Dispositif interactif entièrement développé selon vos contraintes et désirs artistiques.',
        defaultFeatures: ['sur-mesure', 'interactif', 'narration', 'optimisation']
      }
    };

    // DOM Elements
    var stepElements = configContainer.querySelectorAll('[data-step-content]');
    var stepIndicators = configContainer.querySelectorAll('[data-step-indicator]');
    var prevBtn = document.getElementById('cfg-prev-btn');
    var nextBtn = document.getElementById('cfg-next-btn');
    var progressBar = document.getElementById('cfg-progress-bar');
    var previewTitle = document.getElementById('preview-concept-title');
    var previewBadge = document.getElementById('preview-concept-badge');
    var previewArt = document.getElementById('preview-art-direction');
    var previewArchList = document.getElementById('preview-architecture-list');
    var previewSignature = document.getElementById('preview-signature-feature');
    var typeSelectionInputs = configContainer.querySelectorAll('input[name="event-type"]');
    var featureCheckboxes = configContainer.querySelectorAll('input[name="cfg-features"]');

    // Update Concept Preview Card
    function updateConceptPreview() {
      var preset = presets[state.type] || presets.mariage;

      if (previewTitle) previewTitle.textContent = preset.suggestedTitle;
      if (previewBadge) previewBadge.textContent = preset.badge;
      if (previewArt) previewArt.textContent = preset.artDirection;
      if (previewSignature) previewSignature.textContent = preset.signatureFeature;

      if (previewArchList) {
        previewArchList.innerHTML = '';
        preset.architecture.forEach(function (item) {
          var li = document.createElement('li');
          li.className = 'text-xs text-muted-foreground flex items-start gap-2.5';
          li.innerHTML = '<span class="mt-1 h-1.5 w-1.5 rounded-full bg-white flex-shrink-0"></span><span>' + item + '</span>';
          previewArchList.appendChild(li);
        });
      }

      // Update features list in step 4 dynamically based on selected type
      var featuresContainer = document.getElementById('cfg-features-container');
      if (featuresContainer && state.step === 4) {
        renderFeaturesForType(state.type);
      }
    }

    // Dynamic feature checkboxes tailored to type
    function renderFeaturesForType(type) {
      var container = document.getElementById('cfg-features-container');
      if (!container) return;

      var featureOptionsMap = {
        mariage: [
          { id: 'f_timeline', val: 'timeline', label: 'Timeline interactive du Jour J', desc: 'Déroulé en direct, horaires et lieux géolocalisés' },
          { id: 'f_musique', val: 'musique', label: 'Ambiance sonore & Playlist', desc: 'Lecteur audio immersif et boîte à musiques des invités' },
          { id: 'f_galerie', val: 'galerie', label: 'Galerie de souvenirs & Dépôt photos', desc: 'Téléchargement HD instantané par QR code le soir même' },
          { id: 'f_rsvp', val: 'rsvp', label: 'RSVP fluide sans compte', desc: 'Gestion des présences, régimes et questions personnalisées' },
          { id: 'f_plan', val: 'plan-table', label: 'Plan de table interactif', desc: 'Recherche de sa table par nom avec animation douce' },
          { id: 'f_vocal', val: 'livre-vocal', label: 'Livre d\'or audio & vocal', desc: 'Enregistrement vocal des messages des proches' }
        ],
        ceremonie: [
          { id: 'f_hommage', val: 'hommage', label: 'Espace d\'hommage & Portrait', desc: 'Biographie intime, mots choisis et citations' },
          { id: 'f_bougie', val: 'bougie', label: 'Bougies virtuelles & Pensées', desc: 'Geste d\'hommage interactif allumé par les proches' },
          { id: 'f_temoignages', val: 'temoignages', label: 'Collecte de témoignages & Récits', desc: 'Livre de condoléances sécurisé et modéré avec douceur' },
          { id: 'f_musique_s', val: 'musique-sobre', label: 'Musiques & Pièces sonores', desc: 'Sélection des morceaux chers à la personne honorée' },
          { id: 'f_prog_c', val: 'programme', label: 'Programme & Diffusion', desc: 'Déroulé de la cérémonie et retransmission éventuelle' },
          { id: 'f_livret', val: 'livret', label: 'Livret souvenir imprimable', desc: 'Génération PDF haute qualité en mémoire' }
        ],
        anniversaire: [
          { id: 'f_chrono', val: 'timeline', label: 'Frise chronologique rétrospective', desc: 'Photos et faits marquants des années passées' },
          { id: 'f_enigme', val: 'enigme-lieu', label: 'Révélation interactive du lieu', desc: 'Suspense avec compte à rebours et indices' },
          { id: 'f_cagnotte', val: 'cagnotte', label: 'Cagnotte & Cadeau commun', desc: 'Présentation élégante sans frais tiers abusifs' },
          { id: 'f_playlist', val: 'musique', label: 'Boîte à sons collaborative', desc: 'Suggestions de morceaux par les invités' },
          { id: 'f_videos', val: 'video-surprise', label: 'Espace vidéos surprises', desc: 'Dépôt secret de capsules vidéos pour le fêté' },
          { id: 'f_dress', val: 'dress-code', label: 'Dress-code & Guide pratique', desc: 'Inspirations visuelles et détails d\'accès' }
        ],
        evenement: [
          { id: 'f_prog_e', val: 'programme', label: 'Programme dynamique interactif', desc: 'Filtre par scène, horaire et thématique' },
          { id: 'f_speakers', val: 'intervenants', label: 'Fiches artistes & intervenants', desc: 'Bios, liens et extraits immersifs' },
          { id: 'f_carte_e', val: 'lieux-carte', label: 'Plan & Cartographie des lieux', desc: 'Repérage fluide sur smartphone' },
          { id: 'f_billets', val: 'billetterie', label: 'Accès & Billetterie fluide', desc: 'Intégration sans redirection frustrante' },
          { id: 'f_agenda_p', val: 'agenda', label: 'Mon agenda personnalisé', desc: 'L\'invité compose son parcours en 1 clic' },
          { id: 'f_notifs', val: 'notifs', label: 'Alertes en direct le jour J', desc: 'Annonces discrètes pour les temps forts' }
        ],
        artistique: [
          { id: 'f_canvas', val: 'canvas-interactif', label: 'Scénographie interactive générative', desc: 'Micro-interactions sensorielles réactives au curseur' },
          { id: 'f_audio_r', val: 'audio-reactif', label: 'Sound design immersif', desc: 'Univers sonore adapté à chaque œuvre' },
          { id: 'f_galerie_a', val: 'oeuvres', label: 'Galerie d\'œuvres en haute fidélité', desc: 'Zooms texturés et détails matières' },
          { id: 'f_podcasts', val: 'podcasts', label: 'Podcasts & Notes d\'intention', desc: 'La voix de l\'artiste sur ses créations' },
          { id: 'f_mecenat', val: 'mecenat', label: 'Espace mécénat & Acquisition', desc: 'Liaison directe avec les collectionneurs' }
        ],
        association: [
          { id: 'f_recits', val: 'recits', label: 'Récits & Témoignages vivants', desc: 'Storytelling immersif avec photographies' },
          { id: 'f_impact', val: 'impact-visuel', label: 'Visualiseur d\'impact en direct', desc: 'Données concrètes et transparentes' },
          { id: 'f_soutien', val: 'soutien-associatif', label: 'Module de don & Adhésion', desc: 'Soutien direct libre ou récurrent' },
          { id: 'f_manifeste', val: 'manifeste', label: 'Manifeste & Ressources', desc: 'Consultation et partage fluide' },
          { id: 'f_comm', val: 'communaute', label: 'Mur des soutiens & Volontaires', desc: 'Mise en valeur de la communauté' }
        ],
        autre: [
          { id: 'f_sur_mesure', val: 'sur-mesure', label: 'Architecture sur mesure intégrale', desc: 'Conception libre selon le cahier des charges' },
          { id: 'f_interact', val: 'interactif', label: 'Dispositif interactif signature', desc: 'Création d\'une expérience jamais vue ailleurs' },
          { id: 'f_narration', val: 'narration', label: 'Storytelling & Design d\'émotion', desc: 'Récit immersif captivant' },
          { id: 'f_perf', val: 'optimisation', label: 'Haute performance & Sécurité', desc: 'Zéro traceur intrusif, ultra-rapide' }
        ]
      };

      var list = featureOptionsMap[type] || featureOptionsMap.mariage;
      container.innerHTML = '';

      list.forEach(function (opt) {
        var isChecked = state.features.indexOf(opt.val) !== -1 || (state.features.length === 0);
        var label = document.createElement('label');
        label.className = 'flex items-start gap-3.5 p-4 rounded-xl border border-border bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors';
        label.innerHTML = '<input type="checkbox" name="cfg-features" value="' + opt.val + '" class="mt-1 rounded border-border text-white focus:ring-white bg-black h-4 w-4" ' + (isChecked ? 'checked' : '') + '>' +
          '<div><p class="text-sm font-medium text-white">' + opt.label + '</p><p class="text-xs text-muted-foreground mt-0.5">' + opt.desc + '</p></div>';

        var checkbox = label.querySelector('input');
        checkbox.addEventListener('change', function () {
          var selected = [];
          container.querySelectorAll('input[name="cfg-features"]:checked').forEach(function (cb) {
            selected.push(cb.value);
          });
          state.features = selected;
        });

        container.appendChild(label);
      });
    }

    // Go to step
    function goToStep(stepNum) {
      if (stepNum < 1 || stepNum > state.totalSteps) return;
      state.step = stepNum;

      // Update step contents
      stepElements.forEach(function (el) {
        var s = parseInt(el.getAttribute('data-step-content'), 10);
        if (s === state.step) {
          el.classList.remove('hidden');
          el.classList.add('block');
        } else {
          el.classList.add('hidden');
          el.classList.remove('block');
        }
      });

      // Update step indicators
      stepIndicators.forEach(function (ind) {
        var s = parseInt(ind.getAttribute('data-step-indicator'), 10);
        if (s === state.step) {
          ind.classList.add('border-white', 'text-white', 'bg-white/10');
          ind.classList.remove('border-border', 'text-muted-foreground', 'bg-transparent');
        } else if (s < state.step) {
          ind.classList.add('border-emerald-500', 'text-emerald-400', 'bg-emerald-500/10');
          ind.classList.remove('border-white', 'border-border', 'text-white', 'text-muted-foreground');
        } else {
          ind.classList.remove('border-white', 'border-emerald-500', 'text-white', 'text-emerald-400', 'bg-white/10', 'bg-emerald-500/10');
          ind.classList.add('border-border', 'text-muted-foreground', 'bg-transparent');
        }
      });

      // Progress bar
      if (progressBar) {
        var pct = ((state.step - 1) / (state.totalSteps - 1)) * 100;
        progressBar.style.width = Math.max(5, pct) + '%';
      }

      // Prev / Next button states
      if (prevBtn) {
        if (state.step === 1) {
          prevBtn.classList.add('opacity-0', 'pointer-events-none');
        } else {
          prevBtn.classList.remove('opacity-0', 'pointer-events-none');
        }
      }

      if (nextBtn) {
        if (state.step === state.totalSteps) {
          nextBtn.textContent = 'Valider & Transmettre';
        } else {
          nextBtn.textContent = 'Étape suivante →';
        }
      }

      updateConceptPreview();

      // Smooth scroll to configurator card
      configContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Type radio change
    typeSelectionInputs.forEach(function (radio) {
      radio.addEventListener('change', function () {
        state.type = radio.value;
        // update preset features
        var preset = presets[state.type] || presets.mariage;
        state.features = preset.defaultFeatures.slice();
        updateConceptPreview();
      });
    });

    // Next / Prev listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (state.step < state.totalSteps) {
          goToStep(state.step + 1);
        } else {
          // Submit step
          submitConfigurator();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        goToStep(state.step - 1);
      });
    }

    // Handle final submission
    function submitConfigurator() {
      var nameInput = document.getElementById('cfg-user-name');
      var emailInput = document.getElementById('cfg-user-email');
      var notesInput = document.getElementById('cfg-user-notes');

      var name = nameInput ? nameInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var notes = notesInput ? notesInput.value.trim() : '';

      if (!name || !email) {
        alert('Veuillez renseigner votre nom et votre adresse e-mail pour que Matt Mez puisse vous répondre.');
        return;
      }

      // Show success modal or replace content
      var formWrap = document.getElementById('cfg-form-wrapper');
      var successWrap = document.getElementById('cfg-success-wrapper');

      if (formWrap && successWrap) {
        formWrap.classList.add('hidden');
        successWrap.classList.remove('hidden');

        var recapType = document.getElementById('recap-type');
        var recapTitle = document.getElementById('recap-title');
        var recapName = document.getElementById('recap-name');

        if (recapType) recapType.textContent = (presets[state.type] || {}).label || state.type;
        if (recapTitle) recapTitle.textContent = (presets[state.type] || {}).suggestedTitle || '';
        if (recapName) recapName.textContent = name;

        successWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Initialize
    updateConceptPreview();
  });

  // ===== Module Soutien Associatif LE MONDE AIME =====
  document.addEventListener('DOMContentLoaded', function () {
    var donationContainer = document.getElementById('association-donation-module');
    if (!donationContainer) return;

    var chips = donationContainer.querySelectorAll('[data-donation-amount]');
    var customInput = document.getElementById('donation-custom-input');
    var displayAmount = document.getElementById('donation-display-amount');
    var donateButton = document.getElementById('donation-action-btn');

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var amt = chip.getAttribute('data-donation-amount');

        chips.forEach(function (c) {
          c.classList.remove('bg-white', 'text-black', 'border-white');
          c.classList.add('bg-white/5', 'text-muted-foreground', 'border-border');
        });

        chip.classList.remove('bg-white/5', 'text-muted-foreground', 'border-border');
        chip.classList.add('bg-white', 'text-black', 'border-white');

        if (amt === 'custom') {
          if (customInput) {
            customInput.classList.remove('hidden');
            customInput.focus();
            if (displayAmount) displayAmount.textContent = customInput.value ? customInput.value + ' €' : 'Montant libre';
          }
        } else {
          if (customInput) customInput.classList.add('hidden');
          if (displayAmount) displayAmount.textContent = amt + ' €';
        }
      });
    });

    if (customInput) {
      customInput.addEventListener('input', function () {
        var val = customInput.value.trim();
        if (displayAmount) displayAmount.textContent = val ? val + ' €' : 'Montant libre';
      });
    }

    if (donateButton) {
      donateButton.addEventListener('click', function (e) {
        e.preventDefault();
        var current = displayAmount ? displayAmount.textContent : 'votre soutien';
        alert('Merci pour votre intérêt envers l\'association LE MONDE AIME ! Le module sécurisé de don pour ' + current + ' sera ouvert très prochainement lors du lancement officiel.');
      });
    }
  });

})();
