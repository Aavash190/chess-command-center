/**
 * COURSE CARD MODULE (v5) - Premium Academy Bridge
 * 
 * Renders a rich, accordion-style curriculum section for the active month.
 * Redirects users to the dedicated academy.html training environment.
 */

function renderCourseCard(data) {
    const container = document.getElementById('course-card-container');
    if (!container) return;

    const courses = data.courses || [];
    
    // Create a grid container for the courses
    let html = `<div class="dashboard-grid">`;

    courses.forEach((course, cIdx) => {
        const courseKey = `m${data.month}_c${cIdx}`;
        const isMastered = localStorage.getItem(`course_mastered_${courseKey}`) === 'true';
        
        // Determine category based on title or context
        let category = "Tactics";
        if (course.title.toLowerCase().includes("strategy") || course.title.toLowerCase().includes("repertoire")) {
            category = "Strategy";
        } else if (course.title.toLowerCase().includes("endgame")) {
            category = "Endgame";
        }
        
        const catClass = category.toLowerCase();
        const poster = course.poster || 'https://www.chessable.com/img/book-default-small.png';

        html += `
            <div class="cc-course-card ${isMastered ? 'mastered' : ''}" id="course-item-${courseKey}">
                <div class="cc-card__image">
                    <img src="${poster}" alt="${course.title}" onerror="this.src='https://www.chessable.com/img/book-default-small.png'">
                    ${isMastered ? '<div style="position:absolute; top:0; right:0; background:var(--accent); color:#fff; padding:4px 8px; font-size:0.7rem; font-weight:800;">MASTERED</div>' : ''}
                </div>
                <div class="cc-card__details">
                    <div class="cc-card__top">
                        <div class="cc-stars">★★★★★</div>
                        <div class="cc-badge ${catClass}">${category}</div>
                    </div>
                    <h3 class="cc-card__title">${course.title}</h3>
                    <div class="cc-card__meta">
                        <span class="cc-coach">by ${course.coach}</span>
                    </div>
                    <p class="cc-card__job">${course.job}</p>
                    <div class="cc-card__footer">
                        <span class="cc-price">${course.price || '$24.99'}</span>
                        <div style="display:flex; gap:8px;">
                            <a href="${course.htmlPath || '#'}" class="cc-btn-start" style="text-decoration:none;">Train Now</a>
                            <div class="premium-checkbox ${isMastered ? 'checked' : ''}" 
                                 onclick="toggleCourseMastery('${courseKey}', event)"
                                 style="width:36px; height:36px; margin:0;"
                                 title="Mark as Mastered">
                                ${isMastered ? '✓' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function toggleCourseMastery(courseKey, event) {
    if (event) event.stopPropagation();
    const isMastered = localStorage.getItem(`course_mastered_${courseKey}`) === 'true';
    const newState = !isMastered;
    localStorage.setItem(`course_mastered_${courseKey}`, newState);

    const item = document.getElementById(`course-item-${courseKey}`);
    const checkbox = item.querySelector('.premium-checkbox');

    if (newState) {
        item.classList.add('mastered');
        checkbox.classList.add('checked');
        checkbox.innerHTML = '✓';
        if (window.cmdCenter) {
            window.cmdCenter.xp += 100;
            window.cmdCenter.updateXPDisplay();
            window.cmdCenter.showPositivityToast();
        }
        if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    } else {
        item.classList.remove('mastered');
        checkbox.classList.remove('checked');
        checkbox.innerHTML = '';
    }
}
