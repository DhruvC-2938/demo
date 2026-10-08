/* ==========================================================================
   Teacher Cockpit & Pre-Class Radar Simulator
   Precision Teaching + 1-Click Presentation & Question Paper Generation
   ========================================================================== */

(function () {
  const btnGenerateDeck = document.getElementById('btnGenerateDeck');
  const slideDeckContainer = document.getElementById('slideDeckContainer');
  const slideContentBox = document.getElementById('slideContentBox');
  const currentSlideNum = document.getElementById('currentSlideNum');
  const btnPrevSlide = document.getElementById('btnPrevSlide');
  const btnNextSlide = document.getElementById('btnNextSlide');

  const SLIDES = [
    {
      title: 'Slide 1: The Water Reservoir Paradox',
      hook: 'Why does electricity need difference to exist?',
      bullets: [
        'A lake at 2,000m has massive potential energy, but zero kinetic flow until a gorge opens.',
        'Coulomb force established the tension; Potential Difference opens the sluice gate.',
        'Class Insight: 14 students confused why charge moves without friction.'
      ]
    },
    {
      title: 'Slide 2: Visualizing Electric Potential (V = W/q)',
      hook: 'Work done per unit charge moving against electrostatic field',
      bullets: [
        'Analogy: Lifting a 10kg weight against gravity requires sustained mechanical work.',
        'High potential (+) = Top of the mountain cliff.',
        'Low potential (-) = Valley floor.'
      ]
    },
    {
      title: 'Slide 3: Connecting to Tomorrow (Electric Current)',
      hook: 'I = dQ/dt: The rate at which the valley fills',
      bullets: [
        'Current is not a cause; it is the unavoidable consequence of a potential gradient.',
        'If V_A == V_B, current drops to absolute zero, regardless of wire thickness.',
        'Active Recall Prompt: "What happens to the current in your iPhone cable if both ends equalize?"'
      ]
    }
  ];

  let currentSlideIdx = 0;

  function renderSlide(idx) {
    if (!slideContentBox || !SLIDES[idx]) return;
    const slide = SLIDES[idx];
    slideContentBox.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #64748b; margin-bottom: 6px;">
        TOPIC: POTENTIAL GRADIENTS & OHMIC FLOW
      </div>
      <h4 style="font-size: 1.25rem; font-weight: 700; color: #090d16; margin-bottom: 8px;">${slide.title}</h4>
      <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 14px; font-weight: 500;"><em>${slide.hook}</em></p>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
        ${slide.bullets.map(b => `<li style="font-size: 0.88rem; color: var(--text-secondary); display: flex; gap: 8px;"><span style="color: #090d16;">&bull;</span> ${b}</li>`).join('')}
      </ul>
    `;
    if (currentSlideNum) {
      currentSlideNum.textContent = `Slide ${idx + 1} of ${SLIDES.length}`;
    }
    if (window.soundEngine) {
      window.soundEngine.playClick();
    }
  }

  if (btnGenerateDeck) {
    btnGenerateDeck.addEventListener('click', () => {
      btnGenerateDeck.textContent = 'Generating 3-Slide Precision Deck...';
      btnGenerateDeck.disabled = true;

      setTimeout(() => {
        btnGenerateDeck.textContent = 'Deck Generated in 0.8s';
        btnGenerateDeck.disabled = false;
        if (slideDeckContainer) {
          slideDeckContainer.style.display = 'block';
        }
        currentSlideIdx = 0;
        renderSlide(0);
        if (window.soundEngine) {
          window.soundEngine.playSuccess();
        }
      }, 700);
    });
  }

  if (btnPrevSlide) {
    btnPrevSlide.addEventListener('click', () => {
      if (currentSlideIdx > 0) {
        currentSlideIdx--;
        renderSlide(currentSlideIdx);
      }
    });
  }

  if (btnNextSlide) {
    btnNextSlide.addEventListener('click', () => {
      if (currentSlideIdx < SLIDES.length - 1) {
        currentSlideIdx++;
        renderSlide(currentSlideIdx);
      }
    });
  }

  // Question Paper Difficulty Calibration Slider
  const diffSlider = document.getElementById('difficultySlider');
  const diffLabel = document.getElementById('diffDistributionLabel');

  if (diffSlider && diffLabel) {
    diffSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      let easy = Math.max(10, 60 - Math.floor(val * 0.5));
      let hard = Math.min(50, Math.floor(val * 0.4) + 10);
      let med = 100 - easy - hard;

      diffLabel.textContent = `Easy: ${easy}% | Medium: ${med}% | Hard: ${hard}%`;
    });
  }
})();
