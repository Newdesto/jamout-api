import Channel from '../models/Channel/model'

const getChannelById = async function getChannelById(id) {
  const { attrs } = await Channel.getAsync(id)
  return attrs
}

export default getChannelById
