import Redis from "ioredis"

const RedisClient = Redis as unknown as typeof import("ioredis").default
//instance of redis client
const redis = new RedisClient(process.env.REDIS_URL!)

export default redis
