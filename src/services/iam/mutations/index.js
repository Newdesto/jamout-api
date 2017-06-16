import login from './login'
import signUp from './signUp'
import updateUser from './updateUser'
import upgradeToPremium from './upgradeToPremium'
import verifyToken from './verifyToken'
import updatePremium from './updatePremium'
import cancelPremium from './cancelPremium'

const mutations = {
  updateUser,
  login,
  verifyToken,
  upgradeToPremium,
  updatePremium,
  cancelPremium
}

export default mutations
