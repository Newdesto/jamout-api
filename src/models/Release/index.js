import { fromJS } from 'immutable'
import releaseModel from './model'
import trackModel from './trackModel'
import { createOrder, payOrder, distroSkus } from '../../utils/stripe'

// @TODO try/catch statement
// @TODO caching as update + pay can be batched
export default class Release {
  // @TODO add a limit + pagination
  // @TODO remove not nulls
  static async getAll() {
    const { Items } = await releaseModel
      .scan()
      .where('status')
      .notNull()
      .where('type')
      .notNull()
      .where('tracklist')
      .notNull()
      .execAsync()

    return Items.map(r => r.attrs)
  }
  // @TODO index the userId
  // scans are costly
  static async fetchByUserId(userId) {
    if (!userId) { throw new Error('User ID is undefined.') }
    const { Items } = await releaseModel
      .scan()
      .where('userId').equals(userId)
      .execAsync()

    return Items.map(i => i.attrs)
  }
  static async fetchById(id) {
    const Item = await releaseModel
      .getAsync(id)

    // @NOTE: quickfix so we can send a null
    if (!Item) {
      return null
    }
    return Item.attrs
  }
  static async create(input) {
    try {
      const { attrs } = await releaseModel
        .createAsync(input)

      return attrs
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  static async update(id, input) {
    // @TODO expression statement for userId
    try {
      // This is an EXTREMELY bad performance issue - we query for the release
      // object, convert the release object and the input to immutable objects,
      // and deepMerge them.
      const oldReleaseItem = await releaseModel.getAsync({ id })
      const oldRelease = fromJS(oldReleaseItem.attrs)

      const newRelease = fromJS(input)

      const updatedRelease = oldRelease.mergeDeep(newRelease)
      const { attrs } = await releaseModel.updateAsync(updatedRelease.toJS())
      return attrs
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  static async delete(userId, id) {
    try {
      const params = {}
      params.ConditionExpression = '#userId = :userId'
      params.ExpressionAttributeNames = { '#userId': 'userId' }
      params.ExpressionAttributeValues = { ':userId': userId }
      await releaseModel.destroyAsync(id, params)
      return id
    } catch (err) {
      if (err.code === 'ConditionalCheckFailedException') {
        throw new Error('Authorization failed.')
      }
      console.error(err)
      throw err
    }
  }
  /**
   * Creates a new distribution.track item.
   */
  static async addTrack(track) {
    try {
      const { attrs } = await trackModel
        .createAsync(track)

      return attrs
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  static async updateTrack(input) {
    try {
      const { attrs } = await trackModel.updateAsync(input)
      return attrs
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  static async deleteTrack(userId, id) {
    try {
      const params = {}
      params.ConditionExpression = '#userId = :userId'
      params.ExpressionAttributeNames = { '#userId': 'userId' }
      params.ExpressionAttributeValues = { ':userId': userId }
      await trackModel.destroyAsync(id, params)
      return id
    } catch (err) {
      if (err.code === 'ConditionalCheckFailedException') {
        throw new Error('Authorization failed.')
      }
      console.error(err)
      throw err
    }
  }
  static async pay({ id, email, customerId, source }) {
    // get the order
    const order = await Release.fetchById(id)

    // create the order
    const newOrder = await createOrder({
      email,
      currency: 'usd',
      items: [{
        type: 'sku',
        parent: distroSkus[order.type]
      }]
    })

    // pay the order
    await payOrder(newOrder.id, {
      customer: customerId, // attach customer regardless
      source
    })

    // update the status of release
    const { attrs } = await releaseModel
      .updateAsync({ id: order.id, status: 'p' })

    return attrs
  }
}
