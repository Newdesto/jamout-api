export default {
  async addConnection(root, { friendId }, { user, Connection }) {
    const connections = await Connection.createConnection(user.id, friendId)
    return connections
  }
}
