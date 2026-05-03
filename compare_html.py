"""
Comprehensive comparison of Bot HTML vs My HTML for the 'My Opponent's Move' course.
This script will identify EVERY difference between the two outputs.
"""
import json
import re
import sys

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

print("=" * 80)
print("STRUCTURAL COMPARISON")
print("=" * 80)

print(f"\nBot chapters: {len(bot['chapters'])}")
print(f"My chapters:  {len(my['chapters'])}")

# Compare chapter titles
print("\n--- CHAPTER TITLES ---")
for i, ch in enumerate(bot['chapters']):
    my_title = my['chapters'][i]['title'] if i < len(my['chapters']) else "MISSING"
    match = "✓" if ch['title'] == my_title else "✗"
    print(f"  {match} Bot: '{ch['title']}' | My: '{my_title}'")

# Count total variations per chapter
print("\n--- VARIATION COUNTS PER CHAPTER ---")
bot_total = 0
my_total = 0
for i, ch in enumerate(bot['chapters']):
    bcount = len(ch['variations'])
    mcount = len(my['chapters'][i]['variations']) if i < len(my['chapters']) else 0
    bot_total += bcount
    my_total += mcount
    match = "✓" if bcount == mcount else "✗"
    print(f"  {match} Ch '{ch['title']}': Bot={bcount} vs My={mcount}")
print(f"\n  TOTAL: Bot={bot_total} vs My={my_total}")

# Deep dive into a specific variation to compare move data
print("\n" + "=" * 80)
print("MOVE DATA COMPARISON (OID 8 - 'What is his/her Next Move?')")
print("=" * 80)

bot_var8 = None
my_var8 = None
for ch in bot['chapters']:
    for v in ch['variations']:
        if v['oid'] == '8':
            bot_var8 = v
            break
for ch in my['chapters']:
    for v in ch['variations']:
        if v['oid'] == '8':
            my_var8 = v
            break

if bot_var8 and my_var8:
    bot_moves = bot_var8['game']['data']
    my_moves = my_var8['game']['data']
    print(f"\nBot move count: {len(bot_moves)}")
    print(f"My move count:  {len(my_moves)}")
    
    print(f"\nBot game keys: {sorted(bot_var8['game'].keys())}")
    print(f"My game keys:  {sorted(my_var8['game'].keys())}")
    
    # Compare each move
    max_moves = max(len(bot_moves), len(my_moves))
    for i in range(min(len(bot_moves), len(my_moves))):
        bm = bot_moves[i]
        mm = my_moves[i]
        
        diffs = []
        all_keys = set(list(bm.keys()) + list(mm.keys()))
        for k in sorted(all_keys):
            bv = bm.get(k)
            mv = mm.get(k)
            if bv != mv:
                if k in ('before', 'after'):
                    # Parse the JSON strings and compare
                    try:
                        bj = json.loads(bv) if bv else None
                        mj = json.loads(mv) if mv else None
                        if bj and mj:
                            # Compare data arrays
                            bd = bj.get('data', [])
                            md = mj.get('data', [])
                            if len(bd) != len(md):
                                diffs.append(f"{k}.data: bot has {len(bd)} items, mine has {len(md)} items")
                            # Check for V (variation) keys in bot
                            for item in bd:
                                if item.get('key') == 'V':
                                    diffs.append(f"{k}: BOT HAS SUB-VARIATION (missing in mine)")
                        elif bj and not mj:
                            diffs.append(f"{k}: BOT HAS IT, MINE MISSING")
                        elif not bj and mj:
                            diffs.append(f"{k}: MINE HAS IT, BOT MISSING")
                    except:
                        diffs.append(f"{k}: PARSE ERROR")
                else:
                    diffs.append(f"{k}: bot='{bv}' vs mine='{mv}'")
        
        if diffs:
            print(f"\n  Move {i}: {bm['move']}.{bm['col']} {bm['san']}")
            for d in diffs:
                print(f"    ✗ {d}")

# Check for draws (arrows/circles) across ALL variations
print("\n" + "=" * 80)
print("DRAWS (ARROWS/CIRCLES) ANALYSIS")
print("=" * 80)

bot_draws_count = 0
my_draws_count = 0
for ch in bot['chapters']:
    for v in ch['variations']:
        for m in v['game']['data']:
            if 'draws' in m:
                bot_draws_count += len(m['draws'])

for ch in my['chapters']:
    for v in ch['variations']:
        for m in v['game']['data']:
            if 'draws' in m:
                my_draws_count += len(m['draws'])

print(f"Bot total draws: {bot_draws_count}")
print(f"My total draws:  {my_draws_count}")

# Check annotations
print("\n" + "=" * 80)
print("ANNOTATIONS (ann1) ANALYSIS")
print("=" * 80)

bot_ann_count = 0
my_ann_count = 0
for ch in bot['chapters']:
    for v in ch['variations']:
        for m in v['game']['data']:
            if 'ann1' in m:
                bot_ann_count += 1

for ch in my['chapters']:
    for v in ch['variations']:
        for m in v['game']['data']:
            if 'ann1' in m:
                my_ann_count += 1

print(f"Bot total annotations: {bot_ann_count}")
print(f"My total annotations:  {my_ann_count}")

# Check sub-variations in 'after' fields
print("\n" + "=" * 80)
print("SUB-VARIATIONS ANALYSIS")
print("=" * 80)

bot_subvar_count = 0
my_subvar_count = 0
for ch in bot['chapters']:
    for v in ch['variations']:
        for m in v['game']['data']:
            for field in ('before', 'after'):
                if field in m:
                    try:
                        parsed = json.loads(m[field])
                        for item in parsed.get('data', []):
                            if item.get('key') == 'V':
                                bot_subvar_count += 1
                    except:
                        pass

for ch in my['chapters']:
    for v in ch['variations']:
        for m in v['game']['data']:
            for field in ('before', 'after'):
                if field in m:
                    try:
                        parsed = json.loads(m[field])
                        for item in parsed.get('data', []):
                            if item.get('key') == 'V':
                                my_subvar_count += 1
                    except:
                        pass

print(f"Bot total sub-variations: {bot_subvar_count}")
print(f"My total sub-variations:  {my_subvar_count}")

# JSON size comparison
bot_json_str = json.dumps(bot, separators=(',', ':'))
my_json_str = json.dumps(my, separators=(',', ':'))
print(f"\nBot JSON size: {len(bot_json_str):,} bytes")
print(f"My JSON size:  {len(my_json_str):,} bytes")
print(f"Difference:    {len(bot_json_str) - len(my_json_str):,} bytes")
