import { getMe } from 'gql/utils/soundcloud'
import uuid from 'uuid'
import addHours from 'date-fns/add_hours'
import { hashPassword, authenticate } from 'gql/utils/auth'
import { createError } from 'apollo-errors'
import jwt from 'jsonwebtoken'
import SNS from 'aws-sdk/clients/sns'
import getUserBySoundCloudId from '../helpers/getUserBySoundCloudId'
import getUserByEmail from '../helpers/getUserByEmail'
import createUser from '../helpers/createUser'
import updateUser from '../helpers/updateUser'

const InvalidLoginError = createError('InvalidLoginError', {
  message: 'Invalid email or password.'
})

/**
 * Logs a user in using their email & password or the SoundCloud
 * oauth authorization code.
 */
const login = async function login(root, { email, password, scAccessToken }, context) {
  let user

  if (scAccessToken) {
        // SoundCloud login
    const scUser = await getMe(scAccessToken)
    console.log(scUser)
    user = await getUserBySoundCloudId(scUser.id)

    if (!user) {
            // @TODO Publish import avatar event
      user = await createUser({
        id: uuid(),
        displayName: scUser.username,
        city: scUser.city,
        country: scUser.country,
        soundCloudUserId: scUser.id,
        soundCloudAccessToken: scAccessToken
      })
    } else {
      user = await updateUser({
        id: user.id,
        soundCloudAccessToken: scAccessToken
      })
    }
  } else {
        // Email + Password login
    user = await getUserByEmail(email)
  }

    // Invalid something
  if (!user) {
    throw new InvalidLoginError()
  }

    // Compare the passwords if needed
  if (!scAccessToken) {
    const authenticated = await authenticate(password, user.password)

    if (!authenticated) {
      throw new InvalidLoginError()
    }
  }

    // Sign the JWT with the bare minimum for app startup.
    // aud/iss are either https://api.jamout.co for production
    // or localhost for dev. We do this so JWTs don't get mixed up, and for
    // better security.
  const accessToken = jwt.sign({
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    displayName: user.displayName
  }, process.env.JWT_SECRET, {
    subject: user.id,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER
  })

  return accessToken
}

export default login
