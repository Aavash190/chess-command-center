// Data loaded via global window.chessCurriculum

class CommandCenter {
    constructor() {
        try {
            this.unlockedMonth = parseInt(localStorage.getItem('chess_unlocked_month')) || 1;
            this.currentMonth = parseInt(localStorage.getItem('chess_current_month')) || this.unlockedMonth;
            this.completedTasks = JSON.parse(localStorage.getItem('chess_tasks') || '{}');
            this.xp = parseInt(localStorage.getItem('chess_xp') || '0');
        } catch (e) {
            console.warn("CommandCenter: LocalStorage access blocked. Using defaults.", e);
            this.unlockedMonth = 1;
            this.currentMonth = 1;
            this.completedTasks = {};
            this.xp = 0;
        }
        this.rank = this.calculateRank();
        
        this.navContainer = document.getElementById('month-nav');
        this.taskList = document.getElementById('task-list');
        this.briefingOverlay = document.getElementById('mission-briefing-overlay');
        this.gateOverlay = document.getElementById('golden-gate-overlay');
        this.examContainer = document.getElementById('exam-trigger-container');
        this.startExamBtn = document.getElementById('start-exam-btn');
        this.statusBar = {
            focus: document.getElementById('active-focus-text'),
            rank: document.getElementById('user-rank-text'),
            xp: document.getElementById('daily-xp-text')
        };
        
        // Lab & View Switching
        this.dashboardView = document.getElementById('dashboard-view');
        this.labView = document.getElementById('lab-view');
        this.lab = new UniversalLab();
        window.lab = this.lab;
        
        this.init();
    }

    init() {
        this.currentMode = 'DASHBOARD';
        document.body.className = 'mode-dashboard';
        
        this.renderDashboard();
        this.setupEventListeners();
        this.setupViewSwitching();
        this.setupRankPopup();
    }

