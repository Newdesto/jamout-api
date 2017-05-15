import { createChannel } from '../../models/Channel'

export default {
  async addConnection(root, { friendId }, { user, Connection }) {
    const connections = await Connection.createConnection(user.id, friendId)
    return connections
  },
  async acceptConnection(root, { friendId }, { user, Connection }) {
    const connections = await Connection.acceptConnection(user.id, friendId)
    // Create a channel bruh 
    const channel = await createChannel({
      type: 'd',
      userIds: [friendId, user.id],
      name: null, // Deff fix this later
      viewerId: user.id
    })
    return connections
  },
  async deleteConnection(root, { friendId }, { user, Connection }) {
    await Connection.deleteConnection(user.id, friendId)
  }
}
