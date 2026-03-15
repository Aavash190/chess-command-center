/**
 * SPACED REPETITION ENGINE (v1)
 * 
 * Handles move-level mastery tracking and interval scheduling.
 * Intervals (Hours): [0, 4, 24, 72, 168, 336, 720, 2160, 4320]
 */

const SR_INTERVALS = [0, 4, 24, 72, 168, 336, 720, 2160, 4320]; // Level 0 to 8

window.srEngine = {
    getData: function() {
        try {
            return JSON.parse(localStorage.getItem('chess_mastery_data') || '{}');
        } catch (e) {
            return {};
        }
    },

    saveData: function(data) {
        localStorage.setItem('chess_mastery_data', JSON.stringify(data));
    },

    getLearningState: function(courseId, movePath) {
        const data = this.getData();
        if (!data[courseId]) data[courseId] = {};
        
        if (!data[courseId][movePath]) {
            return {
                level: 0,
                nextReview: 0, // 0 means learn now
                lastReview: Date.now()
            };
        }
        return data[courseId][movePath];
    },

    updateLearningState: function(courseId, movePath, isCorrect) {
        const data = this.getData();
        if (!data[courseId]) data[courseId] = {};
        
        const state = data[courseId][movePath] || { level: 0 };
        
        if (isCorrect) {
            // Cap at level 8 (Mastered)
            state.level = Math.min(8, state.level + 1);
        } else {
            // Reset to level 1 for reinforcement
            state.level = 1;
        }

        const intervalHours = SR_INTERVALS[state.level];
        state.lastReview = Date.now();
        state.nextReview = state.lastReview + (intervalHours * 60 * 60 * 1000);
        
        data[courseId][movePath] = state;
        this.saveData(data);
        return state;
    },

    getReviewCount: function(courseId) {
        const data = this.getData();
        if (!data[courseId]) return 0;
        
        const now = Date.now();
        let count = 0;
        for (const path in data[courseId]) {
            const state = data[courseId][path];
            if (state.nextReview > 0 && state.nextReview <= now) {
                count++;
            }
        }
        return count;
    },

    isDue: function(courseId, movePath) {
        const state = this.getLearningState(courseId, movePath);
        if (state.level === 0) return true; // New moves are always "due" to be learned
        return state.nextReview <= Date.now();
    }
};
