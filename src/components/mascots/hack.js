import { createElement } from "react";
import { PixelSprite } from "./pixel-sprite.js";

const palette = {"D":"#183144","M":"#216e9d","A":"#009af0","L":"#8ae1ff","W":"#e9f7ff"};
const rows = [
  "..A.................A",
  "..LA...DDDDDDD.....AL",
  "A..LA.DMMMMMMMD...ALA",
  "LA..DDMMMMLLMMMD.DALA",
  ".ALLDMLLLLLLLLMMDLLA",
  "A..DMLLWWLLLLWWLMD..A",
  ".LLDMLLWDDLLDDWLMDLA",
  "...DMLAAAALLAAAALD",
  "....DMLLLLLLLLLMD",
  ".....DDMMMDDMMDD",
  ".......DMMMMLD.....AL",
  "......DMMLLLLMD..DLLA",
  ".....DMDMLLLLMD.DMLD",
  ".....DLDMMMMMMDMMMD",
  "......D.DMDDMDDDDD",
  ".......ALL..LLA",
];

export function Axolotl() {
  return createElement(PixelSprite, { rows, palette });
}
