import YtService from "../services/youtube.service"

const ytService = new YtService()

const url =
  "https://youtube.com/playlist?list=PL6XT0grm_TfgtwtwUit305qS-HhDvb4du&si=FGu1UubCFb1YeSKU,https://youtube.com/playlist?list=PL6XT0grm_TfgtwtwUit305qS-HhDvb4du&si=FGu1UubCFb1YeSKU,https://youtube.com/playlist?list=PL6XT0grm_TfgtwtwUit305qS-HhDvb4du&si=FGu1UubCFb1YeSKU,https://youtube.com/playlist?list=PL6XT0grm_TfgtwtwUit305qS-HhDvb4du&si=FGu1UubCFb1YeSKU,https://youtube.com/playlist?list=PL6XT0grm_TfgtwtwUit305qS-HhDvb4du&si=FGu1UubCFb1YeSKU"

ytService.getDuration(url).then(console.log).catch(console.log)
