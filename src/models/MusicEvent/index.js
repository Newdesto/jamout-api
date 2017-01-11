import musicEventModel from './model'

export default class MusicEvent {

  async createMusicEvent(partner, payload) {

    const { attrs } = await musicEventModel.createAsync({
      partner: partner.username,
      partnerId: partner.id,
      ...payload
    })
    return attrs
  }
}
