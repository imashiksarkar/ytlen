const dotenv = require("dotenv");
const axios = require("axios");
// const { google } = require("googleapis");

// init dotenv
dotenv.config();

class Youtube {
  #API_KEY = process.env.API_KEY;
  #PLAYLIST_URL = `https://www.googleapis.com/youtube/v3/playlistItems`;
  #VIDEOS_URL = `https://www.googleapis.com/youtube/v3/videos`;

  #getPlaylistId(playlistLink) {
    if (!playlistLink || typeof playlistLink !== "string") return null;
    const regex = /list=([a-zA-Z0-9_-]+)/;
    const match = playlistLink.match(regex);
    if (!match) return null;
    return match ? match[1] : null;
  }
  async #getVideoIds(playlistId) {
    const res = await axios.get(this.#PLAYLIST_URL, {
      params: {
        part: "snippet",
        maxResults: 50,
        playlistId,
        key: this.#API_KEY,
      },
    });
    //video ids in an array
    return res.data.items.map((video) => video.snippet.resourceId.videoId);
  }
  async #getVideos(videoIds) {
    const res = await axios.get(this.#VIDEOS_URL, {
      params: {
        part: "contentDetails",
        id: videoIds.join(","),
        key: this.#API_KEY,
      },
    });
    return res.data.items;
  }
  #totalLengthInSeconds(durationStr = null) {
    if (!durationStr || typeof durationStr !== "string") return 0;
    const regEx = /\d+[HMS]/g;
    const match = durationStr && durationStr.match(regEx);
    if (!match) return 0;
    const suffix = {
      H: 60 * 60,
      M: 60,
      S: 1,
    };
    const totalLength = match.reduce((acc, curr) => {
      const number = Number(curr.slice(0, -1));
      acc += number * suffix[curr[curr.length - 1]];
      return acc;
    }, 0);
    return totalLength;
  }
  async calcAll(playlistURL) {
    const playlistId = this.#getPlaylistId(playlistURL);
    const videoIds = await this.#getVideoIds(playlistId);
    const videos = await this.#getVideos(videoIds);
    const totalPlaylistLengthInSec = videos.reduce((acc, curr) => {
      acc += this.#totalLengthInSeconds(curr.contentDetails.duration);
      return acc;
    }, 0);
    return totalPlaylistLengthInSec;
  }
  static async getPlaylistDuration(playlistURL) {
    const yt = new this();
    return await yt.calcAll(playlistURL);
  }
}
Youtube.getPlaylistDuration(
  "https://youtube.com/playlist?list=PLXQpH_kZIxTWQfh_krE4sI_8etq5rH_z6"
).then((res) => {
  let secLeft = res;
  const days = parseInt(secLeft / (60 * 60 * 24));
  secLeft = secLeft % (60 * 60 * 24);
  const hours = parseInt(secLeft / (60 * 60));
  secLeft = secLeft % (60 * 60);
  const minutes = parseInt(secLeft / 60);
  secLeft = secLeft % 60;
  console.log(days, "d\n", hours, "h\n", minutes, "m\n", secLeft, "s");
});
