import inquiry from './inquiry'
import newDate from './newDate'
import setDate from './setDate'
import payment from './payment'

const postbackHandlers = {
  'studio-sessions.inquiry': inquiry,
  'studio-sessions.newDate': newDate,
  'studio-sessions.setDate': setDate,
  'studio-sessions.payment': payment
}

export default postbackHandlers
