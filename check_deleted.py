with open('trainer_template_top.html', encoding='utf-8') as f:
    top = f.read()

sidebar_start = top.find('<div class="sidebar-header">')
sidebar_end = top.find('<div class="notation-panel">')

deleted_content = top[sidebar_start:sidebar_end]
print('Length of deleted content:', len(deleted_content))
print('\nLast 1500 chars of deleted content:')
print(deleted_content[-1500:])
