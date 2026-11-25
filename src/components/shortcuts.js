const shortcuts = [
  [
    "Lichess",
    "https://lichess.org/",
    '<path d="M6 20h13l-1-3c-1-3-4-4-3-8l1-5-4 2-3-2-1 4-4 4 2 3 5-3-3 5z"/>',
  ],
  [
    "Teams",
    "https://teams.live.com/",
    '<rect x="2" y="7" width="12" height="12" rx="2"/><path d="M5 10h6m-3 0v6m8-6h5v5a4 4 0 0 1-5 4"/><circle cx="16" cy="5" r="2"/>',
  ],
  [
    "TeamTrace",
    "https://its-teamtrace.vercel.app/",
    '<path d="M3 6h11l-3 4H8v9H4V10H1zm11 6h8l-2 3h-2v4h-4z"/>',
  ],
  [
    "Telegram Web",
    "https://web.telegram.org/",
    '<path d="m2 11 20-8-4 18-7-6-4 3v-5l11-7-13 6z"/>',
  ],
  [
    "YouTube",
    "https://www.youtube.com/",
    '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
  ],
  [
    "ChatGPT",
    "https://chatgpt.com/",
    '<g transform="translate(12 12)">' +
      Array.from(
        { length: 6 },
        (_, i) =>
          '<path transform="rotate(' +
          i * 60 +
          ')" d="M0-4 4-6c3-1 6 3 4 6L5 2 1 0z"/>',
      ).join("") +
      "</g>",
  ],
  [
    "BilimClass",
    "https://www.bilimclass.kz/",
    '<path d="M2 5c4-1 7 0 10 2 3-2 6-3 10-2v13c-4-1-7 0-10 2-3-2-6-3-10-2zm10 2v13"/>',
  ],
  [
    "Ureluma",
    "https://hireluma-demo.vercel.app/",
    '<path d="M4 4v10a6 6 0 0 0 12 0V4m4 9v7h-5"/>',
  ],
];
function shortcutIcon(mark) {
  return (
    '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
    mark +
    "</svg>"
  );
}
function shortcutRow() {
  return (
    '<nav class="quick-access" aria-label="Quick access">' +
    shortcuts
      .map(
        ([name, url, mark]) =>
          '<a class="quick-link" target="_blank" rel="noopener noreferrer" href="' +
          url +
          '" title="' +
          (name === "BilimClass" ? "BilimClass / BilimLand" : name) +
          '">' +
          shortcutIcon(mark) +
          "<span>" +
          name +
          "</span></a>",
      )
      .join("") +
    "</nav>"
  );
}

export { shortcutRow };
