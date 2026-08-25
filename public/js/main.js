/* ===== BYAIME — AIME Engine V1 + AIME INTENT Agent (Phase 5.0) — main.js ===== */
/* Core Experience Design Engine, AIME INTENT AI Agent, Interactive Prototypes & UI Controller */

(function () {
  'use strict';

  // Mark JS as available
  document.documentElement.classList.add('js');

  // =========================================================================
  // 1. ANALYTICS & LOCAL STORAGE
  // =========================================================================

  window.trackBYAIME = function (eventName, eventData) {
    var payload = {
      event: eventName,
      data: eventData || {},
      timestamp: new Date().toISOString()
    };
    if (window.BYAIME_DEBUG) {
      console.log('[BYAIME Analytics]', payload);
    }
    try {
      window.dispatchEvent(new CustomEvent('byaime_event', { detail: payload }));
    } catch (e) {}
  };

  var STORAGE_KEY = 'byaime_project_model_v2';
  var BYAIME_Storage = {
    save: function (model) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(model));
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

  // =========================================================================
  // 2. AIME ENGINE V1 — COUCHE LOGIQUE, MODULES & MODÈLE CENTRAL
  // =========================================================================

  var moduleRegistry = {
    timeline: {
      id: 'timeline',
      name: 'Timeline du Jour J',
      category: 'Déroulé & Temps',
      description: 'Frise chronologique dynamique et interactive des temps forts avec synchronisation en direct.',
      whyRecommended: 'Permet à tous les invités d\'être synchronisés sans stress tout au long de la journée.',
      icon: '⏱️',
      compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'evenement', 'festival', 'professionnel', 'autre'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    rsvp: {
      id: 'rsvp',
      name: 'RSVP sans mot de passe',
      category: 'Coordination',
      description: 'Confirmation de présence fluide en 1 clic avec gestion des régimes, morceaux préférés et questions sur mesure.',
      whyRecommended: 'Élimine 100% de la friction des formulaires traditionnels pour un taux de réponse maximal.',
      icon: '✉️',
      compatibleEvents: ['mariage', 'anniversaire', 'evenement', 'professionnel', 'autre'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    guests: {
      id: 'guests',
      name: 'Profils & Recherche Invités',
      category: 'Communauté',
      description: 'Recherche instantanée de sa table, trombinoscope bienveillant et espace invités.',
      whyRecommended: 'Facilite les rencontres et permet à chacun de trouver sa place en un clin d\'œil.',
      icon: '👥',
      compatibleEvents: ['mariage', 'anniversaire', 'professionnel', 'autre'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    tables: {
      id: 'tables',
      name: 'Plan de table interactif',
      category: 'Coordination',
      description: 'Plan spatial animé avec recherche de table par prénom et composition des convives.',
      whyRecommended: 'Évite les attroupements devant les panneaux papier le soir du dîner.',
      icon: '🍽️',
      compatibleEvents: ['mariage', 'anniversaire', 'professionnel'],
      dependencies: ['guests'],
      optional: true,
      defaultEnabled: true
    },
    music: {
      id: 'music',
      name: 'Musique & Boîte à sons',
      category: 'Sensorialité',
      description: 'Lecteur audio immersif en fond et suggestion collaborative de morceaux par les invités.',
      whyRecommended: 'Donne une couleur sonore unique au mini-site et prépare la playlist du grand soir.',
      icon: '🎵',
      compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'festival', 'artistique', 'autre'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    gallery: {
      id: 'gallery',
      name: 'Galerie photo HD participative',
      category: 'Souvenirs',
      description: 'Dépôt instantané de photographies par les participants le jour J sans compression dégradante.',
      whyRecommended: 'Collecte tous les points de vue de l\'événement en haute fidélité.',
      icon: '📸',
      compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'evenement', 'festival', 'artistique', 'association', 'autre'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    guestbook: {
      id: 'guestbook',
      name: 'Livre d\'or vocal & messages',
      category: 'Émotion',
      description: 'Enregistrement de messages vocaux authentiques et mots d\'amour déposés par les proches.',
      whyRecommended: 'Capture la chaleur et les inflexions de voix des êtres chers pour l\'éternité.',
      icon: '🎙️',
      compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'artistique', 'association', 'autre'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    memories: {
      id: 'memories',
      name: 'Capsules & Archives de vie',
      category: 'Mémoire',
      description: 'Espace rétrospectif photos, anecdotes et faits marquants traversant les décennies.',
      whyRecommended: 'Raconte l\'histoire qui a mené jusqu\'à ce jour exceptionnel.',
      icon: '🕰️',
      compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'association', 'autre'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    providers: {
      id: 'providers',
      name: 'Prestataires & Guide Hébergements',
      category: 'Logistique',
      description: 'Recommandations d\'hôtels, navettes, coiffeurs et prestataires de l\'événement.',
      whyRecommended: 'Offre une expérience 5 étoiles aux invités venant de loin.',
      icon: '🏨',
      compatibleEvents: ['mariage', 'festival', 'evenement', 'professionnel'],
      dependencies: [],
      optional: true,
      defaultEnabled: false
    },
    map: {
      id: 'map',
      name: 'Cartographie interactive des lieux',
      category: 'Orientation',
      description: 'Carte vectorielle fluide avec repères géolocalisés pour chaque temps fort.',
      whyRecommended: 'Guide les invités d\'un lieu à l\'autre sans erreur.',
      icon: '🗺️',
      compatibleEvents: ['mariage', 'festival', 'evenement', 'professionnel', 'autre'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    countdown: {
      id: 'countdown',
      name: 'Compte à rebours cinématique',
      category: 'Attente & Suspense',
      description: 'Écran d\'accueil avec décompte interactif personnalisé et micro-animations.',
      whyRecommended: 'Crée une émulation et fait monter l\'attente avant le grand moment.',
      icon: '⏳',
      compatibleEvents: ['mariage', 'anniversaire', 'festival', 'evenement', 'professionnel'],
      dependencies: [],
      optional: true,
      defaultEnabled: false
    },
    program: {
      id: 'program',
      name: 'Programme dynamique heure par heure',
      category: 'Déroulé & Temps',
      description: 'Grille interactive avec filtres thématiques, alertes et descriptifs détaillés.',
      whyRecommended: 'Permet à chaque participant d\'organiser son parcours en temps réel.',
      icon: '📋',
      compatibleEvents: ['ceremonie', 'evenement', 'festival', 'professionnel', 'association'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    tributes: {
      id: 'tributes',
      name: 'Espace d\'hommage & Biographie',
      category: 'Mémoire',
      description: 'Biographie intime, portrait lumineux et citations choisies en hommage.',
      whyRecommended: 'Honore une vie avec délicatesse, dignité et poésie.',
      icon: '🕯️',
      compatibleEvents: ['ceremonie'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    testimonials: {
      id: 'testimonials',
      name: 'Recueil de condoléances & Récits',
      category: 'Émotion',
      description: 'Espace sécurisé où chaque proche peut partager un souvenir ou mot de réconfort.',
      whyRecommended: 'Rassemble l\'affection de tous, y compris des proches éloignés.',
      icon: '🕊️',
      compatibleEvents: ['ceremonie', 'association'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    audio: {
      id: 'audio',
      name: 'Retransmission audio & Podcasts',
      category: 'Sensorialité',
      description: 'Diffusion sonore haute fidélité pour les absents et extraits d\'archives orales.',
      whyRecommended: 'Partage l\'émotion avec ceux qui ne peuvent être physiquement présents.',
      icon: '🎧',
      compatibleEvents: ['ceremonie', 'artistique', 'festival', 'evenement'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    video: {
      id: 'video',
      name: 'Coffre-fort de vidéos surprises',
      category: 'Attente & Suspense',
      description: 'Dépôt secret de capsules vidéos déverrouillées uniquement le jour de la fête.',
      whyRecommended: 'Garde la surprise totale pour le fêté jusqu\'à la dernière minute.',
      icon: '🎬',
      compatibleEvents: ['anniversaire', 'mariage'],
      dependencies: [],
      optional: true,
      defaultEnabled: false
    },
    privateSpace: {
      id: 'privateSpace',
      name: 'Espace privé & Confidentiel',
      category: 'Sécurité',
      description: 'Accès réservé avec code pour les proches ou organisateurs.',
      whyRecommended: 'Préserve les informations sensibles et les surprises.',
      icon: '🔒',
      compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'professionnel', 'autre'],
      dependencies: [],
      optional: true,
      defaultEnabled: false
    },
    notifications: {
      id: 'notifications',
      name: 'Alertes en direct le jour J',
      category: 'Coordination',
      description: 'Notifications PWA discrètes pour signaler le passage à table ou un temps fort.',
      whyRecommended: 'Fluidifie le timing sans devoir crier dans un mégaphone.',
      icon: '🔔',
      compatibleEvents: ['mariage', 'festival', 'evenement'],
      dependencies: [],
      optional: true,
      defaultEnabled: false
    },
    agenda: {
      id: 'agenda',
      name: 'Mon agenda personnalisé',
      category: 'Expérience Visiteur',
      description: 'Le festivalier ou invité compose son planning en cochant ses favoris.',
      whyRecommended: 'Offre une expérience sur mesure à chaque participant.',
      icon: '📅',
      compatibleEvents: ['festival', 'evenement', 'professionnel'],
      dependencies: ['program'],
      optional: true,
      defaultEnabled: true
    },
    artists: {
      id: 'artists',
      name: 'Fiches immersives des artistes',
      category: 'Contenu',
      description: 'Biographies, extraits musicaux et visuels interactifs des créateurs.',
      whyRecommended: 'Met en lumière les talents et plonge le public dans leur univers.',
      icon: '🎨',
      compatibleEvents: ['festival', 'artistique', 'evenement'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    tickets: {
      id: 'tickets',
      name: 'Accès & Billetterie sans friction',
      category: 'Logistique',
      description: 'Réservation ou inscription immédiate intégrée sans redirection.',
      whyRecommended: 'Maximise les réservations grâce à un parcours fluide.',
      icon: '🎟️',
      compatibleEvents: ['festival', 'evenement', 'professionnel', 'artistique'],
      dependencies: [],
      optional: true,
      defaultEnabled: false
    },
    donations: {
      id: 'donations',
      name: 'Module de don & Adhésion',
      category: 'Engagement',
      description: 'Soutien direct libre ou récurrent sans commissions abusives.',
      whyRecommended: 'Permet aux sympathisants de soutenir la cause en toute confiance.',
      icon: '🤝',
      compatibleEvents: ['association'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    impact: {
      id: 'impact',
      name: 'Visualiseur d\'impact en direct',
      category: 'Transparence',
      description: 'Infographies dynamiques reliant chaque action citoyenne aux résultats de terrain.',
      whyRecommended: 'Prouve la valeur des actions et fidélise la communauté.',
      icon: '📊',
      compatibleEvents: ['association'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    },
    contact: {
      id: 'contact',
      name: 'Liaison directe & Transmission',
      category: 'Coordination',
      description: 'Formulaire chiffré de prise de contact direct avec les organisateurs.',
      whyRecommended: 'Canal privilégié pour répondre aux questions particulières.',
      icon: '💬',
      compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'evenement', 'festival', 'artistique', 'association', 'professionnel', 'autre', 'indecis'],
      dependencies: [],
      optional: true,
      defaultEnabled: true
    }
  };

  var defaultPresets = {
    mariage: {
      type: 'mariage',
      categoryName: 'Mariage Singulier',
      badge: 'Univers Amour & Célébration',
      suggestedTitle: 'Le Grand Jour — L\'expérience vivante',
      subtitle: 'Un univers numérique poétique et vivant pour les futurs mariés.',
      description: 'Un sanctuaire intime sous un ciel étoilé interactif avec synchronisation du jour J et boîte à souvenirs audio.',
      artDirection: 'Tons chauds, typographie raffinée, constellation céleste interactive, ambiance sonore douce.',
      signatureInteraction: 'Une Timeline vivante synchronisée qui transforme chaque moment du mariage en expérience partagée.',
      defaultModules: ['timeline', 'rsvp', 'guests', 'tables', 'music', 'gallery', 'guestbook', 'map'],
      pages: ['Accueil', 'Programme', 'Invités & Tables', 'Musique', 'Galerie & Souvenirs', 'Guide pratique'],
      alternatives: [
        {
          name: 'Version 01 • L\'Épure & L\'Intime',
          ambiance: 'minimaliste',
          level: 'minimal',
          title: 'L\'Épure & L\'Intime',
          signature: 'Un mini-site d\'une grande sobriété avec compte à rebours et RSVP instantané.',
          modules: ['countdown', 'rsvp', 'timeline', 'map', 'contact']
        },
        {
          name: 'Version 02 • Le Mariage Vivant',
          ambiance: 'poetique',
          level: 'interactif',
          title: 'Le Grand Jour — L\'expérience vivante',
          signature: 'Une Timeline vivante avec plan de table interactif et boîte à musique partagée.',
          modules: ['timeline', 'rsvp', 'guests', 'tables', 'music', 'gallery', 'guestbook', 'map']
        },
        {
          name: 'Version 03 • L\'Union Céleste Immersive',
          ambiance: 'cinematique',
          level: 'immersif',
          title: 'L\'Astral & L\'Union Céleste',
          signature: 'Univers WebGL avec ciel étoilé interactif, livre d\'or vocal et galerie haute fidélité.',
          modules: ['countdown', 'timeline', 'rsvp', 'guests', 'tables', 'music', 'gallery', 'guestbook', 'memories', 'map', 'notifications', 'privateSpace', 'contact']
        }
      ]
    },
    ceremonie: {
      type: 'ceremonie',
      categoryName: 'Cérémonie & Hommage',
      badge: 'Mémorial Poétique & Apaisant',
      suggestedTitle: 'La Trace & Le Souvenir — Mémorial Vivant',
      subtitle: 'Un espace mémoriel intime pour célébrer une vie et relier les proches.',
      description: 'Un sanctuaire sobre et délicat avec diffusion audio, bougies virtuelles et recueil de témoignages.',
      artDirection: 'Clair-obscur apaisant, contrastes doux, respiration visuelle généreuse, sobriété mémorielle.',
      signatureInteraction: 'Une bougie virtuelle du souvenir reliant les pensées des proches du monde entier.',
      defaultModules: ['program', 'tributes', 'testimonials', 'gallery', 'music', 'audio', 'memories', 'contact'],
      pages: ['Espace de Recueillement', 'Biographie & Hommage', 'Programme & Retransmission', 'Témoignages', 'Archives de vie'],
      alternatives: [
        {
          name: 'Version 01 • Recueillement Sobre',
          ambiance: 'minimaliste',
          level: 'minimal',
          title: 'Le Mémorial Intime',
          signature: 'Une page sobre avec biographie, pensées et livret téléchargeable.',
          modules: ['tributes', 'testimonials', 'contact']
        },
        {
          name: 'Version 02 • La Trace Vivante',
          ambiance: 'poetique',
          level: 'interactif',
          title: 'La Trace & Le Souvenir',
          signature: 'Retransmission audio discrète, bougies virtuelles et recueil d\'anecdotes.',
          modules: ['program', 'tributes', 'testimonials', 'gallery', 'music', 'audio', 'memories', 'contact']
        },
        {
          name: 'Version 03 • Mémorial Héritage & Archives',
          ambiance: 'elegante',
          level: 'immersif',
          title: 'L\'Héritage d\'une Vie',
          signature: 'Archives orales restaurées, arbre des mémoires et livret d\'art imprimable.',
          modules: ['program', 'tributes', 'testimonials', 'gallery', 'music', 'audio', 'memories', 'privateSpace', 'contact']
        }
      ]
    },
    anniversaire: {
      type: 'anniversaire',
      categoryName: 'Anniversaire d\'Exception',
      badge: 'Capsule Temporelle Interactive',
      suggestedTitle: 'Capsule Temporelle — La Rétrospective',
      subtitle: 'Une aventure interactive à énigmes pour un cap de vie inoubliable.',
      description: 'Frise chronologique, décompte, playlist participative et coffre-fort de vidéos surprises.',
      artDirection: 'Contraste affirmé, micro-animations festives et élégantes, typographie expressive.',
      signatureInteraction: 'Une capsule temporelle interactive à énigmes révélant les étapes de la fête au fil des jours.',
      defaultModules: ['countdown', 'memories', 'rsvp', 'music', 'gallery', 'video', 'map', 'contact'],
      pages: ['Accueil & Décompte', 'Frise des années', 'Playlist collaborative', 'Cagnotte', 'Vidéos surprises'],
      alternatives: [
        {
          name: 'Version 01 • L\'Invitation Chic',
          ambiance: 'elegante',
          level: 'minimal',
          title: 'La Célébration',
          signature: 'Invitation élégante avec RSVP et détails d\'accès.',
          modules: ['rsvp', 'map', 'countdown', 'contact']
        },
        {
          name: 'Version 02 • La Capsule Temporelle',
          ambiance: 'vibrante',
          level: 'interactif',
          title: 'Capsule Temporelle — La Rétrospective',
          signature: 'Énigmes progressives pour révéler le lieu et playlist collaborative.',
          modules: ['countdown', 'memories', 'rsvp', 'music', 'gallery', 'video', 'map', 'contact']
        },
        {
          name: 'Version 03 • L\'Odyssée Secrète',
          ambiance: 'cinematique',
          level: 'immersif',
          title: 'L\'Odyssée Secrète',
          signature: 'Micro-jeu de piste en ligne, trombinoscope animé et coffre de messages secrets.',
          modules: ['countdown', 'memories', 'rsvp', 'guests', 'music', 'gallery', 'video', 'map', 'privateSpace', 'contact']
        }
      ]
    },
    evenement: {
      type: 'evenement',
      categoryName: 'Événement Culturel',
      badge: 'Scénographie Numérique',
      suggestedTitle: 'Le Pavillon Numérique — Guide Vivant',
      subtitle: 'Une PWA ultra-rapide pensée comme l\'extension digitale de l\'événement.',
      description: 'Programme interactif, carte des scènes, fiches intervenants et mode hors-ligne.',
      artDirection: 'Esthétique épurée, responsive ultra-fluide, mode hors-ligne instantané.',
      signatureInteraction: 'Un plan interactif en temps réel avec notifications des temps forts et agenda hors-ligne.',
      defaultModules: ['program', 'artists', 'map', 'agenda', 'tickets', 'notifications', 'contact'],
      pages: ['Accueil', 'Programme dynamique', 'Intervenants & Artistes', 'Plan des scènes', 'Mon Agenda'],
      alternatives: [
        {
          name: 'Version 01 • Guide Essentiel',
          ambiance: 'minimaliste',
          level: 'minimal',
          title: 'Le Guide Événement',
          signature: 'Programme clair et plan d\'accès immédiat.',
          modules: ['program', 'map', 'tickets', 'contact']
        },
        {
          name: 'Version 02 • Le Pavillon Vivant',
          ambiance: 'cinematique',
          level: 'interactif',
          title: 'Le Pavillon Numérique — Guide Vivant',
          signature: 'Filtres par scène, mode hors-ligne et agenda personnalisé.',
          modules: ['program', 'artists', 'map', 'agenda', 'tickets', 'notifications', 'contact']
        },
        {
          name: 'Version 03 • L\'Immersion 360°',
          ambiance: 'vibrante',
          level: 'immersif',
          title: 'La Scénographie Événementielle',
          signature: 'Flux en direct, podcasts des coulisses et alertes SMS.',
          modules: ['program', 'artists', 'map', 'agenda', 'tickets', 'audio', 'gallery', 'notifications', 'contact']
        }
      ]
    },
    festival: {
      type: 'festival',
      categoryName: 'Festival & Rassemblement',
      badge: 'Scénographie Numérique Immersion',
      suggestedTitle: 'L\'Expérience Festival — Live & Offline',
      subtitle: 'L\'application web autonome pour vivre le festival à 100%.',
      description: 'Line-up interactif, carte géolocalisée et agenda hors-ligne sans réseau mobile.',
      artDirection: 'Contrastes dynamiques, navigation pensée pour le plein air.',
      signatureInteraction: 'Un système d\'agenda personnalisé fonctionnant à 100% sans connexion réseau.',
      defaultModules: ['program', 'artists', 'map', 'agenda', 'tickets', 'notifications', 'music', 'contact'],
      pages: ['Line-up', 'Planning par scènes', 'Carte géolocalisée', 'Mon Festival', 'Infos pratiques'],
      alternatives: [
        {
          name: 'Version 01 • Line-up & Billetterie',
          ambiance: 'minimaliste',
          level: 'minimal',
          title: 'Le Pass Festival',
          signature: 'Accès rapide aux horaires et billetterie.',
          modules: ['program', 'tickets', 'map', 'contact']
        },
        {
          name: 'Version 02 • Live & Offline',
          ambiance: 'vibrante',
          level: 'interactif',
          title: 'L\'Expérience Festival — Live & Offline',
          signature: 'Carte interactive et favoris hors-ligne.',
          modules: ['program', 'artists', 'map', 'agenda', 'tickets', 'notifications', 'music', 'contact']
        },
        {
          name: 'Version 03 • Le Pavillon Festivalier 360°',
          ambiance: 'cinematique',
          level: 'immersif',
          title: 'Le Pavillon Festivalier 360°',
          signature: 'Boîte à sons d\'artistes, notifications géolocalisées et galerie photo live.',
          modules: ['program', 'artists', 'map', 'agenda', 'tickets', 'notifications', 'music', 'gallery', 'contact']
        }
      ]
    },
    artistique: {
      type: 'artistique',
      categoryName: 'Projet Artistique & Performance',
      badge: 'Galerie Sensorielle & Laboratoire',
      suggestedTitle: 'Matière & Lumière — Scénographie Numérique',
      subtitle: 'Une scénographie en clair-obscur où chaque œuvre réagit au visiteur.',
      description: 'Fond noir profond, sound design réactif, exploration haute fidélité et podcasts.',
      artDirection: 'Fond noir profond, sound design réactif, exploration haute fidélité.',
      signatureInteraction: 'Une scénographie sonore générative qui réagit au mouvement du visiteur sur les œuvres.',
      defaultModules: ['artists', 'music', 'audio', 'gallery', 'guestbook', 'contact'],
      pages: ['Scénographie', 'Exploration des œuvres', 'Notes d\'intention', 'Livre d\'or'],
      alternatives: [
        {
          name: 'Version 01 • Le Portfolio d\'Artiste',
          ambiance: 'minimaliste',
          level: 'minimal',
          title: 'L\'Atelier Virtuel',
          signature: 'Présentation épurée des pièces et biographie.',
          modules: ['gallery', 'artists', 'contact']
        },
        {
          name: 'Version 02 • Matière & Lumière',
          ambiance: 'poetique',
          level: 'interactif',
          title: 'Matière & Lumière — Scénographie Numérique',
          signature: 'Sound design immersif et podcasts de notes d\'intention.',
          modules: ['artists', 'music', 'audio', 'gallery', 'guestbook', 'contact']
        },
        {
          name: 'Version 03 • La Scénographie Totale',
          ambiance: 'cinematique',
          level: 'immersif',
          title: 'La Scénographie Totale',
          signature: 'Interactions visuelles réactives au pointeur et acquisition en direct.',
          modules: ['artists', 'music', 'audio', 'gallery', 'guestbook', 'privateSpace', 'contact']
        }
      ]
    },
    association: {
      type: 'association',
      categoryName: 'Association & Cause',
      badge: 'Récit d\'Impact & Mobilisation',
      suggestedTitle: 'Plateforme d\'Engagement & Récits Vivants',
      subtitle: 'Storytelling immersif articulé autour des récits et de l\'impact.',
      description: 'Récits vivants, infographies d\'impact en direct et adhésion sans friction.',
      artDirection: 'Chaleureuse, clarté éditoriale, visuels humains, infographies vivantes.',
      signatureInteraction: 'Un visualiseur d\'impact reliant chaque engagement citoyen à une action concrète.',
      defaultModules: ['testimonials', 'impact', 'donations', 'memories', 'gallery', 'contact'],
      pages: ['Notre Mission', 'Récits de bénéficiaires', 'Impact mesuré', 'Soutenir & Adhérer', 'Manifeste'],
      alternatives: [
        {
          name: 'Version 01 • La Vitrine Solidaire',
          ambiance: 'minimaliste',
          level: 'minimal',
          title: 'Le Manifeste Citoyen',
          signature: 'Présentation des missions et module d\'adhésion.',
          modules: ['donations', 'contact']
        },
        {
          name: 'Version 02 • Récits & Impact',
          ambiance: 'libre',
          level: 'interactif',
          title: 'Plateforme d\'Engagement & Récits Vivants',
          signature: 'Visualiseur d\'impact en direct et récits vivants.',
          modules: ['testimonials', 'impact', 'donations', 'memories', 'gallery', 'contact']
        },
        {
          name: 'Version 03 • La Tribune Ouverte',
          ambiance: 'vibrante',
          level: 'immersif',
          title: 'La Tribune Ouverte',
          signature: 'Mur des contributeurs, podcasts et carte des actions de terrain.',
          modules: ['testimonials', 'impact', 'donations', 'memories', 'gallery', 'audio', 'map', 'contact']
        }
      ]
    },
    professionnel: {
      type: 'professionnel',
      categoryName: 'Projet Professionnel & Lancement',
      badge: 'Vitrine Singulière & Expérience',
      suggestedTitle: 'Le Lancement Singulier — Vitrine d\'Impact',
      subtitle: 'Une présentation d\'initiative sans aucun temps de chargement.',
      description: 'Programme des keynotes, fiches intervenants et inscriptions VIP fluides.',
      artDirection: 'Statutaire, typographie de caractère, fluidité chirurgicale.',
      signatureInteraction: 'Une expérience de présentation sans friction ni temps de chargement.',
      defaultModules: ['program', 'artists', 'rsvp', 'tickets', 'map', 'contact'],
      pages: ['Initiative', 'Keynotes & Programme', 'Intervenants', 'Inscriptions VIP', 'Partenaires'],
      alternatives: [
        {
          name: 'Version 01 • Invitation VIP',
          ambiance: 'elegante',
          level: 'minimal',
          title: 'L\'Avant-Première',
          signature: 'Invitation confidentielle avec RSVP sécurisé.',
          modules: ['rsvp', 'program', 'contact']
        },
        {
          name: 'Version 02 • Le Lancement Vivant',
          ambiance: 'cinematique',
          level: 'interactif',
          title: 'Le Lancement Singulier — Vitrine d\'Impact',
          signature: 'Fiches intervenants, billetterie fluide et cartographie des lieux.',
          modules: ['program', 'artists', 'rsvp', 'tickets', 'map', 'contact']
        },
        {
          name: 'Version 03 • L\'Expérience Hybride',
          ambiance: 'vibrante',
          level: 'immersif',
          title: 'L\'Immersion Keynote',
          signature: 'Retransmission audio/vidéo, notifications et espace privé partenaires.',
          modules: ['program', 'artists', 'rsvp', 'tickets', 'map', 'audio', 'notifications', 'privateSpace', 'contact']
        }
      ]
    },
    autre: {
      type: 'autre',
      categoryName: 'Création Expérimentale Libre',
      badge: 'Création Libre & Sur Mesure',
      suggestedTitle: 'Univers Numérique Sur Mesure',
      subtitle: 'Une création libre sculptée selon vos désirs artistiques les plus singuliers.',
      description: 'Architecture sur mesure, micro-interactions personnalisées et design d\'émotion.',
      artDirection: 'Sur mesure selon la vision unique de votre projet.',
      signatureInteraction: 'Un dispositif interactif conçu de zéro pour votre besoin spécifique.',
      defaultModules: ['timeline', 'music', 'gallery', 'guestbook', 'map', 'contact'],
      pages: ['Accueil', 'Déroulé', 'Dispositif Signature', 'Souvenirs', 'Contact'],
      alternatives: [
        {
          name: 'Version 01 • La Vitrine Poétique',
          ambiance: 'poetique',
          level: 'minimal',
          title: 'L\'Écho Numérique',
          signature: 'Une présence sobre et raffinée.',
          modules: ['music', 'gallery', 'contact']
        },
        {
          name: 'Version 02 • Le Laboratoire d\'Interaction',
          ambiance: 'cinematique',
          level: 'interactif',
          title: 'Univers Numérique Sur Mesure',
          signature: 'Dispositif interactif conçu de zéro.',
          modules: ['timeline', 'music', 'gallery', 'guestbook', 'map', 'contact']
        },
        {
          name: 'Version 03 • L\'Œuvre Complète',
          ambiance: 'libre',
          level: 'immersif',
          title: 'La Scénographie Ouverte',
          signature: 'Expérience multi-dimensionnelle et archivage pérenne.',
          modules: ['timeline', 'music', 'gallery', 'guestbook', 'map', 'audio', 'video', 'privateSpace', 'contact']
        }
      ]
    },
    indecis: {
      type: 'indecis',
      categoryName: 'Exploration Libre & Cadrage',
      badge: 'Accompagnement & Cadrage',
      suggestedTitle: 'Exploration Conceptuelle — Laboratoire BYAIME',
      subtitle: 'Transformons ensemble votre intuition en univers numérique concret.',
      description: 'Session de co-création, moodboard interactif et prototypage d\'idées.',
      artDirection: 'Évolutive, façonnée au fil de nos premiers échanges créatifs.',
      signatureInteraction: 'Une session de co-création pour transformer une intuition en expérience concrète.',
      defaultModules: ['timeline', 'music', 'gallery', 'guestbook', 'contact'],
      pages: ['Exploration', 'Moodboard', 'Prototypage', 'Contact'],
      alternatives: [
        {
          name: 'Version 01 • L\'Ébauche Essentielle',
          ambiance: 'minimaliste',
          level: 'minimal',
          title: 'Première Ébauche',
          signature: 'Cadrage des besoins essentiels.',
          modules: ['gallery', 'contact']
        },
        {
          name: 'Version 02 • L\'Exploration Guidée',
          ambiance: 'poetique',
          level: 'interactif',
          title: 'Exploration Conceptuelle — Laboratoire BYAIME',
          signature: 'Prototypage rapide et définition des modules.',
          modules: ['timeline', 'music', 'gallery', 'guestbook', 'contact']
        },
        {
          name: 'Version 03 • Le Sanctuaire Complet',
          ambiance: 'cinematique',
          level: 'immersif',
          title: 'L\'Expérience Intégrale',
          signature: 'Architecture narrative et sound design sur mesure.',
          modules: ['timeline', 'music', 'gallery', 'guestbook', 'map', 'audio', 'contact']
        }
      ]
    }
  };

  // =========================================================================
  // 3. AIME ENGINE — MÉTHODES CENTRALES & CONTRATS ARCHITECTURAUX
  // =========================================================================

  window.AIME_Engine = {
    version: '1.1.0-intent-ready',
    moduleRegistry: moduleRegistry,
    presets: defaultPresets,

    // Factory: Créer une instance propre de projectModel
    createProjectModel: function (initialData) {
      initialData = initialData || {};
      var baseType = initialData.type || 'mariage';
      var preset = defaultPresets[baseType] || defaultPresets.mariage;

      return {
        id: 'byaime_proj_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        identity: {
          firstName: initialData.firstName || '',
          lastName: initialData.lastName || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          projectName: initialData.projectName || ''
        },
        event: {
          type: baseType,
          date: initialData.date || '',
          location: initialData.location || '',
          audience: initialData.audience || 'Mes proches'
        },
        intentions: initialData.intentions || ['Organiser', 'Partager', 'Créer des souvenirs'],
        experience: {
          atmosphere: initialData.atmosphere || 'poetique',
          level: initialData.level || 'interactif'
        },
        modules: (initialData.modules || preset.defaultModules).slice(),
        architecture: {
          pages: preset.pages.slice(),
          navigation: preset.pages.slice(0, 4),
          features: []
        },
        concept: {
          title: preset.suggestedTitle,
          subtitle: preset.subtitle,
          description: preset.description,
          artDirection: preset.artDirection,
          signatureInteraction: preset.signatureInteraction
        },
        message: initialData.message || '',
        status: 'draft',
        support: {
          clicked: false,
          amount: 50
        }
      };
    },

    // Moteur de scoring et de recommandation de modules (Isolé & Déterministe)
    recommendModules: function (projectModel) {
      var eventType = projectModel.event.type || 'mariage';
      var intentions = projectModel.intentions || [];
      var audience = projectModel.event.audience || '';
      var level = projectModel.experience.level || 'interactif';

      var scores = {};
      var allKeys = Object.keys(moduleRegistry);

      allKeys.forEach(function (modId) {
        var mod = moduleRegistry[modId];
        var score = 30;

        if (mod.compatibleEvents.indexOf(eventType) !== -1) {
          score += 40;
        }

        if (intentions.indexOf('Organiser') !== -1 && ['timeline', 'rsvp', 'tables', 'map', 'program'].indexOf(modId) !== -1) score += 20;
        if (intentions.indexOf('Émouvoir') !== -1 && ['guestbook', 'memories', 'music', 'audio', 'tributes', 'testimonials'].indexOf(modId) !== -1) score += 25;
        if (intentions.indexOf('Partager') !== -1 && ['gallery', 'music', 'guestbook', 'video'].indexOf(modId) !== -1) score += 20;
        if (intentions.indexOf('Créer des souvenirs') !== -1 && ['gallery', 'guestbook', 'memories', 'tributes'].indexOf(modId) !== -1) score += 25;
        if (intentions.indexOf('Rassembler') !== -1 && ['guests', 'map', 'donations', 'impact'].indexOf(modId) !== -1) score += 15;
        if (intentions.indexOf('Informer') !== -1 && ['program', 'map', 'providers', 'notifications', 'agenda'].indexOf(modId) !== -1) score += 20;

        if (audience === 'Un public' || audience === 'Une communauté') {
          if (['agenda', 'artists', 'tickets', 'notifications', 'map'].indexOf(modId) !== -1) score += 15;
        }
        if (audience === 'Mes proches' || audience === 'Ma famille') {
          if (['guestbook', 'memories', 'gallery', 'tables', 'tributes'].indexOf(modId) !== -1) score += 15;
        }

        if (level === 'immersif') {
          if (['music', 'audio', 'video', 'countdown', 'notifications', 'guestbook'].indexOf(modId) !== -1) score += 15;
        }
        if (level === 'minimal') {
          if (['notifications', 'video', 'providers'].indexOf(modId) !== -1) score -= 20;
        }

        scores[modId] = Math.min(100, Math.max(0, score));
      });

      return {
        scores: scores,
        allCompatible: allKeys.filter(function (id) {
          return moduleRegistry[id].compatibleEvents.indexOf(eventType) !== -1;
        })
      };
    },

    // Point d'entrée officiel de génération de l'expérience : generateExperience(projectModel)
    generateExperience: function (projectModel) {
      var preset = defaultPresets[projectModel.event.type] || defaultPresets.mariage;

      return {
        id: 'exp_' + (projectModel.id || 'default'),
        theme: projectModel.experience.atmosphere || 'poetique',
        atmosphere: projectModel.experience.atmosphere || 'poetique',
        level: projectModel.experience.level || 'interactif',
        meta: {
          title: projectModel.concept.title || preset.suggestedTitle,
          subtitle: projectModel.concept.subtitle || preset.subtitle,
          description: projectModel.concept.description || preset.description,
          artDirection: projectModel.concept.artDirection || preset.artDirection,
          signatureInteraction: projectModel.concept.signatureInteraction || preset.signatureInteraction
        },
        pages: (projectModel.architecture && projectModel.architecture.pages) ? projectModel.architecture.pages : preset.pages,
        navigation: (projectModel.architecture && projectModel.architecture.navigation) ? projectModel.architecture.navigation : preset.pages.slice(0, 4),
        modules: (projectModel.modules || []).map(function (mId) {
          return moduleRegistry[mId] || { id: mId, name: mId, icon: '✨', category: 'Général', description: '' };
        }),
        contentSlots: [
          { slotId: 'hero_title', type: 'text', value: projectModel.concept.title || preset.suggestedTitle },
          { slotId: 'hero_subtitle', type: 'text', value: projectModel.concept.subtitle || preset.subtitle },
          { slotId: 'timeline_block', type: 'timeline', enabled: (projectModel.modules || []).indexOf('timeline') !== -1 },
          { slotId: 'music_block', type: 'audio', enabled: (projectModel.modules || []).indexOf('music') !== -1 || (projectModel.modules || []).indexOf('audio') !== -1 },
          { slotId: 'gallery_block', type: 'gallery', enabled: (projectModel.modules || []).indexOf('gallery') !== -1 },
          { slotId: 'guestbook_block', type: 'guestbook', enabled: (projectModel.modules || []).indexOf('guestbook') !== -1 || (projectModel.modules || []).indexOf('testimonials') !== -1 }
        ],
        interactions: {
          signature: projectModel.concept.signatureInteraction || preset.signatureInteraction,
          hasAudio: (projectModel.modules || []).indexOf('music') !== -1 || (projectModel.modules || []).indexOf('audio') !== -1,
          hasRSVP: (projectModel.modules || []).indexOf('rsvp') !== -1,
          hasInteractiveTimeline: (projectModel.modules || []).indexOf('timeline') !== -1
        },
        mediaSlots: {
          heroImage: 'Votre photo principale ici',
          audioTrack: 'Votre musique ici',
          galleryPlaceholders: ['Votre photo ici', 'Vos souvenirs ici', 'Vos invités ici']
        }
      };
    },

    // Builder du Cahier des Charges
    buildCahierDesCharges: function (model, experience) {
      experience = experience || this.generateExperience(model);
      var modNames = (model.modules || []).map(function (mId) {
        var m = moduleRegistry[mId];
        return m ? m.name : mId;
      });

      var plainText = '==================================================\n' +
        '# CAHIER DES CHARGES BYAIME — PROJET SUR MESURE\n' +
        '==================================================\n\n' +
        'NOM DU PROJET : ' + (model.identity.projectName || model.concept.title) + '\n' +
        'DATE DE CRÉATION : ' + new Date(model.createdAt || Date.now()).toLocaleDateString('fr-FR') + '\n\n' +
        '## 01 — INTENTION\n' +
        (model.intentions.join(', ') || 'Création d\'un univers numérique singulier') + '\n\n' +
        '## 02 — PUBLIC & DESTINATAIRES\n' +
        model.event.audience + '\n\n' +
        '## 03 — ÉVÉNEMENT & CONTEXTE\n' +
        'Type : ' + model.event.type + '\n' +
        'Date estimée : ' + (model.event.date || 'Non spécifiée') + '\n' +
        'Localisation : ' + (model.event.location || 'Non spécifiée') + '\n\n' +
        '## 04 — EXPÉRIENCE SOUHAITÉE\n' +
        model.concept.description + '\n\n' +
        '## 05 — DIRECTION ARTISTIQUE\n' +
        'Ambiance : ' + model.experience.atmosphere + '\n' +
        'Niveau d\'interactivité : ' + model.experience.level + '\n' +
        'Notes esthétiques : ' + model.concept.artDirection + '\n\n' +
        '## 06 — ARCHITECTURE DU MINI-SITE\n' +
        (experience.pages || []).map(function (p, i) { return (i + 1) + '. ' + p; }).join('\n') + '\n\n' +
        '## 07 — MODULES RETENUS (' + model.modules.length + ')\n' +
        modNames.map(function (n) { return '• ' + n; }).join('\n') + '\n\n' +
        '## 08 — INTERACTION SIGNATURE\n' +
        model.concept.signatureInteraction + '\n\n' +
        '## 09 — CONTENUS NÉCESSAIRES\n' +
        '• Photographies & archives\n• Textes & récits\n• Extraits sonores ou musiques de référence\n\n' +
        '## 10 — CONTACT & PROCHAINE ÉTAPE\n' +
        'Contact : ' + model.identity.firstName + ' ' + model.identity.lastName + ' (' + model.identity.email + ')\n' +
        'Session de cadrage et modélisation du prototype interactif avec Matt Mez.';

      return {
        plainText: plainText,
        model: model,
        experience: experience
      };
    },

    // Fusion propre d'un StructuredIntent dans projectModel (Règle HUMAIN > IA)
    mergeStructuredIntentIntoProject: function (structuredIntent, existingProjectModel) {
      existingProjectModel = existingProjectModel || this.createProjectModel();
      var eventType = (structuredIntent.eventType && structuredIntent.eventType.value) ? structuredIntent.eventType.value : existingProjectModel.event.type;
      var preset = defaultPresets[eventType] || defaultPresets.mariage;

      var updated = Object.assign({}, existingProjectModel);
      updated.event = Object.assign({}, existingProjectModel.event, {
        type: eventType,
        audience: (structuredIntent.audience && structuredIntent.audience.value) ? structuredIntent.audience.value : existingProjectModel.event.audience
      });

      if (Array.isArray(structuredIntent.intentions) && structuredIntent.intentions.length > 0) {
        updated.intentions = structuredIntent.intentions.map(function (i) {
          return typeof i === 'string' ? i : i.value;
        }).filter(Boolean);
      }

      if (structuredIntent.experience) {
        updated.experience = {
          atmosphere: structuredIntent.experience.atmosphere || existingProjectModel.experience.atmosphere || 'poetique',
          level: structuredIntent.experience.level || existingProjectModel.experience.level || 'interactif'
        };
      }

      if (structuredIntent.summary) {
        updated.concept.description = structuredIntent.summary;
      }

      // Recommandation intelligente des modules pour ce profil
      var rec = this.recommendModules(updated);
      var sortedKeys = Object.keys(rec.scores).filter(function (k) {
        return moduleRegistry[k].compatibleEvents.indexOf(eventType) !== -1;
      });
      sortedKeys.sort(function (a, b) { return rec.scores[b] - rec.scores[a]; });

      // Conserver les modules essentiels ayant un score élevé
      updated.modules = sortedKeys.slice(0, 7);
      updated.architecture.pages = preset.pages.slice();
      updated.architecture.navigation = preset.pages.slice(0, 4);
      updated.concept.title = preset.suggestedTitle;
      updated.concept.subtitle = preset.subtitle;
      updated.concept.signatureInteraction = preset.signatureInteraction;
      updated.concept.artDirection = preset.artDirection;
      updated.message = structuredIntent.rawIntent || existingProjectModel.message || '';
      updated.updatedAt = new Date().toISOString();

      return updated;
    },

    // Client pour appeler l'agent AIME INTENT (/api/aime-intent)
    callAimeIntentAgent: async function (rawText) {
      window.trackBYAIME('aime_intent_submitted', { length: (rawText || '').length });

      try {
        var response = await fetch('/api/aime-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: rawText })
        });

        var result = await response.json();

        if (!response.ok || !result.success) {
          window.trackBYAIME('aime_intent_failed', { error: result.error || 'HTTP_' + response.status });
          return {
            success: false,
            error: result.error || 'SERVER_ERROR',
            message: result.message || 'Le service AIME INTENT est temporairement indisponible.'
          };
        }

        window.trackBYAIME('aime_intent_success', { eventType: (result.data.eventType || {}).value });
        return {
          success: true,
          data: result.data
        };
      } catch (err) {
        window.trackBYAIME('aime_intent_failed', { error: 'NETWORK_ERROR' });
        return {
          success: false,
          error: 'NETWORK_ERROR',
          message: 'Impossible de contacter le service AIME INTENT. Vérifiez votre connexion ou passez par le configurateur manuel.'
        };
      }
    }
  };

  // Exposer generateExperience globalement
  window.generateExperience = window.AIME_Engine.generateExperience;

  // =========================================================================
  // 4. UI ANIMATIONS & CONTROLLERS (Navigation, Modales, Prototypes)
  // =========================================================================

  // Hero Ring Glow
  (function () {
    var glow = document.getElementById('overlap-glow');
    if (!glow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

  // Gradient Scroll Expand
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

  // Background Image Fade
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
        var progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.bottom - rect.top)));
        bg.style.opacity = 0.05 + progress * 0.95;
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  // Navbar Shrink
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

  // Navigation, Scroll Animations & Modals
  document.addEventListener('DOMContentLoaded', function () {
    var menuButton = document.getElementById('mobile-menu-button');
    var mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
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
    }

    // Scroll animations
    var animatedElements = document.querySelectorAll('[data-animate]');
    if (animatedElements.length && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });

      animatedElements.forEach(function (el) { observer.observe(el); });
    } else {
      animatedElements.forEach(function (el) { el.classList.add('is-visible'); });
    }

    // Dialogs
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

  // Prototypes interactifs
  document.addEventListener('DOMContentLoaded', function () {
    // Timeline
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

    // Player
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

    // Guest lookup
    document.querySelectorAll('[data-guest-lookup]').forEach(function (widget) {
      var input = widget.querySelector('[data-guest-input]');
      var result = widget.querySelector('[data-guest-result]');
      var guestsDatabase = [
        { name: 'Claire', table: 'Table Orion (Place 1)' },
        { name: 'Antoine', table: 'Table Orion (Place 2)' },
        { name: 'Camille', table: 'Table Cassiopée (Place 4)' },
        { name: 'Sophie', table: 'Table Pégase (Place 3)' },
        { name: 'Thomas', table: 'Table Cassiopée (Place 5)' }
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

    // Candle
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

    // Projets filter
    var filterButtons = document.querySelectorAll('[data-filter-btn]');
    var projectCards = document.querySelectorAll('[data-project-category]');

    if (filterButtons.length && projectCards.length) {
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
    }
  });

  // =========================================================================
  // 5. PAGE /projet — DEUX PARCOURS : AIME INTENT (IA) & CONFIGURATEUR
  // =========================================================================

  document.addEventListener('DOMContentLoaded', function () {
    var configContainer = document.getElementById('byaime-configurator');
    if (!configContainer) return;

    // Modèle central de données
    var projectModel = window.AIME_Engine.createProjectModel();
    var currentStep = 1;
    var totalSteps = 5;
    var activeIntentData = null;

    // Mode Toggle Elements (Mode 1: Configurer | Mode 2: Raconter mon idée)
    var tabIntentBtn = document.getElementById('tab-mode-intent');
    var tabManualBtn = document.getElementById('tab-mode-manual');
    var sectionIntent = document.getElementById('section-aime-intent');
    var sectionManual = document.getElementById('section-configurator-manual');

    function switchMode(mode) {
      if (mode === 'intent') {
        if (tabIntentBtn) {
          tabIntentBtn.classList.add('bg-white', 'text-black');
          tabIntentBtn.classList.remove('bg-transparent', 'text-muted-foreground');
        }
        if (tabManualBtn) {
          tabManualBtn.classList.remove('bg-white', 'text-black');
          tabManualBtn.classList.add('bg-transparent', 'text-muted-foreground');
        }
        if (sectionIntent) sectionIntent.classList.remove('hidden');
        if (sectionManual) sectionManual.classList.add('hidden');
        window.trackBYAIME('aime_intent_started', {});
      } else {
        if (tabManualBtn) {
          tabManualBtn.classList.add('bg-white', 'text-black');
          tabManualBtn.classList.remove('bg-transparent', 'text-muted-foreground');
        }
        if (tabIntentBtn) {
          tabIntentBtn.classList.remove('bg-white', 'text-black');
          tabIntentBtn.classList.add('bg-transparent', 'text-muted-foreground');
        }
        if (sectionManual) sectionManual.classList.remove('hidden');
        if (sectionIntent) sectionIntent.classList.add('hidden');
        window.trackBYAIME('project_manual_mode_selected', {});
      }
    }

    if (tabIntentBtn) tabIntentBtn.addEventListener('click', function () { switchMode('intent'); });
    if (tabManualBtn) tabManualBtn.addEventListener('click', function () { switchMode('manual'); });

    // Detection URL template
    var urlParams = new URLSearchParams(window.location.search);
    var templateParam = urlParams.get('template');
    if (templateParam && defaultPresets[templateParam]) {
      applyPresetToModel(templateParam);
      switchMode('manual'); // direct template jumps directly to manual / customized view
    } else {
      // LocalStorage Draft
      var savedDraft = BYAIME_Storage.load();
      if (savedDraft && savedDraft.event && savedDraft.event.type) {
        var resumeBanner = document.getElementById('cfg-resume-banner');
        if (resumeBanner) {
          resumeBanner.classList.remove('hidden');
          var resumeBtn = document.getElementById('cfg-resume-btn');
          var restartBtn = document.getElementById('cfg-restart-btn');

          if (resumeBtn) {
            resumeBtn.addEventListener('click', function () {
              projectModel = Object.assign({}, savedDraft);
              syncModelToUI();
              resumeBanner.classList.add('hidden');
              recalculateLiveProposal();
              switchMode('manual');
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
    }

    // AIME INTENT — Formulaire & Événements
    var intentInput = document.getElementById('aime-intent-input');
    var intentSubmitBtn = document.getElementById('btn-submit-intent');
    var intentLoading = document.getElementById('aime-intent-loading');
    var intentErrorBox = document.getElementById('aime-intent-error');
    var intentErrorMsg = document.getElementById('aime-intent-error-msg');
    var intentValidationBox = document.getElementById('aime-intent-validation');

    // Quick Inspiration Chips
    document.querySelectorAll('[data-intent-example]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var text = chip.getAttribute('data-intent-example');
        if (intentInput) {
          intentInput.value = text;
          intentInput.focus();
        }
      });
    });

    if (intentSubmitBtn) {
      intentSubmitBtn.addEventListener('click', async function () {
        var text = intentInput ? intentInput.value.trim() : '';
        if (!text) {
          alert('Veuillez décrire en quelques mots ce que vous souhaitez faire vivre.');
          if (intentInput) intentInput.focus();
          return;
        }

        // Show loading state
        if (intentLoading) intentLoading.classList.remove('hidden');
        if (intentErrorBox) intentErrorBox.classList.add('hidden');
        if (intentValidationBox) intentValidationBox.classList.add('hidden');
        intentSubmitBtn.disabled = true;

        var result = await window.AIME_Engine.callAimeIntentAgent(text);

        if (intentLoading) intentLoading.classList.add('hidden');
        intentSubmitBtn.disabled = false;

        if (result.success && result.data) {
          activeIntentData = result.data;
          renderHumanValidationStep(result.data);
        } else {
          // Fallback state
          if (intentErrorBox && intentErrorMsg) {
            intentErrorMsg.textContent = result.message || 'Le service IA n\'a pas pu analyser votre texte pour le moment.';
            intentErrorBox.classList.remove('hidden');
          }
        }
      });
    }

    // Fallback switch to manual button
    var fallbackManualBtn = document.getElementById('btn-fallback-manual');
    if (fallbackManualBtn) {
      fallbackManualBtn.addEventListener('click', function () {
        if (intentInput && intentInput.value) {
          projectModel.message = intentInput.value.trim();
        }
        window.trackBYAIME('aime_intent_manual_fallback', {});
        switchMode('manual');
      });
    }

    // Rendu de l'Étape de Validation Humaine ("Voilà ce que j'ai compris de votre projet")
    function renderHumanValidationStep(data) {
      if (!intentValidationBox) return;

      var valSummary = document.getElementById('val-intent-summary');
      var valType = document.getElementById('val-intent-type');
      var valAudience = document.getElementById('val-intent-audience');
      var valIntentions = document.getElementById('val-intent-intentions');
      var valExperience = document.getElementById('val-intent-experience');
      var valSignals = document.getElementById('val-intent-signals');
      var valQuestionsContainer = document.getElementById('val-missing-questions');

      if (valSummary) valSummary.textContent = data.summary || 'Votre intention a été analysée avec soin.';
      if (valType) valType.textContent = (data.eventType && data.eventType.value) ? data.eventType.value.toUpperCase() : 'SUR MESURE';
      if (valAudience) valAudience.textContent = (data.audience && data.audience.value) ? data.audience.value : 'Mes proches';

      if (valIntentions) {
        valIntentions.innerHTML = '';
        (data.intentions || []).forEach(function (intItem) {
          var span = document.createElement('span');
          span.className = 'px-2.5 py-1 rounded-full bg-white/10 text-white font-medium text-xs border border-white/10';
          span.textContent = intItem.value || intItem;
          valIntentions.appendChild(span);
        });
      }

      if (valExperience) {
        var atmo = (data.experience && data.experience.atmosphere) ? data.experience.atmosphere : 'poetique';
        var lvl = (data.experience && data.experience.level) ? data.experience.level : 'interactif';
        valExperience.innerHTML = '<span class="px-2.5 py-1 rounded-full bg-white/10 text-pink-300 font-mono text-xs">' + atmo + '</span>' +
          '<span class="px-2.5 py-1 rounded-full bg-white/10 text-emerald-300 font-mono text-xs">' + lvl + '</span>';
      }

      if (valSignals) {
        valSignals.innerHTML = '';
        var signalsList = (data.signals || []).concat(data.constraints || []);
        if (signalsList.length === 0) {
          valSignals.innerHTML = '<span class="text-xs text-muted-foreground italic">Aucune contrainte particulière signalée.</span>';
        } else {
          signalsList.forEach(function (sig) {
            var chip = document.createElement('span');
            chip.className = 'text-[11px] px-2 py-0.5 rounded bg-white/5 text-gray-300';
            chip.textContent = '• ' + sig;
            valSignals.appendChild(chip);
          });
        }
      }

      if (valQuestionsContainer) {
        valQuestionsContainer.innerHTML = '';
        if (Array.isArray(data.missingInformation) && data.missingInformation.length > 0) {
          data.missingInformation.forEach(function (q, idx) {
            var div = document.createElement('div');
            div.className = 'space-y-1 text-xs';
            div.innerHTML = '<label class="block text-white font-medium">' + q.question + '</label>' +
              '<input type="text" data-extra-q="' + idx + '" placeholder="Votre réponse (optionnel)..." class="w-full text-xs rounded-xl border border-border bg-black px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white">';
            valQuestionsContainer.appendChild(div);
          });
          valQuestionsContainer.classList.remove('hidden');
        } else {
          valQuestionsContainer.classList.add('hidden');
        }
      }

      intentValidationBox.classList.remove('hidden');
      intentValidationBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Action 1: "Oui, c'est bien ça" -> Merge & Generate
    var btnValidateIntent = document.getElementById('btn-validate-intent-yes');
    if (btnValidateIntent) {
      btnValidateIntent.addEventListener('click', function () {
        if (!activeIntentData) return;

        // Collect optional questions
        var extraAnswers = [];
        if (intentValidationBox) {
          intentValidationBox.querySelectorAll('input[data-extra-q]').forEach(function (inp) {
            if (inp.value.trim()) extraAnswers.push(inp.value.trim());
          });
        }
        if (extraAnswers.length > 0) {
          activeIntentData.rawIntent = (activeIntentData.rawIntent || '') + '\nPrécisions : ' + extraAnswers.join(', ');
        }

        // Merge into projectModel
        projectModel = window.AIME_Engine.mergeStructuredIntentIntoProject(activeIntentData, projectModel);
        syncModelToUI();
        recalculateLiveProposal();

        window.trackBYAIME('aime_intent_validated', { type: projectModel.event.type });

        // Switch smoothly to manual customized view and scroll to proposal
        switchMode('manual');
        goToStep(5); // Jump directly to the final summary & contact step
      });
    }

    // Action 2: "Modifier" -> Pre-fill manual configurator
    var btnModifyIntent = document.getElementById('btn-modify-intent');
    if (btnModifyIntent) {
      btnModifyIntent.addEventListener('click', function () {
        if (activeIntentData) {
          projectModel = window.AIME_Engine.mergeStructuredIntentIntoProject(activeIntentData, projectModel);
          syncModelToUI();
          recalculateLiveProposal();
        }
        window.trackBYAIME('aime_intent_modified', {});
        switchMode('manual');
        goToStep(1);
      });
    }

    // Manuel Configurator Handlers
    function applyPresetToModel(presetKey) {
      var preset = defaultPresets[presetKey] || defaultPresets.mariage;
      projectModel.event.type = preset.type;
      projectModel.concept.title = preset.suggestedTitle;
      projectModel.concept.subtitle = preset.subtitle;
      projectModel.concept.description = preset.description;
      projectModel.concept.artDirection = preset.artDirection;
      projectModel.concept.signatureInteraction = preset.signatureInteraction;
      projectModel.modules = preset.defaultModules.slice();
      projectModel.architecture.pages = preset.pages.slice();
      projectModel.architecture.navigation = preset.pages.slice(0, 4);
      projectModel.updatedAt = new Date().toISOString();
      syncModelToUI();
    }

    function recalculateLiveProposal() {
      var preset = defaultPresets[projectModel.event.type] || defaultPresets.mariage;

      var synthTitle = document.getElementById('synth-project-title');
      var synthBadge = document.getElementById('synth-project-badge');
      var synthIntentSummary = document.getElementById('synth-intent-summary');
      var synthExpDesc = document.getElementById('synth-exp-desc');
      var synthArtDesc = document.getElementById('synth-art-desc');
      var synthSignature = document.getElementById('synth-signature-feature');
      var synthArchList = document.getElementById('synth-arch-list');
      var synthActiveModules = document.getElementById('synth-active-modules');
      var synthAddModules = document.getElementById('synth-available-modules');

      if (synthTitle) synthTitle.textContent = projectModel.concept.title || preset.suggestedTitle;
      if (synthBadge) synthBadge.textContent = preset.badge;
      if (synthIntentSummary) {
        synthIntentSummary.textContent = 'Pour ' + (projectModel.event.audience || '').toLowerCase() + ' • ' + (projectModel.intentions.join(', ') || 'Expérience singulière');
      }
      if (synthExpDesc) synthExpDesc.textContent = projectModel.concept.description || preset.description;
      if (synthArtDesc) synthArtDesc.textContent = projectModel.concept.artDirection || preset.artDirection;
      if (synthSignature) synthSignature.textContent = projectModel.concept.signatureInteraction || preset.signatureInteraction;

      if (synthArchList) {
        synthArchList.innerHTML = '';
        (projectModel.architecture.pages || preset.pages).forEach(function (pageName) {
          var li = document.createElement('li');
          li.className = 'text-xs text-muted-foreground flex items-center gap-2';
          li.innerHTML = '<span class="h-1.5 w-1.5 rounded-full bg-white flex-shrink-0"></span><span>' + pageName + '</span>';
          synthArchList.appendChild(li);
        });
      }

      if (synthActiveModules) {
        synthActiveModules.innerHTML = '';
        projectModel.modules.forEach(function (mId) {
          var mod = moduleRegistry[mId] || { id: mId, name: mId, icon: '✨', description: '', whyRecommended: '' };
          var chip = document.createElement('div');
          chip.className = 'tag-removable cursor-pointer group';
          chip.innerHTML = '<span class="text-[11px]">' + (mod.icon || '✨') + ' ' + mod.name + '</span>' +
            '<button type="button" class="tag-remove-btn" title="Retirer ce module" aria-label="Retirer ' + mod.name + '">×</button>';

          chip.addEventListener('click', function (e) {
            if (e.target.tagName.toLowerCase() === 'button') return;
            openModuleInspector(mod, true);
          });

          var removeBtn = chip.querySelector('button');
          removeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            projectModel.modules = projectModel.modules.filter(function (id) { return id !== mId; });
            recalculateLiveProposal();
            window.trackBYAIME('project_module_removed', { module: mId });
          });

          synthActiveModules.appendChild(chip);
        });
      }

      if (synthAddModules) {
        synthAddModules.innerHTML = '';
        var recommendation = window.AIME_Engine.recommendModules(projectModel);
        var scores = recommendation.scores;

        var unselectedKeys = Object.keys(moduleRegistry).filter(function (mId) {
          return projectModel.modules.indexOf(mId) === -1 && moduleRegistry[mId].compatibleEvents.indexOf(projectModel.event.type) !== -1;
        });

        unselectedKeys.sort(function (a, b) { return scores[b] - scores[a]; });

        if (unselectedKeys.length === 0) {
          synthAddModules.innerHTML = '<span class="text-xs text-muted-foreground italic">Tous les modules compatibles sont intégrés.</span>';
        } else {
          unselectedKeys.forEach(function (mId) {
            var mod = moduleRegistry[mId];
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-white hover:bg-white/10 transition-all';
            btn.innerHTML = '<span>+ ' + (mod.icon || '') + ' ' + mod.name + '</span>';

            btn.addEventListener('click', function (e) {
              e.preventDefault();
              projectModel.modules.push(mId);
              recalculateLiveProposal();
              window.trackBYAIME('project_module_added', { module: mId });
            });

            synthAddModules.appendChild(btn);
          });
        }
      }

      projectModel.updatedAt = new Date().toISOString();
      BYAIME_Storage.save(projectModel);
    }

    function openModuleInspector(mod, isCurrentlyActive) {
      var dialog = document.getElementById('modal-module-inspector');
      if (!dialog) return;

      var titleEl = document.getElementById('insp-mod-title');
      var descEl = document.getElementById('insp-mod-desc');
      var whyEl = document.getElementById('insp-mod-why');
      var catEl = document.getElementById('insp-mod-cat');
      var toggleBtn = document.getElementById('insp-mod-toggle-btn');

      if (titleEl) titleEl.textContent = (mod.icon || '✨') + ' ' + mod.name;
      if (catEl) catEl.textContent = mod.category || 'Module BYAIME';
      if (descEl) descEl.textContent = mod.description || 'Module d\'expérience sur mesure.';
      if (whyEl) whyEl.textContent = mod.whyRecommended || 'Recommandé par le moteur AIME.';

      if (toggleBtn) {
        if (isCurrentlyActive) {
          toggleBtn.textContent = 'Retirer ce module de mon projet';
          toggleBtn.className = 'w-full py-2.5 rounded-full border border-red-500/30 bg-red-500/10 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition-all';
          toggleBtn.onclick = function () {
            projectModel.modules = projectModel.modules.filter(function (id) { return id !== mod.id; });
            dialog.close();
            recalculateLiveProposal();
          };
        } else {
          toggleBtn.textContent = '+ Ajouter ce module à mon projet';
          toggleBtn.className = 'w-full py-2.5 rounded-full bg-white text-xs font-bold text-black hover:bg-white/90 transition-all';
          toggleBtn.onclick = function () {
            if (projectModel.modules.indexOf(mod.id) === -1) {
              projectModel.modules.push(mod.id);
            }
            dialog.close();
            recalculateLiveProposal();
          };
        }
      }

      dialog.showModal();
    }

    function renderStep4Checkboxes() {
      var container = document.getElementById('step4-tools-checkboxes');
      if (!container) return;

      container.innerHTML = '';
      var recommendation = window.AIME_Engine.recommendModules(projectModel);
      var scores = recommendation.scores;

      var compatibleKeys = Object.keys(moduleRegistry).filter(function (mId) {
        return moduleRegistry[mId].compatibleEvents.indexOf(projectModel.event.type) !== -1;
      });

      compatibleKeys.sort(function (a, b) { return scores[b] - scores[a]; });

      compatibleKeys.forEach(function (mId) {
        var mod = moduleRegistry[mId];
        var isChecked = projectModel.modules.indexOf(mId) !== -1;
        var label = document.createElement('label');
        label.className = 'flex items-start gap-3.5 p-3.5 rounded-xl border border-border bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors';
        label.innerHTML = '<input type="checkbox" name="step4-tool" value="' + mId + '" class="mt-1 rounded border-border text-white focus:ring-white bg-black h-4 w-4" ' + (isChecked ? 'checked' : '') + '>' +
          '<div class="flex-1"><div class="flex items-center justify-between"><p class="text-xs font-bold text-white">' + (mod.icon || '✨') + ' ' + mod.name + '</p>' +
          '<span class="text-[10px] font-mono text-emerald-400">Pertinence ' + scores[mId] + '%</span></div>' +
          '<p class="text-[11px] text-muted-foreground mt-0.5">' + mod.description + '</p></div>';

        var cb = label.querySelector('input');
        cb.addEventListener('change', function () {
          var checkedList = [];
          container.querySelectorAll('input[name="step4-tool"]:checked').forEach(function (box) {
            checkedList.push(box.value);
          });
          projectModel.modules = checkedList;
          recalculateLiveProposal();
        });

        container.appendChild(label);
      });
    }

    function goToStep(targetStep) {
      if (targetStep < 1 || targetStep > totalSteps) return;
      currentStep = targetStep;

      configContainer.querySelectorAll('[data-step-content]').forEach(function (content) {
        var s = parseInt(content.getAttribute('data-step-content'), 10);
        if (s === currentStep) {
          content.classList.remove('hidden');
          content.classList.add('block');
        } else {
          content.classList.add('hidden');
          content.classList.remove('block');
        }
      });

      configContainer.querySelectorAll('[data-step-indicator]').forEach(function (ind) {
        var s = parseInt(ind.getAttribute('data-step-indicator'), 10);
        if (s === currentStep) {
          ind.classList.add('border-white', 'text-white', 'bg-white/10');
          ind.classList.remove('border-border', 'text-muted-foreground', 'bg-transparent', 'border-emerald-500', 'text-emerald-400', 'bg-emerald-500/10');
        } else if (s < currentStep) {
          ind.classList.add('border-emerald-500', 'text-emerald-400', 'bg-emerald-500/10');
          ind.classList.remove('border-white', 'border-border', 'text-white', 'text-muted-foreground', 'bg-white/10');
        } else {
          ind.classList.remove('border-white', 'border-emerald-500', 'text-white', 'text-emerald-400', 'bg-white/10', 'bg-emerald-500/10');
          ind.classList.add('border-border', 'text-muted-foreground', 'bg-transparent');
        }
      });

      var pBar = document.getElementById('cfg-progress-bar');
      if (pBar) {
        pBar.style.width = Math.max(8, ((currentStep - 1) / (totalSteps - 1)) * 100) + '%';
      }

      var prevBtn = document.getElementById('cfg-prev-btn');
      var nextBtn = document.getElementById('cfg-next-btn');

      if (prevBtn) {
        if (currentStep === 1) prevBtn.classList.add('opacity-0', 'pointer-events-none');
        else prevBtn.classList.remove('opacity-0', 'pointer-events-none');
      }

      if (nextBtn) {
        if (currentStep === totalSteps) nextBtn.textContent = 'Transmettre mon projet à Matt Mez →';
        else nextBtn.textContent = 'Étape suivante →';
      }

      if (currentStep === 4) {
        renderStep4Checkboxes();
      }

      recalculateLiveProposal();
      window.trackBYAIME('project_step_changed', { step: currentStep });
      configContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    configContainer.querySelectorAll('input[name="event-type"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        applyPresetToModel(radio.value);
        recalculateLiveProposal();
        window.trackBYAIME('project_event_selected', { type: radio.value });
      });
    });

    configContainer.querySelectorAll('input[name="cfg-audience"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        projectModel.event.audience = radio.value;
        recalculateLiveProposal();
      });
    });

    configContainer.querySelectorAll('input[name="cfg-intentions"]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var list = [];
        configContainer.querySelectorAll('input[name="cfg-intentions"]:checked').forEach(function (b) {
          list.push(b.value);
        });
        projectModel.intentions = list;
        recalculateLiveProposal();
      });
    });

    configContainer.querySelectorAll('input[name="cfg-level"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        projectModel.experience.level = radio.value;
        recalculateLiveProposal();
      });
    });

    var ambSelect = document.getElementById('synth-ambiance-select');
    if (ambSelect) {
      ambSelect.addEventListener('change', function () {
        projectModel.experience.atmosphere = ambSelect.value;
        recalculateLiveProposal();
      });
    }

    var lvlSelect = document.getElementById('synth-level-select');
    if (lvlSelect) {
      lvlSelect.addEventListener('change', function () {
        projectModel.experience.level = lvlSelect.value;
        recalculateLiveProposal();
      });
    }

    // Mode Exploration
    var exploreBtn = document.getElementById('btn-explore-alternatives');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', function () {
        var dialog = document.getElementById('modal-explore-alternatives');
        if (!dialog) return;

        var container = document.getElementById('explore-alternatives-container');
        if (container) {
          container.innerHTML = '';
          var preset = defaultPresets[projectModel.event.type] || defaultPresets.mariage;

          preset.alternatives.forEach(function (alt) {
            var card = document.createElement('div');
            card.className = 'p-5 rounded-2xl bg-black border border-white/10 glow-card hover:border-white/30 transition-all space-y-3';
            card.innerHTML = '<div class="flex justify-between items-baseline"><span class="text-xs font-mono text-emerald-400">' + alt.name + '</span>' +
              '<span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-white">' + alt.ambiance + '</span></div>' +
              '<h4 class="text-base font-bold text-white">' + alt.title + '</h4>' +
              '<p class="text-xs text-muted-foreground">' + alt.signature + '</p>' +
              '<div class="flex flex-wrap gap-1 pt-1">' + alt.modules.map(function (m) {
                var mod = moduleRegistry[m] || { name: m };
                return '<span class="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300">' + mod.name + '</span>';
              }).join('') + '</div>' +
              '<button type="button" class="w-full mt-2 py-2 rounded-full bg-white text-xs font-bold text-black hover:bg-white/90 transition-all">Je préfère cette version →</button>';

            var chooseBtn = card.querySelector('button');
            chooseBtn.addEventListener('click', function () {
              projectModel.concept.title = alt.title;
              projectModel.concept.signatureInteraction = alt.signature;
              projectModel.experience.atmosphere = alt.ambiance;
              projectModel.experience.level = alt.level;
              projectModel.modules = alt.modules.slice();
              dialog.close();
              recalculateLiveProposal();
              window.trackBYAIME('project_alternative_chosen', { title: alt.title });
            });

            container.appendChild(card);
          });
        }

        dialog.showModal();
      });
    }

    // Mode Preview
    var previewBtn = document.getElementById('btn-open-preview-mode');
    if (previewBtn) {
      previewBtn.addEventListener('click', function () {
        var dialog = document.getElementById('modal-preview-experience');
        if (!dialog) return;

        var exp = window.AIME_Engine.generateExperience(projectModel);

        var prevTitle = document.getElementById('prev-exp-title');
        var prevSub = document.getElementById('prev-exp-subtitle');
        var prevNav = document.getElementById('prev-exp-nav');
        var prevSignature = document.getElementById('prev-exp-signature');

        if (prevTitle) prevTitle.textContent = exp.meta.title;
        if (prevSub) prevSub.textContent = exp.meta.subtitle;
        if (prevSignature) prevSignature.textContent = exp.meta.signatureInteraction;

        if (prevNav) {
          prevNav.innerHTML = '';
          exp.navigation.forEach(function (navItem) {
            var span = document.createElement('span');
            span.className = 'text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer';
            span.textContent = navItem;
            prevNav.appendChild(span);
          });
        }

        dialog.showModal();
        window.trackBYAIME('project_preview_opened', { title: exp.meta.title });
      });
    }

    var editFromPrevBtn = document.getElementById('btn-edit-from-preview');
    if (editFromPrevBtn) {
      editFromPrevBtn.addEventListener('click', function () {
        var dialog = document.getElementById('modal-preview-experience');
        if (dialog) dialog.close();
        goToStep(1);
      });
    }

    // Boutons Next / Prev
    var nBtn = document.getElementById('cfg-next-btn');
    var pBtn = document.getElementById('cfg-prev-btn');

    if (nBtn) {
      nBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (currentStep < totalSteps) goToStep(currentStep + 1);
        else submitProjectWorkflow();
      });
    }

    if (pBtn) {
      pBtn.addEventListener('click', function (e) {
        e.preventDefault();
        goToStep(currentStep - 1);
      });
    }

    function submitProjectWorkflow() {
      var fn = (document.getElementById('cfg-contact-first') || {}).value || '';
      var ln = (document.getElementById('cfg-contact-last') || {}).value || '';
      var em = (document.getElementById('cfg-contact-email') || {}).value || '';
      var ph = (document.getElementById('cfg-contact-phone') || {}).value || '';
      var pn = (document.getElementById('cfg-contact-projname') || {}).value || '';
      var dt = (document.getElementById('cfg-contact-date') || {}).value || '';
      var loc = (document.getElementById('cfg-contact-loc') || {}).value || '';
      var msg = (document.getElementById('cfg-contact-message') || {}).value || '';

      if (!fn.trim() || !em.trim()) {
        alert('Veuillez au minimum renseigner votre prénom et votre adresse e-mail.');
        var emInput = document.getElementById('cfg-contact-email');
        if (emInput) emInput.focus();
        return;
      }

      projectModel.identity = {
        firstName: fn.trim(),
        lastName: ln.trim(),
        email: em.trim(),
        phone: ph.trim(),
        projectName: pn.trim()
      };
      projectModel.event.date = dt.trim();
      projectModel.event.location = loc.trim();
      projectModel.message = msg.trim();
      projectModel.status = 'ready';
      projectModel.updatedAt = new Date().toISOString();

      handleProjectSubmission(projectModel);
    }

    function handleProjectSubmission(model) {
      window.trackBYAIME('project_submitted', { id: model.id, type: model.event.type });

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
        var confRecapBtn = document.getElementById('conf-open-recap-btn');

        if (confName) confName.textContent = model.identity.firstName + ' ' + model.identity.lastName;
        if (confTitle) confTitle.textContent = model.concept.title;
        if (confModules) confModules.textContent = model.modules.length;

        var exp = window.AIME_Engine.generateExperience(model);
        var specResult = window.AIME_Engine.buildCahierDesCharges(model, exp);
        var specText = specResult.plainText;

        var mailSubject = encodeURIComponent('[BYAIME Conception] Nouveau Projet : ' + (model.identity.projectName || model.concept.title));
        if (confMailto) {
          confMailto.href = 'mailto:contact@byaime.com?subject=' + mailSubject + '&body=' + encodeURIComponent(specText);
        }

        if (confCopy) {
          confCopy.onclick = function () {
            navigator.clipboard.writeText(specText).then(function () {
              confCopy.textContent = '✓ Cahier des charges copié !';
              setTimeout(function () { confCopy.textContent = 'Copier la synthèse'; }, 3000);
            });
          };
        }

        if (confDownload) {
          confDownload.onclick = function () {
            var blob = new Blob([JSON.stringify({ projectModel: model, experienceModel: exp }, null, 2)], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'BYAIME-Projet-' + (model.identity.firstName || 'CahierDesCharges') + '.json';
            a.click();
            URL.revokeObjectURL(url);
          };
        }

        if (confRecapBtn) {
          confRecapBtn.onclick = function () {
            openCahierDesChargesModal(model, exp);
          };
        }

        readyWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    function openCahierDesChargesModal(model, exp) {
      var dialog = document.getElementById('modal-cahier-des-charges');
      if (!dialog) return;

      var docContainer = document.getElementById('recap-doc-container');
      if (docContainer) {
        var modNames = (model.modules || []).map(function (mId) {
          var m = moduleRegistry[mId];
          return m ? m.name : mId;
        });

        docContainer.innerHTML = '<div class="space-y-6 text-xs text-muted-foreground leading-relaxed">' +
          '<div class="border-b border-white/10 pb-4">' +
          '<span class="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Cahier des Charges Officiel BYAIME</span>' +
          '<h2 class="text-xl font-bold text-white mt-1">' + (model.identity.projectName || model.concept.title) + '</h2>' +
          '<p class="text-[11px] text-muted-foreground mt-1">Généré le ' + new Date().toLocaleDateString('fr-FR') + ' • Concepteur : Matt Mez</p>' +
          '</div>' +
          '<div><h3 class="text-xs font-bold text-white uppercase tracking-wider">01 — Intention & Objectifs</h3><p class="mt-1 text-gray-300">' + model.intentions.join(', ') + '</p></div>' +
          '<div><h3 class="text-xs font-bold text-white uppercase tracking-wider">02 — Public</h3><p class="mt-1 text-gray-300">' + model.event.audience + '</p></div>' +
          '<div><h3 class="text-xs font-bold text-white uppercase tracking-wider">03 — Événement & Localisation</h3><p class="mt-1 text-gray-300">' + model.event.type + ' • ' + (model.event.date || 'Date à définir') + ' • ' + (model.event.location || 'Lieu à définir') + '</p></div>' +
          '<div><h3 class="text-xs font-bold text-white uppercase tracking-wider">04 — Expérience & Direction Artistique</h3><p class="mt-1 text-gray-300">' + model.concept.artDirection + '</p></div>' +
          '<div><h3 class="text-xs font-bold text-white uppercase tracking-wider">05 — Modules Validés</h3><div class="grid grid-cols-2 gap-1.5 mt-2 text-white">' + modNames.map(function (n) { return '<span class="p-1.5 rounded bg-white/5 border border-white/5">✓ ' + n + '</span>'; }).join('') + '</div></div>' +
          '<div><h3 class="text-xs font-bold text-white uppercase tracking-wider">06 — Interaction Signature</h3><p class="mt-1 text-emerald-400 font-medium">' + model.concept.signatureInteraction + '</p></div>' +
          '<div><h3 class="text-xs font-bold text-white uppercase tracking-wider">07 — Contact</h3><p class="mt-1 text-gray-300">' + model.identity.firstName + ' ' + model.identity.lastName + ' (' + model.identity.email + ')</p></div>' +
          '</div>';
      }

      var printBtn = document.getElementById('recap-print-btn');
      if (printBtn) {
        printBtn.onclick = function () {
          window.print();
        };
      }

      dialog.showModal();
    }

    // Initialisation
    recalculateLiveProposal();
  });

  // =========================================================================
  // 6. MODULE SOUTIEN ASSOCIATIF LE MONDE AIME
  // =========================================================================

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
        alert('Merci pour votre intérêt envers l\'association LE MONDE AIME !\n\nVotre intention de soutien pour un montant de ' + current + ' a été enregistrée. Le module officiel sera ouvert très prochainement lors de la publication du compte associatif.');
      });
    }
  });

})();
