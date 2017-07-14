const getUserByEmail = async function getUserByEmail(email) {
  const existingUsers = await this
      .query(email)
      .usingIndex('email-index')
      .execAsync()

  if (existingUsers.Count !== 0) {
    return existingUsers.Items[0].attrs
  }
  return false
}

export default getUserByEmail
