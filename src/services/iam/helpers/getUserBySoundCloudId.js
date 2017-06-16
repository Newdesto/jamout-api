import User from '../models/User'

const getUserBySoundCloudId = async function getUserBySoundCloudId(id) {
  const existingUsers = await User
    .query(id)
    .usingIndex('soundCloudUserId-index')
    .execAsync()

  if (existingUsers.Count !== 0) { 
    return existingUsers.Items[0].attrs 
  }

  return false
}

export default getUserBySoundCloudId
