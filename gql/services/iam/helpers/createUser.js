import cleanDeep from 'clean-deep'

const createUser = User => async function createUser(props) {
  const cleanProps = cleanDeep(props)
  const { attrs: user } = await User.createAsync(cleanProps)

  return user
}

export default createUser
