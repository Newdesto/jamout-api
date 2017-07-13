const getUserBySoundCloudId = User => async function getUserBySoundCloudId(id) {
  const existingUsers = await User
    .query(id)
    .usingIndex('soundcloudUserId-index')
    .execAsync()

  if (existingUsers.Count !== 0) {
    return existingUsers.Items[0].attrs
  }

  return false
}

export default getUserBySoundCloudId
