import test from 'ava'
import sinon from 'sinon'
import BPromise from 'bluebird'
import Chat from '../index'
import Channel from '../channel'
import Subscription from '../subscription'
import Message from '../message'

test.serial('Chat class should set the userId property', (t) => {
  const userId = 'gabe'
  const chat = new Chat({
    userId
  })
  t.is(chat.userId, userId)
})

test.serial('Chat.sortUsersAndHash should sort an array of users and generate a unique hash', (t) => {
  const users = ['b', 'a', 'c', '12', '3']
  const sortedUsers = ['12', '3', 'a', 'b', 'c']

  const sorted = Chat.sortUsersAndHash({ users })
  t.deepEqual(sorted.users, sortedUsers)
  t.truthy(sorted.usersHash)
})

test.serial('Chat.channelExistsByHash should return false', async (t) => {
  // Create instance and sort users.
  const users = ['gabe', 'beyonce']
  const { usersHash } = Chat.sortUsersAndHash({ users })

  // Stub the query
  const mockQuery = {
    usingIndex: () => ({
      execAsync: () => ({ Items: [], Count: 0 })
    })
  }
  sinon.stub(Channel, 'query').returns(mockQuery)
  const existingChannel = await Chat.channelExistsByHash({ usersHash })
  t.false(existingChannel)
  Channel.query.restore()
})

test.serial('Chat.channelExistsByHash should return a channel', async (t) => {
  // Fake channel to be returned
  const channel = { attrs: { id: 'F3cg42' } }

  // Create instance and sort users.
  const users = ['gabe', 'beyonce']
  const { usersHash } = Chat.sortUsersAndHash({ users })

  // Stub the query
  const mockQuery = {
    usingIndex: () => ({
      execAsync: () => ({ Items: [channel], Count: 1 })
    })
  }
  sinon.stub(Channel, 'query').returns(mockQuery)
  const existingChannel = await Chat.channelExistsByHash({ usersHash })
  t.truthy(existingChannel)
  t.deepEqual(existingChannel, channel.attrs)
  Channel.query.restore()
})

test.serial('Chat.createSubscriptions should create subscriptions.', async (t) => {
  // @NOTE that we use only one users because it's difficult to stub createAsync
  // multiple times.
  const userId = 'gabe'
  const users = [userId]
  const channelId = 'abc123'
  const subscriptions = [{
    attrs: {
      channelId,
      userId,
      createdAt: new Date().toISOString()
    }
  }]

  // Stub the model
  sinon.stub(Subscription, 'createAsync').returns(BPromise.resolve(subscriptions))
  const chat = new Chat({ userId })
  const result = await chat.createSubscriptions({ users, channelId })

  // Assert and restore
  t.deepEqual(result, [subscriptions[0].attrs])
  Subscription.createAsync.restore()
})

test.serial('Chat.createSubscriptions should throw argument errors', async (t) => {
  const chat = new Chat({ userId: 'gabe' })
  await t.throws(chat.createSubscriptions({ users: 'incorrect', channelId: 'abc123' }))
  await t.throws(chat.createSubscriptions({ users: ['beyonce'] }))
})

test.serial('Chat.createChannel should create a channel', async (t) => {
  const createdAt = new Date().toISOString()
  const chat = new Chat({ userId: 'gabe' })
  const users = ['beyonce', 'gabe']
  const channelId = 'thisisanid'
  const type = 'd'
  const channel = {
    attrs: {
      type,
      users,
      channelId,
      createdAt,
      usersHash: 'thisisafakesha1hash'
    }
  }
  const subscriptions = users.map(userId => ({
    userId,
    channelId,
    createdAt
  }))

  // Stub instance methods.
  sinon.stub(Chat, 'channelExistsByHash').returns(false)
  sinon.stub(Channel, 'createAsync').returns(channel)
  sinon.stub(chat, 'createSubscriptions').returns(subscriptions)
  const result = await chat.createChannel({ type, users })

  // Assert and restore
  t.deepEqual(result, {
    userId: chat.userId,
    ...channel.attrs
  })
  Chat.channelExistsByHash.restore()
  Channel.createAsync.restore()
  chat.createSubscriptions.restore()
})

test.serial('Chat.createChannel should return an existing channel', async (t) => {
  const createdAt = new Date().toISOString()
  const chat = new Chat({ userId: 'gabe' })
  const users = ['beyonce', 'gabe']
  const channelId = 'thisisanid'
  const type = 'd'
  const channel = {
    attrs: {
      type,
      users,
      channelId,
      createdAt,
      usersHash: 'thisisafakesha1hash'
    }
  }

  // Stub instance methods.
  sinon.stub(Chat, 'channelExistsByHash').returns(channel.attrs)
  const result = await chat.createChannel({ type, users })

    // Assert and restore
  t.deepEqual(result, {
    ...channel.attrs
  })
  Chat.channelExistsByHash.restore()
})

test.serial('Chat.sendInput should throw an authorization error', async (t) => {
  const input = {
    bypassQueue: false,
    createdAt: new Date().toISOString(),
    id: 'thisisafakeid',
    channelId: 'abc123',
    message: {
      channelId: 'abc123',
      senderId: 'gabe',
      text: 'Hi.'
    }
  }

  // Stub a dub dub
  sinon.stub(Subscription, 'getAsync').returns(null)

  // Assert and restore
  const chat = new Chat({ userId: 'gabe' })
  const error = await t.throws(chat.sendInput({ input }))
  t.is(error.message, 'Authorization failed.')
  Subscription.getAsync.restore()
})

