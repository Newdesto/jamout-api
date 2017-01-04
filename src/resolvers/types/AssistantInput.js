import uuid from 'uuid'

const resolver = {
  createdAt(root, args, context) {
    return new Date().toISOString()
  },
  id(root, args, context) {
    return uuid()
  }
}

export default resolver
