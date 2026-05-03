import json

path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconcep.html"
with open(path, encoding='utf-8', errors='ignore') as f:
    content = f.read()

count = content.count('const COURSE =')
print('const COURSE = count:', count)

idx = content.find('const COURSE =')
json_start = idx + len('const COURSE =')
stripped = content[json_start:].lstrip()
try:
    obj, _ = json.JSONDecoder().raw_decode(stripped)
    print('JSON parsed successfully!')
    print('Chapters:', len(obj['chapters']))
except Exception as e:
    print('JSON parsing failed:', e)
