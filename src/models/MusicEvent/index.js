import musicEventModel from './model'

export default class MusicEvent {

  async createMusicEvent(parter, payload) {
    const { attrs } = await musicEventModel.createAsync({
      ...payload
    })
    return attrs
  }
}
