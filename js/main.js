/* ==========================================================================
   Main Application Orchestrator
   Navigation, Sound Toggles, Modals & Micro-Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Audio Toggle
  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const active = window.soundEngine.toggle();
      soundBtn.classList.toggle('active', active);
      soundBtn.innerHTML = active ? '<span>AUDIO: ON</span>' : '<span>AUDIO: OFF</span>';
    });
  }

  // 2. Navbar Scroll Glass State
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Demo / Pilot Modal System
  const modalBackdrop = document.getElementById('pilotModalBackdrop');
  const openModalBtns = document.querySelectorAll('.btn-open-pilot');
  const closeModalBtn = document.getElementById('closePilotModal');
  const pilotForm = document.getElementById('pilotBookingForm');
  const formSuccessState = document.getElementById('formSuccessState');
  const generatedTrialCode = document.getElementById('generatedTrialCode');

  function openModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.soundEngine) window.soundEngine.playChime(600, 0.2);
    }
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Form submission simulation
  if (pilotForm) {
    pilotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = 'FRIDAY-' + Math.floor(100000 + Math.random() * 900000);
      if (generatedTrialCode) generatedTrialCode.textContent = code;

      pilotForm.style.display = 'none';
      if (formSuccessState) formSuccessState.style.display = 'block';

      if (window.soundEngine) window.soundEngine.playSuccess();
    });
  }

  // 4. Smooth Anchor Link Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        if (window.soundEngine) window.soundEngine.playClick();
      }
    });
  });

  // 5. Scroll Reveal Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.glass-card, .section-header, .phone-mockup, .agent-card, .cockpit-view').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  // Trigger reveal style update
  document.addEventListener('scroll', () => {
    document.querySelectorAll('.revealed').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });

  // Initial trigger for in-view elements
  setTimeout(() => {
    document.querySelectorAll('.revealed').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, 200);
});
