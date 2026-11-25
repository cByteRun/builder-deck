import { $, $$ } from "../../lib/dom.js";
import { read } from "../../lib/storage.js";
import { shortcutRow } from "../../components/shortcuts.js";
const cities = [
  ["QYZ", "Asia/Qyzylorda"],
  ["BER", "Europe/Berlin"],
  ["SYD", "Australia/Sydney"],
  ["NYC", "America/New_York"],
];
const timeFormats = cities.map(
  ([, timeZone]) =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    }),
);
function classicTimer() {
  const v = read("classic.timer", {});
  return {
    end: Number(v?.end) || 0,
    remaining: Number.isFinite(v?.remaining) ? Math.max(0, v.remaining) : 1500,
  };
}
function tickClassic() {
  const target = $("#classic-count");
  if (!target) return;
  const now = Date.now(),
    t = classicTimer();
  $$(".classic-city time").forEach(
    (el, i) => (el.textContent = timeFormats[i].format(now)),
  );
  const secs = t.end
    ? Math.max(0, Math.ceil((t.end - now) / 1000))
    : t.remaining;
  target.textContent =
    String(Math.floor(secs / 60)).padStart(2, "0") +
    ":" +
    String(secs % 60).padStart(2, "0");
  $("#classic-play").textContent = t.end && secs ? "Ⅱ" : "▶";
  $("#classic-play").setAttribute(
    "aria-label",
    t.end && secs ? "Pause timer" : "Start timer",
  );
}
function renderClassic(draft) {
  $("#status-mode").textContent = "classic";
  $("#main").setAttribute("aria-labelledby", "tab-hybrid");
  $("#main").innerHTML =
    '<section class="classic-board"><a class="classic-weather" href="https://www.accuweather.com/en/kz/pavlodar/225059/weather-forecast/225059" target="_blank" rel="noopener">Pavlodar <span>Weather ↗</span></a>' +
    '<div class="classic-title" role="img" aria-label="Vibe Coding — Decentrathon Edition 6.0"></div>' +
    '<form class="classic-search" id="search"><input aria-label="Search the web" id="query" placeholder="Search the web or enter a command" autocomplete="off"><button aria-label="Search">↵</button></form>' +
    shortcutRow() +
    '<div class="classic-widgets"><section><h2>World clock</h2><div class="classic-cities">' +
    cities
      .map(
        ([city]) => '<div class="classic-city">' + city + "<time></time></div>",
      )
      .join("") +
    "</div></section>" +
    '<section><h2>Focus timer</h2><div class="classic-controls"><button id="classic-play" aria-label="Start timer">▶</button><output id="classic-count">25:00</output><button id="classic-reset" aria-label="Reset timer">↺</button></div></section></div><div class="classic-strip" aria-hidden="true"></div></section>';
  $("#query").value = draft;
  $$("#dock [role=tab]").forEach((b) => {
    b.setAttribute("aria-selected", String(b.dataset.view === "hybrid"));
    b.tabIndex = b.dataset.view === "hybrid" ? 0 : -1;
  });
  tickClassic();
}
setInterval(tickClassic, 1000);

export { renderClassic, classicTimer, tickClassic };
