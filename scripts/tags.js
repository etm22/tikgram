const fs = require("fs/promises");

(async () => {
  const tags = JSON.parse(await fs.readFile("tags.json", "utf-8"));

  // console.log(tags.map((t) => t.keyword).join(", "));

  const output = tags.data.similarHashtagsLists
    .map((t) => t.hashtags.map((s) => `#${s.name}`))
    .flat();
  await fs.writeFile("out.json", JSON.stringify({ tags: output }));
})();
