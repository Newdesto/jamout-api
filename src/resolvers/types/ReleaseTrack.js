const ReleaseTrack = `
  type ReleaseTrack {
    position: Int!,
    title: String!,
    isExplicit: Boolean!,
    s3Key: String!,
  }
`
export default () => [
  ReleaseTrack
]
