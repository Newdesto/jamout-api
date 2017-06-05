import merge from 'lodash/merge'
import chat from 'services/chat/mutations'
import iam from 'services/iam/mutations'
import authentication from './authentication'
import generateS3Signature from './generateS3Signature'
import release from './release'
import studioEvent from './studioEvent'
import createMusicEvent from './musicEvent'
import eventArtist from './eventArtist'
import track from './track'
import user from './user'
import connection from './connection'

const resolvers = {
  Mutation: merge(
    iam,
    connection,
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
