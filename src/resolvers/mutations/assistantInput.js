import { logger } from 'io'
import handleInput from 'assistant/artist/inputs'

// Routes the input to the artist assistant inputs switch
// @TODO move handleInput to content
const resolvers = {
  async assistantInput(root, { input }, { user: { id: userId } = {} }) {
    if(!userId) {
      throw new Error('Unauthorized.')
    }

    // If content is set but contentType isn't then send an error.
    // And vice-versa.
    if((content && !contentType) || (contentType && !content)) {
      throw new Error('Both content and contentType need to be set.')
    }
 
    // @TODO events + contexts structure check

    const message = handleInput(input)
    return message
  }
}


export default resolvers
