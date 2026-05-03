"""
pgn_to_html.py — Native PGN to MoveTrainer HTML Converter
Replicates the Telegram bot's output exactly.

Key rules learned from studying the bot:
1. ALL variations go under a SINGLE chapter called "PGN Games" 
   (the sidebar chapter headers come from the HTML, not the JSON chapters)
2. isKey=True is set on moves[0] (the FIRST move) for ALL tactic variations
   regardless of color — the engine uses board orientation to decide who plays
3. color is determined by the FEN's active color field (w/b)
4. Sub-variations from PGN alternatives are embedded as {"key":"V","state":"variation"}
   inside the parent move's `after` or `before` data array
5. [%cal] → draws[].object="arrow", [%csl] → draws[].object="circle"
6. NAGs map to ann1: {1:"!", 2:"?", 3:"!!", 4:"??", 5:"!?", 6:"?!", 10:"=", 18:"-+"}
7. isInfo=1 for text slides (no FEN), isTactic=1 for exercises with FEN
   Some slides can be both (e.g. chapter summaries with [%mdl 32768])
8. The title format is: "ChapterName vs VariationName | CourseName | ECO? | Result"
   matching the bot's output
"""

import os
import json
import io
import sys
import re
import contextlib

try:
    import chess
    import chess.pgn
    from chess import Board, Move
except ImportError:
    print("python-chess is required. Install with: pip install chess")
    sys.exit(1)

# ─── NAG Mapping ───────────────────────────────────────────────────────────
NAG_MAP = {1: "!", 2: "?", 3: "!!", 4: "??", 5: "!?", 6: "?!",
           10: "=", 13: "∞", 14: "+=", 15: "=+", 16: "±", 17: "∓", 18: "-+"}

def parse_nags(nags):
    for nag in nags:
        if nag in NAG_MAP:
            return NAG_MAP[nag]
    return None

# ─── Arrow/Circle Parsing ──────────────────────────────────────────────────
def parse_draws(comment, move_id):
    """Extract [%cal ...] and [%csl ...] from comment, return (draws_list, clean_comment)."""
    draws = []
    if not comment:
        return draws, comment

    for cal_match in re.finditer(r'\[%cal\s+([^\]]+)\]', comment):
        arrows = cal_match.group(1).split(',')
        for arrow in arrows:
            arrow = arrow.strip()
            if len(arrow) == 5:
                draws.append({
                    "move": move_id,
                    "object": "arrow",
                    "color": arrow[0].lower(),
                    "start": arrow[1:3],
                    "end": arrow[3:5]
                })

    for csl_match in re.finditer(r'\[%csl\s+([^\]]+)\]', comment):
        circles = csl_match.group(1).split(',')
        for circle in circles:
            circle = circle.strip()
            if len(circle) == 3:
                draws.append({
                    "move": move_id,
                    "object": "circle",
                    "color": circle[0].lower(),
                    "start": circle[1:3]
                })

    clean = re.sub(r'\[%c[as]l\s+[^\]]+\]', '', comment)
    # Normalize spaces: collapse multiple spaces and remove leading/trailing
    clean = " ".join(clean.split())
    return draws, clean

# ─── Sub-Variation Serializer ──────────────────────────────────────────────
def serialize_variation_line(node):
    """Recursively serialize a PGN variation branch into the bot's V/S/C format."""
    val_array = []
    current = node
    first_in_line = True

    while current:
        board = current.parent.board()
        turn = board.turn
        move_num = board.fullmove_number

        # Build SAN string like "36.d7?" or "36...Bg5!"
        san_str = ""
        if first_in_line or turn == chess.WHITE:
            san_str += f"{move_num}."
            if turn == chess.BLACK:
                san_str += ".."
        elif turn == chess.BLACK:
            san_str += f"{move_num}..."

        san_str += current.san()
        nag = parse_nags(current.nags)
        if nag:
            san_str += nag

        val_array.append({"key": "S", "val": san_str})

        # Handle comment (keep all tags including [%mdl] like the bot does)
        if current.comment:
            _, clean = parse_draws(current.comment, "")
            if clean:
                val_array.append({"key": "C", "val": clean})
        # Handle nested sub-sub-variations
        if len(current.variations) > 1:
            for alt in current.variations[1:]:
                sub_data = serialize_variation_line(alt)
                if sub_data:
                    val_array.append({"key": "V", "state": "variation", "val": sub_data})

        first_in_line = False
        current = current.next()

    return val_array

# ─── Comment JSON Builder ──────────────────────────────────────────────────
def build_comment_json(board_before_fen, board_after_fen, comment_text, sub_variations=None):
    """Build the stringified JSON for before/after fields."""
    data_arr = []
    if comment_text:
        data_arr.append({"key": "C", "val": comment_text})
    if sub_variations:
        data_arr.extend(sub_variations)

    if not data_arr:
        return None

    return json.dumps({
        "before": board_before_fen,
        "after": board_after_fen,
        "data": data_arr
    }, separators=(',', ':'))

