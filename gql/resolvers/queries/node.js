import getUserById from 'gql/services/iam/helpers/getUserById'
import getReleaseByContentId from 'gql/services/distribution/helpers/getReleaseByContentId'
import getMusicContentById from 'gql/services/music/helpers/getMusicContentById'

const enumToGetHelper = {
  USER: ({ id, userId }) => getUserById(id),
  MUSIC_CONTENT: ({ id, userId }) => getMusicContentById({ id, userId }),
  RELEASE: ({ id, userId }) => getReleaseByContentId({ userId, contentId: id })
}

/**
 * @NOTE NOTE NOTE
 * The node query `id` argument does NOT have to be
 * the UUID objects have. It can be a relational id.
 * It's up the the helper to use it correctly. See "DR"
 * helper for example.
 */
const resolver = {
  async node(root, { type, id }, { viewer }) {
    const getHelper = enumToHelper[type]

    if (!getHelper) {
      throw new Error('Invalid Node ID.')
    }

    const node = await getHelper({ id, userId: viewer.id })
    return node
  }
}

export default resolver
