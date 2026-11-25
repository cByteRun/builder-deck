import { heroSprite, roverSprite } from "./mascot-art.js";

export function makePet() {
  const companion = document.createElement("div");
  companion.className = "companion";
  companion.innerHTML = `<button class="pet" aria-label="Pet Daniil’s command companion">${heroSprite}<span class="zzz" aria-hidden="true">zZz</span></button><span class="bubble"></span>`;
  const bubble = companion.querySelector(".bubble");
  const rover = document.getElementById("rover");
  rover.innerHTML = `<span class="facing"><span class="hop">${roverSprite}</span></span>`;
  const status = document.getElementById("session-state");
  const phrases = [
    "commit looks good.",
    "one pixel closer.",
    "ship it, Daniil!",
    "green across the board.",
  ];
  const napAfter = 45000;
  let phrase = 0,
    sleepTimer,
    happyTimer,
    roverTimer,
    lastActivity = performance.now();

  function show(state, words) {
    companion.dataset.state = state;
    rover.dataset.sleeping = String(state === "sleep");
    status.textContent = state;
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
  function checkNap() {
    const remaining = lastActivity + napAfter - performance.now();
    if (remaining > 0) sleepTimer = setTimeout(checkNap, remaining);
    else {
      clearTimeout(happyTimer);
      sleepTimer = undefined;
      show("sleep", "in sleep mode...");
    }
  }
  function activity() {
    lastActivity = performance.now();
    if (companion.dataset.state === "sleep") {
      happy();
      companion.classList.add("just-woke");
      setTimeout(() => companion.classList.remove("just-woke"), 700);
    }
    if (sleepTimer === undefined) sleepTimer = setTimeout(checkNap, napAfter);
  }
  function think() {
    activity();
    clearTimeout(happyTimer);
    if (document.activeElement?.id === "query") rest();
  }
  function greetRover() {
    clearTimeout(roverTimer);
    rover.classList.add("greeting");
    roverTimer = setTimeout(() => rover.classList.remove("greeting"), 900);
  }
  rover.addEventListener("pointerenter", greetRover);
  rover.addEventListener("click", () => {
    greetRover();
    happy();
  });
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
