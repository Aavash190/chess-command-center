#!/usr/bin/env python3
"""
inject_nav.py  —  Injects a "Back to Command Center" navigation bar 
into a pre-generated Move Trainer HTML file.

Usage:
    python inject_nav.py "path/to/Trainer.html"
    python inject_nav.py --all     # processes all HTML files in Course Database
"""

import sys, os, glob

NAV_BAR = '''<div id="cc-nav-bar" style="
    position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
    background: rgba(10, 14, 20, 0.97);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; gap: 16px;
    padding: 8px 16px; font-family: 'Outfit', 'SF Pro Display', sans-serif;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
">
    <a href="../../../../../../index.html" id="cc-back-btn" style="
        display: flex; align-items: center; gap: 8px;
        color: #00f75a; text-decoration: none;
        font-size: 0.78rem; font-weight: 800;
        letter-spacing: 1.5px; text-transform: uppercase;
        padding: 6px 12px; border-radius: 6px;
        border: 1px solid rgba(0,247,90,0.3);
        transition: all 0.2s ease;
    " onmouseover="this.style.background='rgba(0,247,90,0.1)'"
       onmouseout="this.style.background='transparent'">
        ← COMMAND CENTER
    </a>
    <span style="color: rgba(255,255,255,0.2);">|</span>
    <span id="cc-course-label" style="color: rgba(255,255,255,0.6); font-size: 0.78rem; font-weight: 600;">
        Academy Masterclass
    </span>
    <div style="margin-left: auto; display: flex; gap: 10px; align-items: center;">
        <select id="cc-video-select" style="
            display: none;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff; padding: 5px 10px;
            border-radius: 6px; font-size: 0.75rem;
            cursor: pointer; outline: none; font-family: inherit;
        ">
        </select>
        <button id="cc-video-toggle" style="
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff; padding: 5px 12px;
            border-radius: 6px; font-size: 0.75rem;
            cursor: pointer; font-family: inherit; font-weight: 600;
            transition: all 0.2s;
            display: none;
        " onmouseover="this.style.background='rgba(255,255,255,0.12)'"
           onmouseout="this.style.background='rgba(255,255,255,0.06)'">
            📹 VIDEO
        </button>
    </div>
</div>
<div id="cc-video-overlay" style="
    display: none; position: fixed; top: 42px; right: 0; z-index: 99998;
    background: rgba(10,14,20,0.98); border-left: 1px solid rgba(255,255,255,0.08);
    border-bottom: 1px solid rgba(255,255,255,0.08); border-radius: 0 0 0 12px;
    padding: 12px; width: 480px;
">
    <video id="cc-video-player" controls style="width: 100%; border-radius: 8px; max-height: 270px;">
        <source src="" type="video/mp4">
    </video>
</div>
<script>
(function() {
    // Offset body so content isn't hidden behind nav bar
    document.documentElement.style.paddingTop = '42px';
    document.body.style.height = 'calc(100vh - 42px)';
    
    // Set course label from page title
    const titleEl = document.querySelector('title') || document.querySelector('.course-title');
    if (titleEl) {
        const label = document.getElementById('cc-course-label');
        if (label) label.textContent = titleEl.textContent || titleEl.innerText;
    }
    
    // Fix back button path - calculate from current location
    const backBtn = document.getElementById('cc-back-btn');
    let ups = '';
    if (backBtn) {
        // Count directory depth from root
        const path = window.location.pathname;
        const depth = (path.match(/\\//g) || []).length - 1;
        ups = Array(depth).fill('..').join('/');
        backBtn.href = ups + '/index.html';
    }
    
    // Load data.js dynamically
    const script = document.createElement('script');
    script.src = ups + '/data.js';
    script.onload = () => {
        if (!window.chessCurriculum) return;
        
        let currentCourse = null;
        let courseTitleMatch = (titleEl ? (titleEl.textContent || titleEl.innerText).trim() : '');
        
        // Find current course in data.js
        for (const month of window.chessCurriculum) {
            if (month.courses) {
                for (const c of month.courses) {
                    if (c.title === courseTitleMatch || c.htmlPath && window.location.pathname.includes(c.htmlPath.split('/').pop())) {
                        currentCourse = c;
                        break;
                    }
                }
            }
            if (currentCourse) break;
        }
        
        if (currentCourse && currentCourse.videos && currentCourse.videos.length > 0) {
            const videoToggle = document.getElementById('cc-video-toggle');
            const videoOverlay = document.getElementById('cc-video-overlay');
            const videoSelect = document.getElementById('cc-video-select');
            const videoPlayer = document.getElementById('cc-video-player');
            
            videoToggle.style.display = 'inline-block';
            videoSelect.style.display = 'inline-block';
            
            currentCourse.videos.forEach((v, i) => {
                const opt = document.createElement('option');
                opt.value = ups + '/' + v.path; // Make path relative
                opt.textContent = v.title;
                videoSelect.appendChild(opt);
            });
            
            if (videoPlayer) {
                videoPlayer.querySelector('source').src = ups + '/' + currentCourse.videos[0].path;
                videoPlayer.load();
            }
            
            videoSelect.addEventListener('change', () => {
                if (videoPlayer) {
                    videoPlayer.querySelector('source').src = videoSelect.value;
                    videoPlayer.load();
                    videoPlayer.play();
                }
            });
            
            videoToggle.addEventListener('click', () => {
                const isShown = videoOverlay.style.display !== 'none';
                videoOverlay.style.display = isShown ? 'none' : 'block';
            });
        }
    };
    document.head.appendChild(script);
})();
</script>
'''

def inject_nav(html_path):
    """Inject the nav bar into an HTML file, replacing an old one if it exists."""
    with open(html_path, encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Remove old injected nav if it exists
    start_tag = '<div id="cc-nav-bar"'
    end_tag = '</script>\n'
    if start_tag in content:
        start_idx = content.find(start_tag)
        end_idx = content.find(end_tag, start_idx)
        if end_idx != -1:
            content = content[:start_idx] + content[end_idx + len(end_tag):]
    
    # Inject after <body> tag
    insert_point = content.find('<body')
    if insert_point < 0:
        print(f'  [ERROR] No <body> tag found in: {html_path}')
        return False
    
    # Find end of opening <body> tag
    body_end = content.find('>', insert_point) + 1
    
    modified = content[:body_end] + '\n' + NAV_BAR + '\n' + content[body_end:]
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(modified)
    
    print(f'  [OK] Injected nav bar: {html_path}')
    return True


def main():
    if len(sys.argv) < 2 or sys.argv[1] == '--all':
        # Find all HTML files in Course Database
        pattern = os.path.join('Course Database', '**', '*.html')
        html_files = glob.glob(pattern, recursive=True)
        print(f'Found {len(html_files)} HTML files in Course Database')
        for f in html_files:
            inject_nav(f)
    else:
        path = sys.argv[1].strip('"').strip("'")
        if not os.path.isfile(path):
            print(f'ERROR: File not found: {path}')
            sys.exit(1)
        inject_nav(path)
    print('\nDone!')

if __name__ == '__main__':
    main()
