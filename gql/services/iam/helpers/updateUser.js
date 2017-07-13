import merge from 'dynamo-merge'

const updateUser = User => async function updateUser({ id, updates }) {
  const { attrs } = await User.updateAsync({ ...updates, id })
  return attrs
}

export default updateUser
