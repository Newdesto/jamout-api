import { publishMessages, publishInput } from 'utils/chat'
import Profile, { ProfileLoader } from 'models/Profile'
import { createJob } from 'io/queue'
import User from 'models/User/model'
import { logger } from 'io'

const welcome = async function welcome({ userId, channelId }, result, messages) {
  logger.debug('Processing onboarding.todos action.')

  // Get the user's profile so we can generate the profile url.
  const loader = new ProfileLoader({ userId })
  const connector = new Profile({ loader })
  const profile = await connector.fetchById(userId)

  // Todos message
  const todos = {
    channelId,
    senderId: userId,
    attachment: {
      type: 'card',
      elements: [{
        title: 'Update your profile',
        subtitle: 'Add your profile picture and tell other artists about yourself.',
        defaultAction: {
          type: 'routerRedirect',
          url: '/' + profile.permalink
        },
        buttons: [{
          title: 'Go to your profile'
        }]
      }, {
        title: 'Checkout upcoming events',
        subtitle: 'Join us at a networking event or be considered for a partner event.',
        defaultAction: {
          type: 'routerRedirect',
          url: '/services/events'
        },
        buttons: [{
          title: 'Go to events'
        }]
      }]
    }
  }

  /**
   * {
     title: 'Your catalogue',
     subtitle: 'Store all your work in the cloud. Upload everything from samples to finished tracks.',
     defaultAction: {
       type: 'routerRedirect',
       url: '/me/discography'
     },
     buttons: [{
       title: 'Go to your catalogue'
     }]
   }, {
     title: 'Studio sessions',
     subtitle: 'Schedule a studio session with one of our partnered studios at a discounted rate.',
     defaultAction: {
       type: 'message',
       text: 'I want schedule a studio session.'
     },
     buttons: [{
       title: 'Start an inquiry'
     }]
   }, {
     title: 'Discover',
     subtitle: 'Discover the music of other Jamout artists. Connect and chat with them.',
     defaultAction: {
       type: 'routerRedirect',
       url: '/discover'
     },
     buttons: [{
       title: 'View other artists'
     }]
   }, {
     title: 'Digital Distribution',
     subtitle: 'Distribute your new release to over 150 platforms.',
     defaultAction: {
       type: 'message',
       url: 'I want to distribute a new release.'
     },
     buttons: [{
       title: 'Distribute a release'
     }]
   }
   */

  // Merge the todos message into the API.ai defined messages.
  messages.push(todos)


  // Schedule message persistence.
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Publish the messages to the channel's pubsub channel
  await publishMessages(channelId, 'assistant', messages)


  // Make sure the input is set to textbox.
  publishInput(channelId, 'Textbox', {
    hint: 'Type something and press enter...'
  })
}

export default welcome
