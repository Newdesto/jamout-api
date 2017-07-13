import Release from '../models/Release'

const releases = async function releases(root, args, { viewer }) {
  if (!viewer) {
    throw new Error('Authorization failed.')
  }

  const { Items } = await Release
        .scan()
        .execAsync()

  return Items.map(i => i.attrs)
}

export default releases
