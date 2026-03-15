/**
 * COURSE CARD MODULE (v3)
 * 
 * Renders a rich, full-detail course section for the currently active month.
 * Each month gets its own:
 *   - Poster + full course info display
 *   - Syllabus breakdown (chapters, modules)
 *   - Self-contained Move Trainer (with its own PGN stored in localStorage)
 *   - Score history, progress bar, and congratulations
 * 
 * Called from app.js whenever renderDashboard() runs.
 */

// ─── Main Entry Point ─────────────────────────────────────────────────────────
// Track session stats globally within this module
let sessionCorrect = 0;
let sessionTotal = 0;

function renderCourseCard(data) {
    const container = document.getElementById('course-card-container');
    if (!container) return;

    let allHtml = '';
    const courses = data.courses || [data];

    courses.forEach((courseData, cIdx) => {
        const courseKey  = `m${data.month}_c${cIdx}`;
        const session   = getCourseSession(courseKey);
        const bestScore = parseInt(localStorage.getItem(`pgn_best_${courseKey}`) || '0');

        const progressPct  = session?.totalMoves > 0
            ? Math.min(100, Math.round(session.moveIdx / session.totalMoves * 100)) : 0;
        const accuracyPct  = session?.score?.total > 0
            ? Math.round(session.score.correct / session.score.total * 100) : 0;

        // Module rows HTML
        const moduleRows = (courseData.courseDetails?.modules || []).map((m, i) =>
            `<div class="cc-module-row" style="animation-delay:${i * 0.06}s">
                <span class="cc-module-title">${m.title}</span>
                <span class="cc-module-len">${m.length}</span>
            </div>`
        ).join('');

        // Progress bar colour
        const progressColor = progressPct >= 100 ? '#00c864' :
                              progressPct >= 50  ? '#ffd700' : '#00f2ff';

        allHtml += `
        <div class="cc-wrapper" style="margin-bottom: 40px; ${courses.length > 1 ? 'border-left: 3px solid var(--accent);' : ''}">
            <div class="cc-top-row">
                <div class="cc-poster-col">
                    <div class="cc-poster-wrap">
                        <img class="cc-poster-img"
                             src="${courseData.poster}"
                             onerror="this.src='https://www.chessable.com/img/book-default-small.png'"
                             alt="${courseData.title}">
                        <div class="cc-poster-overlay">
                            <span class="cc-overlay-badge">MONTH ${data.month}</span>
                        </div>
                    </div>
                    <a href="${courseData.link}" target="_blank" class="cc-btn-primary" style="margin-top:14px;">
                        ↗ Open on Chessable
                    </a>
                    <button class="cc-btn-secondary" id="cc-toggle-trainer-btn-${courseKey}" onclick="toggleCourseTrainer('${courseKey}')">
                        ♟ Open Move Trainer
                    </button>
                </div>
                <div class="cc-info-col">
                    <div class="cc-badge-row">
                        <span class="cc-badge">Course ${cIdx + 1} of ${courses.length}</span>
                        ${bestScore > 0 ? `<span class="cc-badge cc-badge-gold">🏅 Best: ${bestScore}%</span>` : ''}
                        ${(window.srEngine && window.srEngine.getReviewCount(courseData.title) > 0) 
                            ? `<span class="sr-review-badge">🔥 ${window.srEngine.getReviewCount(courseData.title)} Review Due</span>` : ''}
                    </div>
                    <h2 class="cc-title">${courseData.title}</h2>
                    <p class="cc-mission">${courseData.mission}</p>
                    ${courseData.benefits ? `<div class="cc-benefit">${courseData.benefits}</div>` : ''}
                    <div class="cc-info-grid">
                        <div class="cc-info-item">
                            <span class="cc-info-label">Daily Job</span>
                            <span class="cc-info-value">${courseData.job}</span>
                        </div>
                        <div class="cc-info-item">
                            <span class="cc-info-label">Head Coach</span>
                            <span class="cc-info-value">${courseData.coach}</span>
                        </div>
                        <div class="cc-info-item">
                            <span class="cc-info-label">Superpower</span>
                            <span class="cc-info-value" style="color:var(--cyan);">${courseData.superpower}</span>
                        </div>
                        <div class="cc-info-item">
                            <span class="cc-info-label">Volume</span>
                            <span class="cc-info-value">${courseData.stats}</span>
                        </div>
                        <div class="cc-info-item">
                            <span class="cc-info-label">Material Quality</span>
                            <span class="cc-info-value" style="color:var(--accent-gold);">${courseData.courseDetails?.quality || 'World-Class'}</span>
                        </div>
                        <div class="cc-info-item" style="grid-column: span 2;">
                            <span class="cc-info-label">Accolades</span>
                            <span class="cc-info-value" style="font-style:italic;">"${courseData.courseDetails?.accolades || 'Top Rated study material'}"</span>
                        </div>
                    </div>
                    <div class="cc-syllabus">
                        <div class="cc-syllabus-header">
                            <span>📋 Verified Syllabus</span>
                            <div class="cc-syllabus-meta">
                                <span>${courseData.courseDetails?.chapters ?? '?'} Chapters</span>
                                <span style="color:var(--text-dim);">•</span>
                                <span>${courseData.courseDetails?.length ?? ''}</span>
                            </div>
                        </div>
                        <div class="cc-modules">${moduleRows}</div>
                    </div>

                    ${courseData.videos ? `
                    <div class="cc-video-library" style="margin-top:20px;">
                        <div class="cc-syllabus-header">
                            <span>🎥 Local Video Library</span>
                            <span class="cc-badge" style="background:var(--accent);">Private</span>
                        </div>
                        <div class="cc-video-list" style="max-height: 200px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 8px; margin-top:10px;">
                            ${courseData.videos.map(v => `
                                <div class="cc-module-row cc-video-row" style="cursor:pointer;" onclick="window.open('${v.path}', '_blank')">
                                    <span class="cc-module-title">▶ ${v.title}</span>
                                    <span class="cc-module-len" style="color:var(--cyan);">Play MP4</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <div class="cc-progress-section" id="cc-progress-sec-${courseKey}">
                        <div class="cc-progress-header">
                            <span>Training Progress</span>
                            <span style="color:${progressColor}; font-weight:700;">${progressPct}%</span>
                        </div>
                        <div class="cc-progress-track">
                            <div class="cc-progress-fill" style="width:${progressPct}%; background:${progressColor};"></div>
                        </div>
                        <div class="cc-progress-footer">
                            <span>${session?.moveIdx > 0 ? `${session.moveIdx} / ${session.totalMoves} positions` : 'No PGN uploaded yet'}</span>
                            ${accuracyPct > 0 ? `<span style="color:var(--cyan);">Accuracy: ${accuracyPct}%</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- MOVE TRAINER -->
            <div id="cc-trainer-${courseKey}" class="cc-trainer-panel" style="display:none;">
                <div class="cc-trainer-header">
                    <div>
                        <h3 style="margin:0; font-size:1.2rem;">♟ Move Trainer — ${courseData.title}</h3>
                        <p style="margin:4px 0 0; color:var(--text-dim); font-size:0.85rem;">
                            Upload this course's PGN to start position-by-position training
                        </p>
                    </div>
                    <span id="cc-score-${courseKey}" class="cc-score-badge">Score: 0 / 0</span>
                </div>

                <div id="cc-upload-${courseKey}" class="cc-upload-zone" onclick="document.getElementById('cc-file-${courseKey}').click()">
                    <input type="file" id="cc-file-${courseKey}" accept=".pgn" style="display:none;" onchange="ccFileSelected('${courseKey}')">
                    <div style="font-size:2rem; margin-bottom:10px;">📂</div>
                    <b style="color:var(--text-light);">Drop or click to upload ${courseData.title} PGN</b>
                    <p style="color:var(--text-dim); font-size:0.8rem; margin-top:6px;">Go to Chessable → Course → menu → Export PGN</p>
                </div>

                <div id="cc-picker-${courseKey}" style="display:none;" class="cc-game-picker">
                    <div style="font-size:0.8rem; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">Select a Game</div>
                    <div id="cc-picklist-${courseKey}" class="cc-picklist"></div>
                </div>

                <div id="cc-board-area-${courseKey}" class="cc-board-area" style="display:none;">
                    <div class="cc-board-col">
                        <div id="cc-board-${courseKey}" style="width:100%;"></div>
                        <div class="cc-nav-row">
                            <button class="cc-nav-btn" onclick="ccPrev('${courseKey}')">◀ Back</button>
                            <button class="cc-nav-btn" onclick="ccFlip('${courseKey}')">⇅ Flip</button>
                            <button class="cc-nav-btn" onclick="ccNext('${courseKey}')">Skip ▶</button>
                            <button class="cc-nav-btn cc-clear-btn" onclick="ccReset('${courseKey}')">✕ Clear PGN</button>
                        </div>
                    </div>
                    <div class="cc-quiz-col">
                        <div class="cc-pos-info">
                            <span>Position <b id="cc-pos-${courseKey}">1</b> / <b id="cc-tot-${courseKey}">?</b></span>
                            <span id="cc-turn-${courseKey}" style="font-weight:700;">⬜ White to move</span>
                        </div>
                        <div id="cc-feedback-${courseKey}" class="cc-feedback" style="display:none;"></div>
                        <button class="cc-hint-btn" onclick="ccHint('${courseKey}')">💡 Hint (no points)</button>
                        <div id="cc-hint-${courseKey}" class="cc-hint-text" style="display:none;"></div>
                        <div class="cc-log-wrap">
                            <div style="font-size:0.75rem; color:var(--text-dim); letter-spacing:1px; text-transform:uppercase; margin-bottom:8px;">Move Log</div>
                            <div id="cc-log-${courseKey}" class="cc-log"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = allHtml;

    // Post-render setup: attach event listeners and restore sessions
    courses.forEach((courseData, cIdx) => {
        const courseKey  = `m${data.month}_c${cIdx}`;
        const zone = container.querySelector(`#cc-upload-${courseKey}`);
        
        if (zone) {
            zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('cc-upload-hover'); });
            zone.addEventListener('dragleave', () => zone.classList.remove('cc-upload-hover'));
            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('cc-upload-hover');
                const f = e.dataTransfer.files[0];
                if (f && f.name.toLowerCase().endsWith('.pgn')) ccReadFile(courseKey, f);
                else ccToast('Please drop a .pgn file');
            });
        }

        const session = getCourseSession(courseKey);
        if (session?.pgn) {
            document.getElementById(`cc-trainer-${courseKey}`).style.display = 'block';
            document.getElementById(`cc-toggle-trainer-btn-${courseKey}`).textContent = '♟ Close Move Trainer';
            ccLoadPGN(courseKey, session.pgn, session.moveIdx || 0, session.score);
        }
    });

    // Global UI setup
    setupEliteControls();
}

