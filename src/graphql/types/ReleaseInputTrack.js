const ReleaseInputTrack = `
  input ReleaseInputTrack {
    position: Int!,
    title: String!,
    isExplicit: Boolean!,
    s3Key: String!,
  }
`
export default () => [
  ReleaseInputTrack
]
