import JWT from 'jsonwebtoken'

export const resolver = {
  messages(message) {
    return message
  }
}

export const mapper = {
  messages(root, { channelId, isBotChannel }, { viewer }) {
    if (!viewer) {
      throw new Error('Authentication failed.')
    }
    console.log('in message mapper')
    return {
      messages: {
        filter: message => message.channelId === channelId && message.isBotChannel === isBotChannel
      }
    }
  }
}
