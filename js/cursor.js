/* ==========================================================================
   ALFR / Friday - Interactive Fluid Jelly & Pastel Stardust Cursor System
   - Velocity-based elastic liquid droplet deformation & recoil
   - Real-time pastel stardust comet particle trail (Canvas 60/120fps)
   - Dynamic context-aware floating HUD badge (EXPLORE, LAUNCH, INTERACT)
   - Click shockwave ripple wave
   ========================================================================== */

(function () {
  // Gracefully exit on touch or coarse-pointer screens
  if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
    return;
  }

  function initCursor() {
    if (document.getElementById('customCursorJelly')) return;

    // 1. Create Stardust Particle Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'customCursorCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999990';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 2. Create Fluid Jelly Droplet & Precision Core
    const jelly = document.createElement('div');
    jelly.id = 'customCursorJelly';
    jelly.className = 'cursor-jelly cursor-hidden';

    const core = document.createElement('div');
    core.id = 'customCursorCore';
    core.className = 'cursor-core cursor-hidden';

    // 3. Create Floating Dynamic Context HUD Badge
    const badge = document.createElement('div');
    badge.id = 'customCursorBadge';
    badge.className = 'cursor-badge cursor-hidden';
    badge.innerHTML = '<span id="cursorBadgeText">EXPLORE</span>';

    document.body.appendChild(jelly);
    document.body.appendChild(core);
    document.body.appendChild(badge);

    // Flag html root
    document.documentElement.classList.add('has-custom-cursor');

    // States & Coordinates
    let mouseX = -200, mouseY = -200;
    let prevMouseX = -200, prevMouseY = -200;
    let jellyX = -200, jellyY = -200;
    let coreX = -200, coreY = -200;
    let badgeX = -200, badgeY = -200;
    let speed = 0;
    let angle = 0;
    let isVisible = false;
    let isHovering = false;
    let isClicking = false;
    let isTextInput = false;
    let badgeText = '';
    let showBadge = false;

    // Linear interpolation
    const lerp = (start, end, factor) => start + (end - start) * factor;

    // Gelato Days Pastel Colors Palette for Stardust
    const pastelPalette = [
      '#9FC3DC', // Gelato Blue
      '#DCCCEC', // Gelato Lavender
      '#D6E5BD', // Gelato Mint
      '#FFDAB4', // Gelato Peach
      '#FFCBE1', // Gelato Pink
      '#F9E1A8'  // Gelato Yellow
    ];

    // Particle & Ripple Pools
    const particles = [];
    const ripples = [];

    class Particle {
      constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 8;
        this.y = y + (Math.random() - 0.5) * 8;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5 - 0.4; // subtle upward anti-gravity drift
        this.radius = Math.random() * 3.5 + 1.5;
        this.alpha = 0.85;
        this.color = pastelPalette[Math.floor(Math.random() * pastelPalette.length)];
        this.decay = Math.random() * 0.025 + 0.02;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.radius *= 0.96;
      }
      draw(ctx) {
        if (this.alpha <= 0 || this.radius <= 0.2) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 4;
        this.maxRadius = 55;
        this.alpha = 0.9;
        this.color = pastelPalette[Math.floor(Math.random() * pastelPalette.length)];
      }
      update() {
        this.radius += (this.maxRadius - this.radius) * 0.14;
        this.alpha -= 0.035;
      }
      draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Mouse movement
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        jelly.classList.remove('cursor-hidden');
        core.classList.remove('cursor-hidden');
        jellyX = mouseX;
        jellyY = mouseY;
        coreX = mouseX;
        coreY = mouseY;
        badgeX = mouseX + 16;
        badgeY = mouseY - 24;
      }

      // Compute velocity & trajectory angle
      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 1) {
        angle = Math.atan2(dy, dx) * (180 / Math.PI);
        speed = Math.min(dist, 40);

        // Spawn glowing stardust particles along mouse path
        if (dist > 3 && particles.length < 50) {
          particles.push(new Particle(mouseX, mouseY));
          if (dist > 12) {
            particles.push(new Particle(mouseX - dx * 0.4, mouseY - dy * 0.4));
          }
        }
      }

      prevMouseX = mouseX;
      prevMouseY = mouseY;
    }, { passive: true });

    // Window leave / enter
    document.addEventListener('mouseleave', () => {
      isVisible = false;
      jelly.classList.add('cursor-hidden');
      core.classList.add('cursor-hidden');
      badge.classList.add('cursor-hidden');
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      jelly.classList.remove('cursor-hidden');
      core.classList.remove('cursor-hidden');
    });

    // Click / Mouse down shockwave
    window.addEventListener('mousedown', (e) => {
      isClicking = true;
      jelly.classList.add('cursor-clicking');
      core.classList.add('cursor-clicking');
      ripples.push(new Ripple(e.clientX, e.clientY));
      // Extra burst of stardust
      for (let i = 0; i < 6; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
    });

    window.addEventListener('mouseup', () => {
      isClicking = false;
      jelly.classList.remove('cursor-clicking');
      core.classList.remove('cursor-clicking');
    });

    // Detect Contextual Elements under cursor
    const badgeTextEl = document.getElementById('cursorBadgeText');

    function updateContext(target) {
      if (!target || !(target instanceof Element)) {
        isHovering = false;
        isTextInput = false;
        showBadge = false;
        jelly.classList.remove('cursor-hover', 'cursor-text');
        badge.classList.add('cursor-hidden');
        return;
      }

      // Text input detection
      if (target.matches('input[type="text"], input[type="search"], input[type="email"], textarea, [contenteditable="true"]')) {
        isTextInput = true;
        isHovering = false;
        showBadge = true;
        badgeText = 'TYPE';
        jelly.classList.add('cursor-text');
        jelly.classList.remove('cursor-hover');
      }
      // Action buttons
      else if (target.closest('.btn, button, input[type="submit"], .gv-ctrl-btn, .gv-subject-btn, .chip-btn, [role="button"]')) {
        isHovering = true;
        isTextInput = false;
        showBadge = true;
        badgeText = 'ACTION';
        jelly.classList.add('cursor-hover');
        jelly.classList.remove('cursor-text');
      }
      // Interactive canvas / simulators
      else if (target.closest('canvas, .phone-screen, .gv-viewport, .concept-node')) {
        isHovering = true;
        isTextInput = false;
        showBadge = true;
        badgeText = 'INTERACT';
        jelly.classList.add('cursor-hover');
        jelly.classList.remove('cursor-text');
      }
      // Feature cards
      else if (target.closest('.card, .phone-device, .hero-graph-shell')) {
        isHovering = true;
        isTextInput = false;
        showBadge = true;
        badgeText = 'EXPLORE';
        jelly.classList.add('cursor-hover');
        jelly.classList.remove('cursor-text');
      }
      // Navigation & links
      else if (target.closest('a, .nav-item-link, .footer-link, label')) {
        isHovering = true;
        isTextInput = false;
        showBadge = true;
        badgeText = 'VIEW';
        jelly.classList.add('cursor-hover');
        jelly.classList.remove('cursor-text');
      }
      else {
        isHovering = false;
        isTextInput = false;
        showBadge = false;
        jelly.classList.remove('cursor-hover', 'cursor-text');
      }

      if (showBadge && isVisible) {
        badgeTextEl.textContent = badgeText;
        badge.classList.remove('cursor-hidden');
      } else {
        badge.classList.add('cursor-hidden');
      }
    }

    document.addEventListener('mouseover', (e) => {
      updateContext(e.target);
    }, { passive: true });

    // Main 60/120fps Animation Loop
    function render() {
      // 1. Clear Canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 2. Render Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.update();
        r.draw(ctx);
        if (r.alpha <= 0) ripples.splice(i, 1);
      }

      // 3. Render Stardust Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0 || p.radius <= 0.2) particles.splice(i, 1);
      }

      if (isVisible) {
        // Core tracking (sharp & instant)
        coreX = lerp(coreX, mouseX, 0.88);
        coreY = lerp(coreY, mouseY, 0.88);
        core.style.transform = `translate3d(${coreX}px, ${coreY}px, 0)`;

        // Liquid Jelly Droplet tracking with physics stretch
        jellyX = lerp(jellyX, mouseX, 0.22);
        jellyY = lerp(jellyY, mouseY, 0.22);

        // Velocity decay for fluid spring recoil
        speed = lerp(speed, 0, 0.12);

        if (!isHovering && !isTextInput) {
          // Dynamic liquid stretch proportional to mouse velocity
          const stretch = Math.min(speed * 0.035, 0.75);
          const scaleX = 1 + stretch;
          const scaleY = 1 / (1 + stretch * 0.6);
          jelly.style.transform = `translate3d(${jellyX}px, ${jellyY}px, 0) rotate(${angle}deg) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
        } else if (isTextInput) {
          // Slender vertical beam
          jelly.style.transform = `translate3d(${jellyX}px, ${jellyY}px, 0) scale(0.2, 1.4)`;
        } else {
          // Expanded magnetic focal lens
          jelly.style.transform = `translate3d(${jellyX}px, ${jellyY}px, 0) scale(1.6)`;
        }

        // Dynamic HUD Badge smooth trailing
        if (showBadge) {
          badgeX = lerp(badgeX, mouseX + 18, 0.2);
          badgeY = lerp(badgeY, mouseY - 22, 0.2);
          badge.style.transform = `translate3d(${badgeX}px, ${badgeY}px, 0)`;
        }
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
  } else {
    initCursor();
  }
})();
