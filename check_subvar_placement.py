"""
Understand EXACTLY where sub-variations are placed in the bot vs mine for OID 8.
The bot puts 4 sub-variations on move[0] (35...Bg5), but my script puts them on move[1] (36.Rd4).
This means the bot attaches alternatives to the PREVIOUS move (the opponent's move that 
sets up the position), while my script attaches them to the mainline response.
"""
import json

def extract_json(path):
    with open(path, encoding='utf-8', errors='ignore') as f:
        content = f.read()
    idx = content.find('const COURSE =')
    json_start = idx + len('const COURSE =')
    stripped = content[json_start:].lstrip()
    obj, _ = json.JSONDecoder().raw_decode(stripped)
    return obj

bot_path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconception(FROM BOT).html"
my_path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconcep.html"

bot = extract_json(bot_path)
my = extract_json(my_path)

# Get OID 8 from both
for ch in bot['chapters']:
    for v in ch['variations']:
        if v['oid'] == '8':
            bot_v = v
for ch in my['chapters']:
    for v in ch['variations']:
        if v['oid'] == '8':
            my_v = v

print("BOT OID 8 - WHERE SUB-VARS ARE:")
for i, m in enumerate(bot_v['game']['data']):
    subvar_count = 0
    for field in ('before', 'after'):
        if field in m and m[field]:
            parsed = json.loads(m[field])
            for item in parsed.get('data', []):
                if item.get('key') == 'V':
                    subvar_count += 1
    print(f"  Move[{i}] {m['move']}.{m['col']} {m['san']}: sub-vars={subvar_count}, has_after={'after' in m}, has_before={'before' in m}")

print("\nMY OID 8 - WHERE SUB-VARS ARE:")
for i, m in enumerate(my_v['game']['data']):
    subvar_count = 0
    for field in ('before', 'after'):
        if field in m and m[field]:
            parsed = json.loads(m[field])
            for item in parsed.get('data', []):
                if item.get('key') == 'V':
                    subvar_count += 1
    print(f"  Move[{i}] {m['move']}.{m['col']} {m['san']}: sub-vars={subvar_count}, has_after={'after' in m}, has_before={'before' in m}")

# The key insight: In the PGN, the alternatives are on 36.Rd4 (alternatives to Rd4).
# The bot places them on move[0] (35...Bg5) in 'after' field.
# My script places them on move[1] (36.Rd4) in 'after' field.
# 
# The bot's logic: alternatives to move N are placed in move N-1's 'after' field!
# This makes sense because the 'after' comment of move N-1 shows what happens
# AFTER that move was played, i.e., the decision point for the next move.

print("\n\nBOT move[0] 'after' breakdown:")
after0 = json.loads(bot_v['game']['data'][0]['after'])
for item in after0['data']:
    if item['key'] == 'C':
        print(f"  C: {item['val'][:100]}")
    elif item['key'] == 'V':
        first_entry = item['val'][0] if item['val'] else {}
        print(f"  V: starts with '{first_entry.get('val', '')}'")

print("\nBOT move[1] 'after' breakdown:")
after1 = json.loads(bot_v['game']['data'][1]['after'])
for item in after1['data']:
    if item['key'] == 'C':
        print(f"  C: {item['val'][:100]}")
    elif item['key'] == 'V':
        first_entry = item['val'][0] if item['val'] else {}
        print(f"  V: starts with '{first_entry.get('val', '')}'")

print("\nBOT move[2] 'after' breakdown:")
after2 = json.loads(bot_v['game']['data'][2]['after'])
for item in after2['data']:
    if item['key'] == 'C':
        print(f"  C: {item['val'][:100]}")
    elif item['key'] == 'V':
        first_entry = item['val'][0] if item['val'] else {}
        print(f"  V: starts with '{first_entry.get('val', '')}'")
