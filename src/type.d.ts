interface IResultItem {
    _id: string,
    text: string,
    type: string
}

type ApiDataType = {
  message: string
  status: string
  results: IResultItem[]
}
