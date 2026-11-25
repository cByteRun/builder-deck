import { createElement } from "react";
import { PixelSprite } from "./pixel-sprite.js";

const palette = {"D":"#273121","M":"#53553e","A":"#b9a8ff","L":"#a9df27","W":"#eff7c4"};
const rows = [
  ".............DDD...DDD",
  "............DLWLD.DLWLD",
  "............DWDLLLDWDLD",
  ".............DLLLLLLLD",
  "..........DDDLLLDDLLD",
  ".......DDDMMLLLLLLLD",
  "......DMLLWAAAAAWMD",
  ".....DMLLLADDDDDAMD",
  "..D..DMLLLADWLLDAMD",
  ".DLD.DMLLLADDDDDAMD",
  ".DLD..DMLLAAAAAALMD",
  ".DMMD..DMLLAMAMLLMD",
  "..DMMLDDMMLLLLLMMD",
  "...DMMLLLMDDMMMMMD",
  "....DDMMMD..DLLD.DL",
  "......DDD...LL.L.LL",
];

export function ConsoleGecko() {
  return createElement(PixelSprite, { rows, palette });
}
