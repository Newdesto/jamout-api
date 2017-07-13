import merge from 'dynamo-merge'
import User from '../models/User'

const updateUser = async function updateUser({ id, updates }) {
  const { attrs } = await User.updateAsync({ ...updates, id })
  return attrs
}

export default updateUser
