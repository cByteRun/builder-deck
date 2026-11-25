import { cp, mkdir } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);
await mkdir(dist, { recursive: true });
for (const entry of ["index.html", "assets", "src"]) {
  await cp(new URL(entry, root), new URL(entry, dist), { recursive: true });
}
