import { profileCards, mountWins, platforms } from "./components/proof-links.js";
import { read, write } from "./lib/storage.js";
import { icon } from "./components/icons.js";
import { makePet } from "./components/pet.js";
import { workspace } from "./components/terminal.js";
import { shelf } from "./components/collections.js";
import { mountPortfolio } from "./portfolio/controller.js";
import { translate } from "./portfolio/locale.js";
import { mountStickers, stickerCanvas } from "./components/stickers.js";
import { themeOptions } from "./components/theme-admin.js";
import { commands, hosts, labels, prefixes } from "./data/search.js";
import { trophies } from "./data/profile.js";
import { themes, activeTheme } from "./themes/index.js";
import {
  renderClassic,
  tickClassic,
  classicTimer,
} from "./themes/vibe-v1/board.js";

const workspacePanel = document.getElementById("workspace");
const shelfPanel = document.getElementById("shelf");
const dialog = /** @type {HTMLDialogElement} */ (
  document.getElementById("settings")
);
const pet = makePet();
const query = () =>
  /** @type {HTMLInputElement} */ (document.getElementById("query"));
const main = document.querySelector("main");
const viewTabs = document.querySelector(".dock");
let canvasStickers, currentView, workspaceTheme;
let engine = "google",
  draft = "",
  workspaceStickers;

for (const el of document.querySelectorAll("[data-icon]"))
  el.innerHTML = icon(el.getAttribute("data-icon"));
const socials = platforms.filter(([id]) => ["github","x","linkedin","instagram"].includes(id));
document.getElementById("header-socials").innerHTML = socials.map(([id,,name,,url]) =>
  `<a href="${url}" aria-label="${name}" title="${name}" target="_blank" rel="noopener noreferrer">${icon(id)}</a>`).join("");
if (/Mac|iPhone|iPad/.test(navigator.platform)) document.querySelector("#open-palette kbd").textContent = "⌘ K";

