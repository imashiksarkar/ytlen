import { Err } from 'http-staror'
import Youtube, { type IAxiosResponseType } from '../libs/Youtube'

interface IDurationReturnType {
  length: number
  totalResults: number
}

export default class YtDetails extends Youtube {
  getDuration = async (urls: string): Promise<IDurationReturnType> => {
    const urlStringsArray = this.parseVideosAndPlaylistsIdsFromUrl(urls)

    if (!urlStringsArray) {
      throw Err.setStatus('BadRequest').setMessage('Url is invalid!')
    }

    const videoIdsArr = await this.getVideosIdsArray(urlStringsArray)

    const videoIdsString = this.getVideoIdsString(videoIdsArr)

    if (videoIdsString.length < 11) {
      throw Err.setStatus('BadRequest').setMessage('Invalid Url!')
    }

    const fetchVideosDurationPromises: Array<Promise<IAxiosResponseType>> = []

    this.strSlice(videoIdsString, (slicedVideoIdsString: string) => {
      // loop for every 50 videos ( promise.all() )
      fetchVideosDurationPromises.push(
        this.fetchVideosDuration(slicedVideoIdsString)
      )
    })

    const videosDuration = await Promise.all(fetchVideosDurationPromises)

    let totalResults = 0
    let totalDurationString = ''
    videosDuration.forEach((duration) => {
      totalResults += duration.data.pageInfo.totalResults
      const durationString = this.getDurationString(duration)
      totalDurationString += durationString
    })

    return {
      length: this.getTotalLengthInSeconds(totalDurationString),
      totalResults,
    }
  }

  private readonly strSlice = (videoIds: string, cb: (res: string) => void) => {
    const numberOfIdsAtOnce = this.RESULTS_PER_PAGE
    const idLen = numberOfIdsAtOnce * 11 + (numberOfIdsAtOnce - 1)

    let start = 0
    let end = idLen

    while (true) {
      const strChunk = videoIds.slice(start, end)
      if (strChunk.length < 10) break
      start = end + 1
      end = start + idLen
      cb(strChunk)
    }
  }

  private readonly getDurationString = (duration: IAxiosResponseType) =>
    duration.data.items.reduce(
      (prev, currItem) => prev + currItem.contentDetails.duration,
      ''
    )

  private readonly isVideoId = (id: string) => id.length === 11

  private readonly isPlaylistId = (id: string) => id.length === 34

  // videos ids will have "/" and playlist ids will have "=" as prefix
  private readonly parseVideosAndPlaylistsIdsFromUrl = (url: string) =>
    url
      .match(/(\/[a-z0-9_-]{11})|(=[a-z0-9_-]{34})/gi)
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
  private readonly getVideosIdsArray = async (
    videosAndPlaylistsIdsFromUrl: string[]
  ) => {
    const idStrArr: Array<string | string[]> = []
    const mapPlylstIndxToIdStrArr: number[] = []
    // promises of playlist fetch
    const playlistsPromises: Array<Promise<string[]>> = []

    // const playlistsIndexesAndPromises: [number[]] = [[], []]

    const maxLoopTime = Math.min(
      videosAndPlaylistsIdsFromUrl?.length || 0,
      this.RESULTS_PER_PAGE
    )

    for (let i = 0; i < maxLoopTime; i++) {
      const id = videosAndPlaylistsIdsFromUrl[i]

      if (this.isVideoId(id)) {
        idStrArr.push(id)
      } else if (this.isPlaylistId(id)) {
        // current index is to be populated
        mapPlylstIndxToIdStrArr.push(idStrArr.length)

        // store the promises
        playlistsPromises.push(this.fetchPlaylist(id))

        // add empty array for now, later it will be populated with actual array of video ids
        idStrArr.push([])
      }
    }

    let numberOfIdsFilled = 0
    let remainingSpaceForIds = this.MAX_VIDEO_SUPPORT

    // fetch the playlists here (populate)
    try {
      const resolvedPlaylists = await Promise.all(playlistsPromises)

      mapPlylstIndxToIdStrArr.forEach((currPlaylistIndxInIdStrArr, index) => {
        // for the first time, number of previously filled ids
        if (index === 0) {
          numberOfIdsFilled = currPlaylistIndxInIdStrArr
          remainingSpaceForIds = this.MAX_VIDEO_SUPPORT - numberOfIdsFilled
        } else {
          // here index can't be 0

          const prevPlylstIndxInIdStrArr = mapPlylstIndxToIdStrArr[index - 1]

          // the number of video ids are skipped between two playlist ids
          const skippedIds =
            currPlaylistIndxInIdStrArr - prevPlylstIndxInIdStrArr - 1

          numberOfIdsFilled += skippedIds
          remainingSpaceForIds = this.MAX_VIDEO_SUPPORT - numberOfIdsFilled
        }

        const currentPlaylist = resolvedPlaylists[index]
        currentPlaylist.splice(remainingSpaceForIds) // fix the current playlist size

        // calculate the remaining's and filled's
        numberOfIdsFilled += currentPlaylist.length
        remainingSpaceForIds = this.MAX_VIDEO_SUPPORT - numberOfIdsFilled

        // populate the playlist ids
        idStrArr[currPlaylistIndxInIdStrArr] = currentPlaylist
        idStrArr.splice(currPlaylistIndxInIdStrArr + remainingSpaceForIds + 1)
      })
    } catch (error: unknown) {
      throw Err.setStatus('InternalServerError').setMessage(
        'Something went wrong!'
      )
    }

    return idStrArr
  }

  private readonly getVideoIdsString = (
    videosIdsArray: Array<string | string[]>
  ) => {
    let videoIdsString = videosIdsArray.toString()

    videoIdsString = videoIdsString.replace(/,+/g, ',') // string cleanup

    if (videoIdsString.startsWith(',')) {
      videoIdsString = videoIdsString.slice(1, videoIdsString.length)
    }
    if (videoIdsString.endsWith(',')) {
      videoIdsString = videoIdsString.slice(0, videoIdsString.length - 1)
    }

    return videoIdsString
  }

  // get total length in seconds from the duration string
  private readonly getTotalLengthInSeconds = (durationStr: string) => {
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

      const lastAlphabet = curr[curr.length - 1] as 'H' | 'M' | 'S'
      acc += number * suffix[lastAlphabet]

      return acc
    }, 0)

    return totalLength
  }
}
