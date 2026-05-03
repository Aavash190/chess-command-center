/**
 * INLINE PGN COURSE TRAINER (v2 — Deep Per-Course Integration)
 * 
 * Features:
 * - Each month has its own saved PGN (localStorage: pgn_session_m{N})
 * - Tracks positions completed, score, and best score per month
 * - Updates the Course Progress Bar on the left card in real-time
 * - Congratulations overlay when course PGN is finished
 * - Persistent: returns to exactly where you left off
 */

// ─── State ───────────────────────────────────────────────────────────────────
let inlineBoard      = null;
let inlineGame       = null;
let inlineMoves      = [];
let inlineMoveIdx    = 0;
let inlineScore      = { correct: 0, total: 0 };
let inlineOrientation = 'white';
let inlineHintUsed   = false;
let inlineAwaiting   = true;
let currentTrainerMonth = null;
let currentPGNText   = null;

// --- HELPERS ---
function sanitizePGN(pgn) {
    console.log("[Inline Trainer] Sanitizing PGN (length:", pgn.length, ")");
    // Strip technical debris and Z0 blockers
    let s = pgn.replace(/\\\[\\\]/g, '');
    s = s.replace(/\s+Z0\s+/g, ' ');
    s = s.replace(/\bZ0\b/g, '');
    
    // Replace Chessable skip moves "1. --"
    s = s.replace(/\d+\.\s+--\s+/g, ''); 
    s = s.replace(/--/g, '');

    // Ensure Setup tag for FENs
    if (s.includes('[FEN ') && !s.includes('[SetUp ')) {
        s = s.replace(/\[FEN/, '[SetUp "1"]\n[FEN');
    }
    return s.trim();
}

// ─── DOM Shortcuts ────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const tUploadZone    = $('trainer-upload-zone');
const tFileInput     = $('trainer-file-input');
const tGameSelector  = $('trainer-game-selector');
const tGameList      = $('trainer-game-list');
const tActive        = $('trainer-active');
const tMonthLabel    = $('trainer-month-label');
const tScoreBadge    = $('trainer-score-badge');
const tNewPgnBtn     = $('trainer-new-pgn-btn');
const tFeedback      = $('t-feedback');
const tSideLabel     = $('t-side-label');
const tPos           = $('t-pos');
const tTotal         = $('t-total');
const tMoveLog       = $('t-move-log');
const tHintBtn       = $('t-hint-btn');
const tHintText      = $('t-hint-text');

// ─── Month Switch Hook (called by app.js on every nav click) ─────────────────
function onTrainerMonthSwitch(monthNum, monthTitle) {
    currentTrainerMonth = monthNum;
    tMonthLabel.textContent = `Month ${monthNum}: ${monthTitle} — Drop your course PGN to start training`;

    // Attempt to restore saved session
    const saved = getSession(monthNum);
    if (saved && saved.pgn) {
        loadInlinePGN(saved.pgn, saved.moveIdx || 0, saved.score);
    } else {
        resetToUpload();
    }

    // Always update the progress bar on the course card
    updateCourseProgressBar(monthNum);
}

// ─── Upload Events ───────────────────────────────────────────────────────────
tUploadZone.addEventListener('click', () => tFileInput.click());

tUploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    tUploadZone.style.cssText += 'border-color:var(--accent);background:rgba(255,215,0,0.03);';
});
tUploadZone.addEventListener('dragleave', () => {
    tUploadZone.style.cssText += 'border-color:rgba(0,242,255,0.3);background:rgba(0,242,255,0.02);';
});
tUploadZone.addEventListener('drop', e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.toLowerCase().endsWith('.pgn')) {
        readFile(file);
    } else {
        showT('Please drop a .pgn file!');
    }
});
tFileInput.addEventListener('change', () => { if (tFileInput.files[0]) readFile(tFileInput.files[0]); });
tNewPgnBtn.addEventListener('click', () => {
    if (!currentTrainerMonth) return;
    clearSession(currentTrainerMonth);
    resetToUpload();
});

// ─── File Reading ─────────────────────────────────────────────────────────────
function readFile(file) {
    const reader = new FileReader();
    reader.onload = e => parsePGN(e.target.result);
    reader.readAsText(file);
}

