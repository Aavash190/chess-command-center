"""Find which missing element IDs cause crashes (no null check)."""
import re

with open('Course Database/Month 1/Tactic Ninja/PGNs/Tactic Ninja.html', 'r', encoding='utf-8') as f:
    gen = f.read()

missing_ids = ['btn-trainer-m', 'trainer-complete-banner', 'btn-fs', 'board-theme-style',
               'btn-flip-m', 'btn-analyze-m']

for mid in missing_ids:
    # Find all usages of this ID
    pattern = rf"getElementById\('{mid}'\)"
    for m in re.finditer(pattern, gen):
        # Get surrounding context to see if there's a null check
        start = max(0, m.start() - 100)
        end = min(len(gen), m.end() + 200)
        context = gen[start:end]
        
        # Check if preceded by "if (" or "const xxx = ... if (xxx)"
        has_guard = bool(re.search(rf'(?:if\s*\(|const\s+\w+\s*=\s*document\.getElementById\(\'{mid}\'\);\s*\n\s*if\s*\(\w+\))', context))
        
        # Also check if it's just assignment (safe) vs direct method call (crash)
        after_call = gen[m.end():m.end()+50]
        direct_method = after_call.lstrip().startswith('.')
        
        print(f"\n{'CRASH!' if direct_method and not has_guard else 'SAFE'} — {mid}")
        print(f"  Context: ...{context[-150:]}...")
