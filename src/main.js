import { read, write } from "./lib/storage.js";
import { icon } from "./components/icons.js";
import { makePet } from "./components/pet.js";
import { workspace } from "./components/terminal.js";
import { shelf } from "./components/collections.js";
import { mountStickers } from "./components/stickers.js";
import { themeOptions } from "./components/theme-admin.js";
import { commands, hosts, labels, prefixes } from "./data/search.js";
import { portfolioUrl, trophies } from "./data/profile.js";
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
let engine = "google",
  draft = "",
  unmountStickers;

for (const el of document.querySelectorAll("[data-icon]"))
  el.innerHTML = icon(el.getAttribute("data-icon"));
shelfPanel.innerHTML = shelf();
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
  unmountStickers?.();
  document.documentElement.dataset.theme = Object.hasOwn(themes, id)
    ? id
    : "claude-code";
  if (activeTheme() === "vibe-v1") renderClassic(draft);
  else {
    workspacePanel.innerHTML = workspace(themes[activeTheme()]);
    query().value = draft;
    document.getElementById("perch").append(pet.companion);
    unmountStickers = mountStickers(
      workspacePanel.querySelector(".board"),
      pet.happy,
    );
  }
  setEngine(engine);
  route(false);
}
function route(celebrate = true) {
  const award = trophies.find((t) => location.hash === "#award-" + t.id);
  const onShelf = location.hash === "#shelf" || Boolean(award);
  const name = onShelf ? "shelf" : "workspace";
  document.getElementById("session-view").textContent = onShelf
    ? "shelf"
    : activeTheme() === "vibe-v1"
      ? "classic"
      : "hybrid";
  workspacePanel.hidden = onShelf;
  shelfPanel.hidden = !onShelf;
  for (const tab of document.querySelectorAll("button[role=tab]")) {
    const selected = tab.getAttribute("aria-controls") === name;
    tab.setAttribute("aria-selected", String(selected));
    tab.setAttribute("tabindex", selected ? "0" : "-1");
  }
  document
    .querySelector(".hint")
    .toggleAttribute("hidden", onShelf || activeTheme() === "vibe-v1");
  document
    .getElementById(onShelf ? "shelf-perch" : "perch")
    ?.append(pet.companion);
  if (onShelf && celebrate) pet.happy();
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
  if (location.hash === "#" + name) route();
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
  else if (btn.getAttribute("role") === "tab")
    navigate(btn.getAttribute("aria-controls"));
  else if (btn.hasAttribute("data-copy") && portfolioUrl) {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      btn.textContent = "Link copied";
    } catch {
      showDialog(
        "Portfolio link",
        '<input aria-label="Portfolio URL" readonly>',
      );
      const field = dialog.querySelector("input");
      field.value = portfolioUrl;
      field.select();
    }
  } else if (btn.id === "classic-play" || btn.id === "classic-reset") {
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
    e.target.closest("[role=tablist]") &&
    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
  ) {
    e.preventDefault();
    const id =
      e.key === "Home"
        ? "workspace"
        : e.key === "End"
          ? "shelf"
          : workspacePanel.hidden
            ? "workspace"
            : "shelf";
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
