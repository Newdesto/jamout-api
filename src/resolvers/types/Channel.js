import Message from './Message'
import Profile from './Profile'

const resolvers = {
  type({ type }) {
    return {
      a: 'ASSISTANT',
      d: 'DM',
      g: 'GROUP'
    }[type]
  },
  async messages({ id }, args, { Message }) {
    return Message.getMessages(id, args.messageLimit)
  },
  async users(channel, args, { Profile }) {
    return Profile.fetchByIds(channel.users)
  }
}

export default resolvers
