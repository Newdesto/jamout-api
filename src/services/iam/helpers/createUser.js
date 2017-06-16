import cleanDeep from 'clean-deep'
import User from '../models/User'

const createUser = async function createUser(props) {
    const cleanProps = cleanDeep(props)
    const { attrs: user } = await User.createAsync(cleanProps)
    
    return user
}

export default createUser