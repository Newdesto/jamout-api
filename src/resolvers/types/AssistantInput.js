import uuid from 'uuid'

const resolver = {
  createdAt(root, args, context) {
    return new Date().toISOString()
  },
  id(root, args, context) {
    if(!root.id)
      return uuid()
    return root.id
  }
}

export default resolver
