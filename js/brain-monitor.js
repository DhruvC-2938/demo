/* ==========================================================================
   EduOS Brain - 6 Autonomous Background Pipelines
   Zero Chat Interface • Pure High-Throughput Intelligence
   ========================================================================== */

(function () {
  const PIPELINES = [
    {
      code: 'B01',
      title: 'Curriculum-Market Gap Mapper',
      cron: 'Weekly, Sunday 02:00 AM',
      desc: 'Scrapes 500+ LinkedIn & Naukri Job Descriptions. Extracts skill frequencies via LLM batch processing and detects curricula obsolescence gaps >5%.',
      table: 'curriculum_gaps',
      liveStatus: 'Active · 14 Gaps Identified'
    },
    {
      code: 'B02',
      title: 'Module Proposal Generator',
      cron: 'Triggered after B01 execution',
      desc: 'Automatically drafts complete course modules for high-severity industry skill deficits (e.g. Distributed Consensus, Vector Databases) with prerequisites.',
      table: 'module_proposals',
      liveStatus: '3 Proposals Pending HOD Review'
    },
    {
      code: 'B03',
      title: 'Living Syllabus Monitor',
      cron: 'Daily, 03:00 AM',
      desc: 'Monitors academic RSS feeds (arXiv cs./ee., IEEE Xplore, Nature). Verifies author DOIs and proposes syllabus annotations to department faculty.',
      table: 'syllabus_proposals',
      liveStatus: 'Monitoring 12 Academic Repos'
    },
    {
      code: 'B04',
      title: 'Institutional Record Engine',
      cron: 'Real-time On DB Insert Events',
      desc: 'Aggregates campus achievements, NIRF placement metrics, student research papers, and event counts into tamper-proof JSONB institutional records.',
      table: 'institutional_records',
      liveStatus: 'Syncing NAAC / NIRF Metrics'
    },
    {
      code: 'B05',
      title: 'Performance Pattern Detector',
      cron: 'Nightly, 01:00 AM',
      desc: 'Multi-table JOIN across attendance, submissions, and exam marks. Identifies students exhibiting 3+ late submissions or attendance <75% and alerts mentors.',
      table: 'performance_alerts',
      liveStatus: '8 At-Risk Students Flagged'
    },
    {
      code: 'B06',
      title: 'Campus Sentiment Analyzer',
      cron: 'Monthly, 1st at 04:00 AM',
      desc: 'Analyzes 30-day anonymized student query logs. Measures student stress index, difficult subject topics, and generates executive summaries for HODs.',
      table: 'sentiment_reports',
      liveStatus: 'Healthy · Overall Index 8.4/10'
    }
  ];

  const grid = document.getElementById('brainPipelinesGrid');

  if (grid) {
    const pastelThemes = [
      { card: 'card-pastel-blue', badge: 'blue' },
      { card: 'card-pastel-lavender', badge: 'lavender' },
      { card: 'card-pastel-sage', badge: 'sage' },
      { card: 'card-pastel-peach', badge: 'peach' },
      { card: 'card-pastel-amber', badge: 'amber' },
      { card: 'card-pastel-rose', badge: 'rose' }
    ];

    PIPELINES.forEach((p, index) => {
      const theme = pastelThemes[index % pastelThemes.length];
      const card = document.createElement('div');
      card.className = `pipeline-card ${theme.card}`;
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span class="badge-pastel ${theme.badge}">${p.code} PIPELINE</span>
          <span class="badge-pastel sage" style="font-size: 0.68rem; padding: 2px 7px;">${p.liveStatus}</span>
        </div>
        <h4 class="pipeline-name">${p.title}</h4>
        <div class="pipeline-cron">SCHEDULE: ${p.cron}</div>
        <p class="pipeline-desc">${p.desc}</p>
        <div class="pipeline-output-table">
          <span style="color: var(--text-muted);">CONTRACT TABLE:</span> <code>${p.table}</code>
        </div>
      `;
      grid.appendChild(card);
    });
  }
})();
