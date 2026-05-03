/**
 * MONTHLY EXAM MODULE (v1)
 * 
 * Logic to run a 'Mastery Challenge' at the end of each month.
 * Pulls from local Course Database PGNs to test the user's progress.
 */

window.startMonthlyExam = async function(monthNum) {
    const overlay = document.getElementById('exam-overlay');
    const container = document.getElementById('exam-content');
    if (!overlay || !container) return;

    overlay.style.display = 'flex';
    container.innerHTML = `
        <div class="exam-loading">
            <h2 style="color:var(--accent);">Initiating Mastery Protocol</h2>
            <p style="color:var(--text-dim);">Scanning Course Database for PGN materials...</p>
            <div class="cc-progress-track" style="width:200px; margin:20px auto;">
                <div class="cc-progress-fill" id="exam-load-progress" style="width:0%; background:var(--accent);"></div>
            </div>
        </div>
    `;

    const monthData = window.chessCurriculum.find(m => m.month === monthNum);
    const pgnTexts = [];

    // 1. Collect PGNs from all courses in this month
    for (let i = 0; i < monthData.courses.length; i++) {
        const course = monthData.courses[i];
        const url = encodeURI(`Course Database/Month ${monthNum}/${course.title}/PGNs/${course.title}.pgn`);
        
        try {
            const res = await fetch(url);
            if (res.ok) {
                const text = await res.text();
                if (text.trim().length > 10) {
                    pgnTexts.push({ title: course.title, pgn: text });
                }
            }
        } catch (e) {
            console.log(`Exam logic: Could not fetch PGN for ${course.title}`);
        }
        
        const prog = Math.round(((i + 1) / monthData.courses.length) * 100);
        const bar = document.getElementById('exam-load-progress');
        if (bar) bar.style.width = prog + '%';
    }

    if (pgnTexts.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px;">
                <h2 style="color:#f85149;">Database Incomplete</h2>
                <p style="margin:20px 0; color:var(--text-dim);">
                    The exam requires the course PGNs to be present in your <b>Materials Lab</b>.<br>
                    Please ensure you've added the PGN files to the course folders and try again.
                </p>
                <button class="cc-btn-secondary" onclick="document.getElementById('exam-overlay').style.display='none'">Abort Protocol</button>
            </div>
        `;
        return;
    }

    // 2. Prep the positions
    container.innerHTML = `
        <div style="text-align:center;">
            <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:10px;">MONTH ${monthNum} SUMMIT</h2>
            <p style="color:var(--text-dim); margin-bottom:30px;">Strategic Calibration: 5 Positions to Mastery</p>
            <div id="exam-board-wrap" style="width:400px; margin:0 auto 20px; position:relative;">
                <div id="exam-board" style="width:100%;"></div>
                <div id="exam-timer" style="position:absolute; top:-10px; right:-10px; width:60px; height:60px; background:var(--bg-card); border:2px solid var(--accent); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; color:var(--text-main); font-size:1.2rem; box-shadow: 0 0 15px var(--theme-glow);">60</div>
            </div>
            <div id="exam-question-area">
                <div id="exam-status" style="font-weight:700; margin-bottom:15px; color:var(--cyan); text-transform:uppercase; letter-spacing:2px;">[Ready for Calibration]</div>
                <div id="exam-feedback" style="min-height:30px; margin-bottom:15px; font-weight:800; font-size:1.1rem;"></div>
                <div id="exam-controls">
                    <button id="exam-submit-btn" class="cc-btn-primary" style="width:240px; padding:18px;">INITIATE SUMMIT PULSE</button>
                </div>
            </div>
        </div>
    `;

    // Internal state for exam
    let currentStep = 0;
    let score = 0;
    const TOTAL_STEPS = 5;
    const challPositions = [];

    // Parse random positions
    pgnTexts.forEach(item => {
        const games = item.pgn.split(/(?=\[Event\s)/).filter(g => g.trim());
        games.forEach(g => {
            const ch = new Chess();
            if (ch.load_pgn(g)) {
                const moves = ch.history({ verbose: true });
                if (moves.length > 5) {
                    // Pick a random spot in the middle/end
                    const moveIdx = Math.floor(Math.random() * (moves.length - 2)) + 1;
                    const testCh = new Chess();
                    for(let i=0; i<moveIdx; i++) testCh.move(moves[i]);
                    challPositions.push({
                        fen: testCh.fen(),
                        correct: moves[moveIdx],
                        course: item.title
                    });
                }
            }
        });
    });

    // Shuffle and pick 5
    const selected = challPositions.sort(() => 0.5 - Math.random()).slice(0, TOTAL_STEPS);

    let board = null;
    let timerInterval = null;
    const submitBtn = document.getElementById('exam-submit-btn');
    const statusEl = document.getElementById('exam-status');
    const feedbackEl = document.getElementById('exam-feedback');
    const timerEl = document.getElementById('exam-timer');

    const nextPosition = () => {
        if (currentStep >= selected.length) {
            endExam();
            return;
        }

        const pos = selected[currentStep];
        statusEl.innerHTML = `Position ${currentStep + 1} of ${selected.length} <br><small style="color:var(--text-dim); font-weight:400;">From: ${pos.course}</small>`;
        feedbackEl.innerHTML = "";
        
        if (typeof Chessboard === 'undefined') {
            feedbackEl.innerHTML = `<span style="color:#f85149;">Board Error: Refresh Required</span>`;
            return;
        }
        const game = new Chess(pos.fen);
        const turn = game.turn() === 'w' ? 'White' : 'Black';
        statusEl.innerHTML += `<div style="margin-top:10px; color:#fff;">${turn} to Move</div>`;

        if (board) board.destroy();
        board = Chessboard('exam-board', {
            draggable: true,
            position: pos.fen,
            orientation: game.turn() === 'w' ? 'white' : 'black',
            onDrop: (src, tgt) => {
                const move = game.move({ from: src, to: tgt, promotion: 'q' });
                if (!move) return 'snapback';
                game.undo();
                
                clearInterval(timerInterval);
                
                if (move.from === pos.correct.from && move.to === pos.correct.to) {
                    score++;
                    feedbackEl.innerHTML = `<span style="color:#00c864; text-shadow:0 0 10px rgba(0,200,100,0.4);">✅ CALCULATION SECURE</span>`;
                    setTimeout(() => {
                        currentStep++;
                        nextPosition();
                    }, 1200);
                } else {
                    feedbackEl.innerHTML = `<span style="color:#f85149; text-shadow:0 0 10px rgba(248,81,73,0.4);">❌ TACTICAL LEAK DETECTED</span>`;
                    setTimeout(() => {
                        currentStep++;
                        nextPosition();
                    }, 1200);
                }
            },
            pieceTheme: 'https://www.chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
        });

        // Start Timer
        let timeLeft = 60;
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerEl.innerText = timeLeft;
            if (timeLeft <= 10) timerEl.style.color = '#f85149';
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                feedbackEl.innerHTML = `<span style="color:#f85149;">⏳ TIME EXPIRED</span>`;
                setTimeout(() => { currentStep++; nextPosition(); }, 1200);
            }
        }, 1000);
    };

    const endExam = () => {
        const pct = Math.round((score / selected.length) * 100);
        const passed = pct >= 80;
        
        container.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <h2 style="font-size:3rem; margin-bottom:10px;">${pct}%</h2>
                <h3 style="color:${passed ? 'var(--accent)' : '#f85149'}; margin-bottom:20px;">
                    ${passed ? 'EXAM PASSED: SECTOR SECURE' : 'EXAM FAILED: ADDITIONAL DRILL REQUIRED'}
                </h3>
                <p style="color:var(--text-dim); margin-bottom:40px;">
                    Score: ${score} / ${selected.length} positions correctly identified.
                </p>
                ${passed ? 
                    `<button class="cc-btn-primary" onclick="handleExamPass(${monthNum})">Claim Reward & Advance</button>` :
                    `<button class="cc-btn-secondary" onclick="window.startMonthlyExam(${monthNum})">Re-Attempt Protocol</button>`
                }
            </div>
        `;
    };

    submitBtn.onclick = () => {
        submitBtn.style.display = 'none';
        nextPosition();
    };
};

window.handleExamPass = function(monthNum) {
    localStorage.setItem(`month_exam_passed_${monthNum}`, 'true');
    document.getElementById('exam-overlay').style.display = 'none';
    
    // Grant Mass XP
    if (window.cmdCenter) {
        window.cmdCenter.xp += 1000; // Major payout
        window.cmdCenter.updateXPDisplay();
    }
    
    // Trigger the app's Reward logic
    if (window.cmdCenter) {
        const data = window.chessCurriculum[monthNum - 1];
        window.cmdCenter.showReward(data);
    }
};