function parsePGN(text) {
    const games = text.split(/(?=\[Event\s)/).filter(g => g.trim());
    if (!games.length) { showT('No valid games found in this PGN.'); return; }
    games.length === 1 ? loadInlinePGN(games[0]) : showGamePicker(games);
}

function showGamePicker(games) {
    tUploadZone.style.display = 'none';
    tGameSelector.style.display = 'block';
    tGameList.innerHTML = '';
    games.forEach((pgn, i) => {
        const white = (pgn.match(/\[White\s+"([^"]+)"\]/) || ['', `Game ${i + 1}`])[1];
        const black = (pgn.match(/\[Black\s+"([^"]+)"\]/) || ['', '?'])[1];
        const event = (pgn.match(/\[Event\s+"([^"]+)"\]/) || ['', ''])[1];
        const el = document.createElement('div');
        el.style.cssText = 'display:flex;justify-content:space-between;padding:11px 15px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;cursor:pointer;margin-bottom:4px;transition:border-color 0.2s;';
        el.innerHTML = `<b style="color:var(--text-light);">${white} vs ${black}</b><span style="color:var(--text-dim);font-size:0.8rem;">${event}</span>`;
        el.onmouseenter = () => el.style.borderColor = 'var(--accent)';
        el.onmouseleave = () => el.style.borderColor = 'rgba(255,255,255,0.07)';
        el.onclick = () => { tGameSelector.style.display = 'none'; loadInlinePGN(pgn); };
        tGameList.appendChild(el);
    });
}

// ─── Load Game ────────────────────────────────────────────────────────────────
function loadInlinePGN(pgn, startIdx = 0, savedScore = null) {
    inlineGame = new Chess();
    const sanitized = sanitizePGN(pgn);
    if (!inlineGame.load_pgn(sanitized)) { 
        console.error("[Inline Trainer] FAILED to load PGN:", sanitized);
        showT('Invalid PGN — please check the file.'); 
        return; 
    }

    currentPGNText = pgn;
    inlineMoves    = inlineGame.history({ verbose: true });
    inlineGame.reset();

    // Fast-forward to saved position
    for (let i = 0; i < startIdx && i < inlineMoves.length; i++) {
        inlineGame.move(inlineMoves[i]);
    }

    inlineMoveIdx   = startIdx;
    inlineScore     = savedScore ? { ...savedScore } : { correct: 0, total: 0 };
    inlineHintUsed  = false;
    inlineAwaiting  = true;
    tMoveLog.innerHTML = '';
    hideTFeedback();
    tHintText.style.display = 'none';

    tUploadZone.style.display   = 'none';
    tGameSelector.style.display = 'none';
    tActive.style.display       = 'grid';
    tNewPgnBtn.style.display    = 'inline-block';

    initInlineBoard();
    updateUI();
    saveSession();
}

function initInlineBoard() {
    if (inlineBoard) inlineBoard.destroy();
    inlineBoard = Chessboard('inline-chessboard', {
        draggable  : true,
        position   : inlineGame.fen(),
        orientation: inlineOrientation,
        onDragStart: tDragStart,
        onDrop     : tDrop,
        onSnapEnd  : () => inlineBoard.position(inlineGame.fen()),
        pieceTheme : 'https://www.chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    });
    window.addEventListener('resize', () => inlineBoard.resize());
}

// ─── Board Logic ─────────────────────────────────────────────────────────────
function tDragStart(source, piece) {
    if (!inlineAwaiting || inlineGame.game_over()) return false;
    const t = inlineGame.turn();
    if ((t === 'w' && piece[0] === 'b') || (t === 'b' && piece[0] === 'w')) return false;
    return true;
}

function tDrop(source, target) {
    if (!inlineAwaiting) return 'snapback';
    const move = inlineGame.move({ from: source, to: target, promotion: 'q' });
    if (!move) return 'snapback';
    inlineGame.undo();

    const correct = inlineMoves[inlineMoveIdx];
    (move.from === correct.from && move.to === correct.to)
        ? correctMove(correct)
        : wrongMove(move, correct);
}

// ─── Quiz Logic ───────────────────────────────────────────────────────────────
function correctMove(m) {
    inlineGame.move(m);
    inlineBoard.position(inlineGame.fen());
    inlineAwaiting = false;
    if (!inlineHintUsed) inlineScore.correct++;
    inlineScore.total++;
    logMove(m, true);
    showTFeedback(`✅ ${inlineHintUsed ? 'Correct (hint used — no point)' : 'Correct! +1 Point ✨'}`, '#00c864', 'rgba(0,200,100,0.1)');

    // Positivity toast
    const q = window.positivityQuotes;
    if (q) showT(q[Math.floor(Math.random() * q.length)]);

    inlineMoveIdx++;
    inlineHintUsed = false;
    updateUI();
    saveSession();

    if (inlineMoveIdx >= inlineMoves.length) {
        setTimeout(endSession, 1400);
        return;
    }

    // Play opponent reply
    setTimeout(() => {
        if (inlineMoveIdx < inlineMoves.length) {
            const reply = inlineMoves[inlineMoveIdx];
            inlineGame.move(reply);
            inlineBoard.position(inlineGame.fen());
            logMove(reply, null);
            inlineMoveIdx++;
        }
        inlineAwaiting = true;
        hideTFeedback();
        tHintText.style.display = 'none';
        updateUI();
        saveSession();
    }, 1100);
}

function wrongMove(attempted, correct) {
    inlineScore.total++;
    showTFeedback(`❌ ${attempted.san} — wrong! Think again or skip.`, '#ff5050', 'rgba(255,80,80,0.1)');
    logMove({ san: attempted.san + ' ✗' }, false);
    updateUI();
}

// ─── Navigation ───────────────────────────────────────────────────────────────
$('t-next-btn').onclick = () => {
    if (inlineMoveIdx >= inlineMoves.length) return;
    inlineGame.move(inlineMoves[inlineMoveIdx]);
    inlineBoard.position(inlineGame.fen());
    logMove(inlineMoves[inlineMoveIdx], null);
    inlineMoveIdx++;
    if (inlineMoveIdx < inlineMoves.length) {
        setTimeout(() => {
            inlineGame.move(inlineMoves[inlineMoveIdx]);
            inlineBoard.position(inlineGame.fen());
            logMove(inlineMoves[inlineMoveIdx], null);
            inlineMoveIdx++;
            inlineAwaiting = true;
            hideTFeedback();
            tHintText.style.display = 'none';
            updateUI();
            saveSession();
        }, 400);
    } else { inlineAwaiting = true; hideTFeedback(); updateUI(); saveSession(); }
};

$('t-prev-btn').onclick = () => {
    if (inlineMoveIdx < 2) return;
    inlineGame.undo(); inlineGame.undo();
    inlineMoveIdx = Math.max(0, inlineMoveIdx - 2);
    inlineBoard.position(inlineGame.fen());
    hideTFeedback(); tHintText.style.display = 'none';
    inlineAwaiting = true; updateUI();
};

$('t-flip-btn').onclick = () => {
    inlineOrientation = inlineOrientation === 'white' ? 'black' : 'white';
    inlineBoard.orientation(inlineOrientation);
};

tHintBtn.onclick = () => {
    inlineHintUsed = true;
    const m = inlineMoves[inlineMoveIdx];
    tHintText.textContent = `Your ${pieceName(m.piece)} on ${m.from} makes the right move.`;
    tHintText.style.display = 'block';
};

// ─── Session End ─────────────────────────────────────────────────────────────
function endSession() {
    const pct = inlineScore.total > 0 ? Math.round(inlineScore.correct / inlineScore.total * 100) : 0;
    
    // Save best score
    if (currentTrainerMonth) {
        const key = `pgn_best_m${currentTrainerMonth}`;
        const prev = parseInt(localStorage.getItem(key) || '0');
        if (pct > prev) localStorage.setItem(key, pct);
    }

    tSideLabel.innerHTML = `<span style="color:var(--accent);">🏆 Course Complete!</span>`;
    showTFeedback(`🎊 Outstanding! You scored ${inlineScore.correct}/${inlineScore.total} (${pct}% accuracy)!`, '#ffd700', 'rgba(255,215,0,0.08)');

    if (typeof confetti === 'function' && pct >= 60) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#ffd700', '#00f2ff', '#fff'] });
    }

    showT(`🏅 ${pct >= 80 ? 'OUTSTANDING!' : pct >= 60 ? 'Well done!' : 'Keep practicing!'} You finished the course PGN with ${pct}% accuracy.`);
    updateCourseProgressBar(currentTrainerMonth);
}

// ─── Course Progress Bar ──────────────────────────────────────────────────────
function updateCourseProgressBar(monthNum) {
    const fillEl    = document.getElementById('course-progress-fill');
    const pctEl     = document.getElementById('course-progress-pct');
    const detailEl  = document.getElementById('course-progress-detail');
    const bestEl    = document.getElementById('course-best-score');
    if (!fillEl) return;

    const session = getSession(monthNum);
    const best    = parseInt(localStorage.getItem(`pgn_best_m${monthNum}`) || '0');

    if (!session || !session.pgn) {
        fillEl.style.width = '0%';
        pctEl.textContent  = '0%';
        detailEl.textContent = 'No PGN uploaded yet — drop your course file below';
        bestEl.textContent   = '';
        return;
    }

    const done  = session.moveIdx || 0;
    const total = session.totalMoves || done;
    const pct   = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
    const acc   = session.score ? Math.round(session.score.correct / Math.max(session.score.total, 1) * 100) : 0;

    fillEl.style.width = pct + '%';
    pctEl.textContent  = pct + '%';
    detailEl.textContent = `${done} / ${total} positions trained`;
    bestEl.textContent   = best > 0 ? `Best accuracy: ${best}%` : `Current accuracy: ${acc}%`;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function updateUI() {
    tScoreBadge.textContent = `Score: ${inlineScore.correct} / ${inlineScore.total}`;
    const done = inlineMoveIdx >= inlineMoves.length;
    tPos.textContent   = done ? inlineMoves.length : inlineMoveIdx + 1;
    tTotal.textContent = inlineMoves.length;

    if (!done && inlineMoves[inlineMoveIdx]) {
        const m = inlineMoves[inlineMoveIdx];
        tSideLabel.textContent = m.color === 'w' ? '⬜ White to move — what is the best move?' : '⬛ Black to move — what is the best move?';
    }

    updateCourseProgressBar(currentTrainerMonth);
}

function showTFeedback(msg, color, bg) {
    tFeedback.style.cssText = `display:block;padding:12px 16px;border-radius:10px;font-weight:600;font-size:0.95rem;margin-bottom:10px;color:${color};background:${bg};border:1px solid ${color}33;`;
    tFeedback.textContent = msg;
}
function hideTFeedback() { tFeedback.style.display = 'none'; }

function logMove(move, result) {
    const el = document.createElement('div');
    el.style.cssText = `display:flex;justify-content:space-between;font-size:0.85rem;padding:5px 8px;border-radius:5px;margin-bottom:3px;background:${result===true?'rgba(0,200,100,0.08)':result===false?'rgba(255,80,80,0.08)':'rgba(255,255,255,0.02)'};`;
    el.innerHTML = `<span>${result===true?'✅':result===false?'❌':'→'}</span><span style="font-family:monospace;font-weight:600;color:var(--text-light);">${move.san}</span>`;
    tMoveLog.appendChild(el);
    tMoveLog.scrollTop = tMoveLog.scrollHeight;
}

function pieceName(p) {
    return { p:'Pawn', n:'Knight', b:'Bishop', r:'Rook', q:'Queen', k:'King' }[p] || p;
}

function resetToUpload() {
    tUploadZone.style.display   = 'block';
    tGameSelector.style.display = 'none';
    tActive.style.display       = 'none';
    tNewPgnBtn.style.display    = 'none';
    tMoveLog.innerHTML = '';
    hideTFeedback();
    tHintText.style.display = 'none';
    tFileInput.value = '';
    tScoreBadge.textContent = 'Score: 0 / 0';
}

// ─── Persistence ─────────────────────────────────────────────────────────────
function saveSession() {
    if (!currentTrainerMonth) return;
    localStorage.setItem(`pgn_session_m${currentTrainerMonth}`, JSON.stringify({
        pgn        : currentPGNText,
        moveIdx    : inlineMoveIdx,
        totalMoves : inlineMoves.length,
        score      : inlineScore,
        savedAt    : Date.now()
    }));
    updateCourseProgressBar(currentTrainerMonth);
}

function getSession(monthNum) {
    try {
        const s = localStorage.getItem(`pgn_session_m${monthNum}`);
        return s ? JSON.parse(s) : null;
    } catch(e) { return null; }
}

function clearSession(monthNum) {
    localStorage.removeItem(`pgn_session_m${monthNum}`);
}

// Periodic autosave
setInterval(() => {
    if (currentTrainerMonth && inlineMoveIdx > 0) saveSession();
}, 8000);

// ─── Toast ────────────────────────────────────────────────────────────────────
function showT(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-title">♟ Trainer</div><div class="toast-quote">${msg}</div>`;
    container.appendChild(toast);
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 4000);
}

// ─── Grid CSS ─────────────────────────────────────────────────────────────────
const s = document.createElement('style');
s.textContent = `
    .trainer-active-grid { display: grid !important; grid-template-columns: 1fr 1fr; gap: 30px; }
    @media (max-width: 768px) { .trainer-active-grid { grid-template-columns: 1fr; } }
    #trainer-upload-zone:hover { border-color: var(--accent) !important; background: rgba(255,215,0,0.03) !important; }
`;
document.head.appendChild(s);
