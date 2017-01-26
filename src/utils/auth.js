import bcrypt from 'bcryptjs'

const genSalt = function genSalt() {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (error, salt) => {
      if (error) {
        return reject(error)
      }

      return resolve(salt)
    })
  })
}

const hashWithSalt = function hashWithSalt(password, salt) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (error, hash) => {
      if (error) {
        return reject(error)
      }
      return resolve(hash)
    })
  })
}

// uses bcrypt to hash a given password
export async function hashPassword(password) {
  const salt = await genSalt()
  const hashed = await hashWithSalt(password, salt)
  return hashed
}

// uses bcrypt to compare password and hash
export function authenticate(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (error, response) => {
      if (error) return reject(error)
      return resolve(response)
    })
  })
}
