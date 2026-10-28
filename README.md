# 🧬 Splice

**Hunt the monsters. Steal their DNA. Try not to become one.**

Splice is a top-down survival game that runs in any web browser. You wake up in a rickety shack in a monster-filled town. Scavenge houses, defend your shack at night, and absorb monster DNA to gain powers. Every power makes you a little less human.

Along the way you choose between two roads:

- 💉 **The Cure**: make vaccines, heal bitten survivors, rebuild camp gates, and stay human.
- 🧬 **The Brood**: turn survivors, taint a camp's water, lead monster packs, and become something else.

Fight your way from town to town, state to state, and country to country (🇺🇸 → 🇯🇵 → 🏴 → 🇲🇽 → 🇪🇬) to find the Source and decide how the world ends.

---

## ▶️ Play

- **Easiest:** download `index.html` and double-click it. No install needed.
- **Online:** turn on GitHub Pages (Settings → Pages → *Deploy from a branch* → `main` / root). The game will be at `https://<your-username>.github.io/<repo-name>/`.
- **Difficulty:** Kid, Easy, Normal, or Hard. Pick on the title screen or change it any time in the Menu.
- **Lessons:** the first 4 in-game days teach one thing at a time. Reopen them from Help (F1).

### Controls

| Key | What it does |
|---|---|
| WASD / arrows | Move |
| Click / Space | Attack |
| E (hold) | Search, talk, use |
| 1, 2, 3 | Use powers |
| Tab | DNA lab (powers, traits, vault, sequencer) |
| I | Bag (inventory) |
| M | Map |
| J | Goals and the two roads |
| L | Log |
| C | Call / send a monster pack (monster road) |
| H | Use meds |
| Q | Switch weapon |
| Esc | Menu |

---

## 💻 Edit it in a Codespace

1. On GitHub, click the green **Code** button → **Codespaces** → **Create codespace on main**.
2. Wait for setup. It installs Node and a test browser automatically, about 2–3 minutes the first time.
3. The game builds and starts by itself. A **"Splice game"** tab pops up (port 8080). If it doesn't, open the **Ports** tab and click the 🌐 next to 8080.
4. Edit any file in `src/`, then in the terminal run:

   ```bash
   npm run build      # rebuilds index.html
   npm test           # runs all the browser tests
   ```

   Refresh the game tab to see your changes.
5. Save your work back to GitHub from the **Source Control** panel (the branch icon on the left): type a message, click **Commit**, then **Sync**.

---

## 🗂️ How the code is organized

```
index.html          ← the whole game in one file (built, ready to play)
build.sh            ← glues src/ together into index.html
src/                ← the source, in load order
  a_head.html       ← page styles and layout
  b_*.js            ← data: monsters, powers, towns
  c_engine.js       ← game loop, movement, saving
  d_combat.js       ← fighting, DNA, powers
  e_*.js … e37_*.js ← features, added one layer at a time
  f_ui.js, g_render.js, h_hud.js ← screens, drawing, HUD
tests/              ← headless-browser tests (Playwright)
.devcontainer/      ← Codespace setup
```

Files load in the order listed in `build.sh`. Later files often **add to** earlier ones by wrapping a function:

```js
{ const _old = someFunction; someFunction = function(...a){ /* new stuff */ return _old(...a); }; }
```

So to change a feature, look in the highest-numbered file that mentions it first.

---

## 🧪 Science in the game

- **Base pairing:** A–T, C–G (the Sequencer lab games)
- **Vaccines and immunity:** the Cure road
- **Infection and incubation:** bitten survivors turn in 2 days without treatment
- **Mutation, traits, and gene expression:** powers, traits, and visible body changes
- **Gel electrophoresis, pipetting, and microscopy:** lab mini-games
