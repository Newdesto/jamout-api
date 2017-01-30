import merge from 'lodash/merge'
import authentication from './authentication'
import generateS3Signature from './generateS3Signature'
import chat from './chat'
import release from './release'
import studioEvent from './studioEvent'
import createMusicEvent from './musicEvent'
import eventArtist from './eventArtist'
import track from './track'
import user from './user'

const resolvers = {
  Mutation: merge(
    authentication,
    generateS3Signature,
    studioEvent,
    createMusicEvent,
    eventArtist,
    chat,
    release,
    track,
    user
  )
}

export default resolvers
