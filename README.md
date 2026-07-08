# HeistFile — GTA 6 launch guide, characters, map & arsenal

Static website (no backend, no build tools), organized into four dossiers
about the upcoming GTA 6 (November 19, 2026). Confirmed facts and
unconfirmed leaks/rumors are always kept in clearly separate, clearly
labeled blocks — never mixed together.

## Structure
- **Home** — hero, countdown to release, and a hub linking to all four dossiers
- **Launch Guide** — release history, editions & pricing, the business story
  behind the launch, multiplayer/social media status, and unconfirmed rumors
- **Characters & Story** — relationship map, confirmed dossiers for Jason,
  Lucia, and the Vice City network, plus a clearly-stamped leaked details section
- **Map** — interactive Leaflet map of confirmed regions/counties, plus a
  region reference grid and unconfirmed map-size/expansion rumors
- **Arsenal** — weapons and vehicles databases (sub-tabbed), plus a
  next-gen tech section, all sorted by category

## Files
- `index.html` — structure and content for all five views
- `styles.css` — all visual styling (dark navy / blueprint-grid theme,
  paper dossier cards, orange-to-pink sunset headlines)
- `script.js` — navigation, countdown, relationship map, interactive
  region map, and the weapon/vehicle database renderers
- `map-leonida-placeholder.svg` — a hand-drawn, non-official placeholder
  map (Rockstar hasn't revealed the real one yet)

## How to host it for free

**Netlify (easiest)**
1. Go to app.netlify.com → "Add new site" → "Deploy manually"
2. Drag all four files into the box
3. Done — you get a free `.netlify.app` address instantly

**GitHub Pages**
1. Create a new repo, add all four files at the root
2. Settings → Pages → Source: main branch → Save
3. The site publishes at `yourname.github.io/reponame`

## Keeping confirmed vs. rumored content honest

Every section follows the same rule: confirmed facts live in plain
`.fact-card` / dossier blocks, and anything leaked or rumored lives inside
a `.rumor-block` with the "⚠ Unconfirmed — leak / rumor" stamp. When
Rockstar confirms something that's currently in a rumor block, move that
bullet point into the relevant confirmed section and delete it from the
rumor block — don't leave it in both places.

## Updating the weapon/vehicle databases

Both live as arrays in `script.js` — `WEAPONS` and `VEHICLES` — each item
shaped as `{ name, category, basis, exclusive? }`. Add, edit, or remove
entries there; the category grouping and card rendering happen
automatically via `renderGroupedSection()`. Category order is controlled
by `WEAPON_CATEGORY_ORDER` and `VEHICLE_CATEGORY_ORDER`.

## Updating the map

Region markers live in the `REGIONS` array in `script.js`, each shaped as
`{ id, name, type, mapY, mapX, desc }` (`type` is `"city"`, `"region"`, or
`"county"`, which controls pin color). Coordinates are on a 1000×900 grid
matching `map-leonida-placeholder.svg`'s viewBox — swap in an official map
image and update coordinates once Rockstar reveals one.

## Countdown date

Lives in `script.js` as `RELEASE_DATE` (`new Date(2026, 10, 19, 0, 0, 0)`
— November is month `10` since JavaScript counts months from 0). Update
it if Rockstar moves the release date again.

## Last updated

July 8, 2026, based on a research report distinguishing Rockstar/Take-Two
confirmed announcements from community leaks and analyst estimates.
