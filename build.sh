#!/bin/bash
# Builds the game from src/ into one file: index.html (open it in any browser).
# The order matters: later files add to or replace things from earlier ones.
set -e
cd "$(dirname "$0")"
FILES="b_data.js b3_world.js b2_powers.js b4_expand.js c_engine.js d_combat.js e_events.js e2_camps.js e3_world.js e4_story.js e5_polish.js e6_ux.js e7_tips.js e8_lab.js e11_games.js e9_garage.js e10_travel.js f_ui.js e12_dnaui.js e13_night.js e14_risk.js e15_world.js e16_build.js e18_trust.js e19_body.js e20_paths.js e21_strands.js g_render.js e17_town.js h_hud.js e22_houses.js e23_roads.js e24_people.js e25_inv.js e26_fort.js e27_gate.js e28_ckpt.js e29_raids.js e30_crew.js e31_fixes.js e32_kid.js e33_survivors.js e34_tut.js e35_story.js e36_balance.js e37_extras.js e38_signs_crew.js"
mkdir -p build
{ cat src/a_head.html; echo '<script>'; for f in $FILES; do cat "src/$f"; done; echo '</script>'; } > build/splice-body.html
for f in $FILES; do cat "src/$f"; done > build/all.js
node --check build/all.js
{ echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Splice</title></head><body>'; cat build/splice-body.html; echo '</body></html>'; } > index.html
echo "Built index.html ($(wc -c < index.html) bytes)"
