/* ===== BYAIME — Studio & Laboratoire d'Expériences — main.js ===== */
/* Handles: MVP Configurateur Intelligent, Prototypes Interactifs, Galerie Modales, Persistance & Analytics */

(function () {
  'use strict';

  // Mark JS as available
  document.documentElement.classList.add('js');

  // ===== Internal Analytics Hook (Simple Event Bus) =====
  window.trackBYAIME = function (eventName, eventData) {
    var payload = {
      event: eventName,
      data: eventData || {},
      timestamp: new Date().toISOString()
    };
    if (window.BYAIME_DEBUG) {
      console.log('[BYAIME Analytics]', payload);
    }
    // Custom event dispatched for any future integration (Plausible, PostHog, Vercel Analytics)
    try {
      window.dispatchEvent(new CustomEvent('byaime_event', { detail: payload }));
    } catch (e) {}
  };

  // ===== Local Storage Draft Manager =====
  var STORAGE_KEY = 'byaime_project_draft_v1';
  var BYAIME_Storage = {
    save: function (data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {}
    },
    load: function () {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },
    clear: function () {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  };

  // ===== Hero Ring Glow Animation =====
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

      glow.setAttribute('opacity', s1 * s2 * 0.12);
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

  // ===== PROTOTYPES INTERACTIFS (/projets & Accueil) =====
  document.addEventListener('DOMContentLoaded', function () {
    // 1. Mini Timeline interactive
    document.querySelectorAll('[data-interactive-timeline]').forEach(function (timeline) {
      var steps = timeline.querySelectorAll('[data-timeline-step]');
      var infoDisplay = timeline.querySelector('[data-timeline-info]');

      steps.forEach(function (step) {
        step.addEventListener('click', function () {
          steps.forEach(function (s) {
            s.classList.remove('bg-pink-500/20', 'border-pink-500', 'text-white', 'scale-105');
            s.classList.add('bg-white/5', 'border-white/10', 'text-muted-foreground');
          });
          step.classList.remove('bg-white/5', 'border-white/10', 'text-muted-foreground');
          step.classList.add('bg-pink-500/20', 'border-pink-500', 'text-white', 'scale-105');

          var title = step.getAttribute('data-timeline-title');
          var time = step.getAttribute('data-timeline-time');
          var desc = step.getAttribute('data-timeline-desc');

          if (infoDisplay) {
            infoDisplay.innerHTML = '<div class="flex justify-between items-baseline"><span class="font-semibold text-white">' + title + '</span><span class="font-mono text-pink-300 text-xs">' + time + '</span></div><p class="text-xs text-muted-foreground mt-1">' + desc + '</p>';
          }
        });
      });
    });

    // 2. Mini Lecteur Musique Interactif
    document.querySelectorAll('[data-interactive-player]').forEach(function (player) {
      var playBtn = player.querySelector('[data-player-toggle]');
      var statusText = player.querySelector('[data-player-status]');
      var bars = player.querySelectorAll('.bar-1, .bar-2, .bar-3, .bar-4, .bar-5');
      var isPlaying = true;

      if (playBtn) {
        playBtn.addEventListener('click', function () {
          isPlaying = !isPlaying;
          if (isPlaying) {
            playBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
            if (statusText) statusText.textContent = 'En lecture';
            bars.forEach(function (b) { b.style.animationPlayState = 'running'; });
          } else {
            playBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
            if (statusText) statusText.textContent = 'En pause';
            bars.forEach(function (b) { b.style.animationPlayState = 'paused'; });
          }
        });
      }
    });

    // 3. Mini Recherche Invités & Table Plan
    document.querySelectorAll('[data-guest-lookup]').forEach(function (widget) {
      var input = widget.querySelector('[data-guest-input]');
      var result = widget.querySelector('[data-guest-result]');
      var guestsDatabase = [
        { name: 'Claire', table: 'Table Orion (Place 1)', status: 'RSVP Confirmé' },
        { name: 'Antoine', table: 'Table Orion (Place 2)', status: 'RSVP Confirmé' },
        { name: 'Camille', table: 'Table Cassiopée (Place 4)', status: 'RSVP Confirmé' },
        { name: 'Sophie', table: 'Table Pégase (Place 3)', status: 'RSVP En attente' },
        { name: 'Thomas', table: 'Table Cassiopée (Place 5)', status: 'RSVP Confirmé' }
      ];

      if (input && result) {
        input.addEventListener('input', function () {
          var query = input.value.trim().toLowerCase();
          if (!query) {
            result.innerHTML = '<p class="text-xs text-muted-foreground italic">Tapez un prénom pour tester la recherche d\'invité...</p>';
            return;
          }
          var match = guestsDatabase.find(function (g) {
            return g.name.toLowerCase().indexOf(query) !== -1;
          });
          if (match) {
            result.innerHTML = '<div class="flex justify-between items-center p-2 rounded-lg bg-white/10 text-xs"><span class="text-white font-medium">' + match.name + '</span><span class="text-pink-300 font-mono">' + match.table + '</span></div>';
          } else {
            result.innerHTML = '<p class="text-xs text-muted-foreground">Aucun invité trouvé pour "' + query + '".</p>';
          }
        });
      }
    });

    // 4. Mini Bougie Mémorielle
    document.querySelectorAll('[data-candle-widget]').forEach(function (widget) {
      var candleBtn = widget.querySelector('[data-candle-btn]');
      var countEl = widget.querySelector('[data-candle-count]');
      var candleFlame = widget.querySelector('[data-candle-flame]');
      var count = 312;
      var hasLit = false;

      if (candleBtn && countEl) {
        candleBtn.addEventListener('click', function () {
          if (!hasLit) {
            hasLit = true;
            count++;
            countEl.textContent = count + ' pensées déposées';
            candleBtn.textContent = '✓ Pensée déposée avec douceur';
            candleBtn.classList.add('bg-amber-500/20', 'text-amber-300', 'border-amber-400');
            if (candleFlame) {
              candleFlame.classList.remove('opacity-40');
              candleFlame.classList.add('opacity-100', 'animate-pulse');
            }
          }
        });
      }
    });
  });

  // ===== Filter Galerie Projets (/projets) =====
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

  // ===== CONFIGURATEUR INTELLIGENT BYAIME (/projet) =====
  document.addEventListener('DOMContentLoaded', function () {
    var configContainer = document.getElementById('byaime-configurator');
    if (!configContainer) return;

    // Presets & Rule-based Suggestion Engine
    var enginePresets = {
      mariage: {
        label: 'Mariage',
        categoryName: 'Mariage Singulier',
        badge: 'Univers Amour & Célébration',
        suggestedTitle: 'Le Grand Jour — L\'expérience vivante',
        artDirectionDefault: 'Poétique & Élégante',
        artDirectionDesc: 'Tons chauds, typographie raffinée, constellation céleste interactive, ambiance sonore douce.',
        architecture: ['Accueil poétique', 'Timeline du Jour J', 'Invités & Tables', 'Musique & Boîte à sons', 'Galerie photo & Souvenirs', 'Livre d\'or vocal', 'Guide & Hébergements'],
        signatureFeature: 'Une Timeline vivante synchronisée qui transforme chaque moment du mariage en expérience partagée.',
        defaultModules: ['Timeline du Jour J', 'RSVP sans mot de passe', 'Profils invités', 'Plan de table interactif', 'Musique & Playlist', 'Galerie photo HD', 'Livre d\'or vocal', 'Souvenirs & Archives', 'Prestataires & Guide', 'Carte interactive'],
        allPossibleModules: [
          'Timeline du Jour J', 'RSVP sans mot de passe', 'Profils invités', 'Plan de table interactif',
          'Musique & Playlist', 'Galerie photo HD', 'Livre d\'or vocal', 'Souvenirs & Archives',
          'Prestataires & Guide', 'Carte interactive', 'Compte à rebours céleste', 'Cagnotte de voyage'
        ]
      },
      ceremonie: {
        label: 'Cérémonie d\'adieu',
        categoryName: 'Hommage & Mémorial',
        badge: 'Mémorial Poétique & Apaisant',
        suggestedTitle: 'La Trace & Le Souvenir — Mémorial Vivant',
        artDirectionDefault: 'Sobriété & Délicatesse',
        artDirectionDesc: 'Clair-obscur apaisant, contrastes doux, respiration visuelle généreuse, sobriété mémorielle.',
        architecture: ['Espace de recueillement', 'Portrait & Biographie', 'Programme & Retransmission', 'Témoignages & Récits', 'Bougies virtuelles', 'Livret mémoriel imprimable'],
        signatureFeature: 'Une bougie virtuelle du souvenir reliant les pensées des proches du monde entier.',
        defaultModules: ['Programme & Retransmission', 'Hommage & Portrait', 'Galerie d\'archives privées', 'Musique & Pièces d\'époque', 'Témoignages & Condoléances', 'Livre de souvenirs', 'Messages privés pour la famille', 'Livret numérique imprimable'],
        allPossibleModules: [
          'Programme & Retransmission', 'Hommage & Portrait', 'Galerie d\'archives privées',
          'Musique & Pièces d\'époque', 'Témoignages & Condoléances', 'Livre de souvenirs',
          'Messages privés pour la famille', 'Livret numérique imprimable', 'Arbre généalogique intime', 'Podcast de mémoire'
        ]
      },
      anniversaire: {
        label: 'Anniversaire',
        categoryName: 'Anniversaire d\'Exception',
        badge: 'Capsule Temporelle Interactive',
        suggestedTitle: 'Capsule Temporelle — La Rétrospective',
        artDirectionDefault: 'Vibrante & Cinématique',
        artDirectionDesc: 'Contraste affirmé, micro-animations festives et élégantes, typographie expressive.',
        architecture: ['Décompte & Énigmes', 'Frise des années marquantes', 'Playlist collaborative', 'Cagnotte élégante', 'Vidéos surprises secrètes'],
        signatureFeature: 'Une capsule temporelle interactive à énigmes révélant les étapes de la fête au fil des jours.',
        defaultModules: ['Frise chronologique', 'Révélation du lieu secret', 'Playlist collaborative', 'Cagnotte commune', 'Vidéos surprises', 'Dress-code & Guide', 'Trombinoscope des amis'],
        allPossibleModules: [
          'Frise chronologique', 'Révélation du lieu secret', 'Playlist collaborative',
          'Cagnotte commune', 'Vidéos surprises', 'Dress-code & Guide', 'Trombinoscope des amis',
          'Quiz interactif sur le fêté', 'Mur de dédicaces'
        ]
      },
      evenement: {
        label: 'Événement culturel',
        categoryName: 'Événement & Festival',
        badge: 'Scénographie Numérique Immersion',
        suggestedTitle: 'Le Pavillon Numérique — Guide Vivant',
        artDirectionDefault: 'Avant-Garde & Ultra-Rapide',
        artDirectionDesc: 'Esthétique épurée, responsive ultra-fluide, mode hors-ligne instantané.',
        architecture: ['Landing événementielle', 'Programme interactif', 'Artistes & Intervenants', 'Plan des scènes', 'Mon Agenda personnel', 'Billetterie fluide'],
        signatureFeature: 'Un plan interactif en temps réel avec notifications des temps forts et agenda hors-ligne.',
        defaultModules: ['Programme dynamique', 'Fiches artistes & intervenants', 'Plan & Cartographie des lieux', 'Billetterie sans friction', 'Mon agenda personnalisé', 'Alertes en direct le jour J', 'Accès hors-ligne PWA'],
        allPossibleModules: [
          'Programme dynamique', 'Fiches artistes & intervenants', 'Plan & Cartographie des lieux',
          'Billetterie sans friction', 'Mon agenda personnalisé', 'Alertes en direct le jour J',
          'Accès hors-ligne PWA', 'Partenaires & Mécènes', 'Podcast des coulisses'
        ]
      },
      festival: {
        label: 'Festival',
        categoryName: 'Festival & Rassemblement',
        badge: 'Scénographie Numérique Immersion',
        suggestedTitle: 'L\'Expérience Festival — Live & Offline',
        artDirectionDefault: 'Énergique & Immersive',
        artDirectionDesc: 'Contrastes dynamiques, navigation au pouce pensée pour le plein air.',
        architecture: ['Line-up interactif', 'Planning par scènes', 'Carte géolocalisée', 'Favoris & Alertes', 'Infos pratiques & Navettes'],
        signatureFeature: 'Un système d\'agenda personnalisé fonctionnant à 100% sans connexion réseau.',
        defaultModules: ['Programme dynamique', 'Fiches artistes', 'Carte des scènes', 'Billetterie', 'Agenda favoris', 'Alertes SMS/PWA', 'Infos pratiques'],
        allPossibleModules: [
          'Programme dynamique', 'Fiches artistes', 'Carte des scènes', 'Billetterie',
          'Agenda favoris', 'Alertes SMS/PWA', 'Infos pratiques', 'Boutique du festival'
        ]
      },
      artistique: {
        label: 'Projet artistique',
        categoryName: 'Art & Performance',
        badge: 'Galerie Sensorielle & Laboratoire',
        suggestedTitle: 'Matière & Lumière — Scénographie Numérique',
        artDirectionDefault: 'Minimalisme Radical & Sound Design',
        artDirectionDesc: 'Fond noir profond, sound design réactif, exploration haute fidélité.',
        architecture: ['Scénographie générative', 'Exploration des œuvres', 'Notes d\'intention & Podcasts', 'Espace mécénat & Acquisition'],
        signatureFeature: 'Une scénographie sonore générative qui réagit au mouvement du visiteur sur les œuvres.',
        defaultModules: ['Scénographie interactive générative', 'Sound design immersif', 'Galerie d\'œuvres haute fidélité', 'Podcasts & Notes d\'intention', 'Espace mécénat & Acquisition'],
        allPossibleModules: [
          'Scénographie interactive générative', 'Sound design immersif', 'Galerie d\'œuvres haute fidélité',
          'Podcasts & Notes d\'intention', 'Espace mécénat & Acquisition', 'Manifeste d\'artiste'
        ]
      },
      association: {
        label: 'Association',
        categoryName: 'Cause & Collectif',
        badge: 'Récit d\'Impact & Mobilisation',
        suggestedTitle: 'Plateforme d\'Engagement & Récits Vivants',
        artDirectionDefault: 'Chaleureuse & Affirmée',
        artDirectionDesc: 'Clarté éditoriale, visuels humains, infographies vivantes d\'impact.',
        architecture: ['Storytelling des bénéficiaires', 'Tableau d\'impact en direct', 'Module d\'adhésion & soutien', 'Manifeste citoyen'],
        signatureFeature: 'Un visualiseur d\'impact reliant chaque engagement citoyen à une action concrète sur le terrain.',
        defaultModules: ['Récits & Témoignages vivants', 'Visualiseur d\'impact en direct', 'Module de don & Adhésion', 'Manifeste & Ressources', 'Mur des soutiens & Volontaires', 'Agenda des actions'],
        allPossibleModules: [
          'Récits & Témoignages vivants', 'Visualiseur d\'impact en direct', 'Module de don & Adhésion',
          'Manifeste & Ressources', 'Mur des soutiens & Volontaires', 'Agenda des actions', 'Espace presse'
        ]
      },
      professionnel: {
        label: 'Projet professionnel',
        categoryName: 'Événement Pro & Lancement',
        badge: 'Vitrine Singulière & Expérience',
        suggestedTitle: 'Le Lancement Singulier — Vitrine d\'Impact',
        artDirectionDefault: 'Statutaire & Épurée',
        artDirectionDesc: 'Typographie de caractère, fluidité absolue, présentation chirurgicale.',
        architecture: ['Présentation de l\'initiative', 'Programme & Keynotes', 'Intervenants', 'Networking & Inscription'],
        signatureFeature: 'Une expérience de présentation sans friction ni temps de chargement.',
        defaultModules: ['Programme & Keynotes', 'Profils des intervenants', 'Inscriptions VIP sans friction', 'Livre blanc & Ressources', 'Espace partenaires'],
        allPossibleModules: [
          'Programme & Keynotes', 'Profils des intervenants', 'Inscriptions VIP sans friction',
          'Livre blanc & Ressources', 'Espace partenaires', 'Diffusion en direct'
        ]
      },
      autre: {
        label: 'Autre / Inclassable',
        categoryName: 'Création Expérimentale Libre',
        badge: 'Création Libre & Sur Mesure',
        suggestedTitle: 'Univers Numérique Sur Mesure',
        artDirectionDefault: 'Libre & Adaptative',
        artDirectionDesc: 'Sculptée sur mesure selon la vision unique de votre projet.',
        architecture: ['Accueil immersif', 'Dispositif signature', 'Modules sur mesure', 'Espace de contact & transmission'],
        signatureFeature: 'Un dispositif interactif conçu de zéro pour votre besoin spécifique.',
        defaultModules: ['Architecture sur mesure intégrale', 'Dispositif interactif signature', 'Storytelling & Design d\'émotion', 'Haute performance & Sécurité'],
        allPossibleModules: [
          'Architecture sur mesure intégrale', 'Dispositif interactif signature',
          'Storytelling & Design d\'émotion', 'Haute performance & Sécurité', 'Lecteur sonore'
        ]
      },
      indecis: {
        label: 'Je ne sais pas encore',
        categoryName: 'Exploration Libre',
        badge: 'Accompagnement & Cadrage',
        suggestedTitle: 'Exploration Conceptuelle — Laboratoire BYAIME',
        artDirectionDefault: 'Poétique & Évolutive',
        artDirectionDesc: 'Nous définissons ensemble la direction au fil de nos premiers échanges.',
        architecture: ['Session d\'exploration', 'Moodboard interactif', 'Prototypage rapide', 'Définition des modules'],
        signatureFeature: 'Une session de co-création pour transformer une intuition en univers numérique concret.',
        defaultModules: ['Cadrage créatif sur mesure', 'Moodboard interactif', 'Architecture narrative', 'Prototypage d\'idées'],
        allPossibleModules: [
          'Cadrage créatif sur mesure', 'Moodboard interactif', 'Architecture narrative', 'Prototypage d\'idées'
        ]
      }
    };

    // State
    var state = {
      step: 1,
      totalSteps: 5,
      type: 'mariage',
      audience: 'proches',
      intentions: ['Organiser', 'Partager', 'Créer des souvenirs'],
      modules: ['Timeline du Jour J', 'RSVP sans mot de passe', 'Profils invités', 'Plan de table interactif', 'Musique & Playlist', 'Galerie photo HD'],
      experienceLevel: 'interactif',
      ambiance: 'poetique',
      // Contact fields
      contact: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        projectName: '',
        eventDate: '',
        location: '',
        message: '',
        wantsCallback: true
      }
    };

    // DOM Elements
    var stepContents = configContainer.querySelectorAll('[data-step-content]');
    var stepIndicators = configContainer.querySelectorAll('[data-step-indicator]');
    var progressBar = document.getElementById('cfg-progress-bar');
    var prevBtn = document.getElementById('cfg-prev-btn');
    var nextBtn = document.getElementById('cfg-next-btn');

    // Synthesis Elements
    var synthTitle = document.getElementById('synth-project-title');
    var synthBadge = document.getElementById('synth-project-badge');
    var synthType = document.getElementById('synth-type-display');
    var synthAmbiance = document.getElementById('synth-ambiance-display');
    var synthLevel = document.getElementById('synth-level-display');
    var synthArtDesc = document.getElementById('synth-art-desc');
    var synthSignature = document.getElementById('synth-signature-feature');
    var synthArchList = document.getElementById('synth-arch-list');
    var synthModulesContainer = document.getElementById('synth-active-modules');
    var synthAvailableModulesContainer = document.getElementById('synth-available-modules');
    var ambianceSelect = document.getElementById('synth-ambiance-select');
    var levelSelect = document.getElementById('synth-level-select');

    // Summary Review Elements
    var summaryType = document.getElementById('sum-type');
    var summaryAudience = document.getElementById('sum-audience');
    var summaryIntentions = document.getElementById('sum-intentions');
    var summaryAmbiance = document.getElementById('sum-ambiance');
    var summaryLevel = document.getElementById('sum-level');
    var summaryModulesList = document.getElementById('sum-modules-list');

    // Restore Draft from LocalStorage if available
    var draft = BYAIME_Storage.load();
    if (draft && draft.type) {
      var resumeBanner = document.getElementById('cfg-resume-banner');
      if (resumeBanner) {
        resumeBanner.classList.remove('hidden');
        var resumeBtn = document.getElementById('cfg-resume-btn');
        var restartBtn = document.getElementById('cfg-restart-btn');

        if (resumeBtn) {
          resumeBtn.addEventListener('click', function () {
            Object.assign(state, draft);
            applyStateToInputs();
            resumeBanner.classList.add('hidden');
            recalculateProposal();
          });
        }
        if (restartBtn) {
          restartBtn.addEventListener('click', function () {
            BYAIME_Storage.clear();
            resumeBanner.classList.add('hidden');
          });
        }
      }
    }

    // Recalculate and update the live synthesis
    function recalculateProposal() {
      var preset = enginePresets[state.type] || enginePresets.mariage;

      // Title & category
      if (synthTitle) synthTitle.textContent = preset.suggestedTitle;
      if (synthBadge) synthBadge.textContent = preset.badge;
      if (synthType) synthType.textContent = preset.categoryName;
      if (synthSignature) synthSignature.textContent = preset.signatureFeature;

      // Ambiance label
      var ambianceLabels = {
        poetique: 'Poétique & Intimiste',
        minimaliste: 'Minimaliste & Épurée',
        cinematique: 'Cinématique & Immersive',
        vibrante: 'Vibrante & Énergique',
        elegante: 'Élégante & Statutaire',
        libre: 'Libre & Personnalisée'
      };
      var activeAmbiance = ambianceLabels[state.ambiance] || preset.artDirectionDefault;
      if (synthAmbiance) synthAmbiance.textContent = activeAmbiance;
      if (synthArtDesc) synthArtDesc.textContent = preset.artDirectionDesc;

      // Level label
      var levelLabels = {
        minimal: 'Minimal (Mini-site élégant)',
        interactif: 'Interactif (Avec outils & interactions)',
        immersif: 'Immersif (Expérience numérique totale)',
        indecis: 'Sur mesure (À imaginer ensemble)'
      };
      if (synthLevel) synthLevel.textContent = levelLabels[state.experienceLevel] || state.experienceLevel;

      // Architecture
      if (synthArchList) {
        synthArchList.innerHTML = '';
        preset.architecture.forEach(function (item) {
          var li = document.createElement('li');
          li.className = 'text-xs text-muted-foreground flex items-center gap-2';
          li.innerHTML = '<span class="h-1.5 w-1.5 rounded-full bg-white flex-shrink-0"></span><span>' + item + '</span>';
          synthArchList.appendChild(li);
        });
      }

      // Render Active Removable Modules
      if (synthModulesContainer) {
        synthModulesContainer.innerHTML = '';
        state.modules.forEach(function (modName) {
          var chip = document.createElement('span');
          chip.className = 'tag-removable';
          chip.innerHTML = '<span>' + modName + '</span><button type="button" class="tag-remove-btn" title="Retirer ce module" aria-label="Retirer ' + modName + '">×</button>';

          var removeBtn = chip.querySelector('button');
          removeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            state.modules = state.modules.filter(function (m) { return m !== modName; });
            recalculateProposal();
            window.trackBYAIME('project_module_removed', { module: modName });
          });

          synthModulesContainer.appendChild(chip);
        });
      }

      // Render Available Modules to Add
      if (synthAvailableModulesContainer) {
        synthAvailableModulesContainer.innerHTML = '';
        var notAdded = preset.allPossibleModules.filter(function (m) {
          return state.modules.indexOf(m) === -1;
        });

        if (notAdded.length === 0) {
          synthAvailableModulesContainer.innerHTML = '<span class="text-xs text-muted-foreground italic">Tous les modules suggérés sont déjà intégrés.</span>';
        } else {
          notAdded.forEach(function (modName) {
            var addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-white hover:bg-white/10 transition-all';
            addBtn.innerHTML = '<span>+ ' + modName + '</span>';

            addBtn.addEventListener('click', function (e) {
              e.preventDefault();
              state.modules.push(modName);
              recalculateProposal();
              window.trackBYAIME('project_module_added', { module: modName });
            });

            synthAvailableModulesContainer.appendChild(addBtn);
          });
        }
      }

      // Update Summary Review (Step 5 / Final State)
      if (summaryType) summaryType.textContent = preset.categoryName;
      if (summaryAudience) summaryAudience.textContent = state.audience;
      if (summaryIntentions) summaryIntentions.textContent = state.intentions.join(', ') || 'Non spécifié';
      if (summaryAmbiance) summaryAmbiance.textContent = activeAmbiance;
      if (summaryLevel) summaryLevel.textContent = levelLabels[state.experienceLevel] || state.experienceLevel;

      if (summaryModulesList) {
        summaryModulesList.innerHTML = '';
        state.modules.forEach(function (mod) {
          var li = document.createElement('li');
          li.className = 'text-xs text-muted-foreground flex items-center gap-2';
          li.innerHTML = '<span class="text-emerald-400">✓</span><span>' + mod + '</span>';
          summaryModulesList.appendChild(li);
        });
      }

      // Save to localStorage
      BYAIME_Storage.save(state);
    }

    // Populate Dynamic Checkboxes in Step 4
    function renderStep4Checkboxes() {
      var container = document.getElementById('step4-tools-checkboxes');
      if (!container) return;

      var preset = enginePresets[state.type] || enginePresets.mariage;
      container.innerHTML = '';

      preset.defaultModules.forEach(function (modName) {
        var isChecked = state.modules.indexOf(modName) !== -1;
        var label = document.createElement('label');
        label.className = 'flex items-start gap-3 p-3.5 rounded-xl border border-border bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors';
        label.innerHTML = '<input type="checkbox" name="step4-tool" value="' + modName + '" class="mt-1 rounded border-border text-white focus:ring-white bg-black h-4 w-4" ' + (isChecked ? 'checked' : '') + '>' +
          '<div><p class="text-xs font-semibold text-white">' + modName + '</p></div>';

        var cb = label.querySelector('input');
        cb.addEventListener('change', function () {
          var checkedList = [];
          container.querySelectorAll('input[name="step4-tool"]:checked').forEach(function (box) {
            checkedList.push(box.value);
          });
          state.modules = checkedList;
          recalculateProposal();
        });

        container.appendChild(label);
      });
    }

    // Go to Step
    function goToStep(targetStep) {
      if (targetStep < 1 || targetStep > state.totalSteps) return;
      state.step = targetStep;

      // Switch views
      stepContents.forEach(function (content) {
        var s = parseInt(content.getAttribute('data-step-content'), 10);
        if (s === state.step) {
          content.classList.remove('hidden');
          content.classList.add('block');
        } else {
          content.classList.add('hidden');
          content.classList.remove('block');
        }
      });

      // Update indicators
      stepIndicators.forEach(function (ind) {
        var s = parseInt(ind.getAttribute('data-step-indicator'), 10);
        if (s === state.step) {
          ind.classList.add('border-white', 'text-white', 'bg-white/10');
          ind.classList.remove('border-border', 'text-muted-foreground', 'bg-transparent', 'border-emerald-500', 'text-emerald-400', 'bg-emerald-500/10');
        } else if (s < state.step) {
          ind.classList.add('border-emerald-500', 'text-emerald-400', 'bg-emerald-500/10');
          ind.classList.remove('border-white', 'border-border', 'text-white', 'text-muted-foreground', 'bg-white/10');
        } else {
          ind.classList.remove('border-white', 'border-emerald-500', 'text-white', 'text-emerald-400', 'bg-white/10', 'bg-emerald-500/10');
          ind.classList.add('border-border', 'text-muted-foreground', 'bg-transparent');
        }
      });

      // Progress bar
      if (progressBar) {
        var pct = ((state.step - 1) / (state.totalSteps - 1)) * 100;
        progressBar.style.width = Math.max(8, pct) + '%';
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
          nextBtn.textContent = 'Transmettre mon projet à Matt Mez →';
        } else {
          nextBtn.textContent = 'Étape suivante →';
        }
      }

      if (state.step === 4) {
        renderStep4Checkboxes();
      }

      recalculateProposal();
      window.trackBYAIME('project_step_changed', { step: state.step });

      // Scroll to configurator
      configContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Apply state to form radio inputs
    function applyStateToInputs() {
      var typeRadio = configContainer.querySelector('input[name="event-type"][value="' + state.type + '"]');
      if (typeRadio) typeRadio.checked = true;

      var audRadio = configContainer.querySelector('input[name="cfg-audience"][value="' + state.audience + '"]');
      if (audRadio) audRadio.checked = true;

      var levelRadio = configContainer.querySelector('input[name="cfg-level"][value="' + state.experienceLevel + '"]');
      if (levelRadio) levelRadio.checked = true;
    }

    // Step 1: Event Type Listener
    configContainer.querySelectorAll('input[name="event-type"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        state.type = radio.value;
        var preset = enginePresets[state.type] || enginePresets.mariage;
        state.modules = preset.defaultModules.slice(0, 6);
        recalculateProposal();
        window.trackBYAIME('project_event_selected', { type: state.type });
      });
    });

    // Step 2: Audience Listener
    configContainer.querySelectorAll('input[name="cfg-audience"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        state.audience = radio.value;
        recalculateProposal();
      });
    });

    // Step 3: Intentions Listeners
    configContainer.querySelectorAll('input[name="cfg-intentions"]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var list = [];
        configContainer.querySelectorAll('input[name="cfg-intentions"]:checked').forEach(function (b) {
          list.push(b.value);
        });
        state.intentions = list;
        recalculateProposal();
      });
    });

    // Step 5: Experience Level Listener
    configContainer.querySelectorAll('input[name="cfg-level"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        state.experienceLevel = radio.value;
        recalculateProposal();
      });
    });

    // Live Proposal Modifier: Ambiance Dropdown
    if (ambianceSelect) {
      ambianceSelect.addEventListener('change', function () {
        state.ambiance = ambianceSelect.value;
        recalculateProposal();
      });
    }

    // Live Proposal Modifier: Level Dropdown
    if (levelSelect) {
      levelSelect.addEventListener('change', function () {
        state.experienceLevel = levelSelect.value;
        recalculateProposal();
      });
    }

    // Next / Prev Button Clicks
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (state.step < state.totalSteps) {
          goToStep(state.step + 1);
        } else {
          submitProjectWorkflow();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        goToStep(state.step - 1);
      });
    }

    // Submissions and Abstraction Function: submitProject()
    function submitProjectWorkflow() {
      // Gather contact fields
      var fn = (document.getElementById('cfg-contact-first') || {}).value || '';
      var ln = (document.getElementById('cfg-contact-last') || {}).value || '';
      var em = (document.getElementById('cfg-contact-email') || {}).value || '';
      var ph = (document.getElementById('cfg-contact-phone') || {}).value || '';
      var pn = (document.getElementById('cfg-contact-projname') || {}).value || '';
      var dt = (document.getElementById('cfg-contact-date') || {}).value || '';
      var loc = (document.getElementById('cfg-contact-loc') || {}).value || '';
      var msg = (document.getElementById('cfg-contact-message') || {}).value || '';
      var cb = (document.getElementById('cfg-contact-callback') || {}).checked;

      state.contact = {
        firstName: fn.trim(),
        lastName: ln.trim(),
        email: em.trim(),
        phone: ph.trim(),
        projectName: pn.trim(),
        eventDate: dt.trim(),
        location: loc.trim(),
        message: msg.trim(),
        wantsCallback: cb !== false
      };

      if (!state.contact.firstName || !state.contact.email) {
        alert('Veuillez au minimum renseigner votre prénom et votre adresse e-mail.');
        var emInput = document.getElementById('cfg-contact-email');
        if (emInput) emInput.focus();
        return;
      }

      var projectPayload = {
        meta: {
          submittedAt: new Date().toISOString(),
          version: 'BYAIME_MVP_1.0'
        },
        type: state.type,
        category: (enginePresets[state.type] || {}).categoryName || state.type,
        audience: state.audience,
        intentions: state.intentions,
        ambiance: state.ambiance,
        level: state.experienceLevel,
        selectedModules: state.modules,
        suggestedTitle: (enginePresets[state.type] || {}).suggestedTitle || '',
        contact: state.contact
      };

      // Call Centralized Abstraction Function
      submitProject(projectPayload);
    }

    // Centralized submitProject abstraction
    function submitProject(payload) {
      window.trackBYAIME('project_submitted', { type: payload.type });

      var formWrap = document.getElementById('cfg-form-wrapper');
      var readyWrap = document.getElementById('cfg-ready-wrapper');

      if (formWrap && readyWrap) {
        formWrap.classList.add('hidden');
        readyWrap.classList.remove('hidden');

        var confName = document.getElementById('conf-name');
        var confTitle = document.getElementById('conf-title');
        var confModules = document.getElementById('conf-modules-count');
        var confMailto = document.getElementById('conf-mailto-link');
        var confDownload = document.getElementById('conf-download-btn');
        var confCopy = document.getElementById('conf-copy-btn');

        if (confName) confName.textContent = payload.contact.firstName + ' ' + payload.contact.lastName;
        if (confTitle) confTitle.textContent = payload.suggestedTitle;
        if (confModules) confModules.textContent = payload.selectedModules.length;

        // Build formatted mailto link
        var mailSubject = encodeURIComponent('[BYAIME Conception] Nouveau Projet : ' + (payload.contact.projectName || payload.suggestedTitle));
        var mailBodyText = 'Bonjour Matt,\n\nVoici les détails de mon projet configuré sur BYAIME :\n\n' +
          '• Type d\'événement : ' + payload.category + '\n' +
          '• Titre suggéré : ' + payload.suggestedTitle + '\n' +
          '• Public : ' + payload.audience + '\n' +
          '• Intentions : ' + payload.intentions.join(', ') + '\n' +
          '• Style / Ambiance : ' + payload.ambiance + '\n' +
          '• Niveau : ' + payload.level + '\n' +
          '• Modules retenus (' + payload.selectedModules.length + ') :\n  - ' + payload.selectedModules.join('\n  - ') + '\n\n' +
          '• Nom du contact : ' + payload.contact.firstName + ' ' + payload.contact.lastName + '\n' +
          '• E-mail : ' + payload.contact.email + '\n' +
          '• Téléphone : ' + (payload.contact.phone || 'Non précisé') + '\n' +
          '• Date envisagée : ' + (payload.contact.eventDate || 'Non précisée') + '\n' +
          '• Localisation : ' + (payload.contact.location || 'Non précisée') + '\n' +
          '• Message : ' + (payload.contact.message || 'Aucun') + '\n\n' +
          'À très bientôt,\n' + payload.contact.firstName;

        if (confMailto) {
          confMailto.href = 'mailto:contact@byaime.com?subject=' + mailSubject + '&body=' + encodeURIComponent(mailBodyText);
        }

        // Copy Payload button
        if (confCopy) {
          confCopy.addEventListener('click', function () {
            navigator.clipboard.writeText(mailBodyText).then(function () {
              confCopy.textContent = '✓ Spécifications copiées !';
              setTimeout(function () { confCopy.textContent = 'Copier la synthèse complète'; }, 3000);
            });
          });
        }

        // Download JSON button
        if (confDownload) {
          confDownload.addEventListener('click', function () {
            var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'BYAIME-Projet-' + (payload.contact.firstName || 'Concept') + '.json';
            a.click();
            URL.revokeObjectURL(url);
          });
        }

        readyWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Initialize proposal
    recalculateProposal();
    window.trackBYAIME('project_started', {});
  });

  // ===== MODULE SOUTIEN ASSOCIATIF LE MONDE AIME =====
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
        window.trackBYAIME('support_clicked', { amount: (displayAmount ? displayAmount.textContent : '50 €') });
        var current = displayAmount ? displayAmount.textContent : '50 €';
        alert('Merci pour votre intérêt envers l\'association LE MONDE AIME !\n\nVotre intention de soutien pour un montant de ' + current + ' a été enregistrée. Le module de paiement sécurisé officiel sera ouvert très prochainement lors de la publication du compte associatif.');
      });
    }
  });

})();