    switchMode(mode) {
        this.currentMode = mode;
        document.body.className = `mode-${mode.toLowerCase()}`;
        
        // Backup visibility management
        const intro = document.getElementById('intro-overlay');
        const onboard = document.getElementById('onboarding-overlay');
        const app = document.getElementById('app');

        if (mode === 'LANDING') {
            if (intro) intro.style.display = 'flex';
            if (onboard) onboard.style.display = 'none';
            if (app) app.style.display = 'none';
        } else if (mode === 'ONBOARDING') {
            if (intro) intro.style.display = 'none';
            if (onboard) onboard.style.display = 'flex';
            if (app) app.style.display = 'none';
        } else {
            if (intro) intro.style.display = 'none';
            if (onboard) onboard.style.display = 'none';
            if (app) app.style.display = 'block';
        }

        if (mode === 'ACADEMY') {
             window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    setupIntroScreen() {
        const gateBtn = document.getElementById('enter-cmd-gate');
        if (!gateBtn) return;

        gateBtn.onclick = (e) => {
            e.preventDefault();
            
            // Immediate visual transition for responsiveness
            const intro = document.getElementById('intro-overlay');
            if (intro) {
                intro.style.opacity = '0';
                setTimeout(() => { intro.style.display = 'none'; }, 500);
            }

            // Force onboarding if first time
            if (!localStorage.getItem('chess_journey_start')) {
                this.switchMode('ONBOARDING');
                this.renderOnboarding();
            } else {
                this.switchMode('DASHBOARD');
                this.renderDashboard();
            }
        };

        const initiateBtn = document.getElementById('initiate-journey-btn');
        if (initiateBtn) {
            initiateBtn.onclick = () => {
                localStorage.setItem('chess_journey_start', new Date().toISOString());
                localStorage.setItem('chess_unlocked_month', '1');
                this.unlockedMonth = 1;
                this.switchMode('DASHBOARD');
                this.renderDashboard();
            };
        }
    }

    renderOnboarding() {
        const roadmap = document.getElementById('onboarding-roadmap');
        if (!roadmap) return;
        
        roadmap.innerHTML = window.chessCurriculum.map((m, i) => {
            const firstCourse = m.courses && m.courses[0] ? m.courses[0] : null;
            const poster = (firstCourse && firstCourse.poster) ? firstCourse.poster : 'https://www.chessable.com/img/book-default-small.png';
            
            return `
                <div class="onboarding-card success-glint" onclick="window.cmdCenter.openBriefing(${i})">
                     <img src="${poster}" alt="Month ${i+1}">
                     <div class="onboarding-card-content">
                        <div class="onboarding-meta-month">PHASE ${i+1}</div>
                        <div class="onboarding-meta-title">${m.dailyFocus}</div>
                        <div class="onboarding-meta-desc">Click for Mission Intelligence</div>
                     </div>
                </div>
            `;
        }).join('');
    }

    openBriefing(index) {
        const m = window.chessCurriculum[index];
        const content = document.getElementById('briefing-content');
        if (!content) return;

        const coursesHtml = m.courses.map(c => `
            <div style="margin-bottom: 20px; border-left: 2px solid var(--accent); padding-left: 15px;">
                <h4 style="color: #fff; margin-bottom: 5px;">${c.title}</h4>
                <p style="font-size: 0.85rem; color: var(--text-dim);">${c.job}</p>
                <div style="font-size: 0.75rem; color: var(--cyan); margin-top: 5px;">
                    COACH: ${c.coach} • LEVEL: ${c.level} • ${c.superpower}
                </div>
            </div>
        `).join('');

        content.innerHTML = `
            <div style="text-align:center; margin-bottom: 30px;">
                <div style="font-size: 3rem; margin-bottom: 15px;">📁</div>
                <h2 class="shimmer-text" style="font-family: 'Outfit'; font-size: 2.2rem; margin-bottom: 5px; font-weight: 800; letter-spacing: 2px;">MISSION INTELLIGENCE: PHASE ${index+1}</h2>
                <p style="color: var(--accent); font-weight: 800; letter-spacing: 4px; font-size: 0.8rem; text-transform: uppercase;">Classified Mastery Protocol</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <p style="color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; display:flex; align-items:center; gap:10px;">
                    <span style="color:var(--accent);">🎯</span> Objective: ${m.dailyFocus}
                </p>
                <div style="display: grid; gap: 15px;">${coursesHtml}</div>
            </div>

            <div style="text-align:center; padding: 20px; border: 1px dashed var(--accent); border-radius: 12px;">
                <p style="color: var(--text-dim); font-size: 0.9rem; font-style: italic;">"${m.reward}"</p>
            </div>
        `;

        this.briefingOverlay.style.display = 'flex';
        
        document.getElementById('confirm-mission-btn').onclick = () => {
             this.briefingOverlay.style.display = 'none';
             if (index === 0) {
                 localStorage.setItem('chess_journey_start', new Date().toISOString());
                 this.switchMode('DASHBOARD');
                 this.renderDashboard();
             }
        };
    }

    closeBriefing() {
        this.briefingOverlay.style.display = 'none';
    }

    renderNav() {
        if (!this.navContainer) return;
        this.navContainer.style.display = 'flex';
        this.navContainer.innerHTML = '';
        
        for (let i = 1; i <= 12; i++) {
            const btn = document.createElement('div');
            const isUnlocked = i <= this.unlockedMonth;
            const isActive = this.currentMonth === i;

            btn.className = `month-btn ${isActive ? 'active' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`;
            btn.title = isUnlocked ? `Phase ${i}` : `Locked (Complete Phase ${i-1} to unlock)`;
            btn.innerHTML = isUnlocked ? i : '<span style="font-size:1rem; color:rgba(255,255,255,0.4);">🔒</span>';
            
            if (isUnlocked) {
                btn.onclick = () => this.switchMonth(i);
            }
            this.navContainer.appendChild(btn);
        }
    }

    renderDashboard() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (!window.chessCurriculum) {
            console.error("CommandCenter: Curriculum data missing!");
            return;
        }
        const data = window.chessCurriculum[this.currentMonth - 1];

        // Apply Month Theme
        this.applyTheme(data.theme);
        
        // Update Status Bar
        if (this.statusBar.focus) {
            this.statusBar.focus.innerHTML = `${data.dailyFocus} <span class="phase-tag">PHASE ${this.currentMonth}</span>`;
        }
        this.updateRankDisplay();
        this.updateXPDisplay();

        if (typeof renderCourseCard === 'function') {
            renderCourseCard(data);
        }

        this.renderTasks(data.tasks);
        this.renderNav();
        this.updateProgress();
        this.updateJourneyTracker();
        this.checkExamAvailability();
    }

    applyTheme(theme) {
        // Remove existing theme classes
        document.body.className = document.body.className.replace(/\btheme-\S+/g, '');
        if (theme) {
            document.body.classList.add(`theme-${theme}`);
        }
    }

    calculateRank() {
        // Calibrated for 1700 foundation -> 2400 (IM) Goal
        const ranks = [
            "Level 1: Advanced Club Player",
            "Level 2: Expert (2000)",
            "Level 3: Candidate Master (2100)",
            "Level 4: FIDE Master (FM) [2300]",
            "Level 5: International Master (IM) [2400]"
        ];
        if (this.currentMonth >= 12) return ranks[4];
        if (this.currentMonth >= 9) return ranks[3];
        if (this.currentMonth >= 6) return ranks[2];
        if (this.currentMonth >= 3) return ranks[1];
        return ranks[0];
    }

    updateRankDisplay() {
        if (this.statusBar.rank) {
            const currentRank = this.calculateRank();
            this.statusBar.rank.innerHTML = `${currentRank} <span style="font-size:0.7rem; color:var(--text-dim); margin-left:8px;">TARGET: 2400</span>`;
        }
    }

    updateXPDisplay() {
        if (this.statusBar.xp) this.statusBar.xp.innerText = `${this.xp} XP`;
    }
    
    updateJourneyTracker() {
        const journeyStartStr = localStorage.getItem('chess_journey_start');
        if (!journeyStartStr) return;
        
        const startDate = new Date(journeyStartStr);
        const now = new Date();
        const diffDays = Math.floor(Math.abs(now - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        // Update Header
        const headerDays = document.getElementById('journey-days-elapsed');
        const headerStart = document.getElementById('journey-start-date');
        if (headerDays) headerDays.innerText = `Day ${diffDays} of 365`;
        if (headerStart) headerStart.innerText = `Initiated: ${startDate.toLocaleDateString()} • IM Performance Tracking`;

        // Update Widget
        const widgetContainer = document.getElementById('journey-tracker-widget');
        const widgetDays = document.getElementById('journey-days-elapsed-widget');
        const widgetStart = document.getElementById('journey-start-date-widget');
        if (widgetContainer) widgetContainer.style.display = 'block';
        if (widgetDays) widgetDays.innerText = `Day ${diffDays}`;
        if (widgetStart) widgetStart.innerText = `Started: ${startDate.toLocaleDateString()}`;
    }

    renderTasks(tasks) {
        this.taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskId = `m${this.currentMonth}t${index}`;
            const isDone = this.completedTasks[taskId];
            
            const taskEl = document.createElement('div');
            taskEl.className = `task-item ${isDone ? 'complete' : ''}`;
            taskEl.innerHTML = `
                <div class="checkbox"></div>
                <span>${task}</span>
            `;
            taskEl.onclick = () => this.toggleTask(taskId);
            this.taskList.appendChild(taskEl);
        });
    }

    toggleTask(taskId) {
        const wasDone = !!this.completedTasks[taskId];
        this.completedTasks[taskId] = !this.completedTasks[taskId];
        localStorage.setItem('chess_tasks', JSON.stringify(this.completedTasks));
        
        if (this.completedTasks[taskId] && !wasDone) {
            this.xp += 50;
            localStorage.setItem('chess_xp', this.xp);
            
            const xpText = document.getElementById('daily-xp-text');
            if (xpText) {
                xpText.classList.add('xp-gain');
                setTimeout(() => xpText.classList.remove('xp-gain'), 600);
            }

            this.showPositivityToast();
            this.fireSmallConfetti();
            this.triggerHUDPulse();
        }
        
        this.renderDashboard();
    }

    updateProgress() {
        const data = window.chessCurriculum[this.currentMonth - 1];
        let done = 0;
        data.tasks.forEach((_, index) => {
            if (this.completedTasks[`m${this.currentMonth}t${index}`]) done++;
        });

        const pct = Math.round((done / data.tasks.length) * 100);
        document.getElementById('completion-text').innerText = `Monthly Strength Gain: ${pct}%`;
        return pct;
    }

    checkExamAvailability() {
        const pct = this.updateProgress();
        if (pct >= 100) {
            this.examContainer.style.display = 'block';
            this.startExamBtn.disabled = false;
        } else {
            this.examContainer.style.display = 'block'; // Always show but maybe disabled?
            this.startExamBtn.disabled = true;
            this.startExamBtn.innerHTML = `<span>🔒 Complete Tasks to Unlock Exam</span>`;
        }

        // If already passed exam for this month
        if (localStorage.getItem(`month_exam_passed_${this.currentMonth}`)) {
            this.startExamBtn.innerHTML = `<span>✅ EXAM PASSED</span>`;
            this.startExamBtn.style.background = 'var(--accent)';
            this.startExamBtn.disabled = true;
        } else if (pct >= 100) {
            this.startExamBtn.innerHTML = `<span>⚔️ TAKE MONTHLY EXAM</span>`;
            this.startExamBtn.style.background = 'var(--premium-gradient)';
        }
    }

    switchMonth(month) {
        this.currentMonth = month;
        localStorage.setItem('chess_current_month', month);
        this.renderNav();
        this.renderDashboard();
    }

    showReward(data) {
        if (this.currentMonth >= 12) {
             // Graduation case
             this.fireMegaConfetti();
             alert("CONGRATULATIONS ARCHITECT. YOU HAVE COMPLETED THE ROAD TO 2400.");
             return;
        }

        const gateOverlay = this.gateOverlay;
        if (!gateOverlay) return;

        gateOverlay.style.display = 'flex';
        this.fireMegaConfetti();

        document.getElementById('unlock-next-month-btn').onclick = () => {
             gateOverlay.style.display = 'none';
             this.unlockedMonth++;
             localStorage.setItem('chess_unlocked_month', this.unlockedMonth);
             this.switchMonth(this.unlockedMonth);
             this.showPositivityToast();
        };
    }

    fireSmallConfetti() {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.9 }, colors: ['#2ea043', '#58a6ff', '#fff'] });
        }
    }

    fireMegaConfetti() {
        if (typeof confetti !== 'function') return;
        const end = Date.now() + 3000;
        const colors = ['#2ea043', '#ffffff', '#58a6ff'];
        (function frame() {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }

    triggerHUDPulse() {
        const hud = document.querySelector('.premium-status-bar');
        if (hud) {
            hud.classList.add('hud-pulse');
            setTimeout(() => hud.classList.remove('hud-pulse'), 1000);
        }
    }

    showPositivityToast() {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const quote = window.positivityQuotes ? window.positivityQuotes[Math.floor(Math.random() * window.positivityQuotes.length)] : "Excellence is a habit.";
        this.showToast(quote, "success", "Task Secure");
    }

    showToast(message, type = "info", title = "System Notification") {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<div style="color:var(--theme-accent); font-weight:700; font-size:0.8rem; text-transform:uppercase; margin-bottom:4px;">${title}</div><div style="font-size:0.95rem;">${message}</div>`;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; setTimeout(() => toast.remove(), 300); }, 4000);
    }

    setupEventListeners() {
        if (this.startExamBtn) {
            this.startExamBtn.onclick = () => {
                if (typeof startMonthlyExam === 'function') {
                    startMonthlyExam(this.currentMonth);
                }
            };
        }
    }

    setupViewSwitching() {
        const dashBtn = document.getElementById('view-dashboard-btn');
        const labBtn = document.getElementById('view-lab-btn');
        
        if (dashBtn && labBtn) {
            dashBtn.onclick = () => {
                this.dashboardView.style.display = 'grid';
                this.labView.style.display = 'none';
                dashBtn.classList.add('active');
                labBtn.classList.remove('active');
            };
            
            labBtn.onclick = () => {
                this.dashboardView.style.display = 'none';
                this.labView.style.display = 'block';
                labBtn.classList.add('active');
                dashBtn.classList.remove('active');
                // Auto-resize lab board
                if (this.lab && this.lab.board) this.lab.board.resize();
            };
        }
    }

    setupRankPopup() {
        const trigger = document.getElementById('rank-info-trigger');
        const popup = document.getElementById('rank-progression-popup');
        
        if (trigger && popup) {
            trigger.onmouseenter = () => popup.classList.add('visible');
            trigger.onmouseleave = () => popup.classList.remove('visible');
            // Mobile toggle
            trigger.onclick = (e) => {
                e.stopPropagation();
                popup.classList.toggle('visible');
            };
            document.onclick = () => popup.classList.remove('visible');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.cmdCenter = new CommandCenter();
    window.showToast = (msg, type, title) => window.cmdCenter.showToast(msg, type, title);
});
