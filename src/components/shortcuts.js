const shortcuts = [
  [
    "Lichess",
    "#E2DFD7",
    "https://lichess.org/",
    '<path d="M6 20h13l-1-3c-1-3-4-4-3-8l1-5-4 2-3-2-1 4-4 4 2 3 5-3-3 5z"/>',
  ],
  [
    "Teams",
    "#7B83EB",
    "https://teams.live.com/",
    '<rect x="2" y="7" width="12" height="12" rx="2"/><path d="M5 10h6m-3 0v6m8-6h5v5a4 4 0 0 1-5 4"/><circle cx="16" cy="5" r="2"/>',
  ],
  [
    "TeamTrack",
    "#E08A5E",
    "https://its-teamtrace.vercel.app/",
    '<path d="M3 6h11l-3 4H8v9H4V10H1zm11 6h8l-2 3h-2v4h-4z"/>',
  ],
  [
    "Telegram Web",
    "#54A9EB",
    "https://web.telegram.org/",
    '<path d="m2 11 20-8-4 18-7-6-4 3v-5l11-7-13 6z"/>',
  ],
  [
    "YouTube",
    "#E05A5A",
    "https://www.youtube.com/",
    '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
  ],
  [
    "ChatGPT",
    "#5BB99A",
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
    "#5C9CE6",
    "https://www.bilimclass.kz/",
    '<path d="M2 5c4-1 7 0 10 2 3-2 6-3 10-2v13c-4-1-7 0-10 2-3-2-6-3-10-2zm10 2v13"/>',
  ],
  [
    "HireLuma",
    "#A78BFA",
    "https://hireluma-demo.vercel.app/",
    '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/><path fill="currentColor" stroke="none" d="m10.5 5 1.4 4.1 4.1 1.4-4.1 1.4-1.4 4.1-1.4-4.1L5 10.5l4.1-1.4z"/>',
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
        ([name, color, url, mark]) =>
          `<a class="quick-link" style="--brand:${color}" target="_blank" rel="noopener noreferrer" href="${url}" title="${name === "BilimClass" ? "BilimClass / BilimLand" : name}">${shortcutIcon(mark)}<span>${name}</span></a>`,
      )
      .join("") +
    "</nav>"
  );
}

export { shortcutRow };
