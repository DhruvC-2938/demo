/* ==========================================================================
   Full-Bleed 3D Kinetic Mesh & Silk Wave Background Engine
   Interacts with 3D Background Sculpture Image & Mouse Physics
   Monochromatic, Ultra-Smooth, Soothing Apple/YC Tier Visuals
   ========================================================================== */

(function () {
  // Ensure the 3D scene container exists
  let scene = document.querySelector('.bg-3d-scene');
  if (!scene) {
    scene = document.createElement('div');
    scene.className = 'bg-3d-scene';
    scene.setAttribute('aria-hidden', 'true');

    const visual = document.createElement('div');
    visual.className = 'bg-3d-visual';
    scene.appendChild(visual);

    const canvasElem = document.createElement('canvas');
    canvasElem.id = 'bg3dCanvas';
    canvasElem.className = 'bg-3d-canvas';
    scene.appendChild(canvasElem);

    const vignette = document.createElement('div');
    vignette.className = 'bg-3d-vignette';
    scene.appendChild(vignette);

    document.body.prepend(scene);
  }

  const canvas = document.getElementById('bg3dCanvas') || scene.querySelector('canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;

  // 3D Perspective Grid definition
  const COLS = 36;
  const ROWS = 26;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX - width / 2) / (width / 2);
    mouse.targetY = (e.clientY - height / 2) / (height / 2);
  }, { passive: true });

  // Floating ambient light dust particles
  const dustParticles = [];
  for (let i = 0; i < 40; i++) {
    dustParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.8,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.35 + 0.1
    });
  }

  let time = 0;

  function render() {
    time += 0.01;
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    // Clear transparently so 3D background image is clearly visible
    ctx.clearRect(0, 0, width, height);

    // Ambient floating dust particles
    dustParticles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(15, 23, 42, ${p.alpha * 0.22})`;
      ctx.fill();
    });

    // 3D Perspective Projection for Undulating Silk Wave Mesh
    const fov = 420;
    const originZ = 480;
    const gridPoints = [];

    const spacingX = (width * 1.45) / COLS;
    const spacingY = (height * 1.35) / ROWS;
    const offsetX = -width * 0.22;
    const offsetY = height * 0.12;

    for (let r = 0; r <= ROWS; r++) {
      gridPoints[r] = [];
      for (let c = 0; c <= COLS; c++) {
        const baseX = offsetX + c * spacingX - width * 0.5;
        const baseY = offsetY + r * spacingY - height * 0.5;

        // 3D mathematical wave function
        const dist = Math.hypot(c - COLS / 2, r - ROWS / 2);
        const wave1 = Math.sin(time + c * 0.22 + r * 0.16) * 36;
        const wave2 = Math.cos(time * 0.85 + dist * 0.2) * 22;

        const mouseDist = Math.hypot(
          (c / COLS - 0.5) - mouse.x * 0.45,
          (r / ROWS - 0.5) - mouse.y * 0.45
        );
        const mouseRipple = Math.exp(-mouseDist * 5.2) * 50;

        const worldX = baseX;
        const worldY = baseY + wave1 + wave2 + mouseRipple;
        const worldZ = (r * 20) - 100;

        // 3D Rotation matrices
        const rotX = 0.52 + mouse.y * 0.14;
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        const rotY = mouse.x * 0.12;
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);

        const x1 = worldX * cosY - worldZ * sinY;
        const z1 = worldZ * cosY + worldX * sinY;

        const y2 = worldY * cosX - z1 * sinX;
        const z2 = z1 * cosX + worldY * sinX + originZ;

        const scale = fov / z2;
        const screenX = width / 2 + x1 * scale;
        const screenY = height / 2 + y2 * scale;

        gridPoints[r][c] = { x: screenX, y: screenY, z: z2, scale };
      }
    }

    // Render horizontal continuous 3D wave curves
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      for (let c = 0; c <= COLS; c++) {
        const pt = gridPoints[r][c];
        if (c === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      const depthAlpha = Math.max(0.04, Math.min(0.18, (r / ROWS) * 0.16));
      ctx.strokeStyle = `rgba(15, 23, 42, ${depthAlpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Render vertical 3D perspective lines
    for (let c = 0; c <= COLS; c += 2) {
      ctx.beginPath();
      for (let r = 0; r <= ROWS; r++) {
        const pt = gridPoints[r][c];
        if (r === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Render subtle pulsing node intersections
    for (let r = 2; r < ROWS; r += 3) {
      for (let c = 2; c < COLS; c += 3) {
        const pt = gridPoints[r][c];
        const pulse = (Math.sin(time * 2.2 + r + c) + 1) * 0.5;
        const alpha = Math.max(0.06, Math.min(0.28, (pt.scale * 0.22) + pulse * 0.18));

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.0 * pt.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(render);
  }

  render();
})();
