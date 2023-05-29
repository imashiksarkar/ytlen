export interface AxiosResponseType {
  data: {
    pageInfo: { totalResults: number; resultsPerPage: number }
    nextPageToken: string
    items: {
      snippet: {
        resourceId: {
          videoId: string
        }
      }
    }[]
  }
}
