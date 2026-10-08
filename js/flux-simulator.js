/* ==========================================================================
   ALFR FLUX Interactive Simulator
   Dual-Pane Studio: Realistic WhatsApp Client + Autonomous Engine Telemetry
   ========================================================================== */

(function () {
  // DOM Elements
  const waChatMessages = document.getElementById('waChatMessages');
  const waTypingIndicator = document.getElementById('waTypingIndicator');
  const waStatusText = document.getElementById('waStatusText');
  const waCustomInput = document.getElementById('waCustomInput');
  const waSendBtn = document.getElementById('waSendBtn');
  const scenarioButtons = document.querySelectorAll('.scenario-btn');

  // Telemetry DOM Elements
  const telemetryConsole = document.getElementById('telemetryConsole');
  const activeEngineBadge = document.getElementById('activeEngineBadge');
  const metricLatency = document.getElementById('metricLatency');
  const metricHallucination = document.getElementById('metricHallucination');
  const metricRateLimit = document.getElementById('metricRateLimit');
  const metricHealth = document.getElementById('metricHealth');

  const stepNodes = [
    document.getElementById('stepNode1'),
    document.getElementById('stepNode2'),
    document.getElementById('stepNode3'),
    document.getElementById('stepNode4')
  ];

  let currentTimers = [];

  function clearAllTimers() {
    currentTimers.forEach(t => clearTimeout(t));
    currentTimers = [];
  }

  function queueTimer(fn, delay) {
    const t = setTimeout(fn, delay);
    currentTimers.push(t);
    return t;
  }

  function appendLog(time, tag, type, msg) {
    if (!telemetryConsole) return;
    const div = document.createElement('div');
    div.className = 'telemetry-log-line';
    div.innerHTML = `
      <span class="telemetry-log-time">[${time}]</span>
      <span class="telemetry-log-tag ${type}">${tag}</span>
      <span class="telemetry-log-msg">${msg}</span>
    `;
    telemetryConsole.appendChild(div);
    telemetryConsole.scrollTop = telemetryConsole.scrollHeight;
  }

  function appendWaMessage(text, isUser = false, time = '11:42 PM') {
    if (!waChatMessages) return;
    const div = document.createElement('div');
    div.className = `wa-bubble ${isUser ? 'wa-bubble-user' : 'wa-bubble-bot'}`;

    const formattedText = text.replace(/\n/g, '<br>');
    const checkmarks = isUser ? `
      <span class="wa-checkmarks">
        <svg width="15" height="11" viewBox="0 0 16 11" fill="none">
          <path d="M1 5.5L5 9.5L15 1" stroke="#3b82f6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5 5.5L9 9.5L15 1" stroke="#3b82f6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>` : '';

    div.innerHTML = `
      <div>${formattedText}</div>
      <div class="wa-msg-meta">
        <span>${time}</span>
        ${checkmarks}
      </div>
    `;

    waChatMessages.appendChild(div);
    waChatMessages.scrollTop = waChatMessages.scrollHeight;

    if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
      try { window.soundEngine.playClick(); } catch (e) {}
    }
  }

  function setStepActive(stepIndex) {
    stepNodes.forEach((node, idx) => {
      if (!node) return;
      if (idx <= stepIndex) {
        node.classList.add('active-step');
      } else {
        node.classList.remove('active-step');
      }
    });
  }

  function updateStepsLabels(scenarioKey) {
    const d1 = document.getElementById('stepDetail1');
    const d2 = document.getElementById('stepDetail2');
    const d3 = document.getElementById('stepDetail3');
    const d4 = document.getElementById('stepDetail4');

    if (scenarioKey === 'herald_query') {
      if (d1) d1.textContent = 'Inbound TCP Baileys webhook verified';
      if (d2) d2.textContent = 'active_threads scan: routing directly to Herald';
      if (d3) d3.textContent = 'PostgreSQL SELECT: attendance & assignments';
      if (d4) d4.textContent = 'Baileys 1:1 response delivered in 178ms';
    } else if (scenarioKey === 'nexus_approval') {
      if (d1) d1.textContent = 'Student extension query -> Case #EXT-409 created';
      if (d2) d2.textContent = 'C1 Rule: active_threads entry for Prof. Sharma';
      if (d3) d3.textContent = 'Hinglish NLP parsed: deadline +2 days granted';
      if (d4) d4.textContent = 'Immutable case_events audit logged & student notified';
    } else if (scenarioKey === 'dispatch_broadcast') {
      if (d1) d1.textContent = 'Admin initiates campus notice for 847 students';
      if (d2) d2.textContent = 'Segment resolution & LLM bilingual draft verified';
      if (d3) d3.textContent = 'Token-bucket queue: 1 message per 0.8s rate';
      if (d4) d4.textContent = 'Baileys anti-ban bridge: 0 drops, 100% health';
    }
  }

  // Scenarios Execution
  function playScenario(key) {
    clearAllTimers();
    if (!waChatMessages || !telemetryConsole) return;

    waChatMessages.innerHTML = '';
    telemetryConsole.innerHTML = '';
    setStepActive(-1);
    updateStepsLabels(key);

    if (waTypingIndicator) waTypingIndicator.style.display = 'none';

    if (key === 'herald_query') {
      if (waStatusText) waStatusText.textContent = 'Official Verified Institutional Account • Herald Active';
      if (activeEngineBadge) {
        activeEngineBadge.textContent = 'HERALD ACTIVE (0 HALLUCINATION)';
        activeEngineBadge.style.color = '#047857';
        activeEngineBadge.style.background = '#ecfdf5';
      }
      if (metricLatency) metricLatency.textContent = '178ms';
      if (metricHallucination) metricHallucination.textContent = '0.0%';
      if (metricRateLimit) metricRateLimit.textContent = 'Instant 1:1';
      if (metricHealth) metricHealth.textContent = '100%';

      // 1. Student sends message
      queueTimer(() => {
        appendWaMessage('what is my physics attendance and is any assignment pending?', true, '11:42 PM');
        setStepActive(0);
        appendLog('23:42:01.102', 'HERALD', 'herald', 'Incoming WhatsApp message from +91-9876543210 (Rahul Verma, CS-A)');
      }, 300);

      // 2. C1 Check
      queueTimer(() => {
        setStepActive(1);
        appendLog('23:42:01.124', 'C1_CHECK', 'herald', 'Checking active_threads -> NO open Nexus thread. Proceeding to Vanguard.');
        appendLog('23:42:01.195', 'VANGUARD', 'herald', 'Intent classified: {intent: "query", sub_intents: ["attendance", "pending_assignments"], confidence: 0.98}');
        if (waTypingIndicator) waTypingIndicator.style.display = 'block';
      }, 700);

      // 3. Database SQL Query
      queueTimer(() => {
        setStepActive(2);
        appendLog('23:42:01.210', 'POSTGRES', 'db', 'SELECT attendance_pct FROM attendance WHERE student_id=\'STU_8492\' AND subject=\'Physics\' -> 82.4%');
        appendLog('23:42:01.222', 'POSTGRES', 'db', 'SELECT * FROM assignments a WHERE student_id=\'STU_8492\' AND status=\'pending\' -> 1 found (Lab 3: Electric Current)');
      }, 1200);

      // 4. Bot Reply
      queueTimer(() => {
        setStepActive(3);
        if (waTypingIndicator) waTypingIndicator.style.display = 'none';
        appendLog('23:42:01.280', 'DISPATCH', 'dispatch', 'Exact SQL template compiled in 0.178s. Dispatched via WhatsApp Baileys bridge.');
        appendWaMessage(
          'Rahul (CS-A), here is your live academic status:\n\n' +
          'Physics Attendance: 82.4% (Above 75% cutoff)\n' +
          'Pending Submissions: 1\n' +
          '• Lab 3: Electric Current (Due tomorrow, 5:00 PM)\n\n' +
          'Reply "request extension" if you need to submit a faculty medical approval.',
          false,
          '11:42 PM'
        );
      }, 1600);

    } else if (key === 'nexus_approval') {
      if (waStatusText) waStatusText.textContent = 'Nexus State Machine • Case #EXT-409';
      if (activeEngineBadge) {
        activeEngineBadge.textContent = 'NEXUS STATE MACHINE ACTIVE';
        activeEngineBadge.style.color = '#1d4ed8';
        activeEngineBadge.style.background = '#eff6ff';
      }
      if (metricLatency) metricLatency.textContent = '240ms';
      if (metricHallucination) metricHallucination.textContent = '0.0%';
      if (metricRateLimit) metricRateLimit.textContent = 'Thread Bound';
      if (metricHealth) metricHealth.textContent = '100%';

      // 1. Student extension query
      queueTimer(() => {
        appendWaMessage('Sir please give 2 days extension for Lab 3, severe viral fever', true, '02:15 PM');
        setStepActive(0);
        appendLog('14:15:02.040', 'HERALD', 'herald', 'Incoming from student Rahul Verma (+91-9876543210)');
        appendLog('14:15:02.080', 'NEXUS', 'nexus', 'Extension request recognized. Case #EXT-409 generated in cases table.');
      }, 300);

      // 2. Nexus routes to Faculty
      queueTimer(() => {
        setStepActive(1);
        appendLog('14:15:02.130', 'NEXUS', 'nexus', 'INSERT into active_threads {phone: "+91-9811223344", case_id: "EXT-409", status: "open"}');
        appendLog('14:15:02.160', 'DISPATCH', 'dispatch', 'WhatsApp prompt delivered to Prof. Sharma (+91-9811223344): "Student Rahul requests 2-day extension on Lab 3. Reply to approve/deny."');
      }, 800);

      // 3. Prof replies & C1 activates
      queueTimer(() => {
        setStepActive(2);
        appendLog('14:16:45.890', 'HERALD', 'herald', 'Incoming WhatsApp from Prof. Sharma: "haan 2 din de do"');
        appendLog('14:16:45.905', 'CRITICAL_C1', 'nexus', 'C1 RULE ACTIVATED: Phone in active_threads! VANGUARD SKIPPED. Directly to nexus.handle_reply()');
        appendLog('14:16:46.020', 'NEXUS_NLP', 'nexus', 'Parsed Hinglish reply: {decision: "approved", days: 2, confidence: 0.96}');
        appendLog('14:16:46.045', 'POSTGRES', 'db', 'UPDATE assignments_students SET deadline = deadline + INTERVAL \'2 DAY\' WHERE student_id=\'STU_8492\'');
        appendLog('14:16:46.060', 'AUDIT', 'nexus', 'INSERT into case_events {case_id: "EXT-409", state: "RESOLVED", raw: "haan 2 din de do", actor: "Prof. Sharma"}');
      }, 1400);

      // 4. Student receives resolution
      queueTimer(() => {
        setStepActive(3);
        appendWaMessage(
          'Update on Case #EXT-409:\n\n' +
          'Your extension request for Lab 3 (Electric Current) was APPROVED by Prof. Sharma.\n\n' +
          'New Deadline: Friday, 5:00 PM\n' +
          'Recorded in the official department gradebook.',
          false,
          '02:16 PM'
        );
      }, 1900);

    } else if (key === 'dispatch_broadcast') {
      if (waStatusText) waStatusText.textContent = 'Dispatch Anti-Ban Engine • Token Bucket';
      if (activeEngineBadge) {
        activeEngineBadge.textContent = 'DISPATCH QUEUE (1 MSG / 0.8S)';
        activeEngineBadge.style.color = '#7c2d12';
        activeEngineBadge.style.background = '#fef3c7';
      }
      if (metricLatency) metricLatency.textContent = '42ms / msg';
      if (metricHallucination) metricHallucination.textContent = '0.0%';
      if (metricRateLimit) metricRateLimit.textContent = '1 / 0.8s';
      if (metricHealth) metricHealth.textContent = '100% (Clean)';

      // 1. Admin initiates broadcast
      queueTimer(() => {
        setStepActive(0);
        appendLog('08:00:00.010', 'ADMIN_API', 'dispatch', 'Admin initiates campus broadcast: "Exam schedule released for Division CS-A & CS-B"');
        appendLog('08:00:00.040', 'DRAFT_CRAFT', 'dispatch', 'LLM generated clean bilingual WhatsApp circular. Admin clicked [APPROVE AND SEND].');
      }, 300);

      // 2. Token Bucket Enqueued
      queueTimer(() => {
        setStepActive(1);
        appendLog('08:00:00.065', 'DISPATCH', 'dispatch', 'Target segment resolved: 847 students. Enqueued in broadcast_jobs (Job #BC-992).');
        appendLog('08:00:00.080', 'RATE_LIMIT', 'dispatch', 'Applying Baileys rate limiter: 1 message per 0.8 seconds (Anti-ban token bucket).');
      }, 700);

      // 3. Batches delivering with jitter
      queueTimer(() => {
        setStepActive(2);
        appendLog('08:00:00.880', 'WORKER_1', 'dispatch', 'Delivered to +91-98...01 [Status: SENT, Latency: 42ms]');
        appendLog('08:00:01.680', 'WORKER_1', 'dispatch', 'Delivered to +91-98...02 [Status: SENT, Latency: 38ms]');
        appendLog('08:00:02.480', 'WORKER_1', 'dispatch', 'Delivered to +91-98...03 [Status: SENT, Latency: 40ms]');
      }, 1200);

      // 4. Recipient receives notice
      queueTimer(() => {
        setStepActive(3);
        appendWaMessage(
          'ALFR Official Institutional Circular\n\n' +
          'Subject: End-Semester Practical Examination Schedule\n' +
          'Division: CS-A & CS-B\n\n' +
          'Practical examinations commence on October 18, 2026. Hall tickets and slot allocations are now available.\n\n' +
          'Reply "slot" to see your assigned lab timing.',
          false,
          '08:00 AM'
        );
        appendLog('08:05:12.800', 'DISPATCH', 'dispatch', 'Progress: 847 / 847 sent in 11m 17s. WhatsApp health score: 100% (Clean).');
      }, 1700);
    }
  }

  // Handle Custom User Input
  function handleCustomMessage() {
    if (!waCustomInput) return;
    const userQuery = waCustomInput.value.trim();
    if (!userQuery) return;

    waCustomInput.value = '';
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // User message
    appendWaMessage(userQuery, true, timeStr);
    if (waTypingIndicator) waTypingIndicator.style.display = 'block';

    setStepActive(0);
    appendLog(timeStr + '.012', 'INBOUND', 'herald', `Custom webhook query: "${userQuery}"`);

    // Intelligent response simulator based on keywords
    queueTimer(() => {
      setStepActive(1);
      appendLog(timeStr + '.084', 'C1_CHECK', 'herald', 'Checking active_threads -> No collision.');
      appendLog(timeStr + '.120', 'POSTGRES', 'db', 'Executing parameterized SQL query on student contract...');
    }, 400);

    queueTimer(() => {
      setStepActive(2);
      if (metricLatency) metricLatency.textContent = '162ms';
      if (metricHallucination) metricHallucination.textContent = '0.0%';
    }, 700);

    queueTimer(() => {
      setStepActive(3);
      if (waTypingIndicator) waTypingIndicator.style.display = 'none';

      const q = userQuery.toLowerCase();
      let replyText = '';

      if (q.includes('attend') || q.includes('absent')) {
        replyText = 'Rahul Verma (CS-A):\n\nYour overall attendance is 84.2%.\n• Physics: 82.4%\n• Operating Systems: 88.0%\n• Mathematics III: 79.5%\n\nAll courses are safely above the 75% examination threshold.';
      } else if (q.includes('exam') || q.includes('schedule') || q.includes('timetable') || q.includes('slot')) {
        replyText = 'Official Examination Timetable:\n\n• Oct 18, 09:30 AM: Systems Programming Lab (Lab 204)\n• Oct 21, 01:30 PM: Computer Networks (Hall B)\n• Oct 24, 09:30 AM: Database Engineering (Hall A)\n\nArrive 15 minutes prior with your student ID card.';
      } else if (q.includes('assign') || q.includes('lab') || q.includes('deadline') || q.includes('homework')) {
        replyText = 'Pending Submissions for Rahul Verma:\n\n1. Lab 3: Electric Current (Physics)\n   Deadline: Tomorrow 5:00 PM\n   Status: NOT SUBMITTED\n\nReply "extend" if you wish to file a medical extension request.';
      } else if (q.includes('fee') || q.includes('dues') || q.includes('receipt')) {
        replyText = 'Student Finance Record (STU_8492):\n\n• Semester 5 Tuition: PAID (Receipt #REC-8841)\n• Library Fine: INR 0\n• Pending Balance: INR 0.00\n\nNo clearance holds on your account.';
      } else {
        replyText = `Understood. Query "${userQuery}" verified against the PostgreSQL student record for STU_8492.\n\nDatabase Status: OK\nHallucination: 0.0%\n\nType "attendance", "pending assignments", or "exam schedule" for immediate official records.`;
      }

      appendLog(timeStr + '.210', 'DISPATCH', 'dispatch', `Delivered 0-hallucination database response to +91-9876543210.`);
      appendWaMessage(replyText, false, timeStr);
    }, 1100);
  }

  // Setup Event Listeners
  scenarioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      scenarioButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scenarioKey = btn.dataset.scenario;
      playScenario(scenarioKey);
    });
  });

  if (waSendBtn) {
    waSendBtn.addEventListener('click', handleCustomMessage);
  }

  if (waCustomInput) {
    waCustomInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCustomMessage();
      }
    });
  }

  // Initial Scenario Run
  playScenario('herald_query');
})();
