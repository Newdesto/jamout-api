const resolvers = {
    __resolveType({ id }) {
        if (!id) {
            return null
        }

        const idPrefixToType = {
            IU: 'User',
            DR: 'Release'
        }

        const idPrefix = id.split('-')[0]
        const type = idPrefixToType[idPrefix]

        return type
    }
}

export default resolvers