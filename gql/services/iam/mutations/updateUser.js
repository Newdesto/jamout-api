const updateUser = async function updateUser(root, { input: updates }, { viewer, User }) {
  if (!viewer) {
    throw new Error('Authentication failed.')
  }


  const user = await User.updateUser({
    id: viewer.id,
    updates
  })

  return user
}

export default updateUser
