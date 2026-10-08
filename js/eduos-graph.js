/* ==========================================================================
   EduOS Concept Chain Explorer & Structural Note Engine
   Interactive Dependency Graph + 3-Day Spaced Repetition Flashcards
   ========================================================================== */

(function () {
  const CHAINS = {
    physics: {
      title: 'Physics · Electricity to Optics',
      subtitle: 'A single unbroken story of logic from charge to telescopes',
      nodes: [
        {
          id: 'p1',
          name: 'Electric Charge',
          summary: 'Two charges, attraction, repulsion',
          status: 'understood',
          badge: 'Understood',
          question: 'What is charge and why does matter interact electrically?',
          logic: 'Matter has positive and negative charges. Like charges repel, opposites attract.',
          prior: 'Atomic structure (electrons and protons).',
          unlocks: "Coulomb's Law (calculating the exact force between charges).",
          diagram: 'Two spheres (+) and (-) with opposing force vectors.'
        },
        {
          id: 'p2',
          name: "Coulomb's Law",
          summary: 'Force between charges, the mathematical formula',
          status: 'understood',
          badge: 'Understood',
          question: 'How strong is the electrostatic force across distance?',
          logic: 'Force is directly proportional to charges, inversely to distance squared (F = k * q1 * q2 / r²).',
          prior: 'Electric Charge.',
          unlocks: 'Electric Potential (the energy stored when moving charges against this force).',
          diagram: 'Inverse-square force curve dropping with 1/r².'
        },
        {
          id: 'p3',
          name: 'Potential Difference',
          summary: 'Why charge moves — the reason current must exist',
          status: 'current',
          badge: 'You Are Here',
          question: 'Why does charge move? What makes electrons flow in one direction?',
          logic: 'Higher potential -> Lower potential. Charge flows like water from height. The difference drives the flow.',
          prior: "Coulomb's Law showed force between charges. Potential difference sustains that force as continuous movement.",
          unlocks: 'Electric current becomes inevitable — it is simply this movement given a name.',
          diagram: 'End A (High Potential) -> End B (Low Potential). Arrow showing electron movement.'
        },
        {
          id: 'p4',
          name: 'Electric Current',
          summary: 'What happens when potential difference exists',
          status: 'next',
          badge: 'Next Concept',
          question: 'How do we measure the rate of charge flow?',
          logic: 'Current (I = Q/t) is the quantity of charge passing a point per second.',
          prior: 'Potential Difference (which creates the drive to flow).',
          unlocks: 'Magnetic Field (because a moving charge warps the space around it).',
          diagram: 'Cylindrical conductor with moving charge carriers through cross-sectional area A.'
        },
        {
          id: 'p5',
          name: 'Magnetic Field',
          summary: 'What current does to the space around it',
          status: 'locked',
          badge: 'Unlocks Next',
          question: 'Why does a compass needle twitch near a live electric wire?',
          logic: 'Moving charges generate magnetic fields perpendicular to their direction of motion.',
          prior: 'Electric Current.',
          unlocks: 'Electromagnetic Induction (Faraday & Maxwell).',
          diagram: 'Concentric magnetic field circles around a straight current wire.'
        },
        {
          id: 'p6',
          name: 'Electromagnetic Waves & Optics',
          summary: 'Light is an EM wave — connecting electricity to vision',
          status: 'locked',
          badge: 'Future Horizon',
          question: 'What actually is light?',
          logic: 'Oscillating electric and magnetic fields propagating through space at 300,000 km/s.',
          prior: 'Electromagnetic Induction.',
          unlocks: 'Optics, reflection, refraction, lenses, and microscopes.',
          diagram: 'Self-propagating orthogonal E and B wave oscillations.'
        }
      ]
    },
    geography: {
      title: 'Geography & World History',
      subtitle: 'From shifting tectonic crust to the modern global geopolitical order',
      nodes: [
        {
          id: 'g1',
          name: 'Tectonic Plates',
          summary: "Earth's crust movement & mantle convection",
          status: 'understood',
          badge: 'Understood',
          question: 'Why is the earth surface not a static shell?',
          logic: 'Convection currents in the magma move continental and oceanic plates.',
          prior: 'Thermodynamics of Earth interior heat.',
          unlocks: 'Mountain formation (conical collisions rising from plate crunches).',
          diagram: 'Two crustal plates colliding, subduction zone and upward fold.'
        },
        {
          id: 'g2',
          name: 'Himalayas & Mountains Form',
          summary: 'Conical structures rise from Indian-Eurasian plate collision',
          status: 'understood',
          badge: 'Understood',
          question: 'Why do the highest mountains on Earth exist in Asia?',
          logic: 'The Indian tectonic plate crashed into Eurasia 50 million years ago, crumpling land upwards.',
          prior: 'Tectonic collision dynamics.',
          unlocks: 'Glaciers and perennial river systems (Ganga, Indus, Brahmaputra).',
          diagram: 'High altitude snowpack feeding descending meltwater streams.'
        },
        {
          id: 'g3',
          name: 'Perennial River Basins',
          summary: 'Water flows from height — human civilization becomes possible',
          status: 'current',
          badge: 'You Are Here',
          question: 'Why did human civilization NOT start in deserts or random plains?',
          logic: 'Rivers deposit rich alluvial silt, guarantee freshwater, and enable agricultural surplus.',
          prior: 'Mountain runoff and precipitation patterns.',
          unlocks: 'Ancient Civilizations & Urban Planning (Indus Valley, Mesopotamia).',
          diagram: 'River delta with fertile agricultural floodplains.'
        },
        {
          id: 'g4',
          name: 'Trade Routes & Maritime Ports',
          summary: 'Connecting river mouths to oceans — why Mumbai & Kolkata exist',
          status: 'next',
          badge: 'Next Concept',
          question: 'Why are the richest cities in the world almost all coastal river mouths?',
          logic: 'Water is 10x cheaper to transport goods over than overland wagons.',
          prior: 'River navigation and agricultural commodity surplus.',
          unlocks: 'Colonial Conquests and East India Company fortifications.',
          diagram: 'Port harbor connecting river trade barges to deep-sea ocean vessels.'
        },
        {
          id: 'g5',
          name: 'Colonial Borders & Partition 1947',
          summary: 'Borders drawn by colonizers dividing river systems',
          status: 'locked',
          badge: 'Unlocks Next',
          question: 'Why do water disputes define 21st century South Asian politics?',
          logic: 'The 1947 Radcliffe Line partitioned the Indus and Ganges river basins across political borders.',
          prior: 'Colonial economic extraction and port geography.',
          unlocks: 'Modern Geopolitics, treaties, and international law.',
          diagram: 'River basin bifurcated by sovereign international boundary line.'
        }
      ]
    }
  };

  const chainContainer = document.getElementById('conceptChainStepper');
  const chainTabs = document.querySelectorAll('.chain-tab-btn');
  const noteModal = document.getElementById('structuralNoteModal');
  const closeNoteBtn = document.getElementById('closeNoteModal');
  const noteConceptTitle = document.getElementById('noteConceptTitle');
  const noteQuestionText = document.getElementById('noteQuestionText');
  const noteLogicText = document.getElementById('noteLogicText');
  const notePriorText = document.getElementById('notePriorText');
  const noteUnlocksText = document.getElementById('noteUnlocksText');
  const noteDiagramText = document.getElementById('noteDiagramText');
  const btnTriggerFlashcard = document.getElementById('btnTriggerFlashcard');
  const flashcardBox = document.getElementById('flashcardBox');

  let currentSubject = 'physics';

  function renderChain(subjectKey) {
    if (!chainContainer || !CHAINS[subjectKey]) return;
    currentSubject = subjectKey;
    chainContainer.innerHTML = '';

    const chain = CHAINS[subjectKey];

    chain.nodes.forEach(node => {
      const card = document.createElement('div');
      card.className = `concept-node ${node.status === 'current' ? 'active' : ''}`;
      card.dataset.nodeId = node.id;

      card.innerHTML = `
        <div class="node-status-indicator ${node.status}" style="font-size: 0.72rem; font-weight: 700;">
          ${node.status === 'understood' ? 'DONE' : node.status === 'current' ? 'NOW' : node.status === 'next' ? 'NEXT' : 'LOCK'}
        </div>
        <div class="node-content">
          <div class="node-meta">
            <h4 class="node-title">${node.name}</h4>
            <span class="node-badge ${node.status}">${node.badge}</span>
          </div>
          <p class="node-desc">${node.summary}</p>
        </div>
        <button class="btn btn-glass" style="padding: 6px 14px; font-size: 0.8rem;">
          Structural Note &rarr;
        </button>
      `;

      card.addEventListener('click', () => {
        openNote(node);
      });

      chainContainer.appendChild(card);
    });
  }

  function openNote(node) {
    if (!noteModal) return;
    if (noteConceptTitle) noteConceptTitle.textContent = `${node.name} — Structural Note`;
    if (noteQuestionText) noteQuestionText.textContent = node.question;
    if (noteLogicText) noteLogicText.textContent = node.logic;
    if (notePriorText) notePriorText.textContent = node.prior;
    if (noteUnlocksText) noteUnlocksText.textContent = node.unlocks;
    if (noteDiagramText) noteDiagramText.textContent = node.diagram;

    if (flashcardBox) flashcardBox.style.display = 'none';

    noteModal.classList.add('open');
    if (window.soundEngine) {
      window.soundEngine.playChime(740, 0.15);
    }
  }

  if (closeNoteBtn) {
    closeNoteBtn.addEventListener('click', () => {
      noteModal.classList.remove('open');
    });
  }

  // Active Recall Flashcard Simulation
  if (btnTriggerFlashcard && flashcardBox) {
    btnTriggerFlashcard.addEventListener('click', () => {
      flashcardBox.style.display = 'block';
      flashcardBox.scrollIntoView({ behavior: 'smooth' });
      if (window.soundEngine) {
        window.soundEngine.playNotification();
      }
    });
  }

  // Flashcard Choice Selection
  window.selectFlashcardAnswer = function (btn, isCorrect) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.pinch-chip').forEach(c => c.style.pointerEvents = 'none');

    if (isCorrect) {
      btn.style.background = 'rgba(16, 185, 129, 0.15)';
      btn.style.borderColor = '#10b981';
      btn.style.color = '#065f46';
      document.getElementById('flashcardResultMsg').innerHTML = `
        <span style="color: #065f46; font-weight: 700;">Correct in 3.8s.</span> Active recall strength +25%. Next recall scheduled in 7 days.
      `;
      if (window.soundEngine) window.soundEngine.playSuccess();
    } else {
      btn.style.background = 'rgba(244, 63, 94, 0.15)';
      btn.style.borderColor = '#f43f5e';
      btn.style.color = '#9f1239';
      document.getElementById('flashcardResultMsg').innerHTML = `
        <span style="color: #9f1239; font-weight: 700;">Gap Detected.</span> Remember the water height analogy: if both reservoirs are level, zero water flows. Reviewing structural note...
      `;
      if (window.soundEngine) window.soundEngine.playClick();
    }
  };

  chainTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      chainTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderChain(tab.dataset.subject);
    });
  });

  renderChain('physics');
})();
