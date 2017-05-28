import channelTypeEnum from '../utils/channelTypeEnum'
import createChannelHelper from '../helpers/createChannel'

const createChannel = async function createChannel(root, { input }, { viewer, logger }) {
    const args = input
      if (!viewer) {
        throw new Error('Authentication failed.')
      }

      // Get the ENUM values.
      const type = channelTypeEnum[args.type]

      // Do some name  validation
      if (type === 'd') {
        delete args.name
      }

      const channel = await createChannelHelper({
        type,
        name: args.name,
        userIds: args.userIds,
        viewerId: viewer.id
      })

      return channel
  }

export default createChannel
