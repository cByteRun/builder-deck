import { trophies } from "../data/profile.js";

export function brandMark(id) {
  return `<svg class="achievement-mark" aria-hidden="true" focusable="false" viewBox="0 0 20 20"><use href="./assets/achievement-marks.svg#${id}" width="20" height="20"/></svg>`;
}

export function companion(trophy) {
  return `<svg class="achievement-pet" aria-hidden="true" focusable="false" viewBox="0 0 28 24"><use href="./assets/achievement-pets.svg#${trophy.id}" width="28" height="24"/></svg>`;
}

export function companions(ids, position) {
  const pets = ids.map((id) => {
    const t = trophies.find((entry) => entry.id === id);
    return `<a class="pet-perch" data-reaction="${t.reaction}" style="--shade:${t.color}" href="#award-${id}" aria-label="${t.pet} — view ${t.name}">${companion(t)}<span class="pet-whisper" aria-hidden="true">${t.phrase}</span></a>`;
  });
  return `<div class="pet-group pet-group--${position}">${pets.join("")}</div>`;
}
