/* ==========================================================================
   The Pinch Engine Playground & Simulator
   "Marketing knowledge the way Zomato markets hunger"
   ========================================================================== */

(function () {
  const PINCH_PRESETS = {
    pubg: {
      category: 'Gaming & Esports',
      title: 'PUBG & Mobile Gaming',
      hookText: 'Did you know PUBG runs entirely on C++? The exact memory pointers moving your player are what navigate iPhone factory robots in Shenzhen right now.',
      curiosityAngle: 'The student who gave up on programming suddenly realizes their 500-hour gaming obsession is built on the exact data structures they failed in C++.',
      unlockedChain: [
        'C++ Pointers & Memory',
        'Game Loop Vectors',
        'Industrial Robotics logic',
        'Concurrency & Threads'
      ],
      whatsappTime: 'Wednesday 7:43 PM'
    },
    cricket: {
      category: 'Sports & Athletics',
      title: 'Cricket & Reverse Swing',
      hookText: "Why does Bumrah's 145 km/h yorker curve violently in the last 2 meters? It's not magic — it's boundary layer separation and differential air pressure.",
      curiosityAngle: 'Instead of memorizing fluid dynamics formulas from a textbook, the student watches the seam angle split laminar flow.',
      unlockedChain: [
        'Fluid Dynamics',
        "Bernoulli's Principle",
        'Boundary Layer Separation',
        'Aerodynamic Drag'
      ],
      whatsappTime: 'Saturday 4:15 PM'
    },
    f1: {
      category: 'Motorsport & Aerodynamics',
      title: 'Formula 1 Ground Effect',
      hookText: 'Why do F1 cars get sucked to the asphalt at 320 km/h with 4,000 kg of invisible downforce? Venturi tunnels creating low-pressure vacuums.',
      curiosityAngle: 'Connects the thrilling spectacle of Red Bull Racing straight into mechanical engineering fluid mechanics.',
      unlockedChain: [
        'Venturi Effect',
        'Pressure Differential',
        'Kinetic Energy Transfer',
        'Chassis Aerodynamics'
      ],
      whatsappTime: 'Sunday 2:20 PM'
    },
    spotify: {
      category: 'Music & Audio Production',
      title: 'Spotify & 808 Bass Drops',
      hookText: 'Why does a sub-bass kick rattle your ribcage while high-hats tickle your ear drum? Fourier Transforms dissecting complex sound waves into pure sine frequencies.',
      curiosityAngle: 'Connects hip-hop beat production and Ableton Live directly into calculus and wave physics.',
      unlockedChain: [
        'Wave Superposition',
        'Fourier Analysis',
        'Acoustic Resonance',
        'Signal Processing'
      ],
      whatsappTime: 'Friday 9:10 PM'
    },
    mumbai: {
      category: 'Geography & History',
      title: 'Mumbai & Tectonic Plates',
      hookText: 'Why does Mumbai exist where it does today? Tectonic plate collisions thrust the Himalayas up, carved river trade paths, and birthed the western ports of India.',
      curiosityAngle: 'History is not dates to memorize for exams. It is an unbroken chain of geology deciding where human power and money settle.',
      unlockedChain: [
        'Tectonic Collisions',
        'River Basin Geomorphology',
        'Ancient Maritime Trade',
        'Colonial Fortifications'
      ],
      whatsappTime: 'Tuesday 8:05 PM'
    },
    sneakers: {
      category: 'Fashion & Commerce',
      title: 'Travis Scott Jordans & StockX',
      hookText: 'Why did Travis Scott Jordan 1s jump 450% in 72 hours? Liquidity pools, artificial scarcity algorithms, and inelastic supply curves.',
      curiosityAngle: 'Makes microeconomics immediately visceral by analyzing high-frequency sneaker resale markets.',
      unlockedChain: [
        'Supply-Demand Elasticity',
        'Market Liquidity',
        'Speculative Bubbles',
        'Behavioral Economics'
      ],
      whatsappTime: 'Thursday 6:30 PM'
    }
  };

  const chipsContainer = document.getElementById('pinchChips');
  const pinchHookText = document.getElementById('pinchHookText');
  const pinchTimestamp = document.getElementById('pinchTimestamp');
  const curiosityExplainText = document.getElementById('curiosityExplainText');
  const unlockedChainList = document.getElementById('unlockedChainList');
  const btnCustomPinch = document.getElementById('btnCustomPinch');
  const customPinchInput = document.getElementById('customPinchInput');

  let currentKey = 'pubg';
  let typingTimeout = null;

  function typeText(element, text, speed = 18) {
    if (typingTimeout) clearTimeout(typingTimeout);
    element.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        typingTimeout = setTimeout(type, speed);
      }
    }
    type();
  }

  function renderPinch(data) {
    if (pinchHookText) {
      typeText(pinchHookText, data.hookText);
    }
    if (pinchTimestamp) {
      pinchTimestamp.textContent = data.whatsappTime;
    }
    if (curiosityExplainText) {
      curiosityExplainText.textContent = data.curiosityAngle;
    }
    if (unlockedChainList) {
      unlockedChainList.innerHTML = '';
      data.unlockedChain.forEach((node, idx) => {
        const pill = document.createElement('div');
        pill.className = 'chain-pill';
        pill.textContent = node;
        unlockedChainList.appendChild(pill);

        if (idx < data.unlockedChain.length - 1) {
          const arrow = document.createElement('span');
          arrow.className = 'chain-arrow';
          arrow.innerHTML = '&rarr;';
          unlockedChainList.appendChild(arrow);
        }
      });
    }

    if (window.soundEngine) {
      window.soundEngine.playNotification();
    }
  }

  // Populate chips
  if (chipsContainer) {
    Object.keys(PINCH_PRESETS).forEach(key => {
      const preset = PINCH_PRESETS[key];
      const chip = document.createElement('button');
      chip.className = `pinch-chip ${key === currentKey ? 'active' : ''}`;
      chip.textContent = preset.title;
      chip.dataset.key = key;

      chip.addEventListener('click', () => {
        document.querySelectorAll('.pinch-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentKey = key;
        renderPinch(PINCH_PRESETS[key]);
      });

      chipsContainer.appendChild(chip);
    });
  }

  // Initial render
  if (PINCH_PRESETS[currentKey]) {
    renderPinch(PINCH_PRESETS[currentKey]);
  }

  // Custom Pinch Generator
  if (btnCustomPinch && customPinchInput) {
    btnCustomPinch.addEventListener('click', () => {
      const query = customPinchInput.value.trim();
      if (!query) return;

      const customData = {
        category: 'Dynamic Curiosity Hook',
        title: query,
        hookText: `Curiosity connection generated: How ${query} relies fundamentally on the principles of logic gates, energy equilibrium, and thermodynamic entropy.`,
        curiosityAngle: `The AI detects the student's unique interest in "${query}" and automatically maps a bridge into the active semester syllabus without feeling like school.`,
        unlockedChain: [
          query,
          'Underlying First Principles',
          'Academic Syllabus Node',
          'Real-World Application'
        ],
        whatsappTime: 'Right Now'
      };

      document.querySelectorAll('.pinch-chip').forEach(c => c.classList.remove('active'));
      renderPinch(customData);
      customPinchInput.value = '';
    });
  }
})();
