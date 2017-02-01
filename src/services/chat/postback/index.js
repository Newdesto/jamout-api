import studioSessions from './studio-sessions'

const postbackHandlers = {
  ...studioSessions
}

const handlePostback = async function handlePostback(postback) {
  const postbackHandler = postbackHandlers[postback.id]
  const messages = await postbackHandler(postback)
  return messages
}

export default handlePostback
