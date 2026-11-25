import { $, $$ } from "./lib/dom.js";
import { icon, art } from "./components/icons.js";
import { credentials, decals, nameOf } from "./data/profile.js";
import { prefixes, commands, hosts, labels } from "./data/search.js";
import { read, write } from "./lib/storage.js";
import { shortcutRow } from "./components/shortcuts.js";
import { pet, terminal, pills } from "./components/terminal.js";
import { pagehead, shelf, tokens } from "./components/collections.js";
import { themes, themeNames, activeTheme } from "./themes/index.js";
import {
  renderClassic,
  classicTimer,
  tickClassic,
} from "./themes/vibe-v1/board.js";
import { loadFirefoxStyles } from "./lib/firefox.js";
import { createAdmin } from "./components/theme-admin.js";
const themeFiles = await loadFirefoxStyles();
("use strict");
const views = [
  {
    id: "bomb",
    title: "Laptop Stickerbomb",
    short: "Stickerbomb",
    icon: "bomb",
  },
  {
    id: "shelf",
    title: "Builder Trophy Shelf",
    short: "Trophy Shelf",
    icon: "shelf",
  },
  {
    id: "sandbox",
    title: "Interactive Sandbox Canvas",
    short: "Sandbox",
    icon: "sandbox",
  },
  {
    id: "hybrid",
    title: "The Ultimate Hybrid",
    short: "Hybrid",
    icon: "layers",
  },
  {
    id: "tokens",
    title: "Design Tokens & Sprites",
    short: "Tokens",
    icon: "tokens",
  },
  { id: "css", title: "Firefox CSS", short: "Firefox CSS", icon: "css" },
];
let mode = views.some((v) => v.id === read("view", "hybrid"))
    ? read("view", "hybrid")
    : "hybrid",
  engine = "google",
  draft = "",
  state = "idle",
  timer,
  toastTimer,
  cssText = {},
  positions = {},
  drag = null;
const compact = matchMedia("(max-width:700px)");
const base = {
  hybrid: {
    hack: [15, 27, -12],
    sol: [84, 26, 11],
    decent: [15, 67, -9],
    coffee: [84, 70, 9],
    think: [30, 12, -5],
    cli: [27, 86, 5],
    ship: [89, 84, -9],
  },
  bomb: {
    hack: [19, 20, -16],
    sol: [83, 32, 16],
    decent: [11, 56, -15],
    coffee: [76, 79, 13],
    cli: [36, 84, -9],
    think: [60, 13, 7],
    ship: [91, 64, -13],
    sana: [14, 78, 8],
    icpc: [38, 14, -7],
  },
  sandbox: {
    hack: [14, 32, -6],
    sol: [86, 27, 5],
    decent: [20, 74, 6],
    coffee: [86, 69, -7],
    sana: [44, 81, 4],
    icpc: [64, 84, -6],
    cli: [41, 20, -8],
    think: [61, 18, 6],
    ship: [81, 87, 9],
  },
};
const phone = {
  hybrid: {
    hack: [19, 15, -11],
    sol: [81, 15, 10],
    decent: [19, 84, -8],
    coffee: [83, 82, 7],
    think: [50, 11, -6],
    cli: [46, 92, 2],
    ship: [58, 82, -8],
  },
  bomb: {
    hack: [18, 16, -16],
    sol: [82, 16, 12],
    decent: [19, 79, -9],
    coffee: [85, 80, 9],
    think: [49, 9, -6],
    cli: [48, 88, 2],
    ship: [52, 20, -7],
    icpc: [19, 91, 4],
    sana: [81, 92, -5],
  },
  sandbox: {
    hack: [18, 21, -8],
    sol: [82, 19, 6],
    decent: [18, 77, -8],
    coffee: [83, 79, 4],
    think: [52, 13, -3],
    cli: [52, 24, 5],
    sana: [19, 89, 2],
    icpc: [79, 91, -2],
    ship: [50, 78, 4],
  },
};
const stateKey = () =>
  activeTheme() + "." + mode + "." + (compact.matches ? "compact" : "wide");
