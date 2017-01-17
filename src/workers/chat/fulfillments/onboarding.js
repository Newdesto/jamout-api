
/**
 * [onboarding description]
 * @param  {ChatInput} input    ChatInput
 * @param  {Object} result   API.ai result.
 * @param {Array}   messages Jamout formatted (non-persisted, non-published) messages.
 * @return {Array}           Persisted messages.
 */
const onboarding = function onboarding(input, result, messages) {
  switch (result.action) {
    default:
      throw new Error(`Unrecognized or misrouted actions: ${result.action}`)
  }
}

export default onboarding
