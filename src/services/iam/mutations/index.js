import login from './login'
import signUp from './signUp'
import updateUser from './updateUser'
import upgradeToPremium from './upgradeToPremium'
import verifyToken from './verifyToken'

const mutations = {
  updateUser,
  login,
  verifyToken,
  upgradeToPremium
}

export default mutations
