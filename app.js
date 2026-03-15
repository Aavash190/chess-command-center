// Data loaded via global window.chessCurriculum

class CommandCenter {
    constructor() {
        this.currentMonth = this.calculateJourneyMonth() || parseInt(localStorage.getItem('chess_current_month')) || 1;
        this.completedTasks = JSON.parse(localStorage.getItem('chess_tasks')) || {};
        this.xp = parseInt(localStorage.getItem('chess_xp')) || 0;
        this.rank = this.calculateRank();
        
        this.navContainer = document.getElementById('month-nav');
        this.taskList = document.getElementById('task-list');
        this.rewardOverlay = document.getElementById('reward-overlay');
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

    calculateJourneyMonth() {
        const journeyStartStr = localStorage.getItem('chess_journey_start');
        if (!journeyStartStr) return null;
        
        const startDate = new Date(journeyStartStr);
        const now = new Date();
        const diffTime = Math.abs(now - startDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        const month = Math.floor(diffDays / 30) + 1;
        return Math.min(12, month);
    }

    init() {
        this.setupIntroScreen();
        this.renderNav();
        this.renderDashboard();
        this.setupEventListeners();
        this.setupViewSwitching();
        this.setupRankPopup();
    }

    setupIntroScreen() {
        // ... (Quotes as before)
        const gmIntros = [
            { author: "GM Garry Kasparov", quote: "Hard work is a talent. The ability to keep pushing yourself when everyone else has quit is a talent.", image: "assets/gm/kasparov.jpg" },
            { author: "GM Magnus Carlsen", quote: "Without the element of enjoyment, it is not worth trying to excel at anything.", image: "assets/gm/carlsen.jpg" },
            { author: "GM Bobby Fischer", quote: "You have to have the fighting spirit. You have to force moves and take chances.", image: "assets/gm/fischer.jpg" },
            { author: "GM Viswanathan Anand", quote: "Confidence comes from hours and days and weeks and years of constant work and dedication.", image: "assets/gm/anand.jpg" },
            { author: "GM Judit Polgár", quote: "Chess is not about memorizing moves. It's about understanding ideas.", image: "assets/gm/polgar.jpg" }
        ];

        const randomIntro = gmIntros[Math.floor(Math.random() * gmIntros.length)];
        const introOverlay = document.getElementById('intro-overlay');
        const appElement = document.getElementById('app');
        
        if (introOverlay) {
            document.getElementById('intro-gm-img').src = randomIntro.image;
            document.getElementById('intro-quote').innerText = `"${randomIntro.quote}"`;
            document.getElementById('intro-author').innerText = `— ${randomIntro.author}`;
            
            document.getElementById('enter-cmd-btn').onclick = () => {
                introOverlay.style.opacity = '0';
                setTimeout(() => {
                    introOverlay.style.display = 'none';
                    localStorage.setItem('chess_journey_start', localStorage.getItem('chess_journey_start') || new Date().toISOString());
                    appElement.style.display = 'block';
                    this.updateJourneyTracker();
                }, 500);
            };
        }
    }

    renderNav() {
        this.navContainer.innerHTML = '';
        // Subtle month dots/pills instead of big buttons
        for (let i = 1; i <= 12; i++) {
            const btn = document.createElement('div');
            btn.className = `month-btn ${this.currentMonth === i ? 'active' : ''}`;
            btn.title = `Month ${i}`;
            btn.innerHTML = i;
            
            // Allow navigating to all months for browsing
            btn.onclick = () => this.switchMonth(i);
            if (i > this.currentMonth) {
                btn.style.opacity = '0.6';
                btn.title = `Month ${i} (Future Phase)`;
            }
            this.navContainer.appendChild(btn);
        }
    }

    renderDashboard() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const data = chessCurriculum[this.currentMonth - 1];

        // Apply Month Theme
        this.applyTheme(data.theme);
        
        // Update Status Bar
        if (this.statusBar.focus) this.statusBar.focus.innerText = data.dailyFocus || "GENERAL STUDY";
        this.updateRankDisplay();
        this.updateXPDisplay();

        if (typeof renderCourseCard === 'function') {
            renderCourseCard(data);
        }

        this.renderTasks(data.tasks);
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
        const widget = document.getElementById('journey-tracker-widget');
        if (!journeyStartStr || !widget) return;
        
        widget.style.display = 'block';
        const startDate = new Date(journeyStartStr);
        const now = new Date();
        const diffDays = Math.floor(Math.abs(now - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        document.getElementById('journey-days-elapsed').innerText = `Day ${diffDays}: Mission Focus`;
        document.getElementById('journey-start-date').innerText = `Elite Status: Month ${this.currentMonth}`;
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
            this.showPositivityToast();
            this.fireSmallConfetti();
            this.triggerHUDPulse();
        }
        
        this.renderDashboard();
    }

    updateProgress() {
        const data = chessCurriculum[this.currentMonth - 1];
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
        document.getElementById('reward-title').innerText = "PHASE MASTERED";
        document.getElementById('reward-desc').innerHTML = `
            <div style="font-size: 1.4rem; color: var(--theme-accent); margin-bottom: 25px; font-weight: 800; font-family: 'Outfit';">
                ${data.reward}
            </div>
            <p style="color: var(--text-main); line-height: 1.8; font-size: 1.1rem; margin-bottom: 20px;">
                You have successfully completed the <b>${data.dailyFocus}</b> protocol.<br>
                Strength Gain: <span style="color:var(--accent); font-weight:800;">+25 Elo Est.</span>
            </p>
            <p style="font-style: italic; color: var(--text-dim); border-top: 1px solid var(--glass-border); padding-top: 20px;">
                "Your tactical vision has reached a new threshold. Proceed to the next objective."
            </p>
        `;
        this.rewardOverlay.style.display = 'flex';
        this.fireMegaConfetti();
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
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<div style="color:var(--accent); font-weight:700; font-size:0.8rem; text-transform:uppercase; margin-bottom:4px;">Task Secure</div><div style="font-size:0.95rem;">"${quote}"</div>`;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; setTimeout(() => toast.remove(), 300); }, 4000);
    }

    setupEventListeners() {
        document.getElementById('close-reward').onclick = () => {
            this.rewardOverlay.style.display = 'none';
            if (this.currentMonth < 12) this.switchMonth(this.currentMonth + 1);
        };

        this.startExamBtn.onclick = () => {
            if (typeof startMonthlyExam === 'function') {
                startMonthlyExam(this.currentMonth);
            }
        };
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
});
