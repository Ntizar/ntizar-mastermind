/* ============================================================
   BRAIN ACADEMY — Platform Engine v2.0
   Simple, robust version with profiles and gamification
   ============================================================ */

(function () {
  'use strict';

  const STATE = {
    userName: '',
    userProfile: null,
    currentModule: 0,
    totalModules: 6,
    completedModules: new Set(),
    quizAnswers: {},
    quizResults: {},
    totalQuestions: 0,
    correctAnswers: 0,
    timerSeconds: 2 * 60 * 60,
    timerInterval: null,
    modules: null,
    profiles: null,
    xp: 0,
    level: 1,
    badges: [],
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ── Onboarding ─────────────────────────────────────────────
  function init() {
    console.log('🧠 Brain Academy v2.0 starting...');
    
    // Clear v1 state if exists (prevent conflicts)
    if (localStorage.getItem('brainacademy_state')) {
      console.log('🗑️  Clearing old v1 state...');
      localStorage.removeItem('brainacademy_state');
    }

    const onbName = $('#onb-name');
    const onbStart = $('#onb-start');

    if (!onbName || !onbStart) {
      console.error('❌ Onboarding elements not found!');
      return;
    }

    // Restore name
    const savedName = localStorage.getItem('brainacademy_name');
    if (savedName) {
      onbName.value = savedName;
      onbStart.disabled = false;
    }

    // Name input handler
    onbName.addEventListener('input', () => {
      onbStart.disabled = onbName.value.trim().length === 0;
    });

    // Start button handler
    onbStart.addEventListener('click', () => {
      const name = onbName.value.trim();
      if (!name) return;
      
      console.log('✅ Starting with name:', name);
      STATE.userName = name;
      localStorage.setItem('brainacademy_name', name);
      
      showProfileSelection();
    });

    // Enter key handler
    onbName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !onbStart.disabled) {
        onbStart.click();
      }
    });
  }

  // ── Profile Selection ──────────────────────────────────────
  async function showProfileSelection() {
    console.log('📋 Loading profiles...');
    
    try {
      const resp = await fetch('profiles.json');
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      STATE.profiles = await resp.json();
      console.log('✅ Profiles loaded:', Object.keys(STATE.profiles.profiles).length);
    } catch (err) {
      console.error('❌ Error loading profiles:', err);
      alert('Error cargando perfiles: ' + err.message + '\n\nRecarga la página (F5).');
      return;
    }

    const container = $('#screen-onboarding .container');
    if (!container) {
      console.error('❌ Container not found!');
      return;
    }

    container.innerHTML = `
      <div class="text-center animate-fade-up">
        <div class="navbar-brand-dot" style="width:14px;height:14px;margin:0 auto 1.5rem;"></div>
        <h1 class="hero-title">
          <span class="text-gradient">Hola, ${escapeHtml(STATE.userName)}</span>
        </h1>
        <p style="color:var(--text-secondary);font-size:var(--text-lg);margin-top:1rem;max-width:580px;margin-left:auto;margin-right:auto;">
          Elige tu perfil para personalizar el contenido. Verás ejemplos y vocabulario adaptado a tu tipo de trabajo.
        </p>
      </div>

      <div class="grid grid-3 gap-4" style="margin-top:2.5rem;">
        ${renderProfiles()}
      </div>

      <p style="text-align:center;margin-top:2rem;color:var(--text-muted);font-size:var(--text-sm);">
        Puedes cambiar de perfil más tarde en la configuración.
      </p>
    `;
  }

  function renderProfiles() {
    if (!STATE.profiles || !STATE.profiles.profiles) return '';
    
    const glassClasses = ['glass-refract', 'glass-specular', 'glass-refract', 'glass-specular', 'glass-refract'];
    
    return Object.values(STATE.profiles.profiles).map((profile, idx) => `
      <div class="card card-glass glass-standard ${glassClasses[idx] || ''} animate-fade-up" 
           style="padding:1.5rem;cursor:pointer;transition:all 0.3s ease;border:1px solid rgba(59,130,246,0.2);position:relative;overflow:hidden;"
           onmouseover="this.style.transform='translateY(-8px) scale(1.02)';this.style.boxShadow='0 20px 40px rgba(59,130,246,0.3), inset 0 0 20px rgba(59,130,246,0.1)';"
           onmouseout="this.style.transform='translateY(0) scale(1)';this.style.boxShadow='';"
           onclick="selectProfile('${profile.id}')">
        <div style="position:absolute;top:-50%;right:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(59,130,246,0.15) 0%,transparent 70%);opacity:0;transition:opacity 0.3s;"
             onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0'"></div>
        <div style="position:relative;z-index:1;">
          <div style="font-size:3rem;margin-bottom:0.75rem;text-shadow:0 0 20px rgba(59,130,246,0.5);filter:drop-shadow(0 4px 8px rgba(0,0,0,0.3));">${profile.icono}</div>
          <h3 style="margin-bottom:0.5rem;color:var(--blue-400);text-shadow:0 0 10px rgba(59,130,246,0.3);">${profile.nombre}</h3>
          <p style="color:var(--text-secondary);font-size:var(--text-sm);min-height:60px;line-height:1.5;">${profile.descripcion}</p>
          <p style="margin-top:1rem;font-size:var(--text-xs);color:var(--blue-300);background:rgba(59,130,246,0.1);padding:0.5rem 0.75rem;border-radius:6px;display:inline-block;">
            ⏱️ ${profile.duracion_total}
          </p>
        </div>
      </div>
    `).join('');
  }

  // Global function for onclick
  window.selectProfile = function(profileId) {
    console.log('✅ Profile selected:', profileId);
    STATE.userProfile = STATE.profiles.profiles[profileId];
    localStorage.setItem('brainacademy_profile', profileId);
    
    // Show learning screen
    $$('.screen').forEach(s => s.classList.remove('active'));
    $('#screen-learning').classList.add('active');
    
    loadModules();
  };

  // ── Module loading ─────────────────────────────────────────
  async function loadModules() {
    console.log('📚 Loading modules...');
    
    try {
      const resp = await fetch('modules-v2.json');
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      STATE.modules = await resp.json();
      console.log('✅ Modules loaded:', Object.keys(STATE.modules).length - 2); // minus version keys
      
      initLearningScreen();
    } catch (err) {
      console.error('❌ Error loading modules:', err);
      $('#module-content').innerHTML = 
        '<div class="lesson"><h3>Error</h3><p>No se pudo cargar modules-v2.json</p><p>' + err.message + '</p></div>';
    }
  }

  // ── Learning screen init ───────────────────────────────────
  function initLearningScreen() {
    $('#nav-system-name').textContent = STATE.userName + ' Academy';
    initTabs();
    startTimer();
    navigateToModule(STATE.currentModule);
    updateProgress();
  }

  // ── Tabs ───────────────────────────────────────────────────
  function initTabs() {
    $('#module-tabs').addEventListener('click', (e) => {
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
    const modData = STATE.modules['mod' + modIndex];

    if (!modData) {
      $('#module-content').innerHTML = '<div class="lesson"><h3>Módulo no encontrado</h3></div>';
      return;
    }

    let html = modData.content;
    html = personalize(html);
    $('#module-content').innerHTML = html;

    bindNavButtons();
    bindQuizzes();
    restoreQuizState();
    updateTabStates();
    updateProgress();
    saveState();
  }

  // ── Personalization ────────────────────────────────────────
  function personalize(html) {
    const name = STATE.userName || 'Usuario';
    const profile = STATE.userProfile || { 
      nombre: 'Usuario', 
      descripcion: 'Perfil no seleccionado',
      duracion_total: '~2h',
      duracion_modulos: {},
      ejemplos_dominio: [],
      casos_uso: []
    };

    const replace = (placeholder, value) => {
      if (!value && value !== 0) return;
      html = html.split(placeholder).join(value);
    };

    replace('{{NAME}}', '<span class="user-name">' + escapeHtml(name) + '</span>');
    replace('{{DURACION_TOTAL}}', profile.duracion_total || '~2h');
    
    // Duraciones por módulo
    const durations = profile.duracion_modulos || {};
    replace('{{DURACION_M1}}', durations.M1 || '~20 min');
    replace('{{DURACION_M2}}', durations.M2 || '~25 min');
    replace('{{DURACION_M3}}', durations.M3 || '~20 min');
    replace('{{DURACION_M4}}', durations.M4 || '~25 min');
    replace('{{DURACION_M5}}', durations.M5 || '~25 min');

    // Perfil
    replace('{{PERFIL_NOMBRE}}', profile.nombre || 'Usuario');
    replace('{{PERFIL_DESCRIPCION}}', profile.descripcion || '');

    // Ejemplos dominio
    if (profile.ejemplos_dominio && Array.isArray(profile.ejemplos_dominio)) {
      const ejemplos = profile.ejemplos_dominio.slice(0, 3).map(capitalize).join(', ');
      replace('{{EJEMPLOS_DOMINIO}}', ejemplos);
      
      const ejemplos1 = profile.ejemplos_dominio;
      replace('{{EJEMPLO_RELEVANTE_1}}', capitalize(ejemplos1[0] || 'un dashboard'));
      replace('{{EJEMPLO_RELEVANTE_2}}', capitalize(ejemplos1[1] || 'un documento'));
      replace('{{EJEMPLO_RELEVANTE_3}}', capitalize(ejemplos1[2] || 'un plan'));
    }

    // Casos de uso
    if (profile.casos_uso && Array.isArray(profile.casos_uso)) {
      replace('{{CASOS_USO}}', profile.casos_uso.slice(0, 3).join(', '));
      replace('{{CASOS_USO_LIST}}', profile.casos_uso.slice(0, 4).map(c => '<li>' + c + '</li>').join(''));
      replace('{{EJEMPLO_TAREA_PERFIL}}', profile.casos_uso[0] || 'una tarea de ejemplo');
    }

    return html;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ── Navigation ─────────────────────────────────────────────
  function bindNavButtons() {
    $('#module-content').querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextIndex = parseInt(btn.dataset.next.replace('mod', ''), 10);
        STATE.completedModules.add(STATE.currentModule);
        awardXP(50);
        navigateToModule(nextIndex);
      });
    });

    $('#module-content').querySelectorAll('[data-prev]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const prevIndex = parseInt(btn.dataset.prev.replace('mod', ''), 10);
        navigateToModule(prevIndex);
      });
    });

    const finishBtn = $('#module-content #finish-btn');
    if (finishBtn) {
      finishBtn.addEventListener('click', (e) => {
        e.preventDefault();
        STATE.completedModules.add(STATE.currentModule);
        awardXP(200);
        updateProgress();
        showFinishModal();
      });
    }
  }

  // ── Quizzes ────────────────────────────────────────────────
  function bindQuizzes() {
    // Simple quiz handling
  }

  function restoreQuizState() {
    // Restore previous answers
  }

  // ── Progress ───────────────────────────────────────────────
  function updateProgress() {
    const completed = STATE.completedModules.size;
    const total = STATE.totalModules;
    const pct = Math.round((completed / total) * 100);

    const bar = $('#progress-bar');
    const label = $('#progress-label-text');
    const pctLabel = $('#progress-label-pct');
    const navProg = $('#nav-progress');

    if (bar) bar.style.width = pct + '%';
    if (label) label.textContent = 'Módulo ' + STATE.currentModule + ' de ' + (total - 1);
    if (pctLabel) pctLabel.textContent = pct + '%';
    if (navProg) navProg.textContent = pct + '%';
  }

  // ── Timer ──────────────────────────────────────────────────
  function startTimer() {
    const timerEl = $('#nav-timer');
    if (!timerEl) return;
    
    const update = () => {
      const h = Math.floor(STATE.timerSeconds / 3600);
      const m = Math.floor((STATE.timerSeconds % 3600) / 60);
      const s = STATE.timerSeconds % 60;
      timerEl.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    };
    
    update();
    STATE.timerInterval = setInterval(() => {
      if (STATE.timerSeconds > 0) {
        STATE.timerSeconds--;
        update();
      } else {
        clearInterval(STATE.timerInterval);
      }
    }, 1000);
  }

  // ── Gamification ───────────────────────────────────────────
  const BADGES = [
    { id: 'first_module', name: 'Primera Misión', icon: '🏁', desc: 'Completar M0', check: (s) => s.completedModules.has(0) },
    { id: 'architect', name: 'Arquitecto', icon: '🧠', desc: 'M1 quiz 100%', check: (s) => s.quizResults['q-1-1'] && s.quizResults['q-1-2'] },
    { id: 'agent_tamer', name: 'Domador de Agentes', icon: '🤖', desc: 'M2 quiz 100%', check: (s) => s.quizResults['q-2-1'] && s.quizResults['q-2-2'] && s.quizResults['q-2-3'] },
    { id: 'fast_learner', name: 'Rápido y Furioso', icon: '⚡', desc: 'Completar en <90min', check: (s) => (2*60*60 - s.timerSeconds) < 90*60 && s.completedModules.size === 6 },
    { id: 'sharpshooter', name: 'Francotirador', icon: '🎯', desc: '90%+ en quizzes', check: (s) => s.totalQuestions > 0 && (s.correctAnswers / s.totalQuestions) >= 0.9 },
    { id: 'graduate', name: 'Graduado', icon: '🎓', desc: 'Completar todos los módulos', check: (s) => s.completedModules.size === 6 },
    { id: 'master', name: 'Maestro Brain', icon: '💎', desc: '100% + todos los badges', check: (s) => s.badges?.length === 6 },
  ];

  function awardXP(amount) {
    STATE.xp += amount;
    const oldLevel = STATE.level;
    STATE.level = Math.floor(STATE.xp / 200) + 1;
    
    if (STATE.level > oldLevel) {
      setTimeout(() => alert('🎉 ¡Nivel ' + STATE.level + ' alcanzado!'), 100);
    }
    
    // Check for new badges
    checkBadges();
    
    saveState();
  }

  function checkBadges() {
    if (!STATE.badges) STATE.badges = [];
    
    BADGES.forEach(badge => {
      if (!STATE.badges.includes(badge.id) && badge.check(STATE)) {
        STATE.badges.push(badge.id);
        setTimeout(() => {
          alert(`🏅 ¡Badge desbloqueado!\n\n${badge.icon} ${badge.name}\n${badge.desc}`);
        }, 200);
      }
    });
  }

  function getBadge(badgeId) {
    return BADGES.find(b => b.id === badgeId);
  }

  // ── Finish Modal ───────────────────────────────────────────
  function showFinishModal() {
    const completed = STATE.completedModules.size;
    const total = STATE.totalModules;
    const elapsed = 2 * 60 * 60 - STATE.timerSeconds;
    const mins = Math.floor(elapsed / 60);
    const badges = STATE.badges || [];

    $('#finish-title').textContent = 'Felicidades, ' + STATE.userName + '!';
    
    let badgesHtml = '';
    if (badges.length > 0) {
      badgesHtml = `<div class="card glass-standard glass-refract" style="margin:1rem 0;padding:1rem;background:rgba(59,130,246,0.15);border-radius:12px;border:1px solid rgba(59,130,246,0.3);box-shadow:0 8px 32px rgba(59,130,246,0.2), inset 0 0 20px rgba(59,130,246,0.1);">
        <h4 style="margin-bottom:0.75rem;font-size:var(--text-sm);color:var(--blue-300);text-shadow:0 0 10px rgba(59,130,246,0.5);">🏅 Badges Desbloqueados (${badges.length}/${BADGES.length})</h4>
        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;">
          ${badges.map(id => {
            const badge = getBadge(id);
            return badge ? `<span style="font-size:2rem;filter:drop-shadow(0 0 8px rgba(59,130,246,0.4));transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="${badge.name}: ${badge.desc}">${badge.icon}</span>` : '';
          }).join('')}
        </div>
      </div>`;
    } else {
      badgesHtml = `<p style="margin:1rem 0;color:var(--text-muted);font-size:var(--text-sm);">Completa quizzes y módulos para desbloquear badges</p>`;
    }

    const stats = [
      { value: `${STATE.correctAnswers}/${STATE.totalQuestions}`, label: 'Aciertos', color: 'var(--blue-400)', glow: 'rgba(59,130,246,0.3)' },
      { value: `${Math.round((completed / total) * 100)}%`, label: 'Progreso', color: 'var(--orange-400)', glow: 'rgba(249,115,22,0.3)' },
      { value: STATE.xp, label: 'XP', color: 'var(--green-400)', glow: 'rgba(34,197,94,0.3)' },
      { value: `N${STATE.level}`, label: 'Nivel', color: 'var(--purple-400)', glow: 'rgba(168,85,247,0.3)' },
    ];

    $('#finish-body').innerHTML = `
      <div style="text-align:center;margin-bottom:1.5rem;">
        <div class="avatar avatar-lg avatar-gradient" style="margin:0 auto 1rem;font-size:2.5rem;filter:drop-shadow(0 0 20px rgba(59,130,246,0.5));animation:pulse 2s ease-in-out infinite;">✓</div>
        <p style="font-size:var(--text-xl);color:var(--text-primary);margin-bottom:0.5rem;text-shadow:0 0 20px rgba(255,255,255,0.2);">
          <strong>${completed}/${total} módulos</strong> completados
        </p>
        <p style="color:var(--text-secondary);font-size:var(--text-sm);">en <strong>${mins} minutos</strong></p>
        <p style="color:var(--blue-300);font-size:var(--text-xs);margin-top:0.5rem;">Perfil: ${STATE.userProfile?.nombre || 'No seleccionado'}</p>
      </div>
      
      ${badgesHtml}
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
        ${stats.map(stat => `
          <div class="card glass-standard glass-refract" style="padding:1rem;text-align:center;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);box-shadow:0 8px 32px ${stat.glow}, inset 0 0 20px rgba(255,255,255,0.05);transition:transform 0.2s;"
               onmouseover="this.style.transform='translateY(-4px) scale(1.05)'">
            <div style="font-size:var(--text-2xl);font-weight:900;color:${stat.color};text-shadow:0 0 15px ${stat.glow};margin-bottom:0.25rem;">${stat.value}</div>
            <small style="color:var(--text-muted);font-size:var(--text-xs);text-transform:uppercase;letter-spacing:0.5px;">${stat.label}</small>
          </div>
        `).join('')}
      </div>
    `;

    $('#finish-overlay').style.display = 'flex';
  }

  // ── Modal handlers ─────────────────────────────────────────
  function initFinishModal() {
    const overlay = $('#finish-overlay');
    const close = $('#finish-close');
    const restart = $('#finish-restart');
    const exportBtn = $('#finish-export');

    if (close) close.addEventListener('click', () => { overlay.style.display = 'none'; });
    if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.style.display = 'none'; });
    
    if (restart) restart.addEventListener('click', () => {
      STATE.completedModules.clear();
      STATE.quizAnswers = {};
      STATE.quizResults = {};
      STATE.correctAnswers = 0;
      STATE.totalQuestions = 0;
      STATE.timerSeconds = 2 * 60 * 60;
      STATE.currentModule = 0;
      STATE.xp = 0;
      STATE.level = 1;
      localStorage.removeItem('brainacademy_state_v2');
      overlay.style.display = 'none';
      navigateToModule(0);
    });

    if (exportBtn) exportBtn.addEventListener('click', exportProgress);
  }

  function exportProgress() {
    console.log('📄 Generating PDF guide...');
    
    // Check if jsPDF is loaded
    if (!window.jspdf) {
      alert('⚠️ Cargando librería PDF... espera un momento y vuelve a intentar.');
      console.error('jsPDF not loaded yet');
      return;
    }
    
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      const userName = STATE.userName || 'Usuario';
      const profile = STATE.userProfile?.nombre || 'No seleccionado';
      const level = STATE.level;
      const xp = STATE.xp;
      const completed = STATE.completedModules.size;
      const date = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
      
      // Header
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(`${userName} Brain`, 105, 18, { align: 'center' });
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Tu Sistema de Agentes IA', 105, 28, { align: 'center' });
      
      // User info box
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(20, 45, 170, 20, 3, 3, 'F');
      doc.text(`Perfil: ${profile}  |  Nivel: ${level} (${xp} XP)  |  Progreso: ${completed}/6 módulos`, 25, 55);
      doc.text(`Fecha: ${date}`, 25, 62);
      
      // Installation steps
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(59, 130, 246);
      doc.text('📥 Instalación en 4 Pasos', 20, 80);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      
      const steps = [
        '1. Instala Obsidian → https://obsidian.md/download (gratis, ~100MB)',
        '2. Crea un vault llamado "' + userName + ' Brain"',
        '3. Copia MASTERTMIND/ dentro de tu vault',
        '4. Abre OpenCode y pega session-prompt.md'
      ];
      
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(20, 85, 170, 45, 3, 3, 'F');
      
      steps.forEach((step, i) => {
        doc.text(step, 25, 95 + (i * 9));
      });
      
      // Profile-specific tips
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(249, 115, 22);
      doc.text('💡 Consejos para tu Perfil', 20, 140);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      
      let profileTips = '• Sigue los ejemplos del módulo M5';
      if (profile.includes('No-programador')) {
        profileTips = '• Evita jerga técnica — usa lenguaje natural\n• Enfócate en automatizar tareas repetitivas\n• Ejemplo: crear SOPs, analizar datos simples';
      } else if (profile.includes('Junior')) {
        profileTips = '• Usa el skill software-dev.md\n• Pide al sistema que explique el código\n• Ejemplo: debuggear, refactorizar, tests';
      } else if (profile.includes('Consultor')) {
        profileTips = '• Crea un hub por cliente\n• Usa clusters para organizar proyectos\n• Ejemplo: análisis CSV, propuestas, reportes';
      } else if (profile.includes('Equipo')) {
        profileTips = '• Comparte el vault con tu equipo\n• Documenta procesos en learnings\n• Ejemplo: onboarding, retrospectivas, SOPs';
      } else if (profile.includes('Estudiante')) {
        profileTips = '• Usa el sistema para organizar apuntes\n• Pide resúmenes de papers y textos\n• Ejemplo: estudiar, investigar, presentar';
      }
      
      doc.setFillColor(255, 247, 240);
      doc.roundedRect(20, 145, 170, 25, 3, 3, 'F');
      
      // Split text to fit in box
      const splitTips = doc.splitTextToSize(profileTips, 165);
      doc.text(splitTips, 25, 153);
      
      // Resources
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(59, 130, 246);
      doc.text('🔗 Recursos Esenciales', 20, 180);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text('• OpenCode: github.com/anomalyco/opencode/releases', 25, 188);
      doc.text('• Documentación: AGENTS.md en tu vault', 25, 194);
      doc.text('• Platforma: learning-platform-roan-six.vercel.app', 25, 200);
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Generado por ' + userName + ' Academy', 105, 280, { align: 'center' });
      doc.text('Sistema de Agentes Inteligentes sobre Obsidian', 105, 285, { align: 'center' });
      
      // Save
      const safeName = userName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      doc.save(safeName + '-brain-guia.pdf');
      console.log('✅ PDF generated successfully!');
      
    } catch (err) {
      console.error('PDF export error:', err);
      alert('❌ Error generando PDF: ' + err.message + '\n\nAbre la consola (F12) para más detalles.');
    }
  }

  // ── State ──────────────────────────────────────────────────
  function saveState() {
    const data = {
      userName: STATE.userName,
      userProfile: STATE.userProfile,
      currentModule: STATE.currentModule,
      completedModules: Array.from(STATE.completedModules),
      quizAnswers: STATE.quizAnswers,
      quizResults: STATE.quizResults,
      correctAnswers: STATE.correctAnswers,
      totalQuestions: STATE.totalQuestions,
      timerSeconds: STATE.timerSeconds,
      xp: STATE.xp,
      level: STATE.level,
      badges: STATE.badges,
    };
    localStorage.setItem('brainacademy_state_v2', JSON.stringify(data));
  }

  // ── Boot ───────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
