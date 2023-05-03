const axios = require("axios");
const fs = require("fs/promises");

async function downloadTiktokVideo(video_url, save_path) {
  // Retrieve tt value
  const response_0 = await axios.get("https://ssstik.io/en");
  const tt = response_0.data.match(/include-vals[\s\S]*?tt:'(\w+)'/)[1];

  // Retrieve video
  const data = encodeURI(`id=${video_url}&locale=en&tt=${tt}`);
  const headers = {
    authority: "ssstik.io",
    accept: "*/*",
    "accept-language": "en-US,en-GB;q=0.9,en;q=0.8",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "hx-current-url": "https://ssstik.io/en",
    "hx-request": "true",
    "hx-target": "target",
    "hx-trigger": "_gcaptcha_pt",
    origin: "https://ssstik.io",
    pragma: "no-cache",
    referer: "https://ssstik.io/en",
    "sec-ch-ua":
      '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  };

  const response = await axios.post("https://ssstik.io/abc?url=dl", data, {
    headers,
  });
  const download_url = response.data.match(/https:\/\/(.*)tiktokcdn(.*)"/g)[0];

  const match = response.data.match(/<p[^>]*>(.*?)<\/p>/);
  const title = match[1];

  const response_2 = await axios.get(download_url, {
    responseType: "arraybuffer",
  });
  await fs.writeFile(save_path, response_2.data);

  return title.replace(/#/g, "");
}

module.exports = downloadTiktokVideo;
