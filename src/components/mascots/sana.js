import { createElement } from "react";
import { PixelSprite } from "./pixel-sprite.js";

const palette = {"D":"#243551","M":"#385584","A":"#e6be82","L":"#abd9fa","W":"#eaf6ff"};
const rows = [
  "...L.................",
  "....M..L......DDDDD",
  ".....M..M....DLWWWLD",
  ".......M..M..DWWWDWDAAAA",
  "............DWWWLDD...AA",
  "...........DWWWLD",
  "..........DWWWLD",
  ".........DWWWLD",
  "..L.....DWWWLD",
  "..LLLDDDLLWLD",
  "...DWWWLLLWWD",
  "....DWWWLWWWLD",
  "....DDLLLWWWLD",
  "...DMMLLLLWWD",
  "..DMMMDLLLDD",
  ".DMMMD.DDDD",
  "..DDD...A.A",
  "........A..A",
  ".......AA...AA",
];

export function OrbitCrane() {
  return createElement(PixelSprite, { rows, palette });
}
