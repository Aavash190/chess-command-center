document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('nav-container');
    const contentArea = document.getElementById('markdown-content');
    
    // Convert filenames to human readable titles
    function formatTitle(key) {
        return key.replace(/_/g, ' ')
                  .replace(/\b\w/g, char => char.toUpperCase());
    }

    // Render the navigation menu
    const keys = Object.keys(libraryData);
    keys.forEach((key, index) => {
        const link = document.createElement('a');
        link.className = 'nav-item';
        link.innerText = formatTitle(key);
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Highlight active link
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            link.classList.add('active');
            
            // Render markdown to HTML using marked.js
            const rawMarkdown = libraryData[key];
            if (rawMarkdown) {
                // Configure marked to use standard settings
                marked.setOptions({
                    gfm: true,
                    breaks: true,
                    headerIds: false
                });
                const html = marked.parse(rawMarkdown);
                contentArea.innerHTML = html;
            } else {
                contentArea.innerHTML = '<h2>Error loading document.</h2>';
            }
        });

        navContainer.appendChild(link);
    });

    // Auto-load the first document if available
    if (keys.length > 0) {
        const firstLink = navContainer.querySelector('.nav-item');
        if (firstLink) firstLink.click();
    }
});
