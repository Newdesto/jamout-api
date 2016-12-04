import releaseModel from './model'
import { createOrder, payOrder, distroSkus } from '../../utils/stripe'

// @TODO try/catch statement
// @TODO caching as update + pay can be batched
export default class Release {
  // @TODO add a limit + pagination
  async fetchAll() {
    const { Items } = await releaseModel
      .scan()
      .loadAll()
      .execAsync()
  }
  // @TODO index the userId
  // scans are costly
  async fetchByUserId(userId) {
    if(!userId)
      throw new Error('User ID is undefined.')
    const { Items } = await releaseModel
      .scan()
      .where('userId').equals(userId)
      .execAsync()
    console.log(Items)
    return Items.map(i => i.attrs)
  }
  async fetchById(id, userId) {
    const { attrs } = await releaseModel
      .getAsync(id)
    return attrs
  }
  async create(input) {
    try {
      console.log(input)
      const { attrs } = await releaseModel
        .createAsync(input)
      console.log(attrs)
      return attrs
    } catch(e) {
      console.error(e)
    }
  }
  async update(id, input, userId) {
    // @TODO expression statement for userId
    const { attrs } = await releaseModel
      .updateAsync(Object.assign(input, { id }))
    return attrs
  }
  async delete(userId, id) {
    try {
      const params = {}
      params.ConditionExpression = '#userId = :userId'
      params.ExpressionAttributeNames = {'#userId' : 'userId'}
      params.ExpressionAttributeValues = {':userId' : userId}
      await releaseModel.destroyAsync(id, params)
      return id
    } catch(e) {
      if(e.code === 'ConditionalCheckFailedException')
        throw new Error('Authorization failed.')
      console.error(e)
      throw e
    }
  }
  async pay({ id, email, customerId, source }) {
    // get the order
    const order = await this.fetchById(id)
    console.log(order)

    // create the order
    const newOrder = await createOrder({
      email,
      currency: 'usd',
      items: [{
        type: 'sku',
        parent: distroSkus[order.type]
      }]
    })
    console.log(newOrder)

    // pay the order
    const paidOrder = await payOrder(newOrder.id, {
      customer: customerId, // attach customer regardless
      source
    })

    console.log(paidOrder)

    // update the status of release
    const { attrs } = await releaseModel
      .updateAsync({ id: order.id, status: 'p' })
    console.log(attrs)
    return attrs
  }
}
