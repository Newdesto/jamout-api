const resolvers = {
  assistantMessages(root, args, { user: { id: userId } = {}, AssistantMessage }) {
    const id = userId || anonId
    // @TODO anonID
    return AssistantMessage.fetchByUserId(id, 25)
  }
}
export default resolvers
