import axios from "axios"
import Err from "../../utils/CustomError"
import type { AxiosResponseType } from "./index.d"

export default class Youtube {
  private API_KEY = process.env.API_KEY
  private PLAYLIST_URL = `https://www.googleapis.com/youtube/v3/playlistItems`
  private VIDEOS_URL = `https://www.googleapis.com/youtube/v3/videos`
  protected MAX_VIDEO_SUPPORT = 600
  protected RESULTS_PER_PAGE = 50
  protected totalResults = 0

  // get all the video id's from the playsist (Max 600 videos)
  protected getVideoIdsForAPlaylist = async (
    playlistId: string
  ): Promise<string[]> => {
    let pageToken: string | null = null
    const videoIdsArr: string[] = []

    const maxLoopTimes = Math.ceil(
      this.MAX_VIDEO_SUPPORT / this.RESULTS_PER_PAGE
    )

    for (let i = 0; i < maxLoopTimes; i++) {
      try {
        const { data } = (await axios.get(this.PLAYLIST_URL, {
          params: {
            part: "snippet",
            maxResults: 50,
            playlistId,
            pageToken,
            key: this.API_KEY,
          },
        })) as AxiosResponseType

        // next page token for next request
        pageToken = data.nextPageToken

        if (!this.totalResults) {
          this.totalResults = data.pageInfo.totalResults
          if (data.pageInfo.totalResults > this.MAX_VIDEO_SUPPORT)
            this.totalResults = this.MAX_VIDEO_SUPPORT
        }

        // push all the video id's into the "videoIdsArr" array
        data.items.forEach((video) =>
          videoIdsArr.push(video.snippet.resourceId.videoId)
        )

        if (!pageToken) break
      } catch (error) {
        throw new Err(
          400,
          "Invalid Playlist Url",
          "getVideoIdsForAPlaylist()",
          __filename
        )
      }
    }

    return videoIdsArr
  }

  // get all the videos details for the given video id's
  protected getVideosDurationString = async (
    videoIds: string[]
  ): Promise<string> => {
    let totalDurationString = ""
    const maxLoopTime = Math.ceil(videoIds.length / 50)

    const vidsPormises: Promise<{
      data: {
        items: {
          contentDetails: {
            duration: string
          }
        }[]
      }
    }>[] = []
    try {
      for (let i = 0; i < maxLoopTime; i++) {
        // concat 50 video ids at once then fetch details from the server
        const videoIdsStrChunk = videoIds.slice(50 * i, 50 * (i + 1)).join(",")

        // requesr for every 50 videos (if possible)
        const res = axios.get(this.VIDEOS_URL, {
          params: {
            part: "contentDetails",
            id: videoIdsStrChunk,
            key: this.API_KEY,
          },
        })

        // store unresolved promises
        vidsPormises.push(res)
      }

      // resolve all promises
      return Promise.all(vidsPormises).then((res) => {
        // loop over all the resolved promises
        res.forEach((singlePromise) => {
          // loop over individual resolved promise items
          singlePromise.data.items.forEach((singleVideo) => {
            totalDurationString += singleVideo.contentDetails.duration
          })
        })

        return totalDurationString
      })
    } catch (error) {
      throw new Err(500, "Internal Server Error", "getVideosDurationString()")
    }
  }

  // get total length in seconds
  protected getTotalLengthInSeconds = (durationStr: string) => {
    const regEx = /\d+[HMS]/g

    const match = durationStr.match(regEx)
    if (!match) return 0

    const suffix = {
      H: 60 * 60,
      M: 60,
      S: 1,
    }

    const totalLength = match.reduce((acc: number, curr: string) => {
      const number = Number(curr.slice(0, -1))

      const lastAlphabet = curr[curr.length - 1] as "H" | "M" | "S"
      acc += number * suffix[lastAlphabet]

      return acc
    }, 0)

    return totalLength
  }
}
