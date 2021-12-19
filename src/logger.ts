import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.prettyPrint()
      ),
      silent: process.argv.indexOf('--silent') >= 0
    })
  ]
});

export default logger;