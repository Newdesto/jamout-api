import releaseModel from './model'
import { createOrder, payOrder, distroSkus } from '../../utils/stripe'

// @TODO try/catch statement
// @TODO caching as update + pay can be batched
export default class Release {
  // @TODO add a limit + pagination
  static async fetchAll() {
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
      const { attrs } = await releaseModel
        .updateAsync(Object.assign(input, { id }))
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
  async pay({ id, email, customerId, source }) {
    // get the order
    const order = await this.fetchById(id)

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
