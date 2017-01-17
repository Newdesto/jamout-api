import * as actions from './actions';
import { fromJS } from 'immutable';
import sagas from './sagas'

// tokens = authenticated
const initialState = fromJS({
  isAuthenticating: false
})

export default function(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case actions.AUTH_PENDING:
      return state.set('isAuthenticating', true)
    case actions.AUTH_SUCCESS:
      return state
        .set('isAuthenticating', false)
        .set('tokens', fromJS(payload)) // assume payload is tokens object
    case actions.UPDATE_AUTH_TOKENS:
      return state
        .set('tokens', fromJS(payload)) // assume payload is tokens object
    case actions.AUTH_FAILURE:
      return state
        .set('isAuthenticating', false)
        .set('error', payload)
        .remove('tokens') // tokens assumed invalid
    case actions.RESET_AUTH_STATE:
      return state
        .set('isAuthenticating', false)
        .remove('error')
        .remove('tokens') // tokens assumed invalid
    case actions.LOGOUT:
      return state
        .remove('error')
        .remove('tokens')
    default:
      return state
  }
}

export { actions, sagas }
