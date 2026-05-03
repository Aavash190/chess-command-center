with open('trainer_template_top.html', encoding='utf-8') as f:
    top = f.read()

sidebar_start = top.find('<div class="sidebar-header">')
print('Sidebar header start:', sidebar_start)
sidebar_end = top.find('<div class="notation-panel">')
print('Notation panel start:', sidebar_end)

if sidebar_start != -1 and sidebar_end != -1:
    print('Length of hardcoded sidebar:', sidebar_end - sidebar_start)
    print('Replacing hardcoded sidebar with a placeholder...')
    new_top = top[:sidebar_start] + '<!-- SIDEBAR_CONTENT -->' + top[sidebar_end:]
    with open('trainer_template_top_fixed.html', 'w', encoding='utf-8') as f:
        f.write(new_top)
    print('Fixed top template saved.')
