const videos = document.querySelectorAll(".tiktok-x6y88p-DivItemContainerV2");
const video_urls = Array.from(videos).map((v) => v.querySelector("a").href);
const video_data = video_urls.map((v) => {
  return {
    link: v,
    posted: false,
  };
});
localStorage.setItem("video_data", JSON.stringify(video_data));
