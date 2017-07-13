import S3 from 'aws-sdk/clients/s3'
import { getCustomer } from 'gql/utils/stripe'
import { getTracks } from 'gql/utils/soundcloud'

const s3 = new S3()

/**
 * Some values need to be computed before returning the User object. E.g.; the
 * user's avatar url. Also, some values can only be returned if the viewer is the user.
 */
const resolvers = {
  // Viewer-only Resolvers
  email(user, args, { viewer }) {
    if (viewer.id !== user.id) {
      return null
    }

    return user.email
  },
  phoneNumber(user, args, { viewer }) {
    if (viewer.id !== user.id) {
      return null
    }

    return user.phoneNumber
  },
  async stripeCustomer(user, args, { viewer }) {
    if (viewer.id !== user.id || !user.stripeCustomerId) {
      return null
    }

    const customer = await getCustomer(user.stripeCustomerId)

    return customer
  },
  // Computed Resolvers
  avatarUrl(user) {
    if (!user.avatarKey) {
      return null
    }

    const params = { Bucket: 'jamout-iam', Key: `${user.id}/avatar.png` }
    const url = s3.getSignedUrl('getObject', params)
    return url
  },
  isPartner(user) {
    const whitelistedUsers = ['5192223b-4454-498f-86fd-c712e70798af']
    if (whitelistedUsers.includes(user.id)) {
      return true
    }

    return false
  },
  async soundcloudTracks(user) {
    const tracks = await getTracks(user.soundCloudAccessToken)
    return tracks
  }
}

export default resolvers
