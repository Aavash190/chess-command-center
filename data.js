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
    {
        month: 1,
        reward: "Unlocked: The Eye of the Tiger",
        tasks: [
            "Woodpecker sets (3D board) - 45m",
            "Lichess Coordinate Trainer (Score 30+) - 15m",
            "Tactic Ninja '3 Questions' Application - 15m",
            "Opening Review: Bird Ch. 1-2 - 15m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/105821726480610.png",
                title: "Tactical Foundation",
                mission: "Building the Combat Software",
                job: "Solve all blunders & recognize tactical patterns instantly.",
                coach: "GM Axel Smith",
                superpower: "Tactical X-Ray Vision",
                stats: "1,100+ Puzzles",
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
            },
            {
                poster: "https://www.chessable.com/img/books/2067051704192720.png",
                title: "Positional Roots",
                mission: "Understanding the Imbalances",
                job: "Diagnose any position and find the correct plan automatically.",
                coach: "IM Jeremy Silman",
                superpower: "Structural Awareness",
                stats: "23.5h Video",
                link: "https://www.chessable.com/how-to-reassess-your-chess/course/206705/",
                courseDetails: {
                    chapters: 10,
                    length: "23 hours Video",
                    modules: [
                        { title: "Minor Pieces", length: "180 mins" },
                        { title: "Rooks and Files", length: "155 mins" },
                        { title: "Pawns and Structure", length: "240 mins" }
                    ]
                }
            }
        ]
    },
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
                title: "Essential Endgames",
                mission: "Mastering the Art of the Finish",
                job: "Never lose a winning endgame or draw a drawn one.",
                coach: "IM Jeremy Silman",
                superpower: "The Closing Specialist",
                stats: "10h Video",
                link: "https://www.chessable.com/silmans-complete-endgame-course/course/87711/",
                courseDetails: {
                    chapters: 9,
                    length: "10 hours Video",
                    modules: [
                        { title: "Class D (King & Pawn)", length: "105 mins" },
                        { title: "Class C (Opposition)", length: "90 mins" },
                        { title: "Class B (Rook Endgames)", length: "140 mins" }
                    ]
                }
            },
            {
                poster: "https://www.chessable.com/img/books/14841668541249.png",
                title: "100 Endgames You Must Know",
                mission: "Theoretical Guarantee",
                job: "Memorize the exact moves for the 100 most critical endgames.",
                coach: "GM Jesus de la Villa",
                superpower: "Precision Execution",
                stats: "16h Video",
                link: "https://www.chessable.com/100-endgames-you-must-know/course/1484/",
                courseDetails: {
                    chapters: 12,
                    length: "350+ Variations",
                    modules: [
                        { title: "Basic Endings", length: "14 Exercises" },
                        { title: "Knight vs Pawn", length: "21 Exercises" },
                        { title: "Rook vs Pawn", length: "34 Exercises" }
                    ]
                }
            }
        ]
    },
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
                title: "The Calculation Bridge",
                mission: "Installing the 3-Ply Foundation",
                job: "Eliminate all 1-move blunders and spite checks.",
                coach: "CM Can Kabadayi",
                superpower: "Iron Logic",
                stats: "8h Video",
                link: "https://www.chessable.com/fundamental-chess-calculation-skills/course/123333/",
                courseDetails: {
                    chapters: 8,
                    length: "419 Variations",
                    modules: [
                        { title: "Immediacy: One-movers", length: "108 Exercises" },
                        { title: "The Core Elements", length: "115 Exercises" },
                        { title: "Master Accuracy", length: "96 Exercises" }
                    ]
                }
            },
            {
                poster: "https://www.chessable.com/img/books/399081668545803.png",
                title: "Mastering Mates",
                mission: "The Executioner's Toolkit",
                job: "See mating nets 5 moves in advance like a super GM.",
                coach: "IM John Bartholomew",
                superpower: "Lethal Instinct",
                stats: "1,111 Puzzles",
                link: "https://www.chessable.com/mastering-mates-1/course/39908/",
                courseDetails: {
                    chapters: 4,
                    length: "1,111 Trainable Patterns",
                    modules: [
                        { title: "Back Rank Mates", length: "250 Exercises" },
                        { title: "Smothered Mates", length: "150 Exercises" },
                        { title: "Queen Sacrifices", length: "120 Exercises" }
                    ]
                }
            }
        ]
    },
    {
        month: 4,
        reward: "Unlocked: The Architect",
        tasks: [
            "PHN Video Structure Study - 90m",
            "Kabadayi: Value of Pawns - 30m",
            "Tactics Maintenance - 45m",
            "Structure Application (Guess the Move) - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/145401721037544.png",
                title: "Strategic Structures",
                mission: "Decoding the Master's Blueprint",
                job: "Look at any pawn structure and know the next 15 moves.",
                coach: "GM Mauricio Flores Rios",
                superpower: "Grandmaster Intuition",
                stats: "140 Model Games",
                link: "https://www.chessable.com/chess-structures-a-grandmaster-guide/course/14540/",
                courseDetails: {
                    chapters: 28,
                    length: "140 Games",
                    modules: [
                        { title: "The Isolani (IQP)", length: "6 Games" },
                        { title: "The Carlsbad Structure", length: "6 Games" },
                        { title: "The Sicilian Formations", length: "12 Games" }
                    ]
                }
            }
        ]
    },
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
                title: "Tactical Volume II",
                mission: "Achieving Blitz-Like Processing",
                job: "Solve 1,100 puzzles 30% faster than Month 1.",
                coach: "GM Axel Smith",
                superpower: "The Blitz Mind",
                stats: "Speed Repetition",
                link: "https://www.chessable.com/the-woodpecker-method/course/10582/",
                courseDetails: {
                    chapters: 3,
                    length: "1,128 Variations",
                    modules: [
                        { title: "Easy Set Regression Test", length: "Speed Focus" },
                        { title: "Medium Set Optimization", length: "Speed Focus" }
                    ]
                }
            },
            {
                poster: "https://www.chessable.com/img/books/1283621668541344.png",
                title: "The Attacking Manual",
                mission: "Crushing Defense",
                job: "Learn how to physically overwhelm opponents off the board.",
                coach: "GM Jacob Aagaard",
                superpower: "Relentless Aggression",
                stats: "Elite Attacking Guide",
                link: "https://www.chessable.com/attacking-manual-1/course/128362/",
                courseDetails: {
                    chapters: 7,
                    length: "Premium Attack Guide",
                    modules: [
                        { title: "Bringing all pieces into attack", length: "Core principle" },
                        { title: "Color schemes and squares", length: "Vision" }
                    ]
                }
            }
        ]
    },
    {
        month: 6,
        reward: "Unlocked: The Strategist",
        tasks: [
            "Silman Imbalance Video Study - 90m",
            "Imbalance Application to Game - 30m",
            "Tactics Maintenance - 45m",
            "Endgame Section 2000-2200 - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/2067051704192720.png",
                title: "Advanced Imbalances",
                mission: "Engineering the Winning Advantage",
                job: "Formulate grand strategies based on imbalances.",
                coach: "IM Jeremy Silman",
                superpower: "The Architect's Vision",
                stats: "Master Level Review",
                link: "https://www.chessable.com/how-to-reassess-your-chess/course/206705/",
                courseDetails: {
                    chapters: 10,
                    length: "23 hours Video",
                    modules: [
                        { title: "Minor Pieces", length: "180 mins" },
                        { title: "Center and Strategy", length: "210 mins" }
                    ]
                }
            }
        ]
    },
    {
        month: 7,
        reward: "Unlocked: The Maestro",
        tasks: [
            "Awakening/Exchanging Drills - 90m",
            "Zurich 1953 Game Study - 30m",
            "Tactics Maintenance - 45m",
            "Opening Novelty Research - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/1034481668550504.png",
                title: "Piece Coordination",
                mission: "Orchestrating the Full Attack",
                job: "Find the perfect square for every piece.",
                coach: "CM Can Kabadayi",
                superpower: "The Harmony Specialist",
                stats: "Coordination Trilogy",
                link: "https://www.chessable.com/the-art-of-awakening-pieces/course/136015/",
                courseDetails: {
                    chapters: 6,
                    length: "208 Variations",
                    modules: [
                        { title: "Burying Restricted Knights", length: "35 Exercises" },
                        { title: "Awakening Pawn Breaks", length: "55 Exercises" }
                    ]
                }
            }
        ]
    },
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
                title: "Endgame Mastery",
                mission: "Entering the Top 1%",
                job: "Memorize critical theoretical endings.",
                coach: "GM Karsten Müller",
                superpower: "The Professional Threshold",
                stats: "24h Video",
                link: "https://www.chessable.com/dvoretskys-endgame-manual-5th-edition/course/53370/",
                courseDetails: {
                    chapters: 16,
                    length: "24 hours Video / 828 Tests",
                    modules: [
                        { title: "Pawn Endings", length: "66 Positions" },
                        { title: "Rook Endings (The Core)", length: "318 Positions" }
                    ]
                }
            }
        ]
    },
    {
        month: 9,
        reward: "Unlocked: The Mental Giant",
        tasks: [
            "Ramesh Level 1-5 Drills - 120m",
            "High-Level Lichess Puzzles - 45m",
            "Opening Refresh (Boardless) - 30m",
            "Opening Deep Pre-Game Prep - 15m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/1218601673864948.png",
                title: "Elite Calculation",
                mission: "The Grandmaster Bootcamp",
                job: "Deep variation stamina and candidate move discipline.",
                coach: "GM Ramesh R.B.",
                superpower: "The Calculation Tank",
                stats: "18h+ Video / 5 Levels",
                link: "https://www.chessable.com/improve-your-chess-calculation/course/121860/",
                courseDetails: {
                    chapters: 5,
                    length: "18+ hours Video / 346 Puzzles",
                    modules: [
                        { title: "Deep Forcing Lines", length: "70 Candidates" },
                        { title: "Strategic Calculation", length: "65 Candidates" }
                    ]
                }
            }
        ]
    },
    {
        month: 10,
        reward: "Unlocked: The Grandmaster",
        tasks: [
            "Gelfand Decision Drills - 120m",
            "Multi-Purpose Move Drills - 30m",
            "Game Analysis (Engine Match) - 60m",
            "Tactics Maintenance - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/267021668540422.png",
                title: "GM Thinking Process",
                mission: "Thinking Like a World Challenger",
                job: "Master prophylaxis and restriction.",
                coach: "GM Boris Gelfand",
                superpower: "The Gelfand Mindset",
                stats: "Positional Mastery",
                link: "https://www.chessable.com/positional-decision-making-in-chess/course/26702/",
                courseDetails: {
                    chapters: 3,
                    length: "278 Questions",
                    modules: [
                        { title: "Part I: Squeeze (Rubinstein)", length: "96 Exercises" },
                        { title: "Part II: Space Advantage", length: "82 Exercises" }
                    ]
                }
            }
        ]
    },
    {
        month: 11,
        reward: "Unlocked: The Unshakeable",
        tasks: [
            "Bird/1...e5/Benko Deep Dive - 150m",
            "Engine Novelty Hunt - 45m",
            "OTB Training Tournament - 4h",
            "Tactics Maintenance - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/821431668516008.png",
                title: "Repertoire Mastery",
                mission: "The Opening Specialist",
                job: "Lock in move-20 mastery for your systems.",
                coach: "GM Gawain Jones",
                superpower: "Opening Confidence",
                stats: "Full Spaced Repetition Load",
                link: "https://www.chessable.com/lifetime-repertoires-gawain-jones-1-e5/course/82143/",
                courseDetails: {
                    chapters: 15,
                    length: "1,500+ Variations",
                    modules: [
                        { title: "1...e5 Defense", length: "Line Consolidation" },
                        { title: "Opening Novelties", length: "Deep Refresh" }
                    ]
                }
            }
        ]
    },
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
                title: "Tournament Summit",
                mission: "突破 Breakthrough & Performance",
                job: "Peak your state for professional play.",
                coach: "GM Axel Smith",
                superpower: "Universal Master",
                stats: "Final Boss Phase",
                link: "https://www.chessable.com/pump-up-your-rating/course/234062/",
                courseDetails: {
                    chapters: 6,
                    length: "Grandmaster Capstone",
                    modules: [
                        { title: "9-Point Calculation Framework", length: "Tournament Prep" },
                        { title: "List of Mistakes", length: "Personal Audit" }
                    ]
                }
            }
        ]
    }
];

window.chessCurriculum = chessCurriculum;
