import winston from 'winston'

// here is also where we would asynchronously stream logs to a datastore
// or save them to a file

const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({ colorize: true })
  ]
})

export default logger
