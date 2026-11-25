const credentials = {
  hack: {
    name: "HackAlem AI",
    track: "Guinness World Record Builder",
    text: "Astana EXPO · A record gathering of 2,415 builders.",
    mark: "✳",
    color: "#49837a",
  },
  sol: {
    name: "Colosseum × KASE",
    track: "Solana · Crypto World’s Fair",
    text: "Tokenized bonds & RWA. Bond servicing on Solana devnet with coupons, redemption and buybacks.",
    mark: "≋",
    color: "#9468ac",
  },
  decent: {
    name: "Decentrathon 6.0",
    track: "Final season · 19 cities",
    text: "Astana Hub × BAITC. A national builder season across 19 cities.",
    mark: "ϟ",
    color: "#926ab1",
  },
  sana: {
    name: "AI-SANA",
    track: "Stage 2 · Platonus",
    text: "AI-SANA Stage 2 credential, recorded in Platonus.",
    mark: "▣",
    color: "#708049",
  },
  icpc: {
    name: "ICPC Kazakhstan",
    track: "Competitive programming",
    text: "Kazakhstan algorithmic programming badge.",
    mark: "{}",
    color: "#b8644c",
  },
};
const decals = {
  coffee: "Pavlodar → Astana",
  cli: ">_ claude --dangerously-skip-permissions",
  think: "✻ Thinking... (42s)",
  ship: "0 errors, 47 warnings // SHIP IT",
};
const nameOf = (k) => credentials[k]?.name || decals[k] || k;

export { credentials, decals, nameOf };
