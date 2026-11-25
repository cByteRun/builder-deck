import {
  achievements,
  products,
  platforms,
  profile,
  project,
  links,
  credentials,
  fallback,
  stickers,
} from "./catalog.js";
import { AI_PROVIDERS, PROMPTS, buildAskAiUrl } from "./dossier.js";
import { escapeHtml as esc } from "./locale.js";
import { messages } from "./messages.js";
import { read, write } from "../lib/storage.js";
import { overview, overlays } from "./view.js";

export function mountPortfolio({ dialog: settings, navigate, onLanguage }) {
  const picker = /** @type {HTMLSelectElement} */ (
    document.getElementById("site-language")
  );
  const panel = document.getElementById("hub");
  const surface = panel.shadowRoot || panel.attachShadow({ mode: "open" });
  if (!surface.hasChildNodes()) surface.innerHTML = overview;
  const overlay = document
    .getElementById("portfolio-overlays")
    .attachShadow({ mode: "open" });
  overlay.innerHTML = overlays;
  /** @returns {any} */
  const $ = (selector) =>
    surface.querySelector(selector) || overlay.querySelector(selector);
  /** @returns {any[]} */
  const all = (selector) => [
    ...surface.querySelectorAll(selector),
    ...overlay.querySelectorAll(selector),
  ];

  // English is the source locale. Brand names and external identifiers pass through.
  let siteLanguage = "en";
  function translate(value) {
    if (siteLanguage === "en" || typeof value !== "string") return value;
    const key = value.trim();
    const pair = Object.hasOwn(messages, key) ? messages[key] : null;
    if (pair)
      return value.replace(key, () => pair[siteLanguage === "ru" ? 0 : 1]);
    const dragSuffix = ". Drag to move, R to rotate.";
    if (key.endsWith(dragSuffix))
      return (
        translate(key.slice(0, -dragSuffix.length)) +
        ". " +
        translate(dragSuffix.slice(2))
      );
    if (key.endsWith(" ↗")) return translate(value.slice(0, -2)) + " ↗";
    if (value.includes(" · "))
      return value.split(" · ").map(translate).join(" · ");
    return value;
  }
  // Retain the source copy for round trips through all three languages.
  // Only presentation text is bound. User input, script and license text are excluded.
  const sourceCopy = new WeakMap();
  function translateField(node, field, current, write) {
    if (!current?.trim()) return;
    let fields = sourceCopy.get(node);
    if (!fields) {
      fields = new Map();
      sourceCopy.set(node, fields);
    }
    const saved = fields.get(field);
    const original =
      saved && saved.rendered === current ? saved.original : current;
    const rendered = translate(original);
    fields.set(field, { original, rendered });
    if (current !== rendered) write(rendered);
  }
  function localize(root) {
    function visit(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        translateField(node, "text", node.nodeValue, (text) => {
          node.nodeValue = text;
        });
        return;
      }
      if (
        node.nodeType !== Node.ELEMENT_NODE ||
        node.matches(
          "script,style,textarea,path,use,rect,line,circle,polygon,polyline,ellipse,[data-prompt-lang],#ai-editor,#ai-caption,option",
        )
      )
        return;
      for (const attr of ["title", "aria-label", "placeholder", "alt"]) {
        if (node.hasAttribute(attr))
          translateField(node, attr, node.getAttribute(attr), (text) =>
            node.setAttribute(attr, text),
          );
      }
      for (const child of node.childNodes) visit(child);
    }
    visit(root);
  }
  function dateLabel(date) {
    return new Intl.DateTimeFormat(
      { en: "en-GB", ru: "ru-RU", kk: "kk-KZ" }[siteLanguage],
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: profile.timezone,
      },
    ).format(date);
  }

  const icons = {
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
    github:
      '<path fill="currentColor" stroke="none" d="M12 1a11 11 0 0 0-3.48 21.44c.55.1.75-.24.75-.53v-2.06c-3.06.67-3.7-1.3-3.7-1.3-.5-1.28-1.22-1.62-1.22-1.62-1-.68.08-.67.08-.67 1.1.08 1.68 1.14 1.68 1.14.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.69-1.47-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.91 0 0 .92-.3 3.02 1.12a10.4 10.4 0 0 1 5.5 0c2.1-1.42 3.02-1.12 3.02-1.12.6 1.51.22 2.63.11 2.91.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.03 5.43.4.35.75 1.02.75 2.07v3.01c0 .3.2.64.76.53A11 11 0 0 0 12 1Z"/>',
    linkedin:
      '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7.5 10v7m3.5 0v-7m0 3c0-4 6-4 6 0v4"/><circle cx="7.5" cy="7" r=".75" fill="currentColor"/>',
    superteam:
      '<path d="M3 16h12l-3 3H1zm4-6h13l-3 3H4zm5-6h11l-3 3H9z" fill="currentColor" stroke="none"/>',
    astana: '<path d="m12 2 9 18h-5l-4-9-4 9H3z"/>',
    x: '<path d="M3 3h4.4L21 21h-4.5zM20 3l-6.8 7.7M4 21l6.6-7.4"/>',
    instagram:
      '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1" fill="currentColor"/>',
    trophy:
      '<path d="M7 3h10v6a5 5 0 0 1-10 0zM7 5H3v2a5 5 0 0 0 5 5m9-7h4v2a5 5 0 0 1-5 5m-4 2v5m-4 2h8"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    layers: '<path d="m2 8 10-5 10 5-10 5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 10-13h-7z"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 3v3m6-3v3m-6 12v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3"/>',
    terminal: '<path d="m4 6 6 6-6 6m10 0h6"/>',
    branch:
      '<circle cx="7" cy="5" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="7" cy="19" r="2"/><path d="M7 7v10m0-3c7 0 10-2 10-5"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    sticker: '<path d="M4 3h16v11l-7 7H4zM13 21v-7h7"/>',
    camera:
      '<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/>',
    calc: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 7h8M8 12h2m4 0h2m-8 5h2m4 0h2"/>',
    key: '<circle cx="8" cy="9" r="5"/><path d="m12 12 8 8m-5-5 3-3m0 6 3-3"/>',
    receipt: '<path d="M5 2h14v20l-3-2-4 2-4-2-3 2zM8 7h8m-8 4h8m-8 4h5"/>',
    pause: '<path d="M8 5v14m8-14v14" stroke-width="3"/>',
    play: '<path d="m7 4 12 8-12 8z"/>',
  };
  const icon = (k) =>
    '<svg class="ui" aria-hidden="true" viewBox="0 0 24 24">' +
    (icons[k] || icons.layers) +
    "</svg>";
  const dims = {
    hack: [201, 147],
    sol: [202, 154],
    decent: [207, 111],
    coffee: [183, 138],
    ship: [127, 55],
    sana: [186, 55],
    icpc: [186, 55],
    crab: [60, 40],
  };
  function art(id) {
    if (!dims[id]) return icon("layers");
    return (
      '<svg aria-hidden="true" class="art" viewBox="0 0 ' +
      dims[id].join(" ") +
      '" shape-rendering="crispEdges"><use href="./assets/portfolio/decals.svg#art-' +
      id +
      '"/></svg>'
    );
  }
  function storeRead(key) {
    try {
      return JSON.parse(localStorage.getItem("pow.v1." + key));
    } catch {
      return null;
    }
  }
  function storeWrite(key, value) {
    try {
      localStorage.setItem("pow.v1." + key, JSON.stringify(value));
    } catch {
      /* Storage is optional. */
    }
  }
  function link(el, url) {
    el.href = url;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  }
  const views = [
    ["hub", "Portfolio"],
    ["shelf", "Trophy Shelf"],
    ["workspace", "Workspace"],
  ];
  function openUrl(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  all("[data-i]").forEach((el) => (el.innerHTML = icon(el.dataset.i)));
  all("[data-url]").forEach((el) => link(el, links[el.dataset.url]));
  all("[data-project]").forEach((el) => link(el, project[el.dataset.project]));
  const socialNames = {
    github: "GitHub",
    linkedin: "LinkedIn",
    x: "X · @Den4kD77967",
    superteam: "Superteam Earn",
    astana: "Astana Hub",
    instagram: "Instagram · @tkachevd228",
  };
  for (const platform of platforms) {
    const pill = document.createElement("a");
    link(pill, links[platform.id]);
    pill.style.setProperty("--brand", platform.color);
    pill.innerHTML =
      icon(platform.id) +
      "<span><b>" +
      esc(platform.name) +
      "</b><small>" +
      esc(platform.detail) +
      "</small></span>";
    $("#proof-links").append(pill);
  }
  for (const button of all(".ai-tools [data-ai]")) {
    const provider = AI_PROVIDERS[button.dataset.ai];
    button.insertAdjacentHTML(
      "afterbegin",
      '<svg aria-hidden="true" viewBox="0 0 24 24" class="provider-mark"><path fill="currentColor" d="' +
        provider.path +
        '"/></svg>',
    );
  }
  $("#crab").innerHTML =
    '<button class="crab-btn" aria-label="Pet the pixel crab">' +
    art("crab") +
    "</button>";
  $("#bio").textContent = [
    profile.role,
    profile.experience,
    profile.location,
  ].join(" · ");
  const productTabs = $("#products");
  let activeProduct;
  let projectSites = new Map();
  function productLink() {
    const website =
      activeProduct.demo || projectSites.get(activeProduct.repo.toLowerCase());
    link($("#demo"), website || activeProduct.docs);
    $("#demo").textContent =
      (website ? "Project site" : activeProduct.secondary) + " ↗";
    localize($("#demo"));
  }
  function selectProduct(id) {
    const item = products.find((p) => p.id === id);
    if (!item) return;
    activeProduct = item;
    const featured = $("#featured");
    featured.dataset.accent = item.accent;
    featured.setAttribute("aria-labelledby", "tab-" + id);
    for (const tab of productTabs.children) {
      const active = tab.dataset.product === id;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    }
    for (const drawing of all(".product-art"))
      drawing.hidden = drawing.id !== "art-" + id;
    $(".feature-text h2").innerHTML = esc(item.name) + "<span>.</span>";
    $(".feature-text .category").textContent = item.category;
    $(".award").innerHTML =
      icon(item.id === "wallet" ? "layers" : "trophy") + esc(item.badge);
    $("#project-copy").textContent = item.summary;
    $("#stack").innerHTML = item.stack
      .map((s) => "<span>" + esc(s) + "</span>")
      .join("");
    $("#pipeline").setAttribute("aria-label", "Features · " + item.name);
    $("#pipeline").innerHTML = item.pipeline
      .map(
        (step, i) =>
          '<div class="step"><span>' +
          icon(item.icons[i]) +
          "</span>" +
          esc(step) +
          (i === 3
            ? ""
            : '<svg class="wire" aria-hidden="true" viewBox="0 0 100 6" preserveAspectRatio="none"><line x1="0" y1="3" x2="100" y2="3"/><line class="packet" x1="0" y1="3" x2="100" y2="3"/></svg>') +
          "</div>",
      )
      .join("");
    link($("#repo"), item.repo);
    productLink();
    localize(featured);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
      featured.animate([{ opacity: 0.65 }, { opacity: 1 }], { duration: 170 });
  }
  for (const [index, item] of products.entries()) {
    const tab = document.createElement("button");
    tab.id = "tab-" + item.id;
    tab.dataset.product = item.id;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", "featured");
    tab.textContent = item.tab;
    tab.onclick = () => selectProduct(item.id);
    tab.onkeydown = (e) => {
      const target = {
        ArrowRight: index + 1,
        ArrowLeft: index - 1,
        Home: 0,
        End: products.length - 1,
      }[e.key];
      if (target === undefined) return;
      e.preventDefault();
      const next =
        productTabs.children[(target + products.length) % products.length];
      next.focus();
      next.click();
    };
    productTabs.append(tab);
  }
  selectProduct(products[0].id);
  let toastTimer;
  function notify(msg) {
    const t = $("#toast");
    t.textContent = translate(msg);
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }
  async function copy(text) {
    try {
      if (!navigator.clipboard?.writeText) throw Error();
      await navigator.clipboard.writeText(text);
    } catch {
      const field = document.createElement("textarea");
      field.value = text;
      field.style.cssText = "position:fixed;top:4px;left:4px;opacity:.01";
      ($("#dialog").open ? $("#dialog") : document.body).append(field);
      field.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } finally {
        field.remove();
      }
      if (!ok) {
        dialog(
          "Copy text",
          '<label class="field-label" for="manual">Select and copy this text</label><textarea id="manual"></textarea>',
        );
        $("#manual").value = text;
        $("#manual").select();
        return false;
      }
    }
    notify("Copied!");
    return true;
  }
  const dlg = $("#dialog");
  let returnFocus;
  function dialog(title, body) {
    if (!dlg.open)
      returnFocus = surface.activeElement || document.activeElement;
    $("#dialog-title").textContent = title;
    $("#dialog-content").innerHTML = body;
    localize(dlg);
    if (!dlg.open) dlg.showModal();
  }
  function closeDialog() {
    dlg.close();
  }
  $("#close").onclick = closeDialog;
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) {
      const r = dlg.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        closeDialog();
    }
  });
  dlg.addEventListener("close", () => {
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  });
  const aiText = {
    en: {
      name: "English",
      code: "EN",
      group: "Interface and prompt language",
      caption:
        "Which part of your B2B product could Daniil take on? Explore two decisions from his projects, how he works with AI, and examples of how to verify a delivery.",
      ask: "Ask",
      review: "Review the prompt and add your own task if you like.",
      copy: "Copy prompt",
      open: "Open",
      question: "Question",
      paste: "Copy the prompt, open the chat and paste it there.",
      prefill:
        "Review the draft in the chat, then press Send. If the link fails, copy the prompt and open a blank chat.",
      blank: "Open a blank chat",
      copied: "Prompt copied. Paste it into the chat.",
    },
    ru: {
      name: "Русский",
      code: "RU",
      group: "Язык интерфейса и промпта",
      caption:
        "Какую часть вашего B2B-продукта Даниил может взять на себя? Посмотрите два решения из его проектов, разбор работы с AI и примеры того, как принять результат.",
      ask: "Спросить",
      review: "Проверьте промпт и при желании добавьте свою задачу.",
      copy: "Скопировать промпт",
      open: "Открыть",
      question: "Вопрос",
      paste: "Скопируйте промпт, откройте чат и вставьте текст.",
      prefill:
        "Проверьте черновик в чате и нажмите «Отправить». Если ссылка не сработала, скопируйте промпт и откройте пустой чат.",
      blank: "Открыть пустой чат",
      copied: "Промпт скопирован. Вставьте его в чат.",
    },
    kk: {
      name: "Қазақша",
      code: "KZ",
      group: "Интерфейс пен промпт тілі",
      caption:
        "B2B-өніміңіздің қай бөлігін Даниилге тапсыруға болады? Оның жобалардағы екі шешімін, AI-мен қалай жұмыс істейтінін және нәтижені қалай қабылдауға болатынын қараңыз.",
      ask: "Сұрақ қою ·",
      review: "Промптты қарап шығыңыз. Қаласаңыз, өз міндетіңізді қосыңыз.",
      copy: "Промптты көшіру",
      open: "Ашу ·",
      question: "Сұрақ",
      paste: "Промптты көшіріп, чатты ашыңыз да, мәтінді енгізіңіз.",
      prefill:
        "Чаттағы мәтінді тексеріп, «Жіберу» түймесін басыңыз. Сілтеме ашылмаса, промптты көшіріп, бос чатты ашыңыз.",
      blank: "Бос чат ашу",
      copied: "Промпт көшірілді. Оны чатқа енгізіңіз.",
    },
  };

  function mountLanguagePicker(host, select) {
    for (const [key, locale] of Object.entries(aiText)) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.promptLang = key;
      button.textContent = locale.code;
      button.lang = key;
      button.setAttribute("aria-label", locale.name);
      button.title = locale.name;
      button.onclick = () => select(key);
      host.append(button);
    }
  }
  function setSiteLanguage(key) {
    const changed = key !== siteLanguage;
    siteLanguage = key;
    document.documentElement.lang = key;
    picker.value = key;
    write("portfolio.language", key);
    onLanguage(key);
    for (const pick of all(".site-language")) pick.value = key;
    const locale = aiText[key];
    for (const group of all(".prompt-languages")) {
      group.setAttribute("aria-label", locale.group);
      for (const button of group.querySelectorAll("[data-prompt-lang]")) {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.promptLang === key),
        );
      }
    }
    const caption = $("#ai-caption");
    caption.lang = key;
    caption.textContent = locale.caption;
    if (changed) {
      storeWrite("language", key);
      for (const el of [...surface.children, ...overlay.children]) localize(el);
      paintFeed();
      motion();
      showSyncStatus();
      if ($("#palette-query")) drawChoices();
    }
  }
  mountLanguagePicker($("#hero-languages"), setSiteLanguage);
  for (const pick of all(".site-language"))
    pick.onchange = () => setSiteLanguage(pick.value);

  function ai(provider, question = "") {
    const service = AI_PROVIDERS[provider];
    dialog(
      "Ask " + service.name,
      `
   <div id="ai-editor">
     <div class="prompt-languages" id="draft-languages" role="group"></div>
     <label for="draft" class="field-label"></label>
     <textarea id="draft"></textarea>
     <p class="hint" id="ai-hint" role="status"></p>
     <div class="dialog-actions">
       <a id="continue-ai" class="primary" target="_blank" rel="noopener noreferrer"></a>
       <button id="copy-draft" class="secondary"></button>
       <a id="blank-chat" class="secondary" target="_blank" rel="noopener noreferrer"></a>
     </div>
   </div>`,
    );
    const draft = $("#draft");
    const hint = $("#ai-hint");
    const drafts = new Map();
    const openDraft = $("#continue-ai");
    const blankChat = $("#blank-chat");
    blankChat.href = service.baseUrl;
    function updateDraftLink() {
      openDraft.href = buildAskAiUrl(provider, draft.value);
      hint.textContent = aiText[siteLanguage].prefill;
    }
    function renderDraft(key) {
      setSiteLanguage(key);
      const locale = aiText[key];
      $("#ai-editor").lang = key;
      $("#dialog-title").textContent = locale.ask + " " + service.name;
      $("#ai-editor label").textContent = locale.review;
      $("#copy-draft").textContent = locale.copy;
      $("#continue-ai").textContent = locale.open + " " + service.name + " ↗";
      draft.lang = key;
      draft.value =
        drafts.get(key) ??
        PROMPTS[key] +
          (question ? "\n\n" + locale.question + ": " + question : "");
      blankChat.textContent = locale.blank;
      updateDraftLink();
    }
    mountLanguagePicker($("#draft-languages"), (key) => {
      drafts.set(siteLanguage, draft.value);
      renderDraft(key);
    });
    renderDraft(siteLanguage);
    draft.oninput = updateDraftLink;
    $("#copy-draft").onclick = async () => {
      if (await copy(draft.value))
        hint.textContent = aiText[siteLanguage].copied;
    };
  }
  function credentialBody(c) {
    return (
      '<div class="stamp">' +
      art(c.id) +
      "</div><small>" +
      esc(c.result) +
      "</small><h2>" +
      esc(c.name) +
      "</h2><p>" +
      esc(c.context) +
      "</p>" +
      (c.serial
        ? '<button class="tag" data-copy="' +
          esc(c.serial) +
          '" title="Copy credential ID">' +
          icon("copy") +
          esc(c.serial) +
          "</button>"
        : "") +
      (c.url
        ? '<a href="' +
          esc(c.url) +
          '" target="_blank" rel="noopener noreferrer">' +
          esc(c.source) +
          " ↗</a>"
        : "")
    );
  }

  function credential(id) {
    const c = credentials.find((x) => x.id === id);
    if (c) {
      dialog(
        c.name,
        '<article class="trophy credential">' +
          credentialBody(c) +
          "</article>",
      );
      return;
    }
    const s = stickers.find((x) => x.id === id);
    if (s)
      dialog(
        s.label,
        '<div class="credential"><div class="stamp">' +
          art(id) +
          "</div></div>",
      );
  }
  let activeChoice = 0,
    choices = [];
  let publicProjects = [];
  function palette(initial = "") {
    dialog(
      "Command palette",
      '<input id="palette-query" class="search-input" aria-label="Search commands or bookmarks" placeholder="Search projects, credentials, or /commands..." autocomplete="off"><div class="choices" id="choices"></div>',
    );
    const input = $("#palette-query");
    input.value = typeof initial === "string" ? initial : "";
    activeChoice = 0;
    input.oninput = () => {
      activeChoice = 0;
      drawChoices();
    };
    input.onkeydown = (e) => {
      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        if (choices.length)
          activeChoice =
            (activeChoice + (e.key === "ArrowDown" ? 1 : -1) + choices.length) %
            choices.length;
        markChoice();
      }
      if (e.key === "Enter" && choices[activeChoice]) {
        e.preventDefault();
        choices[activeChoice].run();
      }
    };
    drawChoices();
    input.focus();
  }
  const bookmarks = [
    ["Lichess", links.lichess],
    ["ChatGPT", links.chatgpt],
    ["GitHub", links.github],
    [
      project.demo ? "Recorda Live" : "Recorda deployment notes",
      project.demo || project.docs,
    ],
  ];
  function markChoice() {
    all("#choices button").forEach((b, i) => {
      b.classList.toggle("selected", i === activeChoice);
      if (i === activeChoice) b.scrollIntoView({ block: "nearest" });
    });
  }
  function drawChoices() {
    const input = $("#palette-query"),
      query = input.value.trim(),
      match = query.match(/^\/(google|gh|ask|claude)\s+(.+)$/i);
    const cmd = (mode, q) => {
      if (mode === "claude" || mode === "ask") {
        ai(mode === "claude" ? "claude" : "chatgpt", q);
        return;
      }
      openUrl(
        (mode === "gh"
          ? "https://github.com/search?q="
          : "https://www.google.com/search?q=") + encodeURIComponent(q),
      );
      closeDialog();
    };
    const external = (name, kind, url, keywords = "") => ({
      name,
      kind,
      keywords,
      run: () => {
        openUrl(url);
        closeDialog();
      },
    });
    const options = [
      ...products.map((p) => ({
        name: p.name,
        kind: "Featured product",
        keywords: [
          p.tab,
          p.category,
          p.badge,
          p.summary,
          ...p.stack,
          ...p.pipeline,
        ]
          .map((v) => v + " " + translate(v))
          .join(" "),
        run: () => {
          closeDialog();
          navigate("project-" + p.id);
        },
      })),
      {
        name: "Copy AI dossier",
        kind: "AI",
        keywords: "copy prompt dossier досье",
        run: () => {
          closeDialog();
          copy(PROMPTS[siteLanguage]);
        },
      },
      ...achievements.map((a) =>
        external(
          a.title,
          a.category,
          a.url,
          [a.platform, a.label, a.summary, a.metric]
            .map((v) => [v, translate(v)].join(" "))
            .join(" "),
        ),
      ),
      ...publicProjects.map((row) =>
        external(
          row.title,
          "Repository",
          row.url,
          "project " + row.detail + " " + row.url,
        ),
      ),
      ...credentials.map((c) => ({
        name: c.name + " · " + c.result,
        kind: "Credential",
        keywords: [c.serial, c.source, c.context, "cert certificate"].join(" "),
        run: () => credential(c.id),
      })),
      ...views.map(([id, name]) => ({
        name,
        kind: "View",
        run: () => {
          closeDialog();
          navigate(id);
        },
      })),
      ...Object.entries(socialNames).map(([key, name]) =>
        external(name, "Profile", links[key], key + " social"),
      ),
      ...bookmarks
        .filter(([name]) => name !== "GitHub")
        .map(([name, url]) => external(name, "Bookmark", url)),
      ...["google", "gh", "claude", "ask"].map((k) => ({
        name: "/" + k,
        kind: "Command",
        run: () => {
          input.value = "/" + k + " ";
          input.focus();
          activeChoice = 0;
          drawChoices();
        },
      })),
    ];
    choices = match
      ? [
          {
            name: match[2],
            kind: "/" + match[1],
            run: () => cmd(match[1].toLowerCase(), match[2]),
          },
        ]
      : options.filter((o) =>
          query
            .toLocaleLowerCase()
            .split(/\s+/)
            .every((term) =>
              [
                o.name,
                translate(o.name),
                o.kind,
                translate(o.kind),
                "keywords" in o ? o.keywords : "",
              ]
                .join(" ")
                .toLocaleLowerCase()
                .includes(term),
            ),
        );
    if (query && !query.startsWith("/"))
      choices.push({
        name: translate("Search the web for") + " “" + query + "”",
        kind: "Google",
        run: () => cmd("google", query),
      });
    $("#choices").innerHTML = choices.length
      ? choices
          .map(
            (o, i) =>
              '<button data-choice="' +
              i +
              '"><span>' +
              esc(o.name) +
              "</span><small>" +
              esc(o.kind) +
              "</small></button>",
          )
          .join("")
      : '<p class="hint">No matching commands.</p>';
    localize($("#choices"));
    all("[data-choice]").forEach((b, i) => (b.onclick = choices[i].run));
    markChoice();
  }
  document.getElementById("open-palette").onclick = () => palette();
  const heroSearch = $("#hero-search");
  heroSearch.onclick = () => palette(heroSearch.value);
  heroSearch.oninput = () => {
    const query = heroSearch.value;
    heroSearch.value = "";
    palette(query);
  };
  heroSearch.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      palette(heroSearch.value);
    }
  };
  for (const k of all(".command kbd,.evidence-search kbd"))
    k.textContent = /Mac|iPhone|iPad/.test(navigator.platform)
      ? "⌘ K"
      : "Ctrl + K";
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (settings.open) settings.close();
      if (dlg.open && $("#palette-query")) closeDialog();
      else palette();
    }
  });
  function handleButton(e) {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.copy)
      copy(
        b.dataset.copy === "dossier" ? PROMPTS[siteLanguage] : b.dataset.copy,
      );
    else if (b.dataset.ai) ai(b.dataset.ai);
    else if (b.dataset.view) navigate(b.dataset.view);
    else if (b.dataset.credential) credential(b.dataset.credential);
    else if (b.classList.contains("crab-btn")) notify("Hello, builder!");
  }
  surface.addEventListener("click", handleButton);
  overlay.addEventListener("click", handleButton);
  const zoneDefaults = {
    "hero-stickers": [
      [0.15, 0.47, 0.25],
      [0.54, 0.48, 0.27],
      [0.34, 0.72, 0.27],
      [0.8, 0.29, 0.26],
      [0.84, 0.74, 0.16],
    ],
  };
  const bound = (v, min, max) => Math.min(max, Math.max(min, v));
  const zoneStates = new Map();
  function positionSticker(b) {
    const z = b.parentElement,
      r = zoneStates.get(z.id)[Number(b.dataset.index)],
      w = z.clientWidth,
      h = z.clientHeight;
    if (!w || !h) return;
    const [sw, sh] = dims[b.dataset.sticker],
      radians = (r.angle * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians)),
      cos = Math.abs(Math.cos(radians)),
      ratio = sh / sw;
    const inset = Math.min(12, w * 0.04, h * 0.08);
    const width = Math.min(
      r.scale * w,
      (w - 2 * inset) / (cos + ratio * sin),
      (h - 2 * inset) / (sin + ratio * cos),
    );
    const hx = (width * (cos + ratio * sin)) / 2,
      hy = (width * (sin + ratio * cos)) / 2;
    r.x = bound(r.x * w, hx + inset, w - hx - inset) / w;
    r.y = bound(r.y * h, hy + inset, h - hy - inset) / h;
    b.style.cssText =
      "width:" +
      width +
      "px;left:" +
      r.x * 100 +
      "%;top:" +
      r.y * 100 +
      "%;--rot:" +
      r.angle +
      "deg";
  }
  function updateStickers() {
    all(".sticker").forEach(positionSticker);
  }
  function seedZone(z, reset = false) {
    const saved = reset ? null : storeRead("stickers." + z.id);
    const states = zoneDefaults[z.id].map(([x, y, scale], i) => {
      const s = saved?.[i];
      return s && [s.x, s.y, s.angle].every(Number.isFinite)
        ? { x: s.x, y: s.y, angle: s.angle, scale }
        : { x, y, scale, angle: stickers[i].angle };
    });
    zoneStates.set(z.id, states);
  }
  for (const z of all(".sticker-area")) {
    const hero = z.id === "hero-stickers";
    seedZone(z);
    z.innerHTML = stickers
      .map((item, i) => {
        const attrs =
          'class="sticker" data-index="' +
          i +
          '" data-sticker="' +
          item.id +
          '"';
        return hero
          ? "<a " +
              attrs +
              ' href="' +
              esc(item.url) +
              '" target="_blank" rel="noopener noreferrer" draggable="false" title="' +
              esc(item.destination) +
              '" aria-label="' +
              esc(item.label + " · " + item.destination) +
              '">' +
              art(item.id) +
              "</a>"
          : "<button " +
              attrs +
              ' aria-label="' +
              esc(item.label) +
              '. Drag to move, R to rotate.">' +
              art(item.id) +
              "</button>";
      })
      .join("");
    for (const b of z.children) {
      let drag = null,
        suppressClick = false;
      const state = () => zoneStates.get(z.id)[Number(b.dataset.index)],
        save = () => storeWrite("stickers." + z.id, zoneStates.get(z.id));
      b.onpointerdown = (e) => {
        if (e.button !== 0) return;
        suppressClick = false;
        const r = state();
        drag = {
          id: e.pointerId,
          startX: e.clientX,
          startY: e.clientY,
          x: r.x,
          y: r.y,
        };
        b.setPointerCapture(e.pointerId);
      };
      b.onpointermove = (e) => {
        if (!drag || drag.id !== e.pointerId) return;
        if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 4)
          suppressClick = true;
        const r = state();
        r.x = drag.x + (e.clientX - drag.startX) / z.clientWidth;
        r.y = drag.y + (e.clientY - drag.startY) / z.clientHeight;
        positionSticker(b);
      };
      b.onlostpointercapture = () => {
        if (drag) save();
        drag = null;
      };
      if (hero)
        b.onclick = (e) => {
          if (suppressClick && e.detail) e.preventDefault();
        };
      b.ondblclick = () => {
        state().angle = (state().angle + 15) % 360;
        positionSticker(b);
        save();
      };
      b.onkeydown = (e) => {
        const r = state();
        if (e.key.toLowerCase() === "r") r.angle = (r.angle + 15) % 360;
        else if (e.key === "ArrowLeft") r.x -= 0.025;
        else if (e.key === "ArrowRight") r.x += 0.025;
        else if (e.key === "ArrowUp") r.y -= 0.035;
        else if (e.key === "ArrowDown") r.y += 0.035;
        else if (!hero && e.key === "Enter") {
          credential(b.dataset.sticker);
          return;
        } else return;
        e.preventDefault();
        positionSticker(b);
        save();
      };
    }
    new ResizeObserver(updateStickers).observe(z);
  }
  $("#drawer-stickers").innerHTML = stickers
    .map(
      (s) =>
        '<a class="swipe-stamp" href="' +
        esc(s.url) +
        '" target="_blank" rel="noopener noreferrer" title="' +
        esc(s.destination) +
        '" aria-label="' +
        esc(s.label + " · " + s.destination) +
        '">' +
        art(s.id) +
        "</a>",
    )
    .join("");

  const reduced = matchMedia("(prefers-reduced-motion:reduce)");
  let paused = reduced.matches,
    hover = false,
    delayUntil = 0;
  function motion() {
    const b = $("#pause");
    $(".activity").classList.toggle("paused", paused);
    b.innerHTML = icon(paused ? "play" : "pause");
    b.setAttribute(
      "aria-label",
      translate(paused ? "Play activity motion" : "Pause activity motion"),
    );
    b.title = b.getAttribute("aria-label");
  }
  $("#pause").onclick = () => {
    paused = !paused;
    motion();
  };
  reduced.addEventListener("change", () => {
    paused = reduced.matches;
    motion();
  });
  motion();
  $(".activity").onpointerenter = () => (hover = true);
  $(".activity").onpointerleave = () => (hover = false);
  const stream = $("#stream");
  for (const event of ["wheel", "touchstart", "keydown"])
    stream.addEventListener(event, () => (delayUntil = Date.now() + 9500), {
      passive: true,
    });
  let lastStep = 0,
    atEnd = 0;
  setInterval(() => {
    if (
      paused ||
      document.hidden ||
      hover ||
      $(".activity").contains(surface.activeElement) ||
      Date.now() < delayUntil ||
      !stream.clientHeight ||
      stream.scrollHeight <= stream.clientHeight + 1
    )
      return;
    if (stream.scrollTop + stream.clientHeight >= stream.scrollHeight - 1) {
      if (!atEnd) atEnd = Date.now();
      if (Date.now() - atEnd > 2500) {
        stream.scrollTop = 0;
        atEnd = 0;
        delayUntil = Date.now() + 2800;
      }
      return;
    }
    atEnd = 0;
    if (Date.now() - lastStep >= 70) {
      stream.scrollTop += 1;
      lastStep = Date.now();
    }
  }, 80);

  function projectRows(repositories) {
    const ownersName = profile.handle.slice(1).toLowerCase();
    const unique = new Map();
    for (const repo of repositories) {
      if (
        !repo ||
        repo.private ||
        repo.fork ||
        repo.owner?.login?.toLowerCase() !== ownersName
      )
        continue;
      if (
        typeof repo.name !== "string" ||
        !/^[\w.-]+$/.test(repo.name) ||
        [".", ".."].includes(repo.name)
      )
        continue;
      const created = Date.parse(repo.created_at);
      if (!Number.isFinite(created)) continue;
      const detail = [
        repo.description?.trim(),
        repo.language,
        "Created " + dateLabel(created),
      ]
        .filter(Boolean)
        .join(" · ");
      unique.set(repo.name.toLowerCase(), {
        language: repo.language,
        summary: repo.description || repo.language || "Public repository",
        title: repo.name,
        url: links.github + "/" + repo.name,
        source: "GitHub",
        icon: "github",
        detail,
        created,
      });
    }
    return Array.from(unique.values()).sort(
      (a, b) => b.created - a.created || a.title.localeCompare(b.title),
    );
  }

  let feedItems = [],
    activeFilter = "All";
  const filters = ["All", "Wins", "Code", "Media"];
  for (const category of filters) {
    const button = document.createElement("button");
    button.textContent = category;
    button.dataset.filter = category;
    button.onclick = () => {
      activeFilter = category;
      paintFeed();
    };
    $("#filters").append(button);
  }
  function feedSummary(row) {
    if (
      !row.created ||
      siteLanguage === "en" ||
      Object.hasOwn(messages, row.summary)
    )
      return translate(row.summary);
    const project = products.find((p) => p.repo === row.url);
    if (project) return translate(project.summary);
    // Keep a new repository identifiable even before its author supplies localized copy.
    return [translate("Public repository"), row.language]
      .filter(Boolean)
      .join(" · ");
  }
  function paintFeed() {
    for (const button of $("#filters").children)
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.filter === activeFilter),
      );
    const entries = feedItems.filter(
      (item) => activeFilter === "All" || item.category === activeFilter,
    );
    stream.innerHTML = entries
      .map((row) => {
        const platform = platforms.find((p) => p.id === row.platform);
        const name = row.label || platform.name;
        return (
          '<a class="row" style="--platform:' +
          platform.color +
          '" href="' +
          esc(row.url) +
          '" rel="noopener noreferrer" target="_blank"><span class="tileicon">' +
          icon(row.platform) +
          '</span><span class="row-text"><span class="row-meta">' +
          esc(name) +
          " · " +
          esc(row.category) +
          "</span><strong>" +
          esc(row.title) +
          "</strong><small>" +
          esc(feedSummary(row)) +
          '</small></span><span class="source">' +
          esc(row.created ? dateLabel(row.created) : translate(row.metric)) +
          " ↗</span></a>"
        );
      })
      .join("");
    localize(stream);
    stream.scrollTop = 0;
    atEnd = 0;
    delayUntil = Date.now() + 4000;
  }
  function renderFeed(repositories = null) {
    const offline = [
      ...products.map((p) => ({
        title: p.name,
        url: p.repo,
        detail: p.summary,
      })),
      ...fallback.filter((row) => row.source === "GitHub"),
    ];
    const live = repositories === null ? [] : projectRows(repositories);
    publicProjects = [
      ...new Map(
        [...offline, ...live].map((row) => [row.url.toLowerCase(), row]),
      ).values(),
    ];
    if (repositories) {
      projectSites = new Map();
      for (const repo of repositories) {
        if (
          typeof repo?.homepage !== "string" ||
          !repo.homepage.startsWith("https://") ||
          !products.some((p) => p.repo === repo.html_url)
        )
          continue;
        try {
          projectSites.set(
            repo.html_url.toLowerCase(),
            new URL(repo.homepage).href,
          );
        } catch {}
      }
      productLink();
    }
    const latest = live.length ? live : publicProjects;
    const code = latest
      .slice(0, 6)
      .map((r) => ({
        title: r.title,
        url: r.url,
        category: "Code",
        platform: "github",
        created: r.created,
        metric: "Repository",
        language: r.language,
        summary: r.summary || r.detail,
      }));
    const wins = achievements.filter((a) => a.category === "Wins"),
      media = achievements.filter((a) => a.category === "Media");
    feedItems = [
      wins[0],
      ...code.slice(0, 1),
      wins[1],
      media[0],
      ...code.slice(1),
      ...wins.slice(2),
      ...media.slice(1),
    ];
    paintFeed();
    if ($("#palette-query")) drawChoices();
  }
  let syncMessage = "Connecting",
    syncLive = false;
  function showSyncStatus() {
    $("#sync").textContent =
      (syncLive ? "●" : "○") + " GitHub API: " + translate(syncMessage);
  }
  function syncStatus(text, live = false) {
    syncMessage = text;
    syncLive = live;
    showSyncStatus();
    $("#sync").classList.toggle("live", live);
  }
  const ttl = 10 * 60 * 1000;
  let loading = false,
    lastAttempt = 0;
  async function syncGitHub() {
    if (loading) return;
    const cache = storeRead("public-projects"),
      valid =
        Array.isArray(cache?.repositories) && Number.isFinite(cache?.time);
    if (valid) {
      renderFeed(cache.repositories);
      if (Date.now() - cache.time < ttl) {
        syncStatus(
          "Cached · " +
            new Date(cache.time).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: profile.timezone,
            }) +
            " ALMT",
        );
        return;
      }
    }
    if (Date.now() - lastAttempt < ttl) return;
    loading = true;
    lastAttempt = Date.now();
    const controller = new AbortController(),
      timeout = setTimeout(() => controller.abort(), 6500);
    try {
      const res = await fetch(links.publicProjects, {
        signal: controller.signal,
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!res.ok) throw Error(String(res.status));
      const repositories = await res.json();
      if (!Array.isArray(repositories)) throw Error("Invalid repository list");
      storeWrite("public-projects", { repositories, time: Date.now() });
      renderFeed(repositories);
      syncStatus("Auto-synced", true);
    } catch (err) {
      if (valid) renderFeed(cache.repositories);
      else renderFeed();
      const reason = ["403", "429"].includes(err.message)
        ? "Rate limited"
        : "Unavailable";
      syncStatus(
        reason + " · " + (valid ? "Cached projects" : "Curated fallback"),
      );
    } finally {
      clearTimeout(timeout);
      loading = false;
    }
  }
  renderFeed();
  const savedLanguage = read(
    "portfolio.language",
    storeRead("language") || "en",
  );
  setSiteLanguage(Object.hasOwn(aiText, savedLanguage) ? savedLanguage : "en");
  picker.onchange = () => setSiteLanguage(picker.value);
  setInterval(() => {
    if (!document.hidden && !panel.hidden) syncGitHub();
  }, ttl);
  return {
    enter() {
      updateStickers();
      void syncGitHub();
    },
    selectCase(id) {
      selectProduct(id);
      $("#tab-" + activeProduct.id).focus();
    },
    dialogOpen() {
      return dlg.open;
    },
  };
}
