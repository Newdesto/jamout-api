import cleanDeep from 'clean-deep'

const createUser = async function createUser(props) {
  const cleanProps = cleanDeep(props)
  const { attrs: user } = await this.createAsync(cleanProps)

  return user
}

export default createUser
