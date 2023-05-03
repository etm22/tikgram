const extractFrames = require("ffmpeg-extract-frames");
const InstagramPublisher = require("instagram-publisher");
const fs = require("fs/promises");
require("dotenv").config();

(async () => {
  const video_path = "outputs/final_video.mp4";
  const thumbnail_path = "outputs/thumbnail.jpg";

  // create thumbnail
  await extractFrames({
    input: video_path,
    output: thumbnail_path,
    offsets: [1000],
  });

  const video_data = JSON.parse(await fs.readFile("outputs/video_data.json"));

  const reel_data = {
    video_path,
    thumbnail_path,
    caption: video_data.instagram_caption,
  };

  const client = new InstagramPublisher({
    email: process.env.IG_EMAIL,
    password: "process.env.IG_PASSWORD",
    verbose: true,
  });

  await client.createReel(reel_data);
})();
