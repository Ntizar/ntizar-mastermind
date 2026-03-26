/* ============================================================
   BRAIN ACADEMY — Platform Engine
   Handles: onboarding, navigation, content loading, timer,
   progress tracking, quiz engine, personalization, finish modal
   ============================================================ */

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────
  const STATE = {
    userName: '',
    currentModule: 0,
    totalModules: 6,          // M0–M5
    completedModules: new Set(),
    quizAnswers: {},          // { 'q-1-1': 'b', ... }
    quizResults: {},          // { 'q-1-1': true, ... }
    totalQuestions: 0,
    correctAnswers: 0,
    timerSeconds: 2 * 60 * 60, // 2 hours
    timerInterval: null,
    modules: null,            // loaded from modules.json
    startedAt: null,
  };

  // ── DOM references ─────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const DOM = {
    screenOnboarding: $('#screen-onboarding'),
    screenLearning:   $('#screen-learning'),
    onbName:          $('#onb-name'),
    onbStart:         $('#onb-start'),
    navBrand:         $('#nav-system-name'),
    navTimer:         $('#nav-timer'),
    navProgress:      $('#nav-progress'),
    navScore:         $('#nav-score'),
    progressBar:      $('#progress-bar'),
    progressLabel:    $('#progress-label-text'),
    progressPct:      $('#progress-label-pct'),
    moduleTabs:       $('#module-tabs'),
    moduleContent:    $('#module-content'),
    finishOverlay:    $('#finish-overlay'),
    finishClose:      $('#finish-close'),
    finishTitle:      $('#finish-title'),
    finishBody:       $('#finish-body'),
    finishRestart:    $('#finish-restart'),
    finishExport:     $('#finish-export'),
  };

  // ── Onboarding ─────────────────────────────────────────────
  function initOnboarding() {
    // Restore name from localStorage
    const saved = localStorage.getItem('brainacademy_name');
    if (saved) {
      DOM.onbName.value = saved;
      DOM.onbStart.disabled = false;
    }

    // Restore full state if exists
    const savedState = localStorage.getItem('brainacademy_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.userName && parsed.completedModules) {
          STATE.userName = parsed.userName;
          STATE.completedModules = new Set(parsed.completedModules);
          STATE.quizAnswers = parsed.quizAnswers || {};
          STATE.quizResults = parsed.quizResults || {};
          STATE.correctAnswers = parsed.correctAnswers || 0;
          STATE.totalQuestions = parsed.totalQuestions || 0;
          STATE.currentModule = parsed.currentModule || 0;
          STATE.timerSeconds = parsed.timerSeconds || 2 * 60 * 60;
        }
      } catch (e) { /* ignore corrupt state */ }
    }

    DOM.onbName.addEventListener('input', () => {
      DOM.onbStart.disabled = DOM.onbName.value.trim().length === 0;
    });

    DOM.onbStart.addEventListener('click', () => {
      const name = DOM.onbName.value.trim();
      if (!name) return;
      STATE.userName = name;
      STATE.startedAt = Date.now();
      localStorage.setItem('brainacademy_name', name);
      showScreen('learning');
      loadModules();
    });

    // Enter key triggers start
    DOM.onbName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !DOM.onbStart.disabled) {
        DOM.onbStart.click();
      }
    });
  }

  // ── Screen management ──────────────────────────────────────
  function showScreen(name) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    if (name === 'onboarding') {
      DOM.screenOnboarding.classList.add('active');
    } else if (name === 'learning') {
      DOM.screenLearning.classList.add('active');
    }
  }

  // ── Module loading ─────────────────────────────────────────
  async function loadModules() {
    try {
      const resp = await fetch('modules.json');
      if (!resp.ok) throw new Error('Failed to load modules.json');
      STATE.modules = await resp.json();
      initLearningScreen();
    } catch (err) {
      DOM.moduleContent.innerHTML =
        '<div class="lesson"><h3>Error</h3><p>No se pudo cargar el contenido de los modulos. Asegurate de que modules.json existe.</p></div>';
      console.error(err);
    }
  }

  // ── Learning screen init ───────────────────────────────────
  function initLearningScreen() {
    // Set brand with user name
    DOM.navBrand.textContent = STATE.userName + ' Academy';

    // Init tabs
    initTabs();

    // Start timer
    startTimer();

    // Render first module (or last visited)
    navigateToModule(STATE.currentModule);

    // Update progress from saved state
    updateProgress();
  }

  // ── Tab navigation ─────────────────────────────────────────
  function initTabs() {
    DOM.moduleTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.mtab');
      if (!tab) return;
      const mod = parseInt(tab.dataset.mod, 10);
      navigateToModule(mod);
    });
  }

  function updateTabStates() {
    $$('.mtab').forEach(tab => {
      const mod = parseInt(tab.dataset.mod, 10);
      tab.classList.toggle('active', mod === STATE.currentModule);
      tab.classList.toggle('completed', STATE.completedModules.has(mod));
    });
  }

  // ── Module rendering ───────────────────────────────────────
  function navigateToModule(modIndex) {
    STATE.currentModule = modIndex;
    const key = 'mod' + modIndex;
    const modData = STATE.modules[key];

    if (!modData) {
      DOM.moduleContent.innerHTML =
        '<div class="lesson"><h3>Modulo no encontrado</h3></div>';
      return;
    }

    // Personalize content: replace {{NAME}} placeholders
    let html = modData.content;
    html = personalize(html);

    DOM.moduleContent.innerHTML = html;

    // Scroll to top of content
    DOM.moduleContent.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Bind navigation buttons
    bindNavButtons();

    // Bind quiz interactions
    bindQuizzes();

    // Restore quiz answers if revisiting
    restoreQuizState();

    // Update tabs
    updateTabStates();

    // Update progress label
    updateProgress();

    // Save state
    saveState();
  }

  // ── Personalization ────────────────────────────────────────
  function personalize(html) {
    const name = STATE.userName || 'Usuario';
    // Replace {{NAME}} with styled span
    return html.replace(/\{\{NAME\}\}/g, '<span class="user-name">' + escapeHtml(name) + '</span>');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Navigation buttons ─────────────────────────────────────
  function bindNavButtons() {
    // "Next module" buttons with data-next
    DOM.moduleContent.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextKey = btn.dataset.next;
        const nextIndex = parseInt(nextKey.replace('mod', ''), 10);

        // Mark current module as completed
        STATE.completedModules.add(STATE.currentModule);

        navigateToModule(nextIndex);
      });
    });

    // "Previous module" buttons with data-prev
    DOM.moduleContent.querySelectorAll('[data-prev]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const prevKey = btn.dataset.prev;
        const prevIndex = parseInt(prevKey.replace('mod', ''), 10);
        navigateToModule(prevIndex);
      });
    });

    // Finish button
    const finishBtn = DOM.moduleContent.querySelector('#finish-btn');
    if (finishBtn) {
      finishBtn.addEventListener('click', (e) => {
        e.preventDefault();
        STATE.completedModules.add(STATE.currentModule);
        updateProgress();
        showFinishModal();
      });
    }
  }

  // ── Quiz engine ────────────────────────────────────────────
  function bindQuizzes() {
    const quizBlocks = DOM.moduleContent.querySelectorAll('.quiz-block');
    quizBlocks.forEach(block => {
      const checkBtn = block.querySelector('.quiz-check');
      if (!checkBtn) return;

      checkBtn.addEventListener('click', () => {
        evaluateQuiz(block);
      });
    });
  }

  function evaluateQuiz(block) {
    const questions = block.querySelectorAll('.quiz-question');
    let blockCorrect = 0;
    let blockTotal = 0;

    questions.forEach(q => {
      const qId = q.dataset.qid;
      const correctAnswer = q.dataset.correct;
      const selected = q.querySelector('input[type="radio"]:checked');
      const feedback = q.querySelector('.quiz-feedback');
      const options = q.querySelectorAll('.quiz-option');

      blockTotal++;

      if (!selected) {
        // No answer selected
        if (feedback) {
          feedback.className = 'quiz-feedback show incorrect';
          feedback.textContent = 'Selecciona una respuesta antes de verificar.';
        }
        return;
      }

      const selectedValue = selected.value;
      const isCorrect = selectedValue === correctAnswer;

      // Record answer
      STATE.quizAnswers[qId] = selectedValue;
      STATE.quizResults[qId] = isCorrect;

      // Style options
      options.forEach(opt => {
        const radio = opt.querySelector('input[type="radio"]');
        opt.classList.remove('correct', 'incorrect');
        if (radio.value === correctAnswer) {
          opt.classList.add('correct');
        } else if (radio.checked && !isCorrect) {
          opt.classList.add('incorrect');
        }
        // Disable after checking
        radio.disabled = true;
      });

      // Show feedback
      if (feedback) {
        const feedbackCorrect = q.dataset.feedbackCorrect || 'Correcto!';
        const feedbackIncorrect = q.dataset.feedbackIncorrect || 'Incorrecto. Revisa el contenido.';
        feedback.className = 'quiz-feedback show ' + (isCorrect ? 'correct' : 'incorrect');
        feedback.textContent = isCorrect ? feedbackCorrect : feedbackIncorrect;
      }

      if (isCorrect) blockCorrect++;
    });

    // Recalculate global score
    recalculateScore();

    // Disable check button
    const checkBtn = block.querySelector('.quiz-check');
    if (checkBtn) {
      checkBtn.disabled = true;
      checkBtn.textContent = 'Verificado';
    }

    saveState();
  }

  function recalculateScore() {
    const results = Object.values(STATE.quizResults);
    STATE.totalQuestions = results.length;
    STATE.correctAnswers = results.filter(r => r === true).length;
    updateScoreBadge();
  }

  function restoreQuizState() {
    // Restore previously answered quizzes
    const questions = DOM.moduleContent.querySelectorAll('.quiz-question');
    questions.forEach(q => {
      const qId = q.dataset.qid;
      if (STATE.quizAnswers[qId] !== undefined) {
        const savedAnswer = STATE.quizAnswers[qId];
        const isCorrect = STATE.quizResults[qId];
        const correctAnswer = q.dataset.correct;
        const options = q.querySelectorAll('.quiz-option');
        const feedback = q.querySelector('.quiz-feedback');

        options.forEach(opt => {
          const radio = opt.querySelector('input[type="radio"]');
          if (radio.value === savedAnswer) radio.checked = true;
          if (radio.value === correctAnswer) opt.classList.add('correct');
          else if (radio.value === savedAnswer && !isCorrect) opt.classList.add('incorrect');
          radio.disabled = true;
        });

        if (feedback) {
          const feedbackCorrect = q.dataset.feedbackCorrect || 'Correcto!';
          const feedbackIncorrect = q.dataset.feedbackIncorrect || 'Incorrecto. Revisa el contenido.';
          feedback.className = 'quiz-feedback show ' + (isCorrect ? 'correct' : 'incorrect');
          feedback.textContent = isCorrect ? feedbackCorrect : feedbackIncorrect;
        }
      }
    });

    // Disable check buttons for already-evaluated quiz blocks
    const quizBlocks = DOM.moduleContent.querySelectorAll('.quiz-block');
    quizBlocks.forEach(block => {
      const questions = block.querySelectorAll('.quiz-question');
      const allAnswered = Array.from(questions).every(q => STATE.quizAnswers[q.dataset.qid] !== undefined);
      if (allAnswered && questions.length > 0) {
        const checkBtn = block.querySelector('.quiz-check');
        if (checkBtn) {
          checkBtn.disabled = true;
          checkBtn.textContent = 'Verificado';
        }
      }
    });
  }

  // ── Progress tracking ──────────────────────────────────────
  function updateProgress() {
    const completed = STATE.completedModules.size;
    const total = STATE.totalModules;
    const pct = Math.round((completed / total) * 100);

    DOM.progressBar.style.width = pct + '%';
    DOM.progressLabel.textContent = 'Modulo ' + STATE.currentModule + ' de ' + (total - 1);
    DOM.progressPct.textContent = pct + '%';
    DOM.navProgress.textContent = pct + '%';

    updateScoreBadge();
  }

  function updateScoreBadge() {
    DOM.navScore.textContent = STATE.correctAnswers + '/' + STATE.totalQuestions;
  }

  // ── Timer ──────────────────────────────────────────────────
  function startTimer() {
    updateTimerDisplay();
    STATE.timerInterval = setInterval(() => {
      if (STATE.timerSeconds > 0) {
        STATE.timerSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(STATE.timerInterval);
        DOM.navTimer.textContent = '00:00:00';
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const h = Math.floor(STATE.timerSeconds / 3600);
    const m = Math.floor((STATE.timerSeconds % 3600) / 60);
    const s = STATE.timerSeconds % 60;
    DOM.navTimer.textContent =
      String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0');
  }

  // ── Finish modal ───────────────────────────────────────────
  function showFinishModal() {
    const completed = STATE.completedModules.size;
    const total = STATE.totalModules;
    const elapsed = 2 * 60 * 60 - STATE.timerSeconds;
    const mins = Math.floor(elapsed / 60);

    DOM.finishTitle.textContent = 'Felicidades, ' + STATE.userName + '!';
    DOM.finishBody.innerHTML =
      '<div style="text-align:center;margin-bottom:1.5rem;">' +
        '<div class="avatar avatar-lg avatar-gradient" style="margin:0 auto 1rem;font-size:2rem;">&#10003;</div>' +
        '<p style="font-size:var(--text-lg);color:var(--text-primary);margin-bottom:0.5rem;">' +
          'Has completado <strong>' + completed + ' de ' + total + '</strong> modulos' +
        '</p>' +
        '<p style="color:var(--text-secondary);">en <strong>' + mins + ' minutos</strong></p>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">' +
        '<div class="card glass-subtle" style="padding:1rem;text-align:center;">' +
          '<div style="font-size:var(--text-2xl);font-weight:900;color:var(--blue-400);">' + STATE.correctAnswers + '/' + STATE.totalQuestions + '</div>' +
          '<small style="color:var(--text-muted);">Respuestas correctas</small>' +
        '</div>' +
        '<div class="card glass-subtle" style="padding:1rem;text-align:center;">' +
          '<div style="font-size:var(--text-2xl);font-weight:900;color:var(--orange-400);">' + Math.round((completed / total) * 100) + '%</div>' +
          '<small style="color:var(--text-muted);">Progreso total</small>' +
        '</div>' +
      '</div>' +
      '<p style="color:var(--text-secondary);font-size:var(--text-sm);text-align:center;">' +
        'Tu sistema <strong>' + escapeHtml(STATE.userName) + ' Brain</strong> esta listo para funcionar.' +
      '</p>';

    DOM.finishOverlay.style.display = 'flex';
  }

  function hideFinishModal() {
    DOM.finishOverlay.style.display = 'none';
  }

  function initFinishModal() {
    DOM.finishClose.addEventListener('click', hideFinishModal);
    DOM.finishOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.finishOverlay) hideFinishModal();
    });

    DOM.finishRestart.addEventListener('click', () => {
      // Reset state
      STATE.completedModules.clear();
      STATE.quizAnswers = {};
      STATE.quizResults = {};
      STATE.correctAnswers = 0;
      STATE.totalQuestions = 0;
      STATE.timerSeconds = 2 * 60 * 60;
      STATE.currentModule = 0;
      localStorage.removeItem('brainacademy_state');
      hideFinishModal();
      navigateToModule(0);
    });

    DOM.finishExport.addEventListener('click', exportProgress);
  }

  // ── Export ─────────────────────────────────────────────────
  function exportProgress() {
    const data = {
      userName: STATE.userName,
      completedModules: Array.from(STATE.completedModules),
      totalModules: STATE.totalModules,
      correctAnswers: STATE.correctAnswers,
      totalQuestions: STATE.totalQuestions,
      quizDetails: STATE.quizResults,
      timeRemainingSeconds: STATE.timerSeconds,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = STATE.userName.toLowerCase().replace(/\s+/g, '-') + '-brain-academy-progress.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── State persistence ──────────────────────────────────────
  function saveState() {
    const data = {
      userName: STATE.userName,
      currentModule: STATE.currentModule,
      completedModules: Array.from(STATE.completedModules),
      quizAnswers: STATE.quizAnswers,
      quizResults: STATE.quizResults,
      correctAnswers: STATE.correctAnswers,
      totalQuestions: STATE.totalQuestions,
      timerSeconds: STATE.timerSeconds,
    };
    localStorage.setItem('brainacademy_state', JSON.stringify(data));
  }

  // ── Boot ───────────────────────────────────────────────────
  function init() {
    initOnboarding();
    initFinishModal();

    // If user already onboarded and has saved state, go directly to learning
    const savedState = localStorage.getItem('brainacademy_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.userName) {
          STATE.userName = parsed.userName;
          DOM.onbName.value = parsed.userName;
          // Don't auto-navigate — let user click start again
          // But keep the button enabled
          DOM.onbStart.disabled = false;
        }
      } catch (e) { /* ignore */ }
    }
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
