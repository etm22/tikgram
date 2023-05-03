const fs = require("fs/promises");

(async () => {
  const videos = JSON.parse(await fs.readFile("data/videos.json", "utf-8"));
  const posted = videos.filter((v) => v.posted);

  const readme_data = `# Stats
${posted.length}/${videos.length} videos posted
`;

  await fs.writeFile("README.md", readme_data);
})();
