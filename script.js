/* ===========================================================
   HEISTFILE — GTA Online-data
   OBS: Alla priser/intäkter är communitybaserade uppskattningar
   (2026) och kan ändras vid spelets uppdateringar.
   =========================================================== */

const BUSINESSES = [
  {
    id: "acidlab",
    name: "Syralabbet (Acid Lab)",
    category: "passiv",
    price: 750000,
    incomePerHour: 150000,
    note: "Billigast bra business. Fyll på själv och sälj löst — låg micromanagement."
  },
  {
    id: "nightclub",
    name: "Nightclub",
    category: "passiv",
    price: 1350000,
    incomePerHour: 60000,
    note: "Bäst i kombo — mata den med Bunker och MC-verksamheter för lagerförsäljning."
  },
  {
    id: "bunker",
    name: "Bunker",
    category: "passiv",
    price: 1550000,
    incomePerHour: 45000,
    note: "Klassikern. Håll försörjning uppe och kombinera med Nightclub."
  },
  {
    id: "cocaine",
    name: "MC — Cocaine Lockup",
    category: "passiv",
    price: 975000,
    incomePerHour: 40000,
    note: "Den bästa MC-verksamheten. Mest värd för att mata Nightclubs lager."
  },
  {
    id: "autoshop",
    name: "Auto Shop",
    category: "aktiv",
    price: 2135000,
    incomePerHour: 400000,
    note: "Kontrakt á 170–300k på 30–45 min. Bra blandning av action och pengar."
  },
  {
    id: "agency",
    name: "Agency",
    category: "aktiv",
    price: 2850000,
    incomePerHour: 120000,
    note: "Dr Dre-kontrakt (1M) plus säkerhetskontrakt. Kräver lite startkapital."
  },
  {
    id: "kosatka",
    name: "Kosatka + Cayo Perico",
    category: "heist",
    price: 2200000,
    incomePerHour: 1000000,
    note: "Bästa solo-heisten i spelet rakt av. Kräver ubåten som bas."
  },
  {
    id: "salvageyard",
    name: "Salvage Yard",
    category: "aktiv",
    price: 1830000,
    incomePerHour: 90000,
    note: "Robbery Contracts + passiv bärgningsbilsinkomst i bakgrunden."
  }
];

const GOALS = [
  { id: "oppressor", name: "Oppressor Mk II", price: 3890250 },
  { id: "deluxo", name: "Deluxo", price: 4721500 },
  { id: "toreador", name: "Pegassi Toreador", price: 3675000 },
  { id: "buzzard", name: "Buzzard Attack Chopper", price: 1750000 },
  { id: "kosatkagoal", name: "Kosatka (ubåt)", price: 2200000 },
  { id: "custom", name: "Eget mål / eget belopp…", price: null }
];

const fmt = (n) => "$" + Math.round(n).toLocaleString("sv-SE");

const state = {
  selected: new Set()
};

/* ---------------- navigation ---------------- */
function showView(targetId){
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("is-active", v.id === targetId));
  document.querySelectorAll(".tab").forEach(t => {
    const active = t.dataset.target === targetId;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

document.querySelectorAll("[data-target]").forEach(el => {
  el.addEventListener("click", () => showView(el.dataset.target));
});

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
        <div><span>Pris</span><span>${fmt(b.price)}</span></div>
        <div><span>$ / timme</span><span>${fmt(b.incomePerHour)}</span></div>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".biz-card").forEach(card => {
    const toggle = () => {
      const id = card.dataset.id;
      if (state.selected.has(id)) state.selected.delete(id);
      else state.selected.add(id);
      card.classList.toggle("is-selected");
      card.setAttribute("aria-checked", state.selected.has(id) ? "true" : "false");
      updateSummary();
    };
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); toggle(); } });
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
    ? `Ifyllt automatiskt från ${chosen.length} vald(a) verksamhet(er) i kalkylatorn.`
    : "Tips: gå till kalkylatorn och tryck \"Använd i mål-planeraren\" så fylls detta i automatiskt.";
  showView("view-goal");
  updateReceipt();
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
    return { name: "Eget mål", price: custom };
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
  document.getElementById("rDays").textContent = daysNeeded !== null ? Math.ceil(daysNeeded) + " dagar" : "—";

  const note = document.getElementById("rNote");
  if (remaining <= 0){
    note.textContent = "Du har redan råd — dags att åka till Maze Bank Foreclosures eller garaget.";
  } else if (rate <= 0){
    note.textContent = "Fyll i din timintäkt (eller hämta den från kalkylatorn) för att se en tidslinje.";
  } else {
    note.textContent = `Vid ${hoursPerDay} h/dag klarar du det på cirka ${Math.ceil(daysNeeded)} dagar. Lägg till fler verksamheter i kalkylatorn för att korta tiden.`;
  }
}

/* ---------------- init ---------------- */
renderBizGrid();
renderGoalSelect();
updateSummary();
updateReceipt();
