path = r"Course Database\Month 1\My Opponent's Move Identifying Threats, Mistakes and Misconception - CM Can Kabadayi\My_Opponent_s_Move_Identifying_Threats,_Mistakes_and_Misconception(FROM BOT).html"
with open(path, encoding='utf-8', errors='ignore') as f:
    bot_content = f.read()

print('Preventing Blunders in bot html:', bot_content.count('Preventing Blunders in Chess'))
