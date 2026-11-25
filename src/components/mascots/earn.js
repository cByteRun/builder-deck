import { createElement } from "react";
import { PixelSprite } from "./pixel-sprite.js";

const palette = {"D":"#312a49","M":"#5a508e","A":"#edbb62","L":"#c4bcff","W":"#f6f0df"};
const rows = [
  "........A.....A",
  "........DA...AD",
  "..DDD....DWWWD....DDD",
  ".DLLMDD..DWWWD..DDMLLD",
  "DLLLLMMD.DWDWD.DMMLLLLD",
  "DLLWWLLMDDAAADDMLLWWLLD",
  ".DLLWLLMMDAAADMMLLWLLD",
  "..DMLLMLMDWWWDMLMLLMD",
  "...DMMMMMDAAWDMMMMMD",
  "....DDLLMDWAADMLLDD",
  "...DMMLLMDWWWDMLLMMD",
  "..DMLLWLLDAAADMLWLLMD",
  "..DLLLLMDAWWAADMLLLLD",
  "...DMMMD.DAAAD.DMMMD",
  "....DDD...DDD...DDD",
];

export function CourierMoth() {
  return createElement(PixelSprite, { rows, palette });
}
