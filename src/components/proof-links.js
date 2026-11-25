import { icon } from "./icons.js";

import { earnUrl, trophies } from "../data/profile.js";
import { brandMark } from "./achievement-art.js";
export const platforms = [
  [
    "github",
    "#E6EDF3",
    "GitHub",
    "@cByteRun · code",
    "https://github.com/cByteRun",
  ],
  ["superteam", "#8B7CF6", "Superteam Earn", "$250+ won · bounties", earnUrl],
  [
    "astana",
    "#4FD1C5",
    "Astana Hub",
    "ecosystem · hackathons",
    "https://astanahub.com/account/v2/user/688521/profile/activity/",
  ],
  [
    "linkedin",
    "#60A5FA",
    "LinkedIn",
    "5y exp · career",
    "https://www.linkedin.com/in/daniil-tkachev-2b2970363/",
  ],
  [
    "x",
    "#E5E5E5",
    "X / Twitter",
    "@Den4kD77967 · build in public",
    "https://x.com/Den4kD77967",
  ],
  [
    "instagram",
    "#F472B6",
    "Instagram",
    "@tkachevd228 · events & life",
    "https://www.instagram.com/tkachevd228/",
  ],
];

export function profileCards() {
  const cards = platforms.map(
    ([id, color, name, detail, url]) =>
      `<a style="--brand:${color}" href="${url}" target="_blank" rel="noopener noreferrer">${icon(id)}<span><strong>${name}</strong><small>${detail}</small></span></a>`,
  );
  return `<nav class="proof-links" aria-label="Social and professional profiles">${cards.join("")}</nav>`;
}

function winBadge(trophy) {
  const { id, name, tickerName, milestone, color } = trophy;
  const url = id === "earn" ? earnUrl : "#award-" + id;
  const external = id === "earn" ? 'target="_blank" rel="noopener noreferrer"' : "";
  return `<a style="--event-hue:${color}" href="${url}" ${external}>${brandMark(id)}
    <span><strong>${tickerName || name}</strong> <span class="win-separator">·</span> ${milestone}</span></a>`;
}

export function mountWins() {
  const viewport = document.getElementById("wins-window");
  const track = document.getElementById("wins-track");
  const sequence = document.createElement("div");
  sequence.className = "win-sequence";
  sequence.innerHTML = trophies.map(winBadge).join("");
  track.append(sequence);
  // Repeat whole sequences so the seam stays offscreen even on ultrawide displays.
  function fit() {
    const width = sequence.getBoundingClientRect().width;
    if (!width) return;
    track.style.setProperty("--cycle", width + "px");
    const count = Math.ceil(viewport.clientWidth / width) + 1;
    while (track.children.length > count) track.lastElementChild.remove();
    while (track.children.length < count) {
      const copy = /** @type {HTMLElement} */ (sequence.cloneNode(true));
      copy.setAttribute("aria-hidden", "true");
      for (const link of copy.querySelectorAll("a")) link.tabIndex = -1;
      track.append(copy);
    }
  }
  const observer = new ResizeObserver(fit);
  observer.observe(viewport);
  observer.observe(sequence);
  fit();
}
