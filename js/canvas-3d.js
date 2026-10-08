/* ==========================================================================
   3D Knowledge Constellation & Neural Graph Engine
   Custom Canvas 3D Perspective Projection with Orbital Physics
   ========================================================================== */

(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;

  // 3D Nodes representing the EduOS Living Knowledge Graph
  const nodes = [
    { id: 'charge', label: 'Electric Charge', category: 'physics', x: -140, y: -90, z: -40, color: '#38bdf8' },
    { id: 'coulomb', label: "Coulomb's Law", category: 'physics', x: -80, y: -40, z: 20, color: '#38bdf8' },
    { id: 'potential', label: 'Potential Difference', category: 'physics', x: 0, y: -10, z: 80, color: '#c084fc', highlight: true },
    { id: 'current', label: 'Electric Current', category: 'physics', x: 90, y: 30, z: 10, color: '#818cf8' },
    { id: 'magnetic', label: 'Magnetic Field', category: 'physics', x: 150, y: -50, z: -60, color: '#38bdf8' },
    { id: 'induction', label: 'EM Induction', category: 'physics', x: 190, y: 40, z: -100, color: '#34d399' },
    { id: 'optics', label: 'Optics & Vision', category: 'physics', x: 230, y: 110, z: -50, color: '#f43f5e' },
    
    // Cross-Domain Curiosity Connections (The Pinch Engine links)
    { id: 'cpp', label: 'C++ & Logic', category: 'tech', x: -120, y: 90, z: 50, color: '#a78bfa' },
    { id: 'pubg', label: 'PUBG Engine', category: 'pinch', x: -190, y: 140, z: 10, color: '#fb923c' },
    { id: 'tectonics', label: 'Tectonic Plates', category: 'geo', x: -60, y: 130, z: -90, color: '#facc15' },
    { id: 'rivers', label: 'River Valleys', category: 'geo', x: 30, y: 140, z: -40, color: '#38bdf8' },
    { id: 'civilization', label: 'Civilizations', category: 'history', x: 110, y: 160, z: 30, color: '#e879f9' }
  ];

  // Dependency Edges (Parent -> Child)
  const edges = [
    ['charge', 'coulomb'],
    ['coulomb', 'potential'],
    ['potential', 'current'],
    ['current', 'magnetic'],
    ['magnetic', 'induction'],
    ['induction', 'optics'],
    ['cpp', 'pubg'],
    ['potential', 'cpp'], // Cross-domain curiosity bridge
    ['tectonics', 'rivers'],
    ['rivers', 'civilization'],
    ['potential', 'rivers'] // Water height analogy bridge!
  ];

  // Floating ambient cyber particles
  const particles = [];
  const PARTICLE_COUNT = 90;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 600,
      z: (Math.random() - 0.5) * 600,
      size: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      speedZ: (Math.random() - 0.5) * 0.4
    });
  }

  // Laser pulses along edges
  const pulses = [];
  edges.forEach((edge, idx) => {
    pulses.push({
      fromId: edge[0],
      toId: edge[1],
      progress: Math.random(),
      speed: 0.006 + Math.random() * 0.007
    });
  });

  // Camera & Orbit State
  let rotX = 0.2;
  let rotY = -0.3;
  let targetRotX = 0.2;
  let targetRotY = -0.3;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let hoveredNode = null;
  const fov = 420;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  window.addEventListener('resize', resize);
  resize();

  // Mouse / Touch Orbit Interaction
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = e.clientX - lastMouseX;
      const deltaY = e.clientY - lastMouseY;
      targetRotY += deltaX * 0.006;
      targetRotX += deltaY * 0.006;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    } else {
      // Check node hover
      let closestNode = null;
      let minDistance = 24;

      nodes.forEach(node => {
        if (node.screenX !== undefined && node.screenY !== undefined) {
          const dx = mouseX - node.screenX;
          const dy = mouseY - node.screenY;
          const dist = Math.hypot(dx, dy);
          if (dist < minDistance) {
            closestNode = node;
            minDistance = dist;
          }
        }
      });

      if (closestNode !== hoveredNode) {
        hoveredNode = closestNode;
        if (hoveredNode && window.soundEngine) {
          window.soundEngine.playClick();
        }
      }
    }
  });

  // Touch Support
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - lastMouseX;
      const deltaY = e.touches[0].clientY - lastMouseY;
      targetRotY += deltaX * 0.007;
      targetRotX += deltaY * 0.007;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // 3D Coordinate Transform Helper
  function project(x, y, z) {
    // Rotate Y
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    let x1 = x * cosY - z * sinY;
    let z1 = z * cosY + x * sinY;

    // Rotate X
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    let y2 = y * cosX - z1 * sinX;
    let z2 = z1 * cosX + y * sinX;

    // Perspective Projection
    const distance = 460;
    const factor = fov / (distance + z2);
    const screenX = width / 2 + x1 * factor;
    const screenY = height / 2 + y2 * factor;

    return { screenX, screenY, factor, depth: z2 };
  }

  // Animation Loop
  function render() {
    // Smooth camera inertia & idle gentle drift
    if (!isDragging) {
      targetRotY += 0.0025;
      targetRotX = Math.sin(Date.now() * 0.0008) * 0.12 + 0.15;
    }
    rotX += (targetRotX - rotX) * 0.08;
    rotY += (targetRotY - rotY) * 0.08;

    ctx.clearRect(0, 0, width, height);

    // Draw ambient starfield
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.z += p.speedZ;
      if (p.x > 300) p.x = -300;
      if (p.x < -300) p.x = 300;
      if (p.y > 300) p.y = -300;
      if (p.y < -300) p.y = 300;
      if (p.z > 300) p.z = -300;
      if (p.z < -300) p.z = 300;

      const proj = project(p.x, p.y, p.z);
      if (proj.depth > -350) {
        const alpha = Math.max(0.1, (proj.depth + 350) / 700 * 0.45);
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.beginPath();
        ctx.arc(proj.screenX, proj.screenY, p.size * proj.factor * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Project all nodes
    const nodeMap = {};
    nodes.forEach(node => {
      const proj = project(node.x, node.y, node.z);
      node.screenX = proj.screenX;
      node.screenY = proj.screenY;
      node.factor = proj.factor;
      node.depth = proj.depth;
      nodeMap[node.id] = node;
    });

    // Draw Dependency Edges
    edges.forEach(([fromId, toId]) => {
      const n1 = nodeMap[fromId];
      const n2 = nodeMap[toId];
      if (!n1 || !n2) return;

      const avgDepth = (n1.depth + n2.depth) / 2;
      const alpha = Math.max(0.15, Math.min(0.75, (avgDepth + 300) / 600));

      ctx.beginPath();
      ctx.moveTo(n1.screenX, n1.screenY);
      ctx.lineTo(n2.screenX, n2.screenY);
      ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.55})`;
      ctx.lineWidth = Math.max(1, 2 * (n1.factor + n2.factor) / 2);
      ctx.stroke();
    });

    // Draw traveling laser pulses
    pulses.forEach(pulse => {
      const n1 = nodeMap[pulse.fromId];
      const n2 = nodeMap[pulse.toId];
      if (!n1 || !n2) return;

      pulse.progress += pulse.speed;
      if (pulse.progress > 1) pulse.progress = 0;

      const px = n1.screenX + (n2.screenX - n1.screenX) * pulse.progress;
      const py = n1.screenY + (n2.screenY - n1.screenY) * pulse.progress;
      const factor = (n1.factor + n2.factor) / 2;

      ctx.beginPath();
      ctx.arc(px, py, 3.5 * factor, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Sort nodes by depth for correct painter's algorithm
    const sortedNodes = [...nodes].sort((a, b) => b.depth - a.depth);

    // Draw 3D Concept Nodes
    sortedNodes.forEach(node => {
      const isHovered = hoveredNode === node;
      const radius = (node.highlight ? 9 : 6.5) * node.factor * (isHovered ? 1.5 : 1);
      const alpha = Math.max(0.3, Math.min(1, (node.depth + 300) / 550));

      // Outer Glow Halo
      ctx.beginPath();
      ctx.arc(node.screenX, node.screenY, radius * 2.4, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(
        node.screenX, node.screenY, radius * 0.5,
        node.screenX, node.screenY, radius * 2.4
      );
      grad.addColorStop(0, `${node.color}${Math.floor(alpha * 180).toString(16).padStart(2, '0')}`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Node Sphere Body
      ctx.beginPath();
      ctx.arc(node.screenX, node.screenY, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = isHovered ? 24 : 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner Core Specular Highlight
      ctx.beginPath();
      ctx.arc(node.screenX - radius * 0.3, node.screenY - radius * 0.3, radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Node Label
      const fontSize = Math.max(10, Math.min(14, 12 * node.factor));
      ctx.font = `${node.highlight || isHovered ? '700' : '500'} ${fontSize}px 'Outfit', sans-serif`;
      ctx.fillStyle = isHovered ? '#ffffff' : `rgba(241, 245, 249, ${alpha})`;
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.screenX, node.screenY + radius + fontSize + 2);
    });

    animationFrameId = requestAnimationFrame(render);
  }

  render();
})();
