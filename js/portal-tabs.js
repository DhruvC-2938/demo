/* ==========================================================================
   6-Portal Ecosystem Interactive Tour
   Walkthrough of Admin, Teacher, and HOD Web Portals
   ========================================================================== */

(function () {
  const portalNavBtns = document.querySelectorAll('.portal-nav-btn');
  const portalViews = document.querySelectorAll('.portal-view-panel');

  portalNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      portalNavBtns.forEach(b => b.classList.remove('active'));
      portalViews.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.dataset.target;
      const targetView = document.getElementById(targetId);
      if (targetView) {
        targetView.classList.add('active');
      }

      if (window.soundEngine) {
        window.soundEngine.playClick();
      }
    });
  });
})();