// ─── Trainer Toggle ───────────────────────────────────────────────────────────
function toggleCourseTrainer(courseKey) {
    const panel = document.getElementById(`cc-trainer-${courseKey}`);
    const btn   = document.getElementById(`cc-toggle-trainer-btn-${courseKey}`);
    if (!panel) return;
    
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'block';
    if (btn) btn.textContent = isOpen ? '♟ Open Move Trainer' : '♟ Close Move Trainer';
    
    if (!isOpen) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Auto-load Logic
        const session = getCourseSession(courseKey);
        if (!session?.pgn && !ccState[courseKey]) {
            // Find the correct course title from the global data structure
            const match = courseKey.match(/m(\d+)_c(\d+)/);
            if (!match) return;
            const mNum = match[1], cNum = match[2];
            
            let courseTitle = "";
            try {
                const monthData = window.chessCurriculum.find(m => m.month == mNum);
                courseTitle = monthData.courses[cNum].title;
            } catch (e) {
                console.error("Could not locate course title for key: " + courseKey);
                return;
            }

            // Construct the path to the human-readable Course Database folder (Materials Lab)
            const url = encodeURI(`Course Database/Month ${mNum}/${courseTitle}/PGNs/${courseTitle}.pgn`);
            
            const uploadZone = document.getElementById(`cc-upload-${courseKey}`);
            if (uploadZone) {
                const originalHTML = uploadZone.innerHTML;
                uploadZone.innerHTML = `<div style="padding: 20px; color: var(--cyan);">Fetching course PGN from Database...</div>`;
                
                fetch(url)
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.text();
                    })
                    .then(pgnText => {
                        // Only load if it's not our empty placeholder!
                        if (pgnText.trim().length > 0) {
                            ccParsePGN(courseKey, pgnText);
                            ccToast("Course PGN loaded automatically!");
                        } else {
                            uploadZone.innerHTML = originalHTML; // Empty placeholder, show manual upload
                        }
                    })
                    .catch(err => {
                        console.log(`No built-in PGN found at ${url}. Remaining in manual upload mode.`);
                        uploadZone.innerHTML = originalHTML;
                    });
            }
        }
    }
}

