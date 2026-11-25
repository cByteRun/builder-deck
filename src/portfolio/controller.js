import { products } from "./catalog.js";
import { PROMPTS, AI_PROVIDERS, buildAskAiUrl } from "./dossier.js";
import { escapeHtml as esc, translate } from "./locale.js";
import { activityRows, filters, portfolioView, productCard } from "./view.js";
import { loadRepositories } from "./repositories.js";
import { read, write } from "../lib/storage.js";
import { trophies } from "../data/profile.js";
import { platforms } from "../components/proof-links.js";

export function mountPortfolio({ dialog, showDialog, navigate, onLanguage }) {
  const panel = document.getElementById("hub");
  const picker = /** @type {HTMLSelectElement} */ (document.getElementById("site-language"));
  const saved = read("portfolio.language", "en");
  let lang = ["en", "ru", "kk"].includes(saved) ? saved : "en";
  let selected = products[0], filter = "All", repos = [], started = false;
  const t = text => translate(text, lang);
  const homepage = () => {
    const site = repos.find(r => r.html_url === selected.repo)?.homepage;
    return typeof site === "string" && /^https:\/\//i.test(site) ? site : "";
  };
  function paintFeed() {
    panel.querySelector(".evidence-list").innerHTML = activityRows(lang, filter, repos);
  }
  function paintCase() {
    for (const btn of panel.querySelectorAll("button[data-case]")) {
      const active = btn.getAttribute("data-case") === selected.id;
      btn.setAttribute("aria-selected", String(active));
      btn.setAttribute("tabindex", active ? "0" : "-1");
    }
    const target = panel.querySelector("#case-panel");
    target.setAttribute("aria-labelledby", "case-tab-" + selected.id);
    target.innerHTML = productCard(selected, lang, homepage());
  }
  function selectCase(id) {
    const item = products.find(p => p.id === id);
    if (item) { selected = item; paintCase(); }
  }
  function setLanguage(value) {
    lang = value;
    document.documentElement.lang = value;
    picker.value = value;
    panel.innerHTML = portfolioView(lang, selected, filter, repos, homepage());
    onLanguage(lang);
  }
  picker.onchange = () => {
    write("portfolio.language", picker.value);
    setLanguage(picker.value);
  };
  setLanguage(lang);
  function enter() {
    if (started) return;
    started = true;
    void loadRepositories(rows => {
      const oldSite = homepage();
      repos = rows;
      paintFeed();
      if (oldSite !== homepage()) paintCase();
    });
  }
  let toastTimer;
  async function copy(value) {
    try {
      await navigator.clipboard.writeText(value);
      const toast = document.getElementById("hub-notice");
      toast.textContent = t("Copied");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toast.textContent = ""; }, 2100);
    } catch {
      showDialog(t("Copy this text"), '<textarea id="manual-copy" readonly></textarea>');
      const field = /** @type {HTMLTextAreaElement} */ (document.getElementById("manual-copy"));
      field.value = value;
      field.focus();
      field.select();
    }
  }
  function openAI(provider) {
    const service = AI_PROVIDERS[provider];
    const label = esc(t("Edit the dossier before opening your AI assistant."));
    showDialog(service.name, `<label for="hub-draft">${label}</label><textarea id="hub-draft"></textarea>
      <div class="hub-actions"><a class="primary-link" id="ai-link" target="_blank" rel="noopener noreferrer">${service.name} ↗</a>
      <button id="copy-draft">${esc(t("Copy dossier"))}</button><a href="${service.baseUrl}" target="_blank" rel="noopener noreferrer">${esc(t("Open chat"))} ↗</a></div>`);
    const field = /** @type {HTMLTextAreaElement} */ (document.getElementById("hub-draft"));
    field.value = PROMPTS[lang];
    const link = /** @type {HTMLAnchorElement} */ (document.getElementById("ai-link"));
    const sync = () => { link.href = buildAskAiUrl(provider, field.value); };
    field.oninput = sync;
    sync();
    document.getElementById("copy-draft").onclick = () => copy(field.value);
  }
  function palette() {
    const actions = [];
    const action = (label, kind, run, keywords = "") => actions.push({ label, kind, run, keywords });
    for (const p of products) action(p.tab, t("Project"), () => navigate("project-" + p.id), p.name);
    for (const trophy of trophies) action(trophy.name, t("Achievement"), () => navigate("award-" + trophy.id),
      [trophy.result, t(trophy.result), trophy.detail, trophy.credential || ""].join(" "));
    for (const [, , name, detail, url] of platforms)
      action(name, t("Social profiles"), () => window.open(url, "_blank", "noopener,noreferrer"), detail);
    action(t("Copy AI dossier"), "AI", () => copy(PROMPTS[lang]), "досье dossier");
    for (const [id, label] of [["hub","Proof of Work Hub"],["shelf","Trophy Shelf"],["bomb","Stickerbomb"],["workspace","Workspace"]])
      action(t(label), "Builder Deck", () => navigate(id), id);
    for (const r of repos) {
      if (!products.some(p => p.repo === r.html_url)) action(r.name, "GitHub", () => window.open(r.html_url, "_blank", "noopener,noreferrer"));
    }
    const hint = esc(t("Search projects, credentials and profiles"));
    showDialog(t("Command palette"), `<input type="search" id="hub-search" aria-label="${hint}" placeholder="${hint}" autocomplete="off"><div id="hub-choices"></div>`);
    const input = /** @type {HTMLInputElement} */ (document.getElementById("hub-search"));
    const choices = document.getElementById("hub-choices");
    const run = item => { dialog.close(); item.run(); };
    function draw() {
      const q = input.value.trim().toLocaleLowerCase();
      const matched = actions.filter(item => [item.label,item.kind,item.keywords].join(" ").toLocaleLowerCase().includes(q));
      choices.replaceChildren();
      for (const item of matched) {
        const b = document.createElement("button");
        b.className = "option";
        b.innerHTML = `<span>${esc(item.label)}</span><small>${esc(item.kind)}</small>`;
        b.onclick = () => run(item);
        choices.append(b);
      }
      if (!matched.length) choices.textContent = t("No matches");
    }
    input.oninput = draw;
    input.onkeydown = e => {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        const first = choices.querySelector("button");
        if (e.key === "Enter") first?.click(); else first?.focus();
      }
    };
    choices.onkeydown = e => {
      const buttons = [...choices.querySelectorAll("button")];
      const i = buttons.findIndex(b => b === document.activeElement);
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      if (!i && e.key === "ArrowUp") input.focus();
      else buttons[(i + (e.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length]?.focus();
    };
    draw();
    input.focus();
  }
  document.getElementById("open-palette").onclick = palette;
  panel.addEventListener("click", e => {
    if (!(e.target instanceof Element)) return;
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.case) selectCase(btn.dataset.case);
    if (btn.dataset.ai) openAI(btn.dataset.ai);
    if (btn.hasAttribute("data-dossier")) void copy(PROMPTS[lang]);
    if (filters.includes(btn.dataset.filter)) {
      filter = btn.dataset.filter;
      for (const b of panel.querySelectorAll("[data-filter]")) b.setAttribute("aria-pressed", String(b === btn));
      paintFeed();
    }
  });
  panel.addEventListener("keydown", e => {
    if (!(e.target instanceof HTMLElement) || !e.target.dataset.case) return;
    const i = products.indexOf(selected);
    const next = {ArrowRight:i+1, ArrowLeft:i-1, Home:0, End:products.length-1}[e.key];
    if (next === undefined) return;
    e.preventDefault();
    selectCase(products[(next+products.length)%products.length].id);
    document.getElementById("case-tab-"+selected.id).focus();
  });
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (dialog.open && document.getElementById("hub-search")) dialog.close();
      else palette();
    }
  });
  return { enter, selectCase, t };
}
