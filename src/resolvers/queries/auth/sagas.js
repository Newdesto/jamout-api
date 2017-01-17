import { take, put, call, fork, cancel } from 'redux-saga/effects'
import { takeLatest, delay, takeEvery } from 'redux-saga'
import JamoutAPI, { createEvent } from 'api/jamout'
import * as actions from './actions';
import { updateEntities } from 'modules/entities/actions'
import { fromJS } from 'immutable'
import { push } from 'react-router-redux'
import isEmpty from 'lodash/isEmpty'
import { startSubmit, stopSubmit } from 'redux-form'
import { SubmissionError } from 'redux-form'
import { client } from 'index'
import gql from 'graphql-tag'
import update from 'react-addons-update'

export default function * root() {
  yield [
    fork(authenticationFlow),
    fork(takeLatest, actions.VALIDATE_FORM, validateForm)
  ]

  // let's immediately check for local auth tokens
  yield put(actions.localTokens())
}

function * authenticationFlow() {
  try {
    while(true) {
      // wait for the user to login or for the parent funtion to refresh the token
      const initialAction = yield take([
        actions.LOGIN_REQUEST,
        actions.SIGN_UP_REQUEST,
        actions.LOCAL_TOKENS
      ])

      // let em know we putting in some work
      yield put(actions.authPending())

      // success handler for local storage
      const success = yield fork(authSuccessTask)

      // this will be called on initial load
      if(initialAction.type === actions.LOCAL_TOKENS)
        yield fork(checkLocalTokens)

      if(initialAction.type === actions.LOGIN_REQUEST)
        yield fork(login, initialAction.payload)

      if(initialAction.type === actions.SIGN_UP_REQUEST)
        yield fork(signUp, initialAction.payload)

      yield take([
        actions.LOGOUT, // strictly user triggered
        actions.RESET_AUTH_STATE, // selective, quitely restarts the loop
        actions.AUTH_FAILURE
      ])

      yield cancel(success)
      yield call(removeAuthTokens)
    }
  } catch(e) {
    console.error(e)
  }
}

// yields for auth success to save tokens to local storage
function * authSuccessTask() {
    try {
      const { payload } = yield take(actions.AUTH_SUCCESS)
      yield call(setAuthTokens, payload)
    } catch(e) {
      console.error(e)
      yield put(actions.authFailure(e))
    }
}

// runs once during app start up
function * checkLocalTokens() {
  try {
    const storedAuthTokens = yield call(getAuthTokens)

    // if theres no access token in local storage quietly restart the auth flow
    if(!storedAuthTokens) {
      yield put(actions.resetAuthState())
      return
    }

    // call the server to verify it's a signed token (server will also handle expiration)
    const { data: { verifyToken: verified } } = yield call(client.mutate, {
      mutation: gql`
        mutation VerifyToken($token: String!) {
          verifyToken(token: $token)
        }
      `,
      variables: { token: storedAuthTokens.accessToken }
    })

    // if tokens aren't valid quietly restart the auth flow
    if(!verified) {
      yield put(actions.resetAuthState())
      return
    }

    yield put(actions.authSuccess(storedAuthTokens))
  } catch(e) {
    console.error(e)
    yield put(actions.resetAuthState())
  }
}


function * login(payload) {
  try {
    yield put(startSubmit('loginForm'))
    const { data: { login: accessToken } } = yield call(client.mutate, {
      mutation: gql`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password)
        }
      `,
      variables: { email: payload.get('email'), password: payload.get('password') }
    })

    // emit success for any modules that are eavesdropping
    yield put(actions.authSuccess({ accessToken }))

    yield put(stopSubmit('loginForm'))

    // redirect
    yield put(push('/dashboard'))
  } catch (e) {
    console.error(e)
    yield put(actions.authFailure(e))
  }
}

function * signUp(payload) {
  try {
    const { data: { signUp: accessToken } } = yield call(client.mutate, {
      mutation: gql`
        mutation SignUp($email: String!, $username: String!, $password: String!) {
          signUp(email: $email, username: $username, password: $password)
        }
      `,
      variables: { ...payload }
    })

    // emit success for any modules that are eavesdropping
    yield put(actions.authSuccess({ accessToken }))

    // redirect
    yield put(push('/dashboard'))
  } catch (e) {
    console.error(e)
    yield put(actions.authFailure(e))
  }
}

/**
 * Validates the any authentication form
 * Uses a Promise to return success/failure
 * instead of dispatching an action
 * @TODO: Look into better solutions
 */
function * validateForm({ payload: { values, resolve, reject } }) {
  const errors = {}
  if(!validateEmail(values.get('email')))
    errors.email = 'Invalid email address.'

  if(isEmpty(errors))
    return resolve({})
  return reject(errors)
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


// The authentication tokens will be stored as a stringified object
// It should contain at least the access token for now
// oauth example is as follows
/*
  {"access_token":"ACCESS_TOKEN","token_type":"bearer","expires_in":2592000,"refresh_token":"REFRESH_TOKEN","scope":"read","uid":100101,"info":{"name":"Mark E. Mark","email":"mark@thefunkybunch.com"}}
 */
export function getAuthTokens() {
  return JSON.parse(localStorage.getItem('jamout_auth_tokens'))
}

export function setAuthTokens(tokens) {
  localStorage.setItem('jamout_auth_tokens', JSON.stringify(tokens))
}

export function removeAuthTokens() {
  localStorage.removeItem('jamout_auth_tokens')
}

//put into select parameter to get the auth token
export const getJWT = state => state.auth.getIn(['tokens','accessToken'])
