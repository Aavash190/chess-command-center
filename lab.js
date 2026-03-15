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
        const config = {
            draggable: true,
            position: 'start',
            onDrop: (source, target) => this.onMove(source, target),
            onSnapEnd: () => this.board.position(this.game.fen())
        };
        this.board = Chessboard('lab-board', config);
        window.addEventListener('resize', () => this.board.resize());
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
        this.trainingPgn = pgn;
        this.resetTraining();
    }

    resetTraining() {
        this.game.reset();
        this.board.position('start');
        
        const tempGame = new Chess();
        if (tempGame.load_pgn(this.trainingPgn)) {
            const history = tempGame.history({ verbose: true });
            this.currentLine = history;
            this.currentIndex = 0;
            
            // If black to move, make first move
            if (this.currentLine[0] && this.currentLine[0].color === 'w') {
                // Wait for player
            } else {
                 // Should not happen in standard training PGNs but handled
            }
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
}

window.UniversalLab = UniversalLab;
