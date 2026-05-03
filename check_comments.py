"""
Check exactly how the bot handles 'before' field and where comment text goes.
Compare OID 2 (Introduction vs The Structure) side by side.
"""
import json

bot_path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconception(FROM BOT).html"
my_path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconcep.html"

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

# Get OID 2 from both
bot_v2 = None
my_v2 = None
for ch in bot['chapters']:
    for v in ch['variations']:
        if v['oid'] == '2':
            bot_v2 = v
for ch in my['chapters']:
    for v in ch['variations']:
        if v['oid'] == '2':
            my_v2 = v

print("BOT OID 2:")
print(json.dumps(bot_v2['game'], indent=2)[:3000])
print("\n\n" + "=" * 80)
print("MY OID 2:")
print(json.dumps(my_v2['game'], indent=2)[:3000])

# Now check the isKey pattern more carefully
# The bot puts isKey=True on move[0] (which is the FIRST move)
# regardless of color. My script puts it on the first move of player's color.
print("\n\n" + "=" * 80)
print("isKey comparison across first 30 tactic OIDs:")
print("=" * 80)

for ch in bot['chapters']:
    for v in ch['variations']:
        if v['game'].get('isTactic'):
            moves = v['game']['data']
            if moves:
                first = moves[0]
                bot_has_key_on_first = first.get('isKey', False)
                # Find same OID in my data
                my_v = None
                for mch in my['chapters']:
                    for mv in mch['variations']:
                        if mv['oid'] == v['oid']:
                            my_v = mv
                            break
                if my_v:
                    my_first = my_v['game']['data'][0] if my_v['game']['data'] else {}
                    my_has_key_on_first = my_first.get('isKey', False)
                    if bot_has_key_on_first != my_has_key_on_first:
                        print(f"  MISMATCH OID {v['oid']}: bot_key={bot_has_key_on_first}, my_key={my_has_key_on_first}, first_move={first['san']}, color={v['game']['color']}")
