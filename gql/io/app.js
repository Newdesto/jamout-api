/**
 * The App IO module creates an express (expressjs.com)  application,
 * registers any trivial middleware such as CORs support,
 * creates general health route (/check) and exports it.
 * The module does NOT listen to any ports.
 */

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'

// Create the Express application.
const app = express()

// Setup some middleware.
app.use(bodyParser.json())
app.use(helmet())
app.use(cors())

// Mount a generic health check route.
app.get('/check', (req, res) => res.sendStatus(200))

export default app
