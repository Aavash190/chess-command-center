const positivityQuotes = [
    "Consistency is the only requirement. Great work today!",
    "Every puzzle solved is a step closer to 2400.",
    "Small daily wins create massive long-term success.",
    "You are building the habits of a Grandmaster.",
    "Inches make champions. Well done!",
    "Discipline over motivation. You showed up today.",
    "Another day, another victory. Keep the momentum going!",
    "The 2400 rating is earned in the quiet moments of study."
];

const chessCurriculum = [
    // ─── MONTH 1: TACTICAL FOUNDATION ───────────────────────────────────────────
    {
        month: 1,
        reward: "Unlocked: The Eye of the Tiger",
        tasks: [
            "Tactic Ninja '3 Questions' Application - 15m",
            "Woodpecker sets (3D board) - 45m",
            "Lichess Coordinate Trainer (Score 30+) - 15m",
            "Opening Review: Bird Ch. 1-2 - 15m"
        ],
        courses: [
            {
                poster: "https://www.chessmood.com/storage/app/blog/chessmood-images/tactic-ninja-course.jpg",
                title: "Tactic Ninja",
                mission: "Installing the Combat Software",
                job: "Master the '3 Questions' thinking technique to find tactics before the opponent does.",
                coach: "GM Gabuzyan (ChessMood)",
                superpower: "Tactical Pattern Recognition",
                stats: "The '3 Question' System",
                link: "https://www.chessmood.com/course/tactic-ninja",
                courseDetails: {
                    chapters: 5,
                    length: "Pattern-based Method",
                    modules: [
                        { title: "Q1: Can I take something?", length: "Core skill" },
                        { title: "Q2: Can I attack something?", length: "Core skill" },
                        { title: "Q3: Can my opponent hurt me?", length: "Core skill" },
                        { title: "Patterns: Forks, Pins, Skewers", length: "Drill application" }
                    ]
                }
            },
            {
                poster: "https://www.chessable.com/img/books/105821726480610.png",
                title: "The Woodpecker Method",
                mission: "Building Speed & Volume",
                job: "Drill 1,100+ puzzles repeatedly until tactical vision becomes automatic.",
                coach: "GM Axel Smith & Hans Tikkanen",
                superpower: "Blitz-Speed Accuracy",
                stats: "1,128 Trainable Variations",
                link: "https://www.chessable.com/the-woodpecker-method/course/10582/",
                courseDetails: {
                    chapters: 3,
                    length: "1,128 Variations",
                    modules: [
                        { title: "Easy Puzzles (Warmup)", length: "222 Exercises" },
                        { title: "Medium Puzzles (Core)", length: "762 Exercises" },
                        { title: "Hard Puzzles (Mastery)", length: "144 Exercises" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 2: ESSENTIAL ENDGAMES ─────────────────────────────────────────────
    {
        month: 2,
        reward: "Unlocked: The Endgame Executioner",
        tasks: [
            "Silman Study + Stockfish Drill - 90m",
            "Daily Endgame Pillar (Dvoretsky basics) - 20m",
            "Tactics Maintenance - 45m",
            "Opening Review: 1...e5 Ch. 1-4 - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/1993991700492773.png",
                title: "Silman's Complete Endgame Course",
                mission: "Mastering the Art of the Finish",
                job: "Never lose a winning endgame or waste a drawn position ever again.",
                coach: "IM Jeremy Silman",
                superpower: "The Closing Specialist",
                stats: "10h 48m Video / 191 Puzzles",
                link: "https://www.chessable.com/silmans-complete-endgame-course/course/87711/",
                courseDetails: {
                    chapters: 9,
                    length: "10 hours 48 mins Video",
                    modules: [
                        { title: "Class D (1200-1399): King & Pawn", length: "105 mins" },
                        { title: "Class C (1400-1599): Opposition", length: "90 mins" },
                        { title: "Class B (1600-1799): Rook Endgames", length: "140 mins" },
                        { title: "Class A (1800-1999): Advanced Rooks", length: "160 mins" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 3: THE CALCULATION BRIDGE ─────────────────────────────────────────
    {
        month: 3,
        reward: "Unlocked: The Logic Engine",
        tasks: [
            "Calculation Drills (Written candidates) - 120m",
            "3D Board Verification Ritual - 15m",
            "Tactics Maintenance - 45m",
            "Opening Review: Benko Ch. 1-3 - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/1233331732536291.png",
                title: "Fundamental Chess Calculation Skills",
                mission: "Installing the 3-Ply Foundation",
                job: "Eliminate all 1-move blunders and spot opponent's threats before they happen.",
                coach: "CM Can Kabadayi",
                superpower: "Iron Logic",
                stats: "8h Video / Course of the Year 2023",
                link: "https://www.chessable.com/fundamental-chess-calculation-skills/course/123333/",
                courseDetails: {
                    chapters: 8,
                    length: "419 Trainable Variations",
                    modules: [
                        { title: "Level 1: Immediacy – One-movers", length: "108 Exercises" },
                        { title: "Level 2: The Core Elements", length: "115 Exercises" },
                        { title: "Level 3: Calculating Chains", length: "100 Exercises" },
                        { title: "Level 4: Master Level Accuracy", length: "96 Exercises" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 4: STRATEGIC STRUCTURES ───────────────────────────────────────────
    {
        month: 4,
        reward: "Unlocked: The Architect",
        tasks: [
            "PHN / Flores Rios Video Structure Study - 90m",
            "Kabadayi: Value of Pawns - 30m",
            "Tactics Maintenance - 45m",
            "Structure Application (Guess the Move) - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/145401721037544.png",
                title: "Chess Structures: A Grandmaster Guide",
                mission: "Decoding the Master's Blueprint",
                job: "Look at any pawn structure on the board and immediately know the next 15 moves.",
                coach: "GM Mauricio Flores Rios",
                superpower: "Grandmaster Structural Intuition",
                stats: "32h+ Video / 140 Model Games",
                link: "https://www.chessable.com/chess-structures-a-grandmaster-guide/course/14540/",
                courseDetails: {
                    chapters: 28,
                    length: "32 hours Video / 140 Games",
                    modules: [
                        { title: "The Isolani (IQP)", length: "6 Model Games" },
                        { title: "The Carlsbad Structure", length: "6 Model Games" },
                        { title: "The Hedgehog", length: "5 Model Games" },
                        { title: "The Sicilian Formations", length: "12 Model Games" }
                    ]
                }
            },
            {
                poster: "https://www.chessable.com/img/books/1034481668550504.png",
                title: "The Value of Pawns",
                mission: "The Science of Pawn Power",
                job: "Evaluate every pawn structure correctly and identify the correct plan instantly.",
                coach: "CM Can Kabadayi",
                superpower: "Structural Clarity",
                stats: "Interactive Drill System",
                link: "https://www.chessable.com/art-of-exchanging-pieces/course/103448/",
                courseDetails: {
                    chapters: 5,
                    length: "Pawn Structure Mastery",
                    modules: [
                        { title: "Passed Pawns", length: "Core Concept" },
                        { title: "Pawn Majorities", length: "Core Concept" },
                        { title: "Weak Squares", length: "Application" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 5: TACTICAL VOLUME II (WOODPECKER CYCLE 2) ────────────────────────
    {
        month: 5,
        reward: "Unlocked: The Speed Demon",
        tasks: [
            "Speed Woodpecker Cycle 2 - 90m",
            "Theme-filtered Tactics - 45m",
            "Opening Review: Bird Sidelines - 30m",
            "Endgame Drill (Timed) - 20m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/105821726480610.png",
                title: "The Woodpecker Method (Cycle 2)",
                mission: "Achieving Blitz-Like Processing",
                job: "Solve the same 1,128 puzzles 30-40% faster than Month 1 — because mastery is speed.",
                coach: "GM Axel Smith & Hans Tikkanen",
                superpower: "The Blitz Mind",
                stats: "High-Intensity Speed Repetition",
                link: "https://www.chessable.com/the-woodpecker-method/course/10582/",
                courseDetails: {
                    chapters: 3,
                    length: "1,128 Variations (Speed Focus)",
                    modules: [
                        { title: "Easy Set Regression Test", length: "4h Time Constraint" },
                        { title: "Medium Set Optimization", length: "12h Time Constraint" },
                        { title: "Hard Puzzles Focus", length: "Accuracy Priority" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 6: STRATEGIC IMBALANCES ───────────────────────────────────────────
    {
        month: 6,
        reward: "Unlocked: The Strategist",
        tasks: [
            "Silman Imbalance Video Study - 90m",
            "Imbalance Application to Own Game - 30m",
            "Tactics Maintenance - 45m",
            "Endgame Section 2000-2200 - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/2067051704192720.png",
                title: "How to Reassess Your Chess",
                mission: "Engineering the Winning Advantage",
                job: "Identify imbalances in any position and formulate a winning strategic plan.",
                coach: "IM Jeremy Silman",
                superpower: "The Architect's Vision",
                stats: "23.5h Video / Positional Bible",
                link: "https://www.chessable.com/how-to-reassess-your-chess/course/206705/",
                courseDetails: {
                    chapters: 10,
                    length: "23 hours 30 mins Video",
                    modules: [
                        { title: "Part I: Minor Pieces", length: "180 mins" },
                        { title: "Part II: Rooks and Files", length: "155 mins" },
                        { title: "Part III: Pawns and Structure", length: "240 mins" },
                        { title: "Part IV: Center and Strategy", length: "210 mins" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 7: PIECE COORDINATION ─────────────────────────────────────────────
    {
        month: 7,
        reward: "Unlocked: The Maestro",
        tasks: [
            "Kabadayi: Awakening/Exchanging Drills - 90m",
            "Zurich 1953 Game Study - 30m",
            "Tactics Maintenance - 45m",
            "Opening Novelty Research - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/1034481668550504.png",
                title: "The Art of Awakening Pieces",
                mission: "Orchestrating the Full Army",
                job: "Find the perfect square for every piece and dominate with coordinated piece play.",
                coach: "CM Can Kabadayi",
                superpower: "The Harmony Specialist",
                stats: "Coordination Trilogy — Part 1",
                link: "https://www.chessable.com/the-art-of-awakening-pieces/course/136015/",
                courseDetails: {
                    chapters: 6,
                    length: "208 Trainable Variations",
                    modules: [
                        { title: "Burying: Restricted Knights", length: "35 Exercises" },
                        { title: "Burying: Bad Bishops", length: "40 Exercises" },
                        { title: "Awakening: Pawn Breaks", length: "55 Exercises" },
                        { title: "Awakening: Diagonal Expansion", length: "48 Exercises" }
                    ]
                }
            },
            {
                poster: "https://www.chessable.com/img/books/1034481668550504.png",
                title: "The Art of Exchanging Pieces",
                mission: "The Art of Simplification",
                job: "Know exactly when to trade and when to keep pieces, unlocking strategic dominance.",
                coach: "CM Can Kabadayi",
                superpower: "The Trade Master",
                stats: "Coordination Trilogy — Part 2",
                link: "https://www.chessable.com/art-of-exchanging-pieces/course/103448/",
                courseDetails: {
                    chapters: 5,
                    length: "Interactive Drills",
                    modules: [
                        { title: "Good vs Bad Trades", length: "Core Concept" },
                        { title: "Simplifying into Winning Endgames", length: "Application" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 8: ENDGAME MASTERY ─────────────────────────────────────────────────
    {
        month: 8,
        reward: "Unlocked: The Master of Truth",
        tasks: [
            "Dvoretsky Rook Endings - 120m",
            "Syzygy Tablebase Verification - 20m",
            "Aagaard Calculation Supplement - 30m",
            "Bird/Benko Repertoire Patch - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/533701668525602.png",
                title: "Dvoretsky's Endgame Manual",
                mission: "Entering the Top 1%",
                job: "Memorize the critical theoretical endings that matter at the 2200+ level.",
                coach: "GM Karsten Müller",
                superpower: "The Professional Threshold",
                stats: "24h Video / 828 Exercises",
                link: "https://www.chessable.com/dvoretskys-endgame-manual-5th-edition/course/53370/",
                courseDetails: {
                    chapters: 16,
                    length: "24 hours Video / 828 Tests",
                    modules: [
                        { title: "Pawn Endings", length: "66 Trainable Positions" },
                        { title: "Knight Endings", length: "43 Trainable Positions" },
                        { title: "Bishop Endings", length: "85 Trainable Positions" },
                        { title: "Rook Endings (The Core)", length: "318 Trainable Positions" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 9: DEEP CALCULATION ────────────────────────────────────────────────
    {
        month: 9,
        reward: "Unlocked: The Mental Giant",
        tasks: [
            "GM Ramesh Level 1-5 Drills - 120m",
            "High-Level Lichess Puzzles (2000-2400) - 45m",
            "Opening Refresh (Boardless) - 30m",
            "Opening Deep Pre-Game Prep - 15m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/1218601673864948.png",
                title: "Improve Your Chess Calculation",
                mission: "The Grandmaster Bootcamp",
                job: "Build elite candidate-move discipline and deep variation stamina.",
                coach: "GM Ramesh R.B.",
                superpower: "The Calculation Tank",
                stats: "18h+ Video / 5 Elite Levels",
                link: "https://www.chessable.com/improve-your-chess-calculation/course/121860/",
                courseDetails: {
                    chapters: 5,
                    length: "18+ hours Video / 346 Puzzles",
                    modules: [
                        { title: "Level 1: Finding Forcing Moves", length: "80 Candidates" },
                        { title: "Level 2: Deep Forcing Lines", length: "70 Candidates" },
                        { title: "Level 3: Strategic Calculation", length: "65 Candidates" },
                        { title: "Level 4: Finding the Blind Spot", length: "65 Candidates" },
                        { title: "Level 5: Elite Combinations", length: "66 Candidates" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 10: GM THINKING PROCESS ───────────────────────────────────────────
    {
        month: 10,
        reward: "Unlocked: The Grandmaster",
        tasks: [
            "Gelfand Decision Drills - 120m",
            "Kabadayi: Multi-Purpose Move Drills - 30m",
            "Game Analysis (Engine Match) - 60m",
            "Tactics Maintenance - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/267021668540422.png",
                title: "Positional Decision Making in Chess",
                mission: "Thinking Like a World Challenger",
                job: "Master prophylaxis, restriction, and multi-purpose moves to think exactly like a GM.",
                coach: "GM Boris Gelfand",
                superpower: "The Gelfand Mindset",
                stats: "278 Positional Questions",
                link: "https://www.chessable.com/positional-decision-making-in-chess/course/26702/",
                courseDetails: {
                    chapters: 3,
                    length: "278 Positional Questions",
                    modules: [
                        { title: "Part I: The Squeeze (Akiba Rubinstein)", length: "96 Exercises" },
                        { title: "Part II: Space Advantage", length: "82 Exercises" },
                        { title: "Part III: Transformation of Structure", length: "100 Exercises" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 11: REPERTOIRE MASTERY ────────────────────────────────────────────
    {
        month: 11,
        reward: "Unlocked: The Unshakeable",
        tasks: [
            "Bird's Opening: Full Re-Study - 90m",
            "Benko Gambit Engine Novelty Hunt - 45m",
            "OTB Training Tournament - 4h",
            "Tactics Maintenance - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/821431668516008.png",
                title: "Lifetime Repertoires: Bird's Opening",
                mission: "The Opening Specialist",
                job: "Lock in move-20+ mastery for your Bird's Opening system — no surprises.",
                coach: "GM Simon Williams",
                superpower: "Opening Invincibility",
                stats: "Full Spaced Repetition Load",
                link: "https://www.chessable.com/lifetime-repertoires-birds-opening/course/82143/",
                courseDetails: {
                    chapters: 20,
                    length: "1,500+ Variations",
                    modules: [
                        { title: "1.f4 e5 Main Lines", length: "Core System" },
                        { title: "1.f4 d5 Stonewall Setup", length: "Strategic Weapon" },
                        { title: "Bird's Sidelines & Anti-Bird", length: "Full Coverage" }
                    ]
                }
            },
            {
                poster: "https://www.chessable.com/img/books/105821726480610.png",
                title: "Benko Gambit Blueprint",
                mission: "The Black Assassin's Toolkit",
                job: "Master the Benko's queenside play and long-term compensation to crush 1.d4 players.",
                coach: "GM Alexander Colovic",
                superpower: "The Benko Specialist",
                stats: "Complete Blueprint",
                link: "https://www.chessable.com/benko-gambit-blueprint/course/105821/",
                courseDetails: {
                    chapters: 12,
                    length: "Full Benko System",
                    modules: [
                        { title: "5.b6 Main Lines", length: "Core Gambit" },
                        { title: "5.bxc6 Fianchetto System", length: "Key Alternative" },
                        { title: "Anti-Benko Lines", length: "Defensive Resources" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 12: TOURNAMENT SUMMIT ─────────────────────────────────────────────
    {
        month: 12,
        reward: "Unlocked: THE CHESS MASTER",
        tasks: [
            "9-Point Calculation Practice - 60m",
            "Gelfand Dynamic Decisions - 60m",
            "List of Mistakes Audit - 30m",
            "Psychological Prime Ritual - 15m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/2340621719828478.png",
                title: "Pump Up Your Rating",
                mission: "突破 Breakthrough & Performance",
                job: "Peak your mental and technical state to perform at 2400 level in real tournament conditions.",
                coach: "GM Axel Smith",
                superpower: "Universal Master",
                stats: "Final Boss Phase",
                link: "https://www.chessable.com/pump-up-your-rating/course/234062/",
                courseDetails: {
                    chapters: 6,
                    length: "Grandmaster Capstone",
                    modules: [
                        { title: "The 9-Point Calculation Framework", length: "Tournament Prep" },
                        { title: "Dynamic Decision Making", length: "Gelfand Integration" },
                        { title: "The List of Mistakes", length: "Personal Audit" },
                        { title: "Endgame Consistency", length: "Verification" }
                    ]
                }
            }
        ]
    }
];

window.chessCurriculum = chessCurriculum;
