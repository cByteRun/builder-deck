import { trophies } from "../data/profile.js";
import { brandMark, companion } from "./achievement-art.js";
import { translate } from "../portfolio/locale.js";
export function shelf(lang = "en") {
  const tr = key => translate(key, lang);
  return `<div class="shelf-inner"><div class="shelf-head"><h1>${lang === "en" ? "Trophy <em>Shelf.</em>" : tr("Trophy Shelf")}</h1><div id="shelf-perch"></div></div>
    <div class="trophy-grid">${trophies
      .map(
        (
          t,
        ) => `<details class="trophy" id="award-${t.id}" data-reaction="${t.reaction}" style="--shade:${t.color}"><summary>
      <span class="trophy-art">${companion(t)}</span><span class="award-copy"><strong>${brandMark(t.id)}${t.name}</strong><span>${tr(t.result)}</span></span>
      <span class="expand" aria-hidden="true">+</span></summary><p>${tr(t.detail)}${t.credential ? `<code class="credential-id">${t.credential}</code>` : ""}<span class="pet-caption">${t.pet} · ${tr(t.phrase)}</span></p></details>`,
      )
      .join("")}</div>
    <a class="shelf-home" href="/"><img src="./assets/proof-hub-mascot.svg" width="32" height="32" alt="">${tr("Open portfolio")} →</a>
    </div>`;
}
