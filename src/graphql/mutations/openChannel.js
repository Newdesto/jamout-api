export default {
  openChannel(root, args, { user, Channel }) {
    if(!user)
      throw new Error('Authentication failed.')

    const type = {
      DM: 'dm',
      GROUP: 'group'
    }[args.type]

    return Channel.createChannel(type, args.users)
  }
}