function initialPositions() {
  return Object.fromEntries(
    Object.entries((compact.matches ? phone : base)[mode]).map(([k, p]) => [
      k,
      [...p],
    ]),
  );
}
function loadPositions() {
  positions = initialPositions();
  if (mode === "bomb") return;
  const saved = read(stateKey(), {});
  for (const k in positions) {
    const p = saved?.[k];
    if (Array.isArray(p) && p.length === 3 && p.every(Number.isFinite))
      positions[k] = p;
  }
}
function position(el) {
  const p = positions[el.dataset.id];
  el.style.left = p[0] + "%";
  el.style.top = p[1] + "%";
  el.style.setProperty("--r", p[2] + "deg");
}
function savePositions() {
  if (!write(stateKey(), positions))
    notice("Positions apply to this session only.");
}
function renderBoard(v) {
  loadPositions();
  const movable = mode !== "bomb";
  const hero =
    mode === "hybrid"
      ? themes[activeTheme()].greeting
      : mode === "bomb"
        ? "Sticker<em>bomb.</em>"
        : "The <em>sandbox.</em>";
  return (
    '<section class="board ' +
    mode +
    '" aria-label="' +
    v.title +
    '"><div class="frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div class="boardtitle">' +
    icon(v.icon) +
    "<span>Layout " +
    String(views.indexOf(v) + 1).padStart(2, "0") +
    "</span><span>/</span><b>" +
    v.title +
    '</b></div><span class="framecount"><span class="studio-word">Studio </span><b>' +
    String(views.indexOf(v) + 1).padStart(2, "0") +
    "</b> / 04</span>" +
    (mode === "sandbox"
      ? '<div class="zone-tools"><button class="tool" data-shuffle>' +
        icon("shuffle") +
        'Shuffle</button><button class="tool" data-reset>' +
        icon("reset") +
        "Reset</button></div>"
      : "") +
    Object.keys(positions)
      .map(
        (k) =>
          '<button aria-label="' +
          nameOf(k).replaceAll(">", "&gt;") +
          '" class="sticker ' +
          (movable ? "move" : "") +
          '" data-id="' +
          k +
          '" title="' +
          (movable
            ? "Drag to move · scroll or double-click to rotate · arrows / R on keyboard"
            : nameOf(k)) +
          '">' +
          art(k) +
          "</button>",
      )
      .join("") +
    '<div class="hero"><div class="eyebrow">' +
    icon("brand") +
    (mode === "hybrid"
      ? themes[activeTheme()].eyebrow
      : mode === "bomb"
        ? "Laptop collection"
        : "Freeform workspace") +
    "</div><h1>" +
    hero +
    '</h1><p class="bio"><span>Full-Stack Software Engineer</span><span>·</span><span class="bioloc">' +
    icon("pin") +
    " Pavlodar, KZ</span></p>" +
    terminal() +
    (mode === "hybrid" ? shortcutRow() + pills() : "") +
    '</div><span class="fieldnote">' +
    icon("hand") +
    (movable
      ? "Drag stickers · double-click to rotate"
      : "Click a sticker to inspect") +
    "</span></section>"
  );
}
const admin = $("#admin");
const { openAdmin, renderAdmin } = createAdmin({
  exportFiles,
  setupInstructions,
  fillExports,
});

