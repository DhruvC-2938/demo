/* ==========================================================================
   ALFR / Friday - Fluid Luxury Pastel Cursor System
   Ultra-smooth 60/120fps magnetic fluid cursor with Gelato Days pastel aura
   ========================================================================== */

(function () {
  // Disable on touch devices or screens without fine hover capability
  if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
    return;
  }

  // Ensure DOM is ready
  function initCursor() {
    if (document.getElementById('customCursorDot')) return;

    // Create cursor DOM elements
    const dot = document.createElement('div');
    dot.id = 'customCursorDot';
    dot.className = 'cursor-dot cursor-hidden';

    const aura = document.createElement('div');
    aura.id = 'customCursorAura';
    aura.className = 'cursor-aura cursor-hidden';

    document.body.appendChild(dot);
    document.body.appendChild(aura);

    // Apply custom cursor class to html
    document.documentElement.classList.add('has-custom-cursor');

    let mouseX = -100;
    let mouseY = -100;
    let dotX = -100;
    let dotY = -100;
    let auraX = -100;
    let auraY = -100;
    let isHovering = false;
    let isClicking = false;
    let isTextInput = false;
    let isVisible = false;

    // Linear interpolation for buttery fluid movement
    const lerp = (start, end, factor) => start + (end - start) * factor;

    // Mouse movement listener
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.classList.remove('cursor-hidden');
        aura.classList.remove('cursor-hidden');
        dotX = mouseX;
        dotY = mouseY;
        auraX = mouseX;
        auraY = mouseY;
      }
    }, { passive: true });

    // Handle mouse leaving and entering viewport
    document.addEventListener('mouseleave', () => {
      isVisible = false;
      dot.classList.add('cursor-hidden');
      aura.classList.add('cursor-hidden');
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      dot.classList.remove('cursor-hidden');
      aura.classList.remove('cursor-hidden');
    });

    // Handle mouse click states
    window.addEventListener('mousedown', () => {
      isClicking = true;
      aura.classList.add('cursor-clicking');
      dot.classList.add('cursor-clicking');
    });

    window.addEventListener('mouseup', () => {
      isClicking = false;
      aura.classList.remove('cursor-clicking');
      dot.classList.remove('cursor-clicking');
    });

    // Check hovered elements for interactive targets
    function updateHoverState(target) {
      if (!target || !(target instanceof Element)) {
        isHovering = false;
        isTextInput = false;
        aura.classList.remove('cursor-hover', 'cursor-text');
        dot.classList.remove('cursor-hover', 'cursor-text');
        return;
      }

      const isText = target.matches('input[type="text"], input[type="search"], input[type="email"], textarea, [contenteditable="true"]');
      const isInteractive = target.closest('a, button, input, select, textarea, .card, .concept-node, .gv-ctrl-btn, .gv-subject-btn, .chip-btn, .clean-slider, [role="button"], label, .nav-item-link, canvas');

      if (isText) {
        isTextInput = true;
        isHovering = false;
        aura.classList.add('cursor-text');
        aura.classList.remove('cursor-hover');
        dot.classList.add('cursor-text');
        dot.classList.remove('cursor-hover');
      } else if (isInteractive) {
        isHovering = true;
        isTextInput = false;
        aura.classList.add('cursor-hover');
        aura.classList.remove('cursor-text');
        dot.classList.add('cursor-hover');
        dot.classList.remove('cursor-text');
      } else {
        isHovering = false;
        isTextInput = false;
        aura.classList.remove('cursor-hover', 'cursor-text');
        dot.classList.remove('cursor-hover', 'cursor-text');
      }
    }

    document.addEventListener('mouseover', (e) => {
      updateHoverState(e.target);
    }, { passive: true });

    // Smooth animation loop
    function render() {
      if (isVisible) {
        // Fast tracking for the precision dot
        dotX = lerp(dotX, mouseX, 0.85);
        dotY = lerp(dotY, mouseY, 0.85);
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

        // Liquid smooth trailing for the pastel aura
        auraX = lerp(auraX, mouseX, 0.18);
        auraY = lerp(auraY, mouseY, 0.18);
        aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;
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
