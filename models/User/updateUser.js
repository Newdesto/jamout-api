import merge from 'dynamo-merge'

const updateUser = async function updateUser({ id, updates }) {
  const { attrs } = await this.updateAsync({ ...updates, id })
  return attrs
}

export default updateUser
