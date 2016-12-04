import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'express-jwt'
import cors from 'cors'
import helmet from 'helmet'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import schema from './graphql/schema'
import Channel from './models/Channel'
import Message from './models/Message'
import Release from './models/Release'
import User, { UserLoader } from './models/User'
import Profile, { ProfileLoader } from './models/Profile'
import { formatError } from 'apollo-errors'

// setup the env and app instance
const secret = process.env.JWT_SECRET
const app = express()

// setup middleware, woo!
app.use(bodyParser.json())
app.use(helmet())
app.use(cors())
app.use(jwt({ secret, credentialsRequired: false }))

// generic health check route
app.get('/check', (req, res) => res.sendStatus(200))

// graphql endpoint
app.use('/graphql', graphqlExpress(req => {
  const user = req.user
  const profileLoader = new ProfileLoader({ userId: user && user.id })
  const userLoader = new UserLoader({ userId: user && user.id })
  return {
    schema,
    context: {
      user,
      Profile: new Profile({ loader: profileLoader }),
      Channel: new Channel(),
      Message: new Message(),
      Release: new Release(),
      User: new User({ loader: userLoader })
    },
    formatError
  }
}))

// graphiql endpoint
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}))

app.listen(3000)
