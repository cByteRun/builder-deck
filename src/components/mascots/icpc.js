import { createElement } from "react";
import { PixelSprite } from "./pixel-sprite.js";

const palette = {"D":"#242e45","M":"#325686","A":"#fdba32","L":"#83b3e0","W":"#faf0d8","R":"#cd4c3e"};
const rows = [
  "................RRRR",
  "...............RRRRRR",
  "...............RWRRRR",
  "...............RWRRRR",
  ".......DDDDD....RRRR",
  "......DMMLLMD....RR",
  ".....DMMLLWMMD...R",
  ".....DWWWMWWWD...L",
  ".....DWDWWWDWD...L",
  ".....DWWAAWWWD..L",
  "......DWWAAWWD.L",
  ".....DMWWWWWMDL",
  "....DMMLWWWMMLD",
  "...DMMDWWWWDMLD",
  "..DMMMDWWWWWDMD",
  "...DDDWWWWWWWDD",
  ".....DMWWWWWMD",
  "......DMMMMMD",
  ".....AAADDAAA",
];

export function BalloonPenguin() {
  return createElement(PixelSprite, { rows, palette });
}
