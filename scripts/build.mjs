import { writeMascots } from "./build-mascots.mjs";
import { overview } from "../src/portfolio/view.js";
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
await writeFile(index, html.replace("<!--public-portfolio-->", () => `<template shadowrootmode="open">${overview}</template>`));

const [template, mascot] = await Promise.all([
  readFile(new URL("scripts/readme-cover.template.svg", root), "utf8"),
  readFile(new URL("assets/proof-hub-mascot.svg", root), "utf8"),
]);
const cover = template.replace("<!--@mascot-->", () => mascot.trim());
await mkdir(new URL("docs/", root), { recursive: true });
await writeFile(new URL("docs/readme-cover.svg", root), cover.replaceAll("\r\n", "\n"));
