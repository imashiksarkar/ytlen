import Youtube from "../lib/Youtube"
import Err from "../utils/CustomError"

type ResReturnType = Promise<{
  length: number
  totalResults: number
  resultsPerPage: number
}>

export default class YtDetails extends Youtube {
  // extract playlist id from the playlist url
  private getPlaylistId = (playlistLink: string): string => {
    const regex = /playlist\?list=([a-zA-Z0-9_-]+)/

    const match = playlistLink.match(regex)
    if (!match) throw new Err(400, "Invalid Playlist Url", "getPlaylistId()")

    return match[1]
  }

  // extract video id from the video url
  private getVideoId = (videoUrl: string) => {
    const regex = /https:\/\/youtu.be\/([a-zA-Z0-9_-]+)/
    const idFound = videoUrl.match(regex)

    if (!idFound) {
      throw new Err(400, "Invalid Video Url", "getSingleVideoDetails()")
    }
    return idFound[1]
  }

  getPlaylistDetails = async (playlistURL: string): ResReturnType => {
    try {
      const playlistId = this.getPlaylistId(playlistURL)
      const videoIds = await this.getVideoIds(playlistId)
      const videosDurationString = await this.getVideosDurationString(videoIds)

      const totalLengthInSec =
        this.getTotalLengthInSeconds(videosDurationString)

      return {
        length: totalLengthInSec,
        resultsPerPage: this.RESULTS_PER_PAGE,
        totalResults: this.totalResults,
      }
    } catch (error) {
      throw error
    }
  }

  getSingleVideoDetails = async (url: string): ResReturnType => {
    try {
      const videoId = this.getVideoId(url)
      const vidDurationStr = await this.getVideosDurationString([videoId])
      const durationInSec = this.getTotalLengthInSeconds(vidDurationStr)

      return {
        length: durationInSec,
        resultsPerPage: 1,
        totalResults: 1,
      }
    } catch (error) {
      throw error
    }
  }
}
