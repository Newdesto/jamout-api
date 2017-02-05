import newDistro from './new'
import type from './type'
import releaseDate from './releaseDate'

const actionHandlers = {
  'distribution/new': newDistro,
  'distribution/new:type': type,
  'distribution/new:release-date': releaseDate
}


export default actionHandlers
