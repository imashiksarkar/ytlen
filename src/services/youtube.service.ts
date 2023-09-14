import Youtube from "../lib/Youtube"
import { Err } from "http-staror"

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

    if (!match)
      throw Err.setStatus("BadRequest")
        .setMessage("Invalid Playlist Url!")
        .setWhere("getPlaylistId()")

    return match[1]
  }

  // extract video id from the video url
  private getVideoIdFromASingleVideo = (videoUrl: string) => {
    const regex = /https:\/\/youtu.be\/([a-zA-Z0-9_-]+)/
    const idFound = videoUrl.match(regex)

    if (!idFound) {
      throw Err.setStatus("BadRequest")
        .setMessage("Invalid Video Url!")
        .setWhere("getSingleVideoDetails()")
    }
    return idFound[1]
  }

  // returns playlist duration details given a playlist url
  getPlaylistDetails = async (playlistURL: string): ResReturnType => {
    // eslint-disable-next-line no-useless-catch
    try {
      const playlistId = this.getPlaylistId(playlistURL)
      const videoIdsArr = await this.getVideoIdsForAPlaylist(playlistId)
      const videosDurationString = await this.getVideosDurationString(
        videoIdsArr
      )

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

  // returns a video ids' array given a video urls' array
  getAllVideoIds = (urlArr: string[]): string[] => {
    return urlArr.map((url) => this.getVideoIdFromASingleVideo(url))
  }

  // returns videos duration given one or multiple videos url
  getVideoDetails = async (url: string): ResReturnType => {
    const urlArr = url.split(";") // video url's array
    const videoIdArr = this.getAllVideoIds(urlArr)

    // eslint-disable-next-line no-useless-catch
    try {
      const vidDurationStr = await this.getVideosDurationString(videoIdArr)
      const durationInSec = this.getTotalLengthInSeconds(vidDurationStr)

      return {
        length: durationInSec,
        resultsPerPage: 1,
        totalResults: videoIdArr.length,
      }
    } catch (error) {
      throw error
    }
  }
}
