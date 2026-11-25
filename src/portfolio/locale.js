import { messages } from "./messages.js";

export function translate(text, language = "en") {
  if (language === "en" || !text) return text;
  const entry = messages[text];
  if (Array.isArray(entry)) return entry[language === "ru" ? 0 : 1];
  if (text.includes(" · ")) return text.split(" · ").map(part => translate(part, language)).join(" · ");
  return text;
}

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}
