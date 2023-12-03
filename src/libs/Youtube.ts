import axios from 'axios'
import { Err } from 'http-staror'
import { validatedEnv } from './utils'

export interface IAxiosResponseType {
  data: {
    pageInfo: { totalResults: number; resultsPerPage: number }
    nextPageToken: string
    items: Array<{
      snippet: {
        resourceId: {
          videoId: string
        }
      }
      contentDetails: {
        duration: string
      }
    }>
  }
}

export default class Youtube {
  private readonly API_KEY = validatedEnv.apiKey
  private readonly PLAYLIST_URL =
    'https://www.googleapis.com/youtube/v3/playlistItems'

  private readonly VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos'
  protected MAX_VIDEO_SUPPORT = 600
  protected RESULTS_PER_PAGE = 50 // max 50
  protected VIDEO_ID_LENGTH = 11 // fixed
  protected totalResults = 0

  // get all the video ids' for the playlist (Max 600 videos)
  protected fetchPlaylist = async (playlistId: string): Promise<string[]> => {
    let pageToken: string | null = null
    const videoIdsArr: string[] = []

    const maxLoopTimes = Math.ceil(
      this.MAX_VIDEO_SUPPORT / this.RESULTS_PER_PAGE
    )

    for (let i = 0; i < maxLoopTimes; i++) {
      try {
        const { data } = (await axios.get(this.PLAYLIST_URL, {
          params: {
            part: 'snippet',
            maxResults: this.RESULTS_PER_PAGE,
            playlistId,
            pageToken,
            key: this.API_KEY,
          },
        })) as IAxiosResponseType

        // next page token for next request
        pageToken = data.nextPageToken

        if (!this.totalResults) {
          this.totalResults = data.pageInfo.totalResults
          if (data.pageInfo.totalResults > this.MAX_VIDEO_SUPPORT) {
            this.totalResults = this.MAX_VIDEO_SUPPORT
          }
        }

        // push all the video id's into the "videoIdsArr" array
        data.items.forEach((video) =>
          videoIdsArr.push(video.snippet.resourceId.videoId)
        )

        if (!pageToken) break
      } catch (error) {
        throw Err.setStatus('BadRequest')
          .setMessage('Invalid Playlist ID!')
          .setFilePath(__dirname)
          .setWhere('getVideoIdsForAPlaylist()')
      }
    }

    return videoIdsArr
  }

  protected fetchVideosDuration = async (videosString: string) => {
    // request for every 50 videos (if possible)
    return await axios.get<unknown, IAxiosResponseType>(this.VIDEOS_URL, {
      params: {
        part: 'contentDetails',
        id: videosString,
        key: this.API_KEY,
      },
    })
  }
}
