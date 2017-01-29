import AWS from 'aws-sdk'

const s3 = new AWS.S3()

const resolvers = {
  /**
   * Returns the JWT if the current user is querying their own profile. This
   * is used by subscription functions on the client side since authentication
   * over websockets is hacked together.
   */
  jwt(root, args, { jwt, user }) {
    if (!user) {
      throw new Error('Authentication failed.')
    } else if (root.id !== user.id) {
      return null
    }

    return jwt
  },
  async assistantChannel(root, args, { user, Chat }) {
    if (!user) {
      throw new Error('Authentication failed.')
    } else if (root.id !== user.id) {
      return null
    }
    const channel = await Chat.getAssistantChannel()
    return channel
  },
  avatarUrl(user) {
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
  }
}

export default resolvers
