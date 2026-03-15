// Data loaded via global window.chessCurriculum

class CommandCenter {
    constructor() {
        this.currentMonth = parseInt(localStorage.getItem('chess_current_month')) || 1;
        this.completedTasks = JSON.parse(localStorage.getItem('chess_tasks')) || {};
        
        this.navContainer = document.getElementById('month-nav');
        this.taskList = document.getElementById('task-list');
        this.rewardOverlay = document.getElementById('reward-overlay');
        
        this.init();
    }

    init() {
        this.setupIntroScreen();
        this.renderNav();
        this.renderDashboard();
        this.setupEventListeners();
    }

    setupIntroScreen() {
        const gmIntros = [
            {
                author: "GM Garry Kasparov",
                quote: "Hard work is a talent. The ability to keep pushing yourself when everyone else has quit is a talent.",
                image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Garry_Kasparov_-_1987_-_cropped.jpg"
            },
            {
                author: "GM Magnus Carlsen",
                quote: "Without the element of enjoyment, it is not worth trying to excel at anything.",
                image: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Magnus_Carlsen_%28cropped%29.jpg"
            },
            {
                author: "GM Bobby Fischer",
                quote: "You have to have the fighting spirit. You have to force moves and take chances.",
                image: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Bobby_Fischer_1960_in_Leipzig.jpg"
            },
            {
                author: "GM Viswanathan Anand",
                quote: "Confidence comes from hours and days and weeks and years of constant work and dedication.",
                image: "https://upload.wikimedia.org/wikipedia/commons/5/57/Viswanathan_Anand_%282016%29_%28cropped%29.jpeg"
            },
            {
                author: "GM Judit Polgár",
                quote: "Chess is not about memorizing moves. It's about understanding ideas.",
                image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Judit_Polgar_%28cropped%29.jpg"
            },
            {
                author: "GM Hikaru Nakamura",
                quote: "The beauty of chess is it can be whatever you want it to be. It transcends language, age, race, religion, politics, gender, and socioeconomic background.",
                image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Hikaru_Nakamura_%282016%29_crop.jpg"
            }
        ];

        const randomIntro = gmIntros[Math.floor(Math.random() * gmIntros.length)];
        const introOverlay = document.getElementById('intro-overlay');
        const appElement = document.getElementById('app');
        const onboardingOverlay = document.getElementById('onboarding-overlay');
        
        if (introOverlay) {
            const imgEl = document.getElementById('intro-gm-img');
            if (imgEl) {
                imgEl.src = randomIntro.image;
                // If photo fails to load, hide it gracefully
                imgEl.onerror = () => { imgEl.style.display = 'none'; };
            }
            document.getElementById('intro-quote').innerText = `"${randomIntro.quote}"`;
            document.getElementById('intro-author').innerText = `— ${randomIntro.author}`;
            
            document.getElementById('enter-cmd-btn').onclick = () => {
                introOverlay.style.opacity = '0';
                setTimeout(() => {
                    introOverlay.style.display = 'none';
                    
                    // Check if journey has started
                    const journeyStart = localStorage.getItem('chess_journey_start');
                    if (!journeyStart) {
                        // Show Onboarding
                        if (onboardingOverlay) {
                            // Generate Roadmap HTML
                            const roadmapContainer = document.getElementById('onboarding-roadmap');
                            if (roadmapContainer && chessCurriculum) {
                                roadmapContainer.innerHTML = '';
                                chessCurriculum.forEach(monthData => {
                                    const posterUrl = monthData.poster || (monthData.courses?.[0]?.poster) || '';
                                    const titleStr = monthData.title || (monthData.courses?.[0]?.title) || `Month ${monthData.month}`;
                                    const missionStr = monthData.mission || (monthData.courses?.[0]?.mission) || '';
                                    
                                    const cardHTML = `
                                        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 16px; padding: 15px; text-align: left; transition: transform 0.3s ease; cursor: default;">
                                            <div style="display: flex; align-items: center; gap: 15px;">
                                                <div style="width: 70px; height: 100px; flex-shrink: 0; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                                                    <img src="${posterUrl}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://www.chessable.com/img/book-default-small.png'">
                                                </div>
                                                <div>
                                                    <div style="color: var(--cyan); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Month ${monthData.month}</div>
                                                    <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-light); margin-bottom: 4px;">${titleStr}</div>
                                                    <div style="font-size: 0.85rem; color: var(--text-dim); line-height: 1.4;">${missionStr}</div>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                    roadmapContainer.innerHTML += cardHTML;
                                });
                            }

                            onboardingOverlay.style.display = 'flex';
                            
                            // Setup Initiate Button
                            document.getElementById('initiate-journey-btn').onclick = () => {
                                // Save start date (ISO string)
                                localStorage.setItem('chess_journey_start', new Date().toISOString());
                                onboardingOverlay.style.display = 'none';
                                appElement.style.display = 'block';
                                this.updateJourneyTracker();
                            };
                        } else {
                            // Fallback if overlay is missing
                            localStorage.setItem('chess_journey_start', new Date().toISOString());
                            appElement.style.display = 'block';
                            this.updateJourneyTracker();
                        }
                    } else {
                        // Journey already started, go straight to dashboard
                        appElement.style.display = 'block';
                        this.updateJourneyTracker();
                    }
                }, 500);
            };
        }
    }

    renderNav() {
        this.navContainer.innerHTML = '';
        for (let i = 1; i <= 12; i++) {
            const btn = document.createElement('div');
            btn.className = `month-btn ${this.currentMonth === i ? 'active' : ''}`;
            btn.innerText = i;
            btn.onclick = () => this.switchMonth(i);
            this.navContainer.appendChild(btn);
        }
    }

    renderDashboard() {
        const data = chessCurriculum[this.currentMonth - 1];

        // Render the rich course card + embedded move trainer (course-card.js)
        if (typeof renderCourseCard === 'function') {
            renderCourseCard(data);
        }

        this.renderTasks(data.tasks);
        this.updateProgress();
        this.updateJourneyTracker();
    }
    
    updateJourneyTracker() {
        const journeyStartStr = localStorage.getItem('chess_journey_start');
        const widget = document.getElementById('journey-tracker-widget');
        
        if (!journeyStartStr || !widget) {
            if (widget) widget.style.display = 'none';
            return;
        }
        
        widget.style.display = 'block';
        
        const startDate = new Date(journeyStartStr);
        const now = new Date();
        
        // Calculate days elapsed
        const diffTime = Math.abs(now - startDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // Start at Day 1
        
        // Format date: e.g. "Mar 15, 2026 at 10:45 AM"
        const optionsDate = { month: 'short', day: 'numeric', year: 'numeric' };
        const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
        const formattedDate = `${startDate.toLocaleDateString(undefined, optionsDate)} at ${startDate.toLocaleTimeString(undefined, optionsTime)}`;
        
        document.getElementById('journey-start-date').innerText = `Started: ${formattedDate}`;
        document.getElementById('journey-days-elapsed').innerText = `Day ${diffDays} of 365`;
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
        this.completedTasks[taskId] = !this.completedTasks[taskId];
        localStorage.setItem('chess_tasks', JSON.stringify(this.completedTasks));
        this.renderDashboard();
        
        if (this.completedTasks[taskId]) {
            this.showPositivityToast();
            this.fireSmallConfetti();
        }
        
        this.checkCompletion();
    }

    switchMonth(month) {
        this.currentMonth = month;
        localStorage.setItem('chess_current_month', month);
        this.renderNav();
        this.renderDashboard();
    }

    updateProgress() {
        const data = chessCurriculum[this.currentMonth - 1];
        const monthTasks = data.tasks.length;
        let done = 0;
        
        data.tasks.forEach((_, index) => {
            if (this.completedTasks[`m${this.currentMonth}t${index}`]) done++;
        });

        const pct = Math.round((done / monthTasks) * 100);
        document.getElementById('completion-text').innerText = `Monthly Strength Gain: ${pct}%`;
    }

    checkCompletion() {
        const data = chessCurriculum[this.currentMonth - 1];
        const allDone = data.tasks.every((_, index) => 
            this.completedTasks[`m${this.currentMonth}t${index}`]
        );

        if (allDone) {
            this.showReward(data);
        }
    }

    showReward(data) {
        document.getElementById('reward-title').innerText = "MISSION ACCOMPLISHED";
        document.getElementById('reward-desc').innerHTML = `
            <div style="font-size: 1.2rem; color: var(--accent); margin-bottom: 10px;">${data.reward}</div>
            <p style="color: var(--text-dim);">You have mastered the <b>${data.title}</b> curriculum.</p>
            <p style="margin-top: 15px; font-style: italic; color: var(--cyan);">"The path to 2400 is paved with discipline."</p>
        `;
        this.rewardOverlay.style.display = 'flex';
        this.fireMegaConfetti(); // Trigger premium confetti
    }

    fireSmallConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#00f2ff', '#ffd700', '#ffffff'],
                zIndex: 9999
            });
        }
    }

    fireMegaConfetti() {
        if (typeof confetti !== 'function') return;
        
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 }, colors: ['#ffd700', '#ffffff', '#00f2ff'] }));
        }, 250);
    }

    showPositivityToast() {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const quote = window.positivityQuotes ? window.positivityQuotes[Math.floor(Math.random() * window.positivityQuotes.length)] : "Great work today!";
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-title">Task Completed!</div>
            <div class="toast-quote">"${quote}"</div>
        `;
        
        container.appendChild(toast);
        
        // Trigger reflow
        void toast.offsetWidth;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400); // Wait for transition
        }, 4000);
    }

    setupEventListeners() {
        document.getElementById('close-reward').onclick = () => {
            this.rewardOverlay.style.display = 'none';
            // Auto-advance to next month if available
            if (this.currentMonth < 12) {
                this.switchMonth(this.currentMonth + 1);
            } else {
                // Final celebration for 12 months
                this.showFinalVictory();
            }
        };

        const resetBtn = document.getElementById('daily-reset-btn');
        if (resetBtn) {
            resetBtn.onclick = () => {
                const data = chessCurriculum[this.currentMonth - 1];
                data.tasks.forEach((_, index) => {
                    const taskId = `m${this.currentMonth}t${index}`;
                    this.completedTasks[taskId] = false;
                });
                // Also reset the month completion flag if it exists
                delete this.completedTasks[`m${this.currentMonth}_passed`];
                localStorage.setItem('chess_tasks', JSON.stringify(this.completedTasks));
                this.renderDashboard();
                
                const container = document.getElementById('toast-container');
                if (container) {
                    const toast = document.createElement('div');
                    toast.className = 'toast';
                    toast.innerHTML = `
                        <div class="toast-title">Fresh Start</div>
                        <div class="toast-quote">"Tomorrow is a new day of progress. Rest well!"</div>
                    `;
                    container.appendChild(toast);
                    void toast.offsetWidth;
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                        setTimeout(() => toast.remove(), 400);
                    }, 3000);
                }
            };
        }
    }

    showFinalVictory() {
        document.getElementById('reward-title').innerText = "THE 2400 ASCENSION";
        document.getElementById('reward-desc').innerHTML = `
            <h3 style="color: var(--accent); margin-bottom: 15px;">CONGRATULATIONS!</h3>
            <p>You have completed the full 12-month Elite Mastery program.</p>
            <p style="margin-top: 10px; color: var(--cyan);">The Grandmaster title is no longer a dream, but a destination.</p>
        `;
        this.rewardOverlay.style.display = 'flex';
        this.fireMegaConfetti();
    }
}

// Spark it up
document.addEventListener('DOMContentLoaded', () => {
    new CommandCenter();
});
