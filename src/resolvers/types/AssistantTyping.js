import uuid from 'uuid'

const resolver = {
  id(root, args, context) {
    return uuid()
  }
}

export default resolver
