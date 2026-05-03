path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconcep.html"
with open(path, encoding='utf-8', errors='ignore') as f:
    my_content = f.read()

sidebar_start = my_content.find('<div class="sidebar-header">')
print('My Sidebar Start preview:')
print(my_content[sidebar_start:sidebar_start+500])
