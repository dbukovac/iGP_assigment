const Redis = require('ioredis');
const config = require('config');

const redisConfig = {
  port: 6379,
  host: config.get("REDISCONNECTION"),
  maxRetriesPerRequest: null,
};

const redisConnection = new Redis(redisConfig);

module.exports = redisConnection;