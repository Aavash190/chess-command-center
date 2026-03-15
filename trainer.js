/**
 * Chess Command Center — PGN Trainer Engine
 * Handles PGN upload, parsing, interactive board, and "Guess the Move" quiz logic.
 */

// ─── State ──────────────────────────────────────────────────────────────────
let board = null;
let game = null;
let allGames = [];
let currentGameMoves = [];
let currentMoveIndex = 0;
let score = { correct: 0, total: 0 };
let gameOrientation = 'white';
let hintUsed = false;
let awaitingMove = true;

// ─── DOM Refs ────────────────────────────────────────────────────────────────
const uploadZone   = document.getElementById('upload-zone');
const fileInput    = document.getElementById('pgn-file-input');
const gameSelector = document.getElementById('game-selector');
const gameList     = document.getElementById('game-list');
const trainerLayout = document.getElementById('trainer-layout');
const feedbackBox  = document.getElementById('feedback-box');
const sideToMove   = document.getElementById('side-to-move');
const scoreDisplay = document.getElementById('score-display');
const posDisplay   = document.getElementById('pos-display');
const moveLog      = document.getElementById('move-log');
const hintBtn      = document.getElementById('hint-btn');
const hintText     = document.getElementById('hint-text');

// ─── Upload Handling ─────────────────────────────────────────────────────────
uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.pgn')) {
        readPGN(file);
    } else {
        showToast('Please upload a valid .pgn file!', 'error');
    }
});

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) readPGN(file);
});

document.getElementById('new-upload-btn').addEventListener('click', () => {
    resetAll();
});

// ─── PGN Reading & Parsing ───────────────────────────────────────────────────
function readPGN(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const pgnText = e.target.result;
        parsePGN(pgnText);
    };
    reader.readAsText(file);
}

