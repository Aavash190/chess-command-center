/**
 * ACADEMY MASTERCLASS ENGINE (v4) - Elite Interactive Edition
 * 
 * RESOLVED: window.game scoping for AI integration.
 * RESOLVED: Robust PGN header/body splitting and trimming.
 * RESOLVED: Fallback to free analysis on empty patterns.
 */

// ─── Global State ───────────────────────────────────────────────────────────
window.game = null; 
let board = null;
let allVariations = [];
let currentVariationIdx = 0;
let currentGameMoves = [];
let currentMoveIndex = 0;
let score = { correct: 0, total: 0 };
let gameOrientation = 'white';
let hintUsed = false;
let awaitingMove = true;
let courseData = null;

// --- HELPERS ---
/**
 * Sanitizes a single PGN game string so chess.js can load it.
 * Handles Chessable export format quirks:
 *   - {[%mdl 32768]} inline annotations
 *   - null moves (--) used as opponent "skips" in exercises
 *   - Z0 tokens
 */
function sanitizePGN(pgn) {
    // 1. Remove all Chessable MDL metadata from comments: {[%mdl 32768]}
    let s = pgn.replace(/\{\[%mdl\s+\d+\]\}/g, '');
    
    // 2. Remove Z0 null-move tokens
    s = s.replace(/\s+Z0\s+/g, ' ');
    s = s.replace(/\bZ0\b/g, '');
    
    // 3. Remove null moves (--) and the move number before them
    //    Pattern: "1. Rh6 {comment} -- 2. Rd6" => "1. Rh6 {comment} 2. Rd6"
    //    Also handles: "1. --" at start of game
    s = s.replace(/\d+\.\.\.\s*--/g, '');  // black null moves: 1... --
    s = s.replace(/\d+\.\s+--/g, '');      // white null moves at start: 1. --
    s = s.replace(/\b--\b/g, '');          // any remaining -- tokens
    
    // 4. Ensure SetUp tag for FEN positions
    if (s.includes('[FEN ') && !s.includes('[SetUp "1"]')) {
        s = s.replace(/\[FEN/, '[SetUp "1"]\n[FEN');
    }
    
    // 5. Clean up multiple spaces
    s = s.replace(/[ \t]{2,}/g, ' ');
    
    return s.trim();
}

/**
 * Returns true if a PGN game has any real chess moves.
 * Text-only games (e.g. "1. -- *" or just "*") return false.
 */
function hasRealMoves(pgn) {
    // Strip headers and comments
    let body = pgn.replace(/\[.*?\]/gs, '').replace(/\{[^}]*\}/gs, '').trim();
    // Remove result
    body = body.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, '').trim();
    // Remove move numbers
    body = body.replace(/\d+\.+/g, '').trim();
    // What's left should be SAN moves
    const tokens = body.split(/\s+/).filter(t => t && t !== '--');
    return tokens.length > 0;
}

// ─── DOM Refs ────────────────────────────────────────────────────────────────
const boardEl      = document.getElementById('chessboard');
const feedbackBox  = document.getElementById('feedback-box');
const scoreDisplay = document.getElementById('score-display');
const posDisplay   = document.getElementById('pos-display');
const moveLog      = document.getElementById('move-log');
const hintBtn      = document.getElementById('hint-btn');
const varListEl    = document.getElementById('variation-list');
const activeVarName = document.getElementById('active-var-name');
const videoContainer = document.getElementById('video-container');
const videoPlayer  = document.getElementById('academy-video');

// ─── Initialization ─────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    initAcademy();
    
    // Perspective Selector Listener
    const pSelect = document.getElementById('perspective-select');
    if (pSelect) {
        pSelect.addEventListener('change', () => {
            console.log("[Academy Trainer] Perspective changed to:", pSelect.value);
            loadVariation(currentVariationIdx);
        });
    }
});

async function initAcademy() {
    const params = new URLSearchParams(window.location.search);
    const monthIdx = parseInt(params.get('month')) - 1;
    const courseIdx = parseInt(params.get('course'));

    if (isNaN(monthIdx) || isNaN(courseIdx)) {
        window.location.href = 'index.html';
        return;
    }

    courseData = window.chessCurriculum[monthIdx]?.courses[courseIdx];
    if (!courseData) {
        window.location.href = 'index.html';
        return;
    }

    // Update Header
    document.getElementById('academy-course-title').textContent = courseData.title;
    document.getElementById('academy-course-coach').textContent = `PROFESSOR: ${courseData.coach} • ${courseData.superpower}`;

    // Load Video
    if (courseData.videos && courseData.videos.length > 0) {
        videoContainer.style.display = 'block';
        const source = videoPlayer.querySelector('source');
        if (source) {
            source.src = courseData.videos[0].path;
            videoPlayer.load();
        }
    }

    // Load PGN
    if (courseData.pgnPath) {
        try {
            console.log(`[Academy Trainer] Fetching PGN: ${courseData.pgnPath}`);
            const response = await fetch(encodeURI(courseData.pgnPath));
            if (!response.ok) {
                console.error(`[Academy Trainer] HTTP Error: ${response.status} ${response.statusText}`);
                throw new Error("File 404");
            }
            const pgnText = await response.text();
            console.log(`[Academy Trainer] PGN Loaded. Size: ${pgnText.length} bytes`);
            if (pgnText.trim().length > 2) {
                parsePGN(pgnText);
            } else {
                handleEmptyPGN();
            }
        } catch (e) {
            console.error("PGN Sync Failed:", e);
            showToast("Pattern link broken. Initiating standby analysis.", "error");
            handleEmptyPGN();
        }
    } else {
        handleEmptyPGN();
    }
}