function paintTheme(id) {
  id = Object.hasOwn(themeNames, id) ? id : "claude-code";
  document.documentElement.dataset.theme = id;
  cssText = themeFiles[themes[id].firefox];
  $("meta[name=theme-color]").content =
    id === "claude-code" ? "#191919" : "#09090b";
  $("#appearance").innerHTML = icon("layers") + "<span>Theme Admin</span>";
}
function toggleTheme() {
  openAdmin("themes");
}
function exportFiles() {
  return (
    '<div class="exports">' +
    Object.keys(cssText)
      .map(
        (file) =>
          '<article class="export"><div class="cardhead"><b>' +
          file +
          '</b><div class="export-actions"><button class="export-action" data-copy="' +
          file +
          '">Copy</button><button class="export-action" data-download="' +
          file +
          '">Download</button></div></div><pre tabindex="0"><code></code></pre></article>',
      )
      .join("") +
    "</div>"
  );
}
function fillExports(container) {
  container.querySelectorAll(".export").forEach((el) => {
    el.querySelector("code").textContent =
      cssText[el.querySelector("[data-copy]").dataset.copy];
  });
}
function setupInstructions() {
  return (
    '<section class="install"><h2>Firefox setup</h2><p>Open <code>about:support</code> and open your profile folder. Back up its <code>chrome</code> directory. Download both stylesheets to that directory, enable <code>toolkit.legacyUserProfileCustomizations.stylesheets</code> in <code>about:config</code>, and restart Firefox.</p>' +
    (activeTheme() === "claude-code"
      ? ""
      : '<p>For the Vibe styles, save <a download="PixelifySans.ttf" href="./assets/fonts/classicpixel.ttf">Pixelify Sans</a> and <a download="PressStart2P-Regular.ttf" href="./assets/fonts/classicpixel-cyrillic.ttf">Press Start 2P</a> in <code>chrome/fonts/</code>.</p>') +
    "<p>This website saves the selected theme in this browser.</p></section>"
  );
}
function exportsPage() {
  return (
    '<section class="page">' +
    pagehead(
      "css",
      "Firefox <em>stylesheets.</em>",
      themeNames[activeTheme()],
    ) +
    exportFiles() +
    setupInstructions() +
    "</section>"
  );
}
async function copyCSS(button) {
  const txt = cssText[button.dataset.copy];
  try {
    await navigator.clipboard.writeText(txt);
  } catch {
    const input = document.createElement("textarea");
    input.value = txt;
    input.style.cssText = "position:fixed;opacity:0;inset:0 auto auto 0";
    (button.closest("dialog") || document.body).append(input);
    input.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
    } finally {
      input.remove();
      button.focus();
    }
    if (!ok) {
      const r = document.createRange();
      r.selectNodeContents(button.closest(".export").querySelector("code"));
      const s = getSelection();
      s.removeAllRanges();
      s.addRange(r);
      button.textContent = "Press Ctrl+C";
      return;
    }
  }
  button.textContent = "Copied ✓";
  setTimeout(() => (button.textContent = "Copy"), 1400);
}
function downloadCSS(file) {
  const url = URL.createObjectURL(
    new Blob([cssText[file]], { type: "text/css;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = file;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.adminTab) openAdmin(b.dataset.adminTab);
  else if (b.dataset.apply) {
    if ($("#query")) draft = $("#query").value;
    paintTheme(b.dataset.apply);
    write("theme", activeTheme());
    changeView("hybrid");
    renderAdmin();
    $('#admin [data-admin-tab="themes"]').focus();
  } else if (b.id === "classic-play") {
    const t = classicTimer(),
      now = Date.now();
    const left = t.end
      ? Math.max(0, Math.ceil((t.end - now) / 1000))
      : t.remaining;
    write(
      "classic.timer",
      t.end && left
        ? { end: 0, remaining: left }
        : { end: now + (left || 1500) * 1000, remaining: left || 1500 },
    );
    tickClassic();
  } else if (b.id === "classic-reset") {
    write("classic.timer", { end: 0, remaining: 1500 });
    tickClassic();
  } else if (b.dataset.download) downloadCSS(b.dataset.download);
  else if (b.hasAttribute("data-admin-close")) admin.close();
});
admin.addEventListener("click", (e) => {
  if (e.target === admin) {
    const r = admin.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      admin.close();
  }
});

function selectEngine(k) {
  engine = k;
  $$(".engine").forEach((b) => {
    b.classList.toggle("on", b.dataset.engine === k);
    b.setAttribute("aria-pressed", String(b.dataset.engine === k));
  });
  if ($("#query")) $("#query").placeholder = labels[k];
}
function render() {
  if (activeTheme() === "vibe-v1" && mode === "hybrid") {
    drag = null;
    clearTimeout(timer);
    renderClassic(draft);
    setState("idle");
    return;
  }
  drag = null;
  clearTimeout(timer);
  const v = views.find((v) => v.id === mode);
  const main = $("#main");
  main.setAttribute("aria-labelledby", "tab-" + mode);
  main.innerHTML = base[mode]
    ? renderBoard(v)
    : mode === "shelf"
      ? shelf()
      : mode === "tokens"
        ? tokens()
        : exportsPage();
  $("#status-mode").textContent = mode;
  $$("[role=tab]").forEach((b) => {
    const active = b.dataset.view === mode;
    b.setAttribute("aria-selected", String(active));
    b.tabIndex = active ? 0 : -1;
  });
  if (base[mode]) {
    $$(".sticker").forEach(position);
    $("#query").value = draft;
    selectEngine(engine);
  }
  if (mode === "css") fillExports(main);
  setState("idle");
}
function changeView(k, focus = false) {
  if ($("#query")) draft = $("#query").value;
  mode = k;
  write("view", k);
  render();
  window.scrollTo(0, 0);
  if (focus) $("#tab-" + k).focus();
}
function notice(msg) {
  $("#toast").textContent = msg;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2100);
}
const sayings = [
  "KASE bond settled on-chain!",
  "Guinness record secured!",
  "git push --force",
  "One more commit?",
];
function setState(next, msg = "") {
  clearTimeout(timer);
  state = next;
  document.body.classList.toggle("is-typing", next === "typing");
  document.body.dataset.petState = next;
  const status = {
    idle: "idle",
    typing: "coding...",
    joy: "happy!",
    hover: "waving",
  }[next];
  $("#state-label").textContent = status;
  if ($("#labstate")) $("#labstate").textContent = status;
  $$(".bubble").forEach(
    (el) =>
      (el.textContent =
        msg ||
        {
          idle: "ready to vibe code, Daniil...",
          typing: "compiling...",
          joy: "ship it!",
          hover: "hello, builder!",
        }[next]),
  );
  if (next !== "idle")
    timer = setTimeout(() => setState("idle"), next === "typing" ? 900 : 1900);
}
function burst(x, y, n = 13, full = false) {
  const box = $("#particles");
  for (let i = 0; i < n; i++) {
    const a = document.createElement("b");
    a.className = "particle";
    a.textContent = full ? ["▪", "✦", "+"][i % 3] : ["♥", "✦", "▪"][i % 3];
    a.style.left = (full ? Math.random() * innerWidth : x) + "px";
    a.style.top = (full ? Math.random() * innerHeight * 0.6 : y) + "px";
    a.style.color = ["#D97757", "#9783bd", "#559489", "#d2a751"][i % 4];
    a.style.setProperty(
      "--x",
      (Math.random() - 0.5) * (full ? 200 : 100) + "px",
    );
    a.style.setProperty(
      "--y",
      (full ? 90 + Math.random() * 160 : -25 - Math.random() * 85) + "px",
    );
    a.style.setProperty("--rot", (Math.random() - 0.5) * 120 + "deg");
    box.append(a);
    setTimeout(() => a.remove(), 950);
  }
}
function playPet(target) {
  let el =
    target || $(".companion .pet") || $(".playground .pet") || $(".cat-lane");
  let sprite = el.querySelector("svg") || el;
  const r = sprite.getBoundingClientRect();
  const msg = sayings[Math.floor(Math.random() * sayings.length)];
  setState("joy", msg);
  el.classList.remove("is-joy");
  void el.offsetWidth;
  el.classList.add("is-joy");
  setTimeout(() => el.classList.remove("is-joy"), 1050);
  burst(r.left + r.width / 2, r.top);
  if (!$(".bubble")) notice(msg);
}
const dialog = $("#detail");
let returnFocus;
function openDialog(html) {
  returnFocus = document.activeElement;
  $("#dialog-inner").innerHTML = html;
  if (!dialog.open) dialog.showModal();
  dialog.querySelector("button").focus();
}
function inspect(k) {
  const c = credentials[k];
  openDialog(
    '<span class="unit">' +
      (c ? "Builder credential" : "Vinyl decal") +
      '</span><div class="dialogart">' +
      art(k) +
      "</div><h2>" +
      nameOf(k).replaceAll(">", "&gt;") +
      '</h2><p class="dialogtext">' +
      (c ? c.track + " · " + c.text : "Builder Deck sticker collection.") +
      "</p>" +
      (c?.serial ? '<code class="serial">ID: ' + c.serial + "</code>" : ""),
  );
}
function help() {
  openDialog(
    '<span class="unit">Builder terminal</span><h2>Commands</h2>' +
      Object.entries(commands)
        .map(
          ([k, desc]) =>
            '<button class="cmdrow" data-command="' +
            k +
            '"><code>/' +
            k +
            "</code><small>" +
            desc +
            "</small></button>",
        )
        .join(""),
  );
}
function runCmd(k) {
  if (prefixes.includes(k)) {
    selectEngine(k);
    $("#query")?.focus();
    notice("/" + k + " mode");
    return;
  }
  if (k === "help") help();
  else if (k === "theme") toggleTheme();
  else if (k === "pet") playPet();
  else if (k === "confetti") {
    burst(0, 0, 65, true);
    notice("Build shipped!");
  } else notice("Unknown command. Try /help.");
}
function search(e) {
  e.preventDefault();
  const el = $("#query");
  let term = el.value.trim();
  let provider = engine;
  if (!term) {
    help();
    return;
  }
  if (term.startsWith("/")) {
    const first = term.split(/\s+/, 1)[0],
      cmd = first.slice(1).toLowerCase(),
      rest = term.slice(first.length).trim();
    if (!prefixes.includes(cmd) || !rest) {
      if (commands[cmd]) el.value = draft = "";
      runCmd(cmd);
      return;
    }
    provider = cmd;
    selectEngine(cmd);
    term = rest;
  }
  const q = encodeURIComponent(term);
  let url = hosts[provider] + q;
  window.open(url, "_blank", "noopener,noreferrer");
  setState("idle");
}
function boxClamp(el, x, y, angle) {
  const board = $(".board"),
    r = (angle * Math.PI) / 180;
  const padX = Math.min(
    48,
    ((Math.abs(el.offsetWidth * Math.cos(r)) +
      Math.abs(el.offsetHeight * Math.sin(r))) *
      50) /
      board.clientWidth,
  );
  const padY = Math.min(
    48,
    ((Math.abs(el.offsetHeight * Math.cos(r)) +
      Math.abs(el.offsetWidth * Math.sin(r))) *
      50) /
      board.clientHeight,
  );
  return [
    Math.max(padX, Math.min(100 - padX, x)),
    Math.max(padY, Math.min(100 - padY, y)),
    angle % 360,
  ];
}
function rotate(el, amount) {
  let [x, y, a] = positions[el.dataset.id];
  positions[el.dataset.id] = boxClamp(el, x, y, a + amount);
  position(el);
  savePositions();
}
document.addEventListener("pointerdown", (e) => {
  const el = e.target.closest(".move");
  if (!el || e.button !== 0) return;
  drag = {
    el,
    id: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    p: [...positions[el.dataset.id]],
    moved: false,
  };
  el.setPointerCapture(e.pointerId);
});
document.addEventListener("pointermove", (e) => {
  if (!drag || drag.id !== e.pointerId) return;
  const dx = e.clientX - drag.startX,
    dy = e.clientY - drag.startY;
  if (!drag.moved && Math.hypot(dx, dy) < 4) return;
  drag.moved = true;
  const el = drag.el,
    b = $(".board");
  el.classList.add("moving");
  positions[el.dataset.id] = boxClamp(
    el,
    drag.p[0] + (100 * dx) / b.clientWidth,
    drag.p[1] + (100 * dy) / b.clientHeight,
    drag.p[2],
  );
  position(el);
});
let lastTouch = null;
function finishDrag(e) {
  if (!drag || drag.id !== e.pointerId) return;
  drag.el.classList.remove("moving");
  if (drag.moved) {
    savePositions();
    lastTouch = null;
  } else if (e.type === "pointerup" && e.pointerType === "touch") {
    const now = performance.now();
    if (lastTouch?.el === drag.el && now - lastTouch.time < 420) {
      rotate(drag.el, 15);
      drag.el.dataset.lastTouchRotate = String(now);
      lastTouch = null;
    } else lastTouch = { el: drag.el, time: now };
  }
  drag = null;
}
document.addEventListener("pointerup", finishDrag);
document.addEventListener("pointercancel", finishDrag);
document.addEventListener("dblclick", (e) => {
  const el = e.target.closest(".move");
  if (el) {
    if (performance.now() - Number(el.dataset.lastTouchRotate || -1000) > 500)
      rotate(el, 15);
    e.preventDefault();
  }
});
document.addEventListener(
  "wheel",
  (e) => {
    const el = e.target.closest(".move");
    if (el) {
      e.preventDefault();
      rotate(el, Math.sign(e.deltaY) * 5);
    }
  },
  { passive: false },
);
function rearrange(shuffle) {
  positions = initialPositions();
  if (shuffle) {
    const entries = Object.entries(positions),
      slots = Object.values(positions).map((p) => [...p]);
    for (let i = slots.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
    entries.forEach(([k], i) => {
      const [x, y] = slots[i];
      positions[k] = boxClamp(
        $('.sticker[data-id="' + k + '"]'),
        x,
        y,
        Math.round(Math.random() * 32 - 16),
      );
    });
  }
  $$(".sticker").forEach(position);
  savePositions();
  notice(shuffle ? "Canvas shuffled" : "Original arrangement restored");
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const d = b.dataset;
  if ("view" in d) changeView(d.view);
  else if ("pet" in d) playPet(b);
  else if ("help" in d) help();
  else if ("detail" in d) inspect(d.detail);
  else if ("id" in d && mode === "bomb") inspect(d.id);
  else if ("engine" in d) {
    selectEngine(d.engine);
    $("#query").focus();
  } else if ("command" in d) {
    dialog.close();
    runCmd(d.command);
  } else if ("close" in d) dialog.close();
  else if ("trigger" in d) {
    if (d.trigger === "pet") playPet($(".playground .pet"));
    else setState(d.trigger);
  } else if ("copy" in d) copyCSS(b);
  else if ("shuffle" in d) rearrange(true);
  else if ("reset" in d) rearrange(false);
  else if (b.id === "appearance") toggleTheme();
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
dialog.addEventListener("close", () => {
  if (
    returnFocus?.isConnected &&
    !dialog.open &&
    document.activeElement === document.body
  )
    returnFocus.focus();
});
document.addEventListener("submit", (e) => {
  if (e.target.id === "search") search(e);
});
document.addEventListener("input", (e) => {
  if (e.target.id === "query") {
    draft = e.target.value;
    setState(draft ? "typing" : "idle");
  }
});
document.addEventListener("pointerover", (e) => {
  const p = e.target.closest("[data-pet]");
  if (p && !p.contains(e.relatedTarget) && state === "idle")
    setState(
      "hover",
      p.dataset.pet === "cat" ? "solana rpc healthy" : "hello, builder!",
    );
});
document.addEventListener("keydown", (e) => {
  if (dialog.open || admin.open) return;
  const b = e.target.closest("[role=tab]");
  if (b && ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
    e.preventDefault();
    let i = views.findIndex((v) => v.id === mode);
    i =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? 5
          : (i + (e.key === "ArrowRight" ? 1 : 5)) % 6;
    changeView(views[i].id, true);
    return;
  }
  const el = e.target.closest(".move");
  if (
    el &&
    [
      "r",
      "R",
      "ArrowUp",
      "ArrowLeft",
      "ArrowRight",
      "ArrowDown",
      "Enter",
      " ",
    ].includes(e.key)
  ) {
    e.preventDefault();
    if (e.key === "Enter" || e.key === " ") {
      inspect(el.dataset.id);
      return;
    }
    if (e.key.toLowerCase() === "r") {
      rotate(el, e.shiftKey ? -15 : 15);
      return;
    }
    let [x, y, a] = positions[el.dataset.id];
    x += e.key === "ArrowRight" ? 2 : e.key === "ArrowLeft" ? -2 : 0;
    y += e.key === "ArrowDown" ? 2 : e.key === "ArrowUp" ? -2 : 0;
    positions[el.dataset.id] = boxClamp(el, x, y, a);
    position(el);
    savePositions();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (!$("#query")) changeView("hybrid");
    $("#query").focus();
    $("#query").select();
  } else if (
    e.key === "/" &&
    e.target.tagName !== "INPUT" &&
    !e.ctrlKey &&
    !e.metaKey &&
    $("#query")
  ) {
    e.preventDefault();
    $("#query").focus();
    $("#query").value = draft = "/";
    setState("typing");
  }
});
compact.addEventListener("change", () => {
  if (base[mode]) render();
});
document.querySelector('[data-icon="brand"]').innerHTML = icon("brand");
$("#dock").innerHTML = views
  .map(
    (v) =>
      '<button role="tab" id="tab-' +
      v.id +
      '" aria-controls="main" title="' +
      v.title +
      '" data-view="' +
      v.id +
      '">' +
      icon(v.icon) +
      "<span>" +
      v.short +
      "</span></button>",
  )
  .join("");
$(".cat-lane").innerHTML = art("cat");
paintTheme(read("theme", "claude-code"));
changeView(mode);
const localTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Almaty",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
function tick() {
  $("#clock").textContent = localTime.format(new Date());
}
tick();
setInterval(tick, 10000);
