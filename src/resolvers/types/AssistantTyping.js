import uuid from 'uuid'

const resolver = {
  id(root, args, context) {
    console.log('resolving id')
    return uuid()
  }
}

export default resolver
