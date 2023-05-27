import dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";

// init dotenv
dotenv.config();

interface AxiosResponseType {
  data: {
    pageInfo: { totalResults: number; resultsPerPage: number };
    nextPageToken: string;
    items: {
      snippet: {
        resourceId: {
          videoId: string;
        };
      };
    }[];
  };
}

class Youtube {
  private API_KEY = process.env.API_KEY;
  private PLAYLIST_URL = `https://www.googleapis.com/youtube/v3/playlistItems`;

  private nextPageToken: string | null = null;

  private VIDEOS_URL = `https://www.googleapis.com/youtube/v3/videos`;

  private getPlaylistId(playlistLink: string): string | void {
    if (!playlistLink || typeof playlistLink !== "string") return;
    const regex = /list=([a-zA-Z0-9_-]+)/;
    const match = playlistLink.match(regex);
    if (!match) return;
    return match[1];
  }

  private async getVideoIds(playlistId: string): Promise<string[]> {
    const videoIdsArr: string[] = [];
    for (let i = 0; i < 12; i++) {
      const { data }: AxiosResponseType = await axios.get(this.PLAYLIST_URL, {
        params: {
          part: "snippet",
          maxResults: 50,
          playlistId,
          pageToken: this.nextPageToken,
          key: this.API_KEY,
        },
      });

      this.nextPageToken = data.nextPageToken;

      data.items.map((video) =>
        videoIdsArr.push(video.snippet.resourceId.videoId)
      );

      if (!this.nextPageToken) break;
    }

    return videoIdsArr;
  }

  private async getVideos(videoIds: string[]): Promise<
    | {
        contentDetails: {
          duration: string;
        };
      }[]
    | void
  > {
    try {
      const loopMaxTime = Math.ceil(videoIds.length / 50);
      let totalVidsArr: {
        contentDetails: {
          duration: string;
        };
      }[] = [];

      const vidsPormises: Promise<{
        data: {
          items: {
            contentDetails: {
              duration: string;
            };
          }[];
        };
      }>[] = [];

      for (let i = 0; i < loopMaxTime; i++) {
        const res = axios.get(this.VIDEOS_URL, {
          params: {
            part: "contentDetails",
            id: videoIds.slice(50 * i, 50 * (i + 1)).join(","),
            key: this.API_KEY,
          },
        });
        vidsPormises.push(res);
      }

      return Promise.all(vidsPormises).then((res) => {
        res.forEach((singlePromise) => {
          totalVidsArr = [...totalVidsArr, ...singlePromise.data.items];
        });

        return totalVidsArr;
      });
    } catch (error) {
      console.log(error, "getVideos()");
    }
  }

  private totalLengthInSeconds(durationStr: string | null = null) {
    if (!durationStr || typeof durationStr !== "string") return 0;

    const regEx = /\d+[HMS]/g;
    const match = durationStr && durationStr.match(regEx);
    if (!match) return 0;
    const suffix = {
      H: 60 * 60,
      M: 60,
      S: 1,
    };
    const totalLength = match.reduce((acc: number, curr: string) => {
      const number = Number(curr.slice(0, -1));

      const lastAlphabet = curr[curr.length - 1] as "H" | "M" | "S";
      acc += number * suffix[lastAlphabet];

      return acc;
    }, 0);

    return totalLength;
  }

  private async calcAll(playlistURL: string): Promise<number | void> {
    const playlistId = this.getPlaylistId(playlistURL);

    if (!playlistId) return;

    const videoIds = await this.getVideoIds(playlistId);

    const videos = await this.getVideos(videoIds);

    const totalPlaylistLengthInSec = videos?.reduce((acc: number, curr) => {
      acc += this.totalLengthInSeconds(curr.contentDetails.duration);
      return acc;
    }, 0);
    return totalPlaylistLengthInSec;
  }

  static async getPlaylistDuration(playlistURL: string) {
    const yt = new Youtube();
    return await yt.calcAll(playlistURL);
  }
}

console.clear();

const calcDuration = (res: number) => {
  let secLeft = res;
  const days = Math.floor(secLeft / (60 * 60 * 24));
  secLeft = secLeft % (60 * 60 * 24);
  const hours = Math.floor(secLeft / (60 * 60));
  secLeft = secLeft % (60 * 60);
  const minutes = Math.floor(secLeft / 60);
  secLeft = secLeft % 60;
  console.log(days, "d\n", hours, "h\n", minutes, "m\n", secLeft, "s");
};
Youtube.getPlaylistDuration(
  "https://youtube.com/playlist?list=PLHiZ4m8vCp9OkrURufHpGUUTBjJhO9Ghy"
).then((res: number | void) => {
  if (!res) return;
  calcDuration(res);
  console.log(res, 1 * 24 * 60 * 60 + 9 * 60 * 60 + 30 * 60 + 15);
});
