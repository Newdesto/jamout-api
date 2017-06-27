import login from './login'
import signUp from './signUp'
import updateUser from './updateUser'
import upgradeToPremium from './upgradeToPremium'
import verifyToken from './verifyToken'
import updatePremium from './updatePremium'
import cancelPremium from './cancelPremium'
import subscribeToPlan from './subscribeToPlan'

const mutations = {
  updateUser,
  login,
  verifyToken,
  subscribeToPlan,
  upgradeToPremium,
  updatePremium,
  cancelPremium
}

export default mutations
