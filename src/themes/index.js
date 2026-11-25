import claude from "./claude-code/theme.js";
import classic from "./vibe-v1/theme.js";
import hybrid from "./vibe-v2/theme.js";
export const themes = Object.fromEntries(
  [claude, hybrid, classic].map((t) => [t.id, t]),
);
export const themeNames = Object.fromEntries(
  Object.values(themes).map((t) => [t.id, t.name]),
);
export const activeTheme = () => document.documentElement.dataset.theme;
