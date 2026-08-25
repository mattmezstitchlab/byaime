// ===== Vercel Serverless Function: /api/aime-concept =====
// AIME CONCEPT — Deuxième Agent de Conception BYAIME
// Generates 3 divergent creative directions from a validated StructuredIntent.

const VALID_MODULE_IDS = [
  'timeline', 'rsvp', 'guests', 'tables', 'music', 'gallery',
  'guestbook', 'memories', 'providers', 'map', 'countdown',
  'program', 'tributes', 'testimonials', 'audio', 'video',
  'privateSpace', 'notifications', 'agenda', 'artists', 'tickets',
  'donations', 'impact', 'contact'
];

const ALLOWED_ATMOSPHERES = [
  'poetique', 'minimaliste', 'cinematique',
  'vibrante', 'elegante', 'libre'
];

function sanitizeConceptProposal(rawConcept, idx, eventType) {
  if (!rawConcept || typeof rawConcept !== 'object') {
    rawConcept = {};
  }

  var id = typeof rawConcept.id === 'string' && rawConcept.id.trim()
    ? rawConcept.id.trim()
    : 'concept_0' + (idx + 1);

  var name = typeof rawConcept.name === 'string' && rawConcept.name.trim()
    ? rawConcept.name.trim()
    : 'Direction Créative 0' + (idx + 1);

  var tagline = typeof rawConcept.tagline === 'string' && rawConcept.tagline.trim()
    ? rawConcept.tagline.trim()
    : 'Une expérience numérique singulière et mémorable.';

  var summary = typeof rawConcept.summary === 'string' && rawConcept.summary.trim()
    ? rawConcept.summary.trim()
    : 'Un univers sur mesure pensé pour sublimer l\'émotion et le partage.';

  // Metaphor
  var metaphor = {
    name: (rawConcept.metaphor && typeof rawConcept.metaphor.name === 'string') ? rawConcept.metaphor.name.trim() : 'Création vivante',
    description: (rawConcept.metaphor && typeof rawConcept.metaphor.description === 'string') ? rawConcept.metaphor.description.trim() : 'Une idée directrice qui structure l\'expérience.'
  };

  // Creative Direction
  var cd = rawConcept.creativeDirection || {};
  var atmosphere = (typeof cd.atmosphere === 'string' && ALLOWED_ATMOSPHERES.indexOf(cd.atmosphere.toLowerCase()) !== -1)
    ? cd.atmosphere.toLowerCase()
    : 'poetique';

  var keywords = Array.isArray(cd.keywords)
    ? cd.keywords.filter(function (k) { return typeof k === 'string'; }).slice(0, 5)
    : ['émotion', 'partage', 'singularité'];

  var artDirection = typeof cd.artDirection === 'string' && cd.artDirection.trim()
    ? cd.artDirection.trim()
    : 'Tons chauds, typographie élégante, lumière tamisée et respiration visuelle.';

  var visualLanguage = typeof cd.visualLanguage === 'string' ? cd.visualLanguage.trim() : 'Contraste raffiné en clair-obscur.';
  var typographicDirection = typeof cd.typographicDirection === 'string' ? cd.typographicDirection.trim() : 'Typographie statutaire et aérée.';
  var interactionRhythm = typeof cd.interactionRhythm === 'string' ? cd.interactionRhythm.trim() : 'Navigation douce et contemplative.';

  // Architecture
  var arch = rawConcept.architecture || {};
  var pages = Array.isArray(arch.pages) && arch.pages.length > 0
    ? arch.pages.filter(function (p) { return typeof p === 'string'; }).slice(0, 8)
    : ['Accueil', 'Programme', 'Invités', 'Souvenirs', 'Guide'];

  var navigation = Array.isArray(arch.navigation) && arch.navigation.length > 0
    ? arch.navigation.filter(function (n) { return typeof n === 'string'; }).slice(0, 5)
    : pages.slice(0, 4);

  // Recommended Modules
  var rawModules = Array.isArray(rawConcept.recommendedModules) ? rawConcept.recommendedModules : [];
  var validatedModules = [];

  rawModules.forEach(function (m) {
    var mId = typeof m === 'string' ? m : (m && m.id ? m.id : null);
    var reason = (m && typeof m.reason === 'string') ? m.reason : 'Recommandé pour cette direction créative.';
    if (mId && VALID_MODULE_IDS.indexOf(mId) !== -1 && validatedModules.every(function (v) { return v.id !== mId; })) {
      validatedModules.push({ id: mId, reason: reason });
    }
  });

  if (validatedModules.length === 0) {
    // Fallback baseline modules
    var fallbacks = eventType === 'ceremonie'
      ? ['program', 'tributes', 'testimonials', 'gallery', 'music']
      : ['timeline', 'rsvp', 'guests', 'music', 'gallery', 'guestbook'];

    validatedModules = fallbacks.map(function (id) {
      return { id: id, reason: 'Module essentiel pour cette expérience.' };
    });
  }

  // Signature Interaction
  var sig = rawConcept.signatureInteraction || {};
  var signatureInteraction = {
    name: typeof sig.name === 'string' && sig.name.trim() ? sig.name.trim() : 'Dispositif Signature',
    description: typeof sig.description === 'string' && sig.description.trim() ? sig.description.trim() : 'Une interaction marquante qui transforme l\'événement en souvenir impérissable.'
  };

  var whyItFits = typeof rawConcept.whyItFits === 'string' && rawConcept.whyItFits.trim()
    ? rawConcept.whyItFits.trim()
    : 'Cette direction capture l\'essence de vos intentions avec élégance.';

  var confidence = typeof rawConcept.confidence === 'number' ? Math.min(1, Math.max(0, rawConcept.confidence)) : 0.9;

  return {
    id: id,
    name: name,
    tagline: tagline,
    summary: summary,
    metaphor: metaphor,
    creativeDirection: {
      atmosphere: atmosphere,
      keywords: keywords,
      artDirection: artDirection,
      visualLanguage: visualLanguage,
      typographicDirection: typographicDirection,
      interactionRhythm: interactionRhythm
    },
    architecture: {
      pages: pages,
      navigation: navigation
    },
    recommendedModules: validatedModules,
    signatureInteraction: signatureInteraction,
    whyItFits: whyItFits,
    confidence: confidence
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
    var structuredIntent = body.structuredIntent || {};
    var eventType = (structuredIntent.eventType && structuredIntent.eventType.value) ? structuredIntent.eventType.value : (body.eventType || 'mariage');
    var intentions = Array.isArray(structuredIntent.intentions) ? structuredIntent.intentions.map(function (i) { return i.value || i; }) : (body.intentions || []);
    var audience = (structuredIntent.audience && structuredIntent.audience.value) ? structuredIntent.audience.value : (body.audience || 'Mes proches');
    var signals = Array.isArray(structuredIntent.signals) ? structuredIntent.signals : [];
    var constraints = Array.isArray(structuredIntent.constraints) ? structuredIntent.constraints : [];
    var summary = structuredIntent.summary || body.summary || '';

    // Determine API Key
    var apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
    var apiBaseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';

    if (!apiKey) {
      return res.status(503).json({
        error: 'AI_KEY_NOT_CONFIGURED',
        message: 'Le service AIME CONCEPT n\'a pas encore de clé API configurée sur le serveur. Vous pouvez explorer les déclinaisons manuelles ou continuer avec le configurateur.'
      });
    }

    var systemPrompt = `Tu es AIME CONCEPT, le deuxième agent de conception du studio créatif BYAIME fondé par Matt Mez.
Ta mission est d'inventer exactement 3 DIRECTIONS CRÉATIVES FORTEMENT DIVERGENTES à partir d'une intention humaine validée.

RÈGLE ABSOLUE DE DIVERGENCE :
Les 3 propositions doivent explorer 3 territoires d'expériences radicalement distincts :
- Des métaphores directrices différentes (ex: une partition musicale vs une constellation spatiale vs un livre de souvenirs vs une scène de théâtre vs une capsule temporelle).
- Des atmosphères et directions artistiques distinctes (parmi : 'poetique', 'minimaliste', 'cinematique', 'vibrante', 'elegante', 'libre').
- Des interactions signatures mémorables différentes.
- Des sélections de modules adaptées.

Les modules recommandés DOIVENT IMPÉRATIVEMENT appartenir à cette liste :
['timeline', 'rsvp', 'guests', 'tables', 'music', 'gallery', 'guestbook', 'memories', 'providers', 'map', 'countdown', 'program', 'tributes', 'testimonials', 'audio', 'video', 'privateSpace', 'notifications', 'agenda', 'artists', 'tickets', 'donations', 'impact', 'contact']

Évite impérativement :
- Les noms clichés ("Votre moment", "Le plus beau jour", "Site de mariage").
- Les 3 propositions identiques avec juste des adjectifs différents.
- Le jargon technique abstrait ou commercial.

Format strict de retour JSON :
{
  "concepts": [
    {
      "id": "concept_01",
      "name": "Nom Poétique & Affirmé du Concept 1",
      "tagline": "Une phrase d'intention très courte.",
      "summary": "Description narrative du concept en 2-3 phrases.",
      "metaphor": { "name": "Nom de la métaphore", "description": "Explication de la métaphore directrice." },
      "creativeDirection": {
        "atmosphere": "poetique",
        "keywords": ["mot1", "mot2", "mot3"],
        "artDirection": "Description de l'univers visuel, des lumières et des matières.",
        "visualLanguage": "Langage visuel.",
        "typographicDirection": "Approche typographique.",
        "interactionRhythm": "Rythme des interactions."
      },
      "architecture": {
        "pages": ["Accueil", "Page 2", "Page 3", "Page 4"],
        "navigation": ["Accueil", "Page 2", "Page 3"]
      },
      "recommendedModules": [
        { "id": "timeline", "reason": "Pourquoi ce module est clé pour ce concept." },
        { "id": "music", "reason": "Rôle du module." }
      ],
      "signatureInteraction": {
        "name": "Nom de l'interaction signature",
        "description": "Description du geste interactif unique."
      },
      "whyItFits": "Pourquoi cette direction répond à l'intention exprimée.",
      "confidence": 0.95
    },
    { ... concept_02 ... },
    { ... concept_03 ... }
  ]
}`;

    var userContextPrompt = JSON.stringify({
      eventType: eventType,
      audience: audience,
      intentions: intentions,
      summary: summary,
      signals: signals,
      constraints: constraints
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
          { role: 'user', content: `Génère 3 directions créatives divergentes pour cette intention : ${userContextPrompt}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      var errData = await response.text();
      return res.status(502).json({
        error: 'AI_PROVIDER_ERROR',
        message: 'Le fournisseur IA a retourné une erreur lors de la génération des concepts.',
        details: errData
      });
    }

    var result = await response.json();
    var content = result.choices && result.choices[0] && result.choices[0].message
      ? result.choices[0].message.content
      : null;

    if (!content) {
      return res.status(502).json({ error: 'EMPTY_AI_RESPONSE', message: 'Réponse vide reçue de l\'agent AIME CONCEPT.' });
    }

    var parsedData = JSON.parse(content);
    var rawConcepts = Array.isArray(parsedData.concepts) ? parsedData.concepts : [];

    if (rawConcepts.length === 0) {
      return res.status(502).json({ error: 'INVALID_CONCEPTS_FORMAT', message: 'Aucun concept valide généré.' });
    }

    var validatedConcepts = rawConcepts.slice(0, 3).map(function (c, idx) {
      return sanitizeConceptProposal(c, idx, eventType);
    });

    return res.status(200).json({
      success: true,
      data: {
        concepts: validatedConcepts
      }
    });

  } catch (err) {
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: err.message || 'Une erreur interne est survenue.'
    });
  }
};