test.serial("Chat.sendInput should not persist a message and should publish directly to the channel's channel",
async (t) => {
  const input = {
    bypassQueue: true,
    createdAt: new Date().toISOString(),
    id: 'thisisafakeid',
    channelId: 'abc123'
  }

  // Let's chat
  const chat = new Chat({ userId: 'gabe' })

  // i-Spy
  const spy = sinon.spy(Chat, 'publish')
  spy.returnValues = [
    true
  ]

  // Assert falsy because message = null
  const result = await chat.sendInput({ input })
  t.falsy(result)
  Chat.publish.restore()
})

test.serial('Chat.sendInput should persist the message and create a job to process it', async (t) => {
  const subscription = {
    channelId: 'abc123',
    userId: 'gabe'
  }
  const input = {
    bypassQueue: false,
    createdAt: new Date().toISOString(),
    id: 'thisisafakeid',
    channelId: 'abc123',
    message: {
      channelId: 'abc123',
      senderId: 'gabe',
      text: 'Hi.'
    }
  }
  const persistedMessage = {
    ...input,
    id: 'fakemessageid',
    timestamp: '126234324.1243'
  }

  // Stubzzz
  sinon.stub(Subscription, 'getAsync').returns(subscription)
  sinon.stub(Message, 'createAsync').returns({ attrs: persistedMessage })
  sinon.stub(Chat, 'createJob')

  // Assert and restore, bro.
  const chat = new Chat({ userId: 'gabe' })
  const result = await chat.sendInput({ input })
  t.deepEqual(result, persistedMessage)

  Subscription.getAsync.restore()
  Message.createAsync.restore()
  Chat.createJob.restore()
})

test.serial('Chat.updateMessage should throw errors', async (t) => {
  const chat = new Chat({ userId: 'gabe' })
  t.throws(chat.updateMessage({ channelId: 'abc123' }))
  t.throws(chat.updateMessage({ timestamp: '242323423.1233' }))
})

test.serial('Chat.updateMessage should call updateAsync and publishMessage methods', async (t) => {
  const channelId = 'abc123'
  const timestamp = '12345.123'
  const text = 'This is an update.'
  const attrs = {
    channelId,
    timestamp,
    text
  }

  // Stubzzz
  sinon.stub(Message, 'updateAsync').returns({ attrs })
  sinon.stub(Chat, 'publishMessages')

  // Assert and restore, bro.
  const chat = new Chat({ userId: 'gabe' })
  const result = await chat.updateMessage(attrs)
  t.deepEqual(result, attrs)

  Message.updateAsync.restore()
  Chat.publishMessages.restore()
})

test.serial('Chat.postback should create a new chat.postback job', async (t) => {
  const postback = {
    id: 'thisisapostback'
  }

  // Spy
  const spy = sinon.spy(Chat, 'createJob')
  spy.returnValues = [
    true
  ]

  // Assert and restore
  await Chat.postback({ postback })
  t.true(spy.calledWith('chat.postback', postback))
  Chat.createJob.restore()
})

test.serial('Chat.getChannelById should return a channel', async (t) => {
  const userId = 'gabe'
  const channelId = 'channelId'
  const createdAt = new Date().toISOString()
  const subscription = {
    channelId,
    userId,
    createdAt
  }
  const channel = {
    userId,
    createdAt,
    id: channelId,
    users: [userId]
  }

  // Stub shit.
  sinon.stub(Subscription, 'getAsync').returns({ attrs: subscription })
  sinon.stub(Channel, 'getAsync').returns({ attrs: channel })

  // Assert and restore.
  const chat = new Chat({ userId })
  const result = await chat.getChannelById({ channelId })
  t.deepEqual(result, {
    ...subscription,
    ...channel
  })
  Subscription.getAsync.restore()
  Channel.getAsync.restore()
})

test.serial('Chat.getChannelById should throw an authorization error', async (t) => {
  const userId = 'gabe'
  const channelId = 'channelId'

  // Stub shit.
  sinon.stub(Subscription, 'getAsync').returns(null)

  // Assert and restore.
  const chat = new Chat({ userId })
  const error = await t.throws(chat.getChannelById({ channelId }))
  t.is(error.message, 'Authorization failed.')
})

test.serial('Chat.getChannels should return an array of channels', async (t) => {
  const subscriptions = [
    { attrs: { channelId: 'abc123', userId: 'gabe' } },
    { attrs: { channelId: 'def456', userId: 'beyonce' } }
  ]
  const channels = [
    { attrs: { id: 'abc123', users: ['gabe'] } },
    { attrs: { id: 'def456', users: ['beyonce'] } }
  ]

  // Stub stub stub
  const mockSub = {
    execAsync: () => ({ Items: subscriptions })
  }
  sinon.stub(Subscription, 'query').returns(mockSub)
  sinon.stub(Channel, 'getItemsAsync').returns(channels)

  // A&R = Assert and Restore
  const chat = new Chat({ userId: 'gabe' })
  const result = await chat.getChannels()
  t.deepEqual(result, channels.map(c => c.attrs))
  Subscription.query.restore()
  Channel.getItemsAsync.restore()
})

test.serial('Chat.getMessagesByChannelId should throw a missing arguments error',
async (t) => {
  await t.throws(Chat.getMessagesByChannelId({ channelId: 'abc123' }))
  await t.throws(Chat.getMessagesByChannelId({ limit: 25 }))
})

test.serial('Chat.getAssistantChannel should return an assistant channel', async (t) => {
  const chat = new Chat({ userId: 'gabe' })
  const channel = {
    type: 'a',
    name: 'assistant',
    users: ['gabe']
  }

  // Spy createChannel
  sinon.stub(chat, 'createChannel').returns(channel)

  // Assert and restore
  const result = await chat.getAssistantChannel()
  t.deepEqual(result, channel)
  chat.createChannel.restore()
})
