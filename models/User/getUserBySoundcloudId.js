const getUserBySoundcloudId = async function getUserBySoundcloudId(id) {
  const existingUsers = await this
    .query(id)
    .usingIndex('soundcloudUserId-index')
    .execAsync()

  if (existingUsers.Count !== 0) {
    return existingUsers.Items[0].attrs
  }

  return false
}

export default getUserBySoundcloudId
