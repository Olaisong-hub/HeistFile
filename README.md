# HeistFile — GTA Online Money Guide

A static website (no backend, no build tools) with two interactive tools:
- **Business Calculator** — compare price/income for GTA Online businesses
- **Goal Planner** — works out how long it takes to save up for a car/item

## Files
- `index.html` — all structure and content
- `styles.css` — all styling
- `script.js` — all data (business/goal figures) and logic

## How to host it for free

**Netlify (easiest)**
1. Go to app.netlify.com → "Add new site" → "Deploy manually"
2. Drag the whole folder (index.html, styles.css, script.js) into the box
3. Done — you get a free `.netlify.app` address instantly

**Vercel**
1. Create a free account at vercel.com
2. "Add New Project" → upload the folder or connect a GitHub repo with the files
3. Deploy

**GitHub Pages**
1. Create a new repo, add the three files at the root
2. Settings → Pages → Source: main branch → Save
3. The site is published at `yourname.github.io/reponame`

If you want a custom domain (like yoursite.com), connect it in the Netlify/Vercel settings — that usually costs around $10–15/year from any domain registrar, but the hosting itself above is free.

## Updating the numbers
Open `script.js` and edit the `BUSINESSES` (businesses) and `GOALS` (savings targets) lists. All prices/income figures right now are community estimates for 2026 and should be double-checked against the game from time to time.

## How to pivot to GTA 6
Once GTA 6 launches (Nov 19, 2026) and real in-game data exists:
1. Replace the content in `BUSINESSES` and `GOALS` in `script.js` with GTA 6's properties/vehicles
2. Update the headings/text in `index.html` that mention "GTA Online"
3. Keep the disclaimer text in the footer (unofficial fan site) — just swap the game name
4. 
