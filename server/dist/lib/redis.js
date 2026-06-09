import Redis from "ioredis";
const RedisClient = Redis;
//instance of redis client
const redis = new RedisClient(process.env.REDIS_URL);
export default redis;
