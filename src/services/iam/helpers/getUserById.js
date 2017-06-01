import User from '../models/User/model'

const getUserById = async function getUserById(id) {
  const { attrs } = await User.getAsync(id)
  return attrs
}

export default getUserById
