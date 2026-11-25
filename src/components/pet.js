// A silhouette drawn on a 38 × 36 pixel grid. Layers move independently in CSS.
export function makePet() {
  const companion = document.createElement("div");
  companion.className = "companion";
  companion.innerHTML = `<button class="pet" aria-label="Pet Daniil’s pixel companion">
    <svg viewBox="0 0 38 36" shape-rendering="crispEdges" aria-hidden="true">
      <ellipse cx="19" cy="33" rx="13" ry="1.5" fill="#100e0d"/>
      <g class="sprite">
        <path fill="#402b27" d="M8 23h20v2h3v3h2v5H5v-6h3z"/>
        <path fill="#9d4a38" d="M8 25h5v2h12v-3h3v3h3v5h-4v-3h-3v4H12v-4H9v3H6v-4h2z"/>
        <path fill="#df825b" d="M10 25h4v2h9v-2h3v3h-3v2h-9v-2h-4zm4 5h1v3h-1zm8 0h1v2h-1z"/>
        <g class="head">
          <path fill="#171517" d="M5 12h2V8h4V5h6V3h6v2h5V3h4v5h-2v3h3v11h-3v3h-5v3H13v-2H8v-4H5z"/>
          <path fill="#333033" d="M7 12h3V8h4V6h5V4h3v3h5V6h3v2h-3v4h3v8h-3v4h-5l-8 1H9v-5H7z"/>
          <path fill="#e8ac80" d="M10 15h18v7h-4v3H14v-2h-3v-3H9v-3h1z"/>
          <path fill="#ba745b" d="M10 19h3v3h3v2h-3v-2h-3zm15 1h2v2h-2z"/>
          <path fill="#141315" d="M8 14h5v-2h15v2h2v5h-2v2h-7v-3h-2v3h-6v-2H9z"/>
          <g class="visor"><path fill="#c76142" d="M11 15h7v3h-6v-1h-1zm10-1h7v4h-7z"/><path class="eyes" fill="#ffc78b" d="M14 15h3v1h-1v2h-2zm10-1h3v1h-1v2h-2z"/></g>
          <path fill="#252226" d="M7 11h5V9h6V7h7v2h-3v2h-1v2h-2v3h-2v-3h-4v2h-3v2H7z"/>
          <path fill="#555052" d="M10 10h3V8h5v1h-4v2h-4zm10-4h3v1h-3zm6 3h2v2h-2z"/>
          <path fill="#895345" d="M17 22h5v1h-5z"/>
        </g>
      </g>
      <path class="glint" fill="#fff3c3" d="M26 10h1v2h2v1h-2v2h-1v-2h-2v-1h2z"/>
      <path class="sparks" fill="#ffc487" d="M3 9h1v2h2v1H4v2H3v-2H1v-1h2zm30-6h1v2h2v1h-2v2h-1V6h-2V5h2z"/>
    </svg><span class="zzz" aria-hidden="true">z Z</span></button><span class="bubble"></span>`;
  const bubble = companion.querySelector(".bubble");
  const phrases = [
    "commit looks good.",
    "one pixel closer.",
    "ship it, Daniil!",
    "green across the board.",
  ];
  let phrase = 0,
    sleepTimer,
    happyTimer,
    lastActivity = 0;
  function show(state, words) {
    companion.dataset.state = state;
    bubble.textContent = words;
  }
  function rest() {
    const query = document.activeElement;
    if (query instanceof HTMLInputElement && query.id === "query")
      show(
        "thinking",
        query.value.trim() ? "parsing intent..." : "ready to dispatch...",
      );
    else show("idle", "ready to vibe code, Daniil...");
  }
  function happy() {
    clearTimeout(happyTimer);
    show("happy", phrases[phrase++ % phrases.length]);
    happyTimer = setTimeout(rest, 1750);
  }
  function activity() {
    if (companion.dataset.state === "sleep") happy();
    const now = performance.now();
    if (lastActivity && now - lastActivity < 300) return;
    lastActivity = now;
    clearTimeout(sleepTimer);
    sleepTimer = setTimeout(() => show("sleep", "in sleep mode..."), 52000);
  }
  function think() {
    clearTimeout(happyTimer);
    activity();
    if (document.activeElement?.id === "query") rest();
  }
  companion.querySelector("button").addEventListener("click", happy);
  for (const event of [
    "pointermove",
    "pointerdown",
    "keydown",
    "click",
    "input",
  ])
    document.addEventListener(event, activity, { passive: true });
  rest();
  activity();
  return { companion, happy, think, rest };
}
