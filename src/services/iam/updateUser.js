import User from 'models/User/model'
import merge from 'dynamo-merge'

const updateUser = async function updateUser(id, updates) {
  const { attrs } = await User.updateAsync({ id }, merge(updates))
  return attrs
}

export default updateUser
