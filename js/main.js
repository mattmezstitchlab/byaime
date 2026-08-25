/* ===== BYAIME — Studio & Moteur de Conception d'Expériences AIME — main.js ===== */
/* Phase 4: Project Model, Module Registry, Scoring Engine, Live Proposal V2, Exploration Mode, Preview Mode & Cahier des Charges */

(function () {
  'use strict';

  // Mark JS as available
  document.documentElement.classList.add('js');

  // ===== Internal Analytics Hook =====
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

  // ===== LocalStorage Manager =====
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

  // ===== BIBLIOTHÈQUE INTERNE DE MODULES BYAIME =====
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
      description: 'Recommandations d\'hôtels, navettes, coiffeurs et prestataires du mariage.',
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

  // ===== PRESETS & RÈGLES DE SUGGESTIONS PAR DÉFAUT =====
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
          name: 'Version 01 • L\'expérience Élégante & Épurée',
          ambiance: 'minimaliste',
          level: 'minimal',
          title: 'L\'Épure & L\'Intime',
          signature: 'Un mini-site d\'une grande sobriété avec compte à rebours et RSVP instantané.',
          modules: ['countdown', 'rsvp', 'timeline', 'map', 'contact']
        },
        {
          name: 'Version 02 • Le Mariage Vivant & Participatif',
          ambiance: 'poetique',
          level: 'interactif',
          title: 'Le Grand Jour — L\'expérience vivante',
          signature: 'Une Timeline vivante avec plan de table interactif et boîte à musique partagée.',
          modules: ['timeline', 'rsvp', 'guests', 'tables', 'music', 'gallery', 'guestbook', 'map']
        },
        {
          name: 'Version 03 • Le Mariage Immersif & Spatial',
          ambiance: 'cinematique',
          level: 'immersif',
          title: 'L\'Astral & L\'Union Céleste',
          signature: 'Univers WebGL avec ciel étoilé interactif, livre d\'or vocal et galerie haute fidélité.',
          modules: ['countdown', 'timeline', 'rsvp', 'guests', 'tables', 'music', 'gallery', 'guestbook', 'memories', 'map', 'notifications', 'privateSpace']
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
      pages: ['Accueil & Décompte', 'Frise des 40 ans', 'Playlist collaborative', 'Cagnotte', 'Vidéos surprises'],
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
          name: 'Version 03 • L\'Expérience Surprise Totale',
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
          name: 'Version 03 • La Totale Scénique',
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
          name: 'Version 03 • L\'Expérience Générative',
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
          name: 'Version 03 • La Communauté Engagée',
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
      subtitle: 'Une présentation de produit ou d\'initiative sans aucun temps de chargement.',
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

  // ===== MOTEUR DE COMPATIBILITÉ & SCORING DES MODULES =====
  function calculateModuleScores(event, intentions, audience, level, ambiance) {
    var scores = {};
    var allKeys = Object.keys(moduleRegistry);

    allKeys.forEach(function (modId) {
      var mod = moduleRegistry[modId];
      var score = 30; // base score

      // Event compatibility
      if (mod.compatibleEvents.indexOf(event) !== -1) {
        score += 40;
      }

      // Intentions relevance
      if (intentions.indexOf('Organiser') !== -1 && ['timeline', 'rsvp', 'tables', 'map', 'program'].indexOf(modId) !== -1) score += 20;
      if (intentions.indexOf('Émouvoir') !== -1 && ['guestbook', 'memories', 'music', 'audio', 'tributes', 'testimonials'].indexOf(modId) !== -1) score += 25;
      if (intentions.indexOf('Partager') !== -1 && ['gallery', 'music', 'guestbook', 'video'].indexOf(modId) !== -1) score += 20;
      if (intentions.indexOf('Créer des souvenirs') !== -1 && ['gallery', 'guestbook', 'memories', 'tributes'].indexOf(modId) !== -1) score += 25;
      if (intentions.indexOf('Rassembler') !== -1 && ['guests', 'map', 'donations', 'impact'].indexOf(modId) !== -1) score += 15;
      if (intentions.indexOf('Informer') !== -1 && ['program', 'map', 'providers', 'notifications', 'agenda'].indexOf(modId) !== -1) score += 20;

      // Audience relevance
      if (audience === 'Un public' || audience === 'Une communauté') {
        if (['agenda', 'artists', 'tickets', 'notifications', 'map'].indexOf(modId) !== -1) score += 15;
      }
      if (audience === 'Mes proches' || audience === 'Ma famille') {
        if (['guestbook', 'memories', 'gallery', 'tables', 'tributes'].indexOf(modId) !== -1) score += 15;
      }

      // Experience level boost
      if (level === 'immersif') {
        if (['music', 'audio', 'video', 'countdown', 'notifications', 'guestbook'].indexOf(modId) !== -1) score += 15;
      }
      if (level === 'minimal') {
        if (['notifications', 'video', 'providers'].indexOf(modId) !== -1) score -= 20;
      }

      scores[modId] = Math.min(100, Math.max(0, score));
    });

    return scores;
  }

  // ===== ABSTRACTION GÉNÉRATION D'EXPÉRIENCE : generateExperience(projectModel) =====
  window.generateExperience = function (model) {
    var preset = defaultPresets[model.event.type] || defaultPresets.mariage;
    
    return {
      id: model.id,
      theme: model.experience.atmosphere || 'poetique',
      level: model.experience.level || 'interactif',
      meta: {
        title: model.concept.title || preset.suggestedTitle,
        subtitle: model.concept.subtitle || preset.subtitle,
        description: model.concept.description || preset.description,
        artDirection: model.concept.artDirection || preset.artDirection,
        signatureInteraction: model.concept.signatureInteraction || preset.signatureInteraction
      },
      pages: model.architecture.pages || preset.pages,
      navigation: model.architecture.navigation || preset.pages.slice(0, 4),
      modules: model.modules.map(function (mId) {
        return moduleRegistry[mId] || { id: mId, name: mId, icon: '✨' };
      }),
      contentBlocks: [
        { type: 'hero', title: model.concept.title, subtitle: model.concept.subtitle },
        { type: 'timeline', enabled: model.modules.indexOf('timeline') !== -1 },
        { type: 'music', enabled: model.modules.indexOf('music') !== -1 },
        { type: 'gallery', enabled: model.modules.indexOf('gallery') !== -1 },
        { type: 'guestbook', enabled: model.modules.indexOf('guestbook') !== -1 }
      ],
      interactions: {
        signature: model.concept.signatureInteraction,
        hasAudio: model.modules.indexOf('music') !== -1 || model.modules.indexOf('audio') !== -1,
        hasRSVP: model.modules.indexOf('rsvp') !== -1
      },
      mediaSlots: {
        heroImage: 'Votre photo principale ici',
        audioTrack: 'Votre musique ici',
        galleryPlaceholders: ['Votre photo ici', 'Vos souvenirs ici', 'Vos invités ici']
      }
    };
  };

  // ===== CONFIGURATEUR INTELLIGENT (MVP /projet) =====
  document.addEventListener('DOMContentLoaded', function () {
    var configContainer = document.getElementById('byaime-configurator');
    if (!configContainer) return;

    // Initialize Project Model (Single Source of Truth)
    var projectModel = {
      id: 'byaime_proj_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      identity: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        projectName: ''
      },
      event: {
        type: 'mariage',
        date: '',
        location: '',
        audience: 'Mes proches'
      },
      intentions: ['Organiser', 'Partager', 'Créer des souvenirs'],
      experience: {
        atmosphere: 'poetique',
        level: 'interactif'
      },
      modules: ['timeline', 'rsvp', 'guests', 'tables', 'music', 'gallery', 'guestbook', 'map'],
      architecture: {
        pages: ['Accueil', 'Programme', 'Invités & Tables', 'Musique', 'Galerie & Souvenirs', 'Guide pratique'],
        navigation: ['Accueil', 'Programme', 'Invités', 'Souvenirs'],
        features: []
      },
      concept: {
        title: 'Le Grand Jour — L\'expérience vivante',
        subtitle: 'Un univers numérique poétique et vivant pour les futurs mariés.',
        description: 'Un sanctuaire intime sous un ciel étoilé interactif avec synchronisation du jour J et boîte à souvenirs audio.',
        artDirection: 'Tons chauds, typographie raffinée, constellation céleste interactive, ambiance sonore douce.',
        signatureInteraction: 'Une Timeline vivante synchronisée qui transforme chaque moment du mariage en expérience partagée.'
      },
      message: '',
      status: 'draft',
      support: {
        clicked: false,
        amount: 50
      }
    };

    var currentStep = 1;
    var totalSteps = 5;

    // Check URL Template Parameter (ex: /projet?template=mariage)
    var urlParams = new URLSearchParams(window.location.search);
    var templateParam = urlParams.get('template');
    if (templateParam && defaultPresets[templateParam]) {
      applyPresetToModel(templateParam);
    } else {
      // Check local storage draft
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

    // Apply a Preset to Model
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

    // Sync Model to Input Checkboxes/Radios
    function syncModelToUI() {
      // Step 1 Event type
      var radioType = configContainer.querySelector('input[name="event-type"][value="' + projectModel.event.type + '"]');
      if (radioType) radioType.checked = true;

      // Step 2 Audience
      var radioAud = configContainer.querySelector('input[name="cfg-audience"][value="' + projectModel.event.audience + '"]');
      if (radioAud) radioAud.checked = true;

      // Step 3 Intentions
      configContainer.querySelectorAll('input[name="cfg-intentions"]').forEach(function (cb) {
        cb.checked = projectModel.intentions.indexOf(cb.value) !== -1;
      });

      // Step 5 Level
      var radioLevel = configContainer.querySelector('input[name="cfg-level"][value="' + projectModel.experience.level + '"]');
      if (radioLevel) radioLevel.checked = true;

      // Ambiance select
      var ambSelect = document.getElementById('synth-ambiance-select');
      if (ambSelect) ambSelect.value = projectModel.experience.atmosphere || 'poetique';

      // Level select
      var lvlSelect = document.getElementById('synth-level-select');
      if (lvlSelect) lvlSelect.value = projectModel.experience.level || 'interactif';
    }

    // Recalculate and Render Live Proposal V2
    function recalculateLiveProposal() {
      var preset = defaultPresets[projectModel.event.type] || defaultPresets.mariage;

      // Update Title & Badge
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
        synthIntentSummary.textContent = 'Pour ' + projectModel.event.audience.toLowerCase() + ' • ' + (projectModel.intentions.join(', ') || 'Expérience singulière');
      }
      if (synthExpDesc) synthExpDesc.textContent = projectModel.concept.description || preset.description;
      if (synthArtDesc) synthArtDesc.textContent = projectModel.concept.artDirection || preset.artDirection;
      if (synthSignature) synthSignature.textContent = projectModel.concept.signatureInteraction || preset.signatureInteraction;

      // Render Architecture List
      if (synthArchList) {
        synthArchList.innerHTML = '';
        (projectModel.architecture.pages || preset.pages).forEach(function (pageName) {
          var li = document.createElement('li');
          li.className = 'text-xs text-muted-foreground flex items-center gap-2';
          li.innerHTML = '<span class="h-1.5 w-1.5 rounded-full bg-white flex-shrink-0"></span><span>' + pageName + '</span>';
          synthArchList.appendChild(li);
        });
      }

      // Render Active Clickable Module Chips with Inspector trigger
      if (synthActiveModules) {
        synthActiveModules.innerHTML = '';
        projectModel.modules.forEach(function (mId) {
          var mod = moduleRegistry[mId] || { id: mId, name: mId, icon: '✨', description: '', whyRecommended: '' };
          var chip = document.createElement('div');
          chip.className = 'tag-removable cursor-pointer group';
          chip.innerHTML = '<span class="text-[11px]">' + (mod.icon || '✨') + ' ' + mod.name + '</span>' +
            '<button type="button" class="tag-remove-btn" title="Retirer ce module" aria-label="Retirer ' + mod.name + '">×</button>';

          // Inspector on chip click
          chip.addEventListener('click', function (e) {
            if (e.target.tagName.toLowerCase() === 'button') return;
            openModuleInspector(mod, true);
          });

          // Remove on cross click
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

      // Render Available Modules to Add with Scoring
      if (synthAddModules) {
        synthAddModules.innerHTML = '';
        var scores = calculateModuleScores(
          projectModel.event.type,
          projectModel.intentions,
          projectModel.event.audience,
          projectModel.experience.level,
          projectModel.experience.atmosphere
        );

        var unselectedKeys = Object.keys(moduleRegistry).filter(function (mId) {
          return projectModel.modules.indexOf(mId) === -1 && moduleRegistry[mId].compatibleEvents.indexOf(projectModel.event.type) !== -1;
        });

        // Sort by score
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

      // Render Summary View
      var sumType = document.getElementById('sum-type');
      var sumAudience = document.getElementById('sum-audience');
      var sumIntentions = document.getElementById('sum-intentions');
      var sumAmbiance = document.getElementById('sum-ambiance');
      var sumLevel = document.getElementById('sum-level');
      var sumModulesList = document.getElementById('sum-modules-list');

      if (sumType) sumType.textContent = preset.categoryName;
      if (sumAudience) sumAudience.textContent = projectModel.event.audience;
      if (sumIntentions) sumIntentions.textContent = projectModel.intentions.join(', ') || 'Non spécifié';
      if (sumAmbiance) sumAmbiance.textContent = projectModel.experience.atmosphere;
      if (sumLevel) sumLevel.textContent = projectModel.experience.level;

      if (sumModulesList) {
        sumModulesList.innerHTML = '';
        projectModel.modules.forEach(function (mId) {
          var mod = moduleRegistry[mId] || { name: mId };
          var li = document.createElement('li');
          li.className = 'text-xs text-muted-foreground flex items-center gap-2';
          li.innerHTML = '<span class="text-emerald-400">✓</span><span>' + mod.name + '</span>';
          sumModulesList.appendChild(li);
        });
      }

      // Save to localStorage
      projectModel.updatedAt = new Date().toISOString();
      BYAIME_Storage.save(projectModel);
    }

    // Open Module Inspector Popup/Modal
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
      if (whyEl) whyEl.textContent = mod.whyRecommended || 'Recommandé par notre moteur pour sublimer votre intention.';

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

    // Step 4 Dynamic Checkboxes populated with scores
    function renderStep4Checkboxes() {
      var container = document.getElementById('step4-tools-checkboxes');
      if (!container) return;

      var preset = defaultPresets[projectModel.event.type] || defaultPresets.mariage;
      container.innerHTML = '';

      var scores = calculateModuleScores(
        projectModel.event.type,
        projectModel.intentions,
        projectModel.event.audience,
        projectModel.experience.level,
        projectModel.experience.atmosphere
      );

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

    // Step Navigation
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
        var pct = ((currentStep - 1) / (totalSteps - 1)) * 100;
        pBar.style.width = Math.max(8, pct) + '%';
      }

      var prevBtn = document.getElementById('cfg-prev-btn');
      var nextBtn = document.getElementById('cfg-next-btn');

      if (prevBtn) {
        if (currentStep === 1) {
          prevBtn.classList.add('opacity-0', 'pointer-events-none');
        } else {
          prevBtn.classList.remove('opacity-0', 'pointer-events-none');
        }
      }

      if (nextBtn) {
        if (currentStep === totalSteps) {
          nextBtn.textContent = 'Transmettre mon projet à Matt Mez →';
        } else {
          nextBtn.textContent = 'Étape suivante →';
        }
      }

      if (currentStep === 4) {
        renderStep4Checkboxes();
      }

      recalculateLiveProposal();
      window.trackBYAIME('project_step_changed', { step: currentStep });
      configContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Step 1 Event Type Change
    configContainer.querySelectorAll('input[name="event-type"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        applyPresetToModel(radio.value);
        recalculateLiveProposal();
        window.trackBYAIME('project_event_selected', { type: radio.value });
      });
    });

    // Step 2 Audience Change
    configContainer.querySelectorAll('input[name="cfg-audience"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        projectModel.event.audience = radio.value;
        recalculateLiveProposal();
      });
    });

    // Step 3 Intentions Change
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

    // Step 5 Level Change
    configContainer.querySelectorAll('input[name="cfg-level"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        projectModel.experience.level = radio.value;
        recalculateLiveProposal();
      });
    });

    // Ambiance Dropdown Switcher
    var ambSelect = document.getElementById('synth-ambiance-select');
    if (ambSelect) {
      ambSelect.addEventListener('change', function () {
        projectModel.experience.atmosphere = ambSelect.value;
        recalculateLiveProposal();
      });
    }

    // Level Dropdown Switcher
    var lvlSelect = document.getElementById('synth-level-select');
    if (lvlSelect) {
      lvlSelect.addEventListener('change', function () {
        projectModel.experience.level = lvlSelect.value;
        recalculateLiveProposal();
      });
    }

    // Exploration Mode (3 Alternatives)
    var exploreBtn = document.getElementById('btn-explore-alternatives');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', function () {
        var dialog = document.getElementById('modal-explore-alternatives');
        if (!dialog) return;

        var container = document.getElementById('explore-alternatives-container');
        if (container) {
          container.innerHTML = '';
          var preset = defaultPresets[projectModel.event.type] || defaultPresets.mariage;

          preset.alternatives.forEach(function (alt, idx) {
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

    // PREVIEW MODE ("Voir une première version")
    var previewBtn = document.getElementById('btn-open-preview-mode');
    if (previewBtn) {
      previewBtn.addEventListener('click', function () {
        var dialog = document.getElementById('modal-preview-experience');
        if (!dialog) return;

        var exp = window.generateExperience(projectModel);

        // Populate Preview Dialog
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

    // Edit button inside Preview (Loop back to configurator)
    var editFromPrevBtn = document.getElementById('btn-edit-from-preview');
    if (editFromPrevBtn) {
      editFromPrevBtn.addEventListener('click', function () {
        var dialog = document.getElementById('modal-preview-experience');
        if (dialog) dialog.close();
        goToStep(1);
      });
    }

    // Next / Prev Buttons
    var nBtn = document.getElementById('cfg-next-btn');
    var pBtn = document.getElementById('cfg-prev-btn');

    if (nBtn) {
      nBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (currentStep < totalSteps) {
          goToStep(currentStep + 1);
        } else {
          submitProjectWorkflow();
        }
      });
    }

    if (pBtn) {
      pBtn.addEventListener('click', function (e) {
        e.preventDefault();
        goToStep(currentStep - 1);
      });
    }

    // Submit Project Workflow
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

      submitProject(projectModel);
    }

    // Submission and Specifications generator
    function submitProject(model) {
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

        // Build Spec Document String
        var specText = buildCahierDesChargesText(model);

        // Mailto formatted link
        var mailSubject = encodeURIComponent('[BYAIME Conception] Nouveau Projet : ' + (model.identity.projectName || model.concept.title));
        if (confMailto) {
          confMailto.href = 'mailto:contact@byaime.com?subject=' + mailSubject + '&body=' + encodeURIComponent(specText);
        }

        // Copy specs button
        if (confCopy) {
          confCopy.addEventListener('click', function () {
            navigator.clipboard.writeText(specText).then(function () {
              confCopy.textContent = '✓ Cahier des charges copié !';
              setTimeout(function () { confCopy.textContent = 'Copier la synthèse complète'; }, 3000);
            });
          });
        }

        // Download JSON specs button
        if (confDownload) {
          confDownload.addEventListener('click', function () {
            var blob = new Blob([JSON.stringify(model, null, 2)], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'BYAIME-Projet-' + (model.identity.firstName || 'CahierDesCharges') + '.json';
            a.click();
            URL.revokeObjectURL(url);
          });
        }

        // Open Recap Modal
        if (confRecapBtn) {
          confRecapBtn.addEventListener('click', function () {
            openCahierDesChargesModal(model);
          });
        }

        readyWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Build Formatted Text for Cahier des Charges
    function buildCahierDesChargesText(model) {
      var modNames = model.modules.map(function (mId) {
        var m = moduleRegistry[mId];
        return m ? m.name : mId;
      });

      return '==================================================\n' +
        '# CAHIER DES CHARGES BYAIME — PROJET SUR MESURE\n' +
        '==================================================\n\n' +
        'NOM DU PROJET : ' + (model.identity.projectName || model.concept.title) + '\n' +
        'DATE DE CRÉATION : ' + new Date().toLocaleDateString('fr-FR') + '\n\n' +
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
        (model.architecture.pages || []).map(function (p, i) { return (i + 1) + '. ' + p; }).join('\n') + '\n\n' +
        '## 07 — MODULES RETENUS (' + model.modules.length + ')\n' +
        modNames.map(function (n) { return '• ' + n; }).join('\n') + '\n\n' +
        '## 08 — INTERACTION SIGNATURE\n' +
        model.concept.signatureInteraction + '\n\n' +
        '## 09 — CONTACT & COORDONNÉES\n' +
        'Contact : ' + model.identity.firstName + ' ' + model.identity.lastName + '\n' +
        'E-mail : ' + model.identity.email + '\n' +
        'Téléphone : ' + (model.identity.phone || 'Non précisé') + '\n' +
        'Message : ' + (model.message || 'Aucun') + '\n\n' +
        '## 10 — PROCHAINE ÉTAPE\n' +
        'Session de cadrage et modélisation du prototype interactif avec Matt Mez.';
    }

    // Open Cahier des Charges Modal
    function openCahierDesChargesModal(model) {
      var dialog = document.getElementById('modal-cahier-des-charges');
      if (!dialog) return;

      var docContainer = document.getElementById('recap-doc-container');
      if (docContainer) {
        var modNames = model.modules.map(function (mId) {
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

    // Initialize
    recalculateLiveProposal();
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
