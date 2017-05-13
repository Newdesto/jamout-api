import JWT from 'jsonwebtoken'

export const resolver = {
  messages(message, args) {
    console.log(message)
    return message
  }
}

export const mapper = {
  messages: (options, { channelId }) => ({
    messages: {
      filter: (message, { viewer }) => viewer && message.channelId === channelId
    }
  })
}
