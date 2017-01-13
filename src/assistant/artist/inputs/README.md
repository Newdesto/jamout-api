# Artist Assistant inputs

Any time an `assistantInput` mutation is called it gets routed to the proper
handlers, which are kept in this folder. `index.js` holds the "master" switch
and passes the mutation input to the proper handler. Before the switch is
triggered we persist an `assistant.message` object if the input has the
proper arguments.

When a handler receives an input it has full control of the logic, besides
the persistence of the `assistant.message` object. Most input handlers will
need to query API.ai, but some won't. 
