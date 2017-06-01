import merge from 'dynamo-merge'
import User from './models/User/model'

const updateUser = async function updateUser(id, updates) {
  const { attrs } = await User.updateAsync({ id }, merge(updates))
  return attrs
}

export default updateUser
