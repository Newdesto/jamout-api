import login from './login'
import signUp from './signUp'
import updateUser from './updateUser'
import verifyToken from './verifyToken'
import updateSubscription from './updateSubscription'
import cancelSubscription from './cancelSubscription'
import subscribeToPlan from './subscribeToPlan'

const mutations = {
  updateUser,
  login,
  verifyToken,
  subscribeToPlan,
  updateSubscription,
  cancelSubscription
}

export default mutations
