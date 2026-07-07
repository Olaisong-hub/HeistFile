# HeistFile — GTA 6 countdown & confirmed facts

Static website (no backend, no build tools), fully focused on GTA 6.
All GTA Online content (the business calculator, the goal planner) has been
removed — the site is currently focused only on what Rockstar has actually
confirmed.

## Files
- `index.html` — structure and content (Home / Facts / Characters)
- `styles.css` — all visual styling
- `script.js` — tab navigation + the countdown to the release date

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
1. Create a new repo, put the files in the root
2. Settings → Pages → Source: main branch → Save
3. The site publishes at `yourname.github.io/reponame`

## Current status: Phase 1 — countdown & confirmed facts

GTA 6 releases Thursday, November 19, 2026 as a pure single-player experience.
There is no confirmed game data yet about vehicles, missions, or the economy —
anything circulating about those is leaks/speculation. That's why the site
currently only contains what Rockstar has actually confirmed: release date,
platforms, editions/pricing, game mode, the setting (Leonida/Vice City), and
the two protagonists Jason Duval and Lucia Caminos. Sources are linked on the
Facts page.

## Updating the facts
Open `index.html` and edit the cards inside `#view-facts` and
`#view-characters` directly, along with the timeline. Only add information
you can source against Rockstar's Newswire or official storefronts — keep
"confirmed" and "rumor" clearly separated if you ever want to include
speculative content.

The countdown date lives in `script.js` in the `RELEASE_DATE` constant
(`new Date(2026, 10, 19, 0, 0, 0)` — November is month `10` since JavaScript
counts months from 0). Update it if Rockstar moves the release date again.

## Phase 2 — after release (planned, not started)
Once GTA 6 is out and real game data exists, the site can be expanded with:
- **Properties/Vehicles** — prices and where to find them
- **Missions/Heists** — payout and difficulty
- **Goal planner** — a new take on the old tool, but built on GTA 6's actual
  single-player economy instead of GTA Online's business loops (which have no
  confirmed equivalent in GTA 6 yet)

No Phase 2 code exists in this build — the data model starts from scratch
once real data is available to build on.
