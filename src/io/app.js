/**
 * Creates the Express http server and
 * initializes middleware
 */

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'

const app = express()

// setup middleware, woo!
app.use(bodyParser.json())
app.use(helmet())
app.use(cors())

// generic health check route
app.get('/check', (req, res) => res.sendStatus(200))

export default app
