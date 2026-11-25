import { createElement } from "react";
import { PixelSprite } from "./pixel-sprite.js";

const palette = {"D":"#25322d","M":"#476555","A":"#efb777","L":"#abe34c","W":"#f5edce"};
const rows = [
  "..DD............DD",
  "..DLD..........DLD",
  "..DMLD........DLMD",
  "..DMAMD......DMAMD",
  "...DMAMDDDDDDMAMD",
  "...DMMMLLLLLLMMMD",
  "..DMLLLLLLLLLLLLMD",
  "..DMMDDDDDDDDDDMMD",
  "...DDDLLLDMLLDDDD",
  "....DWWWWMMWWWWD...LLD",
  ".....DWWWDDAWWD...DWLMD",
  "......DDWWWWDD...DWWMD",
  ".......DLLLMD...DMMMD",
  "......DMLLMMD..DMMMD",
  ".....DMDMLLLMDDMMMD",
  ".....DMDMMLLMDDMMD",
  "......DDMMDMMDDDD",
  ".......AA..AA",
];

export function MarketFox() {
  return createElement(PixelSprite, { rows, palette });
}
