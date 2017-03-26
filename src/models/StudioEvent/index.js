import shortid from 'shortid'
import microtime from 'microtime'
import { publishMessages } from 'utils/chat'
import { createJob } from 'io/queue'
import userModel from 'models/User/model'
// @TODO Strictly use the Chat class. Do NOT work with the model directly.
import Chat from 'services/chat'
import studioEventModel from './model'

export default class StudioEvent {
  constructor() {
    this.fetchAll = StudioEvent.fetchAll
    this.fetchByUserId = StudioEvent.fetchByUserId
    this.createStudioEvent = StudioEvent.createStudioEvent
  }
  static async fetchAll() {
    const { Items } = await studioEventModel
      .scan()
      .loadAll()
      .execAsync()

    return StudioEvent.sortStudioEvents(Items)
  }
  static async fetchByUserId(userId) {
    if (!userId) { throw new Error('User ID is undefined.') }
    const { Items } = await studioEventModel
      .scan()
      .where('userId').equals(userId)
      .execAsync()

    return StudioEvent.sortStudioEvents(Items)
  }
  static sortStudioEvents(items) {
    let events = items.map(i => i.attrs)
    const sortedEvents = []

    while (events.length !== 0) {
      const sortedEvent = events.filter(e => e.sessionId === events[0].sessionId).sort((a, b) => {
        const date1 = new Date(a.createdAt)
        const date2 = new Date(b.createdAt)
        return date1 - date2
      })

      events = events.filter(e => e.sessionId !== events[0].sessionId)
      sortedEvents.push(sortedEvent)
    }
    return sortedEvents
  }


  static async createStudioEvent(user, type, payload) {
    let session = null

    // querry for artist becuase user param could be studio
    const { Items } = await userModel
    .scan()
    .where('id').equals(payload.userId)
    .execAsync()

    const artist = Items[0].attrs

    if (type === 'inquiry accepted') {
      // create channel
      const users = [artist.id, payload.studioId]
      const chat = new Chat({ userId: artist.id })
      const newChannel = await chat.createChannel({
        type: 'd',
        users,
        name: 'Studio Session',
        superPowers: [`studio-sessions:${payload.sessionId}`]
      })
      const introMessage = {
        channelId: newChannel.id,
        id: shortid.generate(),
        timestamp: microtime.nowDouble().toString(),
        senderId: payload.studioId,
        attachment: {
          type: 'StudioSessionNewSession',
          disableInput: false,
          hideButtons: false,
          sessionId: payload.sessionId
        }
      }
      await createJob('chat.persistMessage', { message: introMessage })
      await publishMessages(newChannel.id, payload.studioId, [introMessage])
    }

  // session types: inquiry pending, inquiry denied, inquiry accepted,
  // session planned, artist paid, session completed, review
    switch (type) {
      case 'new-inquiry':
        session = await studioEventModel.createAsync({
          userId: artist.id, // id the user who made the request
          studioId: payload.studioId, // id of the studio?
          studio: payload.studio,
          type: 'inquiry pending',
          preferredDate: payload.preferredDate,
          username: artist.username
        })
        return session
      case 'inquiry accepted':
        session = await studioEventModel.createAsync({
          userId: artist.id, // id the user who made the request
          username: artist.username,
          studioId: payload.studioId, // id of the studio?
          studio: payload.studio,
          type: 'inquiry accepted',
          sessionId: payload.sessionId
        })
        return session
      case 'inquiry denied':
        session = await studioEventModel.createAsync({
          userId: artist.id, // id the user who made the request
          username: artist.username,
          studioId: payload.studioId, // id of the studio?
          studio: payload.studio,
          type: 'inquiry denied',
          sessionId: payload.sessionId
        })
        return session
      case 'session planned':
        session = await studioEventModel.createAsync({
          userId: user.id, // id the user who made the request
          studioId: payload.studioId, // id of the studio?
          studio: payload.studio,
          startDate: payload.startDate,
          endDate: payload.endDate,
          type: 'session planned',
          sessionId: payload.sessionId
        })
        return session
      case 'artist paid':
        session = await studioEventModel.createAsync({
          userId: user.id, // id the user who made the request
          studioId: payload.studioId, // id of the studio?
          studio: payload.studio,
          startDate: payload.startDate,
          endDate: payload.endDate,
          type: 'artist paid',
          sessionId: payload.sessionId
        })
        return session
      default:
        return session
    }
  }
  static idStudio(studio) {
    return studio.toLowerCase().replace(' ', '-')
  }

}
