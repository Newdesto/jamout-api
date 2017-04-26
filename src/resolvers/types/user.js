import AWS from 'aws-sdk'

const s3 = new AWS.S3()

const resolvers = {
  avatarUrl(user) {
    if (!user.avatarKey) {
      return null
    }

    const params = { Bucket: 'jamout-profile', Key: `${user.id}/avatar.png` }
    const url = s3.getSignedUrl('getObject', params)
    return url
  },
  async connections(user, args, { user: currentUser, Connection }) {
    if (!currentUser) {
      throw new Error('Authentication failed.')
    }

    const connections = await Connection.getConnections(user.id)
    return connections
  },
  async connected(user, args, { user: currentUser, Connection }) {
    if (!currentUser) {
      throw new Error('Authentication failed.')
    }
    // Can't be connected with yourself buddy.
    if (user.id === currentUser.id) {
      return null
    }

    // Does the connection exist?
    const exists = await Connection.connectionExists(currentUser.id, user.id)
    if (!exists) {
      return null
    }

    // One exists, so return the status enum.
    return {
      c: 'CONFIRMED',
      a: 'ACTION',
      p: 'PENDING'
    }[exists.status]
  },
  async tracks({ id }, args, { user, Track }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    if (!id) {
      return null
    }

    const tracks = await Track.fetchByUserId(id)
    return tracks
  }
}

export default resolvers
