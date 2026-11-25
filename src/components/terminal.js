import { icon } from "./icons.js";
import { prefixes } from "../data/search.js";
import { badgeOrder, trophies } from "../data/profile.js";
import { shortcutRow } from "./shortcuts.js";
import { stickers } from "./stickers.js";

export function workspace(theme) {
  const badges = badgeOrder
    .map((id) => {
      const t = trophies.find((item) => item.id === id);
      return `<button class="badge" data-trophy="${id}"><i style="color:${t.color}">${t.mark}</i>${t.name}</button>`;
    })
    .join("");
  return `<div class="board hybrid"><div class="canvas-corners" aria-hidden="true"></div>${stickers()}
    <div class="hero">
      <div class="eyebrow">${theme.eyebrow}</div>
      <h1>${theme.greeting}</h1>
      <p class="subtitle">Full-Stack Software Engineer <span>·</span> Pavlodar, KZ</p>
      <div class="command-stack"><div id="perch"></div>
        <div class="terminal"><form id="search"><label class="prompt" for="query">❯</label>
          <input id="query" aria-label="Search or enter a command" placeholder="Search the web, or type /help..." autocomplete="off" spellcheck="false">
          <button class="submit" aria-label="Run search or command">${icon("enter")}</button></form>
          <div class="engines">${prefixes.map((k) => `<button data-engine="${k}">/${k}</button>`).join("")}<button data-help>/help</button></div>
        </div>
      </div>
      ${shortcutRow()}
      <div class="verified-heading">${icon("check")} Verified Builder Deck</div>
      <div class="badges" aria-label="Achievements">${badges}</div>
    </div></div>`;
}
