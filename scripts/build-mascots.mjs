import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFile } from "node:fs/promises";
import { Axolotl } from "../src/components/mascots/hack.js";
import { LayerOwl } from "../src/components/mascots/city.js";
import { MarketFox } from "../src/components/mascots/sol.js";
import { CourierMoth } from "../src/components/mascots/earn.js";
import { ConsoleGecko } from "../src/components/mascots/decent.js";
import { OrbitCrane } from "../src/components/mascots/sana.js";
import { BalloonPenguin } from "../src/components/mascots/icpc.js";
import { trophies } from "../src/data/profile.js";

const characters = { hack: Axolotl, city: LayerOwl, sol: MarketFox, earn: CourierMoth, decent: ConsoleGecko, sana: OrbitCrane, icpc: BalloonPenguin };
export async function writeMascots(destination) {
  const symbols = trophies.map(({ id }) => {
    if (!characters[id]) throw new Error("Missing mascot for " + id);
    return createElement("symbol", { key: id, id, viewBox: "0 0 28 24" }, createElement(characters[id]));
  });
  const sheet = createElement("svg", { xmlns: "http://www.w3.org/2000/svg" }, symbols);
  await writeFile(destination, renderToStaticMarkup(sheet) + "\n");
}
