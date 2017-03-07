import studioSessions from './studio-sessions'
import distribution from './distribution'

const postbackHandlers = {
  ...studioSessions,
  ...distribution
}

const handlePostback = async function handlePostback(postback) {
  const postbackHandler = postbackHandlers[postback.id]
  const messages = await postbackHandler(postback)
  return messages
}

export default handlePostback
