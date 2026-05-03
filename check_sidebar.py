"""
Check how the bot's sidebar HTML renders chapter headers despite having 1 chapter in JSON
"""
path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconception(FROM BOT).html"

with open(path, encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Find the sidebar scroll section
sidebar_start = content.find('<div class="sidebar-scroll">')
sidebar_end = content.find('</div>\n    </div>\n    <button class="sidebar-toggle"')
sidebar = content[sidebar_start:sidebar_end]

# Find all ch-header elements
import re
ch_headers = re.findall(r'<div class="ch-header"><span>(.*?)</span></div>', sidebar)
print(f"Chapter headers in bot's sidebar: {len(ch_headers)}")
for h in ch_headers:
    print(f"  - {h}")

# Count var-items
var_items = re.findall(r'data-oid="(\d+)"', sidebar)
print(f"\nTotal var-items in sidebar: {len(var_items)}")

# Check how the chapter headers are generated - is it in the JS engine?
engine_start = content.find('// Build lid -> first variation OID lookup')
if engine_start == -1:
    engine_start = content.find('function buildSidebar')
    
# Search for sidebar building code
for keyword in ['ch-header', 'buildSidebar', 'sidebar-scroll', 'lineName']:
    idx = content.find(keyword, engine_start if engine_start > 0 else 0)
    if idx > 0:
        print(f"\n'{keyword}' found at index {idx}")
        print(content[idx-50:idx+200])
        print("---")
