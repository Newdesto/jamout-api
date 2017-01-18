export const AUTH_PENDING = '@@jamout/auth/AUTH_PENDING'
export const AUTH_SUCCESS = '@@jamout/auth/AUTH_SUCCESS'
export const AUTH_FAILURE = '@@jamout/auth/AUTH_FAILURE'
export const RESET_AUTH_STATE = '@@jamout/auth/RESET_AUTH_STATE'
export const UPDATE_AUTH_TOKENS = '@@jamout/auth/UPDATE_AUTH_TOKENS'

export const LOCAL_TOKENS = '@@jamout/auth/LOCAL_TOKENS'
export const LOGIN_REQUEST = '@@jamout/auth/LOGIN_REQUEST'
export const SIGN_UP_REQUEST = '@@jamout/auth/SIGN_UP_REQUEST'
export const LOGOUT = '@@jamout/auth/LOGOUT'
export const VALIDATE_FORM = '@@jamout/auth/VALIDATE_FORM'

export const authPending = () => ({ type: AUTH_PENDING })
export const authSuccess = payload => ({ type: AUTH_SUCCESS, payload })
export const authFailure = payload => ({ type: AUTH_FAILURE, payload, error: true })
export const resetAuthState = () => ({ type: RESET_AUTH_STATE })
export const updateAuthTokens = payload => ({ type: UPDATE_AUTH_TOKENS, payload })

export const localTokens = () => ({ type: LOCAL_TOKENS })
export const loginRequest = payload => ({ type: LOGIN_REQUEST, payload })
export const signupRequest = payload => ({ type: SIGN_UP_REQUEST, payload })
export const logout = () => ({ type: LOGOUT })
export const validateForm = payload => ({ type: VALIDATE_FORM, payload })
