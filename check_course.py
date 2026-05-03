path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconcep.html"
with open(path, encoding='utf-8', errors='ignore') as f:
    content = f.read()

idx = content.find('const COURSE =')
print(content[idx:idx+50])
