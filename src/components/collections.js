import { trophies, portfolioUrl } from "../data/profile.js";
import { icon, art } from "./icons.js";
function trophyArt(t) {
  if (["hack", "sol", "decent"].includes(t.id)) return art(t.id);
  return `<svg viewBox="0 0 70 70" class="medal" aria-hidden="true"><path d="m17 36 10 2 8 8-11 20-3-9-11 2zm36 0-10 2-8 8 11 20 3-9 11 2z" fill="currentColor" opacity=".65"/><path d="m35 4 6 3 7 1 4 6 6 4v7l3 6-4 6-2 6-7 3-5 5-8-1-7 1-6-5-7-3-2-6-4-6 3-6v-7l6-4 4-6 7-1z" fill="currentColor"/><circle cx="35" cy="27" r="16" fill="#27221f"/><text x="35" y="33" text-anchor="middle" font-family="monospace" font-size="18" fill="currentColor">${t.mark}</text></svg>`;
}
export function shelf() {
  return `<div class="shelf-inner"><div class="shelf-head"><h1>Trophy <em>Shelf.</em></h1><div id="shelf-perch"></div></div>
    <div class="trophy-grid">${trophies
      .map(
        (
          t,
        ) => `<details class="trophy" id="award-${t.id}" style="--shade:${t.color}"><summary>
      <span class="trophy-art">${trophyArt(t)}</span><span class="award-copy"><strong>${t.name}</strong><span>${t.result}</span></span>
      <span class="expand" aria-hidden="true">+</span></summary><p>${t.detail}</p></details>`,
      )
      .join("")}</div>
    <article class="portfolio"><div class="orbit" aria-hidden="true"><svg viewBox="0 0 200 200" fill="none" stroke="currentColor"><g transform="rotate(-24 100 100)"><circle cx="100" cy="100" r="73"/><ellipse cx="100" cy="100" rx="34" ry="73"/><ellipse cx="100" cy="100" rx="59" ry="73"/><ellipse cx="100" cy="100" rx="73" ry="23"/><path d="M27 100h146m-73-73v146"/><ellipse cx="100" cy="100" rx="97" ry="18" transform="rotate(-16 100 100)" stroke-width="2"/></g></svg></div>
    <div class="folio-content"><span class="eyebrow">Public portfolio</span><h2>Proof of <em>Work Hub.</em></h2>
    <p>Recorda · $250+ earned · 1st at AI Fest · 5 years of experience</p>
    <p>GitHub activity and the “Ask AI about me” dossier.</p>
    <div class="folio-actions">${portfolioUrl ? `<a class="portfolio-link" href="${portfolioUrl}" target="_blank" rel="noopener"><img src="./assets/proof-hub-mascot.svg" width="32" height="32" alt="">Open portfolio ↗</a><button data-copy>${icon("copy")} Copy link</button>` : '<span class="coming"><i></i> Portfolio coming soon</span><a class="github" href="https://github.com/cByteRun" target="_blank" rel="noopener">View GitHub ↗</a>'}</div></div></article></div>`;
}
