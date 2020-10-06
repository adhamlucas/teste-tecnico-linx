const Redis = require('redis');
const Bluebird = require('bluebird');
const constants = require('../utils/constants');

Bluebird.promisifyAll(Redis.RedisClient.prototype);
Bluebird.promisifyAll(Redis.Multi.prototype);

const redis = Redis.createClient();

redis.on('error', (error) => {
  console.error(error);
});

redis.on('connect', () => {
  console.log('connected');
});

function setWithExpire(key, value, expireTime = constants.REDIS_CACHE_EXPIRE_TIME) {
  if (value === null) return;
  if (typeof value !== 'string') value = JSON.stringify(value);

  redis.set(key, value);
  redis.expire(key, expireTime);
}

module.exports = {
  redis,
  setWithExpire,
};