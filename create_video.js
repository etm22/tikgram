const downloadTiktokVideo = require("./services/download_tiktok_video");
const { execSync } = require("child_process");
const fs = require("fs/promises");
const { shuffleArray } = require("./services/utils");

const video_path = "outputs/video.mp4";
const video_manipulated_path = "outputs/video_manipulated.mp4";

(async () => {
  // Get video url
  const videos = shuffleArray(
    JSON.parse(await fs.readFile("data/videos.json", "utf-8"))
  );
  const video_url = videos.filter((v) => !v.posted)[0].link;

  // Download video without watermark
  await downloadTiktokVideo(video_url, video_path);

  manipulateVideo(video_manipulated_path);

  const video_texts = [
    ["Learn how to become a", "millionaire using ChatGPT"],
    ["Live your dream life", "using ChatGPT"],
    ["Learn how to make", "money using ChatGPT"],
    ["Become a ChatGPT", "millionaire in 2023"],
    ["Unlock your future", "with ChatGPT"],
    ["Become financially free", "using ChatGPT"],
    ["Learn about the", "ChatGPT money glitch"],
    ["Make passive income", "from ChatGPT"],
    ["Learn how to", "monetise ChatGPT in 2023"],
    ["Retire in your 30s", "using ChatGPT"],
    ["ChatGPT can change your", "life. Learn more at"],
    ["Make money from ChatGPT", "before it is too late"],
    ["Did you know about the", "ChatGPT money glitch?"],
    ["Did you know that", "ChatGPT can make you rich?"],
    ["Only 1% know about the", "ChatGPT money glitch"],
  ];
  const video_text =
    video_texts[Math.floor(Math.random() * video_texts.length)];
  addTextToVideo(video_text[0], video_text[1], `outputs/final_video.mp4`);

  // change aspect ratio
  execSync(
    `ffmpeg -i outputs/final_video.mp4 -c copy -aspect 9/16 outputs/out.mp4`
  );

  // update videos.json
  const new_videos = videos.map((v) => {
    if (v.link === video_url) {
      v.posted = true;
    }
    return v;
  });
  await fs.writeFile("data/videos.json", JSON.stringify(new_videos));

  const video_data = {
    instagram_caption: `${video_text.join(" ")}`,
  };
  await fs.writeFile("outputs/video_data.json", JSON.stringify(video_data));
})();

function addTextToVideo(text1, text2, save_path) {
  const ffmpeg_cmd = `ffmpeg -loglevel error -y -i ${video_manipulated_path} -vf "drawtext=fontfile='./font.ttf':text='${text1}':fontcolor=white:fontsize=28:box=1:boxcolor=black@0.8:boxborderw=7:x=(w-text_w)/2:y=(h-text_h)/2-60, drawtext=fontfile='./font.ttf':text='${text2}':fontcolor=white:fontsize=28:box=1:boxcolor=black@0.8:boxborderw=7:x=(w-text_w)/2:y=(h-text_h)/2, drawtext=text='www.uncashy.com':fontcolor=yellow:fontsize=28:fontfile=font.ttf:box=1:boxcolor=black@0.8:boxborderw=5:x=(w-text_w)/2:y=(h-text_h)/2+60" -codec:a copy ${save_path}
    `;

  execSync(ffmpeg_cmd);
}

function manipulateVideo(output_path) {
  execSync("python manipulate_video.py " + output_path);
}
