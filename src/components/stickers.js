import { art } from "./icons.js";
import { read, write } from "../lib/storage.js";
import { activeTheme } from "../themes/index.js";

const wide = {
  think: [22, 45, -5],
  hack: [14, 24, -13],
  sol: [86, 22, 12],
  decent: [13, 66, -9],
  coffee: [87, 65, 10],
  cli: [23, 88, 5],
  ship: [78, 86, -8],
};
const narrow = {
  think: [52, 3, -3],
  hack: [16, 9, -11],
  sol: [81, 9, 9],
  ship: [53, 13, 4],
  decent: [19, 86, -6],
  coffee: [80, 86, 7],
  cli: [50, 96, 2],
};
const names = {
  hack: "HackAlem AI",
  sol: "Colosseum × KASE",
  decent: "Decentrathon 6.0",
  think: "Thinking...",
  coffee: "Coffee",
  cli: "CLI flag",
  ship: "Ship it!",
};
export function stickers() {
  return Object.keys(wide)
    .map(
      (id) =>
        `<button class="sticker" data-id="${id}" aria-label="${names[id]} sticker. Arrow keys to move, R to rotate." title="${names[id]}">${art(id)}</button>`,
    )
    .join("");
}
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Choose the closest point in any perimeter strip that fits the rotated decal.
function project(board, hero, sticker, [x, y, angle]) {
  const bounds = board.getBoundingClientRect();
  const w = bounds.width,
    h = bounds.height;
  const rad = (angle * Math.PI) / 180,
    cos = Math.abs(Math.cos(rad)),
    sin = Math.abs(Math.sin(rad));
  const rx = (cos * sticker.offsetWidth + sin * sticker.offsetHeight) / 2 + 4;
  const ry = (sin * sticker.offsetWidth + cos * sticker.offsetHeight) / 2 + 4;
  const px = (x * w) / 100,
    py = (y * h) / 100;
  if (!hero) return [clamp(px, rx, w-rx)*100/w, clamp(py, ry, h-ry)*100/h, angle % 360];
  const core = hero.getBoundingClientRect();
  const strips = [
    [rx, ry, core.left - bounds.left - rx - 8, h - ry],
    [core.right - bounds.left + rx + 8, ry, w - rx, h - ry],
    [rx, ry, w - rx, core.top - bounds.top - ry - 8],
    [rx, core.bottom - bounds.top + ry + 8, w - rx, h - ry],
  ];
  let closest,
    distance = Infinity;
  for (const [left, top, right, bottom] of strips) {
    if (right < left || bottom < top) continue;
    const cx = clamp(px, left, right),
      cy = clamp(py, top, bottom);
    const d = Math.hypot(cx - px, cy - py);
    if (d < distance) {
      closest = [(cx * 100) / w, (cy * 100) / h, angle % 360];
      distance = d;
    }
  }
  return closest;
}
export function mountStickers(board, celebrate) {
  const hero = board.querySelector(".hero");
  const buttons = Array.from(board.querySelectorAll(".sticker"));
  const compact = matchMedia("(max-width:700px)");
  const tucked = matchMedia("(max-width:940px)");
  const canvas = board.id === "sticker-canvas";
  let key, saved, defaults, drag, lastTap, touchRotation;
  function refresh() {
    if (!board.clientWidth) return;
    const next =
      (canvas ? "public.stickerbomb." : activeTheme() + ".hybrid.") + (compact.matches ? "compact" : "wide");
    if (next !== key) {
      key = next;
      saved = read(key, {}) || {};
    }
    defaults = canvas ? canvasDefaults : tucked.matches ? narrow : wide;
    for (const el of buttons) paint(el, saved[el.dataset.id]);
  }
  function paint(el, p) {
    const valid =
      Array.isArray(p) && p.length === 3 && p.every(Number.isFinite);
    const point = project(board, hero, el, valid ? p : defaults[el.dataset.id]);
    el.style.visibility = point ? "" : "hidden";
    if (!point) return;
    el.style.left = point[0] + "%";
    el.style.top = point[1] + "%";
    el.style.setProperty("--r", point[2] + "deg");
    return point;
  }
  function current(el) {
    return [
      parseFloat(el.style.left),
      parseFloat(el.style.top),
      parseFloat(el.style.getPropertyValue("--r")),
    ];
  }
  function commit(el) {
    saved = { ...read(key, {}), [el.dataset.id]: current(el) };
    write(key, saved);
    celebrate();
  }
  function rotate(el) {
    const [x, y, a] = current(el);
    paint(el, [x, y, a + 15]);
    commit(el);
  }
  const events = new AbortController();
  const options = { signal: events.signal };
  for (const el of buttons) {
    el.addEventListener(
      "pointerdown",
      (e) => {
        if (e.button || drag) return;
        drag = {
          el,
          id: e.pointerId,
          x: e.clientX,
          y: e.clientY,
          start: current(el),
          moved: false,
        };
        el.setPointerCapture(e.pointerId);
      },
      options,
    );
    el.addEventListener(
      "pointermove",
      (e) => {
        if (drag?.el !== el || drag.id !== e.pointerId) return;
        const dx = e.clientX - drag.x,
          dy = e.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) < 4) return;
        drag.moved = true;
        const [x, y, a] = drag.start;
        paint(el, [
          x + (dx * 100) / board.clientWidth,
          y + (dy * 100) / board.clientHeight,
          a,
        ]);
      },
      options,
    );
    el.addEventListener(
      "pointerup",
      (e) => {
        if (drag?.id !== e.pointerId) return;
        if (drag.moved) {
          commit(el);
          lastTap = null;
        } else if (e.pointerType === "touch") {
          const now = performance.now();
          if (lastTap?.el === el && now - lastTap.time < 420) {
            rotate(el);
            touchRotation = { el, time: now };
            lastTap = null;
          } else lastTap = { el, time: now };
        }
        drag = null;
      },
      options,
    );
    el.addEventListener(
      "lostpointercapture",
      () => {
        if (drag?.el === el) {
          drag = null;
          refresh();
        }
      },
      options,
    );
    el.addEventListener(
      "dblclick",
      (e) => {
        if (
          e.pointerType !== "touch" &&
          !(
            touchRotation?.el === el &&
            performance.now() - touchRotation.time < 500
          )
        )
          rotate(el);
      },
      options,
    );
    el.addEventListener(
      "keydown",
      (e) => {
        const [x, y, a] = current(el);
        const delta = {
          ArrowLeft: [-2, 0],
          ArrowRight: [2, 0],
          ArrowUp: [0, -2],
          ArrowDown: [0, 2],
        }[e.key];
        if (delta) {
          e.preventDefault();
          paint(el, [x + delta[0], y + delta[1], a]);
          commit(el);
        } else if (["r", "R", "Enter", " "].includes(e.key)) {
          e.preventDefault();
          rotate(el);
        }
      },
      options,
    );
  }
  const observer = new ResizeObserver(refresh);
  observer.observe(board);
  if (hero) observer.observe(hero);
  if (canvas) document.getElementById("reset-stickers").addEventListener("click", () => {
    saved = {};
    write(key, saved);
    refresh();
  }, options);
  compact.addEventListener("change", refresh, options);
  tucked.addEventListener("change", refresh, options);
  refresh();
  return { refresh, destroy() { events.abort(); observer.disconnect(); } };
}


const canvasDefaults = {
  hack: [21, 29, -9], sol: [72, 25, 9], decent: [32, 73, -5],
  icpc: [76, 70, 6], ship: [50, 48, -7],
};

export function stickerCanvas(tr) {
  const sizes = {hack:[201,147], sol:[202,154], decent:[207,111], icpc:[186,55], ship:[127,55]};
  const decals = Object.keys(canvasDefaults).map(id => {
    const [w,h] = sizes[id];
    const label = {decent:"Decentrathon 4.0", icpc:"ICPC Kazakhstan"}[id] || names[id];
    return `<button class="sticker" data-id="${id}" aria-label="${label}"><svg class="art" aria-hidden="true" viewBox="0 0 ${w} ${h}"><use href="./assets/portfolio/decals.svg#art-${id}"/></svg></button>`;
  }).join("");
  return `<div class="hub-wrap"><div class="bomb-heading"><h1>Sticker<em>bomb.</em></h1>
    <button id="reset-stickers">${tr("Reset layout")}</button></div>
    <p class="bomb-hint">${tr("Drag to move. Double-click or press R to rotate. Arrow keys to nudge.")}</p>
    <div id="sticker-canvas">${decals}</div></div>`;
}
