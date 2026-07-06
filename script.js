/* ===========================================================
   HEISTFILE — GTA Online data
   NOTE: All prices/income figures are community-based estimates
   (2026) and may change with game updates.
   Map coordinates (mapY, mapX) are placeholder positions on the
   generic placeholder map, not real in-game locations.
   =========================================================== */

const BUSINESSES = [
  {
    id: "acidlab",
    name: "Acid Lab",
    category: "passive",
    price: 750000,
    incomePerHour: 150000,
    note: "Cheapest solid business. Self-supplied and sold loose — low micromanagement.",
    action: "Kick off a batch at the Acid Lab and sell it solo once it's ready",
    mapY: 520, mapX: 180
  },
  {
    id: "nightclub",
    name: "Nightclub",
    category: "passive",
    price: 1350000,
    incomePerHour: 60000,
    note: "Best in combo — feed it with Bunker and MC businesses for warehouse sales.",
    action: "Sell your Nightclub warehouse stock once it's full",
    mapY: 220, mapX: 300
  },
  {
    id: "bunker",
    name: "Bunker",
    category: "passive",
    price: 1550000,
    incomePerHour: 45000,
    note: "The classic. Keep supplies up and pair it with the Nightclub.",
    action: "Sell your Bunker stock in a full supply run",
    mapY: 580, mapX: 610
  },
  {
    id: "cocaine",
    name: "MC — Cocaine Lockup",
    category: "passive",
    price: 975000,
    incomePerHour: 40000,
    note: "The best MC business. Most valuable for feeding the Nightclub's warehouse.",
    action: "Sell Cocaine Lockup product straight into your Nightclub warehouse",
    mapY: 420, mapX: 750
  },
  {
    id: "autoshop",
    name: "Auto Shop",
    category: "active",
    price: 2135000,
    incomePerHour: 400000,
    note: "Contracts worth 170–300k over 30–45 min. Good mix of action and money.",
    action: "Run an Auto Shop client contract",
    mapY: 260, mapX: 480
  },
  {
    id: "agency",
    name: "Agency",
    category: "active",
    price: 2850000,
    incomePerHour: 120000,
    note: "Dr Dre contract (1M) plus security contracts. Needs a bit of starting capital.",
    action: "Run an Agency security contract or Dr Dre setup mission",
    mapY: 170, mapX: 470
  },
  {
    id: "kosatka",
    name: "Kosatka + Cayo Perico",
    category: "heist",
    price: 2200000,
    incomePerHour: 1000000,
    note: "Straight up the best solo heist in the game. Requires the submarine as a base.",
    action: "Run the Cayo Perico Heist finale for the big payout",
    mapY: 640, mapX: 850
  },
  {
    id: "salvageyard",
    name: "Salvage Yard",
    category: "active",
    price: 1830000,
    incomePerHour: 90000,
    note: "Robbery Contracts plus passive tow-truck income in the background.",
    action: "Run a Salvage Yard Robbery Contract",
    mapY: 430, mapX: 850
  }
];

const GOALS = [
  { id: "oppressor", name: "Oppressor Mk II", price: 3890250 },
  { id: "deluxo", name: "Deluxo", price: 4721500 },
  { id: "toreador", name: "Pegassi Toreador", price: 3675000 },
  { id: "buzzard", name: "Buzzard Attack Chopper", price: 1750000 },
  { id: "kosatkagoal", name: "Kosatka (submarine)", price: 2200000 },
  { id: "custom", name: "Custom goal / custom amount…", price: null }
];

const fmt = (n) => "$" + Math.round(n).toLocaleString("en-US");

const state = {
  selected: new Set()
};

const markersById = {};
let leafletMap = null;

