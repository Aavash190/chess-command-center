"""Compare bot HTML with generated Tactic Ninja HTML to find differences."""

import re

with open('LTR BIRD (UPDATED VERSION).html', 'r', encoding='utf-8', errors='ignore') as f:
    bot = f.read()

with open('Course Database/Month 1/Tactic Ninja/PGNs/Tactic Ninja.html', 'r', encoding='utf-8') as f:
    gen = f.read()

print("=" * 60)
print("1. FOOTER HTML STRUCTURE")
print("=" * 60)

# Bot footer
bot_footer_idx = bot.rfind('practice-footer">')
bot_footer = bot[bot_footer_idx-20:bot_footer_idx+400]
print("\nBOT:")
print(bot_footer)

# Generated footer
gen_footer_idx = gen.rfind('practice-footer">')
gen_footer = gen[gen_footer_idx-20:gen_footer_idx+400]
print("\nGENERATED:")
print(gen_footer)

print("\n" + "=" * 60)
print("2. SETTINGS PANEL HTML")
print("=" * 60)

bot_settings_idx = bot.find('settings-panel" id')
bot_settings = bot[bot_settings_idx-20:bot_settings_idx+600]
print("\nBOT:")
print(bot_settings[:600])

gen_settings_idx = gen.find('settings-panel" id')
gen_settings = gen[gen_settings_idx-20:gen_settings_idx+600]
print("\nGENERATED:")
print(gen_settings[:600])

print("\n" + "=" * 60)
print("3. JS EVENT LISTENERS FOR BUTTONS")
print("=" * 60)

# Check if init() wraps the button listeners
bot_init_idx = bot.find('function init()')
bot_init_block = bot[bot_init_idx:bot_init_idx+200]
print("\nBOT init() start:")
print(bot_init_block)

gen_init_idx = gen.find('function init()')
gen_init_block = gen[gen_init_idx:gen_init_idx+200]
print("\nGENERATED init() start:")
print(gen_init_block)

# Check if btn-analyze listener is inside init() or outside
bot_analyze_listener = bot.find("btn-analyze').addEventListener")
bot_settings_listener = bot.find("btn-settings').addEventListener")
print(f"\nBOT: btn-analyze listener at char {bot_analyze_listener}, init() at char {bot_init_idx}")
print(f"BOT: btn-settings listener at char {bot_settings_listener}")
print(f"BOT: analyze INSIDE init = {bot_init_idx < bot_analyze_listener}")

gen_analyze_listener = gen.find("btn-analyze').addEventListener")
gen_settings_listener = gen.find("btn-settings').addEventListener")
print(f"\nGEN: btn-analyze listener at char {gen_analyze_listener}, init() at char {gen_init_idx}")
print(f"GEN: btn-settings listener at char {gen_settings_listener}")
print(f"GEN: analyze INSIDE init = {gen_init_idx < gen_analyze_listener}")

print("\n" + "=" * 60)
print("4. DOMContentLoaded CHECK")  
print("=" * 60)

bot_dcl = bot.find("DOMContentLoaded")
gen_dcl = gen.find("DOMContentLoaded")
print(f"\nBOT DOMContentLoaded at: {bot_dcl}")
print(f"Context: {bot[bot_dcl-30:bot_dcl+100]}")
print(f"\nGEN DOMContentLoaded at: {gen_dcl}")
print(f"Context: {gen[gen_dcl-30:gen_dcl+100]}")

print("\n" + "=" * 60)
print("5. SCRIPT TAG STRUCTURE")
print("=" * 60)

bot_scripts = [(m.start(), m.group()[:100]) for m in re.finditer(r'<script[^>]*>', bot)]
gen_scripts = [(m.start(), m.group()[:100]) for m in re.finditer(r'<script[^>]*>', gen)]

print(f"\nBOT has {len(bot_scripts)} script tags:")
for pos, tag in bot_scripts:
    print(f"  {pos}: {tag}")

print(f"\nGEN has {len(gen_scripts)} script tags:")
for pos, tag in gen_scripts:
    print(f"  {pos}: {tag}")

# Check for errors - is there any JS that runs BEFORE the DOM is ready?
print("\n" + "=" * 60)
print("6. CHECKING FOR RUNTIME ERRORS")
print("=" * 60)

# Check if btn-analyze/btn-settings listeners run before DOM
# The key question: does getElementById('btn-settings') run at parse time or after DOMContentLoaded?
bot_end_script = bot.rfind('</script>')
gen_end_script = gen.rfind('</script>')
print(f"\nBOT: last </script> at {bot_end_script}, file length {len(bot)}")
print(f"GEN: last </script> at {gen_end_script}, file length {len(gen)}")

# Check what's between DOMContentLoaded and the closing 
bot_dcl_to_end = bot[bot_dcl:bot_end_script]
gen_dcl_to_end = gen[gen_dcl:gen_end_script]
print(f"\nBOT: code after DOMContentLoaded: {len(bot_dcl_to_end)} chars")
print(f"GEN: code after DOMContentLoaded: {len(gen_dcl_to_end)} chars")
