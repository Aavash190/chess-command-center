"""
Final deep analysis: understand how the bot embeds sub-variations from PGN into the JSON.
Compare the raw PGN for game 8 with the bot's JSON output.
"""
import json
import chess.pgn
import io

pgn_path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconcep.pgn"

# Read game 8 from PGN
with open(pgn_path, encoding='utf-8', errors='ignore') as f:
    pgn_io = io.StringIO(f.read())

for i in range(8):
    game = chess.pgn.read_game(pgn_io)

print("=" * 80)
print("GAME 8 PGN STRUCTURE (What is his/her Next Move?)")
print("=" * 80)
print(f"FEN: {game.headers.get('FEN', 'None')}")
print(f"FEN color: {game.headers.get('FEN', '').split()[1] if game.headers.get('FEN') else 'None'}")

# Walk through all nodes recursively
def print_node(node, depth=0, parent_board=None):
    indent = "  " * depth
    if node.move:
        san = node.san()
        comment = node.comment if node.comment else ''
        nags = list(node.nags) if node.nags else []
        
        # Parse special tags from comment
        import re
        cals = re.findall(r'\[%cal\s+([^\]]+)\]', comment)
        csls = re.findall(r'\[%csl\s+([^\]]+)\]', comment)
        mdl = re.findall(r'\[%mdl\s+(\d+)\]', comment)
        
        # Clean comment
        clean = re.sub(r'\[%(cal|csl|mdl)\s+[^\]]+\]', '', comment).strip()
        
        print(f"{indent}Move: {san}, NAGs: {nags}, cals: {cals}, csls: {csls}, mdl: {mdl}")
        if clean:
            print(f"{indent}  Comment: {clean[:150]}")
        
        # Check for variations
        if node.parent and len(node.parent.variations) > 1:
            var_idx = node.parent.variations.index(node)
            if var_idx > 0:
                print(f"{indent}  ** This is ALTERNATIVE variation #{var_idx}")
    else:
        if node.comment:
            print(f"{indent}Root comment: {node.comment[:150]}")
    
    # Print all variations
    for i, var in enumerate(node.variations):
        if i > 0:
            print(f"{indent}  --- Alternative line {i} ---")
        print_node(var, depth + (1 if i > 0 else 0))

print_node(game)

# Now also check: how does bot handle isKey?
# Bot rule: isKey = True on the FIRST move of the variation (move[0])
# ALWAYS, regardless of color. My rule was wrong (only player's color).
print("\n\n" + "=" * 80)
print("BOT's isKey RULE:")
print("=" * 80)
print("Bot sets isKey=True on moves[0] for ALL tactic variations.")
print("The engine then uses the board orientation (color) to determine")
print("which moves the USER plays vs which auto-play.")
print("isKey marks where the 'learn' phase ends and 'quiz' begins.")

# Check: does bot set isInfo=1 and isTactic=1 simultaneously?
bot_path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconception(FROM BOT).html"
def extract_json(path):
    with open(path, encoding='utf-8', errors='ignore') as f:
        content = f.read()
    idx = content.find('const COURSE =')
    json_start = idx + len('const COURSE =')
    stripped = content[json_start:].lstrip()
    obj, _ = json.JSONDecoder().raw_decode(stripped)
    return obj

bot = extract_json(bot_path)

both_count = 0
for ch in bot['chapters']:
    for v in ch['variations']:
        g = v['game']
        if g.get('isTactic') and g.get('isInfo'):
            both_count += 1
            if both_count <= 5:
                first_san = g['data'][0]['san'] if g['data'] else '?'
                print(f"  Both isTactic+isInfo: OID {v['oid']}, firstMove={first_san}, color={g['color']}")
print(f"\nTotal with both flags: {both_count}")
