export default {
  async addConnection(root, { friendId }, { user, Connection }) {
    const connections = await Connection.createConnection(user.id, friendId)
    return connections
  },
  async acceptConnection(root, { friendId }, { user, Connection }) {
    const connections = await Connection.acceptConnection(user.id, friendId)
    return connections
  },
  async deleteConnection(root, { friendId }, { user, Connection }) {
    await Connection.deleteConnection(user.id, friendId)
  }
}
