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
import connection from './connection'
import reservePremium from './reservePremium'

const resolvers = {
  Mutation: merge(
    connection,
    authentication,
    generateS3Signature,
    studioEvent,
    createMusicEvent,
    eventArtist,
    chat,
    release,
    track,
    user,
    reservePremium
  )
}

export default resolvers
