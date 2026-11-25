import { icon } from "./icons.js";

const earnUrl = "https://superteam.fun/earn/t/protective-fuchsia-78";
const platforms = [
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

const wins = [
  ["shelf", "AI Fest · CityCom · 1st place", "#award-city"],
  ["layers", "Colosseum × KASE · 4th place", "#award-sol"],
  ["check", "HackAlem AI · Guinness World Record participant", "#award-hack"],
  ["superteam", "Superteam Earn · $250+ earned", earnUrl],
  ["astana", "Decentrathon 6.0 · 19-city event", "#award-decent"],
  ["check", "AI-SANA · Stage 2", "#award-sana"],
  ["terminal", "ICPC Kazakhstan 2025 · Regional contestant", "#award-icpc"],
];

export function mountWins() {
  const viewport = document.getElementById("wins-window");
  const track = document.getElementById("wins-track");
  const sequence = document.createElement("div");
  sequence.className = "win-sequence";
  sequence.innerHTML = wins
    .map(
      ([mark, label, url]) =>
        `<a href="${url}" ${url === earnUrl ? 'target="_blank" rel="noopener noreferrer"' : ""}>${icon(mark)}${label}</a>`,
    )
    .join("");
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
