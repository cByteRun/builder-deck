import { writeMascots } from "./build-mascots.mjs";
import { portfolioView } from "../src/portfolio/view.js";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);
await mkdir(dist, { recursive: true });
for (const entry of ["index.html", "assets", "src"]) {
  await cp(new URL(entry, root), new URL(entry, dist), { recursive: true });
}
await writeMascots(new URL("assets/achievement-pets.svg", dist));
const index = new URL("index.html", dist);
const html = await readFile(index, "utf8");
await writeFile(index, html.replace("<!--public-portfolio-->", () => portfolioView()));
