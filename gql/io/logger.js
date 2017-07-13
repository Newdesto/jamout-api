/**
 * A logger on steroids used throughout the API. We use a winston instead
 * of the generic console.log for a few reasons. First, we can define the
 * level when logging something (debug, info, error, warn) and we can
 * configure which level of logging we want to see. In production we may
 * only want info level logs, but in development we may want debug level logs.
 * Second, winston allows us to send our logs elsewhere like a local file
 * or a separate service. Lastly, winston prints pretty colors. 😀
 */
import winston from 'winston'

const logger = new (winston.Logger)({
  transports: [
    // Colorize the output to the console.
    new (winston.transports.Console)({ colorize: true })
  ]
})

// If we're in not in production enable debug logs.
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug'
}

export default logger
