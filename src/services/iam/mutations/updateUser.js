import updateUserHelper from '../helpers/updateUser'

const updateUser = async function updateUser(root, { id, input: updates }, { viewer }) {
    if (viewer.id !== id) {
        throw new Error('Authorization failed.')
    }

    const user = await updateUserHelper({
        id,
        updates
    })

    return user
}

export default updateUser
