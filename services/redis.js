const redis = require('redis');

let redisClient;

const RedisClient = () => {
    if (!redisClient) {
        redisClient = redis.createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
        });

        redisClient.on('connect', () => {
            console.log(`Connected on Redis on PORT: ${process.env.REDIS_PORT}`);
        });
        redisClient.on('error', (err) => {
            console.error(`Redis connection error: ${err}`);
        });
        redisClient.connect().catch((err) => {
            console.error(`Error connecting to Redis: ${err}`);
        });

        console.log("CLIENTTTT>>>>", redisClient)
    }

    return redisClient;
};

module.exports = {RedisClient};