// ─── File Handling ────────────────────────────────────────────────────────────
function ccFileSelected(monthKey) {
    const input = document.getElementById(`cc-file-${monthKey}`);
    if (input?.files?.[0]) ccReadFile(monthKey, input.files[0]);
}

function ccReadFile(monthKey, file) {
    const reader = new FileReader();
    reader.onload = e => ccParsePGN(monthKey, e.target.result);
    reader.readAsText(file);
}

function ccParsePGN(monthKey, text) {
    const games = text.split(/(?=\[Event\s)/).filter(g => g.trim());
    if (!games.length) { ccToast('No valid games found in PGN'); return; }
    if (games.length === 1) {
        ccLoadPGN(monthKey, games[0]);
    } else {
        ccShowPicker(monthKey, games);
    }
}

function ccShowPicker(monthKey, games) {
    const upload = document.getElementById(`cc-upload-${monthKey}`);
    const picker = document.getElementById(`cc-picker-${monthKey}`);
    const list   = document.getElementById(`cc-picklist-${monthKey}`);
    if (!picker || !list) return;
    upload.style.display = 'none';
    picker.style.display = 'block';
    list.innerHTML = '';
    games.forEach((pgn, i) => {
        const white = (pgn.match(/\[White\s+"([^"]+)"\]/) || ['', `Game ${i+1}`])[1];
        const black = (pgn.match(/\[Black\s+"([^"]+)"\]/) || ['', '?'])[1];
        const el = document.createElement('div');
        el.className = 'cc-picklist-item';
        el.textContent = `${white} vs ${black}`;
        el.onclick = () => { picker.style.display = 'none'; ccLoadPGN(monthKey, pgn); };
        list.appendChild(el);
    });
}

// ─── Load PGN into Trainer ────────────────────────────────────────────────────
// Global trainer state, keyed by monthKey
const ccState = {};

function ccLoadPGN(monthKey, pgn, startIdx = 0, savedScore = null) {
    const game = new Chess();
    
    // Auto-inject SetUp tag for custom FENs if missing (chess.js requirement)
    if (pgn.includes('[FEN ') && !pgn.includes('[SetUp ')) {
        pgn = pgn.replace(/\[FEN/, '[SetUp "1"]\n[FEN');
    }
    
    if (!game.load_pgn(pgn)) { 
        ccToast('Invalid PGN file — could not load.'); 
        
        // Reset the upload zone if auto-load failed
        const uploadZone = document.getElementById(`cc-upload-${monthKey}`);
        if (uploadZone && uploadZone.innerHTML.includes("Fetching")) {
            uploadZone.innerHTML = `
                <input type="file" id="cc-file-${monthKey}" accept=".pgn" style="display:none;" onchange="ccFileSelected('${monthKey}')">
                <div style="font-size:2rem; margin-bottom:10px;">📂</div>
                <b style="color:var(--text-light);">Drop or click to upload PGN</b>
            `;
        }
        return; 
    }

    const moves = game.history({ verbose: true });
    game.reset();

    // Fast-forward to saved position
    for (let i = 0; i < startIdx && i < moves.length; i++) game.move(moves[i]);

    ccState[monthKey] = {
        game, moves, moveIdx: startIdx,
        score: savedScore ? { ...savedScore } : { correct: 0, total: 0 },
        pgn, orientation: 'white', hintUsed: false, awaiting: true,
        courseTitle: null // Will be set below
    };

    // Extract course title for SR
    const match = monthKey.match(/m(\d+)_c(\d+)/);
    if (match) {
        const mData = window.chessCurriculum[match[1]-1];
        ccState[monthKey].courseTitle = mData.courses[match[2]].title;
    }

    // Hide upload, show board
    const upload = document.getElementById(`cc-upload-${monthKey}`);
    const area   = document.getElementById(`cc-board-area-${monthKey}`);
    if (upload) upload.style.display = 'none';
    if (area) area.style.display = 'grid';

    // Init board
    ccInitBoard(monthKey);
    ccUpdateUI(monthKey);
    ccSaveSession(monthKey);
}

function ccInitBoard(monthKey) {
    const s = ccState[monthKey];
    if (!s) return;

    if (s.board) s.board.destroy();

    s.board = Chessboard(`cc-board-${monthKey}`, {
        draggable   : true,
        position    : s.game.fen(),
        orientation : s.orientation,
        onDragStart : (src, piece) => ccDragStart(monthKey, src, piece),
        onDrop      : (src, tgt)   => ccDrop(monthKey, src, tgt),
        onSnapEnd   : ()           => s.board.position(s.game.fen()),
        pieceTheme  : 'https://www.chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    });

    window.addEventListener('resize', () => s.board?.resize());
}

// ─── Board Events ─────────────────────────────────────────────────────────────
function ccDragStart(monthKey, source, piece) {
    const s = ccState[monthKey];
    if (!s || !s.awaiting || s.game.game_over()) return false;
    const turn = s.game.turn();
    if ((turn === 'w' && piece[0] === 'b') || (turn === 'b' && piece[0] === 'w')) return false;
    return true;
}

function ccDrop(monthKey, source, target) {
    const s = ccState[monthKey];
    if (!s || !s.awaiting) return 'snapback';

    const move = s.game.move({ from: source, to: target, promotion: 'q' });
    if (!move) return 'snapback';
    s.game.undo();

    const correct = s.moves[s.moveIdx];
    if (move.from === correct.from && move.to === correct.to) {
        ccCorrect(monthKey, correct);
    } else {
        ccWrong(monthKey, move, correct);
    }
}

// ─── Quiz Logic ───────────────────────────────────────────────────────────────
function ccCorrect(monthKey, correctMove) {
    const s = ccState[monthKey];
    s.game.move(correctMove);
    s.board.position(s.game.fen());
    s.awaiting = false;

    if (!s.hintUsed) s.score.correct++;
    s.score.total++;
    
    // Session Stats & XP
    sessionCorrect++;
    sessionTotal++;
    updateSessionUI();
    
    if (window.cmdCenter) {
        window.cmdCenter.xp += 10;
        window.cmdCenter.updateXPDisplay();
    }
    
    // Spaced Repetition Update
    if (window.srEngine && s.courseTitle) {
        const movePath = `${s.moveIdx}`; // Relative to current PGN
        window.srEngine.updateLearningState(s.courseTitle, movePath, true);
    }

    ccLog(monthKey, correctMove, true);
    ccFeedback(monthKey, `✅ Correct! ${s.hintUsed ? '(Hint — no point)' : '+1 Point! ✨'}`, 'correct');

    // Toast
    const q = window.positivityQuotes;
    if (q) ccToast(q[Math.floor(Math.random() * q.length)]);

    s.moveIdx++;
    s.hintUsed = false;
    ccUpdateUI(monthKey);
    ccSaveSession(monthKey);

    if (s.moveIdx >= s.moves.length) { setTimeout(() => ccEndSession(monthKey), 1400); return; }

    // Opponent auto-reply
    setTimeout(() => {
        if (s.moveIdx < s.moves.length) {
            const reply = s.moves[s.moveIdx];
            s.game.move(reply);
            s.board.position(s.game.fen());
            ccLog(monthKey, reply, null);
            s.moveIdx++;
        }
        s.awaiting = true;
        ccClearFeedback(monthKey);
        document.getElementById(`cc-hint-${monthKey}`).style.display = 'none';
        ccUpdateUI(monthKey);
        ccSaveSession(monthKey);
    }, 1100);
}

function ccWrong(monthKey, attempted, correct) {
    const s = ccState[monthKey];
    s.score.total++;
    
    sessionTotal++;
    updateSessionUI();
    
    // Spaced Repetition Reset
    if (window.srEngine && s.courseTitle) {
        const movePath = `${s.moveIdx}`;
        window.srEngine.updateLearningState(s.courseTitle, movePath, false);
    }

    ccLog(monthKey, { san: attempted.san + ' ✗' }, false);
    ccFeedback(monthKey, `❌ ${attempted.san} is not right — think deeper!`, 'wrong');
    ccUpdateUI(monthKey);
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function ccNext(monthKey) {
    const s = ccState[monthKey];
    if (!s || s.moveIdx >= s.moves.length) return;
    s.game.move(s.moves[s.moveIdx]);
    s.board.position(s.game.fen());
    ccLog(monthKey, s.moves[s.moveIdx], null);
    s.moveIdx++;
    if (s.moveIdx < s.moves.length) {
        setTimeout(() => {
            s.game.move(s.moves[s.moveIdx]);
            s.board.position(s.game.fen());
            ccLog(monthKey, s.moves[s.moveIdx], null);
            s.moveIdx++;
            s.awaiting = true; ccClearFeedback(monthKey);
            document.getElementById(`cc-hint-${monthKey}`).style.display = 'none';
            ccUpdateUI(monthKey); ccSaveSession(monthKey);
        }, 400);
    } else { s.awaiting = true; ccClearFeedback(monthKey); ccUpdateUI(monthKey); ccSaveSession(monthKey); }
}

function ccPrev(monthKey) {
    const s = ccState[monthKey];
    if (!s || s.moveIdx < 2) return;
    s.game.undo(); s.game.undo();
    s.moveIdx = Math.max(0, s.moveIdx - 2);
    s.board.position(s.game.fen());
    s.awaiting = true; ccClearFeedback(monthKey);
    document.getElementById(`cc-hint-${monthKey}`).style.display = 'none';
    ccUpdateUI(monthKey);
}

function ccFlip(monthKey) {
    const s = ccState[monthKey];
    if (!s) return;
    s.orientation = s.orientation === 'white' ? 'black' : 'white';
    s.board.orientation(s.orientation);
}

function ccHint(monthKey) {
    const s = ccState[monthKey];
    if (!s || s.moveIdx >= s.moves.length) return;
    s.hintUsed = true;
    const m = s.moves[s.moveIdx];
    const el = document.getElementById(`cc-hint-${monthKey}`);
    if (el) { el.textContent = `Your ${ccPN(m.piece)} on ${m.from} holds the answer.`; el.style.display = 'block'; }
}

function ccReset(monthKey) {
    ccClearSession(monthKey);
    const area   = document.getElementById(`cc-board-area-${monthKey}`);
    const upload = document.getElementById(`cc-upload-${monthKey}`);
    if (area) area.style.display = 'none';
    if (upload) upload.style.display = 'block';
    delete ccState[monthKey];
    ccUpdateProgressBar(monthKey);
}

// ─── Session End ──────────────────────────────────────────────────────────────
function ccEndSession(monthKey) {
    const s = ccState[monthKey];
    const pct = s.score.total > 0 ? Math.round(s.score.correct / s.score.total * 100) : 0;
    const prev = parseInt(localStorage.getItem(`pgn_best_${monthKey}`) || '0');
    if (pct > prev) localStorage.setItem(`pgn_best_${monthKey}`, pct);

    const turnEl = document.getElementById(`cc-turn-${monthKey}`);
    if (turnEl) turnEl.innerHTML = `<span style="color:var(--accent);">🏆 Course Complete!</span>`;
    ccFeedback(monthKey, `🎊 Amazing! ${s.score.correct}/${s.score.total} correct — ${pct}% accuracy! ${pct >= 80 ? 'OUTSTANDING 🌟' : 'Keep training!'}`, pct >= 70 ? 'correct' : 'wrong');

    if (typeof confetti === 'function' && pct >= 60) {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors: ['#ffd700', '#00f2ff', '#fff', '#ff69b4'] });
    }
    ccToast(pct >= 80 ? '🌟 Grandmaster-level accuracy! You are ready for the board.' : pct >= 60 ? '💪 Solid performance! Keep drilling these positions.' : '📖 Review the course notes and try again — improvement takes time!');
    ccUpdateProgressBar(monthKey);
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function ccUpdateUI(monthKey) {
    const s = ccState[monthKey];
    if (!s) return;

    const scoreEl = document.getElementById(`cc-score-${monthKey}`);
    const posEl   = document.getElementById(`cc-pos-${monthKey}`);
    const totEl   = document.getElementById(`cc-tot-${monthKey}`);
    const turnEl  = document.getElementById(`cc-turn-${monthKey}`);

    if (scoreEl) scoreEl.textContent = `Score: ${s.score.correct} / ${s.score.total}`;
    if (posEl)   posEl.textContent   = s.moveIdx < s.moves.length ? s.moveIdx + 1 : s.moves.length;
    if (totEl)   totEl.textContent   = s.moves.length;
    if (turnEl && s.moveIdx < s.moves.length) {
        const m = s.moves[s.moveIdx];
        const state = window.srEngine ? window.srEngine.getLearningState(s.courseTitle, `${s.moveIdx}`) : null;
        const levelHtml = state ? `<span class="sr-level-tag ${state.level === 8 ? 'sr-level-mastered' : ''}">LVL ${state.level}/8</span>` : '';
        
        turnEl.innerHTML = `${m.color === 'w' ? '⬜ White to move' : '⬛ Black to move'} ${levelHtml}`;
    }
    ccUpdateProgressBar(monthKey);
}

function ccFeedback(monthKey, msg, type) {
    const el = document.getElementById(`cc-feedback-${monthKey}`);
    if (!el) return;
    el.className = `cc-feedback cc-feedback-${type}`;
    el.textContent = msg;
    el.style.display = 'block';
}
function ccClearFeedback(monthKey) {
    const el = document.getElementById(`cc-feedback-${monthKey}`);
    if (el) el.style.display = 'none';
}

function ccLog(monthKey, move, result) {
    const el = document.getElementById(`cc-log-${monthKey}`);
    if (!el) return;
    const row = document.createElement('div');
    row.className = `cc-log-row${result === true ? ' cc-log-correct' : result === false ? ' cc-log-wrong' : ''}`;
    row.innerHTML = `<span>${result === true ? '✅' : result === false ? '❌' : '→'}</span>
                     <span class="cc-log-san">${move.san}</span>`;
    el.appendChild(row);
    el.scrollTop = el.scrollHeight;
}

function ccUpdateProgressBar(monthKey) {
    // Update the outer progress bar that sits in the rendered course card for specific courseKey
    const fillEl   = document.querySelector(`#cc-progress-sec-${monthKey} .cc-progress-fill`);
    const pctEl    = document.querySelector(`#cc-progress-sec-${monthKey} .cc-progress-header span:last-child`);
    const detailEl = document.querySelector(`#cc-progress-sec-${monthKey} .cc-progress-footer span:first-child`);

    const session = getCourseSession(monthKey);
    const pct = session?.totalMoves > 0
        ? Math.min(100, Math.round((session.moveIdx || 0) / session.totalMoves * 100)) : 0;
    const color = pct >= 100 ? '#00c864' : pct >= 50 ? '#ffd700' : '#00f2ff';

    if (fillEl)   { fillEl.style.width = pct + '%'; fillEl.style.background = color; }
    if (pctEl)    { pctEl.textContent = pct + '%'; pctEl.style.color = color; }
    if (detailEl) detailEl.textContent = session?.moveIdx > 0
        ? `${session.moveIdx} / ${session.totalMoves} positions` : 'No PGN uploaded yet';
}

function ccPN(p) { return { p:'Pawn', n:'Knight', b:'Bishop', r:'Rook', q:'Queen', k:'King' }[p] || p; }

// ─── Persistence ─────────────────────────────────────────────────────────────
function ccSaveSession(monthKey) {
    const s = ccState[monthKey];
    if (!s) return;
    localStorage.setItem(`pgn_session_${monthKey}`, JSON.stringify({
        pgn: s.pgn, moveIdx: s.moveIdx, totalMoves: s.moves.length, score: s.score
    }));
}
function getCourseSession(monthKey) {
    try { return JSON.parse(localStorage.getItem(`pgn_session_${monthKey}`) || 'null'); } catch(e) { return null; }
}
function ccClearSession(monthKey) { localStorage.removeItem(`pgn_session_${monthKey}`); }

// ─── Toast ────────────────────────────────────────────────────────────────────
function ccToast(msg) {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<div class="toast-title">♟ Course Trainer</div><div class="toast-quote">${msg}</div>`;
    c.appendChild(t); void t.offsetWidth; t.classList.add('show');
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 4500);
}

function setupEliteControls() {
    const controlBar = document.getElementById('trainer-master-controls');
    if (!controlBar) return;
    controlBar.style.display = 'flex';

    const blindfoldToggle = document.getElementById('blindfold-toggle');
    const coordToggle = document.getElementById('coordinates-toggle');

    blindfoldToggle.onchange = (e) => {
        document.querySelectorAll('.piece-417db').forEach(p => {
            p.style.opacity = e.target.checked ? '0' : '1';
        });
    };

    coordToggle.onchange = (e) => {
        document.querySelectorAll('.alpha-d227b, .numeric-fc99c').forEach(l => {
            l.style.display = e.target.checked ? 'block' : 'none';
        });
    };

    document.onkeydown = (e) => {
        if (e.key === 'l' || e.key === 'L') blindfoldToggle.click();
        if (e.key === 'c' || e.key === 'C') coordToggle.click();
    };
}

function updateSessionUI() {
    const correctEl = document.getElementById('session-correct');
    const totalEl = document.getElementById('session-total');
    if (correctEl) correctEl.innerText = sessionCorrect;
    if (totalEl) totalEl.innerText = sessionTotal;
}

window.renderCourseCard = renderCourseCard;