# ─── Game → JSON Converter ─────────────────────────────────────────────────
def parse_game_to_dict(game, oid, event_name):
    """Converts a python-chess game to the bot's exact JSON format."""
    headers = game.headers
    variation_name = headers.get("Black", "Variation")
    chapter_name = headers.get("White", "PGN Games")
    initial_fen = headers.get("FEN", chess.STARTING_FEN)

    # Color is determined by the FEN's active color
    fen_color = "white"
    if "FEN" in headers:
        parts = headers["FEN"].split()
        if len(parts) > 1 and parts[1] == 'b':
            fen_color = "black"

    # Determine isInfo and isTactic
    has_fen = "FEN" in headers
    first_node = game.next()
    is_null_move = first_node and first_node.move == chess.Move.null() if first_node else False

    # Bot's logic: if no FEN setup → isInfo=1. If FEN setup → isTactic=1.
    # But some text slides with [%mdl 32768] get both flags.
    is_tactic = 1 if has_fen else 0
    is_info = 1 if not has_fen else 0

    # Check if it's a "text-only" game (null move with [%mdl 32768])
    if is_null_move and first_node.comment and '[%mdl 32768]' in first_node.comment:
        is_tactic = 1
        is_info = 1

    moves_data = []
    node = game.next()
    root_comment = game.comment
    
    key_move_found = False

    while node:
        board_before = node.parent.board()
        board_after = node.board()
        move_num = board_before.fullmove_number
        turn = board_before.turn
        col = 'w' if turn == chess.WHITE else 'b'
        san = node.san() if node.move != chess.Move.null() else '--'
        move_id = f"{move_num}{col}"

        move_obj = {
            "move": move_num,
            "col": col,
            "san": san,
            "showN": True
        }

        # ── isKey: Bot sets it on the move marked with [#] or the FIRST move ──
        has_diagram_mark = False
        if node.comment and '[#]' in node.comment:
            has_diagram_mark = True
        
        if not key_move_found:
            if has_diagram_mark or not moves_data:
                move_obj["isKey"] = True
                key_move_found = True

        # ── NAGs ──
        nag = parse_nags(node.nags)
        if nag:
            move_obj["ann1"] = nag

        # ── Root comment or First move comment → 'before' ──
        # Bot logic: first move's comment belongs to 'before' context
        current_comment = node.comment if node.comment else ""
        combined_comment = ""
        if not moves_data:
            if root_comment: combined_comment += root_comment + " "
            if current_comment: combined_comment += current_comment
        
        if not moves_data and combined_comment.strip():
            _, clean_combined = parse_draws(combined_comment, move_id)
            clean_combined = clean_combined.strip()
            if clean_combined:
                move_obj["before"] = build_comment_json(
                    board_before.fen(), board_before.fen(), clean_combined)
        elif current_comment and moves_data:
            # Subsequent moves: comment goes to 'after'
            draws, clean_after = parse_draws(current_comment, move_id)
            if draws:
                move_obj["draws"] = move_obj.get("draws", []) + draws
            if clean_after.strip():
                move_obj["after"] = build_comment_json(
                    board_before.fen(), board_after.fen(), clean_after.strip())

        # ── Collect sub-variations ──
        if node.parent and len(node.parent.variations) > 1 and node == node.parent.variations[0]:
            sub_vars_for_prev = []
            for alt in node.parent.variations[1:]:
                alt_data = serialize_variation_line(alt)
                if alt_data:
                    sub_vars_for_prev.append({"key": "V", "state": "variation", "val": alt_data})
            
            if sub_vars_for_prev:
                if moves_data:
                    prev_move = moves_data[-1]
                    if 'after' in prev_move and prev_move['after']:
                        after_obj = json.loads(prev_move['after'])
                        after_obj['data'].extend(sub_vars_for_prev)
                        prev_move['after'] = json.dumps(after_obj, separators=(',', ':'))
                    else:
                        prev_board_before = node.parent.parent.board() if node.parent.parent else node.parent.board()
                        prev_board_after = node.parent.board()
                        prev_move['after'] = build_comment_json(
                            prev_board_after.fen(), prev_board_after.fen(), "", sub_vars_for_prev)
                else:
                    if 'before' in move_obj and move_obj['before']:
                        before_obj = json.loads(move_obj['before'])
                        before_obj['data'].extend(sub_vars_for_prev)
                        move_obj['before'] = json.dumps(before_obj, separators=(',', ':'))
                    else:
                        move_obj['before'] = build_comment_json(
                            board_before.fen(), board_before.fen(), "", sub_vars_for_prev)

        # ── Draws for first move ──
        if not moves_data and current_comment:
            draws, _ = parse_draws(current_comment, move_id)
            if draws:
                move_obj["draws"] = move_obj.get("draws", []) + draws

        moves_data.append(move_obj)
        node = node.next()

    # Handle completely empty game with only a root comment
    if not moves_data and root_comment:
        # Bot keeps data empty for some intros, or adds a slide
        # Let's match the bot's 'data: []' for these
        pass

    # Build title matching the bot's format: {Name} | {ECO} | {Result}
    # Build title matching the bot's format: {Name} | {ECO} | {Result}
    display_name = chapter_name
    if variation_name not in ["?", "Variation"]:
        display_name = f"{chapter_name} vs {variation_name}"
    
    eco = headers.get("ECO")
    result = headers.get("Result", "*")
    
    parts = [display_name]
    if eco: parts.append(eco)
    parts.append(result)
    title = " | ".join(parts)


    return {
        "oid": str(oid),
        "game": {
            "data": moves_data,
            "initial": initial_fen,
            "title": title,
            "name": event_name,
            "lineName": chapter_name,
            "color": fen_color,
            "result": result,
            "isInfo": is_info,
            "isTactic": is_tactic,
            "oid": str(oid)
        }
    }




