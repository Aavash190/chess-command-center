
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const html = fs.readFileSync('Course Database/Month 1/Tactic Ninja/PGNs/Tactic Ninja.html', 'utf-8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });
dom.window.onerror = function(msg, source, lineno, colno, error) {
  console.log('ERROR THROWN:', msg, lineno);
};
dom.window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
     try {
       dom.window.document.getElementById('btn-analyze').click();
       console.log('Clicked analyze successfully');
     } catch(e) { console.log('Analyze threw:', e.message); }
     
     try {
       dom.window.document.getElementById('btn-settings').click();
       console.log('Clicked settings successfully');
     } catch(e) { console.log('Settings threw:', e.message); }
  }, 100);
});
