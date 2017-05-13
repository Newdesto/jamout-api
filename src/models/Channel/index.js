import crypto from 'crypto'
import R from 'ramda'

import ChannelModel from './model'
import SubscriptionModel from './subscriptionModel'

/**
 * Sorts an array of user IDs and creates a unique SHA1 hash.
 */
const sortUserIdsAndHash = function sortUserIdsAndHash({ userIds }) {
  if (!userIds || !Array.isArray(userIds)) {
    throw new Error('Invalid argument: userIds.')
  }

  const sortedUserIds = userIds.sort()
  const userIdsHash = crypto.createHash('sha1').update(JSON.stringify(sortedUserIds)).digest('hex')

  return {
    userIdsHash,
    userIds: sortedUserIds
  }
}

/**
 * Returns the channel of a user hash if it exists, and returns false
 * if it doesn't.
 */
const channelExistsByHash = async function channelExistsByHash({ userIdsHash }) {
  if (!userIdsHash) {
    throw new Error('The argument userHash is undefined.')
  }

  const { Items } = await ChannelModel
    .query(userIdsHash)
    .usingIndex('userIdsHashIndex')
    .execAsync()

  if (Items.length !== 0) {
    return Items[0].attrs
  }

  return false
}

/**
 * Creates subscriptions to a single channel for a set of users.
 */
const createSubscriptions = async function createSubscriptions({ userIds, channelId }) {
  if (!Array.isArray(userIds) || !channelId) {
    throw new Error('Invalid arguments to create channel subscriptions.')
  }

  const subscriptions = await Promise.all(
    userIds.map(userId => SubscriptionModel.createAsync({
      channelId,
      userId
    }))
  )

  // Unneccessary flatten for tests.
  return R.flatten(subscriptions).map(s => s.attrs)
}

/**
 * Creates a new channel using the channel type and an array of users. Checks
 * to see if a channel already exists for the set of users. If so, it returns
 * it.
 */
export const createChannel = async function createChannel({ type, userIds, name, viewerId }) {
  // Sort the users array and hash that shit.
  const sorted = sortUserIdsAndHash({ userIds })

  // Check if a channel already exists for this user set.
  const existingChannel = await channelExistsByHash({
    userIdsHash: sorted.userIdsHash
  })

  // Return the existing channel, dude.
  if (existingChannel) {
    return existingChannel
  }

  // No channels exist so let's create one.
  const { attrs: channel } = await ChannelModel.createAsync({
    type,
    name,
    userIds: sorted.userIds,
    userIdsHash: sorted.userIdsHash,
    ownerId: (type === 'g' && viewerId) || undefined
  })

  // Let's create a subscription for each user in the set.
  const subscriptions = await createSubscriptions({
    userIds: sorted.userIds,
    channelId: channel.id
  })

  // Return the channel and subscription for the user.
  return {
    ...R.find(R.propEq('userId', viewerId))(subscriptions),
    ...channel
  }
}

export const hasSubscriptionToChannel =
async function hasSubscriptionToChannel({ channelId, viewerId: userId }) {
  const subscription =
  await SubscriptionModel.getAsync({ channelId, userId })

  // If the sender was the assistnat don't throw an error.
  // The 'assistant' user doesn't receive a subscription.
  if (subscription) {
    return true
  }
  return false
}
