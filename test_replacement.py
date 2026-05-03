import re

with open('trainer_template_top.html', encoding='utf-8') as f:
    top = f.read()

# Replace the course title in the sidebar header
top = re.sub(r'<div class="course-title">.*?</div>', r'<div class="course-title">DYNAMIC_TITLE</div>', top)

# Replace the page titles
top = top.replace('Preventing Blunders in Chess', 'DYNAMIC_TITLE')

# Find sidebar scroll
start_idx = top.find('<div class="sidebar-scroll">') + len('<div class="sidebar-scroll">')
end_idx = top.find('</div>\n    </div>\n    <button class="sidebar-toggle"')

new_top = top[:start_idx] + '\nDYNAMIC_SIDEBAR_CONTENT\n      ' + top[end_idx:]

print('Length before:', len(top))
print('Length after:', len(new_top))
print('\nSnippet around replacement:')
print(new_top[start_idx-100:start_idx+100])

print('\nCheck if board exists in new_top:')
print('id="board"' in new_top)
