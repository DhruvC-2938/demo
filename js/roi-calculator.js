/* ==========================================================================
   Campus ROI & Efficiency Calculator
   Quantifying the elimination of manual WhatsApp coordination chaos
   ========================================================================== */

(function () {
  const studentSlider = document.getElementById('studentRange');
  const facultySlider = document.getElementById('facultyRange');
  const studentValLabel = document.getElementById('studentValLabel');
  const facultyValLabel = document.getElementById('facultyValLabel');

  const metricAdminHours = document.getElementById('metricAdminHours');
  const metricFacultyHours = document.getElementById('metricFacultyHours');
  const metricBanRisk = document.getElementById('metricBanRisk');
  const metricCostSaved = document.getElementById('metricCostSaved');

  function calculateROI() {
    if (!studentSlider || !facultySlider) return;

    const students = parseInt(studentSlider.value);
    const faculty = parseInt(facultySlider.value);

    if (studentValLabel) studentValLabel.textContent = students.toLocaleString() + ' Students';
    if (facultyValLabel) facultyValLabel.textContent = faculty.toLocaleString() + ' Faculty';

    // Baseline formulas based on PDF operational specs:
    // Manual messaging: ~0.18 hours per student per month of manual broadcasts/extension chasing/queries
    const adminHours = Math.round(students * 0.16 + faculty * 2.2);
    // Faculty preparation & grading saved: ~4.5 hours per faculty per week = ~18 hours/month
    const facultyHours = Math.round(faculty * 14.5);
    // Estimated operational financial savings in INR lakhs / USD
    const costSavedLakhs = ((adminHours * 350 + facultyHours * 600) / 100000).toFixed(1);

    if (metricAdminHours) metricAdminHours.textContent = `${adminHours.toLocaleString()} hrs`;
    if (metricFacultyHours) metricFacultyHours.textContent = `${facultyHours.toLocaleString()} hrs`;
    if (metricBanRisk) metricBanRisk.textContent = '0.0%';
    if (metricCostSaved) metricCostSaved.textContent = `₹${costSavedLakhs}L`;

    if (window.soundEngine && Math.random() < 0.2) {
      window.soundEngine.playClick();
    }
  }

  if (studentSlider) {
    studentSlider.addEventListener('input', calculateROI);
  }
  if (facultySlider) {
    facultySlider.addEventListener('input', calculateROI);
  }

  calculateROI();
})();
