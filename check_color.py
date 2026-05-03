"""
Check how bot determines color/orientation and how the PGN Orientation header maps.
"""
import json
import chess.pgn
import io

bot_path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconception(FROM BOT).html"
pgn_path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconcep.pgn"

def extract_json(path):
    with open(path, encoding='utf-8', errors='ignore') as f:
        content = f.read()
    idx = content.find('const COURSE =')
    json_start = idx + len('const COURSE =')
    stripped = content[json_start:].lstrip()
    obj, _ = json.JSONDecoder().raw_decode(stripped)
    return obj

bot = extract_json(bot_path)

# Check bot's color for first 30 variations
print("Bot color assignments (first 30):")
for v in bot['chapters'][0]['variations'][:30]:
    g = v['game']
    first_san = g['data'][0]['san'] if g['data'] else '?'
    first_col = g['data'][0]['col'] if g['data'] else '?'
    print(f"  OID {v['oid']}: color={g['color']}, isTactic={g.get('isTactic',0)}, isInfo={g.get('isInfo',0)}, first={first_col}.{first_san}")

# Now read the same games from PGN and check what headers we have
print("\n\nPGN headers for first 30 games:")
with open(pgn_path, encoding='utf-8', errors='ignore') as f:
    pgn_io = io.StringIO(f.read())

for i in range(30):
    game = chess.pgn.read_game(pgn_io)
    if game is None:
        break
    fen = game.headers.get('FEN', '')
    setup = game.headers.get('SetUp', '')
    # Check if FEN specifies black to move
    fen_color = ''
    if fen:
        parts = fen.split()
        if len(parts) > 1:
            fen_color = parts[1]  # 'w' or 'b'
    
    first_move = None
    node = game.next()
    if node:
        first_move = node.san()
    
    print(f"  Game {i+1}: White='{game.headers.get('White','')}', Black='{game.headers.get('Black','')}', FEN_color={fen_color}, Setup={setup}, FirstMove={first_move}")
