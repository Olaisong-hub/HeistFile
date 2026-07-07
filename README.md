# HeistFile — GTA 6 countdown, money guide & wiki

Static website (no backend, no build tools), fully focused on GTA 6.
All GTA Online content has been removed — the site is entirely about the
upcoming GTA 6 (Nov 19, 2026).

## Structure
- **Home** — hero + live countdown to release + quick facts
- **Facts** — confirmed release info, timeline, sources (no rumors)
- **Money Guide** — fastest way to get rich, organized by story progress.
  Currently a locked skeleton (no story exists yet) plus a clearly-labeled
  section on patterns from GTA V / RDR2's single-player economies
- **Wiki** — Characters (populated: Jason & Lucia), Vehicles, Weapons,
  Properties (all locked until real data exists)

## Files
- `index.html` — structure and content
- `styles.css` — all visual styling
- `script.js` — navigation (top-level tabs + Wiki sub-tabs), the countdown,
  and the Wiki data-rendering system

## How to host it for free

**Netlify (easiest)**
1. Go to app.netlify.com → "Add new site" → "Deploy manually"
2. Drag the whole folder (index.html, styles.css, script.js) into the box
3. Done — you get a free `.netlify.app` address instantly

**Vercel**
1. Create a free account at vercel.com
2. "Add New Project" → upload the folder or connect a GitHub repo
3. Deploy

**GitHub Pages**
1. Create a new repo, put the files in the root
2. Settings → Pages → Source: main branch → Save
3. The site publishes at `yourname.github.io/reponame`

## Why so much is "locked"

GTA 6 releases Thursday, November 19, 2026. There is no confirmed data yet
about missions, vehicles, weapons, or properties — anything circulating
about those right now is leaks/speculation, and this site deliberately
doesn't include leaks. The Money Guide and most of the Wiki show a
"LOCKED — AWAITING RELEASE DATA" panel instead of made-up numbers.

The one exception is the Money Guide's "What we can say now" section, which
describes how GTA V and Red Dead Redemption 2 (both real, released, played
games) structured single-player money — clearly labeled as a pattern from
past Rockstar games, not a claim about GTA 6 itself.

## Filling in the Wiki once data exists

`Vehicles`, `Weapons`, and `Properties` are wired to render automatically —
nothing else needs to change:

1. Open `script.js`
2. Add entries to the `VEHICLES`, `WEAPONS`, or `PROPERTIES` array, following
   the shape shown in the comment above each array, e.g.:
   ```js
   const VEHICLES = [
     { id: "car-01", name: "Example Car", category: "Car", price: 45000, source: "https://..." }
   ];
   ```
3. Save — the locked panel disappears and the grid of cards appears by itself

Only add entries you can source (Rockstar Newswire, official patch notes, or
clearly-labeled verified post-release data). Keep leaks and rumors out.

`Characters` is plain HTML in `index.html` (inside `#wiki-characters`) since
there are only two confirmed protagonists today — add more dossier cards
there directly if Rockstar confirms additional playable characters.

## Updating the Money Guide

Once GTA 6's story structure is known, replace the three "Coming after
launch" locked cards (Early / Mid / Late game) in `#view-moneyguide` with
real mission-by-mission guidance, sourced from your own verified playthrough
or confirmed guides — not from pre-release leaks.

## Countdown date

The countdown target lives in `script.js` in the `RELEASE_DATE` constant
(`new Date(2026, 10, 19, 0, 0, 0)` — November is month `10` since JavaScript
counts months from 0). Update it if Rockstar moves the release date again.
