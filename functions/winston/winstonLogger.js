const winston = require('winston');

const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = 'YYYY-MM-DD HH:mm:ss';

const logger = winston.createLogger({
    format: combine(
        timestamp({ format: timestampFormat }),
        json(),
        printf(({ timestamp, level, message, ...data }) => {
          const response = {
            level,
            timestamp,
            message,
            data,
          };
    
          return JSON.stringify(response);
        })
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
      new winston.transports.Console()
    ],
});


module.exports = logger;