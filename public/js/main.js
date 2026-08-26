/* ===== BYAIME — AIME Engine V1 + AIME INTENT, CONCEPT & ARCHITECT — main.js ===== */
/* Complete Multi-Agent Experience Design Suite (Intent -> Concept -> Architect -> Blueprint -> Preview) */

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
  // 2. AIME ENGINE V1 — MODULE REGISTRY & PRESETS
  // =========================================================================

  var moduleRegistry = {
    timeline: { id: 'timeline', name: 'Timeline du Jour J', category: 'Déroulé & Temps', description: 'Frise chronologique dynamique et interactive des temps forts avec synchronisation en direct.', whyRecommended: 'Permet à tous les invités d\'être synchronisés sans stress tout au long de la journée.', icon: '', compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'evenement', 'festival', 'professionnel', 'autre'], dependencies: [], optional: true, defaultEnabled: true },
    rsvp: { id: 'rsvp', name: 'RSVP sans mot de passe', category: 'Coordination', description: 'Confirmation de présence fluide en 1 clic avec gestion des régimes, morceaux préférés et questions sur mesure.', whyRecommended: 'Élimine 100% de la friction des formulaires traditionnels pour un taux de réponse maximal.', icon: '', compatibleEvents: ['mariage', 'anniversaire', 'evenement', 'professionnel', 'autre'], dependencies: [], optional: true, defaultEnabled: true },
    guests: { id: 'guests', name: 'Profils & Recherche Invités', category: 'Communauté', description: 'Recherche instantanée de sa table, trombinoscope bienveillant et espace invités.', whyRecommended: 'Facilite les rencontres et permet à chacun de trouver sa place en un clin d\'œil.', icon: '', compatibleEvents: ['mariage', 'anniversaire', 'professionnel', 'autre'], dependencies: [], optional: true, defaultEnabled: true },
    tables: { id: 'tables', name: 'Plan de table interactif', category: 'Coordination', description: 'Plan spatial animé avec recherche de table par prénom et composition des convives.', whyRecommended: 'Évite les attroupements devant les panneaux papier le soir du dîner.', icon: '', compatibleEvents: ['mariage', 'anniversaire', 'professionnel'], dependencies: ['guests'], optional: true, defaultEnabled: true },
    music: { id: 'music', name: 'Musique & Boîte à sons', category: 'Sensorialité', description: 'Lecteur audio immersif en fond et suggestion collaborative de morceaux par les invités.', whyRecommended: 'Donne une couleur sonore unique au mini-site et prépare la playlist du grand soir.', icon: '', compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'festival', 'artistique', 'autre'], dependencies: [], optional: true, defaultEnabled: true },
    gallery: { id: 'gallery', name: 'Galerie photo HD participative', category: 'Souvenirs', description: 'Dépôt instantané de photographies par les participants le jour J sans compression dégradante.', whyRecommended: 'Collecte tous les points de vue de l\'événement en haute fidélité.', icon: '', compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'evenement', 'festival', 'artistique', 'association', 'autre'], dependencies: [], optional: true, defaultEnabled: true },
    guestbook: { id: 'guestbook', name: 'Livre d\'or vocal & messages', category: 'Émotion', description: 'Enregistrement de messages vocaux authentiques et mots d\'amour déposés par les proches.', whyRecommended: 'Capture la chaleur et les inflexions de voix des êtres chers pour l\'éternité.', icon: '', compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'artistique', 'association', 'autre'], dependencies: [], optional: true, defaultEnabled: true },
    memories: { id: 'memories', name: 'Capsules & Archives de vie', category: 'Mémoire', description: 'Espace rétrospectif photos, anecdotes et faits marquants traversant les décennies.', whyRecommended: 'Raconte l\'histoire qui a mené jusqu\'à ce jour exceptionnel.', icon: '', compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'association', 'autre'], dependencies: [], optional: true, defaultEnabled: true },
    providers: { id: 'providers', name: 'Prestataires & Guide Hébergements', category: 'Logistique', description: 'Recommandations d\'hôtels, navettes, coiffeurs et prestataires de l\'événement.', whyRecommended: 'Offre une expérience 5 étoiles aux invités venant de loin.', icon: '', compatibleEvents: ['mariage', 'festival', 'evenement', 'professionnel'], dependencies: [], optional: true, defaultEnabled: false },
    map: { id: 'map', name: 'Cartographie interactive des lieux', category: 'Orientation', description: 'Carte vectorielle fluide avec repères géolocalisés pour chaque temps fort.', whyRecommended: 'Guide les invités d\'un lieu à l\'autre sans erreur.', icon: '', compatibleEvents: ['mariage', 'festival', 'evenement', 'professionnel', 'autre'], dependencies: [], optional: true, defaultEnabled: true },
    countdown: { id: 'countdown', name: 'Compte à rebours cinématique', category: 'Attente & Suspense', description: 'Écran d\'accueil avec décompte interactif personnalisé et micro-animations.', whyRecommended: 'Crée une émulation et fait monter l\'attente avant le grand moment.', icon: '', compatibleEvents: ['mariage', 'anniversaire', 'festival', 'evenement', 'professionnel'], dependencies: [], optional: true, defaultEnabled: false },
    program: { id: 'program', name: 'Programme dynamique heure par heure', category: 'Déroulé & Temps', description: 'Grille interactive avec filtres thématiques, alertes et descriptifs détaillés.', whyRecommended: 'Permet à chaque participant d\'organiser son parcours en temps réel.', icon: '', compatibleEvents: ['ceremonie', 'evenement', 'festival', 'professionnel', 'association'], dependencies: [], optional: true, defaultEnabled: true },
    tributes: { id: 'tributes', name: 'Espace d\'hommage & Biographie', category: 'Mémoire', description: 'Biographie intime, portrait lumineux et citations choisies en hommage.', whyRecommended: 'Honore une vie avec délicatesse, dignité et poésie.', icon: '', compatibleEvents: ['ceremonie'], dependencies: [], optional: true, defaultEnabled: true },
    testimonials: { id: 'testimonials', name: 'Recueil de condoléances & Récits', category: 'Émotion', description: 'Espace sécurisé où chaque proche peut partager un souvenir ou mot de réconfort.', whyRecommended: 'Rassemble l\'affection de tous, y compris des proches éloignés.', icon: '', compatibleEvents: ['ceremonie', 'association'], dependencies: [], optional: true, defaultEnabled: true },
    audio: { id: 'audio', name: 'Retransmission audio & Podcasts', category: 'Sensorialité', description: 'Diffusion sonore haute fidélité pour les absents et extraits d\'archives orales.', whyRecommended: 'Partage l\'émotion avec ceux qui ne peuvent être physiquement présents.', icon: '', compatibleEvents: ['ceremonie', 'artistique', 'festival', 'evenement'], dependencies: [], optional: true, defaultEnabled: true },
    video: { id: 'video', name: 'Coffre-fort de vidéos surprises', category: 'Attente & Suspense', description: 'Dépôt secret de capsules vidéos déverrouillées uniquement le jour de la fête.', whyRecommended: 'Garde la surprise totale pour le fêté jusqu\'à la dernière minute.', icon: '', compatibleEvents: ['anniversaire', 'mariage'], dependencies: [], optional: true, defaultEnabled: false },
    privateSpace: { id: 'privateSpace', name: 'Espace privé & Confidentiel', category: 'Sécurité', description: 'Accès réservé avec code pour les proches ou organisateurs.', whyRecommended: 'Préserve les informations sensibles et les surprises.', icon: '', compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'professionnel', 'autre'], dependencies: [], optional: true, defaultEnabled: false },
    notifications: { id: 'notifications', name: 'Alertes en direct le jour J', category: 'Coordination', description: 'Notifications PWA discrètes pour signaler le passage à table ou un temps fort.', whyRecommended: 'Fluidifie le timing sans devoir crier dans un mégaphone.', icon: '', compatibleEvents: ['mariage', 'festival', 'evenement'], dependencies: [], optional: true, defaultEnabled: false },
    agenda: { id: 'agenda', name: 'Mon agenda personnalisé', category: 'Expérience Visiteur', description: 'Le festivalier ou invité compose son planning en cochant ses favoris.', whyRecommended: 'Offre une expérience sur mesure à chaque participant.', icon: '', compatibleEvents: ['festival', 'evenement', 'professionnel'], dependencies: ['program'], optional: true, defaultEnabled: true },
    artists: { id: 'artists', name: 'Fiches immersives des artistes', category: 'Contenu', description: 'Biographies, extraits musicaux et visuels interactifs des créateurs.', whyRecommended: 'Met en lumière les talents et plonge le public dans leur univers.', icon: '', compatibleEvents: ['festival', 'artistique', 'evenement'], dependencies: [], optional: true, defaultEnabled: true },
    tickets: { id: 'tickets', name: 'Accès & Billetterie sans friction', category: 'Logistique', description: 'Réservation ou inscription immédiate intégrée sans redirection.', whyRecommended: 'Maximise les réservations grâce à un parcours fluide.', icon: '', compatibleEvents: ['festival', 'evenement', 'professionnel', 'artistique'], dependencies: [], optional: true, defaultEnabled: false },
    donations: { id: 'donations', name: 'Module de don & Adhésion', category: 'Engagement', description: 'Soutien direct libre ou récurrent sans commissions abusives.', whyRecommended: 'Permet aux sympathisants de soutenir la cause en toute confiance.', icon: '', compatibleEvents: ['association'], dependencies: [], optional: true, defaultEnabled: true },
    impact: { id: 'impact', name: 'Visualiseur d\'impact en direct', category: 'Transparence', description: 'Infographies dynamiques reliant chaque action citoyenne aux résultats de terrain.', whyRecommended: 'Prouve la valeur des actions et fidélise la communauté.', icon: '', compatibleEvents: ['association'], dependencies: [], optional: true, defaultEnabled: true },
    contact: { id: 'contact', name: 'Liaison directe & Transmission', category: 'Coordination', description: 'Formulaire chiffré de prise de contact direct avec les organisateurs.', whyRecommended: 'Canal privilégié pour répondre aux questions particulières.', icon: '', compatibleEvents: ['mariage', 'ceremonie', 'anniversaire', 'evenement', 'festival', 'artistique', 'association', 'professionnel', 'autre', 'indecis'], dependencies: [], optional: true, defaultEnabled: true }
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
        { id: 'concept_01', name: 'La Partition Vivante', tagline: 'Votre union orchestrée comme une composition musicale.', summary: 'Une scénographie poétique où chaque temps fort est associé à une ambiance sonore dédiée et un livre d\'or vocal.', metaphor: { name: 'Partition musicale', description: 'Chaque invité et moment forment une note de l\'harmonie générale.' }, creativeDirection: { atmosphere: 'poetique', keywords: ['musique', 'harmonie', 'sensibilité'], artDirection: 'Tons chauds, ondes sonores interactives, typographie délicate.' }, architecture: { pages: ['Prélude', 'Mouvements du Jour J', 'Voix des Invités', 'Archives'], navigation: ['Prélude', 'Mouvements', 'Voix'] }, recommendedModules: [{ id: 'music' }, { id: 'timeline' }, { id: 'guestbook' }, { id: 'gallery' }, { id: 'rsvp' }], signatureInteraction: { name: 'Livre d\'or vocal en vinyle interactif', description: 'Les messages des proches deviennent des microsillons audios interactifs.' }, whyItFits: 'Sublime l\'importance de la musique et l\'émotion des proches.' },
        { id: 'concept_02', name: 'Constellation des Proches', tagline: 'Les invités et les moments reliés sous un ciel vivant.', summary: 'Un espace en mode nuit où les convives découvrent leur place au sein d\'une constellation interactive.', metaphor: { name: 'Ciel étoilé', description: 'Chaque personne est une étoile qui éclaire le parcours des mariés.' }, creativeDirection: { atmosphere: 'cinematique', keywords: ['nuit', 'lumière', 'étoiles'], artDirection: 'Clair-obscur céleste, fond noir profond et particules lumineuses.' }, architecture: { pages: ['Accueil Céleste', 'Plan Astral', 'Programme', 'Galerie'], navigation: ['Accueil', 'Plan Astral', 'Programme'] }, recommendedModules: [{ id: 'tables' }, { id: 'guests' }, { id: 'countdown' }, { id: 'timeline' }, { id: 'gallery' }], signatureInteraction: { name: 'Plan de table sous forme de constellation', description: 'Recherche spatiale où chaque table illumine ses étoiles convives.' }, whyItFits: 'Idéal pour faire voyager les proches venant de loin.' },
        { id: 'concept_03', name: 'Le Grand Jour — Timeline Vivante', tagline: 'La journée entière devient l\'interface vivante.', summary: 'Une expérience d\'une grande fluidité où le programme se synchronise en direct le jour J avec RSVP 1-clic.', metaphor: { name: 'Fil conducteur', description: 'Le déroulé temporel devient le sanctuaire d\'information et de partage.' }, creativeDirection: { atmosphere: 'elegante', keywords: ['fluidité', 'timing', 'élégance'], artDirection: 'Typographie statutaire, contrastes nets, responsive ultra-rapide.' }, architecture: { pages: ['Accueil', 'Timeline en direct', 'RSVP & Guide', 'Galerie'], navigation: ['Accueil', 'Timeline', 'RSVP'] }, recommendedModules: [{ id: 'timeline' }, { id: 'rsvp' }, { id: 'map' }, { id: 'notifications' }, { id: 'gallery' }], signatureInteraction: { name: 'Synchronisation horaire en direct le Jour J', description: 'Le mini-site met en valeur le temps fort en cours sans intervention.' }, whyItFits: 'Offre une coordination sans faille et sans stress.' }
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
        { id: 'concept_01', name: 'Le Mémorial Intime & Pensées', tagline: 'Un recueillement sobre et d\'une infinie délicatesse.', summary: 'Une page apaisante avec biographie, bougies virtuelles et retransmission audio discrète.', metaphor: { name: 'Sanctuaire de lumière', description: 'Une flamme perpétuelle qui rassemble les cœurs.' }, creativeDirection: { atmosphere: 'poetique', keywords: ['lumière', 'douceur', 'mémoire'], artDirection: 'Clair-obscur doux, lumière dorée de bougie et typographie sobre.' }, architecture: { pages: ['Recueillement', 'Hommage', 'Témoignages'], navigation: ['Recueillement', 'Hommage', 'Témoignages'] }, recommendedModules: [{ id: 'tributes' }, { id: 'testimonials' }, { id: 'audio' }, { id: 'contact' }], signatureInteraction: { name: 'Bougies virtuelles partagées', description: 'Chaque proche allume une pensée qui s\'inscrit dans le registre mémoriel.' }, whyItFits: 'Permet aux proches éloignés de s\'unir au recueillement.' },
        { id: 'concept_02', name: 'L\'Arbre des Mémoires', tagline: 'Chaque témoignage devient une branche de transmission.', summary: 'Un espace de transmission où les anecdotes familiales et les photos d\'époque forment un héritage vivant.', metaphor: { name: 'Arbre des générations', description: 'La mémoire continue de grandir grâce aux récits transmis.' }, creativeDirection: { atmosphere: 'minimaliste', keywords: ['racines', 'héritage', 'transmission'], artDirection: 'Fonds profonds, respiration généreuse, contrastes doux.' }, architecture: { pages: ['Biographie', 'Mémoires & Récits', 'Archives Familiales', 'Livret PDF'], navigation: ['Biographie', 'Récits', 'Archives'] }, recommendedModules: [{ id: 'memories' }, { id: 'tributes' }, { id: 'testimonials' }, { id: 'gallery' }], signatureInteraction: { name: 'Livret mémoriel haute fidélité imprimable', description: 'Génération automatique d\'un document PDF relié conservant tous les récits.' }, whyItFits: 'Préserve les histoires précieuses pour les générations futures.' },
        { id: 'concept_03', name: 'La Voix & Le Souvenir', tagline: 'L\'archive sonore et mémorielle préservée pour toujours.', summary: 'Un espace centré sur les voix, les musiques chères et la captation de la cérémonie.', metaphor: { name: 'Résonance', description: 'La voix et les sons comme vecteurs intemporels de présence.' }, creativeDirection: { atmosphere: 'elegante', keywords: ['voix', 'présence', 'apaisement'], artDirection: 'Design épuré, lecteur audio contemplatif et respect total.' }, architecture: { pages: ['Accueil', 'Enregistrements', 'Programme', 'Condoléances'], navigation: ['Accueil', 'Enregistrements', 'Condoléances'] }, recommendedModules: [{ id: 'audio' }, { id: 'music' }, { id: 'program' }, { id: 'testimonials' }], signatureInteraction: { name: 'Retransmission sonore spatiale haute qualité', description: 'Écoute apaisée et archivage des pièces musicales significatives.' }, whyItFits: 'Offre une présence réconfortante et digne.' }
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
        { id: 'concept_01', name: 'La Capsule Temporelle', tagline: 'Les 40 années célébrées comme une aventure à étapes.', summary: 'Un mini-site cinématique à énigmes débloquant des indices chaque semaine pour révéler le lieu secret.', metaphor: { name: 'Capsule temporelle', description: 'Le passé et le futur réunis dans un coffre-fort interactif.' }, creativeDirection: { atmosphere: 'cinematique', keywords: ['suspense', 'rétrospective', 'surprise'], artDirection: 'Typographie rétro-futuriste, décompte géant et énigmes animées.' }, architecture: { pages: ['Décompte', 'Frise des 40 ans', 'Vidéos secrètes', 'Playlist'], navigation: ['Décompte', 'Frise', 'Playlist'] }, recommendedModules: [{ id: 'countdown' }, { id: 'memories' }, { id: 'video' }, { id: 'music' }, { id: 'rsvp' }], signatureInteraction: { name: 'Énigme de déverrouillage du lieu secret', description: 'Les invités découvrent des indices progressifs jusqu\'au jour J.' }, whyItFits: 'Crée une émulation collective extraordinaire.' },
        { id: 'concept_02', name: 'Le Mur des Complices', tagline: 'La communauté des amis au cœur de la fête.', summary: 'Un trombinoscope interactif avec anecdotes drôles, playlist collective et cagnotte élégante sans frais tiers.', metaphor: { name: 'Mosaïque d\'amitié', description: 'Chaque proche compose une pièce du grand portrait.' }, creativeDirection: { atmosphere: 'vibrante', keywords: ['amitié', 'énergie', 'complices'], artDirection: 'Contrastes vifs, cartes de profils interactives et rythme festif.' }, architecture: { pages: ['Accueil', 'Les Complices', 'Boîte à Sons', 'Cagnotte & RSVP'], navigation: ['Accueil', 'Complices', 'Boîte à Sons'] }, recommendedModules: [{ id: 'guests' }, { id: 'music' }, { id: 'gallery' }, { id: 'rsvp' }, { id: 'map' }], signatureInteraction: { name: 'Boîte à musique collaborative en temps réel', description: 'Les invités votent pour les morceaux de la soirée.' }, whyItFits: 'Fédère l\'énergie de tous les groupes d\'amis.' },
        { id: 'concept_03', name: 'L\'Écrin Anniversaire', tagline: 'La célébration élégante d\'un cap d\'exception.', summary: 'Une invitation raffinée avec galerie rétrospective haute définition et livre d\'or vocal.', metaphor: { name: 'Livre d\'or de prestige', description: 'Un témoignage élégant du chemin parcouru.' }, creativeDirection: { atmosphere: 'elegante', keywords: ['prestige', 'élégance', 'douceur'], artDirection: 'Noir profond, typographie statutaire et dorures subtiles.' }, architecture: { pages: ['Invitation', 'Rétrospective', 'Dépôt de vœux', 'RSVP'], navigation: ['Invitation', 'Rétrospective', 'RSVP'] }, recommendedModules: [{ id: 'rsvp' }, { id: 'guestbook' }, { id: 'memories' }, { id: 'map' }, { id: 'contact' }], signatureInteraction: { name: 'Livre d\'or vocal intimiste', description: 'Messages vocaux personnels enregistrés en 1 clic.' }, whyItFits: 'Parfait pour une célébration intime et chaleureuse.' }
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
        { id: 'concept_01', name: 'Le Pavillon Numérique', tagline: 'L\'extension digitale fluide de votre scénographie physique.', summary: 'Une application web ultra-légère fonctionnant à 100% hors-ligne pour orienter et immerger les visiteurs.', metaphor: { name: 'Pavillon interactif', description: 'Un point de repère accessible dans la poche de chacun.' }, creativeDirection: { atmosphere: 'cinematique', keywords: ['vitesse', 'clarté', 'immersion'], artDirection: 'Design épuré, contraste fort et lisibilité optimale en plein soleil.' }, architecture: { pages: ['Programme en direct', 'Carte interactive', 'Artistes', 'Mon Agenda'], navigation: ['Programme', 'Carte', 'Artistes'] }, recommendedModules: [{ id: 'program' }, { id: 'map' }, { id: 'agenda' }, { id: 'artists' }, { id: 'notifications' }], signatureInteraction: { name: 'Agenda personnalisé hors-ligne', description: 'L\'utilisateur compose son planning personnel conservé sans réseau.' }, whyItFits: 'Zéro friction logistique pour les grands événements.' },
        { id: 'concept_02', name: 'La Scène Hybride', tagline: 'Connecter le public sur place et les participants à distance.', summary: 'Une plateforme dynamique avec retransmission audio/vidéo des keynotes et questions en direct.', metaphor: { name: 'Agora sans frontières', description: 'Le dialogue ouvert entre la salle et le monde.' }, creativeDirection: { atmosphere: 'vibrante', keywords: ['interactivité', 'live', 'dynamisme'], artDirection: 'Composants dynamiques, indicateurs live et typographie moderne.' }, architecture: { pages: ['Live Stream', 'Programme', 'Intervenants', 'Ressources'], navigation: ['Live', 'Programme', 'Intervenants'] }, recommendedModules: [{ id: 'program' }, { id: 'audio' }, { id: 'artists' }, { id: 'tickets' }, { id: 'contact' }], signatureInteraction: { name: 'Questions & Réactions en direct', description: 'Interaction fluide du public avec les intervenants sans création de compte.' }, whyItFits: 'Idéal pour les conventions, lancements et rencontres culturelles.' },
        { id: 'concept_03', name: 'Le Guide Minimaliste', tagline: 'L\'information essentielle livrée en moins de 200 ms.', summary: 'Une fiche événement épurée avec accès direct aux horaires, aux billets et à l\'itinéraire.', metaphor: { name: 'Boussole', description: 'Droit au but, sans artifice.' }, creativeDirection: { atmosphere: 'minimaliste', keywords: ['rapidité', 'efficacité', 'sobriété'], artDirection: 'Fond noir pur, typographie Geist Mono et réactivité totale.' }, architecture: { pages: ['Accès & Billets', 'Horaires', 'Lieu'], navigation: ['Accès', 'Horaires', 'Lieu'] }, recommendedModules: [{ id: 'program' }, { id: 'tickets' }, { id: 'map' }, { id: 'contact' }], signatureInteraction: { name: 'Affichage instantané sans traceurs', description: 'Chargement en un clin d\'œil sur n\'importe quel smartphone.' }, whyItFits: 'Parfait pour un événement qui privilégie la simplicité absolue.' }
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
        { id: 'concept_01', name: 'Live & Offline', tagline: 'L\'expérience festivalière complète qui fonctionne sans réseau.', summary: 'Line-up immersif, carte des scènes géolocalisée et alertes en direct pour ne rater aucun set.', metaphor: { name: 'Boussole festivalière', description: 'Le guide complet toujours disponible en plein air.' }, creativeDirection: { atmosphere: 'vibrante', keywords: ['plein air', 'musique', 'autonomie'], artDirection: 'Contrastes néon sur fond sombre, navigation au pouce optimisée.' }, architecture: { pages: ['Line-up', 'Scènes & Carte', 'Mon Planning', 'Billets'], navigation: ['Line-up', 'Carte', 'Planning'] }, recommendedModules: [{ id: 'program' }, { id: 'artists' }, { id: 'map' }, { id: 'agenda' }, { id: 'notifications' }], signatureInteraction: { name: 'Mode Offline PWA automatique', description: 'L\'application reste 100% fonctionnelle au cœur du festival.' }, whyItFits: 'Répond aux contraintes réelles des festivals en plein air.' },
        { id: 'concept_02', name: 'La Boîte à Sons du Festival', tagline: 'L\'univers des artistes à écouter avant et pendant l\'événement.', summary: 'Des fiches artistes immersives intégrant des extraits musicaux et des podcasts exclusifs.', metaphor: { name: 'Scène sonore', description: 'Une immersion auditive dans la programmation.' }, creativeDirection: { atmosphere: 'cinematique', keywords: ['sound', 'découverte', 'artistes'], artDirection: 'Sound design réactif, typographie affirmée.' }, architecture: { pages: ['Artistes & Sons', 'Programmation', 'Billetterie'], navigation: ['Artistes', 'Programmation', 'Billets'] }, recommendedModules: [{ id: 'artists' }, { id: 'music' }, { id: 'audio' }, { id: 'program' }, { id: 'tickets' }], signatureInteraction: { name: 'Player d\'extraits des artistes en 1-clic', description: 'Découverte fluide de la programmation musicale.' }, whyItFits: 'Met en valeur les talents et stimule la billetterie.' },
        { id: 'concept_03', name: 'Le Pass Événement', tagline: 'La clarté absolue pour les festivaliers pressés.', summary: 'Accès ultra-rapide aux horaires de passage et à la billetterie intégrée.', metaphor: { name: 'Pass VIP', description: 'Toute l\'information essentielle au creux de la main.' }, creativeDirection: { atmosphere: 'minimaliste', keywords: ['direct', 'efficace', 'léger'], artDirection: 'Grille chirurgicale et rapidité extrême.' }, architecture: { pages: ['Horaires de passage', 'Carte des accès', 'Billets'], navigation: ['Horaires', 'Carte', 'Billets'] }, recommendedModules: [{ id: 'program' }, { id: 'tickets' }, { id: 'map' }, { id: 'contact' }], signatureInteraction: { name: 'Filtre instantané par scène', description: 'Sélection immédiate des concerts par lieu et tranche horaire.' }, whyItFits: 'Efficacité maximale sans fioritures.' }
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
        { id: 'concept_01', name: 'Matière & Lumière', tagline: 'Une scénographie en clair-obscur où chaque œuvre réagit au visiteur.', summary: 'Une exploration contemplative plein écran avec sound design réactif et podcasts d\'intention.', metaphor: { name: 'Clair-obscur sensoriel', description: 'La lumière et le son sculptent l\'espace numérique.' }, creativeDirection: { atmosphere: 'poetique', keywords: ['texture', 'lumière', 'son'], artDirection: 'Fond noir profond, zoom haute fidélité sur les matières.' }, architecture: { pages: ['Scénographie', 'Œuvres & Textures', 'Notes d\'artiste', 'Livre d\'or'], navigation: ['Scénographie', 'Œuvres', 'Notes'] }, recommendedModules: [{ id: 'artists' }, { id: 'gallery' }, { id: 'music' }, { id: 'audio' }, { id: 'guestbook' }], signatureInteraction: { name: 'Sound design réactif au pointeur', description: 'L\'univers sonore s\'adapte aux mouvements d\'exploration de l\'œuvre.' }, whyItFits: 'Respecte la matérialité et la poésie de la démarche artistique.' },
        { id: 'concept_02', name: 'L\'Atelier & Le Processus', tagline: 'Dévoiler les coulisses de la création et les carnets d\'esquisses.', summary: 'Un voyage intime dans le processus créatif, de la première esquisse à l\'œuvre finale.', metaphor: { name: 'Carnet d\'atelier', description: 'L\'intimité de l\'acte créateur partagée avec les amateurs d\'art.' }, creativeDirection: { atmosphere: 'minimaliste', keywords: ['coulisses', 'esquisses', 'authenticité'], artDirection: 'Typographie d\'auteur, annotations manuscrites numérisées.' }, architecture: { pages: ['Le Processus', 'Carnets d\'esquisses', 'Pièces Finales', 'Contact Artiste'], navigation: ['Processus', 'Carnets', 'Pièces'] }, recommendedModules: [{ id: 'memories' }, { id: 'gallery' }, { id: 'audio' }, { id: 'contact' }], signatureInteraction: { name: 'Comparateur interactif Esquisse vs Œuvre finale', description: 'Slider interactif pour observer l\'évolution de la pièce.' }, whyItFits: 'Crée un lien profond entre le collectionneur et l\'artiste.' },
        { id: 'concept_03', name: 'La Galerie d\'Acquisition Directe', tagline: 'Présentation de prestige et liaison directe avec les collectionneurs.', summary: 'Une vitrine statutaire pour valoriser les pièces maîtresses et faciliter les acquisitions sans intermédiaire.', metaphor: { name: 'Salon privé', description: 'Un écrin confidentiel pour présenter des pièces rares.' }, creativeDirection: { atmosphere: 'elegante', keywords: ['prestige', 'collection', 'singularité'], artDirection: 'Typographie luxueuse, fiches d\'œuvres détaillées.' }, architecture: { pages: ['Collection', 'Fiches d\'œuvres', 'Notes critiques', 'Acquisition'], navigation: ['Collection', 'Fiches', 'Acquisition'] }, recommendedModules: [{ id: 'gallery' }, { id: 'artists' }, { id: 'privateSpace' }, { id: 'contact' }], signatureInteraction: { name: 'Fiche d\'œuvre interactive haute résolution', description: 'Certificat d\'authenticité numérique et contact privé.' }, whyItFits: 'Positionnement haut de gamme pour les artistes et galeries.' }
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
        { id: 'concept_01', name: 'Récits & Impact Vivant', tagline: 'Donner la parole aux personnes qui vivent la mission au quotidien.', summary: 'Un storytelling immersif à la première personne avec infographies d\'impact en direct.', metaphor: { name: 'Voix plurielles', description: 'Le témoignage humain comme moteur de prise de conscience.' }, creativeDirection: { atmosphere: 'libre', keywords: ['humanité', 'récits', 'impact'], artDirection: 'Visuels chaleureux, typographie éditoriale claire et citations fortes.' }, architecture: { pages: ['Les Récits', 'Impact Concret', 'Manifeste', 'Agir & Soutenir'], navigation: ['Récits', 'Impact', 'Agir'] }, recommendedModules: [{ id: 'testimonials' }, { id: 'impact' }, { id: 'donations' }, { id: 'memories' }, { id: 'contact' }], signatureInteraction: { name: 'Visualiseur d\'impact citoyen en temps réel', description: 'Chaque soutien est relié à une action concrète de terrain.' }, whyItFits: 'Crée une adhésion sincère et transparente.' },
        { id: 'concept_02', name: 'Le Manifeste Citoyen', tagline: 'Une tribune claire et percutante pour mobiliser.', summary: 'Une mise en page éditoriale affirmée articulant les arguments clés et les appels à l\'action.', metaphor: { name: 'Manifeste ouvert', description: 'Un appel clair qui invite à s\'engager.' }, creativeDirection: { atmosphere: 'vibrante', keywords: ['mobilisation', 'action', 'clarté'], artDirection: 'Titres percutants, contrastes marqués et lecture rythmée.' }, architecture: { pages: ['Le Manifeste', 'Les Chiffres', 'Rejoindre le mouvement'], navigation: ['Manifeste', 'Chiffres', 'Rejoindre'] }, recommendedModules: [{ id: 'impact' }, { id: 'donations' }, { id: 'contact' }], signatureInteraction: { name: 'Signature du manifeste et mur des soutiens', description: 'Compteur dynamique des citoyens engagés.' }, whyItFits: 'Mobilisation rapide pour les campagnes d\'impact.' },
        { id: 'concept_03', name: 'L\'Observatoire de Terrain', tagline: 'Cartographier les actions concrètes et les avancées.', summary: 'Une carte interactive des actions menées sur le terrain avec fiches de résultats vérifiés.', metaphor: { name: 'Cartographie d\'action', description: 'La preuve par la géographie et les actes.' }, creativeDirection: { atmosphere: 'minimaliste', keywords: ['terrain', 'preuve', 'transparence'], artDirection: 'Infographies cartographiques, données claires et sobriété.' }, architecture: { pages: ['Carte des actions', 'Résultats', 'Soutenir une action locale'], navigation: ['Carte', 'Résultats', 'Soutenir'] }, recommendedModules: [{ id: 'map' }, { id: 'impact' }, { id: 'donations' }, { id: 'gallery' }, { id: 'contact' }], signatureInteraction: { name: 'Carte interactive des projets financés', description: 'Exploration géographique des réalisations de l\'association.' }, whyItFits: 'Garantit une transparence absolue pour les donateurs.' }
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
        { id: 'concept_01', name: 'La Vitrine d\'Impact', tagline: 'Une présentation chirurgicale et statutaire de votre initiative.', summary: 'Un mini-site ultra-rapide avec fiches intervenants et inscriptions VIP intégrées.', metaphor: { name: 'Écrin professionnel', description: 'L\'élégance et la précision au service du projet.' }, creativeDirection: { atmosphere: 'elegante', keywords: ['précision', 'statutaire', 'lancement'], artDirection: 'Typographie soignée, contrastes sombres et clarté des messages.' }, architecture: { pages: ['L\'Initiative', 'Programme des Keynotes', 'Intervenants', 'Inscription VIP'], navigation: ['Initiative', 'Programme', 'Inscription'] }, recommendedModules: [{ id: 'program' }, { id: 'artists' }, { id: 'rsvp' }, { id: 'tickets' }, { id: 'contact' }], signatureInteraction: { name: 'Accréditation VIP sans friction', description: 'Génération instantanée du pass d\'accès.' }, whyItFits: 'Idéal pour les lancements prestigieux.' },
        { id: 'concept_02', name: 'L\'Événement Hybride & Live', tagline: 'Retransmission et interactions en direct pour le public distant.', summary: 'Une interface connectée combinant diffusion audio/vidéo et networking.', metaphor: { name: 'Agora connectée', description: 'Le pont numérique entre le lieu physique et les participants distants.' }, creativeDirection: { atmosphere: 'cinematique', keywords: ['live', 'hybride', 'connexion'], artDirection: 'Composants interactifs live et sound design discret.' }, architecture: { pages: ['Live Stream', 'Keynotes', 'Espace Partenaires', 'Replay'], navigation: ['Live', 'Keynotes', 'Partenaires'] }, recommendedModules: [{ id: 'audio' }, { id: 'program' }, { id: 'artists' }, { id: 'privateSpace' }, { id: 'contact' }], signatureInteraction: { name: 'Diffusion haute fidélité avec espace questions', description: 'Interaction en direct sans application lourde.' }, whyItFits: 'Élargit l\'audience sans compromis technique.' },
        { id: 'concept_03', name: 'Le Livre Blanc Interactif', tagline: 'Transformer une vision stratégique en expérience immersive.', summary: 'Une narration interactive décomposant les piliers de votre projet avec infographies animées.', metaphor: { name: 'Manifeste stratégique', description: 'La démonstration par le design et la donnée.' }, creativeDirection: { atmosphere: 'minimaliste', keywords: ['vision', 'stratégie', 'données'], artDirection: 'Design monochrome, typographie monospace et graphiques vectoriels.' }, architecture: { pages: ['La Vision', 'Les Piliers', 'Données & Preuves', 'Prise de Contact'], navigation: ['Vision', 'Piliers', 'Contact'] }, recommendedModules: [{ id: 'impact' }, { id: 'program' }, { id: 'contact' }], signatureInteraction: { name: 'Explorateur interactif de données clés', description: 'Visualisation fluide des métriques du projet.' }, whyItFits: 'Convainc les partenaires et investisseurs exigeants.' }
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
        { id: 'concept_01', name: 'L\'Écho Poétique', tagline: 'Une création intime façonnée pour votre intention.', summary: 'Un sanctuaire sur mesure avec musique, galerie et livre d\'or vocal.', metaphor: { name: 'Écrin personnel', description: 'Un sanctuaire préservé pour votre projet.' }, creativeDirection: { atmosphere: 'poetique', keywords: ['intimité', 'poésie', 'sur-mesure'], artDirection: 'Tons chauds, éclairage feutré et typographie sensible.' }, architecture: { pages: ['Accueil', 'L\'Expérience', 'Souvenirs', 'Contact'], navigation: ['Accueil', 'Expérience', 'Contact'] }, recommendedModules: [{ id: 'music' }, { id: 'gallery' }, { id: 'guestbook' }, { id: 'contact' }], signatureInteraction: { name: 'Dispositif sonore et visuel sur mesure', description: 'Création interactive originale façonnée pour vous.' }, whyItFits: 'S\'adapte à toutes les intentions délicates.' },
        { id: 'concept_02', name: 'Le Laboratoire d\'Interaction', tagline: 'Une expérience audacieuse pensée hors des sentiers battus.', summary: 'Micro-interactions réactives au curseur, timeline vivante et scénographie sur mesure.', metaphor: { name: 'Laboratoire créatif', description: 'L\'exploration de nouvelles formes de narration.' }, creativeDirection: { atmosphere: 'cinematique', keywords: ['audace', 'interaction', 'nouveauté'], artDirection: 'Contrastes marqués, typographie affirmée et fluidité.' }, architecture: { pages: ['Entrée', 'Interaction', 'Programme', 'Archives'], navigation: ['Entrée', 'Interaction', 'Archives'] }, recommendedModules: [{ id: 'timeline' }, { id: 'countdown' }, { id: 'gallery' }, { id: 'map' }, { id: 'contact' }], signatureInteraction: { name: 'Scénographie interactive générative', description: 'Animations fluides réactives aux mouvements de l\'utilisateur.' }, whyItFits: 'Pour les projets qui refusent les standards.' },
        { id: 'concept_03', name: 'L\'Archive Perpétuelle', tagline: 'Un monument numérique pour traverser le temps.', summary: 'Un espace autonome pérenne garantissant la sauvegarde de votre moment.', metaphor: { name: 'Archive éternelle', description: 'Un héritage préservé sans dépendance.' }, creativeDirection: { atmosphere: 'elegante', keywords: ['pérennité', 'mémoire', 'transmission'], artDirection: 'Fonds profonds, élégance statutaire et sobriété.' }, architecture: { pages: ['Mémorial', 'Chronologie', 'Témoignages', 'Archives'], navigation: ['Mémorial', 'Chronologie', 'Archives'] }, recommendedModules: [{ id: 'memories' }, { id: 'gallery' }, { id: 'guestbook' }, { id: 'audio' }, { id: 'contact' }], signatureInteraction: { name: 'Export autonome téléchargeable pour l\'avenir', description: 'L\'archive reste consultable dans 20 ans.' }, whyItFits: 'Une pérennité totale garantie.' }
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
        { id: 'concept_01', name: 'L\'Atelier de Co-Création', tagline: 'Partir de votre intuition et la modeler ensemble.', summary: 'Un cadrage créatif personnel avec Matt Mez pour explorer les pistes possibles.', metaphor: { name: 'Esquisse ouverte', description: 'L\'intuition qui prend forme pas à pas.' }, creativeDirection: { atmosphere: 'poetique', keywords: ['écoute', 'intuition', 'co-création'], artDirection: 'Ambiance atelier, typographie manuscrite et écoute.' }, architecture: { pages: ['L\'Intuition', 'Pistes Créatives', 'Échange'], navigation: ['Intuition', 'Pistes', 'Échange'] }, recommendedModules: [{ id: 'gallery' }, { id: 'music' }, { id: 'guestbook' }, { id: 'contact' }], signatureInteraction: { name: 'Session d\'exploration en tête-à-tête', description: 'Dialogue direct pour poser les bases de l\'univers.' }, whyItFits: 'Idéal quand l\'envie est là mais pas encore la forme.' },
        { id: 'concept_02', name: 'Le Moodboard Interactif', tagline: 'Explorer plusieurs pistes visuelles et sonores avant de choisir.', summary: 'Un prototype évolutif permettant de tester des ambiances et des typographies en direct.', metaphor: { name: 'Palette vivante', description: 'Tester pour ressentir ce qui résonne.' }, creativeDirection: { atmosphere: 'libre', keywords: ['palette', 'essais', 'ressenti'], artDirection: 'Ambiance adaptable au gré de vos inspirations.' }, architecture: { pages: ['Moodboard', 'Ambiances', 'Modules Test'], navigation: ['Moodboard', 'Ambiances'] }, recommendedModules: [{ id: 'music' }, { id: 'gallery' }, { id: 'countdown' }, { id: 'contact' }], signatureInteraction: { name: 'Sélecteur interactif d\'ambiances sensorielles', description: 'Testez différentes palettes et sound designs en 1 clic.' }, whyItFits: 'Permet de visualiser concrètement avant de trancher.' },
        { id: 'concept_03', name: 'L\'Immersion Totale', tagline: 'Faire confiance à la créativité du studio pour une surprise totale.', summary: 'BYAIME prend en charge l\'intégralité de la direction artistique et technique.', metaphor: { name: 'Carte blanche', description: 'Laisser l\'artisan imaginer une œuvre complète.' }, creativeDirection: { atmosphere: 'cinematique', keywords: ['carte blanche', 'audace', 'surprise'], artDirection: 'Direction artistique immersive et soignée.' }, architecture: { pages: ['L\'Expérience', 'Le Déroulé', 'Souvenirs'], navigation: ['Expérience', 'Déroulé', 'Souvenirs'] }, recommendedModules: [{ id: 'timeline' }, { id: 'music' }, { id: 'gallery' }, { id: 'guestbook' }, { id: 'map' }, { id: 'contact' }], signatureInteraction: { name: 'Scénographie surprise livrée clé en main', description: 'Une création complète pensée pour émerveiller vos proches.' }, whyItFits: 'Pour ceux qui veulent se laisser surprendre et émerveiller.' }
      ]
    }
  };

  // =========================================================================
  // 3. AIME ENGINE — MÉTHODES CENTRALES & CONTRATS ARCHITECTURAUX
  // =========================================================================

  window.AIME_Engine = {
    version: '1.3.0-architect-ready',
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
        conceptExploration: {
          selectedId: 'concept_01',
          proposals: preset.alternatives ? preset.alternatives.slice() : [],
          generatedAt: new Date().toISOString()
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

        if (mod.compatibleEvents.indexOf(eventType) !== -1) score += 40;
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
          return moduleRegistry[mId] || { id: mId, name: mId, icon: '', category: 'Général', description: '' };
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

    // AIME ARCHITECT : Générateur d'Experience Blueprint
    generateExperienceBlueprint: function (experienceModel, projectModel) {
      var exp = experienceModel || this.generateExperience(projectModel);
      var rawPages = Array.isArray(exp.pages) && exp.pages.length > 0 ? exp.pages : ['Accueil', 'Programme', 'Invités & Tables', 'Souvenirs', 'Guide'];

      var navigationMap = rawPages.map(function (pName, idx) {
        return {
          pageId: 'page_' + idx,
          title: pName,
          slug: idx === 0 ? '/' : '/' + pName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
          isMain: idx < 4
        };
      });

      var pages = rawPages.map(function (pName, idx) {
        var isHome = idx === 0;
        var sections = [];

        if (isHome) {
          sections.push({
            sectionId: 'sec_hero',
            name: 'Hero Cinématique & Immersion',
            type: 'hero',
            layout: 'fullscreen-ambient',
            components: [
              { id: 'cmp_title', name: exp.meta.title || 'Titre', type: 'typography', desc: 'Typographie de caractère' },
              { id: 'cmp_countdown', name: 'Compte à rebours', type: 'timer', desc: 'Décompte interactif' },
              { id: 'cmp_rsvp', name: 'Bouton RSVP 1-clic', type: 'cta', desc: 'Accès sans mot de passe' }
            ],
            responsive: { desktop: 'Plein écran 100vh avec anneaux lumineux', tablet: 'Colonnes empilées', mobile: '100dvh avec bouton RSVP fixé' }
          });
          sections.push({
            sectionId: 'sec_timeline_preview',
            name: 'Aperçu du Déroulé',
            type: 'timeline-preview',
            layout: 'stepper-horizontal',
            components: [
              { id: 'cmp_steps', name: 'Temps forts cliquables', type: 'stepper', desc: 'Horaires synchronisés' }
            ],
            responsive: { desktop: 'Grille horizontale 4 colonnes', mobile: 'Défilement au pouce' }
          });
        } else {
          sections.push({
            sectionId: 'sec_' + idx,
            name: pName + ' — Scénographie Dédiée',
            type: 'module-section',
            layout: 'split-2col',
            components: [
              { id: 'cmp_' + idx, name: 'Composant interactif ' + pName, type: 'interactive-module', desc: 'Expérience sur mesure' }
            ],
            responsive: { desktop: 'Disposition équilibrée 2 colonnes', mobile: 'Disposition fluide 1 colonne' }
          });
        }

        return {
          pageId: 'page_' + idx,
          title: pName,
          slug: idx === 0 ? '/' : '/' + pName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
          purpose: isHome ? 'Immersion initiale et décompte' : 'Scénographie dédiée à ' + pName,
          sections: sections
        };
      });

      return {
        id: 'blueprint_' + Math.random().toString(36).substr(2, 9),
        conceptTitle: exp.meta.title,
        theme: exp.theme,
        navigationMap: navigationMap,
        pages: pages,
        responsiveRules: {
          desktop: { columns: 12, containerMaxWidth: '1152px', navigation: 'Barre fixe supérieure transparente' },
          tablet: { columns: 8, containerMaxWidth: '768px', navigation: 'Menu épuré avec tiroir' },
          mobile: { columns: 4, containerMaxWidth: '100%', navigation: 'Menu pouce avec accès rapide' }
        },
        interactiveStates: [
          { state: 'initial', description: 'Chargement rapide < 200 ms avec sound design feutré activable.' },
          { state: 'live', description: 'Mode Jour J avec synchronisation horaire et dépôt photo.' },
          { state: 'archive', description: 'Conservation mémorielle autonome et pérenne.' }
        ]
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
        '## 06 — ARCHITECTURE DU MINI-SITE & BLUEPRINT\n' +
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

      var rec = this.recommendModules(updated);
      var sortedKeys = Object.keys(rec.scores).filter(function (k) {
        return moduleRegistry[k].compatibleEvents.indexOf(eventType) !== -1;
      });
      sortedKeys.sort(function (a, b) { return rec.scores[b] - rec.scores[a]; });

      updated.modules = sortedKeys.slice(0, 7);
      updated.architecture.pages = preset.pages.slice();
      updated.architecture.navigation = preset.pages.slice(0, 4);
      updated.concept.title = preset.suggestedTitle;
      updated.concept.subtitle = preset.subtitle;
      updated.concept.signatureInteraction = preset.signatureInteraction;
      updated.concept.artDirection = preset.artDirection;
      updated.conceptExploration = {
        selectedId: 'concept_01',
        proposals: preset.alternatives ? preset.alternatives.slice() : [],
        generatedAt: new Date().toISOString()
      };
      updated.message = structuredIntent.rawIntent || existingProjectModel.message || '';
      updated.updatedAt = new Date().toISOString();

      return updated;
    },

    // Application d'un Concept Proposal issu de AIME CONCEPT
    applyConceptProposal: function (conceptProposal, projectModel) {
      if (!conceptProposal) return projectModel;
      var updated = Object.assign({}, projectModel);

      updated.concept = {
        title: conceptProposal.name || updated.concept.title,
        subtitle: conceptProposal.tagline || updated.concept.subtitle,
        description: conceptProposal.summary || updated.concept.description,
        artDirection: (conceptProposal.creativeDirection && conceptProposal.creativeDirection.artDirection)
          ? conceptProposal.creativeDirection.artDirection
          : updated.concept.artDirection,
        signatureInteraction: (conceptProposal.signatureInteraction && conceptProposal.signatureInteraction.name)
          ? conceptProposal.signatureInteraction.name + (conceptProposal.signatureInteraction.description ? ' — ' + conceptProposal.signatureInteraction.description : '')
          : updated.concept.signatureInteraction
      };

      if (conceptProposal.creativeDirection && conceptProposal.creativeDirection.atmosphere) {
        updated.experience = Object.assign({}, updated.experience, {
          atmosphere: conceptProposal.creativeDirection.atmosphere
        });
      }

      if (conceptProposal.architecture && Array.isArray(conceptProposal.architecture.pages) && conceptProposal.architecture.pages.length > 0) {
        updated.architecture = {
          pages: conceptProposal.architecture.pages.slice(),
          navigation: (conceptProposal.architecture.navigation && conceptProposal.architecture.navigation.length > 0)
            ? conceptProposal.architecture.navigation.slice()
            : conceptProposal.architecture.pages.slice(0, 4),
          features: []
        };
      }

      if (Array.isArray(conceptProposal.recommendedModules) && conceptProposal.recommendedModules.length > 0) {
        var newModIds = conceptProposal.recommendedModules.map(function (m) {
          return typeof m === 'string' ? m : (m && m.id ? m.id : null);
        }).filter(function (id) {
          return id && moduleRegistry[id];
        });

        if (newModIds.length > 0) {
          updated.modules = newModIds;
        }
      }

      if (!updated.conceptExploration) {
        updated.conceptExploration = { selectedId: conceptProposal.id, proposals: [], generatedAt: new Date().toISOString() };
      } else {
        updated.conceptExploration.selectedId = conceptProposal.id;
      }

      updated.updatedAt = new Date().toISOString();
      return updated;
    },

    // Client pour appeler l'agent AIME INTENT
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
          return { success: false, error: result.error || 'SERVER_ERROR', message: result.message || 'Le service AIME INTENT est temporairement indisponible.' };
        }

        window.trackBYAIME('aime_intent_success', { eventType: (result.data.eventType || {}).value });
        return { success: true, data: result.data };
      } catch (err) {
        window.trackBYAIME('aime_intent_failed', { error: 'NETWORK_ERROR' });
        return { success: false, error: 'NETWORK_ERROR', message: 'Impossible de contacter le service AIME INTENT. Vérifiez votre connexion ou passez par le configurateur manuel.' };
      }
    },

    // Client pour appeler l'agent AIME CONCEPT
    callAimeConceptAgent: async function (structuredIntent, projectModel) {
      window.trackBYAIME('aime_concept_started', { eventType: (structuredIntent.eventType || {}).value });

      try {
        var payload = {
          structuredIntent: structuredIntent,
          eventType: (structuredIntent.eventType && structuredIntent.eventType.value) ? structuredIntent.eventType.value : projectModel.event.type,
          intentions: structuredIntent.intentions ? structuredIntent.intentions.map(function (i) { return i.value || i; }) : projectModel.intentions,
          audience: (structuredIntent.audience && structuredIntent.audience.value) ? structuredIntent.audience.value : projectModel.event.audience,
          signals: structuredIntent.signals || [],
          constraints: structuredIntent.constraints || [],
          summary: structuredIntent.summary || projectModel.concept.description || ''
        };

        var response = await fetch('/api/aime-concept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        var result = await response.json();
        if (!response.ok || !result.success) {
          window.trackBYAIME('aime_concept_failed', { error: result.error || 'HTTP_' + response.status });
          return { success: false, error: result.error || 'SERVER_ERROR', message: result.message || 'Le service AIME CONCEPT est temporairement indisponible.' };
        }

        window.trackBYAIME('aime_concept_success', { count: (result.data.concepts || []).length });
        return { success: true, concepts: result.data.concepts };
      } catch (err) {
        window.trackBYAIME('aime_concept_failed', { error: 'NETWORK_ERROR' });
        return { success: false, error: 'NETWORK_ERROR', message: 'Impossible de contacter le service AIME CONCEPT.' };
      }
    },

    // Client pour appeler l'agent AIME ARCHITECT
    callAimeArchitectAgent: async function (experienceModel, projectModel) {
      window.trackBYAIME('aime_architect_started', { theme: experienceModel.theme });

      try {
        var response = await fetch('/api/aime-architect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ experienceModel: experienceModel, projectModel: projectModel })
        });

        var result = await response.json();
        if (result.success && result.data && result.data.blueprint) {
          window.trackBYAIME('aime_architect_success', { pagesCount: (result.data.blueprint.pages || []).length });
          return { success: true, blueprint: result.data.blueprint };
        }

        // Fallback
        var localBp = this.generateExperienceBlueprint(experienceModel, projectModel);
        return { success: true, blueprint: localBp };
      } catch (e) {
        var localBp2 = this.generateExperienceBlueprint(experienceModel, projectModel);
        return { success: true, blueprint: localBp2 };
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

    // Filtres Galerie Projets
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
  // 5. CONTROLLER /projet — DEUX PARCOURS & MULTI-AGENTS AIME
  // =========================================================================

  document.addEventListener('DOMContentLoaded', function () {
    var configContainer = document.getElementById('byaime-configurator');
    if (!configContainer) return;

    var projectModel = window.AIME_Engine.createProjectModel();
    var currentStep = 1;
    var totalSteps = 5;
    var activeIntentData = null;
    var activeConceptProposals = [];
    var activeBlueprint = null;

    // Mode Toggle Elements
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
    // Check if incoming from AIME PATH in Hero
    var directIntentRaw = null;
    try {
      directIntentRaw = localStorage.getItem('byaime_direct_intent');
    } catch (e) {}

    if (directIntentRaw) {
      try {
        var parsedDirect = JSON.parse(directIntentRaw);
        localStorage.removeItem('byaime_direct_intent');
        activeIntentData = parsedDirect;
        renderHumanValidationStep(parsedDirect);
        switchMode('intent');
      } catch (e) {}
    } else var templateParam = urlParams.get('template');
    if (templateParam && defaultPresets[templateParam]) {
      applyPresetToModel(templateParam);
      switchMode('manual');
    } else {
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
          if (intentErrorBox && intentErrorMsg) {
            intentErrorMsg.textContent = result.message || 'Le service IA n\'a pas pu analyser votre texte pour le moment.';
            intentErrorBox.classList.remove('hidden');
          }
        }
      });
    }

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

    // Validation Humaine -> Lancer AIME CONCEPT
    var btnValidateIntent = document.getElementById('btn-validate-intent-yes');
    var conceptLoadingStage = document.getElementById('aime-concept-generating-stage');
    var conceptPresentationStage = document.getElementById('aime-concept-proposals-stage');

    if (btnValidateIntent) {
      btnValidateIntent.addEventListener('click', async function () {
        if (!activeIntentData) return;

        var extraAnswers = [];
        if (intentValidationBox) {
          intentValidationBox.querySelectorAll('input[data-extra-q]').forEach(function (inp) {
            if (inp.value.trim()) extraAnswers.push(inp.value.trim());
          });
        }
        if (extraAnswers.length > 0) {
          activeIntentData.rawIntent = (activeIntentData.rawIntent || '') + '\nPrécisions : ' + extraAnswers.join(', ');
        }

        projectModel = window.AIME_Engine.mergeStructuredIntentIntoProject(activeIntentData, projectModel);
        window.trackBYAIME('aime_intent_validated', { type: projectModel.event.type });

        if (intentValidationBox) intentValidationBox.classList.add('hidden');
        if (conceptLoadingStage) conceptLoadingStage.classList.remove('hidden');
        if (conceptPresentationStage) conceptPresentationStage.classList.add('hidden');

        var conceptResult = await window.AIME_Engine.callAimeConceptAgent(activeIntentData, projectModel);

        if (conceptLoadingStage) conceptLoadingStage.classList.add('hidden');

        if (conceptResult.success && Array.isArray(conceptResult.concepts) && conceptResult.concepts.length > 0) {
          activeConceptProposals = conceptResult.concepts;
        } else {
          var preset = defaultPresets[projectModel.event.type] || defaultPresets.mariage;
          activeConceptProposals = preset.alternatives || [];
        }

        renderCreativeConceptCards(activeConceptProposals);
      });
    }

    function renderCreativeConceptCards(proposals) {
      if (!conceptPresentationStage) return;

      var cardsContainer = document.getElementById('concept-cards-grid');
      if (cardsContainer) {
        cardsContainer.innerHTML = '';

        proposals.slice(0, 3).forEach(function (concept, idx) {
          var card = document.createElement('div');
          card.className = 'p-6 rounded-3xl bg-zinc-950 border border-white/10 glow-card hover:border-white/30 transition-all flex flex-col justify-between space-y-4';

          var metName = (concept.metaphor && concept.metaphor.name) ? concept.metaphor.name : 'Direction ' + (idx + 1);
          var sigName = (concept.signatureInteraction && concept.signatureInteraction.name) ? concept.signatureInteraction.name : 'Dispositif Signature';

          card.innerHTML = '<div>' +
            '<div class="flex justify-between items-baseline mb-3">' +
            '<span class="text-xs font-mono font-bold text-emerald-400">0' + (idx + 1) + '</span>' +
            '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white uppercase">' + (concept.creativeDirection ? concept.creativeDirection.atmosphere : 'poétique') + '</span>' +
            '</div>' +
            '<h4 class="text-lg font-bold text-white tracking-tight">' + concept.name + '</h4>' +
            '<p class="text-xs text-pink-300 font-mono mt-1 italic">' + concept.tagline + '</p>' +
            '<p class="text-xs text-muted-foreground mt-3 leading-relaxed">' + concept.summary + '</p>' +
            '<div class="mt-4 pt-3 border-t border-white/5 space-y-2 text-[11px] text-gray-300">' +
            '<p><strong class="text-white">Métaphore :</strong> ' + metName + '</p>' +
            '<p><strong class="text-white">Signature :</strong> ' + sigName + '</p>' +
            '</div>' +
            '</div>' +
            '<div class="pt-4 border-t border-white/10 flex items-center gap-2">' +
            '<button type="button" class="btn-explore-concept flex-1 py-2.5 rounded-full bg-white text-xs font-bold text-black hover:bg-white/90 transition-all">Explorer cette direction →</button>' +
            '</div>';

          var exploreBtn = card.querySelector('.btn-explore-concept');
          exploreBtn.addEventListener('click', function () {
            openConceptDetailModal(concept);
          });

          cardsContainer.appendChild(card);
        });
      }

      conceptPresentationStage.classList.remove('hidden');
      conceptPresentationStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function openConceptDetailModal(concept) {
      var dialog = document.getElementById('modal-concept-detail');
      if (!dialog) return;

      var nameEl = document.getElementById('det-concept-name');
      var tagEl = document.getElementById('det-concept-tagline');
      var sumEl = document.getElementById('det-concept-summary');
      var metEl = document.getElementById('det-concept-metaphor');
      var artEl = document.getElementById('det-concept-art');
      var archEl = document.getElementById('det-concept-arch');
      var modsEl = document.getElementById('det-concept-modules');
      var sigEl = document.getElementById('det-concept-signature');
      var whyEl = document.getElementById('det-concept-why');
      var selectBtn = document.getElementById('btn-select-this-concept');

      if (nameEl) nameEl.textContent = concept.name;
      if (tagEl) tagEl.textContent = concept.tagline;
      if (sumEl) sumEl.textContent = concept.summary;
      if (metEl) metEl.textContent = (concept.metaphor && concept.metaphor.name) ? concept.metaphor.name + ' — ' + (concept.metaphor.description || '') : 'Métaphore directrice de l\'expérience';
      if (artEl) artEl.textContent = (concept.creativeDirection && concept.creativeDirection.artDirection) ? concept.creativeDirection.artDirection : 'Direction artistique sur mesure.';

      if (archEl) {
        archEl.innerHTML = '';
        var pagesList = (concept.architecture && Array.isArray(concept.architecture.pages)) ? concept.architecture.pages : ['Accueil', 'Programme', 'Invités', 'Souvenirs'];
        pagesList.forEach(function (p) {
          var li = document.createElement('li');
          li.className = 'text-xs text-muted-foreground flex items-center gap-2';
          li.innerHTML = '<span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span><span>' + p + '</span>';
          archEl.appendChild(li);
        });
      }

      if (modsEl) {
        modsEl.innerHTML = '';
        var modsList = Array.isArray(concept.recommendedModules) ? concept.recommendedModules : [];
        modsList.forEach(function (m) {
          var mId = typeof m === 'string' ? m : (m && m.id ? m.id : null);
          var reason = (m && m.reason) ? m.reason : '';
          var modObj = moduleRegistry[mId] || { name: mId, icon: '' };
          var div = document.createElement('div');
          div.className = 'p-2 rounded-lg bg-white/5 text-xs';
          div.innerHTML = '<div class="flex items-center gap-1.5 text-white font-medium"><span>' + ((window.AIME_Icons && window.AIME_Icons[mId]) || '') + '</span><span>' + modObj.name + '</span></div>' +
            (reason ? '<p class="text-[10px] text-muted-foreground mt-0.5">' + reason + '</p>' : '');
          modsEl.appendChild(div);
        });
      }

      if (sigEl) {
        sigEl.textContent = (concept.signatureInteraction && concept.signatureInteraction.name)
          ? concept.signatureInteraction.name + (concept.signatureInteraction.description ? ' — ' + concept.signatureInteraction.description : '')
          : 'Interaction signature originale.';
      }

      if (whyEl) whyEl.textContent = concept.whyItFits || 'Cette direction valorise parfaitement votre intention de départ.';

      if (selectBtn) {
        selectBtn.onclick = function () {
          projectModel = window.AIME_Engine.applyConceptProposal(concept, projectModel);
          syncModelToUI();
          recalculateLiveProposal();

          dialog.close();
          window.trackBYAIME('aime_concept_selected', { name: concept.name });

          switchMode('manual');
          goToStep(5);
        };
      }

      dialog.showModal();
    }

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

    var btnReturnToConcepts = document.getElementById('btn-explore-concepts-again');
    if (btnReturnToConcepts) {
      btnReturnToConcepts.addEventListener('click', function () {
        if (activeConceptProposals && activeConceptProposals.length > 0) {
          switchMode('intent');
          if (conceptPresentationStage) {
            conceptPresentationStage.classList.remove('hidden');
            conceptPresentationStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }

    // Live Proposal recalculator
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
          var mod = moduleRegistry[mId] || { id: mId, name: mId, icon: '', description: '', whyRecommended: '' };
          var chip = document.createElement('div');
          chip.className = 'tag-removable cursor-pointer group';
          chip.innerHTML = '<span class="text-[11px]">' + ((window.AIME_Icons && window.AIME_Icons[mod.id]) || '') + ' ' + mod.name + '</span>' +
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

      if (titleEl) titleEl.textContent = ((window.AIME_Icons && window.AIME_Icons[mod.id]) || '') + ' ' + mod.name;
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
          '<div class="flex-1"><div class="flex items-center justify-between"><p class="text-xs font-bold text-white">' + ((window.AIME_Icons && window.AIME_Icons[mod.id]) || '') + ' ' + mod.name + '</p>' +
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

    // Mode Exploration (3 Alternatives)
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
              '<span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-white">' + (alt.creativeDirection ? alt.creativeDirection.atmosphere : alt.ambiance) + '</span></div>' +
              '<h4 class="text-base font-bold text-white">' + alt.title + '</h4>' +
              '<p class="text-xs text-muted-foreground">' + (alt.summary || alt.signature) + '</p>' +
              '<button type="button" class="w-full mt-2 py-2 rounded-full bg-white text-xs font-bold text-black hover:bg-white/90 transition-all">Je préfère cette version →</button>';

            var chooseBtn = card.querySelector('button');
            chooseBtn.addEventListener('click', function () {
              projectModel = window.AIME_Engine.applyConceptProposal(alt, projectModel);
              dialog.close();
              recalculateLiveProposal();
              window.trackBYAIME('project_alternative_chosen', { title: alt.title || alt.name });
            });

            container.appendChild(card);
          });
        }

        dialog.showModal();
      });
    }

    // Mode Preview avec AIME ARCHITECT & Blueprint Switcher
    var previewBtn = document.getElementById('btn-open-preview-mode');
    if (previewBtn) {
      previewBtn.addEventListener('click', async function () {
        var dialog = document.getElementById('modal-preview-experience');
        if (!dialog) return;

        var exp = window.AIME_Engine.generateExperience(projectModel);

        // Call AIME ARCHITECT to get full experienceBlueprint
        var bpResult = await window.AIME_Engine.callAimeArchitectAgent(exp, projectModel);
        activeBlueprint = bpResult.blueprint;

        // Render Experience Preview View
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

        // Render Blueprint Wireframe Tab
        renderBlueprintWireframeView(activeBlueprint);

        dialog.showModal();
        window.trackBYAIME('project_preview_opened', { title: exp.meta.title });
      });
    }

    // Blueprint Wireframe Renderer
    function renderBlueprintWireframeView(blueprint) {
      var bpContainer = document.getElementById('preview-blueprint-content');
      if (!bpContainer || !blueprint) return;

      bpContainer.innerHTML = '';

      var treeDiv = document.createElement('div');
      treeDiv.className = 'space-y-6';

      var headerHtml = '<div class="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">' +
        '<div><span class="text-[10px] font-mono text-emerald-400 uppercase">AIME ARCHITECT • EXPERIENCE BLUEPRINT</span>' +
        '<h4 class="text-sm font-bold text-white mt-0.5">' + (blueprint.conceptTitle || 'Architecture') + '</h4></div>' +
        '<div class="flex gap-2 text-[10px] font-mono text-muted-foreground">' +
        '<span class="px-2 py-0.5 rounded bg-white/5">' + (blueprint.pages || []).length + ' Pages</span>' +
        '<span class="px-2 py-0.5 rounded bg-white/5">' + blueprint.theme + '</span>' +
        '</div></div>';

      treeDiv.innerHTML = headerHtml;

      var pagesGrid = document.createElement('div');
      pagesGrid.className = 'space-y-4';

      (blueprint.pages || []).forEach(function (page, pIdx) {
        var pCard = document.createElement('div');
        pCard.className = 'p-4 rounded-2xl bg-black border border-white/10 space-y-3';
        pCard.innerHTML = '<div class="flex justify-between items-center border-b border-white/10 pb-2">' +
          '<div class="flex items-center gap-2">' +
          '<span class="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Page 0' + (pIdx + 1) + '</span>' +
          '<span class="text-xs font-bold text-white">' + page.title + '</span>' +
          '<span class="text-[10px] font-mono text-muted-foreground">' + page.slug + '</span>' +
          '</div>' +
          '<span class="text-[10px] text-muted-foreground italic">' + page.purpose + '</span>' +
          '</div>';

        var secList = document.createElement('div');
        secList.className = 'grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1';

        (page.sections || []).forEach(function (sec) {
          var sBox = document.createElement('div');
          sBox.className = 'p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/15 space-y-1.5';
          sBox.innerHTML = '<div class="flex justify-between items-baseline">' +
            '<span class="text-xs font-semibold text-white">' + sec.name + '</span>' +
            '<span class="text-[9px] font-mono uppercase text-pink-300">' + sec.type + '</span>' +
            '</div>' +
            '<p class="text-[10px] text-muted-foreground font-mono">Layout: ' + sec.layout + '</p>' +
            '<div class="flex flex-wrap gap-1 pt-1">' + (sec.components || []).map(function (c) {
              return '<span class="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-200">▪ ' + c.name + '</span>';
            }).join('') + '</div>';
          secList.appendChild(sBox);
        });

        pCard.appendChild(secList);
        pagesGrid.appendChild(pCard);
      });

      treeDiv.appendChild(pagesGrid);
      bpContainer.appendChild(treeDiv);
    }

    // Preview Mode View Switcher (Interactive Render vs Wireframe Blueprint vs Multi-Screen Simulator)
    var tabPrevRender = document.getElementById('tab-prev-render');
    var tabPrevBlueprint = document.getElementById('tab-prev-blueprint');
    var tabPrevDevices = document.getElementById('tab-prev-devices');

    var viewPrevRender = document.getElementById('prev-view-render');
    var viewPrevBlueprint = document.getElementById('prev-view-blueprint');

    if (tabPrevRender && tabPrevBlueprint && tabPrevDevices) {
      tabPrevRender.onclick = function () {
        tabPrevRender.className = 'px-3 py-1 rounded-full bg-white text-black font-bold text-xs transition-all';
        tabPrevBlueprint.className = 'px-3 py-1 rounded-full text-muted-foreground hover:text-white text-xs transition-all';
        tabPrevDevices.className = 'px-3 py-1 rounded-full text-muted-foreground hover:text-white text-xs transition-all';
        if (viewPrevRender) viewPrevRender.classList.remove('hidden');
        if (viewPrevBlueprint) viewPrevBlueprint.classList.add('hidden');
      };

      tabPrevBlueprint.onclick = function () {
        tabPrevBlueprint.className = 'px-3 py-1 rounded-full bg-white text-black font-bold text-xs transition-all';
        tabPrevRender.className = 'px-3 py-1 rounded-full text-muted-foreground hover:text-white text-xs transition-all';
        tabPrevDevices.className = 'px-3 py-1 rounded-full text-muted-foreground hover:text-white text-xs transition-all';
        if (viewPrevBlueprint) viewPrevBlueprint.classList.remove('hidden');
        if (viewPrevRender) viewPrevRender.classList.add('hidden');
        window.trackBYAIME('aime_blueprint_viewed', {});
      };

      tabPrevDevices.onclick = function () {
        tabPrevDevices.className = 'px-3 py-1 rounded-full bg-white text-black font-bold text-xs transition-all';
        tabPrevRender.className = 'px-3 py-1 rounded-full text-muted-foreground hover:text-white text-xs transition-all';
        tabPrevBlueprint.className = 'px-3 py-1 rounded-full text-muted-foreground hover:text-white text-xs transition-all';
        if (viewPrevRender) {
          viewPrevRender.classList.remove('hidden');
          viewPrevRender.style.maxWidth = viewPrevRender.style.maxWidth === '375px' ? '100%' : '375px';
        }
        if (viewPrevBlueprint) viewPrevBlueprint.classList.add('hidden');
      };
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
