/* ===========================================================
   HEISTFILE — GTA 6 launch guide, characters, map & arsenal
   Confirmed facts come from Rockstar Newswire, Take-Two's
   financial filings, and official trailers/screenshots/pack
   contents. Leaked/rumored content is always kept in separate
   .rumor-block elements, clearly stamped — never blended in.
   =========================================================== */

function slugify(str){
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* ---------------- top-level navigation ---------------- */
function showView(targetId){
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("is-active", v.id === targetId));
  document.querySelectorAll(".tab").forEach(t => {
    const active = t.dataset.target === targetId;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  if (targetId === "view-map") {
    setTimeout(openMap, 50);
  }
}

document.querySelectorAll("[data-target]").forEach(el => {
  el.addEventListener("click", () => {
    showView(el.dataset.target);
    history.replaceState(null, "", "#" + el.dataset.target);
  });
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

/* ---------------- countdown to release ---------------- */
const RELEASE_DATE = new Date(2026, 10, 19, 0, 0, 0);

function pulse(el){
  el.classList.remove("pulse");
  void el.offsetWidth; // force reflow so the animation can restart
  el.classList.add("pulse");
}

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

  const newDays = String(days).padStart(3, "0");
  const newHours = String(hours).padStart(2, "0");
  const newMinutes = String(minutes).padStart(2, "0");
  const newSeconds = String(seconds).padStart(2, "0");

  if (daysEl.textContent !== newDays) { daysEl.textContent = newDays; pulse(daysEl); }
  if (hoursEl.textContent !== newHours) { hoursEl.textContent = newHours; pulse(hoursEl); }
  if (minutesEl.textContent !== newMinutes) { minutesEl.textContent = newMinutes; pulse(minutesEl); }
  secondsEl.textContent = newSeconds;
  pulse(secondsEl);
}

/* ===========================================================
   CHARACTERS
   =========================================================== */
const CHARACTERS = [
  { id: "jason",   name: "Jason Duval",     role: "Protagonist",      slug: "jason-duval" },
  { id: "lucia",   name: "Lucia Caminos",   role: "Protagonist",      slug: "lucia-caminos" },
  { id: "cal",     name: "Cal Hampton",     role: "Jason's friend",   slug: "cal-hampton" },
  { id: "brian",   name: "Brian Heder",     role: "Smuggler",         slug: "brian-heder" },
  { id: "donnie",  name: "Donnie",          role: "Mechanic",         slug: "donnie" },
  { id: "lori",    name: "Lori Heder",      role: "Brian's wife",     slug: "lori-heder" },
  { id: "boobie",  name: "Boobie Ike",      role: "Businessman",      slug: "boobie-ike" },
  { id: "drequan", name: "Dre'Quan Priest", role: "Entrepreneur",     slug: "drequan-priest" },
  { id: "baeluxe", name: "Real Dimez",      role: "Social media duo", slug: "real-dimez" },
  { id: "raul",    name: "Raul Bautista",   role: "Heist planner",    slug: "raul-bautista" }
];

/* Structured tree instead of a free-floating point diagram — much
   clearer once the cast grows past a couple of characters, and it
   naturally stacks on mobile instead of needing a fixed-size canvas. */
const REL_TREE = {
  bond: "Partners & accomplices",
  circles: [
    {
      title: "Jason's Circle",
      members: [
        { id: "cal", relation: "Close friend" },
        { id: "brian", relation: "Smuggler for", children: [
          { id: "lori", relation: "Married to Brian" },
          { id: "donnie", relation: "Employed by Brian, close friend of Jason" }
        ]}
      ]
    },
    {
      title: "Lucia's Circle",
      members: [
        { id: "boobie", relation: "Business contact" },
        { id: "drequan", relation: "Local contact" },
        { id: "baeluxe", relation: "Social circle" },
        { id: "raul", relation: "Heist planner" }
      ]
    }
  ]
};

/* Fuller bios for the detail view. `leaked` entries are shown with a
   rumor stamp inside the detail page itself — never mixed silently
   into the confirmed text above them. */
const CHARACTER_DETAILS = {
  jason: {
    role: "Protagonist — Playable", relationship: "Lucia Caminos",
    confirmed: [
      "Jason Duval grew up surrounded by crime and, in search of structure and a way out, enlisted in the U.S. Army. Service didn't curb his criminal instincts — it sharpened them, leaving him with advanced combat skills, survival instincts, and weapons knowledge.",
      "After his service, he moved to Leonida Keys and became a smuggler and enforcer for the local drug veteran Brian Heder, living rent-free in one of Heder's properties in exchange for his work. He keeps a pet iguana he can feed and interact with.",
      "In gameplay, Jason has an advanced slow-motion ability: activating it highlights hidden weak points on enemies, vehicles, and structures in real time, making him the group's primary heavy-combat shooter."
    ],
    leaked: ["Development leaks describe Jason's opening mission as chasing a plane carrying a Russian drug smuggler to steal its cargo — cargo that ends up lost at sea after a police chase, requiring a later diving mission to recover it."]
  },
  lucia: {
    role: "Protagonist — Playable", relationship: "Jason Duval",
    confirmed: [
      "Lucia Caminos is the series' first playable female protagonist in the modern HD era — an action-driven survivor shaped by a hard upbringing. Her father taught her to fight early on, reflected in-game by training sessions at an MMA gym.",
      "Her story begins as she's released from Leonida Penitentiary. She initially wears an ankle monitor, though it can be removed fairly early without limiting free exploration of the map.",
      "Her signature tactical ability is a brief focus effect in combat, slowing down time to land a single, extremely precise critical shot."
    ],
    leaked: ["Data-mined material claims Lucia is the story's true emotional core, including a flashback showing her abandoning an infant at a delicatessen just before being arrested during a bank robbery — reportedly shown across the campaign's five chapters."]
  },
  brian: {
    role: "Smuggler & landlord", relationship: "Jason Duval",
    confirmed: [
      "Brian Heder is an experienced, well-established smuggler operating in Leonida Keys behind the cover of his boatyard, Brian's Boat Works & Marina. He belongs to an older generation of smugglers who flew large drug shipments in by plane during the Keys' golden smuggling era.",
      "These days he prefers to let others do the legwork, relying mainly on Jason and Cal Hampton for transport and intimidation jobs. He lives with his third wife, Lori Heder, and outwardly presents as a harmless beach bum while operating with cold precision underneath."
    ],
    leaked: ["Strong community rumors claim his voice acting and mannerisms are heavily influenced by actor Stephen Root (Buck Strickland in King of the Hill) — not confirmed by Rockstar."]
  },
  cal: {
    role: "Jason's friend", relationship: "Jason Duval",
    confirmed: [
      "Cal Hampton is a close friend of Jason's and one of Brian Heder's trusted associates. Extremely paranoid and conspiratorially minded, he spends most of his time indoors — intercepting coast guard radio, studying bird flock patterns for hidden spy drones, and spreading conspiracy theories online.",
      "Despite his instability, Cal has deep knowledge of Leonida's geography, local smuggling routes, and state surveillance systems, making him a genuinely valuable asset to the criminal duo."
    ],
    leaked: []
  },
  donnie: {
    role: "Boatyard mechanic", relationship: "Jason Duval",
    confirmed: [
      "Donnie is a close friend of Jason's, employed at Brian Heder's boatyard. He's described as unpredictable and odd, often called a \"freak\" by those around him — but his technical knowledge of boat engines and mechanics is undisputed, making him an important resource for modifying getaway vehicles and boats used in smuggling runs."
    ],
    leaked: []
  },
  lori: {
    role: "Brian's wife", relationship: "Brian Heder",
    confirmed: [
      "Lori Heder is Brian Heder's wife and helps run the social and administrative side of the smuggling traffic in Leonida Keys. She's described as someone who serves sangria and keeps a pleasant facade at the boatyard, all while being fully aware of — and complicit in — the criminal transactions taking place there."
    ],
    leaked: []
  },
  boobie: {
    role: "Businessman", relationship: "Vice City network",
    confirmed: [
      "Boobie Ike is a successful, influential Vice City businessman who made the jump from the streets to established enterprise. His empire spans heavy real-estate investments, an exclusive strip club, and the independent record label Only Raw Records.",
      "Though he runs outwardly legitimate businesses, he keeps deep ties to the city's underworld and controls a criminal network that constantly toes the line of the law. His broader goal is total cultural and economic dominance in Vice City by exploiting young, talented artists."
    ],
    leaked: []
  },
  drequan: {
    role: "Local artist & entrepreneur", relationship: "Vice City network",
    confirmed: [
      "Dre'Quan Priest is a sharp entrepreneur and co-founder of Only Raw Records alongside Boobie Ike. He operates more as a commercial player than a traditional gang member — with firsthand experience of the streets, he realized early that the music business offered a safer, more lucrative path to wealth.",
      "He's responsible for scouting and signing new talent to the label, and it's Dre'Quan who connects the viral sensation Real Dimez to Only Raw Records, hoping to build a global success story."
    ],
    leaked: []
  },
  baeluxe: {
    role: "Social media duo (\"Real Dimez\")", relationship: "Vice City network",
    confirmed: [
      "Real Dimez is a hip-hop/trap duo made up of childhood friends Bae-Luxe and Roxy. They've built a massive social-media brand selling an extremely tough, dangerous street image — but the danger isn't just marketing.",
      "Behind the glossy image are two cold-blooded criminals who've robbed serious drug dealers by exploiting the fact their targets underestimated them. They use their record deal with Only Raw Records to launder their money and elevate their criminal standing."
    ],
    leaked: []
  },
  raul: {
    role: "Heist planner", relationship: "Vice City network",
    confirmed: [
      "Raul Bautista is a scarred veteran of bank-robbing circles in Leonida. With several heavy prison sentences behind him and a deep understanding of advanced police tactics, Raul acts as an advisor and logistics planner for Jason and Lucia during more complex scores.",
      "Raul favors careful planning over impulsive violence, and his involvement often guarantees access to advanced equipment and secure escape routes."
    ],
    leaked: []
  }
};

const MENTIONED = [
  { name: "Supporting Stefanie", role: "Supporting character", note: "Assists with the protagonists' probation supervision.", source: "Confirmed (Newswire)" },
  { name: "DWNPLY", role: "Musician / DJ", note: "Runs one of Vice City's local music scenes.", source: "Confirmed (game files)" },
  { name: "Phil Minor", role: "Political figure", note: "A local Leonida politician with corrupt contacts.", source: "Confirmed (game files)" },
  { name: "Rudi", role: "Smuggler", note: "A now-deceased veteran of the Leonida Keys underworld.", source: "Confirmed (game files)" },
  { name: "Jay Norris", role: "Deceased CEO", note: "Former Lifeinvader CEO in Los Santos — his mention confirms GTA 6 shares GTA V's HD-era universe.", source: "Confirmed (leak reference)" },
  { name: "Jack Howitzer", role: "Actor", note: "The series' recurring parody of a Hollywood action star.", source: "Confirmed (leak reference)" },
  { name: "Yung Ancestor", role: "Celebrity", note: "A recurring Los Santos entertainment-world figure.", source: "Confirmed (leak reference)" },
  { name: "Erin Henshaw", role: "Media personality", note: "A news anchor on Vice City's local broadcasts.", source: "Confirmed (leak reference)" },
  { name: "Kenny Brewster", role: "Gang leader", note: "Controls a local motorcycle club in the north.", source: "Confirmed (leak reference)" }
];

function renderMentionedGrid(){
  const grid = document.getElementById("mentionedGrid");
  if (!grid) return;
  grid.innerHTML = MENTIONED.map(m => `
    <div class="dossier-card">
      <span class="dossier-card__stamp">CONFIRMED</span>
      <h3 class="dossier-card__name">${m.name}</h3>
      <p class="dossier-card__role">${m.role}</p>
      <div class="dossier-card__row"><span>Source</span><span>${m.source}</span></div>
      <p class="dossier-card__note">${m.note}</p>
    </div>
  `).join("");
}

function renderRelationshipTree(){
  const container = document.getElementById("relTree");
  if (!container) return;

  const byId = Object.fromEntries(CHARACTERS.map(c => [c.id, c]));

  function leadCard(id){
    const c = byId[id];
    return `
      <a class="reltree__lead" href="${c.slug}.html">
        <span class="reltree__lead-name">${c.name}</span>
        <span class="reltree__lead-role">${c.role}</span>
      </a>
    `;
  }

  function memberItem(m){
    const c = byId[m.id];
    const children = m.children ? `
      <ul class="reltree__sublist">
        ${m.children.map(memberItem).join("")}
      </ul>
    ` : "";
    return `
      <li>
        <a href="${c.slug}.html">${c.name}</a>
        <span class="reltree__relation">${m.relation}</span>
        ${children}
      </li>
    `;
  }

  const circlesHtml = REL_TREE.circles.map(circle => `
    <div class="reltree__circle">
      <h4 class="reltree__circle-title">${circle.title}</h4>
      <ul class="reltree__list">
        ${circle.members.map(memberItem).join("")}
      </ul>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="reltree__protagonists">
      ${leadCard("jason")}
      <div class="reltree__bond">
        <span class="reltree__bond-icon" aria-hidden="true">⟷</span>
        <span class="reltree__bond-label">${REL_TREE.bond}</span>
      </div>
      ${leadCard("lucia")}
    </div>
    <div class="reltree__circles">
      ${circlesHtml}
    </div>
  `;
}

/* Character dossier cards and the family tree above are real <a> links
   directly in the HTML/markup — no click-to-open JS needed for them. */

/* ===========================================================
   INTERACTIVE MAP
   =========================================================== */
const REGIONS = [
  { id: "vicecity",    name: "Vice City",                 type: "city",   mapY: 340, mapX: 500,
    desc: "The commercial and criminal center of Leonida, inspired by Miami. Includes Vice Beach (North/Mid/South), Port Vice City, and Vice City International Airport." },
  { id: "leonidakeys", name: "Leonida Keys",               type: "region", mapY: 730, mapX: 610,
    desc: "A sprawling island chain to the south, mirroring the real Florida Keys — where the story begins." },
  { id: "grassrivers", name: "Grassrivers",                type: "region", mapY: 510, mapX: 280,
    desc: "A massive swamp-like wetland region based on the Everglades. Its shallow water reportedly requires airboats to cross." },
  { id: "portgellhorn",name: "Port Gellhorn",              type: "region", mapY: 350, mapX: 740,
    desc: "An industrial port and working-class town." },
  { id: "ambrosia",    name: "Ambrosia",                   type: "region", mapY: 330, mapX: 330,
    desc: "A small inland farming community." },
  { id: "mountkalaga", name: "Mount Kalaga National Park", type: "region", mapY: 95,  mapX: 390,
    desc: "A protected nature park in the state's northern reaches." },
  { id: "vicedale",    name: "Vice Dale County",           type: "county", mapY: 420, mapX: 470,
    desc: "A parody of Miami-Dade County, covering Vice City's neon streets, Art Deco architecture, exclusive nightclubs, and beaches." },
  { id: "kelly",       name: "Kelly County",                type: "county", mapY: 700, mapX: 590,
    desc: "A parody of Monroe County, covering the southern Leonida Keys — where Lucia and Jason's story begins." },
  { id: "leonard",     name: "Leonard County",             type: "county", mapY: 200, mapX: 250,
    desc: "A parody of Collier County in the northwest — smaller towns, rural land, and Leonida Penitentiary." }
];

/* ---------------- lazy-loaded map (performance) ----------------
   Leaflet (~40KB of JS + CSS) is only fetched the first time someone
   actually opens the Map tab, instead of on every single page load —
   the Home page shouldn't have to pay for a map most visitors never
   open. */
let leonidaMap = null;
let leafletLoadState = "idle"; // idle -> loading -> ready

function ensureLeafletLoaded(onReady){
  if (leafletLoadState === "ready") { onReady(); return; }

  const mapEl = document.getElementById("leonidaMap");
  if (mapEl && leafletLoadState === "idle") mapEl.textContent = "Loading map…";

  if (leafletLoadState === "loading"){
    document.addEventListener("heistfile:leaflet-ready", onReady, { once: true });
    return;
  }

  leafletLoadState = "loading";

  function loadScript(){
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      leafletLoadState = "ready";
      onReady();
      document.dispatchEvent(new Event("heistfile:leaflet-ready"));
    };
    script.onerror = () => {
      leafletLoadState = "idle";
      if (mapEl) mapEl.textContent = "Map couldn't load — check your connection and refresh.";
    };
    document.body.appendChild(script);
  }

  // The stylesheet MUST finish loading and applying before Leaflet's JS
  // builds the map — otherwise Leaflet measures/positions everything
  // against an unstyled container and the layout comes out broken
  // (zoom controls floating outside the map, wrong sizing, etc.).
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  link.onload = loadScript;
  link.onerror = loadScript; // don't get stuck forever if only the CSS CDN hiccups
  document.head.appendChild(link);
}

function openMap(){
  ensureLeafletLoaded(() => {
    if (!leonidaMap) {
      try { initMap(); }
      catch (err) {
        console.warn("HeistFile: map failed to load", err);
        const mapEl = document.getElementById("leonidaMap");
        if (mapEl) mapEl.textContent = "Map couldn't load — check your connection and refresh.";
      }
    } else {
      leonidaMap.invalidateSize();
    }
  });
}

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
    zoomSnap: 0.5,
    scrollWheelZoom: false,
    markerZoomAnimation: false,
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

/* ===========================================================
   WEAPONS DATABASE
   =========================================================== */
const WEAPONS = [
  { name: "Girardi ES9", category: "Pistols & Handguns", manufacturer: "Girardi", basis: "Beretta 92FS", source: "Confirmed (Newswire)", note: "Jason's primary sidearm — reliable fire rate and good accuracy at medium range." },
  { name: "Klose K17", category: "Pistols & Handguns", manufacturer: "Klose", basis: "Glock 17", source: "Confirmed (Newswire)", note: "Lucia's personal favorite. Highly customizable, and can be modified with a full-auto \"Glock Switch\" — devastating up close, at the cost of heavy recoil." },
  { name: "Polymer Pistol", category: "Pistols & Handguns", manufacturer: "Vom Feuer", basis: "SIG Sauer P320", source: "Confirmed (Trailers)", note: "A modern hybrid pistol with a lightweight polymer frame and very fast reloads." },
  { name: "Nipper .38", category: "Pistols & Handguns", manufacturer: "Unknown", basis: "Smith & Wesson Model 36", source: "Confirmed (Cover art)", note: "An ultra-compact revolver shown in Lucia's hand on the official box art — a common, easily-concealed early-game weapon." },
  { name: "Bersa Firestorm 380", category: "Pistols & Handguns", manufacturer: "Unknown", basis: "Bersa Thunder 380", source: "Confirmed (Pre-order pack)", note: "A compact concealed-carry pistol included in the Vintage Vice City pre-order pack — a popular self-defense weapon among Leonida's civilians.", exclusive: "Pre-order bonus" },
  { name: "Capo Pistol", category: "Pistols & Handguns", manufacturer: "Capo", basis: "Colt M1911", source: "Confirmed (Screenshots)", note: "Heavy-hitting for a semi-auto, at the cost of limited magazine capacity." },
  { name: "Morgan Revolver", category: "Revolvers", manufacturer: "Hawk & Little", basis: "Smith & Wesson Model 629", source: "Confirmed (Ultimate Edition)", note: "Ultimate Edition owners get a version with palm-leaf engravings in the Tommy Vercetti style and a mounted scope — serial numbers reference the release dates of Vice City and Vice City Stories.", exclusive: "Ultimate Edition variant" },
  { name: "Mustang .357", category: "Revolvers", manufacturer: "Hawk & Little", basis: "Colt Python", source: "Confirmed (Trailers)", note: "A timeless, powerful revolver with adjustable barrel lengths and finishes." },
  { name: "Duke Carbine", category: "Assault Rifles & Carbines", manufacturer: "Duke Arms Co.", basis: "AR-15 / HK416", source: "Confirmed (Screenshots)", note: "The most frequently used rifle in the game, supporting full tactical modification. Duke Arms Co. is a direct lore tie to Red Dead Redemption's historical weapon makers." },
  { name: "Duke Special Ops Carbine", category: "Assault Rifles & Carbines", manufacturer: "Duke Arms Co.", basis: "AR-15 / HK416 (compact)", source: "Confirmed (Screenshots)", note: "A modified, compact Duke Carbine variant with an integrated suppressor, optimized for stealthy night operations." },
  { name: "Assault Rifle", category: "Assault Rifles & Carbines", manufacturer: "Vom Feuer", basis: "AK-47", source: "Confirmed (Trailers)", note: "A reliable automatic rifle with heavy damage and strong recoil, available with classic wood furniture or modern folding stocks." },
  { name: "Service Carbine", category: "Assault Rifles & Carbines", manufacturer: "Unknown", basis: "M16", source: "Confirmed (Trailers)", note: "High accuracy with a three-round burst mode." },
  { name: "M14-style Rifle", category: "Assault Rifles & Carbines", manufacturer: "Unknown", basis: "Springfield M1A", source: "Confirmed (Screenshots)", note: "A semi-automatic rifle bridging the gap between a standard carbine and a dedicated sniper rifle." },
  { name: "Ruger-inspired Rifle", category: "Assault Rifles & Carbines", manufacturer: "Unknown", basis: "Ruger 10/22", source: "Confirmed (Screenshots)", note: "A light rifle suited to rapid fire at medium range." },
  { name: "Heckler & Koch MP5", category: "SMGs & Light Machine Guns", manufacturer: "Vom Feuer", basis: "H&K MP5/40", source: "Confirmed (Trailers)", note: "A legendary SMG used heavily during bank robberies — stable fire rate, minimal recoil, supports suppressors and red dot sights." },
  { name: "Micro SMG", category: "SMGs & Light Machine Guns", manufacturer: "Unknown", basis: "Mini Uzi", source: "Confirmed (Trailers)", note: "The primary drive-by weapon, fired from car windows or truck beds. A retro blue variant ships with the Vintage Vice City pre-order pack." },
  { name: "Compact SMG", category: "SMGs & Light Machine Guns", manufacturer: "Unknown", basis: "Skorpion vz. 61", source: "Confirmed (Screenshots)", note: "An especially lightweight SMG, ideal for motorcycle combat." },
  { name: "Combat MG", category: "SMGs & Light Machine Guns", manufacturer: "Vom Feuer", basis: "M249 SAW", source: "Confirmed (Trailers)", note: "A belt-fed light machine gun offering unmatched firepower against cars and helicopters, at the cost of a long reload and reduced mobility." },
  { name: "Pump Action Shotgun", category: "Shotguns & Sniper Rifles", manufacturer: "Unknown", basis: "Mossberg 590", source: "Confirmed (Screenshots)", note: "The police's primary close-range weapon, and a favorite for robbing small convenience stores." },
  { name: "Double-Barreled Shotgun", category: "Shotguns & Sniper Rifles", manufacturer: "Shrewsbury", basis: "Classic side-by-side shotgun", source: "Confirmed (Screenshots)", note: "Common across Leonida's rural areas — extremely wide spread and lethal at very short range." },
  { name: "Bolt Action Sniper", category: "Shotguns & Sniper Rifles", manufacturer: "Shrewsbury", basis: "Remington Model 700", source: "Confirmed (Screenshots)", note: "Used mainly by poachers and hunters in Leonida's wilderness — extreme range and precision, with camo and bipod customization." },
  { name: "Assault Sniper", category: "Shotguns & Sniper Rifles", manufacturer: "Unknown", basis: "L129A1", source: "Confirmed (Screenshots)", note: "A powerful sniper rifle with high magnification and a suppressor for silent eliminations at extreme range." },
  { name: "RPG-7", category: "Heavy & Specialist Weapons", manufacturer: "Shrewsbury", basis: "RPG-7", source: "Confirmed (game files)", note: "The player's single most powerful weapon against armored police vehicles and helicopters — heavy enough to require a dedicated duffel bag to carry." },
  { name: "Grenade Launcher", category: "Heavy & Specialist Weapons", manufacturer: "Unknown", basis: "Milkor MGL", source: "Confirmed (game files)", note: "A multi-shot launcher used to quickly take out vehicles and barricades with high-explosive 40mm rounds." },
  { name: "Speargun", category: "Heavy & Specialist Weapons", manufacturer: "Coil", basis: "Speargun", source: "Leaked (Rage database)", note: "The only weapon that can be fired underwater — used for defense against sharks and hostile divers, including in a mission that requires shooting a shark.", leaked: true }
];

const WEAPON_CATEGORY_ORDER = ["Pistols & Handguns", "Revolvers", "Assault Rifles & Carbines", "SMGs & Light Machine Guns", "Shotguns & Sniper Rifles", "Heavy & Specialist Weapons"];

/* ===========================================================
   VEHICLES DATABASE
   =========================================================== */
const VEHICLES = [
  { name: "Bravado Banshee", category: "Super & Sports Cars", manufacturer: "Bravado", basis: "Dodge Viper SR", source: "Confirmed (Trailers)" },
  { name: "Grotti Furia", category: "Super & Sports Cars", basis: "Modern Italian supercar." },
  { name: "Grotti Carbonizzare", category: "Super & Sports Cars", basis: "Modern Italian supercar." },
  { name: "Grotti Cheetah Classic", category: "Super & Sports Cars", manufacturer: "Grotti", basis: "Ferrari Testarossa (1980s)", source: "Confirmed (Ultimate Edition)", exclusive: "Ultimate Edition" },
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
  { name: "Declasse Tulip / Tulip M-100", category: "Muscle Cars", manufacturer: "Declasse", basis: "Chevrolet Malibu (1980s)", source: "Confirmed (Trailers)" },
  { name: "Declasse Impaler SZ", category: "Muscle Cars", manufacturer: "Declasse", basis: "Chevrolet Impala (1990s)", source: "Confirmed (Screenshots)" },
  { name: "Declasse Vigero ZX Convertible", category: "Muscle Cars", basis: "Classic American muscle convertible." },
  { name: "'55 Vapid Stanier", category: "Muscle Cars", manufacturer: "Vapid", basis: "Ford Mainline (1955)", source: "Confirmed (Pre-order pack)", exclusive: "Pre-order bonus (Vintage Vice City Pack)" },
  { name: "Vapid Creado (Ganado)", category: "SUVs & Off-Road", manufacturer: "Vapid", basis: "Ford Ranchero (1970s)", source: "Confirmed (Trailers)", note: "Jason's personal signature vehicle — a rugged coupe utility with a raw American V8, modifiable with upgraded suspension for the southern swamplands.", exclusive: "Jason's signature vehicle" },
  { name: "Declasse Yosemite 1500", category: "SUVs & Off-Road", manufacturer: "Declasse", basis: "Chevrolet Silverado (Retro)", source: "Confirmed (Screenshots)" },
  { name: "Vapid Aleutian", category: "SUVs & Off-Road", basis: "Full-size SUV." },
  { name: "Benefactor Dubsta", category: "SUVs & Off-Road", manufacturer: "Benefactor", basis: "Mercedes-Benz G-Class", source: "Confirmed (Trailers)" },
  { name: "Enus Jubilee", category: "SUVs & Off-Road", basis: "Luxury SUV." },
  { name: "Dundreary Landstalker XL", category: "SUVs & Off-Road", basis: "Full-size SUV." },
  { name: "Vapid Caracara 4x4", category: "SUVs & Off-Road", basis: "Off-road pickup truck." },
  { name: "Maibatsu Sanchez (Dirt Bike)", category: "SUVs & Off-Road", basis: "Off-road dirt bike." },
  { name: "Nagasaki Blazer (Quad Bike)", category: "SUVs & Off-Road", basis: "All-terrain quad bike." },
  { name: "Principe Alvino V1", category: "SUVs & Off-Road", manufacturer: "Principe", basis: "Ducati / Aprilia hybrid", source: "Confirmed (Screenshots)", note: "An all-new sport motorcycle offering unmatched city acceleration — ideal for weaving through traffic during a getaway." },
  { name: "'67 Vapid Dominator Buggy", category: "SUVs & Off-Road", manufacturer: "Vapid", basis: "Custom Mustang Buggy (1967)", source: "Confirmed (Ultimate Edition)", exclusive: "Ultimate Edition" },
  { name: "Albany Emperor", category: "Sedans & Motorhomes", basis: "Vintage luxury sedan." },
  { name: "Karin Intruder", category: "Sedans & Motorhomes", basis: "Everyday family sedan." },
  { name: "Zirconium Journey II", category: "Sedans & Motorhomes", basis: "Classic motorhome/RV." },
  { name: "Bravado Police Buffalo STX Pursuit", category: "Emergency Vehicles", manufacturer: "Bravado", basis: "Dodge Charger Pursuit", source: "Confirmed (Trailers)" },
  { name: "Bravado Police Gauntlet Interceptor", category: "Emergency Vehicles", basis: "Modern police interceptor." },
  { name: "Brute Police Riot", category: "Emergency Vehicles", manufacturer: "Brute", basis: "Lenco BearCat", source: "Confirmed (Trailers)" },
  { name: "Police Maverick (Helicopter)", category: "Emergency Vehicles", basis: "Police patrol helicopter." },
  { name: "Shitzu Squalo", category: "Boats & Aircraft", basis: "Motorboat." },
  { name: "Speedophile Seashark", category: "Boats & Aircraft", basis: "Jet ski / personal watercraft." },
  { name: "Crest Kayak", category: "Boats & Aircraft", manufacturer: "Crest", basis: "Modern recreational kayak", source: "Confirmed (Screenshots)" },
  { name: "Airboat", category: "Boats & Aircraft", basis: "Flat-bottomed, propeller-driven swamp boat", note: "Essential for crossing the shallow Grassrivers wetlands, where normal boat motors would immediately fail.", source: "Confirmed" },
  { name: "Buzzard Attack Chopper", category: "Boats & Aircraft", basis: "Light attack helicopter." },
  { name: "Sea Sparrow", category: "Boats & Aircraft", basis: "Light utility helicopter." },
  { name: "Mammoth Dodo", category: "Boats & Aircraft", basis: "Small seaplane." }
];

const VEHICLE_CATEGORY_ORDER = ["Super & Sports Cars", "Muscle Cars", "SUVs & Off-Road", "Sedans & Motorhomes", "Emergency Vehicles", "Boats & Aircraft"];

/* ===========================================================
   SHARED RENDERING: weapon/vehicle category grids + detail pages
   =========================================================== */
const WEAPON_ICONS = { "Pistols & Handguns": "P", "Revolvers": "R", "Assault Rifles & Carbines": "AR", "SMGs & Light Machine Guns": "SMG", "Shotguns & Sniper Rifles": "SG", "Heavy & Specialist Weapons": "HVY" };
const VEHICLE_ICONS = { "Super & Sports Cars": "SP", "Muscle Cars": "MC", "SUVs & Off-Road": "4×4", "Sedans & Motorhomes": "SD", "Emergency Vehicles": "EMG", "Boats & Aircraft": "B/A" };

function renderGroupedSection(items, order, containerId, stampCycle, iconMap, kind){
  const container = document.getElementById(containerId);
  if (!container) return;

  let stampIndex = 0;
  container.innerHTML = order.map(category => {
    const inCategory = items.filter(i => i.category === category);
    if (!inCategory.length) return "";
    const stampClass = stampCycle[stampIndex % stampCycle.length];
    stampIndex++;
    const cards = inCategory.map(i => {
      const hasPage = Boolean(i.source);
      const tag = hasPage ? "a" : "div";
      const hrefAttr = hasPage ? `href="${slugify(i.name)}.html"` : "";
      return `
      <${tag} class="data-card${hasPage ? "" : " data-card--static"}" ${hrefAttr}>
        <div class="item-icon item-icon--${kind} item-icon--sm">${iconMap[i.category]}</div>
        <span class="stamp ${stampClass}">${i.leaked ? "LEAKED" : (i.exclusive ? "EXCLUSIVE" : "CONFIRMED")}</span>
        <h3>${i.name}</h3>
        ${i.exclusive ? `<div class="data-card__meta"><span>Availability</span><span>${i.exclusive}</span></div>` : ""}
        <p class="data-card__desc">${i.note || i.basis}</p>
      </${tag}>
    `;
    }).join("");
    return `<h3 class="subsection-title">${category}</h3><div class="data-grid">${cards}</div>`;
  }).join("");
}

const CARD_STAMPS = ["stamp--cyan", "stamp--pink", "stamp--green"];

/* ===========================================================
   NEWS & UPDATES
   Each post also gets its own static page (see generate_pages.py) so
   it's independently indexable and shareable. Add new posts here —
   newest first — then re-run the generator to build the matching page.
   =========================================================== */
const NEWS = [
  {
    slug: "preorders-live",
    title: "Grand Theft Auto VI Pre-Orders Are Officially Live",
    date: "2026-06-25",
    category: "confirmed",
    summary: "Pre-orders opened globally on June 25, 2026. Digital pre-load access is confirmed for November 12 — a full week ahead of the November 19 launch.",
    body: [
      "Pre-orders for Grand Theft Auto VI opened worldwide on June 25, 2026, across both the Standard and Ultimate Editions. Anyone who pre-orders — physical or digital — is also guaranteed the Vintage Vice City Pack, a free bonus that disappears for anyone who orders after November 20, 2026.",
      "Digital customers who pre-order get pre-load access starting November 12, a full week before release, so the game is ready to play the moment it unlocks at midnight on November 19.",
      "Physical copies ship as a code-in-box rather than a disc — a decision widely read as an attempt to reduce pre-release leaks and limit the resale market."
    ]
  },
  {
    slug: "editions-and-pricing-confirmed",
    title: "GTA 6 Editions and Pricing Are Now Confirmed",
    date: "2026-06-18",
    category: "confirmed",
    summary: "Rockstar confirmed the full edition lineup ahead of pre-orders opening: a $79.99 Standard Edition, a $99.99 Ultimate Edition, and a $20 digital-only upgrade path.",
    body: [
      "Ahead of pre-orders opening, Rockstar laid out exactly how Grand Theft Auto VI will be sold. The Standard Edition ($79.99) is the base single-player game, available as a code-in-box or fully digital.",
      "The Ultimate Edition ($99.99) adds exclusive vehicles and weapon variants, cosmetic outfits, extra side missions, and access to in-game Customization Hubs. Anyone who already bought Standard can upgrade digitally through the PlayStation Store for $20 rather than re-buying the full game.",
      "Every pre-order, regardless of edition, also includes the Vintage Vice City Pack — 1980s-styled cosmetics, a '55 Vapid Stanier sedan, a dedicated garage near Ocean Beach, and weapon skins inspired by the original Vice City."
    ]
  },
  {
    slug: "take-two-earnings-gta6",
    title: "Take-Two's Earnings Show GTA 6's Massive Scale",
    date: "2026-05-20",
    category: "confirmed",
    summary: "Take-Two Interactive reported $6.65B in FY2026 net revenue and is guiding for $8.0–8.2B in FY2027 — growth almost entirely tied to GTA 6's launch window.",
    body: [
      "In its fiscal year 2026 filings, Take-Two Interactive (NASDAQ: TTWO) reported $6.65 billion in net revenue. More striking is the company's own forecast for fiscal year 2027 (April 2026 through March 2027): net bookings of $8.0–8.2 billion.",
      "That jump is guidance directly tied to Grand Theft Auto VI's November 19 launch landing inside that fiscal window. It's one of the clearest signals yet of how much of Take-Two's business now rides on this single release.",
      "For comparison, GTA Online inside GTA V reportedly still earns over $500 million a year on its own through microtransactions — roughly $1 million a day — which is part of why Rockstar has been comfortable shipping GTA 6 as a pure single-player experience at launch, with no online mode."
    ]
  }
];

function newsCardHtml(post, isFull){
  return `
    <a class="news-card" href="${post.slug}.html">
      <span class="news-card__date">${formatNewsDate(post.date)}</span>
      <h3 class="news-card__title">${post.title}</h3>
      <p class="news-card__summary">${post.summary}</p>
    </a>
  `;
}

function formatNewsDate(iso){
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function renderNewsList(){
  const container = document.getElementById("newsList");
  if (!container) return;
  if (!NEWS.length){
    container.innerHTML = `<p class="news-empty">No posts yet — check back soon.</p>`;
    return;
  }
  container.innerHTML = NEWS.map(p => newsCardHtml(p)).join("");
}

function renderHomeNewsTeaser(){
  const container = document.getElementById("homeNewsTeaser");
  if (!container) return;
  const latest = NEWS.slice(0, 3);
  if (!latest.length){
    container.innerHTML = `<p class="news-empty">No posts yet — check back soon.</p>`;
    return;
  }
  container.innerHTML = latest.map(p => newsCardHtml(p)).join("");
}

/* ---------------- init ---------------- */
updateCountdown();
setInterval(updateCountdown, 1000);
renderRelationshipTree();
renderMentionedGrid();
renderRegionGrid();
renderGroupedSection(WEAPONS, WEAPON_CATEGORY_ORDER, "weaponCategories", CARD_STAMPS, WEAPON_ICONS, "weapon");
renderGroupedSection(VEHICLES, VEHICLE_CATEGORY_ORDER, "vehicleCategories", CARD_STAMPS, VEHICLE_ICONS, "vehicle");
renderNewsList();
renderHomeNewsTeaser();

/* Deep-linking: a detail page can link back to e.g.
   ../index.html#view-characters and land on the right tab. This also
   opens the map on load if someone lands directly on #view-map. */
const initialHash = location.hash.replace("#", "");
if (initialHash && document.getElementById(initialHash)) {
  showView(initialHash);
}

/* ---------------- scroll reveal ----------------
   Progressive enhancement: only activates if IntersectionObserver is
   supported. Cards fade/slide in as they enter the viewport — including
   the moment a tab is switched, since newly-visible cards intersect
   immediately. Falls back to plain, fully-visible cards otherwise. */
if ("IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".fact-card, .dossier-card, .data-card, .news-card, .intro-card, .chooser__half"
  );
  if (revealTargets.length) {
    document.body.classList.add("js-reveal-ready");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    revealTargets.forEach(el => io.observe(el));
  }
}
