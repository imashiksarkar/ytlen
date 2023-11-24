import YtService from "./youtube.service"

const ytService = new YtService()

const url =
  "https://youtube.com/playlist?list=PLP1LpTtcP0a2UmI5X1Vv12VF4W7VgUAIn&si=R59bYccXDXIVRhbw,https://youtu.be/r69Q88w3kb1?si=Xub92vbqIOHliSUo,https://youtu.be/r69Q88w3kb2?si=Xub92vbqIOHliSUo,https://youtube.com/playlist?list=PLP1LpTtcP0a2UmI5X1Vv12VF4W7VgUAIn&si=R59bYccXDXIVRhbw,https://youtube.com/playlist?list=PLP1LpTtcP0a2UmI5X1Vv12VF4W7VgUAIn&si=R59bYccXDXIVRhbw,https://youtu.be/r69Q88w3kb3?si=Xub92vbqIOHliSUo,https://youtube.com/playlist?list=PLP1LpTtcP0a2UmI5X1Vv12VF4W7VgUAIn&si=R59bYccXDXIVRhbw,https://youtu.be/r69Q88w3kb4?si=Xub92vbqIOHliSUo,https://youtu.be/r69Q88w3kb5?si=Xub92vbqIOHliSUo,https://youtu.be/r69Q88w3kb6?si=Xub92vbqIOHliSUo,https://youtube.com/playlist?list=PLP1LpTtcP0a2UmI5X1Vv12VF4W7VgUAIn&si=R59bYccXDXIVRhbw,https://youtube.com/playlist?list=PLP1LpTtcP0a2UmI5X1Vv12VF4W7VgUAIn&si=R59bYccXDXIVRhbw,https://youtu.be/r69Q88w3kb1?si=Xub92vbqIOHliSUo"

ytService.getDuration(url).then(console.log).catch(console.log)