function parsePGN(pgnText) {
    // Split into individual games by detecting the [Event] header
    const rawGames = pgnText.split(/(?=\[Event\s)/);
    allGames = rawGames.filter(g => g.trim().length > 0);

    if (allGames.length === 0) {
        showToast('No valid games found in this PGN file.', 'error');
        return;
    }

    if (allGames.length === 1) {
        loadGame(allGames[0]);
    } else {
        showGameSelector(allGames);
    }
}

function showGameSelector(games) {
    uploadZone.style.display = 'none';
    gameSelector.classList.add('active');
    gameList.innerHTML = '';

    games.forEach((pgn, i) => {
        const white = (pgn.match(/\[White\s+"([^"]+)"\]/) || ['', `Game ${i + 1}`])[1];
        const black = (pgn.match(/\[Black\s+"([^"]+)"\]/) || ['', '?'])[1];
        const event = (pgn.match(/\[Event\s+"([^"]+)"\]/) || ['', ''])[1];

        const item = document.createElement('div');
        item.className = 'game-list-item';
        item.innerHTML = `
            <span><b>${white}</b> vs <b>${black}</b></span>
            <span style="color: var(--text-dim); font-size: 0.85rem;">${event}</span>
        `;
        item.onclick = () => {
            gameSelector.classList.remove('active');
            loadGame(pgn);
        };
        gameList.appendChild(item);
    });
}

// ─── Game Loading & Board Setup ───────────────────────────────────────────────
function loadGame(pgn) {
    game = new Chess();
    const loaded = game.load_pgn(pgn);
    if (!loaded) {
        showToast('Could not load this game. Is the PGN valid?', 'error');
        return;
    }

    // Get the full move history, then reset to start
    currentGameMoves = game.history({ verbose: true });
    game.reset();

    // Load any header info
    const headerMatch = pgn.match(/\[White\s+"([^"]+)"\]/);
    if (headerMatch) {
        // Determine orientation based on white player
        gameOrientation = 'white';
    }

    currentMoveIndex = 0;
    score = { correct: 0, total: 0 };
    moveLog.innerHTML = '';
    hintText.style.display = 'none';
    hintUsed = false;

    uploadZone.style.display = 'none';
    gameSelector.classList.remove('active');
    trainerLayout.classList.add('active');

    initBoard();
    updateQuizUI();
}

function initBoard() {
    if (board) board.destroy();

    const config = {
        draggable: true,
        position: 'start',
        orientation: gameOrientation,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        pieceTheme: 'https://www.chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    };

    board = Chessboard('chessboard', config);
    $(window).resize(board.resize);
}

// ─── Board Event Handlers ─────────────────────────────────────────────────────
function onDragStart(source, piece) {
    if (!awaitingMove) return false;
    if (game.game_over()) return false;

    const turn = game.turn();
    if ((turn === 'w' && piece.startsWith('b')) ||
        (turn === 'b' && piece.startsWith('w'))) {
        return false;
    }
    return true;
}

function onDrop(source, target) {
    if (!awaitingMove) return 'snapback';

    // Try the move
    const attemptedMove = game.move({
        from: source,
        to: target,
        promotion: 'q' // Always promote to queen for simplicity
    });

    if (attemptedMove === null) return 'snapback';

    // Undo the move because we want to evaluate it first
    game.undo();

    // Check against the correct move
    const correctMove = currentGameMoves[currentMoveIndex];
    const isCorrect = (attemptedMove.from === correctMove.from && attemptedMove.to === correctMove.to);

    if (isCorrect) {
        handleCorrect(correctMove);
    } else {
        handleWrong(attemptedMove, correctMove);
    }
}

function onSnapEnd() {
    board.position(game.fen());
}

// ─── Quiz Logic ───────────────────────────────────────────────────────────────
function handleCorrect(correctMove) {
    // Apply the move
    game.move(correctMove);
    board.position(game.fen());
    awaitingMove = false;

    // Update score
    if (!hintUsed) {
        score.correct++;
    }
    score.total++;

    // Log it
    addMoveToLog(correctMove, true);

    // Show feedback
    showFeedback('✅ Correct! ' + (hintUsed ? '(Hint used — no point)' : '+1 Point!'), 'correct');

    // Show positivity toast
    const quotes = window.positivityQuotes || ["Great move! Keep it up!"];
    showToast(quotes[Math.floor(Math.random() * quotes.length)], 'success');

    // Advance
    currentMoveIndex++;
    hintUsed = false;

    if (currentMoveIndex >= currentGameMoves.length) {
        setTimeout(() => endTrainingSession(), 1500);
    } else {
        // Play opponent's response (next move) automatically after delay
        setTimeout(() => {
            if (currentMoveIndex < currentGameMoves.length) {
                const opponentMove = currentGameMoves[currentMoveIndex];
                game.move(opponentMove);
                board.position(game.fen());
                addMoveToLog(opponentMove, null); // null = not scored
                currentMoveIndex++;
            }
            awaitingMove = true;
            updateQuizUI();
            hideFeedback();
        }, 1200);
    }
}

function handleWrong(attemptedMove, correctMove) {
    score.total++;

    // Flash wrong
    showFeedback(`❌ Not quite. You played ${attemptedMove.san}. Think deeper!`, 'wrong');

    // Show the piece type hint
    hintText.textContent = `Hint: Move your ${pieceFullName(correctMove.piece)} from ${correctMove.from}.`;

    addMoveToLog({ san: `${attemptedMove.san} ✗` }, false);

    updateScoreDisplay();
}

function onNextBtn() {
    if (currentMoveIndex >= currentGameMoves.length) return;
    const correctMove = currentGameMoves[currentMoveIndex];
    game.move(correctMove);
    board.position(game.fen());
    addMoveToLog(correctMove, null); // skipped, no score
    currentMoveIndex++;

    // Also play opponent reply
    if (currentMoveIndex < currentGameMoves.length) {
        const reply = currentGameMoves[currentMoveIndex];
        setTimeout(() => {
            game.move(reply);
            board.position(game.fen());
            addMoveToLog(reply, null);
            currentMoveIndex++;
            updateQuizUI();
        }, 600);
    } else {
        updateQuizUI();
    }

    hideFeedback();
    hintUsed = false;
    hintText.style.display = 'none';
    awaitingMove = true;
}

function onPrevBtn() {
    if (currentMoveIndex < 2) return;
    // Undo two plies (your move + opponent response)
    game.undo();
    game.undo();
    currentMoveIndex = Math.max(0, currentMoveIndex - 2);
    board.position(game.fen());
    hideFeedback();
    hintText.style.display = 'none';
    awaitingMove = true;
    updateQuizUI();
}

document.getElementById('next-btn').addEventListener('click', onNextBtn);
document.getElementById('prev-btn').addEventListener('click', onPrevBtn);
document.getElementById('flip-btn').addEventListener('click', () => {
    gameOrientation = gameOrientation === 'white' ? 'black' : 'white';
    board.orientation(gameOrientation);
});

hintBtn.addEventListener('click', () => {
    hintUsed = true;
    const correctMove = currentGameMoves[currentMoveIndex];
    hintText.textContent = `Move your ${pieceFullName(correctMove.piece)} — it's on ${correctMove.from}.`;
    hintText.style.display = 'block';
});

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function updateQuizUI() {
    if (currentMoveIndex >= currentGameMoves.length) {
        sideToMove.textContent = '🏁 Training Complete!';
        return;
    }
    const nextMove = currentGameMoves[currentMoveIndex];
    const isWhite = nextMove.color === 'w';
    sideToMove.innerHTML = isWhite
        ? '<span style="color: #ffffff;">⬜ White to move</span>'
        : '<span style="color: #aaaaaa;">⬛ Black to move</span>';

    updateScoreDisplay();
    posDisplay.textContent = `${currentMoveIndex + 1} / ${currentGameMoves.length}`;
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `${score.correct} / ${score.total}`;
}

function showFeedback(msg, type) {
    feedbackBox.className = `quiz-feedback ${type}`;
    feedbackBox.textContent = msg;
}

function hideFeedback() {
    feedbackBox.className = 'quiz-feedback';
}

function addMoveToLog(move, wasCorrect) {
    const item = document.createElement('div');
    const cls = wasCorrect === true ? 'correct-move' : (wasCorrect === false ? 'wrong-move' : '');
    item.className = `move-item ${cls}`;
    const icon = wasCorrect === true ? '✅' : (wasCorrect === false ? '❌' : '→');
    item.innerHTML = `<span class="move-num">${icon}</span><span class="move-san">${move.san}</span>`;
    moveLog.appendChild(item);
    moveLog.scrollTop = moveLog.scrollHeight;
}

function pieceFullName(piece) {
    const names = { p: 'Pawn', n: 'Knight', b: 'Bishop', r: 'Rook', q: 'Queen', k: 'King' };
    return names[piece] || piece;
}

function endTrainingSession() {
    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    sideToMove.innerHTML = `<span style="color: var(--accent);">🏆 Session Complete! ${score.correct}/${score.total} Correct (${pct}%)</span>`;
    showFeedback(`🎉 Training complete! You scored ${score.correct} out of ${score.total} (${pct}%)`, 'correct');

    if (typeof confetti === 'function' && pct >= 70) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#ffd700', '#ffffff', '#00f2ff'] });
    }
}

function resetAll() {
    uploadZone.style.display = 'block';
    gameSelector.classList.remove('active');
    trainerLayout.classList.remove('active');
    fileInput.value = '';
    moveLog.innerHTML = '';
    hideFeedback();
    hintText.style.display = 'none';
    awaitingMove = true;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, type) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-title">${type === 'error' ? '⚠️ Error' : '💡 Nice!'}</div>
        <div class="toast-quote">"${msg}"</div>
    `;
    container.appendChild(toast);
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}
