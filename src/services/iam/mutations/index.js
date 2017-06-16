import login from './login'
import signUp from './signUp'
import updateUser from './updateUser'
import upgradeToPremium from './upgradeToPremium'
<<<<<<< HEAD
import verifyToken from './verifyToken'

const mutations = {
  updateUser,
  login,
  verifyToken,
  upgradeToPremium
=======
import updatePremium from './updatePremium'
import cancelPremium from './cancelPremium'

const mutations = {
  upgradeToPremium,
  updatePremium,
  cancelPremium
>>>>>>> 1ddca92453edaf5ac23a156a2e8988e8991d4100
}

export default mutations
