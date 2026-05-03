import json

bot_path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconception(FROM BOT).html"

with open(bot_path, encoding='utf-8', errors='ignore') as f:
    content = f.read()

idx = content.find('const COURSE =')
json_start = idx + len('const COURSE =')
stripped = content[json_start:].lstrip()
obj, _ = json.JSONDecoder().raw_decode(stripped)

def analyze_json(node, path=""):
    keys = set()
    if isinstance(node, dict):
        keys.update(node.keys())
        for k, v in node.items():
            keys.update(analyze_json(v, path + "." + k))
    elif isinstance(node, list):
        for item in node:
            keys.update(analyze_json(item, path + "[]"))
    return keys

all_keys = analyze_json(obj)
print("All keys used in the bot's JSON:")
print(sorted(list(all_keys)))

# Let's see some specific examples of 'data' inside 'before'/'after'
for ch in obj['chapters']:
    for v in ch['variations']:
        moves = v['game']['data']
        for m in moves:
            if 'after' in m:
                after_data = json.loads(m['after'])
                if 'data' in after_data:
                    for item in after_data['data']:
                        if item.get('state') == 'variation':
                            print("\nExample of sub-variation:")
                            print(json.dumps(item, indent=2))
                            import sys
                            sys.exit(0)
