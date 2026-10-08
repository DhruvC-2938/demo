/* ==========================================================================
   ALFR EduOS - 3D Knowledge Graph Video & Interactive 60fps Simulation Engine
   Living Curriculum Dependency Mesh with Soothing Pastel Color Palette
   ========================================================================== */

(function () {
  const canvas = document.getElementById('graphVideoCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const playBtn = document.getElementById('gvPlayBtn');
  const speedBtn = document.getElementById('gvSpeedBtn');
  const resetBtn = document.getElementById('gvResetBtn');
  const timelineProgress = document.getElementById('gvTimelineProgress');
  const timeDisplay = document.getElementById('gvTimeDisplay');
  const subjectBtns = document.querySelectorAll('.gv-subject-btn');
  const activeSubjectBadge = document.getElementById('gvActiveSubject');

  // Curated Soothing Pastel Color Swatches
  const PASTEL_PALETTE = {
    blue: { fill: '#dbeafe', stroke: '#3b82f6', text: '#1d4ed8', glow: 'rgba(59, 130, 246, 0.25)' },
    lavender: { fill: '#ede9fe', stroke: '#8b5cf6', text: '#6d28d9', glow: 'rgba(139, 92, 246, 0.25)' },
    sage: { fill: '#dcfce7', stroke: '#22c55e', text: '#15803d', glow: 'rgba(34, 197, 94, 0.25)' },
    peach: { fill: '#ffedd5', stroke: '#f97316', text: '#c2410c', glow: 'rgba(249, 115, 22, 0.25)' },
    rose: { fill: '#ffe4e6', stroke: '#f43f5e', text: '#be123c', glow: 'rgba(244, 63, 94, 0.25)' },
    amber: { fill: '#fef3c7', stroke: '#eab308', text: '#a16207', glow: 'rgba(234, 179, 8, 0.25)' },
    cyan: { fill: '#cffafe', stroke: '#06b6d4', text: '#0e7490', glow: 'rgba(6, 182, 212, 0.25)' }
  };

  // 3 Curricula Graph Models
  const GRAPHS = {
    physics: {
      name: 'PHYSICS: ELECTRICITY &rarr; OPTICS DEPENDENCY MESH',
      nodes: [
        { id: 0, name: 'Electric Charge', sub: 'Matter Polarity', x: -220, y: -40, z: -20, color: PASTEL_PALETTE.blue, radius: 18 },
        { id: 1, name: "Coulomb's Law", sub: 'Force Magnitude', x: -130, y: 70, z: 80, color: PASTEL_PALETTE.lavender, radius: 20 },
        { id: 2, name: 'Potential Diff.', sub: 'The Drive to Flow', x: -20, y: -70, z: -80, color: PASTEL_PALETTE.peach, radius: 24, isFocus: true },
        { id: 3, name: 'Electric Current', sub: 'Charge Kinetic Rate', x: 80, y: 50, z: 90, color: PASTEL_PALETTE.sage, radius: 22 },
        { id: 4, name: 'Magnetic Field', sub: 'Warped Space', x: 180, y: -60, z: -50, color: PASTEL_PALETTE.amber, radius: 20 },
        { id: 5, name: 'EM Induction', sub: 'Faraday & Maxwell', x: 260, y: 60, z: 60, color: PASTEL_PALETTE.cyan, radius: 22 },
        { id: 6, name: 'Wave Optics', sub: 'Light as EM Field', x: 340, y: -30, z: -10, color: PASTEL_PALETTE.rose, radius: 18 }
      ],
      links: [
        { from: 0, to: 1, label: 'governs force' },
        { from: 1, to: 2, label: 'stores energy' },
        { from: 2, to: 3, label: 'drives flow' },
        { from: 3, to: 4, label: 'induces field' },
        { from: 4, to: 5, label: 'mutual coupling' },
        { from: 5, to: 6, label: 'unifies wave' },
        { from: 0, to: 2, label: 'charge state' },
        { from: 2, to: 4, label: 'potential field' }
      ]
    },
    calculus: {
      name: 'CALCULUS: LIMITS &rarr; DIFFERENTIAL FORMS CONTINUUM',
      nodes: [
        { id: 0, name: 'Infinitesimal Limit', sub: 'The Epsilon-Delta Gate', x: -210, y: -50, z: -30, color: PASTEL_PALETTE.cyan, radius: 18 },
        { id: 1, name: 'Local Tangent Derivative', sub: 'Instantaneous Rate', x: -100, y: 60, z: 80, color: PASTEL_PALETTE.blue, radius: 22 },
        { id: 2, name: 'Fundamental Theorem', sub: 'Derivative = Integral Inv.', x: 0, y: -70, z: -70, color: PASTEL_PALETTE.lavender, radius: 25, isFocus: true },
        { id: 3, name: 'Riemann Integral Sum', sub: 'Accumulated Area', x: 100, y: 70, z: 80, color: PASTEL_PALETTE.sage, radius: 22 },
        { id: 4, name: 'Multivariable Gradient', sub: 'Vector Direction', x: 200, y: -50, z: -50, color: PASTEL_PALETTE.peach, radius: 20 },
        { id: 5, name: "Stokes' & Gauss' Theorem", sub: 'Manifold Boundaries', x: 300, y: 40, z: 40, color: PASTEL_PALETTE.rose, radius: 22 }
      ],
      links: [
        { from: 0, to: 1, label: 'defines slope' },
        { from: 1, to: 2, label: 'dual relation' },
        { from: 2, to: 3, label: 'inverts sum' },
        { from: 3, to: 4, label: 'dimensional jump' },
        { from: 4, to: 5, label: 'surface integral' },
        { from: 0, to: 3, label: 'finite limit' }
      ]
    },
    cs: {
      name: 'CS: NAND GATES &rarr; DISTRIBUTED CONSENSUS MESH',
      nodes: [
        { id: 0, name: 'NAND Silicon Gate', sub: 'Universal Boolean Logic', x: -220, y: -30, z: -10, color: PASTEL_PALETTE.peach, radius: 18 },
        { id: 1, name: 'ALU & CPU Register File', sub: 'Sequential Memory', x: -120, y: 70, z: 70, color: PASTEL_PALETTE.blue, radius: 21 },
        { id: 2, name: 'Virtual Memory & Paging', sub: 'OS Abstraction Layer', x: 0, y: -80, z: -80, color: PASTEL_PALETTE.lavender, radius: 24, isFocus: true },
        { id: 3, name: 'Thread Concurrency & Locks', sub: 'Deadlock Avoidance', x: 100, y: 60, z: 90, color: PASTEL_PALETTE.sage, radius: 22 },
        { id: 4, name: 'TCP Socket Pipelines', sub: 'Packet Ordering & ACK', x: 200, y: -60, z: -40, color: PASTEL_PALETTE.amber, radius: 20 },
        { id: 5, name: 'Raft & Paxos Consensus', sub: 'Split-Brain Byzantine Fault', x: 310, y: 40, z: 50, color: PASTEL_PALETTE.rose, radius: 22 }
      ],
      links: [
        { from: 0, to: 1, label: 'builds logic' },
        { from: 1, to: 2, label: 'hardware interface' },
        { from: 2, to: 3, label: 'memory space' },
        { from: 3, to: 4, label: 'network threads' },
        { from: 4, to: 5, label: 'node cluster' },
        { from: 1, to: 3, label: 'context switch' }
      ]
    }
  };

  let activeGraphKey = 'physics';
  let isPlaying = true;
  let playbackSpeed = 1.0;
  let yaw = 0.2;
  let pitch = 0.15;
  let yawSpeed = 0.005;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let hoveredNode = null;
  let animationTime = 0;

  // Flowing Particles along Links
  const particles = [];
  const PARTICLE_COUNT = 32;

  function initParticles() {
    particles.length = 0;
    const links = GRAPHS[activeGraphKey].links;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        linkIndex: Math.floor(Math.random() * links.length),
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        size: 2 + Math.random() * 2,
        alpha: 0.4 + Math.random() * 0.6
      });
    }
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 50);

  // Mouse / Drag Controls for 3D Camera
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging) {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      yaw += dx * 0.008;
      pitch = Math.max(-0.8, Math.min(0.8, pitch + dy * 0.008));
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }

    // Check node hover
    const nodes = GRAPHS[activeGraphKey].nodes;
    let found = null;
    const cw = rect.width;
    const ch = rect.height;

    nodes.forEach(n => {
      if (n.screenX && n.screenY) {
        const dist = Math.hypot(mouseX - n.screenX, mouseY - n.screenY);
        if (dist <= n.screenRadius + 8) {
          found = n;
        }
      }
    });

    hoveredNode = found;
    canvas.style.cursor = found ? 'pointer' : (isDragging ? 'grabbing' : 'grab');
  });

  // Touch Support for mobile
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  canvas.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastMouseX;
      const dy = e.touches[0].clientY - lastMouseY;
      yaw += dx * 0.008;
      pitch = Math.max(-0.8, Math.min(0.8, pitch + dy * 0.008));
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  // 3D Math Projection Functions
  function project(x, y, z, cw, ch) {
    // 1. Rotate around Y (Yaw)
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    // 2. Rotate around X (Pitch)
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);
    const y2 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;

    // 3. Perspective Projection
    const fov = 480;
    const cameraZ = 460;
    const distance = cameraZ + z2;
    const scale = fov / Math.max(distance, 50);

    return {
      x: cw / 2 + x1 * scale,
      y: ch / 2 + y2 * scale,
      scale: scale,
      depth: z2
    };
  }

  // Animation Loop
  function draw() {
    const rect = canvas.getBoundingClientRect();
    const cw = rect.width;
    const ch = rect.height;

    ctx.clearRect(0, 0, cw, ch);

    // Subtle background mesh grid
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.4)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < cw; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ch);
      ctx.stroke();
    }
    for (let y = 0; y < ch; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cw, y);
      ctx.stroke();
    }

    if (isPlaying) {
      yaw += yawSpeed * playbackSpeed;
      animationTime += 0.016 * playbackSpeed;

      // Update timeline scrubber
      if (timelineProgress) {
        const loopDuration = 40; // 40 seconds cycle
        const progressPct = ((animationTime % loopDuration) / loopDuration) * 100;
        timelineProgress.style.width = `${progressPct}%`;
      }
      if (timeDisplay) {
        const curSec = Math.floor(animationTime % 60);
        const curMin = Math.floor((animationTime / 60) % 60);
        timeDisplay.textContent = `${String(curMin).padStart(2, '0')}:${String(curSec).padStart(2, '0')} / 01:00`;
      }
    }

    const currentGraph = GRAPHS[activeGraphKey];
    const nodes = currentGraph.nodes;
    const links = currentGraph.links;

    // 1. Project all nodes to screen coordinates
    const projectedNodes = nodes.map(n => {
      const p = project(n.x, n.y, n.z, cw, ch);
      n.screenX = p.x;
      n.screenY = p.y;
      n.screenScale = p.scale;
      n.screenRadius = n.radius * p.scale;
      return { ...n, ...p };
    });

    // 2. Draw 3D Links & Curved Connection Filaments
    links.forEach(link => {
      const fromNode = projectedNodes[link.from];
      const toNode = projectedNodes[link.to];

      const isConnectedToHover = hoveredNode && (hoveredNode.id === link.from || hoveredNode.id === link.to);

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);

      // Curved Bezier filament
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2 - 18 * fromNode.scale;
      ctx.quadraticCurveTo(midX, midY, toNode.x, toNode.y);

      if (isConnectedToHover) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
        ctx.shadowBlur = 8;
      } else {
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.7)';
        ctx.lineWidth = Math.max(1, 1.4 * ((fromNode.scale + toNode.scale) / 2));
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // 3. Draw Animated Flowing Particles (Pulsing Energy along Links)
    if (isPlaying) {
      particles.forEach(pt => {
        pt.progress += pt.speed * playbackSpeed;
        if (pt.progress > 1) pt.progress = 0;

        const link = links[pt.linkIndex];
        if (!link) return;
        const fromNode = projectedNodes[link.from];
        const toNode = projectedNodes[link.to];

        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2 - 18 * fromNode.scale;

        // Quadratic Bezier interpolation point
        const t = pt.progress;
        const px = (1 - t) * (1 - t) * fromNode.x + 2 * (1 - t) * t * midX + t * t * toNode.x;
        const py = (1 - t) * (1 - t) * fromNode.y + 2 * (1 - t) * t * midY + t * t * toNode.y;

        ctx.beginPath();
        ctx.arc(px, py, pt.size * fromNode.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${pt.alpha})`;
        ctx.fill();
      });
    }

    // 4. Sort nodes by depth (draw farthest first for correct occlusion)
    const sortedNodes = [...projectedNodes].sort((a, b) => b.depth - a.depth);

    sortedNodes.forEach(node => {
      const isHovered = hoveredNode && hoveredNode.id === node.id;
      const r = isHovered ? node.screenRadius * 1.25 : node.screenRadius;

      // Soft Pastel Ambient Glow Halo
      ctx.beginPath();
      ctx.arc(node.x, node.y, r * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = node.color.glow;
      ctx.fill();

      // Outer Pastel Border Ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? '#ffffff' : node.color.fill;
      ctx.strokeStyle = isHovered ? '#090d16' : node.color.stroke;
      ctx.lineWidth = isHovered ? 2.5 : 1.8;
      ctx.shadowColor = node.color.glow;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner Solid Core Dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, r * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = node.color.stroke;
      ctx.fill();

      // Floating Concept Name Label
      const fontSize = Math.max(9, Math.round(11 * node.scale));
      ctx.font = `600 ${fontSize}px var(--font-sans)`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#090d16';

      // Soft label pill background for maximum legibility
      const labelText = node.name;
      const textMetrics = ctx.measureText(labelText);
      const textWidth = textMetrics.width;
      const pillHeight = fontSize + 6;
      const pillY = node.y + r + 6;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(node.x - textWidth / 2 - 6, pillY, textWidth + 12, pillHeight, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isHovered ? '#090d16' : '#1e293b';
      ctx.fillText(labelText, node.x, pillY + fontSize - 2);

      // Sub-label on hover or focus node
      if (isHovered || node.isFocus) {
        ctx.font = `500 ${Math.max(8, fontSize - 2)}px var(--font-mono)`;
        ctx.fillStyle = node.color.text;
        ctx.fillText(node.sub, node.x, pillY + pillHeight + 12);
      }
    });

    requestAnimationFrame(draw);
  }

  // Controls Event Listeners
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.innerHTML = isPlaying 
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: -1px;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause'
        : '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: -1px;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Play';
      playBtn.classList.toggle('active', isPlaying);
    });
  }

  if (speedBtn) {
    const speeds = [0.5, 1.0, 2.0];
    let sIdx = 1;
    speedBtn.addEventListener('click', () => {
      sIdx = (sIdx + 1) % speeds.length;
      playbackSpeed = speeds[sIdx];
      speedBtn.textContent = `${playbackSpeed.toFixed(1)}x`;
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      yaw = 0.2;
      pitch = 0.15;
    });
  }

  // Subject Switcher
  subjectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subjectBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.subject;
      if (GRAPHS[key]) {
        activeGraphKey = key;
        if (activeSubjectBadge) {
          activeSubjectBadge.innerHTML = GRAPHS[key].name;
        }
        initParticles();
      }
    });
  });

  // Initialize
  initParticles();
  requestAnimationFrame(draw);
})();
