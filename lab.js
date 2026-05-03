class UniversalLab {
    constructor() {
        this.board = null;
        this.game = new Chess();
        this.trainingPgn = null;
        this.currentLine = [];
        this.currentIndex = 0;
        
        this.init();
    }

    init() {
        this.setupBoard();
        this.setupFileUpload();
    }

    setupBoard() {
        if (typeof Chessboard === 'undefined') {
            console.error("UniversalLab: Chessboard is not defined. Retrying in 1s...");
            setTimeout(() => this.setupBoard(), 1000);
            return;
        }
        const config = {
            draggable: true,
            position: 'start',
            onDrop: (source, target) => this.onMove(source, target),
            onSnapEnd: () => this.board.position(this.game.fen()),
            pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
        };
        this.board = Chessboard('lab-board', config);
        // Ensure board fills container correctly on start and resize
        setTimeout(() => { if(this.board) this.board.resize(); }, 100);
        window.addEventListener('resize', () => {
            if (this.board) this.board.resize();
        });
    }

    setupFileUpload() {
        const input = document.getElementById('lab-pgn-upload');
        if (!input) return;

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                this.loadPgn(event.target.result);
                window.showToast("PGN Loaded to Lab!");
            };
            reader.readAsText(file);
        };
    }

    loadPgn(pgn) {
        if (!pgn) return;
        this.trainingPgn = this.sanitize(pgn);
        this.resetTraining();
    }

    sanitize(pgn) {
        // Strip technical debris and Z0 blockers (standard in some chessable/exported PGNs)
        let s = pgn.replace(/\\\[\\\]/g, '');
        s = s.replace(/\s+Z0\s+/g, ' ');
        s = s.replace(/\bZ0\b/g, '');
        
        // Ensure Setup tag for FENs
        if (s.includes('[FEN ') && !s.includes('[SetUp ')) {
            s = s.replace(/\[FEN/, '[SetUp "1"]\n[FEN');
        }
        return s.trim();
    }

    resetTraining() {
        this.game.reset();
        this.board.position('start');
        this.currentIndex = 0;
        this.currentLine = [];

        if (!this.trainingPgn) return;
        
        const tempGame = new Chess();
        if (tempGame.load_pgn(this.trainingPgn)) {
            const history = tempGame.history({ verbose: true });
            this.currentLine = history;
            
            // Auto-flip board if black is the main player in the PGN
            const blackTag = (this.trainingPgn.match(/\[Black\s+"([^"]+)"\]/) || ['', ''])[1].toLowerCase();
            this.board.orientation(blackTag.includes('user') || blackTag.includes('student') ? 'black' : 'white');
            
            // If it's black to move, or computer should move first
            const sideToMove = tempGame.turn(); // 'w' or 'b'
            // If the PGN starts with a FEN that is black's turn or if it's a standard game
            // For now, let's just trigger first move if current side isn't the one we expect
            // Simple heuristic: If first move is white, wait for user. 
            // If board is black, maybe computer makes move.
        } else {
            console.error("Lab: Could not load sanitized PGN");
        }
    }

    onMove(source, target) {
        const move = this.game.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (move === null) return 'snapback';

        const expected = this.currentLine[this.currentIndex];
        
        if (expected && move.san === expected.san) {
            this.currentIndex++;
            // Computer response
            setTimeout(() => this.makeNextMove(), 250);
        } else {
            this.game.undo();
            window.showToast("Incorrect move. Try again!", "error");
            return 'snapback';
        }
    }

    makeNextMove() {
        const nextMove = this.currentLine[this.currentIndex];
        if (nextMove) {
            this.game.move(nextMove);
            this.board.position(this.game.fen());
            this.currentIndex++;
            
            if (this.currentIndex >= this.currentLine.length) {
                window.showToast("Line Completed!");
                if (window.fireSmallConfetti) window.fireSmallConfetti();
            }
        }
    }

    analyzePosition() {
        if (typeof Stockfish === 'undefined') {
            window.showToast("AI Engine not ready. Check connection.", "error");
            return;
        }

        const btn = document.getElementById('ai-analyze-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = "<span>⚙️ Computing...</span>";
        btn.disabled = true;

        if (!this.engine) {
            try {
                // Try initializing as a Worker if possible
                this.engine = new Worker('https://cdn.jsdelivr.net/npm/stockfish@16.1.0/src/stockfish.js');
            } catch (e) {
                console.warn("UniversalLab: Worker initialization failed, attempting fallback.", e);
                // Fallback to global Stockfish if available
                if (typeof Stockfish === 'function') {
                    this.engine = Stockfish();
                } else {
                    window.showToast("Neural Engine failed to initialize.", "error");
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    return;
                }
            }
            
            // Standard UCI message handling
            const onMsg = (event) => {
                const msg = typeof event === 'string' ? event : event.data;
                if (msg.startsWith('bestmove')) {
                    const bestMove = msg.split(' ')[1];
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    
                    if (window.commandAI) {
                        window.commandAI.addMessage(`LAB ANALYSIS: Stockfish 16.1 suggests **${bestMove}** as the strongest continuation in this position.`, 'bot');
                        if (!window.commandAI.isOpen) window.commandAI.toggle();
                    } else {
                        window.showToast(`Best Move: ${bestMove}`, "info");
                    }
                }
            };

            if (this.engine.onmessage !== undefined) {
                this.engine.onmessage = onMsg;
            } else if (typeof this.engine.addMessageListener === 'function') {
                this.engine.addMessageListener(onMsg);
            }
        }

        this.engine.postMessage('uci');
        this.engine.postMessage(`position fen ${this.game.fen()}`);
        this.engine.postMessage('go depth 15');
    }
}

window.UniversalLab = UniversalLab;
