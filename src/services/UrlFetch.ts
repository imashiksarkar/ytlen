class UrlFetch {
  private maxVideosIds = 50

  private generateRandomString = (length: number) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let randomString = ""

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.round(Math.random() * characters.length)
      randomString += characters.charAt(randomIndex)
    }

    return randomString
  }

  private getRandomPlaylistIds = () => {
    const arr = []
    const randomNumber = Math.round(Math.random() * 15) + 1
    for (let i = 0; i < randomNumber; i++) {
      arr.push(this.generateRandomString(11))
    }
    return arr
  }

  private isVideoId = (id: string) => id.length === 11

  private isPlaylistId = (id: string) => id.length === 34

  private getVideosAndPlaylistsIdsArray = (url: string) =>
    url.match(/(\/(\w{11}))|(=(\w{34}))/g)

  private getVideosIdsArray = (idsArray: string[]) => {
    const playlistsIndexInIdStrArr: number[] = []
    const idStrArr: (string | string[])[] = []

    const maxLoopTime = Math.min(idsArray?.length || 0, this.maxVideosIds)

    for (let i = 0; i < maxLoopTime; i++) {
      const id = idsArray[i].slice(1) // remove the prefix (/ or =)

      if (this.isVideoId(id)) {
        idStrArr.push(id)
      } else if (this.isPlaylistId(id)) {
        playlistsIndexInIdStrArr.push(idStrArr.length)
        idStrArr.push([])
      }
    }

    let numberOfIdsFilled = 0,
      remainingSpaceForIds = this.maxVideosIds

    // populate the ids array with playlist's ids
    for (let i = 0; i < playlistsIndexInIdStrArr.length; i++) {
      // current playlist id index in idStrArr
      const currentPointer = playlistsIndexInIdStrArr[i]

      // video ids in between playlist ids
      const leftOverVal =
        i > 0 ? currentPointer - playlistsIndexInIdStrArr[i - 1] - 1 : 0

      // if there are left over values
      remainingSpaceForIds -= leftOverVal
      numberOfIdsFilled = this.maxVideosIds - remainingSpaceForIds

      if (numberOfIdsFilled >= this.maxVideosIds) break

      // get the playlist ids here (fetch the playlists)
      const randomPlaylistIds = this.getRandomPlaylistIds()
      // splice the ids for the remaining's, cut down extras
      randomPlaylistIds.splice(remainingSpaceForIds)

      // update the playlists id status
      numberOfIdsFilled = randomPlaylistIds.length + numberOfIdsFilled
      remainingSpaceForIds = Math.max(0, this.maxVideosIds - numberOfIdsFilled)

      idStrArr[currentPointer] = randomPlaylistIds

      idStrArr.splice(currentPointer + remainingSpaceForIds + 1)
    }

    return idStrArr
  }

  getVideosString = (url: string) => {
    const idsArray = this.getVideosAndPlaylistsIdsArray(url) || []

    return this.getVideosIdsArray(idsArray)
  }
}

export default new UrlFetch()
