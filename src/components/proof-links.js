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
  {
    name: "HackAlem AI",
    result: "Guinness World Record participant",
    url: "#award-hack",
    hue: "#22C55E",
    // Nur Alem sphere, observation spire and stepped plinth.
    glyph:
      "M6 0h2v2h2v1h1v2h1v3h-1v1h-1v1H8v1h2v1h2v2H2v-2h2v-1h2v-1H4V9H3V8H2V5h1V3h1V2h2z M5 4v1H4v2h1V5h2V4z",
  },
  {
    name: "AI Fest · CityCom",
    result: "1st place",
    url: "#award-city",
    hue: "#EAB308",
    // Three-point crown with a separate gold band.
    glyph: "M1 3h2v2h1v1h1V4h1V2h2v2h1v2h1V5h1V3h2v5h-1v2H2V8H1z M2 11h10v2H2z",
  },
  {
    name: "Colosseum × KASE",
    result: "4th place",
    url: "#award-sol",
    hue: "#38BDF8",
    glyph:
      "M6 1h2v1h2v1h2v1h1v1H1V4h1V3h2V2h2z M2 6h2v5H2z M6 6h2v5H6z M10 6h2v5h-2z M1 12h12v1H1z",
  },
  {
    name: "Superteam Earn",
    result: "$250+ earned",
    url: earnUrl,
    hue: "#F59E0B",
    // Stepped coin edge with a lightning-shaped cutout.
    glyph:
      "M4 1h6v1h2v2h1v6h-1v2h-2v1H4v-1H2v-2H1V4h1V2h2z M7 3 4 8h3l-1 3 4-5H7l2-3z",
  },
  {
    name: "Decentrathon 6.0",
    result: "19-city event",
    url: "#award-decent",
    hue: "#A855F7",
    glyph: "M5 1h4v4H8v2h4v2h2v4H9V9h2V8H3v1h2v4H0V9h2V7h4V5H5z",
  },
  {
    name: "AI-SANA",
    result: "Stage 2",
    url: "#award-sana",
    hue: "#D97757",
    glyph:
      "M4 0h1v2h3V0h1v2h2v1h1v1h2v1h-2v3h2v1h-2v2h-1v1H9v2H8v-2H5v2H4v-2H3v-1H2V9H0V8h2V5H0V4h2V3h1V2h1z M7 4 6 6 4 7l2 1 1 2 1-2 2-1-2-1z",
  },
  {
    name: "ICPC Kazakhstan 2025",
    result: "Regional contestant",
    url: "#award-icpc",
    hue: "#EF4444",
    glyph:
      "M3 1h2v2H3v3H2v2h1v3h2v2H3v-1H2v-1H1V8H0V6h1V3h1V2h1z M9 1h2v1h1v1h1v3h1v2h-1v3h-1v1h-1v1H9v-2h2V8h1V6h-1V3H9z",
  },
];

function winBadge({ name, result, url, hue, glyph }) {
  const separator = ' <span class="win-separator">·</span> ';
  return `<a style="--event-hue:${hue}" href="${url}" ${url === earnUrl ? 'target="_blank" rel="noopener noreferrer"' : ""}>
    <svg class="win-mark" viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="${glyph}"/></svg>
    <span>${name.split(" · ").join(separator)}${separator}${result}</span></a>`;
}

export function mountWins() {
  const viewport = document.getElementById("wins-window");
  const track = document.getElementById("wins-track");
  const sequence = document.createElement("div");
  sequence.className = "win-sequence";
  sequence.innerHTML = wins.map(winBadge).join("");
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
