import json
import sys

with open(r'Course Database\Month 1\Preventing Blunders in Chess - CM Can Kabadayi\Preventing Blunders in Chess.html', encoding='utf-8', errors='ignore') as f:
    content = f.read()

idx = content.find('const COURSE =')
json_start = idx + len('const COURSE =')
stripped = content[json_start:].lstrip()
obj, _ = json.JSONDecoder().raw_decode(stripped)

for ch in obj['chapters']:
    for v in ch['variations']:
        if v['game'].get('isTactic'):
            moves = v['game']['data']
            if moves and moves[0]['col'] != v['game']['color'][0]:
                print(f"Found tactic where first move is opponent: OID {v['oid']}")
                print(json.dumps(moves[:3], indent=2))
                sys.exit(0)
print('No such tactic found')
