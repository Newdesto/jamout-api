import test from 'ava'
import sinon from 'sinon'
import Chat from '../index'

test('Chat class should set the userId property', t => {
  const userId = 'gabe'
  const chat = new Chat({
    userId
  })
  t.is(chat.userId, userId)
})
