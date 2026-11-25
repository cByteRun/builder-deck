import { art, icon } from "./icons.js";
import { prefixes } from "../data/search.js";
import { credentials } from "../data/profile.js";
function pet(kind = "crab") {
  return (
    '<button class="pet" data-pet="' +
    kind +
    '" aria-label="Pet ' +
    (kind === "crab" ? "Claude the crab" : "Codex the cat") +
    '">' +
    art(kind) +
    "</button>"
  );
}
function terminal() {
  return (
    '<div class="terminal"><div class="companion">' +
    pet() +
    '<span class="bubble">ready to vibe code, Daniil...</span></div><form id="search"><label class="prompt" for="query">❯</label><input id="query" autocomplete="off" spellcheck="false" aria-label="Search or enter a slash command"><button class="submit" title="Run search or command" aria-label="Run search or command">' +
    icon("enter") +
    '</button></form><div class="engines">' +
    prefixes
      .map(
        (x) =>
          '<button class="engine" data-engine="' + x + '">/' + x + "</button>",
      )
      .join("") +
    '<button class="helpkey" title="Command palette" data-help>/help</button></div></div>'
  );
}
function pills() {
  return (
    '<div class="deck"><div class="rule">' +
    icon("check") +
    'Verified Builder Deck</div><div class="creds">' +
    Object.entries(credentials)
      .map(
        ([k, c]) =>
          '<button class="cred" data-detail="' +
          k +
          '"><i style="--shade:' +
          c.color +
          '">' +
          c.mark +
          "</i>" +
          c.name +
          "</button>",
      )
      .join("") +
    "</div></div>"
  );
}

export { pet, terminal, pills };
