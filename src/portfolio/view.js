import { achievements, products } from "./catalog.js";
import { escapeHtml as esc, translate } from "./locale.js";
import { icon } from "../components/icons.js";

export const filters = ["All", "Wins", "Code", "Media"];
const metrics = [["$250+", "Earned"], ["Top 1", "AI Fest"], ["5y", "Years of experience"], ["19", "Cities", "Decentrathon"]];
const positioning = "Building B2B SaaS, AI agents & Web3. Open to founding engineer and product roles.";
const external = 'target="_blank" rel="noopener noreferrer"';

export function productCard(item, lang, homepage = "") {
  const t = key => esc(translate(key, lang));
  const site = item.demo || homepage;
  return `<div class="case-visual" data-accent="${item.accent}">
    <span class="hub-label">${t("Featured product")}</span>
    <h2>${esc(item.tab)}<em>.</em></h2>
    <img src="./assets/portfolio/${item.id}.svg" width="400" height="222" alt="">
  </div><div class="case-body"><p class="case-category">${t(item.category)}</p>
    <div class="case-award">${icon("shelf")} ${t(item.badge)}</div>
    <p>${t(item.summary)}</p><ul class="tech-stack">${item.stack.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
    <div class="hub-actions"><a class="primary-link" href="${esc(item.repo)}" ${external}>${icon("github")} ${t("View source")} ↗</a>
    <a href="${esc(site || item.docs)}" ${external}>${t(site ? "Project site" : item.secondary)} ↗</a></div></div>`;
}

export function codeRows(repos = []) {
  if (repos.length) return repos.slice(0, 6).map(r => ({
    title: r.name, category: "Code", platform: "github", metric: r.language || "GitHub",
    summary: r.description || "Public repository", url: r.html_url,
  }));
  return products.map(p => ({ title: p.tab, category: "Code", platform: "github", metric: p.stack[0], summary: p.summary, url: p.repo }));
}

export function activityRows(lang, filter, repos = []) {
  const code = codeRows(repos);
  const wins = achievements.filter(row => row.category === "Wins");
  const media = achievements.filter(row => row.category === "Media");
  const rows = [wins[0], ...code.slice(0,1), wins[1], media[0],
    ...code.slice(1), ...wins.slice(2), ...media.slice(1)];
  const t = value => esc(translate(value, lang));
  return rows.filter(r => filter === "All" || filter === r.category).map(r =>
    `<a class="evidence-row" href="${esc(r.url)}" ${external}>
      <span class="evidence-icon">${icon(r.platform)}</span><span><strong>${t(r.title)}</strong><small>${t(r.summary)}</small></span>
      <span class="evidence-result">${t(r.metric)} ↗</span></a>`).join("");
}

export function portfolioView(lang = "en", item = products[0], filter = "All", repos = [], homepage = "") {
  const t = value => esc(translate(value, lang));
  return `<div class="hub-wrap"><div class="hub-lead"><section class="hub-intro">
    <div class="hub-signature"><img src="./assets/proof-hub-mascot.svg" width="42" height="42" alt=""><span class="hub-label">${t("Proof of Work Hub")}</span></div>
    <h1>${t("Daniil")}<br><em>${t("Tkachev.")}</em></h1>
    <p class="hub-role">${t("Founder & Full-Stack Engineer")} <span>·</span> ${t("Pavlodar, KZ")}</p>
    <p class="hub-position">${t(positioning)}</p>
    <div class="ask-card"><h2>${t("Ask your AI")}</h2><p>${t("Which part of your B2B product could Daniil take on? Explore two decisions from his projects, how he works with AI, and examples of how to verify a delivery.")}</p>
    <div class="hub-actions"><button data-ai="claude">Claude ↗</button><button data-ai="chatgpt">ChatGPT ↗</button>
      <button data-dossier>${icon("copy")} ${t("Copy AI dossier")}</button></div></div>
    </section><article class="case-file"><div class="case-tabs" role="tablist" aria-label="${t("Product cases")}">
    ${products.map(p => `<button role="tab" data-case="${p.id}" id="case-tab-${p.id}" aria-controls="case-panel" tabindex="${p===item?0:-1}" aria-selected="${p===item}">${esc(p.tab)}</button>`).join("")}
    </div><div id="case-panel" role="tabpanel" aria-labelledby="case-tab-${item.id}">${productCard(item, lang, homepage)}</div></article></div>
    <section class="hub-evidence"><div class="hub-stats">${metrics.map(([n,label,context]) =>
      `<div><strong>${n}</strong><span>${t(label)}${context ? " · "+context : ""}</span></div>`).join("")}</div>
    <div class="evidence-head"><h2>${t("Recent projects & wins")}</h2><div class="hub-filters" role="group" aria-label="${t("Filter feed")}">
    ${filters.map(f => `<button data-filter="${f}" aria-pressed="${f===filter}">${t(f)}</button>`).join("")}</div></div>
    <div class="evidence-list">${activityRows(lang,filter,repos)}</div></section></div>`;
}
