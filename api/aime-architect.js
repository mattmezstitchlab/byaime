// ===== Vercel Serverless Function: /api/aime-architect =====
// AIME ARCHITECT — Troisième Agent de Conception BYAIME
// Transforms an experienceModel into an in-depth, structured Experience Blueprint (pages, sections, components, wireframes & responsive rules).

function buildDeterministicBlueprint(experienceModel, projectModel) {
  var exp = experienceModel || {};
  var theme = exp.theme || 'poetique';
  var eventType = (projectModel && projectModel.event) ? projectModel.event.type : 'mariage';
  var conceptTitle = (exp.meta && exp.meta.title) ? exp.meta.title : 'Univers Numérique BYAIME';
  var rawPages = Array.isArray(exp.pages) && exp.pages.length > 0 ? exp.pages : ['Accueil', 'Programme', 'Invités & Tables', 'Musique & Souvenirs', 'Guide'];

  // Navigation Map
  var navigationMap = rawPages.map(function (pageName, idx) {
    var slug = idx === 0 ? '/' : '/' + pageName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    return {
      pageId: 'page_' + idx,
      title: pageName,
      slug: slug,
      isMain: idx < 4
    };
  });

  // Pages & Section Breakdown
  var pages = rawPages.map(function (pageName, idx) {
    var isHome = idx === 0;
    var sections = [];

    if (isHome) {
      sections.push({
        sectionId: 'sec_hero',
        name: 'Hero Scénographique & Accueil',
        type: 'hero',
        layout: 'fullscreen-ambient',
        components: [
          { id: 'cmp_brand_title', name: 'Titre & Surnom de l\'événement', type: 'typography', desc: 'Typographie de caractère avec animation douce' },
          { id: 'cmp_countdown', name: 'Compte à rebours interactif', type: 'timer', desc: 'Décompte temps réel jusqu\'au moment clé' },
          { id: 'cmp_rsvp_cta', name: 'Bouton d\'action RSVP / Inscription', type: 'cta', desc: 'Accès fluide 1-clic sans mot de passe' }
        ],
        responsive: {
          desktop: 'Affichage plein écran 100vh centré avec anneaux lumineux et lecteur sonore en coin',
          tablet: 'Grille centrée avec padding adapté',
          mobile: 'Mise en page 100dvh avec bouton d\'action tactile ancré'
        }
      });

      sections.push({
        sectionId: 'sec_highlights',
        name: 'Aperçu du Déroulé & Temps Forts',
        type: 'timeline-preview',
        layout: 'stepper-horizontal',
        components: [
          { id: 'cmp_timeline_nodes', name: 'Nœuds interactifs des moments clés', type: 'stepper', desc: 'Horaires cliquables affichant le lieu et l\'ambiance' }
        ],
        responsive: {
          desktop: 'Grille 4 à 5 colonnes alignées avec transitions douces',
          mobile: 'Défilement horizontal fluide au pouce'
        }
      });
    } else if (pageName.toLowerCase().indexOf('programme') !== -1 || pageName.toLowerCase().indexOf('mouvement') !== -1) {
      sections.push({
        sectionId: 'sec_timeline_detail',
        name: 'Déroulé Interactif du Jour J',
        type: 'timeline',
        layout: 'vertical-stepper-split',
        components: [
          { id: 'cmp_stepper_vertical', name: 'Frise chronologique dynamique', type: 'timeline', desc: 'Synchronisation horaire en direct le jour de l\'événement' },
          { id: 'cmp_location_badge', name: 'Indicateur spatial & plan d\'accès', type: 'badge-map', desc: 'Lien direct vers la cartographie' }
        ],
        responsive: {
          desktop: 'Disposition 2 colonnes avec sticky nav latérale',
          mobile: 'Liste verticale compacte avec pastilles horaires lumineuses'
        }
      });
    } else if (pageName.toLowerCase().indexOf('invit') !== -1 || pageName.toLowerCase().indexOf('table') !== -1) {
      sections.push({
        sectionId: 'sec_table_search',
        name: 'Recherche d\'Invités & Plan de Table',
        type: 'table-finder',
        layout: 'interactive-search-card',
        components: [
          { id: 'cmp_search_bar', name: 'Champ de recherche instantané', type: 'input-search', desc: 'Filtrage immédiat par prénom ou nom' },
          { id: 'cmp_table_card', name: 'Carte de table & convives assignés', type: 'card', desc: 'Visualisation poétique de la table et des voisins' }
        ],
        responsive: {
          desktop: 'Carte centrée avec halo lumineux et recherche en temps réel',
          mobile: 'Interface au pouce avec clavier optimisé'
        }
      });
    } else if (pageName.toLowerCase().indexOf('souvenir') !== -1 || pageName.toLowerCase().indexOf('galerie') !== -1 || pageName.toLowerCase().indexOf('voix') !== -1) {
      sections.push({
        sectionId: 'sec_gallery_hd',
        name: 'Galerie Photo & Dépôt Live',
        type: 'gallery-upload',
        layout: 'masonry-grid',
        components: [
          { id: 'cmp_photo_masonry', name: 'Grille de photographies haute fidélité', type: 'grid', desc: 'Affichage plein écran avec zoom délicat' },
          { id: 'cmp_upload_dropzone', name: 'Zone de dépôt instantané par QR Code', type: 'upload', desc: 'Envoi direct depuis smartphone sans compression' }
        ],
        responsive: {
          desktop: 'Grille 3 colonnes avec effet lightbox',
          mobile: 'Grille 2 colonnes avec upload flottant en bas d\'écran'
        }
      });

      sections.push({
        sectionId: 'sec_guestbook_audio',
        name: 'Livre d\'Or Vocal & Messages',
        type: 'audio-recorder',
        layout: 'audio-player-card',
        components: [
          { id: 'cmp_voice_recorder', name: 'Module d\'enregistrement vocal 1-clic', type: 'audio-input', desc: 'Capture de la voix des proches' },
          { id: 'cmp_vinyl_player', name: 'Lecteur des messages déposés', type: 'audio-player', desc: 'Écoute des vœux avec spectre sonore animé' }
        ],
        responsive: {
          desktop: 'Carte large avec spectre sonore interactif',
          mobile: 'Bouton micro géant accessible facilement'
        }
      });
    } else {
      sections.push({
        sectionId: 'sec_custom_' + idx,
        name: pageName + ' — Module Dédié',
        type: 'custom-module',
        layout: 'card-grid',
        components: [
          { id: 'cmp_custom_content', name: 'Blocs d\'expérience ' + pageName, type: 'content-slot', desc: 'Contenu éditorial et interactif sur mesure' }
        ],
        responsive: {
          desktop: 'Disposition équilibrée 2 colonnes',
          mobile: 'Disposition fluide 1 colonne'
        }
      });
    }

    return {
      pageId: 'page_' + idx,
      title: pageName,
      slug: idx === 0 ? '/' : '/' + pageName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
      purpose: isHome ? 'Point d\'entrée et immersion initiale' : 'Scénographie dédiée à ' + pageName.toLowerCase(),
      sections: sections
    };
  });

  return {
    id: 'blueprint_' + Math.random().toString(36).substr(2, 9),
    generatedAt: new Date().toISOString(),
    conceptTitle: conceptTitle,
    theme: theme,
    navigationMap: navigationMap,
    pages: pages,
    responsiveRules: {
      desktop: { columns: 12, containerMaxWidth: '1152px', navigation: 'Barre fixe supérieure avec flou d\'arrière-plan (backdrop-blur)' },
      tablet: { columns: 8, containerMaxWidth: '768px', navigation: 'Menu épuré avec tiroir compact' },
      mobile: { columns: 4, containerMaxWidth: '100%', navigation: 'Menu pouce avec accès rapide aux 4 fonctions clés' }
    },
    interactiveStates: [
      { state: 'initial', description: 'Chargement ultra-rapide < 200 ms avec sound design feutré activable.' },
      { state: 'live', description: 'Mode Jour J avec synchronisation en direct des temps forts et dépôt photo instantané.' },
      { state: 'archive', description: 'Conservation mémorielle autonome téléchargeable et pérenne.' }
    ]
  };
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Seule la méthode POST est autorisée.' });
  }

  try {
    var body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    var experienceModel = body.experienceModel || {};
    var projectModel = body.projectModel || {};

    var apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
    var apiBaseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';

    // If no API key is set on server, fallback to the deterministic blueprint generator safely
    if (!apiKey) {
      var deterministicBlueprint = buildDeterministicBlueprint(experienceModel, projectModel);
      return res.status(200).json({
        success: true,
        data: {
          blueprint: deterministicBlueprint,
          source: 'deterministic_engine'
        }
      });
    }

    var systemPrompt = `Tu es AIME ARCHITECT, le troisième agent de conception du studio créatif BYAIME fondé par Matt Mez.
Ta mission est de transformer un experienceModel en un EXPERIENCE BLUEPRINT structuré (arborescence des pages, sections, composants, wireframes et règles responsive).

Format de retour JSON strict :
{
  "conceptTitle": "Titre du concept",
  "theme": "poetique",
  "navigationMap": [
    { "pageId": "home", "title": "Accueil", "slug": "/", "isMain": true }
  ],
  "pages": [
    {
      "pageId": "home",
      "title": "Nom de la page",
      "slug": "/",
      "purpose": "Objectif de la page",
      "sections": [
        {
          "sectionId": "sec_hero",
          "name": "Nom de la section",
          "type": "hero",
          "layout": "fullscreen-ambient",
          "components": [
            { "id": "cmp_1", "name": "Nom du composant", "type": "typography", "desc": "Rôle" }
          ],
          "responsive": {
            "desktop": "Règle desktop",
            "tablet": "Règle tablette",
            "mobile": "Règle mobile"
          }
        }
      ]
    }
  ],
  "responsiveRules": {
    "desktop": { "columns": 12, "containerMaxWidth": "1152px", "navigation": "Barre fixe supérieure" },
    "tablet": { "columns": 8, "containerMaxWidth": "768px", "navigation": "Menu tablette" },
    "mobile": { "columns": 4, "containerMaxWidth": "100%", "navigation": "Menu pouce mobile" }
  },
  "interactiveStates": [
    { "state": "initial", "description": "État initial" },
    { "state": "live", "description": "État Jour J" },
    { "state": "archive", "description": "État archive" }
  ]
}`;

    var userContextPrompt = JSON.stringify({
      conceptTitle: (experienceModel.meta && experienceModel.meta.title) ? experienceModel.meta.title : 'Projet BYAIME',
      theme: experienceModel.theme || 'poetique',
      pages: experienceModel.pages || [],
      modules: (experienceModel.modules || []).map(function (m) { return m.id || m; }),
      signatureInteraction: (experienceModel.interactions && experienceModel.interactions.signature) ? experienceModel.interactions.signature : ''
    });

    var response = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Génère l'Experience Blueprint détaillé pour cet univers : ${userContextPrompt}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3
      })
    });

    if (!response.ok) {
      var fallbackBp = buildDeterministicBlueprint(experienceModel, projectModel);
      return res.status(200).json({
        success: true,
        data: {
          blueprint: fallbackBp,
          source: 'deterministic_fallback'
        }
      });
    }

    var result = await response.json();
    var content = result.choices && result.choices[0] && result.choices[0].message
      ? result.choices[0].message.content
      : null;

    if (!content) {
      var fallbackBp2 = buildDeterministicBlueprint(experienceModel, projectModel);
      return res.status(200).json({
        success: true,
        data: { blueprint: fallbackBp2, source: 'deterministic_fallback' }
      });
    }

    var parsedBlueprint = JSON.parse(content);
    if (!parsedBlueprint.pages || !Array.isArray(parsedBlueprint.pages)) {
      parsedBlueprint = buildDeterministicBlueprint(experienceModel, projectModel);
    } else {
      parsedBlueprint.id = 'blueprint_' + Math.random().toString(36).substr(2, 9);
      parsedBlueprint.generatedAt = new Date().toISOString();
    }

    return res.status(200).json({
      success: true,
      data: {
        blueprint: parsedBlueprint,
        source: 'ai_architect'
      }
    });

  } catch (err) {
    var safeFallback = buildDeterministicBlueprint(req.body ? req.body.experienceModel : {}, req.body ? req.body.projectModel : {});
    return res.status(200).json({
      success: true,
      data: {
        blueprint: safeFallback,
        source: 'deterministic_safety_fallback'
      }
    });
  }
};
