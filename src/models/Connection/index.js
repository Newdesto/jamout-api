import logger from 'io/logger'
import shortid from 'shortid'
import model from './model'

/**
 * A wrapper for the connection model.
 */
export default class Connection {
  /**
   * Returns null if a connection doesn't exist between a user
   * and friend. Returns the connection if one exists.
   */
  static async connectionExists(userId, friendId) {
    const connection = await model
      .query(userId)
      .where('friendId')
      .equals(friendId)
      .execAsync()

    if (connection.Count === 0) {
      return null
    }

    // We assume only one item is returned.
    return connection.Items[0].attrs
  }
  /**
   * Get's the connections for a specific user. Assumes that authentication
   * and authorization has been checked.
   * @TODO Set a limit?
   */
  static async getConnections(userId) {
    const { Items } = await model
      .query(userId)
      .execAsync()

    return Items.map(i => i.attrs)
  }
  /**
   * Creates a connection between two users. Creates the edges in both directions.
   * If the connection exists already we return it.
   */
  static async createConnection(userId, friendId) {
    try {
      if (userId === friendId) {
        throw new Error('Cannot connect with yourself, silly goose.')
      }

      // Disable overwrites so it throws an exception.
      const id = shortid.generate()
      const connections = await model.createAsync([
        { id, userId, friendId, status: 'p' },
        { id, userId: friendId, friendId: userId, status: 'a' }
      ], { overwrite: false })

      return connections.map(connection => connection.attrs)
    } catch (err) {
      if (err.code === 'ConditionalCheckFailedException') {
        // @TODO Return the connection...
        throw new Error('Connection already exists. Query for the latest connections.')
      }

      logger.error(err)
      throw err
    }
  }
  /**
   * Deletes a connection between two users.
   */
  static async deleteConnection(userId, friendId) {
    try {
      await model.destroyAsync(userId, friendId)
      await model.destroyAsync(friendId, userId)
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
  /**
   * Confirms a connections. If the user is denying the connection use
   * deleteConnection above.
   */
  static async acceptConnection(userId, friendId) {
    try {
      // Throws an error out if userId is the user who need not confirm.
      const user = await model.updateAsync({
        userId,
        friendId,
        status: 'c'
      }, { expected: { status: 'a' } })

      const friend = await model.updateAsync({
        userId: friendId,
        friendId: userId,
        status: 'c'
      })

      // On confirmation create a chat channel.
      /* const chat = new Chat({ userId })
      await chat.createChannel({
        type: 'd',
        users: [userId, friendId]
      })*/


      return [user.attrs, friend.attrs]
    } catch (err) {
      if (err.code === 'ConditionalCheckFailedException') {
        // The user who sent the connection request is also trying to confirm it.
        throw new Error('Authorization failed.')
      }

      logger.error(err)
      throw err
    }
  }
}
