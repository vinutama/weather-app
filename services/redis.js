const redis = require('redis');

let redisClient;

const getRedisClient = async () => {
    if (!redisClient) {
        redisClient = await redis.createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
        });

        /* istanbul ignore next */
        redisClient.on('connect', () => {
            console.log(`Connected on Redis on PORT: ${process.env.REDIS_PORT}`);
        });
        /* istanbul ignore next */
        redisClient.on('error', (err) => {
            console.error(`Redis connection error: ${err}`);
        });
        await redisClient.connect();

    }

    return redisClient;
};

module.exports = {getRedisClient};