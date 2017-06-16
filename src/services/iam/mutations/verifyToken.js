import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

const verifyToken = async function verifyToken(root, { token }) {
  try {
        // Verify will handle both signature and expiration
    await jwt.verify(token, secret)
    return true
  } catch (err) {
    return false
  }
}

export default verifyToken
