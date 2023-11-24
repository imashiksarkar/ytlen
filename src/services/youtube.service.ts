import { Err } from "http-staror"
import Youtube, { type IAxiosResponseType } from "../libs/Youtube"

type ResReturnType = Promise<{
  length: number
  totalResults: number
  resultsPerPage: number
}>

export default class YtDetails extends Youtube {
  getDuration = async (urls: string): ResReturnType => {
    const urlStringsArray = this.parseVideosAndPlaylistsIdsFromUrl(urls)

    if (!urlStringsArray)
      throw Err.setStatus("BadRequest").setMessage("Url is invalid!")

    const videoIdsArr = await this.getVideosIdsArray(urlStringsArray)

    const videoIdsString = await this.getVideoIdsString(videoIdsArr)

    // loop for every 50 videos ( promise.all() )
    const duration = await this.fetchVideosDuration(videoIdsString)

    const durationString = this.getDurationString(duration)

    return this.getTotalLengthInSeconds(durationString)
  }

  private getDurationString = (duration: IAxiosResponseType) =>
    duration.data.items.reduce(
      (prev, currItem) => prev + currItem.contentDetails.duration,
      ""
    )

  private isVideoId = (id: string) => id.length === 11

  private isPlaylistId = (id: string) => id.length === 34

  // videos ids will have "/" and playlist ids will have "=" as prefix
  private parseVideosAndPlaylistsIdsFromUrl = (url: string) =>
    url
      .match(/(\/(\w{11}))|(=(\w{34}))/g)
      ?.map((idWithPrefix) => idWithPrefix.slice(1))

  /**
   *
   * @param videosAndPlaylistsIdsFromUrl
   * @returns fetchIds[
   * vid-1,
   * [p-1, p-2],
   * vid-2
   * ]
   */
  private getVideosIdsArray = async (
    videosAndPlaylistsIdsFromUrl: string[]
  ) => {
    const playlistsIndexInIdStrArr: [number, string][] = []
    const idStrArr: (string | string[])[] = []

    const maxLoopTime = Math.min(
      videosAndPlaylistsIdsFromUrl?.length || 0,
      this.RESULTS_PER_PAGE
    )

    for (let i = 0; i < maxLoopTime; i++) {
      const id = videosAndPlaylistsIdsFromUrl[i]

      if (this.isVideoId(id)) {
        idStrArr.push(id)
      } else if (this.isPlaylistId(id)) {
        playlistsIndexInIdStrArr.push([idStrArr.length, id])
        idStrArr.push([])
      }
    }

    let numberOfIdsFilled = 0,
      remainingSpaceForIds = this.RESULTS_PER_PAGE

    // populate the ids array with playlist's ids
    for (let i = 0; i < playlistsIndexInIdStrArr.length; i++) {
      // current playlist id index in idStrArr
      const currentPointer = playlistsIndexInIdStrArr[i][0]
      const currentPlaylistId = playlistsIndexInIdStrArr[i][1]

      // video ids in between playlist ids
      const leftOverVal =
        i > 0 ? currentPointer - playlistsIndexInIdStrArr[i - 1][0] - 1 : 0

      // if there are left over values
      remainingSpaceForIds -= leftOverVal
      numberOfIdsFilled = this.RESULTS_PER_PAGE - remainingSpaceForIds

      if (numberOfIdsFilled >= this.RESULTS_PER_PAGE) break

      // get the playlist ids here (fetch the playlists)
      const randomPlaylistIds = await this.fetchPlaylist(currentPlaylistId)
      // splice the ids for the remaining's, cut down extras
      randomPlaylistIds.splice(remainingSpaceForIds)

      // update the playlists id status
      numberOfIdsFilled = randomPlaylistIds.length + numberOfIdsFilled
      remainingSpaceForIds = Math.max(
        0,
        this.RESULTS_PER_PAGE - numberOfIdsFilled
      )

      idStrArr[currentPointer] = randomPlaylistIds

      idStrArr.splice(currentPointer + remainingSpaceForIds + 1)
    }

    return idStrArr
  }

  private getVideoIdsString = (videosIdsArray: (string | string[])[]) => {
    let videoIdsString = videosIdsArray.toString()

    videoIdsString = videoIdsString.replace(/,+/g, ",") // string cleanup

    if (videoIdsString.startsWith(","))
      videoIdsString = videoIdsString.slice(1, videoIdsString.length)
    if (videoIdsString.endsWith(","))
      videoIdsString = videoIdsString.slice(0, videoIdsString.length - 1)

    return videoIdsString
  }

  // get total length in seconds from the duration string
  private getTotalLengthInSeconds = (durationStr: string) => {
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
