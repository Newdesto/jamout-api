import test from 'ava'
import sinon from 'sinon'
import request from 'request'
import { textRequest, eventRequest } from '../apiai.js'

const queryResponse = {
  "id": "9ef3fcd6-23aa-4923-9f52-2e07e190ef44",
  "timestamp": "2017-01-20T00:37:29.468Z",
  "result": {
    "source": "domains",
    "resolvedQuery": "Hello.",
    "action": "smalltalk.greetings",
    "parameters": {
      "simplified": "hello"
    },
    "metadata": {},
    "fulfillment": {
      "speech": "Good to see you!"
    },
    "score": 1
  },
  "status": {
    "code": 200,
    "errorType": "success"
  },
  "sessionId": "fea6a2a9-e8c5-4a50-b378-fd8361e63527"
}
const badRequest = {
  "status": {
    "code": 400,
    "errorType": "bad_request",
    "errorDetails": "Json request query property is missing"
  }
}
const eventResponse = {
  "id": "a3a27316-572a-443f-bdb9-ca65dd2325d6",
  "timestamp": "2016-12-01T19:46:07.379Z",
  "result": {
    "source": "agent",
    "resolvedQuery": "custom_event",
    "action": "welcome",
    "actionIncomplete": false,
    "parameters": {
      "user_name": "Sam"
    },
    "contexts": [
      {
        "name": "custom_event",
        "parameters": {
          "user_name": "Sam",
          "name": "Sam",
          "user_name.original": ""
        },
        "lifespan": 0
      }
    ],
    "metadata": {
      "intentId": "ade506c7-851b-4f62-ba85-2f33023d079a",
      "webhookUsed": "false",
      "webhookForSlotFillingUsed": "false",
      "intentName": "Custom welcome intent"
    },
    "fulfillment": {
      "speech": "Welcome, Sam!",
      "messages": [
        {
          "type": 0,
          "speech": "Welcome, Sam!"
        }
      ]
    },
    "score": 1.0
  },
  "status": {
    "code": 200,
    "errorType": "success"
  },
  "sessionId": "1321321"
}

test.afterEach(t => {
  request.post.restore()
})

test.serial("textRequest should return API.ai's response body", async (t) => {
  sinon
  .stub(request, 'post')
  .yields(null, null, JSON.stringify(queryResponse))

  const response = await textRequest('Hello.', {
    sessionId: 'fea6a2a9-e8c5-4a50-b378-fd8361e63527'
  })

  t.deepEqual(response, queryResponse)
})

test.serial("textRequest should throw an error with a bad request message", async (t) => {
  sinon
  .stub(request, 'post')
  .yields(null, null, JSON.stringify(badRequest))

  const error = await t.throws(textRequest('Hello.', {
    sessionId: 'fea6a2a9-e8c5-4a50-b378-fd8361e63527'
  }))

  t.is(error.message, 'Json request query property is missing')
})

test.serial("eventRequest should return API.ai's response body", async (t) => {
  sinon
  .stub(request, 'post')
  .yields(null, null, JSON.stringify(eventResponse))

  const response = await eventRequest({
    name: 'custom_event',
    data: {
      name: 'Sam'
    }
  }, {
    sessionId: '1321321'
  })

  t.deepEqual(response, eventResponse)
})

test.serial("eventRequest should throw an error with a bad request message", async (t) => {
  sinon
  .stub(request, 'post')
  .yields(null, null, JSON.stringify(badRequest))

  const error = await t.throws(eventRequest({
    name: 'custom_event',
    data: {
      name: 'Sam'
    }
  }, {
    sessionId: '1321321'
  }))

  t.is(error.message, 'Json request query property is missing')
})
