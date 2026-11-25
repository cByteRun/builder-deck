import { $, $$ } from "../lib/dom.js";
import { activeTheme, themeNames } from "../themes/index.js";
export function createAdmin({ exportFiles, setupInstructions, fillExports }) {
  const admin = $("#admin");
  let adminSection = "themes";
  function openAdmin(section) {
    adminSection = section;
    renderAdmin();
    if (!admin.open) admin.showModal();
  }
  function renderAdmin() {
    const selected = activeTheme();
    $$("#admin [data-admin-tab]").forEach((b) =>
      b.setAttribute(
        "aria-pressed",
        String(b.dataset.adminTab === adminSection),
      ),
    );
    const panel = $("#admin-panel");
    if (adminSection === "export") {
      panel.innerHTML = exportFiles() + setupInstructions();
      fillExports(panel);
      return;
    }
    panel.innerHTML =
      '<div class="themes">' +
      Object.entries(themeNames)
        .map(
          ([id, name]) =>
            '<article class="theme-card ' +
            (id === selected ? "chosen" : "") +
            '"><div class="mini" data-theme="' +
            id +
            '" aria-hidden="true"><b>' +
            (id === "claude-code" ? "Hello, Daniil." : "VIBE CODING") +
            "</b><i></i></div><h3>" +
            name +
            '</h3><button class="apply" data-apply="' +
            id +
            '" ' +
            (id === selected ? "disabled" : "") +
            ">" +
            (id === selected ? "Active theme" : "Apply theme") +
            "</button></article>",
        )
        .join("") +
      "</div>";
  }

  return { openAdmin, renderAdmin };
}
