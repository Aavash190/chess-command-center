"""
Final check: file sizes and annotation differences
"""
import os
import json

bot_path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconception(FROM BOT).html"
my_path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconcep.html"

bot_size = os.path.getsize(bot_path)
my_size = os.path.getsize(my_path)
print(f"Bot file: {bot_size:,} bytes ({bot_size/1024:.1f} KB)")
print(f"My file:  {my_size:,} bytes ({my_size/1024:.1f} KB)")
print(f"Diff:     {bot_size - my_size:,} bytes")

def extract_json(path):
    with open(path, encoding='utf-8', errors='ignore') as f:
        content = f.read()
    idx = content.find('const COURSE =')
    json_start = idx + len('const COURSE =')
    stripped = content[json_start:].lstrip()
    obj, _ = json.JSONDecoder().raw_decode(stripped)
    return obj

bot = extract_json(bot_path)
my = extract_json(my_path)

# Check annotation differences more carefully
bot_anns = {}
my_anns = {}
for ch in bot['chapters']:
    for v in ch['variations']:
        for m in v['game']['data']:
            if 'ann1' in m:
                bot_anns[(v['oid'], m['move'], m['col'])] = m['ann1']

for ch in my['chapters']:
    for v in ch['variations']:
        for m in v['game']['data']:
            if 'ann1' in m:
                my_anns[(v['oid'], m['move'], m['col'])] = m['ann1']

# Find annotations in mine but not in bot
extra_in_mine = set(my_anns.keys()) - set(bot_anns.keys())
missing_in_mine = set(bot_anns.keys()) - set(my_anns.keys())

print(f"\nAnnotations in mine but NOT in bot: {len(extra_in_mine)}")
for k in list(extra_in_mine)[:5]:
    print(f"  OID {k[0]}, move {k[1]}{k[2]}: mine={my_anns[k]}")

print(f"\nAnnotations in bot but NOT in mine: {len(missing_in_mine)}")
for k in list(missing_in_mine)[:5]:
    print(f"  OID {k[0]}, move {k[1]}{k[2]}: bot={bot_anns[k]}")

# The 20KB difference: check what the bot's 'after' text contains
# that mine doesn't, for OID 8 move 1
print("\n\nOID 8 Move 1 (36.Rd4) after comparison:")
bot_v = None
my_v = None
for ch in bot['chapters']:
    for v in ch['variations']:
        if v['oid'] == '8':
            bot_v = v
for ch in my['chapters']:
    for v in ch['variations']:
        if v['oid'] == '8':
            my_v = v

bot_after1 = json.loads(bot_v['game']['data'][1]['after'])
my_after1 = json.loads(my_v['game']['data'][1]['after'])

print(f"Bot after data[0] C: {bot_after1['data'][0]['val'][:150]}")
print(f"My after data[0] C:  {my_after1['data'][0]['val'][:150]}")
