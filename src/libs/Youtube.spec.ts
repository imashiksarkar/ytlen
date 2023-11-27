import ytLib from "./Youtube"

const yt = new ytLib()

const main = async () => {
  try {
    // const ids = await yt.fetchPlaylist("PL8p2I9GklV47f0ZedfW67mM7PP74txHdw")
    // console.log(ids.length)

    let string =
      ",,,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,,,,5b3EeDJ_lus,,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,5b3EeDJ_lus,cjuMtb_5uJw,6zVyRdCt8RE,l6nKp9DCajo,niXPa6QRLc0,7Ul8xuWVsoU,swGeojrKRAo,hwCnYnZU-ag,-rJwa9UOn3E,92wVnuYAaFE,FaHetnuzBdM,7lN91jE5Pf8,a4Dzre1DtuM,AxnsCLDf3wc,ttv5KX0aknU,cASEJpkbeyU,NOnv4Evud7M"

    string = string.replace(/,+/g, ",")
    if (string.startsWith(",")) string = string.slice(1, string.length)
    if (string.endsWith(",")) string = string.slice(0, string.length - 1)

    // const duration = (await yt.fetchVideosDuration(string)).data.items.map(
    //   (item) => item.contentDetails.duration
    // )
    // console.log(duration.length)
  } catch (error) {
    console.log(error)
  }
}

// main()
