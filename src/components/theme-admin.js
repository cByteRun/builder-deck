import { themes, activeTheme } from "../themes/index.js";
export function themeOptions() {
  return Object.values(themes)
    .map(
      (t) =>
        `<button class="option" data-theme-id="${t.id}" aria-pressed="${t.id === activeTheme()}">${t.name}${t.id === activeTheme() ? "<small>Selected</small>" : ""}</button>`,
    )
    .join("");
}
