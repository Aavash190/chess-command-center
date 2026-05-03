import json

path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconception(FROM BOT).html"
with open(path, encoding='utf-8', errors='ignore') as f:
    content = f.read()

idx = content.find('const COURSE =')
json_start = idx + len('const COURSE =')
stripped = content[json_start:].lstrip()
obj, _ = json.JSONDecoder().raw_decode(stripped)

# Find the specific variation
target_var = None
for ch in obj['chapters']:
    for v in ch['variations']:
        if "What is his/he" in v['game']['title']:
            target_var = v
            break
    if target_var: break

if target_var:
    print(f"Found Variation OID: {target_var['oid']}")
    # Print the moves data where the alternatives are located
    # The variation happens around move 36
    moves = target_var['game']['data']
    for m in moves:
        if m['move'] == 36:
            print(json.dumps(m, indent=2))
