// ===== Vercel Serverless Function: /api/aime-intent =====
// AIME INTENT — Premier Agent de Conception d'Expériences BYAIME
// Transforms free-form human text into a validated StructuredIntent object.

const ALLOWED_EVENT_TYPES = [
  'mariage', 'ceremonie', 'anniversaire', 'evenement',
  'festival', 'artistique', 'association', 'professionnel',
  'autre', 'indecis'
];

const ALLOWED_AUDIENCES = [
  'Moi', 'Ma famille', 'Mes proches', 'Une communauté',
  'Une association', 'Une entreprise', 'Un public', 'Autre'
];

const ALLOWED_INTENTIONS = [
  'Organiser', 'Inviter', 'Partager', 'Rassembler',
  'Émouvoir', 'Informer', 'Créer des souvenirs', 'Faire participer',
  'Raconter une histoire', 'Coordonner', 'Créer une expérience', 'Autre'
];

const ALLOWED_ATMOSPHERES = [
  'poetique', 'minimaliste', 'cinematique',
  'vibrante', 'elegante', 'libre'
];

const ALLOWED_LEVELS = [
  'minimal', 'interactif', 'immersif', 'indecis'
];

function normalizeValue(val, allowedList, defaultVal) {
  if (!val || typeof val !== 'string') return defaultVal;
  var normalized = val.trim().toLowerCase();
  for (var i = 0; i < allowedList.length; i++) {
    if (allowedList[i].toLowerCase() === normalized) {
      return allowedList[i];
    }
  }
  return defaultVal;
}

