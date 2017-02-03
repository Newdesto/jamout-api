import inquiry from './inquiry'
import newDate from './newDate'

const postbackHandlers = {
  'studio-sessions.inquiry': inquiry,
  'studio-sessions.newDate': newDate
}

export default postbackHandlers
