# Chat inputs

Any time an `sendInput` mutation is called it gets routed to the proper
handlers, which are kept in this folder. `index.js` holds the "master" switch
and passes the mutation input to the proper handler. Before the switch is
triggered we persist an `chat.message` object if the input has the
proper arguments and we also check the type of channel it's for.
