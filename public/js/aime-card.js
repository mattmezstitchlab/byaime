// ===== BYAIME — AIME CARD : Carte Universelle Numérique (v1.0) =====
// Autonomous Profile & Non-Monetary Contribution Ecosystem Module

(function () {
  'use strict';

  var CARD_STORAGE_KEY = 'byaime_card_model_v1';

  var defaultCardModel = {
    id: 'aime_card_matt_mez',
    profile: {
      firstName: 'Matt',
      lastName: 'Mez',
      role: 'Concepteur · Musicien · Directeur artistique',
      avatar: '/img/matt-mez.webp',
      territory: 'Paris & Territoires créatifs',
      skills: ['Design d\'émotion', 'Musique & Sound Design', 'UX/UI', 'Création Numérique'],
      transmission: ['Créativité', 'Design', 'Musique', 'Artisanat du Code'],
      bring: ['Compétences créatives', 'Écoute humaine', 'Prototypage rapide', 'Ateliers ouverts']
    },
    contribution: {
      total: 284,
      categories: {
        entraide: 73,
        transmission: 42,
        ecologie: 31,
        matiere: 28,
        lienSocial: 64,
        territoire: 46
      },
      history: [
        { id: 'c_01', date: '2026-08-20', category: 'transmission', categoryLabel: 'Transmission', description: 'Atelier d\'initiation aux interfaces poétiques pour un collectif de jeunes artistes', author: 'Matt Mez', status: 'verified', timestamp: '2026-08-20T14:30:00Z' },
        { id: 'c_02', date: '2026-08-15', category: 'entraide', categoryLabel: 'Entraide', description: 'Aide au montage technique et scénographique d\'une exposition associative', author: 'Matt Mez', status: 'verified', timestamp: '2026-08-15T18:00:00Z' },
        { id: 'c_03', date: '2026-08-05', category: 'lienSocial', categoryLabel: 'Lien Social', description: 'Organisation d\'un cercle d\'écoute et d\'échange mémoriel intergénérationnel', author: 'Matt Mez', status: 'verified', timestamp: '2026-08-05T19:00:00Z' },
        { id: 'c_04', date: '2026-07-28', category: 'territoire', categoryLabel: 'Territoire', description: 'Médiation numérique locale pour faciliter l\'accès aux outils de mémoire citoyenne', author: 'Matt Mez', status: 'verified', timestamp: '2026-07-28T16:00:00Z' }
      ]
    },
    availability: [
      'Je peux aider',
      'Je peux transmettre',
      'Je peux réparer',
      'Je peux partager',
      'Je peux accompagner',
      'Je peux former',
      'Je peux concevoir'
    ],
    needs: [
      'Formation continue & Recherche',
      'Matériel technique & d\'art',
      'Mobilité douce',
      'Partenaires créatifs',
      'Accompagnement & Partage'
    ],
    privacy: {
      publicProfile: true,
      publicContribution: true,
      privateNeeds: true
    },
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: new Date().toISOString()
  };

  // LocalStorage Helper
  function loadCardModel() {
    try {
      var raw = localStorage.getItem(CARD_STORAGE_KEY);
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(defaultCardModel));
    } catch (e) {
      return JSON.parse(JSON.stringify(defaultCardModel));
    }
  }

  function saveCardModel(model) {
    try {
      localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(model));
    } catch (e) {}
  }

  var currentModel = loadCardModel();

  // UI Controller for AIME CARD page (/card)
  function initAimeCardUI() {
    var cardInner = document.getElementById('aime-card-inner');
    var flipBtn = document.getElementById('btn-flip-card');
    var flipBackBtn = document.getElementById('btn-flip-card-back');
    var flipHint = document.getElementById('card-flip-hint');
    var cardWrap = document.getElementById('aime-card-3d-wrap');

    var isFlipped = false;
    var hasInteracted = false;

    function flipCard() {
      if (!cardInner) return;
      isFlipped = !isFlipped;
      cardInner.classList.toggle('is-flipped', isFlipped);

      if (!hasInteracted && flipHint) {
        hasInteracted = true;
        flipHint.style.opacity = '0';
        setTimeout(function () { flipHint.style.display = 'none'; }, 300);
      }

      if (window.trackBYAIME) {
        window.trackBYAIME('aime_card_flipped', { face: isFlipped ? 'verso' : 'recto' });
      }
    }

    if (cardInner) {
      cardInner.addEventListener('click', function (e) {
        // Prevent flip if clicking a button or modal trigger inside
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;
        flipCard();
      });

      // Keyboard accessibility
      cardInner.setAttribute('tabindex', '0');
      cardInner.setAttribute('role', 'button');
      cardInner.setAttribute('aria-label', 'Carte Universelle AIME — Cliquez ou appuyez sur Entrée pour retourner la carte.');
      cardInner.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          flipCard();
        }
      });
    }

    if (flipBtn) flipBtn.addEventListener('click', flipCard);
    if (flipBackBtn) flipBackBtn.addEventListener('click', flipCard);

    // Subtle 3D Mouse Parallax Tilt (Desktop only, respects prefers-reduced-motion)
    if (cardWrap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cardWrap.addEventListener('mousemove', function (e) {
        var rect = cardWrap.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -7;
        var rotateY = ((x - centerX) / centerX) * 7;

        var shineX = (x / rect.width) * 100;
        var shineY = (y / rect.height) * 100;

        cardWrap.style.setProperty('--mouse-x', shineX + '%');
        cardWrap.style.setProperty('--mouse-y', shineY + '%');

        if (!isFlipped) {
          cardInner.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        } else {
          cardInner.style.transform = 'rotateY(180deg) rotateX(' + rotateX + 'deg) rotateY(' + (-rotateY) + 'deg)';
        }
      });

      cardWrap.addEventListener('mouseleave', function () {
        if (!isFlipped) {
          cardInner.style.transform = 'rotateX(0deg) rotateY(0deg)';
        } else {
          cardInner.style.transform = 'rotateY(180deg)';
        }
      });
    }

    // Render Stats and Content
    updateCardDOM();

    // Modal Add Contribution
    var addContribForm = document.getElementById('form-add-contribution');
    var addContribDialog = document.getElementById('modal-add-contribution');
    var successToast = document.getElementById('toast-contribution-added');

    if (addContribForm) {
      addContribForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var catSelect = document.getElementById('contrib-category-select');
        var descInput = document.getElementById('contrib-description-input');
        var contextInput = document.getElementById('contrib-context-input');

        var category = catSelect ? catSelect.value : 'entraide';
        var description = descInput ? descInput.value.trim() : '';
        var context = contextInput ? contextInput.value.trim() : '';

        if (!description) {
          alert('Veuillez décrire l\'action ou la contribution réalisée.');
          if (descInput) descInput.focus();
          return;
        }

        var catLabels = {
          entraide: 'Entraide',
          transmission: 'Transmission',
          ecologie: 'Écologie',
          matiere: 'Matière',
          lienSocial: 'Lien Social',
          territoire: 'Territoire'
        };

        // Increment counts
        currentModel.contribution.total++;
        if (currentModel.contribution.categories[category] !== undefined) {
          currentModel.contribution.categories[category]++;
        } else {
          currentModel.contribution.categories[category] = 1;
        }

        var newEntry = {
          id: 'c_' + Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString().split('T')[0],
          category: category,
          categoryLabel: catLabels[category] || category,
          description: description + (context ? ' (' + context + ')' : ''),
          author: currentModel.profile.firstName + ' ' + currentModel.profile.lastName,
          status: 'verified',
          timestamp: new Date().toISOString()
        };

        if (!Array.isArray(currentModel.contribution.history)) {
          currentModel.contribution.history = [];
        }
        currentModel.contribution.history.unshift(newEntry);
        currentModel.updatedAt = new Date().toISOString();

        saveCardModel(currentModel);
        updateCardDOM();

        // Close modal
        if (addContribDialog) addContribDialog.close();
        addContribForm.reset();

        // Show Toast
        if (successToast) {
          successToast.classList.remove('hidden');
          setTimeout(function () {
            successToast.classList.add('hidden');
          }, 3500);
        }

        if (window.trackBYAIME) {
          window.trackBYAIME('aime_card_contribution_added', { category: category, total: currentModel.contribution.total });
        }
      });
    }

    // Reset Demo Model Button
    var resetBtn = document.getElementById('btn-reset-card-demo');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        currentModel = JSON.parse(JSON.stringify(defaultCardModel));
        saveCardModel(currentModel);
        updateCardDOM();
        alert('Données de démonstration réinitialisées avec succès.');
      });
    }

    if (window.trackBYAIME) {
      window.trackBYAIME('aime_card_viewed', {});
    }
  }

  // Update DOM Elements with currentModel
  function updateCardDOM() {
    var totalEl = document.getElementById('card-total-contributions');
    var countEntraide = document.getElementById('card-count-entraide');
    var countTransmission = document.getElementById('card-count-transmission');
    var countEcologie = document.getElementById('card-count-ecologie');
    var countMatiere = document.getElementById('card-count-matiere');
    var countLienSocial = document.getElementById('card-count-lien-social');
    var countTerritoire = document.getElementById('card-count-territoire');
    var historyContainer = document.getElementById('card-contribution-history');

    if (totalEl) totalEl.textContent = currentModel.contribution.total;
    if (countEntraide) countEntraide.textContent = currentModel.contribution.categories.entraide || 0;
    if (countTransmission) countTransmission.textContent = currentModel.contribution.categories.transmission || 0;
    if (countEcologie) countEcologie.textContent = currentModel.contribution.categories.ecologie || 0;
    if (countMatiere) countMatiere.textContent = currentModel.contribution.categories.matiere || 0;
    if (countLienSocial) countLienSocial.textContent = currentModel.contribution.categories.lienSocial || 0;
    if (countTerritoire) countTerritoire.textContent = currentModel.contribution.categories.territoire || 0;

    // Render Contribution History Feed
    if (historyContainer) {
      historyContainer.innerHTML = '';
      var historyList = Array.isArray(currentModel.contribution.history) ? currentModel.contribution.history : [];

      if (historyList.length === 0) {
        historyContainer.innerHTML = '<p class="text-xs text-muted-foreground italic">Aucune contribution enregistrée pour le moment.</p>';
      } else {
        historyList.slice(0, 5).forEach(function (item) {
          var row = document.createElement('div');
          row.className = 'p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3 text-xs';
          row.innerHTML = '<div class="space-y-0.5">' +
            '<div class="flex items-center gap-2">' +
            '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-semibold">' + (item.categoryLabel || item.category) + '</span>' +
            '<span class="text-[10px] text-muted-foreground font-mono">' + item.date + '</span>' +
            '</div>' +
            '<p class="text-gray-200 mt-1">' + item.description + '</p>' +
            '</div>' +
            '<span class="text-[10px] text-emerald-400 font-mono flex items-center gap-1 flex-shrink-0">' + (window.AIME_Icons ? window.AIME_Icons.verified : '') + ' Validée</span>';
          historyContainer.appendChild(row);
        });
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('aime-card-inner')) {
      initAimeCardUI();
    }
  });

  // Global Export
  window.AIME_Card = {
    getModel: function () { return currentModel; },
    setModel: function (m) { currentModel = m; saveCardModel(m); updateCardDOM(); },
    resetDemo: function () { currentModel = JSON.parse(JSON.stringify(defaultCardModel)); saveCardModel(currentModel); updateCardDOM(); }
  };

})();