function handleEmptyPGN() {
    allVariations = ["[Event \"Free Analysis\"] *"];
    renderVariationList();
    loadVariation(0);
}

function parsePGN(pgnText) {
    // Split by [Event tag — use lookahead so the tag stays with the game
    const rawGames = pgnText.split(/(?=\[Event\s+")/);
    allVariations = [];
    
    for (const g of rawGames) {
        const clean = g.trim();
        if (!clean || clean.length < 10) continue;
        // Skip games that have no real moves (text-only theory slides with "1. -- *")
        // These are valid for reading but can't be played — we still include them
        // but mark them so the trainer can show the comment text instead.
        allVariations.push(clean);
    }

    if (allVariations.length === 0) {
        handleEmptyPGN();
        return;
    }

    console.log(`[Academy Trainer] Parsed ${allVariations.length} games.`);
    renderVariationList();
    
    // Jump to the first game that actually has moves
    const firstPlayable = allVariations.findIndex(pgn => hasRealMoves(pgn));
    loadVariation(firstPlayable >= 0 ? firstPlayable : 0);
}

function renderVariationList() {
    if (!varListEl) return;
    
    let html = '';
    let lastChapter = null;
    
    allVariations.forEach((pgn, i) => {
        const chapter = (pgn.match(/\[White\s+"([^"]+)"\]/) || ['', ''])[1];
        const name = getGameName(pgn, i);
        const isPlayable = hasRealMoves(pgn);
        
        // Render chapter header when chapter changes
        if (chapter && chapter !== lastChapter) {
            html += `<div style="font-size:0.6rem; color:var(--theme-accent); font-weight:800; letter-spacing:2px; text-transform:uppercase; padding:12px 5px 4px; border-top: 1px solid var(--glass-border); margin-top:8px;">${chapter}</div>`;
            lastChapter = chapter;
        }
        
        html += `
            <div class="variation-item ${isPlayable ? '' : 'text-slide'}" id="var-item-${i}" onclick="loadVariation(${i})" title="${isPlayable ? 'Playable exercise' : 'Theory slide'}">
                <span class="variation-idx">${isPlayable ? '♟' : '📖'}</span>
                <span style="flex:1;">${name}</span>
            </div>
        `;
    });
    
    varListEl.innerHTML = html;
}

function getGameName(pgn, i) {
    // In Chessable exports:
    //   [White "2. Not Hanging Material"]  → chapter name
    //   [Black "Exercise 1"]               → topic/exercise name
    const chapter = (pgn.match(/\[White\s+"([^"]+)"\]/) || ['', ''])[1];
    const topic   = (pgn.match(/\[Black\s+"([^"]+)"\]/) || ['', ''])[1];
    const event   = (pgn.match(/\[Event\s+"([^"]+)"\]/)  || ['', ''])[1];
    
    // If White/Black look like chapter/topic (not actual player names), use them
    const looksLikeChapter = /^\d+\./.test(chapter) || chapter.length > 0;
    if (looksLikeChapter && topic) {
        const label = topic.length > 35 ? topic.substring(0, 32) + '...' : topic;
        return label;
    }
    
    if (chapter && topic) return `${chapter} – ${topic}`.substring(0, 40);
    if (event) return event.length > 35 ? event.substring(0, 32) + '...' : event;
    return `Game ${i + 1}`;
}

// ─── Variation Loading ───────────────────────────────────────────────────────
function loadVariation(index) {
    currentVariationIdx = index;
    const pgn = allVariations[index].trim();
    
    document.querySelectorAll('.variation-item').forEach(el => el.classList.remove('active'));
    const activeItem = document.getElementById(`var-item-${index}`);
    if (activeItem) activeItem.classList.add('active');
    
    if (activeVarName) activeVarName.textContent = getGameName(pgn, index);

    window.game = new Chess();

    const sanitizedPgn = sanitizePGN(pgn);
    let loaded = window.game.load_pgn(sanitizedPgn);

    if (!loaded) {
        console.warn("[Academy Trainer] Initial load_pgn failed. Trying stripped version...");
        // Strip everything except headers + move text (remove all comments)
        const noComments = sanitizedPgn.replace(/\{[^}]*\}/gs, '');
        loaded = window.game.load_pgn(noComments);
        if (loaded) console.log("[Academy Trainer] Comment-stripped version worked.");
    }

    if (!loaded) {
        // Game is text-only (no real moves) — show intro text, load empty board
        if (!hasRealMoves(pgn)) {
            console.log("[Academy Trainer] Text-only slide — showing empty board.");
            window.game.reset();
            currentGameMoves = [];
            // Extract and show the comment text
            const commentMatch = pgn.match(/\{([^}]{20,})\}/);
            if (feedbackBox && commentMatch) {
                feedbackBox.className = 'feedback-box';
                feedbackBox.style.cssText += '; font-size:0.8rem; max-height:200px; overflow-y:auto; display:block; text-align:left;';
                feedbackBox.textContent = commentMatch[1].trim().substring(0, 500) + (commentMatch[1].length > 500 ? '...' : '');
            }
        } else {
            console.error("[Academy Trainer] FAILED to load PGN variation:", sanitizedPgn.substring(0, 300));
            window.game.reset();
            showToast('Could not load this position. Skipping.', 'error');
        }
    }

    currentGameMoves = window.game.history({ verbose: true });
    window.game.reset();

    const whiteNameMatch = pgn.match(/\[White\s+"([^"]+)"\]/);
    const whiteName = whiteNameMatch ? whiteNameMatch[1].toLowerCase() : "";
    
    // PERSPECTIVE SELECTOR INTEGRATION
    const pSelect = document.getElementById('perspective-select');
    const pValue = pSelect ? pSelect.value : 'auto';
    
    if (pValue === 'white') gameOrientation = 'white';
    else if (pValue === 'black') gameOrientation = 'black';
    else gameOrientation = whiteName.includes('black') ? 'black' : 'white';

    currentMoveIndex = 0;
    score = { correct: 0, total: 0 };
    if (moveLog) moveLog.innerHTML = '';
    hintUsed = false;
    awaitingMove = true;

    initBoard();
    updateQuizUI();
    hideFeedback();
}

function initBoard() {
    if (board) board.destroy();

    const config = {
        draggable: true,
        position: window.game ? window.game.fen() : 'start',
        orientation: gameOrientation,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    };

    board = Chessboard('chessboard', config);
    $(window).resize(board.resize);
    setTimeout(() => board.resize(), 150);
}

// ─── Trainer Logic ───────────────────────────────────────────────────────────
function onDragStart(source, piece) {
    if (!awaitingMove || !window.game) return false;
    if (window.game.game_over()) return false;
    const turn = window.game.turn();
    if ((turn === 'w' && piece.startsWith('b')) || (turn === 'b' && piece.startsWith('w'))) return false;
    return true;
}

function onDrop(source, target) {
    if (!awaitingMove || !window.game) return 'snapback';

    const attemptedMove = window.game.move({ from: source, to: target, promotion: 'q' });
    if (attemptedMove === null) return 'snapback';

    window.game.undo();
    
    if (currentGameMoves.length === 0) {
        window.game.move(attemptedMove);
        addMoveToLog(attemptedMove, null);
        updateQuizUI();
        return;
    }

    const correctMove = currentGameMoves[currentMoveIndex];
    if (!correctMove) {
        window.game.move(attemptedMove);
        addMoveToLog(attemptedMove, null);
        return;
    }

    const isCorrect = (attemptedMove.from === correctMove.from && attemptedMove.to === correctMove.to);

    if (isCorrect) {
        handleCorrect(correctMove);
    } else {
        handleWrong(attemptedMove);
    }
}

function onSnapEnd() {
    if (board && window.game) board.position(window.game.fen());
}

function handleCorrect(correctMove) {
    window.game.move(correctMove);
    board.position(window.game.fen());
    awaitingMove = false;

    if (!hintUsed) score.correct++;
    score.total++;

    addMoveToLog(correctMove, true);
    showFeedback('✅ SYSTEM CONFIRMED: Move Optimized', 'correct');

    currentMoveIndex++;
    hintUsed = false;

    if (currentMoveIndex >= currentGameMoves.length) {
        setTimeout(endMission, 1000);
    } else {
        setTimeout(() => {
            if (currentMoveIndex < currentGameMoves.length) {
                const opponentMove = currentGameMoves[currentMoveIndex];
                window.game.move(opponentMove);
                board.position(window.game.fen());
                addMoveToLog(opponentMove, null);
                currentMoveIndex++;
            }
            awaitingMove = true;
            updateQuizUI();
            hideFeedback();
        }, 800);
    }
}

function handleWrong(attemptedMove) {
    score.total++;
    showFeedback(`❌ PATTERN MISMATCH: ${attemptedMove.san} is suboptimal.`, 'wrong');
    addMoveToLog({ san: `${attemptedMove.san} ✗` }, false);
    updateQuizUI();
}

function endMission() {
    const pct = Math.round((score.correct / score.total) * 100);
    showFeedback(`🏆 MISSION COMPLETE: ${pct}% Accuracy`, 'correct');
    if (pct >= 70 && typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
}

function updateQuizUI() {
    if (scoreDisplay) scoreDisplay.textContent = `${score.correct} / ${score.total}`;
    const total = currentGameMoves.length || 0;
    if (posDisplay) posDisplay.textContent = `${currentMoveIndex} / ${total}`;
    
    const progress = total > 0 ? (currentMoveIndex / total) * 100 : 0;
    const fill = document.getElementById('mission-progress-fill');
    if (fill) fill.style.width = `${progress}%`;
}

function showFeedback(msg, type) {
    if (!feedbackBox) return;
    feedbackBox.className = `feedback-box ${type}`;
    feedbackBox.textContent = msg;
}

function hideFeedback() {
    if (!feedbackBox) return;
    feedbackBox.className = 'feedback-box';
    feedbackBox.textContent = 'Awaiting next pattern execution...';
}

function addMoveToLog(move, isCorrect) {
    if (!moveLog) return;
    const item = document.createElement('div');
    const cls = isCorrect === true ? 'correct' : (isCorrect === false ? 'wrong' : '');
    item.className = `log-move ${cls}`;
    item.textContent = move.san;
    moveLog.appendChild(item);
    moveLog.scrollTop = moveLog.scrollHeight;
}

// ─── Controls ───────────────────────────────────────────────────────────────
const nextBtn = document.getElementById('next-btn');
if (nextBtn) nextBtn.onclick = () => {
    if (!window.game || currentMoveIndex >= currentGameMoves.length) return;
    const correctMove = currentGameMoves[currentMoveIndex];
    window.game.move(correctMove);
    board.position(window.game.fen());
    addMoveToLog(correctMove, null);
    currentMoveIndex++;
    if (currentMoveIndex < currentGameMoves.length) {
        const reply = currentGameMoves[currentMoveIndex];
        setTimeout(() => {
            window.game.move(reply);
            board.position(window.game.fen());
            addMoveToLog(reply, null);
            currentMoveIndex++;
            updateQuizUI();
        }, 400);
    }
    updateQuizUI();
};

const prevBtn = document.getElementById('prev-btn');
if (prevBtn) prevBtn.onclick = () => {
    if (!window.game || currentMoveIndex < 2) return;
    window.game.undo(); window.game.undo();
    currentMoveIndex -= 2;
    board.position(window.game.fen());
    updateQuizUI();
};

const flipBtn = document.getElementById('flip-btn');
if (flipBtn) flipBtn.onclick = () => {
    gameOrientation = gameOrientation === 'white' ? 'black' : 'white';
    board.orientation(gameOrientation);
};

const hBtn = document.getElementById('hint-btn');
if (hBtn) hBtn.onclick = () => {
    hintUsed = true;
    if (!currentGameMoves[currentMoveIndex]) return;
    const correctMove = currentGameMoves[currentMoveIndex];
    
    // Enhanced Hint with Full PGN Context for Command AI
    const pgnLine = generateCurrentPGN();
    console.log("[Academy Trainer] Current PGN Line:", pgnLine);
    
    showToast(`Tactical Hint: Move your ${correctMove.piece.toUpperCase()} from ${correctMove.from}`, 'info');
    
    if (window.commandAI && window.commandAI.isOpen) {
        window.commandAI.addMessage(`I am analyzing the position after: ${pgnLine}. The next tactical step involves the piece at ${correctMove.from}.`, 'bot');
    }
};

function generateCurrentPGN() {
    if (!window.game) return "";
    let tempGame = new Chess();
    // Re-load to get starting position if any (FENS)
    if (window.game.header().FEN) tempGame.load(window.game.header().FEN);
    
    const history = window.game.history();
    for (let i = 0; i < currentMoveIndex; i++) {
        tempGame.move(history[i]);
    }
    return tempGame.pgn();
}

// ─── Toast ──────────────────────────────────────────────────────────────────
function showToast(msg, type) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.style.background = type === 'error' ? 'rgba(248, 81, 73, 0.2)' : (type === 'success' ? 'rgba(35, 134, 54, 0.2)' : 'rgba(37, 99, 235, 0.2)');
    toast.innerHTML = `<div style="font-weight:800; color:#fff;">${type.toUpperCase()}</div><div style="font-size:0.8rem; color:var(--text-dim);">${msg}</div>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}
