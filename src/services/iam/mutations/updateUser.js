import updateUserHelper from '../helpers/updateUser'

const updateUser = async function updateUser(root, { input: updates }, { viewer }) {
  if (!viewer) {
    throw new Error('Authentication failed.')
  }

  const user = await updateUserHelper({
    id: viewer.id,
    updates
  })

  return user
}

export default updateUser