/* ---------------- navigation ---------------- */
function showView(targetId){
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("is-active", v.id === targetId));
  document.querySelectorAll(".tab").forEach(t => {
    const active = t.dataset.target === targetId;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  // Leaflet needs a nudge to recalculate its size the first time its
  // container becomes visible (it reports 0x0 while display:none).
  if (targetId === "view-hem" && leafletMap) {
    setTimeout(() => leafletMap.invalidateSize(), 50);
  }
}

document.querySelectorAll("[data-target]").forEach(el => {
  el.addEventListener("click", () => showView(el.dataset.target));
});

/* ---------------- shared selection logic ---------------- */
/* Used by both the calculator cards and the map popups, so picking a
   business in either place stays in sync everywhere else. */
function toggleBusinessSelection(id){
  const business = BUSINESSES.find(b => b.id === id);
  if (!business) return;

  if (state.selected.has(id)) state.selected.delete(id);
  else state.selected.add(id);

  const isSelected = state.selected.has(id);

  // sync the calculator card
  const card = document.querySelector(`.biz-card[data-id="${id}"]`);
  if (card){
    card.classList.toggle("is-selected", isSelected);
    card.setAttribute("aria-checked", isSelected ? "true" : "false");
  }

  // sync the map marker + open/closed popup
  const marker = markersById[id];
  if (marker){
    marker.setIcon(createPinIcon(business, isSelected));
    const popup = marker.getPopup();
    if (popup) popup.setContent(buildPopupContent(business, isSelected));
  }

  updateSummary();
  renderHeistStrategy();
}
window.toggleBusinessSelection = toggleBusinessSelection;

/* ---------------- business calculator ---------------- */
function renderBizGrid(){
  const grid = document.getElementById("bizGrid");
  grid.innerHTML = BUSINESSES.map(b => `
    <div class="biz-card" data-id="${b.id}" tabindex="0" role="checkbox" aria-checked="false">
      <div class="biz-card__check">✓</div>
      <span class="biz-card__badge badge--${b.category}">${b.category}</span>
      <p class="biz-card__name">${b.name}</p>
      <p class="biz-card__note">${b.note}</p>
      <div class="biz-card__stats">
        <div><span>Price</span><span>${fmt(b.price)}</span></div>
        <div><span>$ / hour</span><span>${fmt(b.incomePerHour)}</span></div>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".biz-card").forEach(card => {
    const id = card.dataset.id;
    const trigger = () => toggleBusinessSelection(id);
    card.addEventListener("click", trigger);
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); trigger(); } });
  });
}

function getSelectedBusinesses(){
  return BUSINESSES.filter(b => state.selected.has(b.id));
}

function updateSummary(){
  const chosen = getSelectedBusinesses();
  const totalPrice = chosen.reduce((s, b) => s + b.price, 0);
  const totalIncome = chosen.reduce((s, b) => s + b.incomePerHour, 0);
  document.getElementById("sumInvest").textContent = fmt(totalPrice);
  document.getElementById("sumIncome").textContent = fmt(totalIncome) + "/h";
  const payback = totalIncome > 0 ? totalPrice / totalIncome : null;
  document.getElementById("sumPayback").textContent = payback ? `${payback.toFixed(1)} h` : "—";
}

document.getElementById("sendToGoal").addEventListener("click", () => {
  const chosen = getSelectedBusinesses();
  const totalIncome = chosen.reduce((s, b) => s + b.incomePerHour, 0);
  document.getElementById("incomeRate").value = totalIncome;
  document.getElementById("incomeHint").textContent = chosen.length
    ? `Auto-filled from ${chosen.length} selected business(es) in the calculator.`
    : "Tip: go to the calculator and tap \"Use in goal planner\" to fill this in automatically.";
  showView("view-goal");
  updateReceipt();
  renderHeistStrategy();
});

/* ---------------- goal planner ---------------- */
function renderGoalSelect(){
  const select = document.getElementById("goalSelect");
  select.innerHTML = GOALS.map(g => `<option value="${g.id}">${g.name}${g.price ? " — " + fmt(g.price) : ""}</option>`).join("");
}

function currentGoal(){
  const id = document.getElementById("goalSelect").value;
  const goal = GOALS.find(g => g.id === id);
  if (goal.id === "custom"){
    const custom = parseFloat(document.getElementById("customGoalAmount").value) || 0;
    return { name: "Custom goal", price: custom };
  }
  return goal;
}

document.getElementById("goalSelect").addEventListener("change", () => {
  const isCustom = document.getElementById("goalSelect").value === "custom";
  document.getElementById("customGoalWrap").hidden = !isCustom;
  updateReceipt();
});

["customGoalAmount", "currentCash", "incomeRate"].forEach(id => {
  document.getElementById(id).addEventListener("input", updateReceipt);
});

const hoursSlider = document.getElementById("hoursPerDay");
hoursSlider.addEventListener("input", () => {
  document.getElementById("hoursPerDayValue").textContent = hoursSlider.value;
  updateReceipt();
});

function updateReceipt(){
  const goal = currentGoal();
  const cash = parseFloat(document.getElementById("currentCash").value) || 0;
  const rate = parseFloat(document.getElementById("incomeRate").value) || 0;
  const hoursPerDay = parseFloat(hoursSlider.value) || 1;

  const remaining = Math.max(goal.price - cash, 0);
  const hoursNeeded = rate > 0 ? remaining / rate : null;
  const daysNeeded = hoursNeeded !== null ? hoursNeeded / hoursPerDay : null;

  document.getElementById("rGoalName").textContent = goal.name;
  document.getElementById("rGoalPrice").textContent = fmt(goal.price);
  document.getElementById("rCash").textContent = fmt(cash);
  document.getElementById("rRemaining").textContent = fmt(remaining);
  document.getElementById("rRate").textContent = fmt(rate) + "/h";
  document.getElementById("rHours").textContent = hoursNeeded !== null ? hoursNeeded.toFixed(1) + " h" : "—";
  document.getElementById("rDays").textContent = daysNeeded !== null ? Math.ceil(daysNeeded) + " days" : "—";

  const note = document.getElementById("rNote");
  if (remaining <= 0){
    note.textContent = "You can already afford it — time to head to Maze Bank Foreclosures or the garage.";
  } else if (rate <= 0){
    note.textContent = "Fill in your hourly income (or pull it from the calculator) to see a timeline.";
  } else {
    note.textContent = `At ${hoursPerDay} h/day you'll get there in about ${Math.ceil(daysNeeded)} days. Add more businesses in the calculator to shorten the time.`;
  }
}

/* ---------------- heist strategy ---------------- */
/* Turns whichever businesses are currently checked in the calculator
   into a short, ordered earning loop — highest hourly income first. */
function renderHeistStrategy(){
  const container = document.getElementById("heistStrategy");
  if (!container) return;

  const chosen = getSelectedBusinesses()
    .slice()
    .sort((a, b) => b.incomePerHour - a.incomePerHour)
    .slice(0, 3);

  if (chosen.length === 0){
    container.innerHTML = `<p class="strategy-empty">Select a couple of businesses in the calculator (or tap pins on the map) and your personalized earning loop will show up here.</p>`;
    return;
  }

  const steps = chosen.map((b, i) => `
    <li>
      <strong>Step ${i + 1}:</strong> ${b.action}.
      <span class="strategy-rate">${fmt(b.incomePerHour)}/h</span>
    </li>
  `).join("");

  const totalRate = chosen.reduce((s, b) => s + b.incomePerHour, 0);

  container.innerHTML = `
    <ol class="strategy-list">${steps}</ol>
    <p class="strategy-summary">Loop these ${chosen.length} together and you're pulling in roughly <strong>${fmt(totalRate)}/h</strong> combined. Kick off the passive businesses first, then fill any cooldown with the active contract above — repeat every in-game day (about 48 real-time minutes) for the best results.</p>
  `;
}

/* ---------------- home map ---------------- */
/* Leaflet with a flat, non-geographic coordinate system (CRS.Simple)
   over a generic placeholder image. Swap map-placeholder.svg for a
   real map once real GTA 6 location data exists. */
function createPinIcon(business, isSelected){
  return L.divIcon({
    className: "",
    html: `<div class="map-pin map-pin--${business.category}${isSelected ? " is-selected" : ""}"><span>$</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -26]
  });
}

function buildPopupContent(business, isSelected){
  return `
    <span class="map-popup__badge badge--${business.category}">${business.category}</span>
    <p class="map-popup__name">${business.name}</p>
    <div class="map-popup__stats">
      <div><span>Price</span><span>${fmt(business.price)}</span></div>
      <div><span>$ / hour</span><span>${fmt(business.incomePerHour)}</span></div>
    </div>
    <button class="map-popup__btn${isSelected ? " is-selected" : ""}" onclick="window.toggleBusinessSelection('${business.id}')">
      ${isSelected ? "✓ Added — tap to remove" : "Add to my planner"}
    </button>
  `;
}

function initMap(){
  const bounds = [[0, 0], [700, 1000]];
  leafletMap = L.map("homeMap", {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 2,
    zoomSnap: 0.25,
    attributionControl: false
  });

  L.imageOverlay("map-placeholder.svg", bounds).addTo(leafletMap);
  leafletMap.fitBounds(bounds);
  leafletMap.setMaxBounds(bounds);

  BUSINESSES.forEach(b => {
    const marker = L.marker([b.mapY, b.mapX], {
      icon: createPinIcon(b, state.selected.has(b.id))
    }).addTo(leafletMap);
    marker.bindPopup(buildPopupContent(b, state.selected.has(b.id)), { className: "" });
    markersById[b.id] = marker;
  });
}

/* ---------------- init ---------------- */
renderBizGrid();
renderGoalSelect();
updateSummary();
updateReceipt();
renderHeistStrategy();

try {
  initMap();
} catch (err) {
  console.warn("HeistFile: map failed to load", err);
  const mapEl = document.getElementById("homeMap");
  if (mapEl) mapEl.textContent = "Map couldn't load — check your connection and refresh.";
}
