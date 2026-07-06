/* ===========================================================
   HEISTFILE — GTA Online data
   NOTE: All prices/income figures are community-based estimates
   (2026) and may change with game updates.
   =========================================================== */

const BUSINESSES = [
  {
    id: "acidlab",
    name: "Acid Lab",
    category: "passive",
    price: 750000,
    incomePerHour: 150000,
    note: "Cheapest solid business. Self-supplied and sold loose — low micromanagement."
  },
  {
    id: "nightclub",
    name: "Nightclub",
    category: "passive",
    price: 1350000,
    incomePerHour: 60000,
    note: "Best in combo — feed it with Bunker and MC businesses for warehouse sales."
  },
  {
    id: "bunker",
    name: "Bunker",
    category: "passive",
    price: 1550000,
    incomePerHour: 45000,
    note: "The classic. Keep supplies up and pair it with the Nightclub."
  },
  {
    id: "cocaine",
    name: "MC — Cocaine Lockup",
    category: "passive",
    price: 975000,
    incomePerHour: 40000,
    note: "The best MC business. Most valuable for feeding the Nightclub's warehouse."
  },
  {
    id: "autoshop",
    name: "Auto Shop",
    category: "active",
    price: 2135000,
    incomePerHour: 400000,
    note: "Contracts worth 170–300k over 30–45 min. Good mix of action and money."
  },
  {
    id: "agency",
    name: "Agency",
    category: "active",
    price: 2850000,
    incomePerHour: 120000,
    note: "Dr Dre contract (1M) plus security contracts. Needs a bit of starting capital."
  },
  {
    id: "kosatka",
    name: "Kosatka + Cayo Perico",
    category: "heist",
    price: 2200000,
    incomePerHour: 1000000,
    note: "Straight up the best solo heist in the game. Requires the submarine as a base."
  },
  {
    id: "salvageyard",
    name: "Salvage Yard",
    category: "active",
    price: 1830000,
    incomePerHour: 90000,
    note: "Robbery Contracts plus passive tow-truck income in the background."
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
        <div><span>Price</span><span>${fmt(b.price)}</span></div>
        <div><span>$ / hour</span><span>${fmt(b.incomePerHour)}</span></div>
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
    ? `Auto-filled from ${chosen.length} selected business(es) in the calculator.`
    : "Tip: go to the calculator and tap \"Use in goal planner\" to fill this in automatically.";
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

/* ---------------- init ---------------- */
renderBizGrid();
renderGoalSelect();
updateSummary();
updateReceipt();
