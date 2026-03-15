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
        theme: "tiger",
        dailyFocus: "Tactical Patterns",
        reward: "Unlocked: The Eye of the Tiger",
        tasks: [
            "Tactic Ninja '3 Questions' Application - 15m",
            "Woodpecker sets (3D board) - 45m",
            "Visualization: Square Color Recognition (Lichess) - 15m",
            "Opening: Bird's Ch. 1-2 (Train with PGN) - 30m",
            "Maintenance: Preventing Blunders (CLAMP Method) - 20m"
        ],
        courses: [
            {
                poster: "https://www.chessmood.com/storage/app/blog/chessmood-images/tactic-ninja-course.jpg",
                title: "Tactic Ninja",
                mission: "Installing the Combat Software",
                job: "Master the '3 Questions' thinking technique to find tactics before the opponent does.",
                coach: "GM Avetik Grigoryan",
                superpower: "Tactical Pattern Recognition",
                stats: "19h 26m Video / 383 Episodes",
                benefits: "You will stop 'hoping' for tactics and start 'creating' them by understanding the underlying motifs.",
                link: "https://www.chessmood.com/course/tactic-ninja",
                courseDetails: {
                    chapters: 10,
                    length: "19 hours 26 mins Video",
                    quality: "Elite / Game-Changing",
                    accolades: "Community Favourite - Best Tactical Course 2024",
                    modules: [
                        { title: "Awareness Stage: Patterns", length: "120 mins" },
                        { title: "Sharp Eye Stage: Recognition", length: "240 mins" },
                        { title: "The 3 Questions System", length: "Core Skill" }
                    ]
                }
            },
            {
                poster: "assets/posters/woodpecker_poster.jpg",
                title: "The Woodpecker Method 1 - Tactical Play",
                mission: "Building Speed & Volume",
                job: "Drill 1,100+ puzzles repeatedly until tactical vision becomes automatic.",
                coach: "GM Axel Smith & Hans Tikkanen",
                superpower: "Blitz-Speed Accuracy",
                stats: "1,128 Trainable Variations",
                benefits: "Your brain will 'auto-complete' tactical patterns, saving you massive amounts of time on the clock.",
                link: "https://www.chessable.com/the-woodpecker-method/course/10582/",
                courseDetails: {
                    chapters: 3,
                    length: "1,128 Variations",
                    quality: "Legendary / High Volume",
                    accolades: "The 'Bible' of Pattern Recognition",
                    modules: [
                        { title: "Easy Puzzles (Warmup)", length: "222 Exercises" },
                        { title: "Medium Puzzles (Core)", length: "762 Exercises" },
                        { title: "Hard Puzzles (Mastery)", length: "144 Exercises" }
                    ]
                },
                videos: [
                    { title: "1. Introduction", path: "Course Database/Month 1/The Woodpecker Method 1 - Tactical Play/Videos/1. Introduction.mp4" },
                    { title: "2. Summary Of Tactical Motifs", path: "Course Database/Month 1/The Woodpecker Method 1 - Tactical Play/Videos/2. Summary Of Tactical Motifs.mp4" },
                    { title: "3. Instructions", path: "Course Database/Month 1/The Woodpecker Method 1 - Tactical Play/Videos/3. Instructions.mp4" },
                    { title: "4. Easy Exercises", path: "Course Database/Month 1/The Woodpecker Method 1 - Tactical Play/Videos/4. Easy Exercises.mp4" },
                    { title: "5. Intermediate Exercises I", path: "Course Database/Month 1/The Woodpecker Method 1 - Tactical Play/Videos/5.1. Intermediate Exercises I.mp4" },
                    { title: "6. Intermediate Exercises II", path: "Course Database/Month 1/The Woodpecker Method 1 - Tactical Play/Videos/6.1 Intermediate Exercises II.mp4" },
                    { title: "7. Intermediate Exercises III", path: "Course Database/Month 1/The Woodpecker Method 1 - Tactical Play/Videos/7. Intermediate Exercises III.mp4" },
                    { title: "8. Advanced Exercises", path: "Course Database/Month 1/The Woodpecker Method 1 - Tactical Play/Videos/8. Advanced Exercises.mp4" }
                ]
            },
            {
                poster: "https://www.chessable.com/img/books/1758691732537243.png",
                title: "Preventing Blunders",
                mission: "The Safety Protocol",
                job: "Install the CLAMP method to stop giving away pieces for free.",
                coach: "CM Can Kabadayi",
                superpower: "Blunder Immunity",
                stats: "6h Video / Best Seller 2025",
                benefits: "You will eliminate those 'heartbreak' moments where you throw away a winning game in one move.",
                link: "https://www.chessable.com/preventing-blunders-the-clamp-method-to-stop-throwing-games/course/175869/",
                courseDetails: {
                    chapters: 5,
                    length: "6 hours Video",
                    quality: "Essential / Defensive",
                    accolades: "S-Tier Error Correction Method",
                    modules: [
                        { title: "The CLAMP Method", length: "Foundational" },
                        { title: "Awareness Drills", length: "Core" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 2: ESSENTIAL ENDGAMES ─────────────────────────────────────────────
    {
        month: 2,
        theme: "ice",
        dailyFocus: "Endgame Mechanics",
        reward: "Unlocked: The Endgame Executioner",
        tasks: [
            "Silman Study + Stockfish Drill - 90m",
            "Intermediate Moves (Zwischenzug) Drill - 15m",
            "Visualization: Square Color (Boardless test) - 15m",
            "Tactics Maintenance: Lichess (1700-2000) - 40m",
            "Opening: Bird's Ch. 3-6 (Train with PGN) - 20m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/877111700492773.png",
                title: "Silman's Complete Endgame Course",
                mission: "The Practical Foundation",
                job: "Never lose a winning endgame or waste a drawn position ever again.",
                coach: "IM Jeremy Silman",
                superpower: "Practical Endgame Sense",
                stats: "9h 54m Video / 191 Puzzles",
                benefits: "You will feel a calm confidence as the pieces come off the board, knowing you are a better 'closer' than your opponent.",
                link: "https://www.chessable.com/silmans-complete-endgame-course/course/87711/",
                courseDetails: {
                    chapters: 9,
                    length: "9 hours 54 mins Video",
                    modules: [
                        { title: "Class D (1200-1399): Pawn Endings", length: "105 mins" },
                        { title: "Class C (1400-1599): Opposition", length: "90 mins" },
                        { title: "Class B (1600-1799): Rook Endgames", length: "140 mins" }
                    ]
                }
            },
        ]
    },

    // ─── MONTH 3: THE CALCULATION BRIDGE ─────────────────────────────────────────
    {
        month: 3,
        theme: "electric",
        dailyFocus: "Calculation Logic",
        reward: "Unlocked: The Logic Engine",
        tasks: [
            "Calculation: Write candidates on paper - 100m",
            "The Art of Defense (Hellsten Basics) - 20m",
            "Visualization: File & Rank Vision (Rook sweeps) - 15m",
            "Tactics Maintenance: Lichess (1800-2100) - 45m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/1233331732536291.png",
                title: "Fundamental Chess Calculation Skills",
                mission: "Installing the 3-Ply Foundation",
                job: "Eliminate all 1-move blunders and spot opponent's threats before they happen.",
                coach: "CM Can Kabadayi",
                superpower: "Iron Logic",
                stats: "8h 13m Video / 368 Exercises",
                benefits: "You will develop a 'safety net' for your brain, catching tactical errors before you ever make them on the real board.",
                link: "https://www.chessable.com/fundamental-chess-calculation-skills/course/123333/",
                courseDetails: {
                    chapters: 8,
                    length: "8 hours 13 mins Video",
                    quality: "Elite / High Contrast",
                    accolades: "Community standard for calculation clarity.",
                    modules: [
                        { title: "Level 1: Immediacy – One-movers", length: "108 Exercises" },
                        { title: "Level 2: The Core Elements", length: "115 Exercises" },
                        { title: "Level 4: Master Level Accuracy", length: "96 Exercises" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 4: STRATEGIC STRUCTURES ───────────────────────────────────────────
    {
        month: 4,
        theme: "stone",
        dailyFocus: "Structural Integrity",
        reward: "Unlocked: The Architect",
        tasks: [
            "PHN / Flores Rios Video Structure Study - 90m",
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
                benefits: "You will never feel 'lost' in a middlegame again; the board will speak to you through the language of pawns.",
                link: "https://www.chessable.com/chess-structures-a-grandmaster-guide/course/14540/",
                courseDetails: {
                    chapters: 28,
                    length: "32 hours Video / 140 Games",
                    quality: "Elite / Grandmaster Standard",
                    accolades: "Widely considered the definitive work on pawn structures.",
                    modules: [
                        { title: "The Isolani (IQP)", length: "6 Model Games" },
                        { title: "The Carlsbad Structure", length: "6 Model Games" },
                        { title: "The Sicilian Formations", length: "12 Model Games" }
                    ]
                }
            },
        ]
    },

    // ─── MONTH 5: TACTICAL VOLUME II (WOODPECKER CYCLE 2) ────────────────────────
    {
        month: 5,
        reward: "Unlocked: The Speed Demon",
        tasks: [
            "Speed Woodpecker Cycle 2 - 90m",
            "Visualization: Diagonal Vision (Pathfinding) - 15m",
            "Tactics: Theme-filtered (Pins/Forks) - 45m",
            "Opening: Bird's sidelines (Train with PGN) - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/105821721037544.png",
                title: "The Woodpecker Method - Cycle 2",
                mission: "Achieving Blitz-Like Processing",
                job: "Solve the same 1,128 puzzles 30-40% faster than Month 1 — because mastery is speed.",
                coach: "GM Axel Smith & Hans Tikkanen",
                superpower: "The Blitz Mind",
                stats: "High-Intensity Speed Repetition",
                benefits: "You will achieve 'blitz-speed' processing, allowing you to dominate in time scrambles and see winning tactics in a flash.",
                link: "https://www.chessable.com/the-woodpecker-method/course/10582/",
                courseDetails: {
                    chapters: 3,
                    length: "1,128 Variations (Speed Focus)",
                    modules: [
                        { title: "Easy Set Regression Test", length: "4h Time Constraint" },
                        { title: "Medium Set Optimization", length: "12h Time Constraint" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 6: STRATEGIC IMBALANCES ───────────────────────────────────────────
    {
        month: 6,
        reward: "Unlocked: The Strategic Visionary",
        tasks: [
            "Silman Reassess (Video + Imbalances) - 90m",
            "Woodpecker 2: Positional Flow - 30m",
            "Visualization: Diagonal Vision (Mastery) - 15m",
            "Opening: 1...e5 (Full Repertoire) - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/877101668499264.png",
                title: "How to Reassess Your Chess",
                mission: "Engineering the Winning Advantage",
                job: "Formulate grand strategies based on Silman's 7 positional imbalances.",
                coach: "IM Jeremy Silman",
                superpower: "The Architect's Vision",
                stats: "23.5h Video / Classic Strategy",
                benefits: "You will develop the ability to 'read' the board like a grandmaster, identifying exactly where to strike based on the subtle imbalances of the position.",
                link: "https://www.chessable.com/how-to-reassess-your-chess/course/87710/",
                courseDetails: {
                    chapters: 15,
                    length: "23.5 hours Video",
                    quality: "Elite / Philosophical",
                    accolades: "The All-Time Highest Rated Strategy Course on Chessable.",
                    modules: [
                        { title: "Minor Piece Imbalances", length: "Part I" },
                        { title: "Space and Pawn Structure", length: "Part II" }
                    ]
                }
            },
            {
                poster: "https://www.chessable.com/img/books/1758691732537243.png",
                title: "Chess Crime and Punishment",
                mission: "Positional Awareness",
                job: "Study tactical and positional crimes your opponents commit.",
                coach: "CM Can Kabadayi",
                superpower: "Strategic Vigilance",
                stats: "Best Seller / Punisher Mindset",
                benefits: "You will learn to relentlessly exploit your opponent's mistakes, whether tactical or positional, turning every 'crime' into a victory.",
                link: "https://www.chessable.com/chess-crime-and-punishment-how-to-spot-and-exploit-positional-errors/course/175869/",
                courseDetails: {
                    chapters: 5,
                    length: "6 hours Video",
                    modules: [
                        { title: "The Sin of Passivity", length: "Study" }
                    ]
                }
            },
            {
                poster: "https://www.chessable.com/img/books/1560121721037544.png",
                title: "The Woodpecker Method 2 (Positional)",
                mission: "Automating Strategic Vision",
                job: "Drill 1,000+ positional puzzles to make strategic intuition as fast as tactical vision.",
                coach: "GM Axel Smith & Hans Tikkanen",
                superpower: "Grandmaster Strategic Flow",
                stats: "1,000 Positional Exercises",
                benefits: "You will 'feel' the best positional moves without thinking, just like you see tactical forks.",
                link: "https://www.chessable.com/the-woodpecker-method-2-positional/course/156012/",
                courseDetails: {
                    chapters: 15,
                    length: "1,000 Exercises"
                }
            }
        ]
    },

    // ─── MONTH 7: PIECE COORDINATION ─────────────────────────────────────────────
    {
        month: 7,
        reward: "Unlocked: The Harmony Master",
        tasks: [
            "Piece Coordination Mastery - 90m",
            "Visualization: Knight Sight (Drills) - 15m",
            "Zurich 1953: Guess-the-move - 40m",
            "Opening: Benko (Full Repertoire) - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/1034481668550504.png",
                title: "The Art of Awakening Pieces",
                mission: "Orchestrating the Attack",
                job: "Make your pieces 'talk' to each other and coordinate for a crushing blow.",
                coach: "CM Can Kabadayi",
                superpower: "The Harmony Specialist",
                stats: "4h 51m Video / 55 Exercises",
                benefits: "You will discover how to bring your least active pieces into the game, creating a coordinated army that is greater than the sum of its parts.",
                link: "https://www.chessable.com/the-art-of-awakening-pieces/course/103448/",
                courseDetails: {
                    chapters: 7,
                    length: "4 hours 51 mins Video",
                    quality: "Mastery / Dynamic",
                    accolades: "The 'Secret Weapon' for piece activity.",
                    modules: [
                        { title: "Awakening: Pawn Breaks", length: "55 Exercises" },
                        { title: "Sacrificing for Activation", length: "30 Exercises" }
                    ]
                }
            },
            {
                poster: "https://www.chessable.com/img/books/823741668504044.png",
                title: "The Art of Exchanging Pieces",
                mission: "Strategic Trade Mastery",
                job: "Learn when to trade and when to keep pieces, unlocking strategic dominance.",
                coach: "CM Can Kabadayi",
                superpower: "The Trade Master",
                stats: "5h 58m Video / 421 Variations",
                benefits: "You will master the subtle art of the trade, ensuring that every exchange leaves you with a superior position and a clearer path to victory.",
                link: "https://www.chessable.com/art-of-exchanging-pieces/course/82374/",
                courseDetails: {
                    chapters: 11,
                    length: "5 hours 58 mins Video",
                    modules: [
                        { title: "Exploiting Weaknesses", length: "Core Trade" },
                        { title: "Endgame Transitions", length: "Application" }
                    ]
                }
            },
            {
                poster: "https://www.chessable.com/img/books/901911668504144.png",
                title: "The Art of Burying Pieces",
                mission: "Restrictive Prophylaxis",
                job: "Learn to systematically immobilize enemy pieces by creating 'prisoners' on the board.",
                coach: "CM Can Kabadayi",
                superpower: "The Restriction Specialist",
                stats: "4h 54m Video / 85 Puzzles",
                benefits: "You will learn the dark art of restriction, leaving your opponent's pieces stranded and useless while you dominate the rest of the board.",
                link: "https://www.chessable.com/the-art-of-burying-pieces/course/90191/",
                courseDetails: {
                    chapters: 15,
                    length: "4 hours 54 mins Video",
                    modules: [
                        { title: "Burying the Fianchetto Knight", length: "Execution" },
                        { title: "Burying Bishops with Pawn Breaks", length: "Advanced" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 8: ENDGAME MASTERY ─────────────────────────────────────────────────
    {
        month: 8,
        reward: "Unlocked: The Threshold Breaker",
        tasks: [
            "Dvoretsky Manual Study - 90m",
            "Visualization: Knight Pathfinding (h1 to a8) - 20m",
            "Tactics: Lichess 2200+ difficulty - 45m",
            "Maintenance: Patching Repertoire Gaps - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/430481668478491.png",
                title: "Dvoretsky's Endgame Manual",
                mission: "Entering the Top 1%",
                job: "Master the theoretical endings that separate masters from amateurs.",
                coach: "GM Karsten Müller & GM Erwin l'Ami",
                superpower: "Theoretical Invincibility",
                stats: "24h 8m Video / 840 Variations",
                benefits: "You will achieve 'Grandmaster-level' endgame technique, entering every endgame with the absolute certainty that you can hold or win.",
                link: "https://www.chessable.com/dvoretskys-endgame-manual-5th-edition/course/43048/",
                courseDetails: {
                    chapters: 16,
                    length: "24 hours 8 mins Video",
                    quality: "Legendary / World-Class",
                    accolades: "Mandatory study for every aspiring Grandmaster.",
                    modules: [
                        { title: "Essential Pawn Endings", length: "Part I" },
                        { title: "Practical Rook Endings", length: "The Big One" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 9: DEEP CALCULATION ────────────────────────────────────────────────
    {
        month: 9,
        reward: "Unlocked: The Calculation Tank",
        tasks: [
            "Ramesh GM Prep Calc (Hard) - 90m",
            "Unbreakable Defense (Nigmatov Brutality) - 30m",
            "Visualization: Deep Boardless puzzles - 20m",
            "Tactics: Lichess 'Long' Puzzles - 45m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/1495901695279640.png",
                title: "Improve Your Chess Calculation",
                mission: "The Grandmaster Bootcamp",
                job: "Build deep variation stamina and candidate move discipline under GM Ramesh's elite system.",
                coach: "GM Ramesh R.B.",
                superpower: "The Calculation Tank",
                stats: "18h 36m Video / Masterclass",
                benefits: "You will build the mental stamina of a marathon runner, able to calculate deep, complex variations for hours without losing accuracy.",
                link: "https://www.chessable.com/improve-your-chess-calculation/course/149590/",
                courseDetails: {
                    chapters: 5,
                    length: "18 hours 36 mins Video",
                    quality: "Legendary / High Stamina",
                    accolades: "Taught by the coach of the World's youngest Grandmasters.",
                    modules: [
                        { title: "Deep Visualization", length: "Level 1" },
                        { title: "Candidate Selection", length: "Level 2" }
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
            "Visualization: Knight Sight (2-move jumps) - 20m",
            "Maintenance: Art of Multi-Purpose Moves - 30m",
            "Tactics Maintenance: 2200+ Difficulty - 45m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/267021668540422.png",
                title: "Positional Decision Making in Chess",
                mission: "Thinking Like a World Challenger",
                job: "Master prophylaxis, restriction, and multi-purpose moves to think exactly like a world-class GM.",
                coach: "GM Boris Gelfand & GM Jacob Aagaard",
                superpower: "The Gelfand Mindset",
                stats: "278 Master Questions / 4.5 Stars",
                benefits: "You will adopt the high-level decision-making process of a World Championship challenger, learning to balance static and dynamic factors perfectly.",
                link: "https://www.chessable.com/positional-decision-making-in-chess/course/26702/",
                courseDetails: {
                    chapters: 3,
                    length: "278 Master Exercises",
                    quality: "Elite / Grandmaster Logic",
                    accolades: "Winner of the ECF Book of the Year Award.",
                    modules: [
                        { title: "The Squeeze (Rubinstein)", length: "96 Puzzles" },
                        { title: "Space Advantage", length: "82 Puzzles" }
                    ]
                }
            }
        ]
    },

    // ─── MONTH 11: REPERTOIRE MASTERY ────────────────────────────────────────────
    {
        month: 11,
        reward: "Unlocked: The Repertoire King",
        tasks: [
            "Opening Mastery: All 4 Systems - 90m",
            "Visualization: Memory Blindfold Drill - 30m",
            "Maintenance: 2200+ Tactics - 45m",
            "Analysis: Recent Pro Games Study - 30m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/217031668541244.png",
                title: "Lifetime Repertoires - Bird's Opening",
                mission: "The Opening Specialist",
                job: "Lock in move-20 mastery for 1.f4 and catch 99% of opponents off-guard.",
                coach: "GM Vjekoslav Živković & GM Banzea",
                superpower: "Unshakeable Confidence",
                stats: "20h Video / 647 Variations",
                benefits: "You will achieve 'move-20' mastery in your primary weapon, ensuring you walk to every game with a significant psychological and theoretical edge.",
                link: "https://www.chessable.com/lifetime-repertoires-birds-opening/course/21703/",
                courseDetails: {
                    chapters: 15,
                    length: "20 hours Video",
                    quality: "Elite / Specialized",
                    accolades: "The definitive modern repertoire for the Bird's Opening.",
                    modules: [
                        { title: "The Bird Lasker", length: "Anti-Bird Logic" }
                    ]
                }
            },
            {
                poster: "https://www.chessable.com/img/books/1175651668508842.png",
                title: "The Benko Blueprint",
                mission: "The Gambit Specialist",
                job: "Master the most aggressive response to 1.d4 for master play.",
                coach: "GM Milos Perunovic",
                superpower: "Relentless Counterplay",
                stats: "Elite GM Repertoire",
                benefits: "You will master one of the most respected gambits in chess, learning how to generate relentless pressure from move 1.",
                link: "https://www.chessable.com/the-benko-blueprint/course/117565/",
                courseDetails: {
                    chapters: 10,
                    length: "Full Repertoire"
                }
            }
        ]
    },

    // ─── MONTH 12: TOURNAMENT SUMMIT ─────────────────────────────────────────────
    {
        month: 12,
        reward: "Unlocked: THE CHESS MASTER",
        tasks: [
            "Final Summit: Pump Up Your Rating - 60m",
            "Visualization: Knight Pathfinding (Pre-round) - 20m",
            "Maintenance: Opponent Prep Database - 30m",
            "Tournament Play: Classical/OTB - 120m"
        ],
        courses: [
            {
                poster: "https://www.chessable.com/img/books/244301668525044.png",
                title: "Pump Up Your Rating",
                mission: "The Tournament Breakthrough",
                job: "Peak your tactical and positional state for actual tournament domination.",
                coach: "GM Axel Smith",
                superpower: "Universal Tournament Master",
                stats: "14h Video / 404 Exercises",
                benefits: "You will peak your skills for the final 'summit', integrating everything you've learned into a cohesive, professional-level tournament performance.",
                link: "https://www.chessable.com/pump-up-your-rating/course/24430/",
                courseDetails: {
                    chapters: 9,
                    length: "14 hours Masterclass",
                    quality: "Elite / Tournament Prep",
                    accolades: "Award-winning curriculum for peaking at the 2400 level.",
                    modules: [
                        { title: "The List of Mistakes", length: "Crucial" },
                        { title: "Dynamic Decision Making", length: "Elite" }
                    ]
                }
            }
        ]
    }
];

window.chessCurriculum = chessCurriculum;