function renderPublicChrome(lang) {
  const tr = key => translate(key, lang);
  const opened = [...shelfPanel.querySelectorAll("details[open]")].map(el => el.id);
  shelfPanel.innerHTML = shelf(lang);
  for (const id of opened) document.getElementById(id)?.setAttribute("open", "");
  if (currentView === "shelf") document.getElementById("shelf-perch").append(pet.companion);
  canvasStickers?.destroy();
  const bomb = document.getElementById("bomb");
  bomb.innerHTML = stickerCanvas(tr);
  canvasStickers = mountStickers(bomb.querySelector("#sticker-canvas"), pet.happy);
  for (const label of viewTabs.querySelectorAll("[data-label]")) label.textContent = tr(label.getAttribute("data-label"));
  document.getElementById("open-palette").setAttribute("aria-label", tr("Open command palette"));
  document.getElementById("site-language").setAttribute("aria-label", tr("Language"));
}
const portfolio = mountPortfolio({dialog, showDialog, navigate, onLanguage: renderPublicChrome});
mountWins();
function setEngine(name) {
  engine = name;
  if (query()) query().placeholder = labels[name];
  for (const btn of document.querySelectorAll("[data-engine]"))
    btn.setAttribute(
      "aria-pressed",
      String(btn.getAttribute("data-engine") === name),
    );
}
function renderTheme(id) {
  draft = query()?.value ?? draft;
  workspaceStickers?.destroy();
  workspaceStickers = null;
  document.documentElement.dataset.theme = Object.hasOwn(themes, id)
    ? id
    : "claude-code";
  workspaceTheme = null;
  route(false);
}
function prepareWorkspace() {
  if (workspaceTheme === activeTheme()) return;
  workspaceTheme = activeTheme();
  if (activeTheme() === "vibe-v1") renderClassic(draft);
  else {
    workspacePanel.innerHTML = workspace(themes[activeTheme()]);
    query().value = draft;
    document.getElementById("perch").append(pet.companion);
    workspaceStickers = mountStickers(
      workspacePanel.querySelector(".board"),
      pet.happy,
    );
  }
  workspacePanel.insertAdjacentHTML("beforeend", profileCards());
  setEngine(engine);
}
function route(celebrate = true) {
  const award = trophies.find((t) => location.hash === "#award-" + t.id);
  const hash = location.hash.slice(1);
  const name = award || hash === "shelf" ? "shelf" :
    hash === "workspace" ? "workspace" : hash === "bomb" ? "bomb" : "hub";
  const changed = currentView !== name;
  currentView = name;
  document.body.dataset.view = name;
  for (const tab of viewTabs.querySelectorAll("button[role=tab]")) {
    const id = tab.getAttribute("aria-controls");
    const selected = id === name;
    document.getElementById(id).hidden = !selected;
    tab.toggleAttribute("hidden", id === "workspace" && !selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.setAttribute("tabindex", selected ? "0" : "-1");
  }
  document.title = ({hub:"Daniil Tkachev · Proof of Work Hub",workspace:"Workspace",shelf:"Trophy Shelf",bomb:"Stickerbomb"})[name] + " | Builder Deck";
  if (name === "workspace") { prepareWorkspace(); workspaceStickers?.refresh(); }
  if (name === "bomb") canvasStickers.refresh();
  if (changed) main.scrollTop = 0;
  if (name === "hub") {
    portfolio.enter();
    if (hash.startsWith("project-")) {
      portfolio.selectCase(hash.slice(8));
      const selected = document.querySelector(".case-tabs [aria-selected=true]");
      selected?.scrollIntoView({block:"nearest"});
    }
  } else if (name === "shelf" || name === "workspace") {
    document.getElementById(name === "shelf" ? "shelf-perch" : "perch")?.append(pet.companion);
    if (name === "shelf" && celebrate) pet.happy();
  }
  if (award) {
    const details = /** @type {HTMLDetailsElement} */ (
      document.getElementById("award-" + award.id)
    );
    details.open = true;
    details.querySelector("summary").focus({ preventScroll: true });
    details.scrollIntoView({ block: "nearest" });
  }
}
function navigate(name) {
  if (name === "hub") {
    if (location.hash) history.pushState(null, "", location.pathname + location.search);
    route();
  } else if (location.hash === "#" + name) route();
  else location.hash = name;
}
function showDialog(title, html) {
  document.getElementById("dialog-title").textContent = title;
  document.getElementById("dialog-body").innerHTML = html;
  if (!dialog.open) dialog.showModal();
}
function help(title = "Commands") {
  showDialog(
    title,
    Object.entries(commands)
      .map(
        ([name, desc]) =>
          `<button class="option" data-command="${name}">/${name}<small>${desc}</small></button>`,
      )
      .join(""),
  );
}
function command(name) {
  if (prefixes.includes(name)) {
    setEngine(name);
    query().focus();
    pet.think();
  } else if (name === "theme") showDialog("Theme", themeOptions());
  else if (name === "help") help();
  else if (name === "pet" || name === "confetti") pet.happy();
  else help("Unknown command");
}
workspacePanel.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = query();
  let term = input.value.trim(),
    provider = engine;
  if (!term) {
    help();
    return;
  }
  if (term.startsWith("/")) {
    const [first] = term.split(/\s+/, 1),
      name = first.slice(1).toLowerCase();
    const rest = term.slice(first.length).trim();
    if (!prefixes.includes(name) || !rest) {
      if (Object.hasOwn(commands, name)) input.value = draft = "";
      command(name);
      return;
    }
    setEngine(name);
    provider = name;
    term = rest;
  }
  window.open(
    hosts[provider] + encodeURIComponent(term),
    "_blank",
    "noopener,noreferrer",
  );
});
workspacePanel.addEventListener("focusin", (e) => {
  if (e.target === query()) pet.think();
});
workspacePanel.addEventListener("input", (e) => {
  if (e.target === query()) {
    draft = query().value;
    pet.think();
  }
});
workspacePanel.addEventListener("focusout", (e) => {
  if (e.target === query())
    queueMicrotask(() => {
      if (pet.companion.dataset.state === "thinking") pet.rest();
    });
});
shelfPanel.addEventListener(
  "toggle",
  (e) => {
    if (e.target instanceof HTMLDetailsElement && e.target.open) pet.happy();
  },
  true,
);
document.addEventListener("click", async (e) => {
  if (!(e.target instanceof Element)) return;
  const btn = e.target.closest("button");
  if (!btn) return;
  const data = btn.dataset;
  if (btn.id === "appearance") showDialog("Theme", themeOptions());
  else if (data.themeId) {
    write("theme", data.themeId);
    renderTheme(data.themeId);
    dialog.close();
  } else if (btn.hasAttribute("data-close")) dialog.close();
  else if (data.command) {
    dialog.close();
    command(data.command);
  } else if (data.engine) command(data.engine);
  else if (btn.hasAttribute("data-help")) help();
  else if (data.trophy) navigate("award-" + data.trophy);
  else if (viewTabs.contains(btn) && btn.getAttribute("role") === "tab")
    navigate(btn.getAttribute("aria-controls"));
  else if (btn.id === "classic-play" || btn.id === "classic-reset") {
    const t = classicTimer(),
      now = Date.now(),
      left = t.end ? Math.max(0, Math.ceil((t.end - now) / 1000)) : t.remaining;
    if (btn.id === "classic-reset")
      write("classic.timer", { end: 0, remaining: 1500 });
    else if (t.end && left) write("classic.timer", { end: 0, remaining: left });
    else
      write("classic.timer", {
        end: now + (left || 1500) * 1000,
        remaining: left || 1500,
      });
    tickClassic();
  }
});
dialog.addEventListener("click", (e) => {
  if (e.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (
    e.clientX < r.left ||
    e.clientX > r.right ||
    e.clientY < r.top ||
    e.clientY > r.bottom
  )
    dialog.close();
});
document.addEventListener("keydown", (e) => {
  if (!(e.target instanceof Element)) return;
  if (
    viewTabs.contains(e.target) &&
    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
  ) {
    e.preventDefault();
    const tabs = [...viewTabs.querySelectorAll("button:not([hidden])")];
    const index = tabs.findIndex(tab => tab === e.target);
    const next = {Home:0, End:tabs.length-1, ArrowLeft:index-1, ArrowRight:index+1}[e.key];
    const id = tabs[(next + tabs.length) % tabs.length].getAttribute("aria-controls");
    document.getElementById("tab-" + id).focus();
    navigate(id);
  } else if (
    e.key === "/" &&
    !e.ctrlKey &&
    !e.altKey &&
    !e.metaKey &&
    !dialog.open &&
    !workspacePanel.hidden &&
    e.target !== query()
  ) {
    e.preventDefault();
    query().focus();
    query().value = "/";
    pet.think();
  }
});
document.addEventListener("click", e => {
  if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || !(e.target instanceof Element)) return;
  if (e.target.closest('a[href="/"]')) { e.preventDefault(); navigate("hub"); }
});
window.addEventListener("hashchange", () => route());
const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Almaty",
  hour: "2-digit",
  minute: "2-digit",
});
function tick() {
  document.getElementById("clock").textContent = format.format(Date.now());
}
tick();
setInterval(tick, 15000);
renderTheme(read("theme", "claude-code"));
