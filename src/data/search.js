const prefixes = ["claude", "ask", "gh", "google"];
const commands = {
  help: "Show the command palette",
  theme: "Open Theme Admin",
  pet: "Pet your companion",
  confetti: "Celebrate a build",
  claude: "Draft a Claude prompt",
  ask: "Ask ChatGPT",
  gh: "Search GitHub",
  google: "Search the web",
};
const hosts = {
  claude: "https://claude.ai/new?q=",
  ask: "https://chatgpt.com/?q=",
  gh: "https://github.com/search?q=",
  google: "https://www.google.com/search?q=",
};
const labels = {
  claude: "Draft a Claude prompt…",
  ask: "Ask ChatGPT…",
  gh: "Search repositories, code, or issues…",
  google: "Search the web, or type /help…",
};

export { prefixes, commands, hosts, labels };
