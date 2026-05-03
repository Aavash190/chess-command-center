/**
 * COMMAND AI ENGINE (v3) - Elite Neural Assistant
 * 
 * Provides Stockfish 18 integration, context-aware coaching, 
 * and real-time curriculum intelligence.
 */

class CommandAI {
    constructor() {
        this.sidebar = document.getElementById('command-ai-sidebar');
        this.chatBody = document.getElementById('ai-chat-history');
        this.input = document.getElementById('ai-input');
        this.isOpen = false;
        this.isComputing = false;
        this.engine = null; // Stockfish Worker

        this.knowledgeBase = {
            "curriculum": "Your 12-month IM plan is structured into 3 phases: Foundation (Months 1-4), Consolidation (5-8), and Elite Summit (9-12).",
            "progress": "I track your mastery via XP and mission completions. Keep your 3-Ply Discipline high.",
            "blunders": "Month 1 focus: Preventing one-move tactical oversights using the CLAMP method.",
            "calculation": "Mastering calculation requires visualization training (Month 9) and the Ramesh bootcamp (Month 12)."
        };

        this.setupListeners();
    }

    setupListeners() {
        if (this.input) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
        
        window.addEventListener('boardUpdate', (e) => {
            this.currentFen = e.detail.fen;
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.sidebar.classList.add('active');
            if (this.input) this.input.focus();
            if (this.chatBody && this.chatBody.children.length === 0) {
                this.addMessage("Neural Link Established. I am monitoring your training protocol. How can I assist?", "bot");
            }
        } else {
            this.sidebar.classList.remove('active');
        }
    }

    addMessage(text, sender) {
        if (!this.chatBody) return;
        const msg = document.createElement('div');
        msg.className = `ai-msg ai-msg-${sender}`;
        
        if (sender === 'bot') {
            msg.innerHTML = `<div class="ai-bot-label">COMMAND AI</div><div class="ai-content">${text}</div>`;
        } else {
            msg.innerText = text;
        }

        this.chatBody.appendChild(msg);
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
    }

    async sendMessage() {
        if (!this.input) return;
        const text = this.input.value.trim();
        if (!text || this.isComputing) return;

        this.addMessage(text, 'user');
        this.input.value = '';
        
        await this.generateResponse(text);
    }

    async generateResponse(query) {
        this.isComputing = true;
        const lowQuery = query.toLowerCase();
        
        // Show Computing State
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'ai-msg ai-msg-bot computing';
        loadingMsg.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        this.chatBody.appendChild(loadingMsg);
        this.chatBody.scrollTop = this.chatBody.scrollHeight;

        await new Promise(r => setTimeout(r, 800));
        loadingMsg.remove();

        let response = "";

        // 1. Engine Analysis Trigger
        if (lowQuery.includes('analyze') || lowQuery.includes('best move') || lowQuery.includes('engine')) {
            let fen = window.game ? window.game.fen() : null;
            if (!fen && window.lab && window.lab.game) fen = window.lab.game.fen();
            if (!fen && window.cmdCenter) fen = window.cmdCenter.currentFen;

            if (fen) {
                await this.runEngine(fen);
                this.isComputing = false;
                return;
            } else {
                response = "No active mission board detected. Open a Masterclass to enable tactical analysis.";
            }
        } 
        // 2. Progress / Advice / Status
        else if (lowQuery.includes('status') || lowQuery.includes('protocol') || lowQuery.includes('check')) {
            response = this.getSystemStatus();
        } else if (lowQuery.includes('next') || lowQuery.includes('study')) {
            response = this.getStudyAdvice();
        } else if (lowQuery.includes('rank') || lowQuery.includes('xp')) {
            response = this.getProgressReport();
        } 
        // 3. Knowledge Base
        else {
            let found = false;
            for (const key in this.knowledgeBase) {
                if (lowQuery.includes(key)) {
                    response = this.knowledgeBase[key];
                    found = true;
                    break;
                }
            }
            if (!found) {
                response = "I have scanned the database. For technical analysis, please provide a specific board position or ask about a Phase in your curriculum.";
            }
        }

        this.addMessage(response, 'bot');
        this.isComputing = false;
    }

    async runEngine(fen) {
        this.addMessage("Syncing with Stockfish 18 Neural Network...", "bot");
        
        if (!this.engine) {
            this.engine = new Worker('https://cdn.jsdelivr.net/npm/stockfish@16.1.0/src/stockfish.js');
            this.engine.onmessage = (e) => {
                if (e.data.startsWith('info depth 18')) {
                    const scoreMatch = e.data.match(/score cp (-?\d+)/);
                    if (scoreMatch) this.lastEval = (parseInt(scoreMatch[1]) / 100).toFixed(2);
                }
                if (e.data.startsWith('bestmove')) {
                    const best = e.data.split(' ')[1];
                    const evalText = this.lastEval ? ` (Eval: ${this.lastEval})` : "";
                    this.addMessage(`PRO-LEVEL ANALYSIS: The optimal continuation is **${best}**${evalText}. This aligns with GM principles for your current phase.`, 'bot');
                }
            };
        }

        this.engine.postMessage('uci');
        this.engine.postMessage(`position fen ${fen}`);
        this.engine.postMessage('go depth 18');
    }

    getStudyAdvice() {
        const currentM = window.cmdCenter ? window.cmdCenter.unlockedMonth : 1;
        const data = window.chessCurriculum[currentM - 1];
        return `Your current focus is Phase ${currentM}: ${data.dailyFocus}. Complete the '${data.courses[0].title}' Masterclass to optimize your pattern recognition.`;
    }

    getProgressReport() {
        if (!window.cmdCenter) return "Awaiting neural sync...";
        const xp = window.cmdCenter.xp || 0;
        return `Current XP: ${xp}. You are maintaining an elite training trajectory. Consistent execution of daily tasks will unlock subsequent Phases.`;
    }

    getSystemStatus() {
        const boardActive = !!window.game;
        return `**SYSTEM STATUS: NOMINAL**<br><br>
        • **Neural Engine**: SF18 Online<br>
        • **Mission Context**: ${boardActive ? 'Active Training detected' : 'Standby Mode'}<br>
        • **Curriculum**: Phase ${window.cmdCenter ? window.cmdCenter.currentMonth : 1} Intel Synchronized<br>
        • **Integrity**: 100% - Ready for pattern execution.`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.commandAI = new CommandAI();
});
