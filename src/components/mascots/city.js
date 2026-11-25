import { createElement } from "react";
import { PixelSprite } from "./pixel-sprite.js";

const palette = {"D":"#1c3531","M":"#336656","A":"#edaa62","L":"#a6e7cb","W":"#fcf1d5"};
const rows = [
  "...LD............DL",
  "...LMD..........DML",
  "...DMLDDDDDDDDDDLMD",
  "....DMMLLLLLLLLMMD",
  "...DMWWWWMLLMWWWWMD",
  "..DMWWDDWWMMWWDDWWMD",
  "..DMWWDLWWAAWWLDWWMD",
  "...DMLWWMDAADMWWLMD",
  "..DLMMLLLLAALLLLMMLD",
  ".DLMDMMLLLLLLLLMMDMLD",
  "DLMMDMMLLMMMMLLMMDMMLD",
  ".DLMDMMMLLLLLMMMDMLD",
  "..DLDMMMLMMMLMMMDLD",
  "...DDMMMMMLLMMMMDD",
  "......DDMMMMMMDD",
  ".......AAADDAAA",
];

export function LayerOwl() {
  return createElement(PixelSprite, { rows, palette });
}
