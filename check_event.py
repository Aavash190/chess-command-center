import chess.pgn
import io
path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconcep.pgn"
with open(path, encoding='utf-8', errors='ignore') as f:
    game = chess.pgn.read_game(f)
    print('Event Name:', game.headers.get('Event'))