function validateAndSanitizeStructuredIntent(data, rawText) {
  if (!data || typeof data !== 'object') {
    throw new Error('Réponse invalide du modèle');
  }

  var summary = typeof data.summary === 'string' && data.summary.trim()
    ? data.summary.trim()
    : 'Projet d\'expérience numérique sur mesure.';

  // Event Type
  var eventVal = (data.eventType && typeof data.eventType.value === 'string') ? data.eventType.value : (data.eventType || 'autre');
  var eventConfidence = (data.eventType && typeof data.eventType.confidence === 'number') ? Math.min(1, Math.max(0, data.eventType.confidence)) : 0.8;
  var validatedEventType = normalizeValue(eventVal, ALLOWED_EVENT_TYPES, 'autre');

  // Audience
  var audVal = (data.audience && typeof data.audience.value === 'string') ? data.audience.value : (data.audience || 'Mes proches');
  var audConfidence = (data.audience && typeof data.audience.confidence === 'number') ? Math.min(1, Math.max(0, data.audience.confidence)) : 0.8;
  var validatedAudience = normalizeValue(audVal, ALLOWED_AUDIENCES, 'Mes proches');

  // Intentions
  var rawIntentions = Array.isArray(data.intentions) ? data.intentions : [];
  var validatedIntentions = [];
  rawIntentions.forEach(function (item) {
    var val = (typeof item === 'string') ? item : (item && item.value ? item.value : null);
    var conf = (item && typeof item.confidence === 'number') ? Math.min(1, Math.max(0, item.confidence)) : 0.85;
    if (val) {
      var matched = normalizeValue(val, ALLOWED_INTENTIONS, null);
      if (matched && validatedIntentions.every(function (v) { return v.value !== matched; })) {
        validatedIntentions.push({ value: matched, confidence: conf });
      }
    }
  });

  if (validatedIntentions.length === 0) {
    validatedIntentions = [
      { value: 'Organiser', confidence: 0.8 },
      { value: 'Partager', confidence: 0.8 }
    ];
  }

  // Experience
  var expAtmosphere = data.experience && data.experience.atmosphere ? data.experience.atmosphere : 'poetique';
  var expLevel = data.experience && data.experience.level ? data.experience.level : 'interactif';

  var validatedAtmosphere = normalizeValue(expAtmosphere, ALLOWED_ATMOSPHERES, 'poetique');
  var validatedLevel = normalizeValue(expLevel, ALLOWED_LEVELS, 'interactif');

  // Signals & Constraints
  var signals = Array.isArray(data.signals)
    ? data.signals.filter(function (s) { return typeof s === 'string'; }).slice(0, 6)
    : [];

  var constraints = Array.isArray(data.constraints)
    ? data.constraints.filter(function (c) { return typeof c === 'string'; }).slice(0, 6)
    : [];

  // Missing information questions
  var missingInformation = [];
  if (Array.isArray(data.missingInformation)) {
    data.missingInformation.forEach(function (q) {
      if (q && typeof q.question === 'string') {
        missingInformation.push({
          field: typeof q.field === 'string' ? q.field : 'general',
          question: q.question.trim()
        });
      }
    });
  }

  return {
    summary: summary,
    eventType: {
      value: validatedEventType,
      confidence: eventConfidence
    },
    audience: {
      value: validatedAudience,
      confidence: audConfidence
    },
    intentions: validatedIntentions,
    experience: {
      atmosphere: validatedAtmosphere,
      level: validatedLevel
    },
    signals: signals,
    constraints: constraints,
    missingInformation: missingInformation.slice(0, 4),
    rawIntent: rawText
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
    var rawText = (body.text || '').trim();

    if (!rawText) {
      return res.status(400).json({ error: 'EMPTY_TEXT', message: 'Veuillez décrire votre projet ou votre intention.' });
    }

    if (rawText.length > 3000) {
      return res.status(400).json({ error: 'TEXT_TOO_LONG', message: 'Le texte est trop volumineux (maximum 3 000 caractères).' });
    }

    // Determine API Key from Server Environment
    var apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
    var apiBaseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';

    if (!apiKey) {
      // Return clear, honest status that server API key is not configured
      return res.status(503).json({
        error: 'AI_KEY_NOT_CONFIGURED',
        message: 'Le service AIME INTENT n\'a pas encore de clé API configurée sur le serveur. Vous pouvez utiliser le configurateur manuel ou réessayer plus tard.'
      });
    }

    var systemPrompt = `Tu es AIME INTENT, le premier agent de conception du studio créatif BYAIME fondé par Matt Mez.
Ta mission est d'analyser le texte libre d'un utilisateur et d'en extraire son intention structurée sous format JSON strict.

Tu dois impérativement respecter ces listes de valeurs autorisées :
- eventType.value : ['mariage', 'ceremonie', 'anniversaire', 'evenement', 'festival', 'artistique', 'association', 'professionnel', 'autre', 'indecis']
- audience.value : ['Moi', 'Ma famille', 'Mes proches', 'Une communauté', 'Une association', 'Une entreprise', 'Un public', 'Autre']
- intentions[].value : ['Organiser', 'Inviter', 'Partager', 'Rassembler', 'Émouvoir', 'Informer', 'Créer des souvenirs', 'Faire participer', 'Raconter une histoire', 'Coordonner', 'Créer une expérience', 'Autre']
- experience.atmosphere : ['poetique', 'minimaliste', 'cinematique', 'vibrante', 'elegante', 'libre']
- experience.level : ['minimal', 'interactif', 'immersif', 'indecis']

Retourne UNIQUEMENT un objet JSON valide conforme à cette structure :
{
  "summary": "Résumé bienveillant et inspirant de ce que l'utilisateur souhaite créer (1 à 2 phrases).",
  "eventType": { "value": "mariage", "confidence": 0.95 },
  "audience": { "value": "Mes proches", "confidence": 0.9 },
  "intentions": [
    { "value": "Partager", "confidence": 0.9 },
    { "value": "Créer des souvenirs", "confidence": 0.95 }
  ],
  "experience": {
    "atmosphere": "poetique",
    "level": "interactif"
  },
  "signals": ["élément ou mot clé clé détecté 1", "élément 2"],
  "constraints": ["contrainte ou particularité détectée 1"],
  "missingInformation": [
    { "field": "eventDate", "question": "À quelle date ou période imaginez-vous cet événement ?" }
  ]
}`;

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
          { role: 'user', content: rawText }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2
      })
    });

    if (!response.ok) {
      var errData = await response.text();
      return res.status(502).json({
        error: 'AI_PROVIDER_ERROR',
        message: 'Le fournisseur IA a retourné une erreur.',
        details: errData
      });
    }

    var result = await response.json();
    var content = result.choices && result.choices[0] && result.choices[0].message
      ? result.choices[0].message.content
      : null;

    if (!content) {
      return res.status(502).json({ error: 'EMPTY_AI_RESPONSE', message: 'Réponse vide reçue de l\'agent IA.' });
    }

    var parsedData = JSON.parse(content);
    var validatedIntent = validateAndSanitizeStructuredIntent(parsedData, rawText);

    return res.status(200).json({
      success: true,
      data: validatedIntent
    });

  } catch (err) {
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: err.message || 'Une erreur interne est survenue.'
    });
  }
};
