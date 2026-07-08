/* ===========================================================
   HEISTFILE — GTA 6 launch guide, characters, map & arsenal
   NOTE: Confirmed facts come from Rockstar Newswire and
   Take-Two's financial filings. Everything else in the
   *_RUMORED-style content lives as plain HTML inside
   index.html, clearly stamped "unconfirmed" — this file only
   drives the countdown, the relationship map, the region map,
   and the weapon/vehicle databases.
   =========================================================== */

/* ---------------- top-level navigation ---------------- */ 
function showView(targetId){
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("is-active", v.id === targetId));
  document.querySelectorAll(".tab").forEach(t => {
    const active = t.dataset.target === targetId;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  if (targetId === "view-map" && leonidaMap) {
    setTimeout(() => leonidaMap.invalidateSize(), 50);
  }
}

document.querySelectorAll("[data-target]").forEach(el => {
  el.addEventListener("click", () => showView(el.dataset.target));
});

/* ---------------- sub-navigation (Arsenal tabs) ---------------- */
function showSubview(targetId){
  document.querySelectorAll(".subview").forEach(v => v.classList.toggle("is-active", v.id === targetId));
  document.querySelectorAll(".subtab").forEach(t => {
    const active = t.dataset.subtarget === targetId;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
}

document.querySelectorAll("[data-subtarget]").forEach(el => {
  el.addEventListener("click", () => showSubview(el.dataset.subtarget));
});

/* ---------------- countdown to release ----------------
   November 19, 2026, midnight in the visitor's local time.
   Rockstar hasn't confirmed an exact time, so we count down
   to the start of the day rather than guessing a time. */
const RELEASE_DATE = new Date(2026, 10, 19, 0, 0, 0);

function updateCountdown(){
  const daysEl = document.getElementById("cdDays");
  const hoursEl = document.getElementById("cdHours");
  const minutesEl = document.getElementById("cdMinutes");
  const secondsEl = document.getElementById("cdSeconds");
  const noteEl = document.getElementById("cdNote");
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const diff = RELEASE_DATE.getTime() - Date.now();

  if (diff <= 0){
    daysEl.textContent = "000";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    if (noteEl) noteEl.textContent = "Release day is here (or has passed) — time for Leonida.";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = String(days).padStart(3, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

/* ---------------- relationship map (Characters) ----------------
   x/y are percentages (0-100) of the .familytree container, so the
   diagram scales with any screen size. */
const CHARACTERS = [
  { id: "jason",   name: "Jason Duval",       role: "Protagonist",         x: 34, y: 46 },
  { id: "lucia",   name: "Lucia Caminos",     role: "Protagonist",         x: 66, y: 46 },
  { id: "cal",     name: "Cal Hampton",       role: "Jason's friend",      x: 12, y: 18 },
  { id: "brian",   name: "Brian Heder",       role: "Landlord",            x: 12, y: 76 },
  { id: "boobie",  name: "Boobie Ike",        role: "Businessman",         x: 88, y: 18 },
  { id: "drequan", name: "Dre'quan Priest",   role: "Local artist",        x: 88, y: 76 },
  { id: "baeluxe", name: "Bae-Luxe & Roxy",   role: "Social media duo",    x: 50, y: 10 },
  { id: "raul",    name: "Raul Bautista",     role: "Criminal network",    x: 50, y: 90 }
];

const RELATIONSHIPS = [
  { from: "jason", to: "lucia",   label: "Partners & accomplices" },
  { from: "jason", to: "cal",     label: "Close friend" },
  { from: "jason", to: "brian",   label: "Landlord" },
  { from: "jason", to: "baeluxe", label: "Social circle" },
  { from: "lucia", to: "boobie",  label: "Business contact" },
  { from: "lucia", to: "drequan", label: "Local contact" },
  { from: "lucia", to: "raul",    label: "Criminal network" }
];

function renderFamilyTree(){
  const container = document.getElementById("familyTree");
  const svg = document.getElementById("familyTreeLines");
  if (!container || !svg) return;

  container.querySelectorAll(".familytree__node, .familytree__label").forEach(el => el.remove());
  svg.innerHTML = "";

  const byId = Object.fromEntries(CHARACTERS.map(c => [c.id, c]));

  RELATIONSHIPS.forEach(rel => {
    const a = byId[rel.from];
    const b = byId[rel.to];
    if (!a || !b) return;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", a.x + "%");
    line.setAttribute("y1", a.y + "%");
    line.setAttribute("x2", b.x + "%");
    line.setAttribute("y2", b.y + "%");
    svg.appendChild(line);

    if (rel.label){
      const label = document.createElement("span");
      label.className = "familytree__label";
      label.style.left = ((a.x + b.x) / 2) + "%";
      label.style.top = ((a.y + b.y) / 2) + "%";
      label.textContent = rel.label;
      container.appendChild(label);
    }
  });

  CHARACTERS.forEach(c => {
    const node = document.createElement("div");
    node.className = "familytree__node";
    node.style.left = c.x + "%";
    node.style.top = c.y + "%";
    node.innerHTML = `${c.name}<small>${c.role}</small>`;
    container.appendChild(node);
  });
}

/* ---------------- interactive map (confirmed regions) ----------------
   Leaflet with a flat, non-geographic coordinate system (CRS.Simple)
   over a community-drawn placeholder layout — Rockstar hasn't shown
   the official map yet. Coordinates are approximate placement, not
   precise in-game geography. */
const REGIONS = [
  { id: "vicecity",    name: "Vice City",                 type: "city",   mapY: 340, mapX: 500,
    desc: "The commercial and criminal center of Leonida, inspired by Miami. Includes Vice Beach (North/Mid/South), Port Vice City, and Vice City International Airport." },
  { id: "leonidakeys", name: "Leonida Keys",               type: "region", mapY: 730, mapX: 610,
    desc: "A sprawling island chain to the south, mirroring the real Florida Keys." },
  { id: "grassrivers", name: "Grassrivers",                type: "region", mapY: 510, mapX: 280,
    desc: "A massive swamp-like wetland region based on the Everglades." },
  { id: "portgellhorn",name: "Port Gellhorn",              type: "region", mapY: 350, mapX: 740,
    desc: "An industrial port and working-class town." },
  { id: "ambrosia",    name: "Ambrosia",                   type: "region", mapY: 330, mapX: 330,
    desc: "A small inland farming community." },
  { id: "mountkalaga", name: "Mount Kalaga National Park", type: "region", mapY: 95,  mapX: 390,
    desc: "A protected nature park in the state's northern reaches." },
  { id: "vicedale",    name: "Vice Dale County",           type: "county", mapY: 420, mapX: 470,
    desc: "A parody of Miami-Dade County, covering the metro area and its immediate suburbs." },
  { id: "leonard",     name: "Leonard County",             type: "county", mapY: 200, mapX: 250,
    desc: "Located in the northwest, where police vehicles carry unique decals." },
  { id: "kelly",       name: "Kelly County",                type: "county", mapY: 560, mapX: 230,
    desc: "Covers most of the southwestern wetland regions." }
];

let leonidaMap = null;

function createRegionIcon(region){
  const letter = region.type === "city" ? "C" : region.type === "county" ? "Co" : "R";
  return L.divIcon({
    className: "",
    html: `<div class="map-pin map-pin--${region.type}"><span>${letter}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 26],
    popupAnchor: [0, -24]
  });
}

function buildRegionPopup(region){
  const label = region.type === "city" ? "Hub City" : region.type === "county" ? "County" : "Region";
  return `
    <span class="map-popup__badge">${label}</span>
    <p class="map-popup__name">${region.name}</p>
    <p class="map-popup__desc">${region.desc}</p>
  `;
}

function initMap(){
  const bounds = [[0, 0], [900, 1000]];
  leonidaMap = L.map("leonidaMap", {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 2,
    zoomSnap: 0.25,
    attributionControl: false
  });

  L.imageOverlay("map-leonida-placeholder.svg", bounds).addTo(leonidaMap);
  leonidaMap.fitBounds(bounds);
  leonidaMap.setMaxBounds(bounds);

  REGIONS.forEach(r => {
    L.marker([r.mapY, r.mapX], { icon: createRegionIcon(r) })
      .addTo(leonidaMap)
      .bindPopup(buildRegionPopup(r));
  });
}

function renderRegionGrid(){
  const grid = document.getElementById("regionGrid");
  if (!grid) return;
  grid.innerHTML = REGIONS.map(r => {
    const stampClass = r.type === "city" ? "stamp--pink" : r.type === "county" ? "stamp--cyan" : "stamp--green";
    const label = r.type === "city" ? "HUB CITY" : r.type === "county" ? "COUNTY" : "REGION";
    return `
      <div class="fact-card">
        <span class="stamp ${stampClass}">${label}</span>
        <h3>${r.name}</h3>
        <p>${r.desc}</p>
      </div>
    `;
  }).join("");
}

/* ---------------- weapons database ---------------- */
const WEAPONS = [
  { name: "Girardi ES9", category: "Pistols & Handguns", basis: "Beretta 92FS-style semi-auto pistol — Jason's primary sidearm." },
  { name: "Klose K17", category: "Pistols & Handguns", basis: "Glock 17-style pistol, frequently seen with Lucia." },
  { name: "Capo Pistol", category: "Pistols & Handguns", basis: "Colt M1911-style classic semi-auto pistol." },
  { name: "Nipper .38", category: "Pistols & Handguns", basis: "Ultra-compact revolver, shown in Lucia's hands on the box art." },
  { name: "Morgan Revolver", category: "Revolvers", basis: "Smith & Wesson 629-style revolver. Ultimate Edition includes engraved Jason/Lucia versions referencing the original Vice City games' release dates." },
  { name: "Mustang .357", category: "Revolvers", basis: "Colt Python-style heavy-hitting revolver." },
  { name: "Duke Carbine", category: "Assault Rifles & Carbines", basis: "AR-15/HK416-style carbine from the fictional Duke Arms Company — a direct lore tie to Red Dead Redemption's weapon makers." },
  { name: "AK-Style Assault Rifle", category: "Assault Rifles & Carbines", basis: "Classic AK-pattern rifle, wood furniture variant available." },
  { name: "Service Carbine", category: "Assault Rifles & Carbines", basis: "M16-inspired military carbine." },
  { name: "MP5-Style SMG", category: "SMGs & Light Machine Guns", basis: "Heckler & Koch MP5-style SMG; Jason's variant carries a red dot sight." },
  { name: "Micro SMG / MAC-10", category: "SMGs & Light Machine Guns", basis: "MAC-10/Mini Uzi-style rapid-fire SMG. A retro blue variant ships with the Vintage Vice City pre-order pack." },
  { name: "Combat MG", category: "SMGs & Light Machine Guns", basis: "M249 SAW-style belt-fed light machine gun." },
  { name: "Remington 700 / Duke Sniper", category: "Shotguns & Sniper Rifles", basis: "Bolt-action sniper rifle." },
  { name: "Springfield M1A", category: "Shotguns & Sniper Rifles", basis: "M14/M1A-style semi-auto sniper rifle." },
  { name: "Pump Action Shotgun", category: "Shotguns & Sniper Rifles", basis: "Mossberg 590-style pump shotgun." },
  { name: "Double-Barreled Shotgun", category: "Shotguns & Sniper Rifles", basis: "Traditional double-barrel shotgun, first spotted with a local hunter NPC." }
];

const WEAPON_CATEGORY_ORDER = ["Pistols & Handguns", "Revolvers", "Assault Rifles & Carbines", "SMGs & Light Machine Guns", "Shotguns & Sniper Rifles"];
const WEAPON_STAMPS = ["stamp--cyan", "stamp--pink", "stamp--green"];

function renderGroupedSection(items, order, containerId, stampCycle){
  const container = document.getElementById(containerId);
  if (!container) return;

  let stampIndex = 0;
  container.innerHTML = order.map(category => {
    const inCategory = items.filter(i => i.category === category);
    if (!inCategory.length) return "";
    const stampClass = stampCycle[stampIndex % stampCycle.length];
    stampIndex++;
    const cards = inCategory.map(i => `
      <div class="data-card">
        <span class="stamp ${stampClass}">${i.exclusive ? "EXCLUSIVE" : "CONFIRMED"}</span>
        <h3>${i.name}</h3>
        ${i.exclusive ? `<div class="data-card__meta"><span>Availability</span><span>${i.exclusive}</span></div>` : ""}
        <p class="data-card__desc">${i.basis}</p>
      </div>
    `).join("");
    return `<h3 class="subsection-title">${category}</h3><div class="data-grid">${cards}</div>`;
  }).join("");
}

/* ---------------- vehicles database ---------------- */
const VEHICLES = [
  { name: "Bravado Banshee", category: "Super & Sports Cars", basis: "High-performance sports car." },
  { name: "Grotti Furia", category: "Super & Sports Cars", basis: "Modern Italian supercar." },
  { name: "Grotti Carbonizzare", category: "Super & Sports Cars", basis: "Modern Italian supercar." },
  { name: "Grotti Cheetah '95 (Classic)", category: "Super & Sports Cars", basis: "Retro Italian supercar." },
  { name: "Pfister Comet S2 Cabrio", category: "Super & Sports Cars", basis: "German sports convertible." },
  { name: "Pfister Comet Retro Custom", category: "Super & Sports Cars", basis: "German sports car, retro custom build." },
  { name: "Invetero Coquette / Coquette D10", category: "Super & Sports Cars", basis: "American sports car." },
  { name: "Ubermacht Cypher", category: "Super & Sports Cars", basis: "German performance car." },
  { name: "Benefactor Schafter V12", category: "Super & Sports Cars", basis: "German luxury performance sedan." },
  { name: "Albany Buccaneer / Custom", category: "Muscle Cars", basis: "Classic American V8 muscle car." },
  { name: "Vapid Chino / Custom", category: "Muscle Cars", basis: "Classic American lowrider-style muscle car." },
  { name: "Vapid Dominator", category: "Muscle Cars", basis: "Classic American muscle car." },
  { name: "Imponte Phoenix", category: "Muscle Cars", basis: "Classic American muscle car." },
  { name: "Imponte Ruiner", category: "Muscle Cars", basis: "Street-racing muscle car." },
  { name: "Declasse Tulip / Tulip M-100", category: "Muscle Cars", basis: "Classic American muscle car." },
  { name: "Declasse Vigero ZX Convertible", category: "Muscle Cars", basis: "Classic American muscle convertible." },
  { name: "'55 Vapid Stanier", category: "Muscle Cars", basis: "1955-styled sedan.", exclusive: "Pre-order bonus" },
  { name: "Vapid Aleutian", category: "SUVs & Off-Road", basis: "Full-size SUV." },
  { name: "Benefactor Dubsta", category: "SUVs & Off-Road", basis: "Luxury off-road SUV." },
  { name: "Enus Jubilee", category: "SUVs & Off-Road", basis: "Luxury SUV." },
  { name: "Dundreary Landstalker XL", category: "SUVs & Off-Road", basis: "Full-size SUV." },
  { name: "Vapid Caracara 4x4", category: "SUVs & Off-Road", basis: "Off-road pickup truck." },
  { name: "Maibatsu Sanchez (Dirt Bike)", category: "SUVs & Off-Road", basis: "Off-road dirt bike." },
  { name: "Nagasaki Blazer (Quad Bike)", category: "SUVs & Off-Road", basis: "All-terrain quad bike." },
  { name: "'67 Vapid Dominator Buggy", category: "SUVs & Off-Road", basis: "Classic dune buggy.", exclusive: "Ultimate Edition" },
  { name: "Albany Emperor", category: "Sedans & Motorhomes", basis: "Vintage luxury sedan." },
  { name: "Karin Intruder", category: "Sedans & Motorhomes", basis: "Everyday family sedan." },
  { name: "Zirconium Journey II", category: "Sedans & Motorhomes", basis: "Classic motorhome/RV." },
  { name: "Bravado Police Buffalo STX Pursuit", category: "Emergency Vehicles", basis: "High-speed police pursuit car." },
  { name: "Bravado Police Gauntlet Interceptor", category: "Emergency Vehicles", basis: "Modern police interceptor." },
  { name: "Brute Police Riot", category: "Emergency Vehicles", basis: "Armored police riot bus." },
  { name: "Police Maverick (Helicopter)", category: "Emergency Vehicles", basis: "Police patrol helicopter." },
  { name: "Shitzu Squalo", category: "Boats & Aircraft", basis: "Motorboat." },
  { name: "Speedophile Seashark", category: "Boats & Aircraft", basis: "Jet ski / personal watercraft." },
  { name: "Buzzard Attack Chopper", category: "Boats & Aircraft", basis: "Light attack helicopter." },
  { name: "Sea Sparrow", category: "Boats & Aircraft", basis: "Light utility helicopter." },
  { name: "Mammoth Dodo", category: "Boats & Aircraft", basis: "Small seaplane." }
];

const VEHICLE_CATEGORY_ORDER = ["Super & Sports Cars", "Muscle Cars", "SUVs & Off-Road", "Sedans & Motorhomes", "Emergency Vehicles", "Boats & Aircraft"];

/* ---------------- init ---------------- */
updateCountdown();
setInterval(updateCountdown, 1000);
renderFamilyTree();
renderRegionGrid();
renderGroupedSection(WEAPONS, WEAPON_CATEGORY_ORDER, "weaponCategories", WEAPON_STAMPS);
renderGroupedSection(VEHICLES, VEHICLE_CATEGORY_ORDER, "vehicleCategories", WEAPON_STAMPS);

try {
  initMap();
} catch (err) {
  console.warn("HeistFile: map failed to load", err);
  const mapEl = document.getElementById("leonidaMap");
  if (mapEl) mapEl.textContent = "Map couldn't load — check your connection and refresh.";
}
