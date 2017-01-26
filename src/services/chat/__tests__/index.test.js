import test from 'ava'
import sinon from 'sinon'
import Chat from '../index'
import Channel from '../channel'

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