# ─── Main Converter ────────────────────────────────────────────────────────
def convert_pgn_to_html(pgn_path):
    print(f"Processing: {pgn_path}")

    with open(pgn_path, encoding='utf-8', errors='ignore') as f:
        pgn_io = io.StringIO(f.read())

    event_name = "Imported Course"
    all_variations = []
    oid_counter = 1

    while True:
        try:
            # Suppress python-chess's internal stderr printing of PGN errors
            with contextlib.redirect_stderr(io.StringIO()):
                game = chess.pgn.read_game(pgn_io)
            
            if game is None:
                break

            if game.errors:
                print(f"  [!] PGN Warning in {os.path.basename(pgn_path)} game {oid_counter}: {game.errors}")

            if oid_counter == 1:
                event_name = game.headers.get("Event", "Imported Course")

            var_data = parse_game_to_dict(game, oid_counter, event_name)
            all_variations.append(var_data)

            oid_counter += 1
        except Exception as e:
            # Get event name for better error reporting
            event = game.headers.get("Event", "Unknown Event") if 'game' in locals() else "Unknown Event"
            print(f"  [!] Skipping game '{event}' in {pgn_path} due to error: {e}")
            oid_counter += 1
            continue

    # Bot uses a SINGLE chapter called "PGN Games"
    course_json = {
        "name": event_name,
        "chapters": [{
            "lid": 0,
            "title": "PGN Games",
            "variations": all_variations
        }]
    }

    # ── Build HTML from template ──
    script_dir = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(script_dir, 'trainer_template_top.html'), encoding='utf-8') as f:
        top = f.read()
    with open(os.path.join(script_dir, 'trainer_template_bottom.html'), encoding='utf-8') as f:
        bottom = f.read()

    # Generate sidebar HTML — group by lineName for visual chapter headers
    sidebar_html = ''
    seen_chapters = []
    for v in all_variations:
        ln = v['game']['lineName']
        if ln not in seen_chapters:
            sidebar_html += f'<div class="section-header">{ln}</div>\n'
            seen_chapters.append(ln)
        var_title = v['game']['title']
        oid = v['oid']
        
        # Get progress status from localStorage placeholder (the JS will handle actual values)
        sidebar_html += f'<div class="sidebar-item" data-oid="{oid}">\n'
        sidebar_html += f'  <div class="item-icon">♘</div>\n'
        sidebar_html += f'  <div class="item-label">{var_title}</div>\n'
        sidebar_html += f'  <div class="item-progress">0%</div>\n'
        sidebar_html += f'</div>\n'

    # Replace titles and sidebar in template
    top = top.replace('Preventing Blunders in Chess', event_name)

    # Inject sidebar into cc-sidebar-content
    sidebar_placeholder = '<div id="cc-sidebar-content" style="flex:1; overflow-y:auto; scrollbar-width:thin;">'
    if sidebar_placeholder in top:
        top = top.replace(sidebar_placeholder, sidebar_placeholder + '\n' + sidebar_html)
    else:
        # Fallback if the placeholder is slightly different
        print("  [!] Warning: cc-sidebar-content placeholder not found. Sidebar might not render correctly.")

    html_output = top + json.dumps(course_json, separators=(',', ':')) + bottom

    output_path = pgn_path.replace('.pgn', '.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_output)

    print(f"Saved to: {output_path}")
    return output_path

# ─── Entry Point ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import glob
    import sys
    import inject_nav

    # If a specific file is passed, process only that
    if len(sys.argv) > 1:
        pgn_files = [sys.argv[1]]
    else:
        # Find all PGN files in Course Database
        pattern = os.path.join('Course Database', '**', '*.pgn')
        pgn_files = glob.glob(pattern, recursive=True)

    if not pgn_files:
        print("No PGN files found!")
    else:
        print(f"Found {len(pgn_files)} PGN files. Processing...")
        for pgn in pgn_files:
            try:
                out_path = convert_pgn_to_html(pgn)
                inject_nav.inject_nav(out_path)
            except Exception as e:
                print(f"  [ERROR] Failed to process {pgn}: {e}")
