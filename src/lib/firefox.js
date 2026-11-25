export async function loadFirefoxStyles() {
  const entries = await Promise.all(
    ["claude-code", "vibe-coding"].map(async (theme) => {
      const sheets = await Promise.all(
        ["userChrome.css", "userContent.css"].map(async (name) => {
          const response = await fetch(
            new URL(
              "../../assets/firefox/" + theme + "/" + name,
              import.meta.url,
            ),
          );
          if (!response.ok) throw new Error("Cannot load " + name);
          return [name, await response.text()];
        }),
      );
      return [theme, Object.fromEntries(sheets)];
    }),
  );
  return Object.fromEntries(entries);
}
