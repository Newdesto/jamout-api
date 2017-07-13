import User from '../models/User'

const getUserByEmail = async function getUserByEmail(email) {
  const existingUsers = await User
      .query(email)
      .usingIndex('email-index')
      .execAsync()

  if (existingUsers.Count !== 0) {
    return existingUsers.Items[0].attrs
  }
  return false
}

export default getUserByEmail
