import dotenv from "dotenv"
import Youtube from "./services/YoutubeServices"

// init dotenv
dotenv.config()

const calcDuration = (res: number) => {
  let secLeft = res
  const days = Math.floor(secLeft / (60 * 60 * 24))
  secLeft = secLeft % (60 * 60 * 24)
  const hours = Math.floor(secLeft / (60 * 60))
  secLeft = secLeft % (60 * 60)
  const minutes = Math.floor(secLeft / 60)
  secLeft = secLeft % 60
  console.log(days, "d\n", hours, "h\n", minutes, "m\n", secLeft, "s")
}

const yt = new Youtube()

const main = async () => {
  try {
    const vidRes = await yt.getSingleVideoDetails(
      "https://youtu.be/rePN-VFo1Eo"
    )
    const playlistRes = await yt.getPlaylistDetails(
      "https://youtube.com/playlist?list=PLHiZ4m8vCp9OkrURufHpGUUTBjJhO9Ghy"
    )

    console.log({ vidRes, playlistRes })
  } catch (error) {
    console.log(error)
  }
}

main()
