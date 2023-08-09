import Redis from "ioredis"

const redisClient = new Redis("redis://default:7858b87801974813af6fc166d3eec502@us1-profound-elephant-38437.upstash.io:38437");
export default redisClient