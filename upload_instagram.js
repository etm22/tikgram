const extractFrames = require("ffmpeg-extract-frames");
const InstagramPublisher = require("instagram-publisher");
const fs = require("fs/promises");
const axios = require("axios");
const {
  generateInstagramTagsChatgpt,
} = require("./services/get_instagram_tags");
require("dotenv").config();

(async () => {
  const video_path = "outputs/out.mp4";
  const thumbnail_path = "outputs/thumbnail.jpg";

  // get cookies from api
  const account_name = process.argv[2];
  const cookies = await axios.get(
    `${process.env.COOKIES_API_URL}/ig/${account_name}`
  );
  await fs.writeFile("cookies.json", JSON.stringify(cookies.data));

  // create thumbnail
  await extractFrames({
    input: video_path,
    output: thumbnail_path,
    offsets: [1000],
  });

  const video_data = JSON.parse(await fs.readFile("outputs/video_data.json"));

  // create video data
  const instagram_tags = generateInstagramTagsChatgpt();
  const reel_data = {
    video_path,
    thumbnail_path,
    caption:
      video_data.instagram_caption +
      "\n" +
      new Date().toISOString() +
      "\n" +
      instagram_tags.join(" "),
  };

  const client = new InstagramPublisher({
    email: account_name,
    password: "process.env.IG_PASSWORD",
    verbose: true,
  });

  await client.createReel(reel_data);
})();
