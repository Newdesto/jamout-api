import R from 'ramda'
import userResolvers from './user'

const resolvers = {
  ...R.omit(['connected'], userResolvers),
  jwt(root, args, { jwt, user }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    return jwt
  },
  async permissions(user, args, { Partner }) {
    // If the user has no roles(default artist) just null out
    if (!user.roles) {
      return null
    }
    // If the user has a partner role they inherit the partner's permissions.
    const partnerRoles = user.roles
      .map(role => role.split(':'))
      .filter(([parentRole]) => parentRole === 'partner')

    const partnerPermissions = await Promise.all(
      partnerRoles.map(([, id]) => Partner.getAsync(id))
    )

    return partnerPermissions.map(permissions => permissions.attrs.permissions)
  }
}

export default resolvers
