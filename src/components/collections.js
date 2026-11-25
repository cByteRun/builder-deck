import { art, icon } from "./icons.js";
import { pet } from "./terminal.js";
import { credentials, decals, nameOf } from "../data/profile.js";
function pagehead(k, title, desc) {
  return (
    '<div class="pagehead"><div class="eyebrow">' +
    icon(k) +
    " " +
    (k === "shelf" ? "Personal collection" : "Developer studio") +
    "</div><h1>" +
    title +
    "</h1><p>" +
    desc +
    "</p></div>"
  );
}
function shelf() {
  return (
    '<section class="page">' +
    pagehead(
      "shelf",
      "Builder <em>trophy shelf.</em>",
      "Daniil Tkachev’s hackathon credentials and engineering tracks.",
    ) +
    '<div class="shelf">' +
    Object.entries(credentials)
      .map(
        ([k, c]) =>
          '<button class="tile" data-detail="' +
          k +
          '"><div class="displayart">' +
          art(k) +
          '</div><div class="tileinfo"><span class="unit">' +
          c.track +
          "</span><h2>" +
          c.name +
          "</h2><p>" +
          c.text +
          "</p>" +
          (c.serial ? '<span class="serial">' + c.serial + "</span>" : "") +
          "</div></button>",
      )
      .join("") +
    "</div></section>"
  );
}
const swatches = [
  "accent-hover",
  "surface-raised",
  "bg-primary",
  "bg-secondary",
  "bg-card",
  "text-primary",
  "text-secondary",
  "border-subtle",
  "accent-terracotta",
  "accent-terracotta-soft",
  "accent-solana-purple",
  "accent-solana-green",
  "accent-kazakh-gold",
  "accent-kazakh-cyan",
];
function tokens() {
  return (
    '<section class="page">' +
    pagehead(
      "tokens",
      "Tokens <em>& sprites.</em>",
      "The palette, type and pixel art behind Builder Deck.",
    ) +
    '<div class="sectionhead"><h2>Color system</h2><span class="unit">' +
    document.documentElement.dataset.theme +
    ' theme</span></div><div class="palette">' +
    swatches
      .map(
        (x) =>
          '<div class="swatch"><i style="background:var(--' +
          x +
          ')"></i><b>' +
          x.replace(/^accent-/, "") +
          "</b><small>" +
          getComputedStyle(document.documentElement)
            .getPropertyValue("--" + x)
            .trim() +
          "</small></div>",
      )
      .join("") +
    '</div><div class="sectionhead"><h2>Typography</h2></div><div class="types">' +
    [
      ["Instrument Serif", "Builder Deck", 36],
      ["Inter", "Interface", 22],
      ["JetBrains Mono", "> terminal", 16],
      ["Silkscreen", "PIXELS", 14],
    ]
      .map(
        ([f, t, n]) =>
          "<span><b style=\"font-family:'" +
          f +
          "';font-size:" +
          n +
          'px">' +
          t +
          "</b><small>" +
          f +
          " · " +
          n +
          " px</small></span>",
      )
      .join("") +
    '</div><div class="sectionhead"><h2>Companions</h2><span class="unit" id="labstate">idle</span></div><div class="playground">' +
    pet() +
    pet("cat") +
    '<span class="bubble">ready to vibe code, Daniil...</span><div class="petcontrols">' +
    ["idle", "typing", "pet", "hover"]
      .map(
        (x) =>
          '<button class="tool" data-trigger="' + x + '">' + x + "</button>",
      )
      .join("") +
    '</div></div><div class="sectionhead"><h2>Sticker sheet</h2></div><div class="gallery">' +
    Object.keys({ ...credentials, ...decals })
      .map(
        (k) =>
          '<button class="specimen" data-detail="' +
          k +
          '">' +
          art(k) +
          "<small>" +
          nameOf(k).replaceAll(">", "&gt;") +
          "</small></button>",
      )
      .join("") +
    "</div></section>"
  );
}

export { pagehead, shelf, tokens };
