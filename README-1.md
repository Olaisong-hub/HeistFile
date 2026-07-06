# HeistFile — GTA Online pengaguide

Statisk webbplats (ingen backend, inga byggverktyg) med två interaktiva verktyg:
- **Business-kalkylator** — jämför pris/intäkt för GTA Online-verksamheter
- **Mål-planerare** — räknar ut hur lång tid det tar att spara ihop till en bil/vara

## Filer
- `index.html` — all struktur och innehåll
- `styles.css` — allt utseende
- `script.js` — all data (siffror för businesses/mål) och logik

## Så lägger du upp den gratis

**Netlify (enklast)**
1. Gå till app.netlify.com → "Add new site" → "Deploy manually"
2. Dra hela mappen (index.html, styles.css, script.js) till rutan
3. Klart — du får en gratis `.netlify.app`-adress direkt

**Vercel**
1. Skapa ett gratis konto på vercel.com
2. "Add New Project" → ladda upp mappen eller koppla ett GitHub-repo med filerna
3. Deploy

**GitHub Pages**
1. Skapa ett nytt repo, lägg in de tre filerna i rooten
2. Settings → Pages → Source: main-branch → Spara
3. Sajten publiceras på `dittnamn.github.io/reponamn`

Vill du använda ett eget domännamn (typ dinsida.se) kopplar du det i Netlify/Vercel-inställningarna — det brukar kosta runt 100–150 kr/år hos valfri domänleverantör, men själva hostingen ovan är gratis.

## Uppdatera siffror
Öppna `script.js` och ändra i listorna `BUSINESSES` (verksamheter) och `GOALS` (sparmål). Alla priser/intäkter just nu är community-uppskattningar för 2026 och bör dubbelkollas mot spelet då och då.

## Så pivoterar du till GTA 6
När GTA 6 släpps (19 nov 2026) och riktig speldata finns:
1. Byt ut innehållet i `BUSINESSES` och `GOALS` i `script.js` mot GTA 6:s fastigheter/fordon
2. Uppdatera rubriker/texter i `index.html` som nämner "GTA Online"
3. Behåll disclaimer-texten i footern (inofficiell fansajt) — byt bara ut spelnamnet
