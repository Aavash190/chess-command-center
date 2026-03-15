import os
import re

def create_database():
    base_dir = r"c:\Users\hp\OneDrive\Desktop\Chess CommandCenter\Course Database"
    
    # Accurate curriculum based on the enriched data.js
    curriculum = {
        "Month 1": ["Tactic Ninja", "The Woodpecker Method", "Preventing Blunders"],
        "Month 2": ["Silman's Complete Endgame Course"],
        "Month 3": ["Fundamental Chess Calculation Skills"],
        "Month 4": ["Chess Structures - A Grandmaster Guide"],
        "Month 5": ["The Woodpecker Method - Cycle 2"],
        "Month 6": ["How to Reassess Your Chess", "Chess Crime and Punishment"],
        "Month 7": ["The Art of Awakening Pieces", "The Art of Exchanging Pieces", "The Art of Burying Pieces"],
        "Month 8": ["Dvoretsky's Endgame Manual"],
        "Month 9": ["Improve Your Chess Calculation"],
        "Month 10": ["Positional Decision Making in Chess"],
        "Month 11": ["Lifetime Repertoires - Bird's Opening", "The Benko Blueprint"],
        "Month 12": ["Pump Up Your Rating"],
    }
    
    print(f"Generating Materials Lab at: {base_dir}")
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
        
    for month, courses in curriculum.items():
        month_dir = os.path.join(base_dir, month)
        if not os.path.exists(month_dir):
            os.makedirs(month_dir)
            
        # Create a set of safe course names for cleanup
        safe_course_names = set()
        for course in courses:
            safe_name = re.sub(r'[\\/*?:"<>|]', "", course)
            safe_course_names.add(safe_name)
            
            course_dir = os.path.join(month_dir, safe_name)
            if not os.path.exists(course_dir):
                os.makedirs(course_dir)
            
            # Create subfolders for Videos and PGNs
            for sub in ["Videos", "PGNs"]:
                sub_dir = os.path.join(course_dir, sub)
                if not os.path.exists(sub_dir):
                    os.makedirs(sub_dir)
            
            # Create a placeholder PGN
            placeholder_pgn = os.path.join(course_dir, "PGNs", f"{safe_name}.pgn")
            if not os.path.exists(placeholder_pgn):
                with open(placeholder_pgn, 'w') as f:
                    f.write("[Event \"Placeholder\"]\n[Site \"?\"]\n[Date \"????.??.??\"]\n[Round \"?\"]\n[White \"?\"]\n[Black \"?\"]\n[Result \"*\"]\n\n*")
            
            print(f"Verified/Created: {course}")

        # Cleanup: Remove folders in this month that are NOT in the curriculum
        for existing_folder in os.listdir(month_dir):
            if existing_folder not in safe_course_names:
                full_path = os.path.join(month_dir, existing_folder)
                if os.path.isdir(full_path):
                    print(f"Removing stray folder: {existing_folder}")
                    import shutil
                    shutil.rmtree(full_path)
            
    print("\nSuccessfully synchronized the Materials Lab hierarchy!")
    print("User can now drop videos into 'Videos' and PGNs into 'PGNs' for each course.")

if __name__ == "__main__":
    create_database()
