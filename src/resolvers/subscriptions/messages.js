import JWT from 'jsonwebtoken'

export const resolver = {
  messages(message, args) {
    console.log(message)
    return message
  }
}

export const mapper = {
  messages: ({ context: { viewer } }, { channelId }) => ({
    messages: {
      filter: message => message.channelId === channelId
    }
  })
}
