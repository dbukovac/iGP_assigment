const Redis = require('ioredis');

const redisConfig = {
  port: 6379,
  host: process.env.REDISCONNECTION,
  maxRetriesPerRequest: null,
};

const redisConnection = new Redis(redisConfig);

module.exports = redisConnection;