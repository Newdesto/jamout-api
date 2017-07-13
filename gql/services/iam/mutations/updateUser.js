import updateUserHelper from '../helpers/updateUser'

const updateUser = async function updateUser(root, { input: updates }, { viewer, UserDef }) {
  if (!viewer) {
    throw new Error('Authentication failed.')
  }

  // Define the models.
  const User = UserDef()

  const user = await updateUserHelper(User)({
    id: viewer.id,
    updates
  })

  return user
}

export default updateUser
