import os
import json
import re

def create_database():
    base_dir = r"c:\Users\hp\OneDrive\Desktop\Chess CommandCenter\Course Database"
    
    # We will parse the javascript file to extract the titles just to make it easy.
    # Alternatively, we can define the structure here.
    # Let's just define it here to be safe and accurate based on the recent data.js update.
    
    curriculum = {
        "Month 1": ["Tactical Foundation", "Positional Roots"],
        "Month 2": ["Essential Endgames", "100 Endgames You Must Know"],
        "Month 3": ["The Calculation Bridge", "Mastering Mates"],
        "Month 4": ["Strategic Structures"],
        "Month 5": ["Tactical Volume II", "The Attacking Manual"],
        "Month 6": ["Advanced Imbalances"],
        "Month 7": ["Piece Coordination"],
        "Month 8": ["Endgame Mastery"],
        "Month 9": ["Elite Calculation"],
        "Month 10": ["GM Thinking Process"],
        "Month 11": ["Repertoire Mastery"],
        "Month 12": ["Tournament Summit"],
    }
    
    print(f"Generating Course Database at: {base_dir}")
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
        
    for month, courses in curriculum.items():
        month_dir = os.path.join(base_dir, month)
        if not os.path.exists(month_dir):
            os.makedirs(month_dir)
            
        for course in courses:
            # Create an empty .pgn file as a placeholder
            safe_course_name = re.sub(r'[\\/*?:"<>|]', "", course)
            course_file = os.path.join(month_dir, f"{safe_course_name}.pgn")
            
            if not os.path.exists(course_file):
                with open(course_file, 'w') as f:
                    pass # just an empty touch
                print(f"Created placeholder: {course_file}")
            
    print("\nSuccessfully generated the Course Database hierarchy!")

if __name__ == "__main__":
    create_database()
