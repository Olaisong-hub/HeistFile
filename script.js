/* ===========================================================
   HEISTFILE — GTA 6 countdown & confirmed facts
   NOTE: Only confirmed information from Rockstar is included.
   See the sources on the Facts page.
   =========================================================== */

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

/* ---------------- init ---------------- */
updateCountdown();
setInterval(updateCountdown, 1000);
