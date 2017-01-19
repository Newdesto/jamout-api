const resolvers = {
  status({ status }) {
    return {
      confirmed: 'CONFIRMED',
      action: 'ACTION',
      pending: 'PENDING'
    }[status]
  }
}

export default resolvers
