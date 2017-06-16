import getUserById from 'services/iam/helpers/getUserById'
import getReleaseByContentId from 'services/distribution/helpers/getReleaseByContentId'

/**
 * @NOTE NOTE NOTE
 * The node query `id` argument does NOT have to be
 * the UUID objects have. It can be a relational id.
 * It's up the the helper to use it correctly. See "DR"
 * helper for example.
 */
const resolver = {
  async node(root, { id }, { viewer }) {
    const idPrefixToGetHelper = {
      IU: getUserById,
      DR: id => getReleaseByContentId({ contentId: id, userId: viewer.id })
    }

    const idPrefix = id.split('-')[0]
    const getHelper = idPrefixToGetHelper[idPrefix]

    if (!getHelper) {
      throw new Error('Invalid Node ID.')
    }

    const node = await getHelper(id)
    return node
  }
}

export default resolver
