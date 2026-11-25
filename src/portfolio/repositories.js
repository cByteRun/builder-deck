import { read, write } from "../lib/storage.js";
import { links } from "./catalog.js";

function validRepo(repo) {
  return repo && typeof repo.name === "string" && /^[\w.-]+$/.test(repo.name) &&
    repo.html_url?.toLowerCase() === (links.github + "/" + repo.name).toLowerCase() && !repo.fork && !repo.private;
}

export async function loadRepositories(update) {
  const cache = read("portfolio.repos", null);
  if (Array.isArray(cache?.rows)) {
    update(cache.rows.filter(validRepo));
    if (Date.now() - cache.time < 600000) return;
  }
  try {
    const response = await fetch(links.publicProjects, { signal: AbortSignal.timeout(6500) });
    if (!response.ok) return;
    const payload = await response.json();
    if (!Array.isArray(payload)) return;
    const rows = payload.filter(validRepo).map(({ name, html_url, description, language, homepage }) =>
      ({ name, html_url, description, language, homepage }));
    write("portfolio.repos", { time: Date.now(), rows });
    update(rows);
  } catch { /* The original curated cases remain available offline. */ }
}
