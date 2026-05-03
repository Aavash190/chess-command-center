"""Check if init() can crash before reaching settings/analyze listeners."""
import re

with open('Course Database/Month 1/Tactic Ninja/PGNs/Tactic Ninja.html', 'r', encoding='utf-8') as f:
    gen = f.read()

init_start = gen.find('function init()')
settings_listener = gen.find("btn-settings').addEventListener")
analyze_listener = gen.find("btn-analyze').addEventListener")

block = gen[init_start:settings_listener]

# Check if movesToFullPgn / nodesToPgn are defined inside or outside init
print("movesToFullPgn OUTSIDE init:", "function movesToFullPgn" in gen[:init_start])
print("movesToFullPgn INSIDE init:", "function movesToFullPgn" in block)
print("nodesToPgn OUTSIDE init:", "function nodesToPgn" in gen[:init_start])
print("nodesToPgn INSIDE init:", "function nodesToPgn" in block)

# Check the order: analyze listener < settings listener?
print(f"\nanalyze listener at: {analyze_listener}")
print(f"settings listener at: {settings_listener}")
print(f"analyze comes BEFORE settings: {analyze_listener < settings_listener}")

# Check if there's anything between the analyze listener line and the settings listener
between = gen[analyze_listener:settings_listener]
print(f"\nCode between analyze and settings listeners ({len(between)} chars):")
print(between[:500])

# Check if the sel-board-theme element exists in HTML
print(f"\nsel-board-theme exists in HTML: {'sel-board-theme' in gen}")

# Count all getElementById calls in init that could fail
ids_in_init = re.findall(r"getElementById\('([^']+)'\)", block)
print(f"\nAll getElementById calls before settings listener ({len(ids_in_init)}):")
for eid in ids_in_init:
    # Check if that ID exists in HTML
    exists = f'id="{eid}"' in gen
    print(f"  {eid}: {'EXISTS' if exists else 'MISSING!'}")
