import test from 'ava'
import AssistantEvent from '../AssistantEvent'

test('Resolves AssistantEvent type to be AssistantTyping from typing events.', t => {
  const typingStart = AssistantEvent.__resolveType({ type: 'typing.start' })
  const typingStop = AssistantEvent.__resolveType({ type: 'typing.stop' })

  t.is(typingStart, 'AssistantTyping')
  t.is(typingStop, 'AssistantTyping')
})

test('Resolves AssistantEvent type to be AssistantMessage from message events.', t => {
  const textMessage = AssistantEvent.__resolveType({ type: 'message.text' })
  const cardMessage = AssistantEvent.__resolveType({ type: 'message.card' })

  t.is(textMessage, 'AssistantMessage')
  t.is(cardMessage, 'AssistantMessage')
})

test('Resolves AssistantEvent type to be AssistantInput from input events.', t => {
  const input = AssistantEvent.__resolveType({ type: 'input' })

  t.is(input, 'AssistantInput')
})
