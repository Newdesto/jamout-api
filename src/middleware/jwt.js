/**
 * Configures express-jwt middleware
 */

import jwt from 'express-jwt'

const secret = process.env.JWT_SECRET

// @TODO conditional iss/aud depending on environment
// so we don't get local and production JWT's mixed up

// export default jwt({ secret, credentialsRequired: false, issuer: 'https://api.jamout.co', audience: 'https://api.jamout.co' })
export default jwt({
  secret,
  credentialsRequired: false,
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE
})
