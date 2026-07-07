/* ===========================================================
   HEISTFILE — GTA 6 countdown, Money Guide & Wiki
   NOTE: Only confirmed information from Rockstar is included.
   See the sources on the Facts page.
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
}

document.querySelectorAll("[data-target]").forEach(el => {
  el.addEventListener("click", () => showView(el.dataset.target));
});

/* ---------------- Wiki sub-navigation ---------------- */
function showWikiCategory(targetId){
  document.querySelectorAll(".subview").forEach(v => v.classList.toggle("is-active", v.id === targetId));
  document.querySelectorAll(".subtab").forEach(t => {
    const active = t.dataset.subtarget === targetId;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
}

document.querySelectorAll("[data-subtarget]").forEach(el => {
  el.addEventListener("click", () => showWikiCategory(el.dataset.subtarget));
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

/* ---------------- Wiki data models ----------------
   Deliberately empty: GTA 6 hasn't released yet (Nov 19, 2026),
   so there is no confirmed data on vehicles, weapons, or
   properties. Do NOT fill these in with leaks, rumors, or
   guesses — only add entries once Rockstar or verified
   post-release data confirms the details. Shape of each entry
   shown in the comments below. Characters are handled as plain
   HTML in index.html since there are only two, confirmed today. */

const VEHICLES = [
  // { id: "unique-id", name: "Vehicle name", category: "Car | Motorcycle | Boat | Aircraft",
  //   price: 000000, source: "https://..." }
];

const WEAPONS = [
  // { id: "unique-id", name: "Weapon name", category: "Pistol | SMG | Rifle | Melee | ...",
  //   notes: "short description", source: "https://..." }
];

const PROPERTIES = [
  // { id: "unique-id", name: "Property name", category: "Safehouse | Business | ...",
  //   price: 000000, source: "https://..." }
];

function formatMoney(amount){
  return "$" + Number(amount).toLocaleString("en-US");
}

/* Renders a Wiki data section: shows the locked/empty panel
   while the array is empty, and swaps to the populated grid
   the moment entries exist — no other code needs to change
   when real data lands. */
function renderDataSection(items, gridId, emptyId, templateFn){
  const grid = document.getElementById(gridId);
  const empty = document.getElementById(emptyId);
  if (!grid || !empty) return;

  if (!items.length){
    grid.hidden = true;
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  grid.hidden = false;
  grid.innerHTML = items.map(templateFn).join("");
}

function vehicleCardTemplate(v){
  return `
    <div class="data-card">
      <span class="stamp stamp--cyan">${v.category}</span>
      <h3>${v.name}</h3>
      <div class="data-card__meta">
        <span>Price</span>
        <span>${formatMoney(v.price)}</span>
      </div>
    </div>
  `;
}

function weaponCardTemplate(w){
  return `
    <div class="data-card">
      <span class="stamp stamp--pink">${w.category}</span>
      <h3>${w.name}</h3>
      <div class="data-card__meta">
        <span>Notes</span>
        <span>${w.notes || "—"}</span>
      </div>
    </div>
  `;
}

function propertyCardTemplate(p){
  return `
    <div class="data-card">
      <span class="stamp stamp--green">${p.category}</span>
      <h3>${p.name}</h3>
      <div class="data-card__meta">
        <span>Price</span>
        <span>${formatMoney(p.price)}</span>
      </div>
    </div>
  `;
}

/* ---------------- init ---------------- */
updateCountdown();
setInterval(updateCountdown, 1000);
renderDataSection(VEHICLES, "vehicleGrid", "vehicleEmpty", vehicleCardTemplate);
renderDataSection(WEAPONS, "weaponGrid", "weaponEmpty", weaponCardTemplate);
renderDataSection(PROPERTIES, "propertyGrid", "propertyEmpty", propertyCardTemplate);
